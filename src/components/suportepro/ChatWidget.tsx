import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, X, Send, CheckCircle, XCircle, AlertTriangle, Shield,
  BookOpen, ChevronRight, BarChart2, Ticket, Clock, ChevronDown, FileText,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Persona, ChatMessage, RiskLevel } from './types';

interface ChatWidgetProps {
  persona: Persona;
  onNavigate: (section: string) => void;
}

type RiskState = { level: RiskLevel; label: string; class: string };

const RISK_STYLES: Record<RiskLevel, RiskState> = {
  'Baixo': { level: 'Baixo', label: 'Risco Baixo', class: 'bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))] border-[hsl(var(--risk-low))]' },
  'Médio': { level: 'Médio', label: 'Risco Médio', class: 'bg-[hsl(var(--risk-medium-bg))] text-[hsl(var(--risk-medium))] border-[hsl(var(--risk-medium))]' },
  'Alto': { level: 'Alto', label: 'Risco Alto', class: 'bg-[hsl(var(--risk-high-bg))] text-[hsl(var(--risk-high))] border-[hsl(var(--risk-high))]' },
  'Crítico': { level: 'Crítico', label: 'Risco Crítico', class: 'bg-[hsl(var(--risk-critical-bg))] text-[hsl(var(--risk-critical))] border-[hsl(var(--risk-critical))]' },
};

const BILLING_CHART = [
  { month: 'Out', value: 3200 },
  { month: 'Nov', value: 4100 },
  { month: 'Dez', value: 3800 },
  { month: 'Jan', value: 4600 },
  { month: 'Fev', value: 4500 },
];

const TICKET_TIMELINE = [
  { step: 'Criado', time: 'Agora', done: true },
  { step: 'Em triagem', time: '~15 min', done: false },
  { step: 'Em atendimento', time: '~2h', done: false },
  { step: 'Resolvido', time: 'SLA: 4h', done: false },
];

function TypingIndicator({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[hsl(var(--brand-light))] rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-[hsl(var(--brand-light))] rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-[hsl(var(--brand-light))] rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs">{text}</span>
    </div>
  );
}

function BillingChart() {
  const max = Math.max(...BILLING_CHART.map(d => d.value));
  return (
    <div className="mt-3 p-3 bg-[hsl(var(--brand-muted))] rounded-lg">
      <p className="text-xs font-semibold text-[hsl(var(--brand))] mb-2 flex items-center gap-1">
        <BarChart2 className="h-3 w-3" /> Custos dos últimos 5 meses (USD)
      </p>
      <div className="flex items-end gap-2 h-16">
        {BILLING_CHART.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[9px] text-[hsl(var(--brand))] font-medium">${(d.value / 1000).toFixed(1)}k</span>
            <div
              className="w-full bg-[hsl(var(--brand-light))] rounded-sm opacity-80"
              style={{ height: `${(d.value / max) * 40}px` }}
            />
            <span className="text-[9px] text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfettiCheck() {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="relative">
        <CheckCircle className="h-10 w-10 text-[hsl(var(--risk-low))] animate-in zoom-in-50 duration-500" />
        <span className="absolute -top-2 -right-2 text-lg animate-bounce">🎉</span>
      </div>
      <p className="text-sm font-medium text-[hsl(var(--risk-low))]">Ótimo! Problema resolvido.</p>
    </div>
  );
}

interface TicketDetailsFormProps {
  onSave: () => void;
}
function TicketDetailsForm({ onSave }: TicketDetailsFormProps) {
  const [impact, setImpact] = useState('Médio');
  const [urgency, setUrgency] = useState('Normal');
  const [desc, setDesc] = useState('');
  return (
    <div className="mt-3 p-3 bg-background border rounded-xl space-y-2 animate-in fade-in-0 duration-200">
      <p className="text-xs font-semibold text-foreground">Adicionar detalhes ao ticket</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground">Impacto</label>
          <select
            value={impact}
            onChange={e => setImpact(e.target.value)}
            className="w-full text-xs border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))] mt-0.5"
          >
            {['Baixo', 'Médio', 'Alto'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Urgência</label>
          <select
            value={urgency}
            onChange={e => setUrgency(e.target.value)}
            className="w-full text-xs border rounded-md px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))] mt-0.5"
          >
            {['Baixa', 'Normal', 'Alta', 'Crítica'].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-[10px] text-muted-foreground">Descrição adicional</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          placeholder="Descreva o problema com mais detalhes…"
          className="w-full text-xs border rounded-md px-2 py-1.5 bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-[hsl(var(--brand))] mt-0.5"
        />
      </div>
      <Button size="sm" className="w-full h-7 text-xs bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-dark))] text-[hsl(var(--brand-foreground))]" onClick={onSave}>
        Salvar detalhes
      </Button>
    </div>
  );
}

interface TicketTimelineModalProps {
  onClose: () => void;
}
function TicketTimelineModal({ onClose }: TicketTimelineModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-2xl border p-6 w-80 animate-in zoom-in-90 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[hsl(var(--brand-muted))] rounded-lg">
              <Ticket className="h-4 w-4 text-[hsl(var(--brand))]" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Ticket SUP-1042</h3>
              <p className="text-xs text-muted-foreground">SLA estimado: 4h</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {TICKET_TIMELINE.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  item.done
                    ? 'bg-[hsl(var(--brand))] border-[hsl(var(--brand))]'
                    : 'bg-background border-muted-foreground/30'
                }`}>
                  {item.done && <CheckCircle className="h-3 w-3 text-[hsl(var(--brand-foreground))]" />}
                </div>
                {i < TICKET_TIMELINE.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${item.done ? 'bg-[hsl(var(--brand))]' : 'bg-muted-foreground/20'}`} />
                )}
              </div>
              <div className="pb-2">
                <p className={`text-sm font-medium ${item.done ? 'text-foreground' : 'text-muted-foreground'}`}>{item.step}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" /> {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget({ persona, onNavigate }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      type: 'bot',
      content: 'Olá! Sou o Assistente SuportePro. Como posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [risk, setRisk] = useState<RiskLevel>('Baixo');
  const [typing, setTyping] = useState<string | null>(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [ticketTimelineOpen, setTicketTimelineOpen] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { ...msg, id, timestamp: new Date() }]);
    return id;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    addMessage({ type: 'user', content: text });

    const lower = text.toLowerCase();
    const isAutomation = lower.includes('automação') || lower.includes('automacao') || lower.includes('criar auto');
    const isBilling = lower.includes('faturas') || lower.includes('billing') || lower.includes('fatura') || lower.includes('custo');
    const isApiKey = lower.includes('api key') || lower.includes('apikey') || lower.includes('chave') || lower.includes('api');
    const isFallback = lower.includes('não dispara') || lower.includes('nao dispara') || lower.includes('erro 502') || lower.includes('automação não') || lower.includes('automacao nao');

    if (isApiKey && !isAutomation) {
      setRisk('Crítico');
      setTyping('Analisando segurança (Judge)…');
      await delay(1200);
      setTyping(null);
      if (persona === 'Paulo') {
        addMessage({
          type: 'bot',
          content: 'Como Owner, você pode gerenciar suas API Keys na seção de Segurança. Por questões de segurança, nunca exibimos chaves diretamente no chat.',
          extra: { kind: 'apikey-owner', pill: 'Policy check: Sensitive data', pillVariant: 'judge' },
        });
      } else {
        addMessage({
          type: 'bot',
          content: 'Essa solicitação foi bloqueada por política de segurança. API Keys são dados sensíveis e não podem ser exibidos via chat.',
          extra: { kind: 'apikey-blocked', pill: 'Policy check: Sensitive data', pillVariant: 'judge' },
        });
      }
    } else if (isBilling) {
      setRisk('Alto');
      setTyping('Validando permissões…');
      await delay(1000);
      setTyping(null);
      if (persona === 'Bruno') {
        addMessage({
          type: 'bot',
          content: 'Você não tem permissão para acessar dados de faturamento. Apenas Admins e Owners podem visualizar faturas.',
          extra: { kind: 'billing-blocked', pill: 'Access Gate: Billing', pillVariant: 'gate' },
        });
      } else {
        addMessage({
          type: 'bot',
          content: 'Aqui está o resumo financeiro de fevereiro 2026:',
          extra: { kind: 'billing-allowed', pill: 'Access Gate: Billing', pillVariant: 'gate' },
        });
      }
    } else if (isFallback) {
      setRisk('Médio');
      setTyping('Buscando na base de conhecimento…');
      await delay(1000);
      setTyping(null);
      addMessage({
        type: 'bot',
        content: '',
        extra: { kind: 'fallback' as any, pill: 'Confidence: Baixa', pillVariant: 'search' },
      });
    } else if (isAutomation) {
      setRisk('Baixo');
      setTyping('Buscando na base de conhecimento…');
      await delay(1000);
      setTyping(null);
      addMessage({
        type: 'bot',
        content: 'Encontrei as instruções para criar uma automação:',
        extra: { kind: 'automation', feedbackShown: true, feedbackGiven: null },
      });
    } else {
      setRisk('Baixo');
      setTyping('Processando sua mensagem…');
      await delay(800);
      setTyping(null);
      addMessage({
        type: 'bot',
        content: '',
        extra: { kind: 'generic-fallback' as any },
      });
    }
  };

  const handleFeedback = (msgId: string, positive: boolean) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId && m.extra ? { ...m, extra: { ...m.extra, feedbackGiven: positive } } : m
    ));
  };

  const handleNotifyAdmin = () => {
    toast({
      title: 'Notificação enviada para Ana',
      description: 'A administradora receberá sua solicitação de acesso ao Billing.',
    });
  };

  const handleCreateTicket = (msgId: string) => {
    toast({
      title: 'Ticket SUP-1042 criado',
      description: 'Seu ticket foi registrado. SLA estimado: 4h.',
    });
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, extra: { ...(m.extra as any), ticketCreated: true } } : m
    ));
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-dark))] text-[hsl(var(--brand-foreground))] shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-background rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300" style={{ maxHeight: '560px' }}>
          {/* Header */}
          <div className="bg-[hsl(var(--brand))] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--brand-foreground))]/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-[hsl(var(--brand-foreground))]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--brand-foreground))]">Assistente SuportePro</p>
                <p className="text-xs text-[hsl(var(--brand-foreground))]/70">Sempre disponível</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_STYLES[risk].class}`}>
              {RISK_STYLES[risk].label}
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.type === 'user' ? (
                    <div className="bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] rounded-2xl rounded-tr-sm px-3 py-2 text-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Pill badge */}
                      {msg.extra?.pill && (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          msg.extra.pillVariant === 'judge'
                            ? 'bg-[hsl(var(--risk-critical-bg))] text-[hsl(var(--risk-critical))]'
                            : msg.extra.pillVariant === 'gate'
                            ? 'bg-[hsl(var(--risk-high-bg))] text-[hsl(var(--risk-high))]'
                            : msg.extra.pillVariant === 'search'
                            ? 'bg-[hsl(var(--risk-medium-bg))] text-[hsl(var(--risk-medium))]'
                            : 'bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand))]'
                        }`}>
                          {msg.extra.pillVariant === 'judge' ? <Shield className="h-3 w-3" />
                            : msg.extra.pillVariant === 'search' ? <AlertTriangle className="h-3 w-3" />
                            : <Shield className="h-3 w-3" />}
                          {msg.extra.pill}
                        </div>
                      )}

                      {/* Generic fallback card */}
                      {(msg.extra?.kind as string) === 'generic-fallback' && (
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm space-y-2">
                          <p className="text-foreground">Ainda estou aprendendo esse assunto. Tente um exemplo:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5 list-none">
                            {["'Como criar automação'", "'ver faturas'", "'me mostre a API Key'", "'minha automação não dispara'"].map(ex => (
                              <li key={ex} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[hsl(var(--brand-light))] shrink-0" />
                                {ex}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => {/* no-op */}}
                            className="text-xs font-medium text-[hsl(var(--brand))] hover:underline flex items-center gap-1 mt-1"
                          >
                            <Ticket className="h-3 w-3" /> Criar Ticket de Suporte
                          </button>
                        </div>
                      )}

                      {/* Fallback/low-confidence card */}
                      {(msg.extra?.kind as string) === 'fallback' && !(msg.extra as any)?.ticketCreated && (
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm space-y-2.5">
                          <div>
                            <p className="font-semibold text-foreground text-sm">Não encontrei uma resposta confiável</p>
                            <p className="text-xs text-muted-foreground mt-1">Pra não arriscar uma orientação errada, posso criar um ticket pro Suporte.</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleCreateTicket(msg.id)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-dark))] transition-colors"
                            >
                              <Ticket className="h-3 w-3" /> Criar Ticket para Suporte
                            </button>
                            <button
                              onClick={() => setShowDetailsForm(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-muted-foreground/10 transition-colors"
                            >
                              <FileText className="h-3 w-3" /> Adicionar detalhes
                              <ChevronDown className={`h-3 w-3 transition-transform ${showDetailsForm[msg.id] ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          {showDetailsForm[msg.id] && (
                            <TicketDetailsForm onSave={() => {
                              setShowDetailsForm(prev => ({ ...prev, [msg.id]: false }));
                              toast({ title: 'Detalhes salvos', description: 'As informações foram adicionadas ao ticket.' });
                            }} />
                          )}
                        </div>
                      )}

                      {/* Fallback — ticket created confirmation */}
                      {(msg.extra?.kind as string) === 'fallback' && (msg.extra as any)?.ticketCreated && (
                        <div className="bg-[hsl(var(--brand-muted))] border border-[hsl(var(--brand-light))]/30 rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm space-y-2.5">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[hsl(var(--brand))] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-foreground text-sm">Ticket SUP-1042 criado</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Não quero te passar uma orientação incerta. Já abri o ticket SUP-1042 com o Suporte — você consegue acompanhar por aqui.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground pl-6">
                            <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Status: <span className="font-medium text-foreground">Escalonado</span></span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> SLA: <span className="font-medium text-foreground">4h</span></span>
                          </div>
                          <div className="pl-6">
                            <button
                              onClick={() => setTicketTimelineOpen(true)}
                              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-dark))] transition-colors"
                            >
                              <Clock className="h-3 w-3" /> Acompanhar Ticket <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Main bubble for regular messages */}
                      {(msg.extra?.kind as string) !== 'generic-fallback' &&
                        (msg.extra?.kind as string) !== 'fallback' &&
                        msg.content && (
                        <div className={`rounded-2xl rounded-tl-sm px-3 py-2 text-sm ${
                          msg.extra?.kind === 'apikey-blocked' || msg.extra?.kind === 'billing-blocked'
                            ? 'bg-[hsl(var(--risk-critical-bg))] border border-[hsl(var(--risk-critical))] text-[hsl(var(--risk-critical))]'
                            : 'bg-muted text-foreground'
                        }`}>
                          {msg.content}

                          {/* Automation card */}
                          {msg.extra?.kind === 'automation' && (
                            <div className="mt-2 space-y-2">
                              <div className="bg-background rounded-xl p-3 border space-y-2">
                                {['Acesse o menu "Automações" na sidebar esquerda', 'Clique em "+ Nova Automação"', 'Configure o gatilho, condições e ações desejadas'].map((step, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="w-5 h-5 rounded-full bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--brand))]">
                                    <BookOpen className="h-3 w-3" />
                                    <span>Fonte: KB-245</span>
                                  </div>
                                  <button
                                    onClick={() => onNavigate('automacoes')}
                                    className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--brand))] hover:underline"
                                  >
                                    Ir para Automações <ChevronRight className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              {/* Feedback */}
                              {msg.extra.feedbackShown && msg.extra.feedbackGiven === null && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Isso resolveu?</span>
                                  <button
                                    onClick={() => handleFeedback(msg.id, true)}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))] font-medium hover:opacity-80"
                                  >
                                    <CheckCircle className="h-3 w-3" /> Sim
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(msg.id, false)}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--risk-critical-bg))] text-[hsl(var(--risk-critical))] font-medium hover:opacity-80"
                                  >
                                    <XCircle className="h-3 w-3" /> Não
                                  </button>
                                </div>
                              )}
                              {msg.extra.feedbackGiven === true && <ConfettiCheck />}
                              {msg.extra.feedbackGiven === false && (
                                <p className="text-xs text-muted-foreground">Entendido. Vou registrar para melhoria. Deseja falar com um agente humano?</p>
                              )}
                            </div>
                          )}

                          {/* Billing blocked */}
                          {msg.extra?.kind === 'billing-blocked' && (
                            <div className="mt-2">
                              <button
                                onClick={handleNotifyAdmin}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-dark))] transition-colors"
                              >
                                Notificar Admin
                              </button>
                            </div>
                          )}

                          {/* Billing allowed */}
                          {msg.extra?.kind === 'billing-allowed' && <BillingChart />}

                          {/* API Key owner */}
                          {msg.extra?.kind === 'apikey-owner' && (
                            <div className="mt-2">
                              <button
                                onClick={() => setApiKeyModalOpen(true)}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-dark))] transition-colors"
                              >
                                <Shield className="h-3 w-3" /> Abrir Segurança / API Keys
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2">
                  <TypingIndicator text={typing} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ex: minha automação não dispara…"
              className="flex-1 text-sm h-9"
            />
            <Button size="sm" onClick={handleSend} className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand-dark))] text-[hsl(var(--brand-foreground))] h-9 px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* API Key Modal for Paulo */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setApiKeyModalOpen(false)} />
          <div className="relative bg-background rounded-2xl shadow-2xl border p-6 w-80 animate-in zoom-in-90 duration-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[hsl(var(--risk-critical-bg))] rounded-lg">
                <Shield className="h-5 w-5 text-[hsl(var(--risk-critical))]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Gerar Nova API Key</h3>
                <p className="text-xs text-muted-foreground">Ação irreversível</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A chave atual será invalidada imediatamente. Todos os sistemas que a utilizam precisarão ser atualizados.
            </p>
            <div className="bg-muted rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">sk-pro-••••••••••••••••••••••••</span>
              <span className="text-[9px] bg-[hsl(var(--risk-medium-bg))] text-[hsl(var(--risk-medium))] px-1.5 py-0.5 rounded font-medium">Oculta</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setApiKeyModalOpen(false)}>Cancelar</Button>
              <Button size="sm" className="flex-1 bg-[hsl(var(--risk-critical))] hover:bg-[hsl(var(--risk-critical))]/90 text-[hsl(var(--brand-foreground))]" onClick={() => { toast({ title: 'Nova chave gerada', description: 'A nova API Key foi gerada. Acesse o painel de Segurança para copiá-la.' }); setApiKeyModalOpen(false); }}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Timeline Modal */}
      {ticketTimelineOpen && <TicketTimelineModal onClose={() => setTicketTimelineOpen(false)} />}
    </>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
