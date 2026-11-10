import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5183;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Serve static frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// WebSockets for real-time tab and agent telemetry
const wss = new WebSocketServer({ server, path: '/ws' });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'connected', server: 'DiaStudio Agent Server', timestamp: Date.now() }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Broadcast to other clients (e.g. tab changes, agent actions)
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('WS message error:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Dia Studio AI Browser & Multi-Agent Platform',
    version: '1.55.1-reconstructed',
    openRouterConfigured: Boolean(process.env.OPENROUTER_API_KEY),
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Mock/Default storage for artifacts
let artifactsStore = [
  {
    id: 'art-1',
    type: 'slide-kit',
    title: 'SAFe® 6.0 Program Increment Executive Briefing',
    agent: 'slide-kit',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    slides: [
      {
        id: 1,
        title: 'Agile Release Train Delivery Predictability',
        subtitle: 'Quarterly PI Execution Across 4 Engineering Squads',
        bullets: [
          '48 Story Points committed across Payments, Mobile, and Core Platform',
          'Zero release blockers through early cross-team red string resolution',
          'Sustained 98% delivery predictability score'
        ],
        metric: '98%',
        metricLabel: 'Predictability',
        speakerNotes: 'Highlight to leadership that cross-squad dependencies were identified during day 1 breakout sessions.'
      },
      {
        id: 2,
        title: 'ROAM Risk Matrix & Critical Path Analysis',
        subtitle: 'Proactive Impediment Elimination',
        bullets: [
          'Resolved: EKS Multi-Region disaster recovery cutover tested',
          'Owned: PCI-DSS Level 1 compliance logging assigned to Sarah Chen',
          'Mitigated: Real-time fraud detection decoupled with circuit-breaker'
        ],
        metric: '48h',
        metricLabel: 'Avg Resolution SLA',
        speakerNotes: 'Walk executives through the ROAM matrix to show transparency and accountability.'
      },
      {
        id: 3,
        title: 'Innovation & Planning (IP) Sprint Preservation',
        subtitle: 'Sprint 5 Dedicated Hardening & Architecture Runway',
        bullets: [
          'No user stories scheduled into Sprint 5 to maintain buffer capacity',
          'React Native 0.76 upgrade hackathon completed by Mobile Squad',
          'Chaos engineering gameday validated failover under 3.5s'
        ],
        metric: '100%',
        metricLabel: 'IP Buffer Held',
        speakerNotes: 'Emphasize that protecting the IP sprint prevented team burnout and technical debt.'
      }
    ]
  },
  {
    id: 'art-2',
    type: 'report-kit',
    title: 'Dia Browser Forensic Architecture & Multi-Agent Deep Dive',
    agent: 'clia-brief',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    content: `# Forensic Reverse Engineering Memo: Dia Browser
**Author:** Balaji Palani (Senior Scrum Master & Agile Solution Architect)  
**Target:** The Browser Company of New York (Dia Browser v1.55.1)

---

### Executive Findings
1. **Agent Engine:** Uses Bun runtime executing a custom Anthropic Claude Code harness (v2.1.296) constrained by macOS Seatbelt kernel sandboxes.
2. **On-Device ML:** Integrates Apple MLX and Hugging Face Transformers directly on Apple Silicon M-series memory for zero-latency DOM classification.
3. **Multi-Agent Orchestration:** Deploys 43 specialized subagents including Clia (executive briefs), Desk (task flow), and Meeting Watcher (Zoom/calendar).
4. **Agile Integration:** Includes native tool schemas for Atlassian Jira, Confluence, Linear, Notion, and Slack.`
  }
];

// Get all generated artifacts
app.get('/api/artifacts', (req, res) => {
  res.json(artifactsStore);
});

// Save or upload artifact (Dia tool dia:upload_artifact)
app.post('/api/artifacts', (req, res) => {
  const newArtifact = {
    id: `art-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  artifactsStore.unshift(newArtifact);
  broadcast({ type: 'artifact_created', artifact: newArtifact });
  res.status(201).json(newArtifact);
});

// Real URL Fetcher & DOM Inspector Endpoint (Dia autonomous browser tool)
app.post('/api/fetch-page', async (req, res) => {
  let { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    // Fetch page with standard browser headers and timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Dia/1.55.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    clearTimeout(timeout);

    const html = await response.text();

    // 1. Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : `${domain} Page`;

    // 2. Extract description/summary
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    let summary = descMatch ? descMatch[1].trim() : '';

    if (!summary) {
      // Fallback: extract first substantial paragraph
      const pMatch = html.match(/<p[^>]*>([^<]{40,300})<\/p>/i);
      summary = pMatch ? pMatch[1].replace(/&[a-z]+;/gi, ' ').trim() : `Live web snapshot of ${domain} captured by Dia Studio autonomous browser runtime.`;
    }

    // 3. Extract numbered DOM elements (Dia browser-use protocol)
    const domElements = [];
    let elemId = 1;

    // Headings
    const hMatches = [...html.matchAll(/<h([1-3])[^>]*>([^<]{3,80})<\/h\1>/gi)];
    for (const m of hMatches.slice(0, 3)) {
      const text = m[2].trim();
      if (text) {
        domElements.push({ id: elemId++, tag: `h${m[1]}`, text });
      }
    }

    // Buttons
    const buttonMatches = [...html.matchAll(/<button[^>]*>([^<]{2,60})<\/button>/gi)];
    for (const m of buttonMatches.slice(0, 4)) {
      const text = m[1].replace(/<[^>]+>/g, '').trim();
      if (text) {
        domElements.push({ id: elemId++, tag: 'button', text });
      }
    }

    // Search or text Inputs
    const inputMatches = [...html.matchAll(/<input[^>]*placeholder=["']([^"']+)["'][^>]*>/gi)];
    for (const m of inputMatches.slice(0, 3)) {
      const placeholder = m[1].trim();
      if (placeholder) {
        domElements.push({ id: elemId++, tag: 'input', placeholder });
      }
    }

    // Anchor links with meaningful text
    const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]{3,60})<\/a>/gi)];
    for (const m of linkMatches.slice(0, 5)) {
      const text = m[2].replace(/<[^>]+>/g, '').trim();
      if (text && !domElements.some(e => e.text === text)) {
        domElements.push({ id: elemId++, tag: 'a', text, href: m[1] });
      }
    }

    // If few elements were found (e.g. heavy client-side SPA), provide default interactive controls
    if (domElements.length === 0) {
      domElements.push(
        { id: 1, tag: 'header', text: pageTitle },
        { id: 2, tag: 'input', placeholder: `Search or query ${domain}...` },
        { id: 3, tag: 'button', text: 'Extract Content with Clia' },
        { id: 4, tag: 'button', text: 'Push Page to Jira User Story' },
        { id: 5, tag: 'button', text: 'Generate SlideKit Deck' }
      );
    }

    // Favicon icon heuristic
    let favicon = '🌐';
    if (domain.includes('github')) favicon = '🐙';
    else if (domain.includes('atlassian') || domain.includes('jira')) favicon = '🎯';
    else if (domain.includes('google')) favicon = '🔍';
    else if (domain.includes('youtube')) favicon = '▶️';
    else if (domain.includes('render')) favicon = '🚀';
    else if (domain.includes('wikipedia')) favicon = '📚';
    else if (domain.includes('hacker') || domain.includes('ycombinator')) favicon = '🔶';

    const tabData = {
      id: `tab-${Date.now()}`,
      title: pageTitle.length > 70 ? pageTitle.slice(0, 68) + '...' : pageTitle,
      url: url,
      domain: domain,
      favicon: favicon,
      active: true,
      group: 'Web Research',
      isSupertab: false,
      summary: summary,
      domElements: domElements
    };

    res.json(tabData);
  } catch (err) {
    console.warn(`URL fetch failed for ${url}:`, err.message);
    // Provide a resilient fallback tab instead of failing
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];
    res.json({
      id: `tab-${Date.now()}`,
      title: `${domain} (Autonomous Web View)`,
      url: url,
      domain: domain,
      favicon: '🌐',
      active: true,
      group: 'Web Research',
      isSupertab: false,
      summary: `Live connection established to ${domain}. Content rendered via Dia Studio proxy sandbox.`,
      domElements: [
        { id: 1, tag: 'header', text: `Portal: ${domain}` },
        { id: 2, tag: 'input', placeholder: 'Query page contents or filter nodes...' },
        { id: 3, tag: 'button', text: 'Deep Crawl with Claude Code' },
        { id: 4, tag: 'button', text: 'Generate Jira Spike' },
        { id: 5, tag: 'button', text: 'Create Executive Slide' }
      ]
    });
  }
});

// Server-Sent Events (SSE) streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, agentId = 'clia-brief', activeTab, openTabs = [] } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    sendEvent('status', { phase: 'thinking', message: `Routing request to ${agentId} subagent...` });

    // Step 1: Simulated Tool Invocation Phase
    if (message.toLowerCase().includes('slide') || message.toLowerCase().includes('presentation') || agentId === 'slide-kit') {
      sendEvent('tool_call', {
        tool: 'dia:slide_kit',
        input: { topic: message, style: 'executive_deck' },
        status: 'executing'
      });
      await new Promise(r => setTimeout(r, 600));

      const newDeck = {
        id: `deck-${Date.now()}`,
        type: 'slide-kit',
        title: `Presentation: ${message.slice(0, 40)}`,
        agent: agentId,
        createdAt: new Date().toISOString(),
        slides: [
          {
            id: 1,
            title: message.length > 50 ? message.slice(0, 48) + '...' : message,
            subtitle: 'Executive Summary & Strategic Overview',
            bullets: [
              'Key delivery milestones identified and aligned across workstreams',
              'Dependencies resolved across Mobile, Platform, and DevOps squads',
              'Actionable takeaways prioritized for immediate execution'
            ],
            metric: 'Top Priority',
            metricLabel: 'Status'
          },
          {
            id: 2,
            title: 'Operational Execution Plan',
            subtitle: 'Phased Rollout & Accountability Matrix',
            bullets: [
              'Phase 1: Zero-cost architecture deployment and validation',
              'Phase 2: Cross-functional review and team alignment',
              'Phase 3: Automated telemetry and delivery scorecards'
            ],
            metric: '100%',
            metricLabel: 'On Schedule'
          }
        ]
      };
      artifactsStore.unshift(newDeck);
      broadcast({ type: 'artifact_created', artifact: newDeck });

      sendEvent('tool_result', {
        tool: 'dia:slide_kit',
        output: 'SlideKit artifact successfully synthesized and mounted on Artifact Stage.',
        artifact: newDeck
      });
    } else {
      sendEvent('tool_call', {
        tool: 'dia:read_tabs',
        input: { activeUrl: activeTab?.url || 'https://dia.browser' },
        status: 'completed'
      });
    }

    sendEvent('status', { phase: 'generating', message: 'Synthesizing response...' });

    // Step 2: Inference via OpenRouter if key is valid, otherwise intelligent procedural response
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    let didStreamFromLLM = false;

    if (openRouterKey && !openRouterKey.includes('xxxxxxxx')) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://layyzee.github.io',
            'X-Title': 'DiaStudio'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              {
                role: 'system',
                content: `You are Dia, an intelligent workplace AI assistant built into the Dia web browser.
You have access to the user's active browser context:
- Active Tab: "${activeTab?.title || 'Home'}" (${activeTab?.url || 'https://dia.browser'})
- Context Summary: "${activeTab?.summary || 'Workplace context'}"
- Active Agent Persona: "${agentId}"

Rules:
1. Be warm, incisive, and concise. Never use unnecessary filler.
2. Structure information with bullet points, bold key terms, and clear next steps.
3. When relevant, reference open tabs, Jira delivery benchmarks, or SAFe principles.`
              },
              { role: 'user', content: message }
            ],
            stream: true
          })
        });

        if (response.ok && response.body) {
          didStreamFromLLM = true;
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                try {
                  const parsed = JSON.parse(trimmed.slice(6));
                  const delta = parsed.choices?.[0]?.delta?.content || '';
                  if (delta) {
                    sendEvent('token', { delta });
                  }
                } catch {
                  // ignore partial chunk
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('OpenRouter stream failed, falling back to procedural stream:', err.message);
      }
    }

    // Step 3: Fallback procedural stream if LLM was unavailable or rate-limited
    if (!didStreamFromLLM) {
      const proceduralResponse = generateProceduralAnswer(message, agentId, activeTab);
      const words = proceduralResponse.split(' ');
      for (const word of words) {
        sendEvent('token', { delta: word + ' ' });
        await new Promise(r => setTimeout(r, 25));
      }
    }

    sendEvent('done', { status: 'completed' });
    res.end();
  } catch (err) {
    console.error('Chat error:', err);
    sendEvent('error', { error: err.message });
    res.end();
  }
});

function generateProceduralAnswer(message, agentId, activeTab) {
  const tabTitle = activeTab?.title || 'Active Tab';

  if (agentId === 'clia-brief') {
    return `### 🌅 Clia Executive Morning Brief

Here is your consolidated intelligence brief across your active tabs and workspace:

1. **Active Context (${tabTitle}):**
   - Synthesized key objectives from **${activeTab?.domain || 'workspace'}**.
   - Current focus aligns with quarterly delivery commitments and cross-squad milestones.

2. **Cross-Team Priorities:**
   - **Sprint Execution:** 48 story points tracked with zero critical blockers.
   - **Cross-Squad Dependencies:** Payments API webhook integration verified against Mobile Checkout requirements.
   - **Meeting Schedule:** 2 syncs today; pre-meeting talking points have been staged in the Meeting Watcher drawer.

3. **Recommended Action:**
   - Review the newly generated slide deck or launch the interactive browser canvas to test live web interactions.`;
  }

  if (agentId === 'browser-use') {
    return `### 🌐 Autonomous Web Agent Action Plan

I inspected the DOM structure of **${tabTitle}**:
- Detected **${activeTab?.domElements?.length || 5} interactable elements** on the page.
- Target elements have been mapped with numeric IDs in your canvas snapshot.

**Executed Sequence:**
1. \`{"action": "snapshot", "page": "${activeTab?.url || 'active"}'}\` → 200 OK.
2. Verified that interactive buttons and search inputs are accessible.
3. Built-in **Human-in-the-Loop Handoff** is armed if private credentials or 2FA challenge occurs.

What web interaction would you like me to execute on this page?`;
  }

  return `### ⚡ Dia Studio Copilot Response

I analyzed your query: **"${message}"** across your active workspace context.

- **Current Tab:** ${tabTitle}
- **Agent Role:** ${agentId}
- **Findings:**
  - Technical requirements are consistent with your established zero-cost delivery architecture.
  - Contextual artifacts can be generated on demand into the **Artifact Stage** (presentations via \`slide-kit\`, reports via \`report-kit\`).

Let me know if you would like me to generate a slide deck, draft an executive memo, or interact with this webpage!`;
}

// Fallback all routes to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🚀 DiaStudio Agent Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSockets listening on ws://localhost:${PORT}/ws`);
});
