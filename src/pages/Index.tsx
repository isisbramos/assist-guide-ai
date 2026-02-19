import { useState } from 'react';
import { Bot, LayoutDashboard, ChevronDown } from 'lucide-react';
import UserPlatform from '@/components/suportepro/UserPlatform';
import AdminDashboard from '@/components/suportepro/AdminDashboard';
import { Persona, ActiveView, PERSONAS } from '@/components/suportepro/types';

export default function Index() {
  const [activeView, setActiveView] = useState<ActiveView>('platform');
  const [persona, setPersona] = useState<Persona>('Bruno');
  const [personaOpen, setPersonaOpen] = useState(false);

  const currentPersona = PERSONAS.find(p => p.name === persona)!;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Global Left Sidebar */}
      <aside className="w-14 bg-[hsl(var(--brand-dark))] flex flex-col items-center py-4 gap-3 shrink-0 z-10">
        {/* Logo */}
        <div className="w-9 h-9 rounded-xl bg-[hsl(var(--brand-foreground))]/20 flex items-center justify-center mb-2">
          <Bot className="h-5 w-5 text-[hsl(var(--brand-foreground))]" />
        </div>

        {/* Nav Buttons */}
        <button
          onClick={() => setActiveView('platform')}
          title="Plataforma do Usuário"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'platform'
              ? 'bg-[hsl(var(--brand-foreground))]/25 text-[hsl(var(--brand-foreground))]'
              : 'text-[hsl(var(--brand-foreground))]/50 hover:bg-[hsl(var(--brand-foreground))]/10 hover:text-[hsl(var(--brand-foreground))]'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>

        <button
          onClick={() => setActiveView('admin')}
          title="Admin Dashboard de IA"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            activeView === 'admin'
              ? 'bg-[hsl(var(--brand-foreground))]/25 text-[hsl(var(--brand-foreground))]'
              : 'text-[hsl(var(--brand-foreground))]/50 hover:bg-[hsl(var(--brand-foreground))]/10 hover:text-[hsl(var(--brand-foreground))]'
          }`}
        >
          <Bot className="h-5 w-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View labels (rotated) */}
        <div className="flex flex-col items-center gap-1 pb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--risk-low))]" />
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 bg-background border-b flex items-center justify-between px-4 shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-foreground">SuportePro</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">
              {activeView === 'platform' ? 'Plataforma do Usuário' : 'Admin Dashboard de IA'}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* View Switch Tabs */}
            <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setActiveView('platform')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeView === 'platform'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Plataforma
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  activeView === 'admin'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admin IA
              </button>
            </div>

            {/* Persona Simulator */}
            <div className="relative">
              <button
                onClick={() => setPersonaOpen(!personaOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted transition-colors text-sm"
              >
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: currentPersona.color }} />
                <span className="font-medium text-foreground text-xs">{persona}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${currentPersona.badgeClass}`}>
                  {currentPersona.role}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {personaOpen && (
                <div className="absolute top-full right-0 mt-1 bg-background border rounded-xl shadow-lg p-1.5 z-50 w-52 animate-in fade-in-0 zoom-in-95 duration-150">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">Simulador de Persona</p>
                  {PERSONAS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => { setPersona(p.name); setPersonaOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm hover:bg-muted transition-colors ${persona === p.name ? 'bg-muted' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[hsl(var(--brand-foreground))] shrink-0" style={{ backgroundColor: p.color }}>
                        {p.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground text-xs">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.role}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.badgeClass}`}>
                        {p.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main View */}
        <div className="flex flex-1 overflow-hidden">
          {activeView === 'platform' ? (
            <UserPlatform persona={persona} />
          ) : (
            <AdminDashboard />
          )}
        </div>
      </div>
    </div>
  );
}
