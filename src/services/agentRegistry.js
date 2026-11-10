/**
 * Dia Studio Agent Registry
 * Extracted and adapted from /Applications/Dia.app/Contents/Resources/agent-server-resources/dist/agents/
 */

export const DIA_AGENTS = [
  {
    id: 'clia-brief',
    name: 'Clia Executive Brief',
    role: 'Morning Briefing & Cross-App Synthesis',
    badge: 'Executive',
    icon: 'Sparkles',
    color: 'from-purple-500 to-indigo-600',
    description: 'Synthesizes unread Slack threads, calendar meetings, Jira blockers, and email digests into an actionable executive briefing.',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You are Clia, Dia's executive briefing agent. Your job is to synthesize high-priority work context across communication channels, calendars, and project management tools. Keep your tone concise, warm, and highly structured. Present actionable executive summaries with clear next steps.`,
    defaultTools: ['search_slack', 'read_calendar', 'atlassian_search', 'generate_report']
  },
  {
    id: 'desk-focus',
    name: 'Desk Workflow Assistant',
    role: 'Context-Aware Task Copilot',
    badge: 'Workplace',
    icon: 'Compass',
    color: 'from-blue-500 to-cyan-600',
    description: 'Proactively identifies focus blocks, prioritizes active browser tabs, and coordinates multi-step knowledge work.',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You are Dia Desk, a proactive workplace assistant embedded in the browser. You help users structure their focus time, eliminate distraction, and organize open tabs and research threads into actionable task queues.`,
    defaultTools: ['read_tabs', 'group_tabs', 'search_history', 'create_task']
  },
  {
    id: 'meeting-watcher',
    name: 'Meeting Watcher',
    role: 'Pre-Meeting Prep & Post-Meeting Recaps',
    badge: 'Calendar & Zoom',
    icon: 'Video',
    color: 'from-emerald-500 to-teal-600',
    description: 'Researches meeting attendees, pulls relevant past discussions from Slack/Zoom/Granola, and generates talking points and run-of-shows.',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You are Dia's Meeting Watcher agent. When presented with an upcoming meeting or past recording, you analyze attendee profiles, historical context, prior commitments, and generate concise prep agendas and follow-up action items.`,
    defaultTools: ['read_calendar', 'zoom_read', 'granola_read', 'generate_report']
  },
  {
    id: 'browser-use',
    name: 'Autonomous Web Agent',
    role: 'Interactive Browser Navigation & DOM Actions',
    badge: 'Automation',
    icon: 'Globe',
    color: 'from-amber-500 to-rose-600',
    description: 'Executes numbered DOM element interactions (clicks, form fills, filters) with built-in human handoff for logins and 2FA.',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You perform website interactions for Dia's task agent using browser_use. Target DOM elements by their numbers in page snapshots. When sensitive authentication or 2FA is needed, yield control cleanly to the human user using handoff_page_id, then resume once verified.`,
    defaultTools: ['browser_use', 'fetch_web_content', 'take_snapshot', 'human_handoff']
  },
  {
    id: 'slide-kit',
    name: 'SlideKit Presentation Architect',
    role: 'Deck & Presentation Generator',
    badge: 'Generative Deliverable',
    icon: 'Presentation',
    color: 'from-rose-500 to-purple-600',
    description: 'Generates polished, stakeholder-ready slide decks directly from web research and project telemetry.',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You are Dia's SlideKit agent. When the user asks for slides, presentations, or meeting decks, generate structured JSON slides featuring clear titles, bullet points, statistics, visual layouts, and speaker notes.`,
    defaultTools: ['generate_slides', 'fetch_web_content', 'upload_artifact']
  },
  {
    id: 'agile-copilot',
    name: 'Agile Delivery Copilot',
    role: 'Scrum Master & SAFe Governance Bridge',
    badge: 'BalaSuite Special',
    icon: 'Layers',
    color: 'from-indigo-600 to-blue-600',
    description: 'Bridges Dia browser research into Jira Cloud tickets, Sprint Retros (BalaBoard), and SAFe Program Boards (PI Planner).',
    harness: 'claude-sdk',
    model: 'OpenRouter Free / Llama-3.3 70B',
    systemPrompt: `You are Dia's Agile Delivery Copilot, customized for Senior Scrum Masters and Agile Release Trains. You analyze team research, convert technical findings into Definition of Ready (DoR) user stories, and track cross-squad dependencies.`,
    defaultTools: ['create_jira_issue', 'export_jira_csv', 'read_tabs', 'generate_report']
  }
];

export const MOCK_TABS = [
  {
    id: 'tab-1',
    title: 'Scaled Agile Framework — SAFe® 6.0 Program Board',
    url: 'https://scaledagileframework.com/pi-planning',
    domain: 'scaledagileframework.com',
    favicon: '🏛️',
    active: true,
    group: 'Agile Governance',
    isSupertab: true,
    summary: 'Core reference architecture for Program Increment planning, cross-squad dependency management, and ROAM risk governance.',
    domElements: [
      { id: 1, tag: 'header', text: 'SAFe 6.0 PI Planning Overview' },
      { id: 2, tag: 'button', text: 'Download Program Board Toolkit' },
      { id: 3, tag: 'input', placeholder: 'Search framework articles...' },
      { id: 4, tag: 'a', text: 'Innovation & Planning (IP) Sprint Guidance' },
      { id: 5, tag: 'a', text: 'ROAM Risk Matrix Best Practices' }
    ]
  },
  {
    id: 'tab-2',
    title: 'Atlassian Jira Cloud — Sprint 26.2 Active Board',
    url: 'https://company.atlassian.net/jira/software/projects/ART/boards/42',
    domain: 'atlassian.net',
    favicon: '🎯',
    active: false,
    group: 'Sprint Delivery',
    isSupertab: true,
    summary: 'Active Sprint 26.2 board with 48 story points committed across Payments, Mobile, and Core API squads.',
    domElements: [
      { id: 10, tag: 'button', text: 'Create Issue (+)' },
      { id: 11, tag: 'input', placeholder: 'Filter by assignee or epic' },
      { id: 12, tag: 'card', text: 'PAY-203: Real-Time Fraud Webhook Handler (8 pts)' },
      { id: 13, tag: 'card', text: 'MOB-103: Apple Pay Checkout UI (13 pts)' }
    ]
  },
  {
    id: 'tab-3',
    title: 'BalaBoard — Sprint Retrospective & AI Clustering',
    url: 'https://balaboard.onrender.com/?room=sandbox&demo=true',
    domain: 'balaboard.onrender.com',
    favicon: '📋',
    active: false,
    group: 'Sprint Delivery',
    isSupertab: false,
    summary: 'Live real-time collaborative retrospective board with 12 frameworks and automatic semantic card grouping.',
    domElements: [
      { id: 20, tag: 'button', text: 'Add Sticky Note' },
      { id: 21, tag: 'button', text: 'Auto-Cluster Notes (AI)' },
      { id: 22, tag: 'button', text: 'Push Action Items to Jira' }
    ]
  },
  {
    id: 'tab-4',
    title: 'Anthropic Claude Code Documentation & API Reference',
    url: 'https://docs.anthropic.com/en/docs/claude-code',
    domain: 'docs.anthropic.com',
    favicon: '⚡',
    active: false,
    group: 'Research',
    isSupertab: false,
    summary: 'Architecture guide for running autonomous terminal-based coding agents with bash execution and tool use.',
    domElements: [
      { id: 30, tag: 'h1', text: 'Claude Code Agent Architecture' },
      { id: 31, tag: 'code', text: 'claude --dangerously-skip-permissions' },
      { id: 32, tag: 'button', text: 'Copy CLI Installation Command' }
    ]
  }
];
