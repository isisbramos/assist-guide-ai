export type Persona = 'Bruno' | 'Ana' | 'Paulo';
export type PersonaRole = 'Member' | 'Admin' | 'Owner';
export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
export type MessageType = 'user' | 'bot' | 'system';
export type ActiveView = 'platform' | 'admin';
export type PlatformSection = 'campanhas' | 'automacoes' | 'billing' | 'seguranca';

export interface PersonaConfig {
  name: Persona;
  role: PersonaRole;
  color: string;
  badgeClass: string;
}

export const PERSONAS: PersonaConfig[] = [
  { name: 'Bruno', role: 'Member', color: 'hsl(var(--risk-medium))', badgeClass: 'bg-[hsl(var(--risk-medium-bg))] text-[hsl(var(--risk-medium))]' },
  { name: 'Ana', role: 'Admin', color: 'hsl(var(--brand-light))', badgeClass: 'bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand))]' },
  { name: 'Paulo', role: 'Owner', color: 'hsl(var(--risk-low))', badgeClass: 'bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))]' },
];

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  extra?: MessageExtra;
}

export interface MessageExtra {
  kind: 'automation' | 'billing-blocked' | 'billing-allowed' | 'apikey-blocked' | 'apikey-owner' | 'typing' | 'system-pill';
  pill?: string;
  pillVariant?: 'gate' | 'judge' | 'search';
  feedbackShown?: boolean;
  feedbackGiven?: boolean | null;
}

export interface SessionRow {
  id: string;
  user: string;
  intent: string;
  risk: RiskLevel;
  status: string;
  action: string;
  question: string;
  response: string;
  sources: string[];
  accessGate: string;
  judgeDecision: string;
  feedback: string | null;
  ticketId?: string;
  sla?: string;
}
