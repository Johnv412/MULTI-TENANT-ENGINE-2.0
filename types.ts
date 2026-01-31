
export type Theme = 'light' | 'dark';

export type ConciergeStatus = 'idle' | 'connecting' | 'active' | 'error';
export type ConciergeMode = 'none' | 'voice' | 'text';

export interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  intent?: string;
  timeline?: string;
  budget?: string;
}

export interface AgentConfig {
  businessName: string;
  businessType?: string;
  primaryGoal: string;
  tone: string;
  qualificationQuestions: string[];
  handoffCTA: string;
  voiceName: 'Kore' | 'Puck' | 'Charon' | 'Zephyr' | 'Fenrir';
  disclaimer?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ConciergeEvents {
  onLeadCaptured?: (lead: LeadData) => void;
  onBookRequested?: (details: any) => void;
  onHandoffRequested?: () => void;
  onError?: (error: string) => void;
}

export interface EngineState {
  status: ConciergeStatus;
  mode: ConciergeMode;
  isSpeaking: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
}
