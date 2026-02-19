
# SuportePro — Assistente de Suporte Inteligente (Protótipo de Alta Fidelidade)

## Visão Geral
Protótipo funcional com duas telas principais acessadas via Sidebar lateral, com design B2B SaaS em azul corporativo, cinza e branco.

---

## Estrutura de Navegação
- **Sidebar global** com switch entre as duas telas: "Plataforma do Usuário" e "Admin Dashboard de IA"
- Design limpo com logo SuportePro no topo

---

## Tela 1 — Plataforma do Usuário (Marketing SaaS Fictício)

### Layout
- Sidebar esquerda com itens: Campanhas, Automações, Billing
- Área de conteúdo central com dashboard fictício
- **Simulador de Persona** no topo direito — dropdown com Bruno (Member), Ana (Admin), Paulo (Owner) — cada um com badge colorido indicando o nível de acesso

### Widget de Chat Flutuante
- Botão azul no canto inferior direito com ícone de chat
- Ao abrir: painel com header "Assistente SuportePro" + badge de status de risco (Baixo/Médio/Alto/Crítico)
- Campo de input com placeholder sugestivo

### Comportamentos Simulados por Keyword

**"Como criar automação"**
- Typing indicator com texto "Buscando na base de conhecimento…" (1s)
- Resposta em card estruturado com passos 1, 2, 3
- Rodapé do card: badge "Fonte: KB-245" + botão "Ir para Automações" (navega na sidebar)
- Feedback: botões "Sim ✓" / "Não ✗" → "Sim" dispara animação de confete/checkmark verde

**"ver faturas" ou "billing"**
- Typing indicator "Validando permissões…" + pílula "Access Gate: Billing"
- Bruno (Member): mensagem bloqueada com explicação educada + botão "Notificar Admin" → toast de confirmação "Notificação enviada para Ana"
- Ana/Paulo: resposta com mini gráfico de barras de custos mensais (mock)

**"me mostre a API Key"**
- Typing indicator "Analisando segurança (Judge)…" + pílula "Policy check: Sensitive data"
- Bruno/Ana: alerta vermelho com texto "Bloqueado por política de segurança — dado sensível"
- Paulo (Owner): não revela a chave; exibe alternativa segura com botão "Abrir Segurança/API Keys" + modal de confirmação "Gerar nova chave" (sem exibir tokens)

---

## Tela 2 — Admin Dashboard de IA

### Cards de KPIs (topo)
- **VARR 65%** — verde com seta subindo
- **Economia Estimada $4.500/mês** — com microtexto explicativo
- **Vazamentos Prevenidos 12** — ícone escudo
- **Adoção do Assistente 38%** — ícone usuários

### Tabela "Sessões Recentes"
Colunas: Usuário | Intenção | Risco | Status | Ação

Linhas de exemplo:
- Bruno / Criar automação / Baixo / Resolvido / Cache Hit
- Bruno / Ver faturas / Alto / Bloqueado / Fallback
- Hacker / API Keys / Crítico / Bloqueado / Judge Block

Cada linha clicável → abre **Drawer lateral** com detalhes completos da sessão: pergunta, resposta gerada, fontes usadas, decisão de permissão (Access Gate), decisão do juiz (Judge), feedback do usuário

---

## Design System
- Paleta: azul corporativo (#1E40AF / #3B82F6), cinza neutro, branco
- Tipografia limpa, cards com sombra suave
- Badges coloridos para níveis de risco (verde/amarelo/laranja/vermelho)
- Animações sutis: typing indicator, confete no feedback positivo, transições de drawer
