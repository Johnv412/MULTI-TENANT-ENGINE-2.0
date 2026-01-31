
import React, { useState } from 'react';
import { useLiveConciergeEngine } from '../hooks/useLiveConciergeEngine';
import { AgentConfig, Theme } from '../types';
import { DEFAULT_AGENT_CONFIG } from '../constants';

interface ConciergeWidgetProps {
  config?: AgentConfig;
  theme?: Theme;
}

const ConciergeWidget: React.FC<ConciergeWidgetProps> = ({ 
  config = DEFAULT_AGENT_CONFIG, 
  theme = 'light' 
}) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const isDark = theme === 'dark';

  const engine = useLiveConciergeEngine(config, {
    onLeadCaptured: (lead) => console.log('SaaS Event: Lead Captured', lead),
    onBookRequested: (details) => console.log('SaaS Event: Booking Requested', details),
    onHandoffRequested: () => console.log('SaaS Event: Handoff Requested'),
    onError: (err) => alert(`Engine Error: ${err}`)
  });

  const toggleWidget = () => {
    if (engine.status !== 'idle') {
      engine.stopSession();
    }
    setIsFabOpen(!isFabOpen);
  };

  const activeUI = () => {
    if (engine.mode === 'none') {
      return (
        <div className="p-6">
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How can we help?
          </h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select your preferred way to connect with {config.businessName}.
          </p>
          <div className="space-y-3">
            <button
              onClick={engine.startVoiceSession}
              className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all hover:border-indigo-500 group ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 transition-colors">
                <svg className="w-5 h-5 text-indigo-600 group-hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Voice Concierge</p>
                <p className="text-xs text-slate-500">Natural voice conversation</p>
              </div>
            </button>

            <button
              onClick={engine.startTextSession}
              className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all hover:border-indigo-500 group ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 transition-colors">
                <svg className="w-5 h-5 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Private Message</p>
                <p className="text-xs text-slate-500">Secure text-based chat</p>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (engine.mode === 'voice') {
      return (
        <div className="p-8 flex flex-col items-center">
          <div className="mb-6 text-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
              Voice Mode Active
            </span>
          </div>

          <div className="relative mb-12 flex items-center justify-center">
             <div className={`absolute inset-0 rounded-full bg-indigo-500/20 transition-all duration-700 blur-2xl ${engine.isSpeaking ? 'scale-150 opacity-100' : 'scale-75 opacity-0'}`} />
             <div className={`w-24 h-24 border-4 rounded-full flex items-center justify-center transition-all ${engine.isSpeaking ? 'border-indigo-500 scale-110 shadow-lg' : 'border-slate-200 opacity-50'}`}>
                {engine.isSpeaking ? (
                   <div className="flex gap-1">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="w-1 h-6 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                     ))}
                   </div>
                ) : (
                  <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
             </div>
          </div>

          <p className="text-sm font-medium text-slate-500 mb-8">
            {engine.status === 'connecting' ? 'Establishing secure line...' : engine.isSpeaking ? 'Concierge is speaking...' : 'Listening to you...'}
          </p>

          <button
            onClick={engine.stopSession}
            className="w-full py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
          >
            End Conversation
          </button>
        </div>
      );
    }

    if (engine.mode === 'text') {
      return (
        <div className="flex flex-col h-[500px]">
          <div className="p-4 border-b shrink-0 flex items-center justify-between">
            <h4 className="font-bold text-slate-800">Concierge Chat</h4>
            <button onClick={engine.stopSession} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {engine.chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {engine.isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-400 px-4 py-2 rounded-2xl text-xs animate-pulse">Typing...</div>
              </div>
            )}
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).message.value;
              if (input) {
                engine.sendTextMessage(input);
                (e.target as any).reset();
              }
            }}
            className="p-4 border-t bg-slate-50"
          >
            <div className="relative">
              <input
                name="message"
                type="text"
                placeholder="How can we help?"
                className="w-full py-3 px-4 pr-12 rounded-full border border-slate-200 outline-none focus:border-indigo-500 transition-all text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isFabOpen && (
        <div className={`w-[350px] max-w-[90vw] rounded-3xl shadow-2xl overflow-hidden border animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          isDark ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'
        }`}>
          {activeUI()}
          {config.disclaimer && (
            <div className="p-3 bg-slate-50/50 border-t text-[10px] text-center text-slate-400 italic">
              {config.disclaimer}
            </div>
          )}
        </div>
      )}

      <button
        onClick={toggleWidget}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
          isFabOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-indigo-600 hover:scale-110 active:scale-95'
        }`}
      >
        {isFabOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ConciergeWidget;
