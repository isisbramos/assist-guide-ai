import { useState } from 'react';
import {
  Megaphone, Zap, CreditCard, Lock, LayoutDashboard, TrendingUp, Users, Activity,
  BarChart2, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatWidget from './ChatWidget';
import { Persona, PlatformSection } from './types';

interface UserPlatformProps {
  persona: Persona;
}

const sidebarItems = [
  { id: 'campanhas' as PlatformSection, label: 'Campanhas', icon: Megaphone },
  { id: 'automacoes' as PlatformSection, label: 'Automações', icon: Zap },
  { id: 'billing' as PlatformSection, label: 'Billing', icon: CreditCard },
  { id: 'seguranca' as PlatformSection, label: 'Segurança / SSO', icon: Lock },
];

const CONTENT: Record<PlatformSection, { title: string; description: string }> = {
  campanhas: { title: 'Campanhas de Marketing', description: 'Gerencie e monitore todas as suas campanhas ativas.' },
  automacoes: { title: 'Automações', description: 'Configure fluxos automáticos de e-mail, SMS e notificações.' },
  billing: { title: 'Faturamento', description: 'Visualize faturas, histórico de pagamentos e planos.' },
  seguranca: { title: 'Segurança & SSO', description: 'Gerencie autenticação, API Keys e configurações de segurança.' },
};

const MOCK_STATS = [
  { label: 'Campanhas Ativas', value: '14', icon: Megaphone, delta: '+3 este mês', up: true },
  { label: 'Leads Gerados', value: '2.847', icon: Users, delta: '+18%', up: true },
  { label: 'Taxa de Abertura', value: '32%', icon: Activity, delta: '-2% vs. mês ant.', up: false },
  { label: 'Conversões', value: '486', icon: TrendingUp, delta: '+24%', up: true },
];

export default function UserPlatform({ persona }: UserPlatformProps) {
  const [activeSection, setActiveSection] = useState<PlatformSection>('campanhas');

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* App Sidebar */}
      <aside className="w-52 bg-card border-r flex flex-col shrink-0">
        {/* App Logo */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--brand))] flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-[hsl(var(--brand-foreground))]" />
            </div>
            <span className="font-bold text-sm text-foreground">MarketFlow</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 ml-9">Marketing SaaS</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">Principal</p>
          <button
            onClick={() => setActiveSection('campanhas')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'campanhas' ? 'bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand))]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </button>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-[hsl(var(--brand-muted))] text-[hsl(var(--brand))]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-3 py-3 border-t">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--brand))] flex items-center justify-center text-xs font-bold text-[hsl(var(--brand-foreground))]">
              {persona[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{persona}</p>
              <p className="text-[10px] text-muted-foreground truncate">marketing@empresa.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/30 p-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Page Header */}
          <div>
            <h2 className="text-xl font-bold text-foreground">{CONTENT[activeSection].title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{CONTENT[activeSection].description}</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_STATS.map((stat) => (
              <Card key={stat.label} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[hsl(var(--brand-muted))]">
                      <stat.icon className="h-4 w-4 text-[hsl(var(--brand))]" />
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-[hsl(var(--risk-low))]' : 'text-[hsl(var(--risk-critical))]'}`}>
                    <ArrowUpRight className={`h-3 w-3 ${!stat.up ? 'rotate-90' : ''}`} />
                    {stat.delta}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main content area — varies by section */}
          {activeSection === 'campanhas' && <CampanhasContent />}
          {activeSection === 'automacoes' && <AutomacoesContent />}
          {activeSection === 'billing' && <BillingContent persona={persona} />}
          {activeSection === 'seguranca' && <SegurancaContent persona={persona} />}
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget persona={persona} onNavigate={(section) => setActiveSection(section as PlatformSection)} />
    </div>
  );
}

function CampanhasContent() {
  const campaigns = [
    { name: 'Black Friday 2025', status: 'Ativa', leads: 1240, conv: '4.2%' },
    { name: 'Onboarding Série A', status: 'Rascunho', leads: 0, conv: '-' },
    { name: 'Reativação Q1', status: 'Ativa', leads: 892, conv: '3.1%' },
    { name: 'Lançamento Pro Plan', status: 'Pausada', leads: 315, conv: '6.7%' },
  ];
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Campanhas Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="text-left px-4 py-2 text-xs text-muted-foreground">Nome</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Status</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Leads</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Conversão</th></tr></thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.name} className="border-b hover:bg-muted/30 cursor-pointer">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'Ativa' ? 'bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))]' : c.status === 'Pausada' ? 'bg-[hsl(var(--risk-medium-bg))] text-[hsl(var(--risk-medium))]' : 'bg-muted text-muted-foreground'}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{c.leads.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.conv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function AutomacoesContent() {
  const automations = [
    { name: 'Boas-vindas novo lead', trigger: 'Formulário enviado', status: 'Ativa', runs: 1840 },
    { name: 'Follow-up 3 dias', trigger: 'Lead inativo', status: 'Ativa', runs: 672 },
    { name: 'Reengajamento', trigger: '30 dias sem abertura', status: 'Rascunho', runs: 0 },
  ];
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Automações Configuradas</CardTitle>
        <button className="text-xs font-medium text-[hsl(var(--brand))] flex items-center gap-1 hover:underline">
          + Nova Automação <ChevronRight className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/50"><th className="text-left px-4 py-2 text-xs text-muted-foreground">Nome</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Gatilho</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Status</th><th className="text-left px-4 py-2 text-xs text-muted-foreground">Execuções</th></tr></thead>
          <tbody>
            {automations.map(a => (
              <tr key={a.name} className="border-b hover:bg-muted/30 cursor-pointer">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{a.trigger}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === 'Ativa' ? 'bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))]' : 'bg-muted text-muted-foreground'}`}>{a.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{a.runs.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function BillingContent({ persona }: { persona: Persona }) {
  if (persona === 'Bruno') {
    return (
      <Card className="border shadow-sm border-[hsl(var(--risk-critical))]">
        <CardContent className="p-8 text-center">
          <Lock className="h-10 w-10 text-[hsl(var(--risk-critical))] mx-auto mb-3" />
          <p className="font-semibold text-foreground">Acesso Restrito</p>
          <p className="text-sm text-muted-foreground mt-1">Somente Admins e Owners podem acessar dados de faturamento.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Histórico de Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        {[{ month: 'Fevereiro 2026', amount: '$4.500', status: 'Pago' }, { month: 'Janeiro 2026', amount: '$4.600', status: 'Pago' }, { month: 'Dezembro 2025', amount: '$3.800', status: 'Pago' }].map(inv => (
          <div key={inv.month} className="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{inv.month}</p>
              <p className="text-xs text-muted-foreground">Pro Plan · 400 usuários</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">{inv.amount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))] font-medium">{inv.status}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SegurancaContent({ persona }: { persona: Persona }) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Segurança & Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">SSO / SAML 2.0</p>
              <p className="text-xs text-muted-foreground">Autenticação corporativa configurada</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--risk-low-bg))] text-[hsl(var(--risk-low))] font-medium">Ativo</span>
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">API Keys</p>
              <p className="text-xs text-muted-foreground font-mono">sk-pro-••••••••••••••••</p>
            </div>
            {persona === 'Paulo' ? (
              <button className="text-xs font-medium text-[hsl(var(--brand))] hover:underline">Gerenciar</button>
            ) : (
              <span className="text-xs text-muted-foreground">Sem permissão</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
