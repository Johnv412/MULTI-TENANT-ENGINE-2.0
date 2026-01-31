
import { useState, useRef, useCallback, useEffect } from 'react';
import { Modality } from '@google/genai';
import { getGeminiClient, sendChatMessage } from '../services/geminiService';
import { 
  AgentConfig, 
  ConciergeStatus, 
  ConciergeMode, 
  ChatMessage, 
  ConciergeEvents 
} from '../types';
import { createSystemInstruction } from '../constants';

// Audio Utility Helpers (Manual implementation as per guidelines)
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const useLiveConciergeEngine = (config: AgentConfig, events?: ConciergeEvents) => {
  const [status, setStatus] = useState<ConciergeStatus>('idle');
  const [mode, setMode] = useState<ConciergeMode>('none');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Refs for session management
  const sessionRef = useRef<any>(null);
  const audioContextIn = useRef<AudioContext | null>(null);
  const audioContextOut = useRef<AudioContext | null>(null);
  const nextStartTime = useRef<number>(0);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const systemInstruction = createSystemInstruction(config);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sources.current.forEach(s => s.stop());
    sources.current.clear();
    
    if (audioContextIn.current) audioContextIn.current.close();
    if (audioContextOut.current) audioContextOut.current.close();
    
    audioContextIn.current = null;
    audioContextOut.current = null;
    nextStartTime.current = 0;
    
    setStatus('idle');
    setMode('none');
    setIsSpeaking(false);
    setChatMessages([]);
  }, []);

  const startVoiceSession = useCallback(async () => {
    setStatus('connecting');
    setMode('voice');
    
    try {
      const ai = getGeminiClient();
      audioContextIn.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOut.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voiceName } },
          },
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setStatus('active');
            const source = audioContextIn.current!.createMediaStreamSource(stream);
            const processor = audioContextIn.current!.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(audioContextIn.current!.destination);
          },
          onmessage: async (msg) => {
            const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioBase64) {
              setIsSpeaking(true);
              const buffer = await decodeAudioData(
                decode(audioBase64),
                audioContextOut.current!,
                24000,
                1
              );

              const source = audioContextOut.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextOut.current!.destination);

              nextStartTime.current = Math.max(nextStartTime.current, audioContextOut.current!.currentTime);
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;

              sources.current.add(source);
              source.onended = () => {
                sources.current.delete(source);
                if (sources.current.size === 0) setIsSpeaking(false);
              };
            }

            if (msg.serverContent?.interrupted) {
              sources.current.forEach(s => s.stop());
              sources.current.clear();
              nextStartTime.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Engine Error:', e);
            events?.onError?.(e.message);
            stopSession();
          },
          onclose: () => stopSession()
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error('Failed to start engine:', err);
      setStatus('error');
      events?.onError?.(err.message);
    }
  }, [config.voiceName, config.handoffCTA, events, stopSession, systemInstruction]);

  const startTextSession = useCallback(() => {
    setMode('text');
    setStatus('active');
    setChatMessages([
      { role: 'assistant', text: `Hello! I'm the concierge for ${config.businessName}. How can I assist you today?` }
    ]);
  }, [config.businessName]);

  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    setChatMessages(prev => [...prev, { role: 'user', text }]);
    setIsChatLoading(true);

    try {
      const history = chatMessages.map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        parts: [{ text: m.text }] 
      }));
      
      const response = await sendChatMessage(history, text, systemInstruction);
      setChatMessages(prev => [...prev, { role: 'assistant', text: response || 'I apologize, I could not process that.' }]);
      
      // Placeholder Lead Detection Logic
      // In a real SaaS, the model would call a function 'capture_lead'
      if (text.toLowerCase().includes('@') || (/\d{7,}/.test(text))) {
        events?.onLeadCaptured?.({ intent: 'potential_contact_found' });
      }
    } catch (err: any) {
      console.error("Text Session Error:", err);
      events?.onError?.(err.message);
    } finally {
      setIsChatLoading(false);
    }
  }, [chatMessages, isChatLoading, systemInstruction, events]);

  return {
    status,
    mode,
    isSpeaking,
    chatMessages,
    isChatLoading,
    startVoiceSession,
    startTextSession,
    stopSession,
    sendTextMessage
  };
};
