import React, { useState, useEffect, useRef } from 'react';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import TabCanvas from './components/TabCanvas.jsx';
import ArtifactStage from './components/ArtifactStage.jsx';
import AgentSandbox from './components/AgentSandbox.jsx';
import AssistantDrawer from './components/AssistantDrawer.jsx';
import { DIA_AGENTS, MOCK_TABS } from './services/agentRegistry.js';
import confetti from 'canvas-confetti';

export default function App() {
  const [tabs, setTabs] = useState(MOCK_TABS);
  const [activeTabId, setActiveTabId] = useState(MOCK_TABS[0].id);
  const [activeAgent, setActiveAgent] = useState(DIA_AGENTS[0]);
  const queryView = new URLSearchParams(window.location.search).get('view');
  const [activeView, setActiveView] = useState(queryView || 'canvas'); // 'canvas' | 'artifacts' | 'terminal'
  const [artifacts, setArtifacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [activeToolCall, setActiveToolCall] = useState(null);
  const [serverStatus, setServerStatus] = useState('connecting');
  const [isNavigating, setIsNavigating] = useState(false);

  const wsRef = useRef(null);
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Fetch initial artifacts and check server health
  useEffect(() => {
    fetch('/api/artifacts')
      .then(r => r.json())
      .then(data => setArtifacts(data))
      .catch(() => console.log('Using local fallback artifacts'));

    fetch('/api/health')
      .then(r => r.json())
      .then(d => setServerStatus(d.status === 'ok' ? 'online' : 'degraded'))
      .catch(() => setServerStatus('offline'));
  }, []);

  // WebSockets setup for real-time sync
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setServerStatus('online');
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'artifact_created') {
          setArtifacts(prev => [payload.artifact, ...prev.filter(a => a.id !== payload.artifact.id)]);
        }
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    socket.onerror = () => {
      setServerStatus('local');
    };

    return () => {
      socket.close();
    };
  }, []);

  // Tab operations
  const handleSelectTab = (tab) => {
    setActiveTabId(tab.id);
    setActiveView('canvas');
  };

  const handleNewTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      title: 'New Knowledge Research Surface',
      url: 'https://dia.browser/workspace',
      domain: 'dia.browser',
      favicon: '✨',
      active: true,
      group: 'Workspace',
      isSupertab: false,
      summary: 'Fresh research canvas connected to Dia workspace tools and web extraction.',
      domElements: [
        { id: 1, tag: 'input', placeholder: 'Enter research query or URL...' },
        { id: 2, tag: 'button', text: 'Synthesize Page with Clia' },
        { id: 3, tag: 'button', text: 'Generate SlideKit Deck' }
      ]
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (tabId) => {
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      setActiveTabId(remaining[0].id);
    }
  };

  // Real URL Navigation via Dia Agent Scraping Service
  const handleNavigate = async (targetUrl) => {
    setIsNavigating(true);
    try {
      const response = await fetch('/api/fetch-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const tabData = await response.json();

      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...tabData, id: t.id } : t));
      setActiveView('canvas');

      const agentNotice = {
        sender: 'agent',
        text: `🌐 **Autonomous Browser Navigation:**\nSuccessfully crawled and loaded **${tabData.title}** (${tabData.url}).\n- **Domain:** \`${tabData.domain}\`\n- **Interactable Elements:** ${tabData.domElements?.length || 0} nodes mapped for autonomous browser-use actions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentNotice]);
    } catch (err) {
      console.error('Page fetch failed:', err);
    } finally {
      setIsNavigating(false);
    }
  };

  // Agent Chat Execution with SSE Streaming
  const handleSendMessage = async (userPrompt) => {
    const userMsg = {
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamedText('');
    setActiveToolCall(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          agentId: activeAgent.id,
          activeTab,
          openTabs: tabs
        })
      });

      if (!response.body) {
        throw new Error('No streaming response body available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          const lines = evt.split('\n');
          let eventName = 'message';
          let dataStr = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventName = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (dataStr) {
            try {
              const parsed = JSON.parse(dataStr);
              if (eventName === 'token' && parsed.delta) {
                accumulated += parsed.delta;
                setStreamedText(accumulated);
              } else if (eventName === 'tool_call') {
                setActiveToolCall({ tool: parsed.tool, input: parsed.input });
              } else if (eventName === 'tool_result') {
                setActiveToolCall(null);
                if (parsed.artifact) {
                  setArtifacts(prev => [parsed.artifact, ...prev]);
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                  setActiveView('artifacts');
                }
              } else if (eventName === 'done') {
                setIsStreaming(false);
              }
            } catch {
              // skip malformed chunk
            }
          }
        }
      }

      // Commit finalized message to history
      if (accumulated) {
        const agentMsg = {
          sender: 'agent',
          text: accumulated,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, agentMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        sender: 'agent',
        text: `Error connecting to Dia Agent server: ${err.message}. Ensure backend is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
      setStreamedText('');
      setActiveToolCall(null);
    }
  };

  const handleDomElementClick = (elem) => {
    handleSendMessage(`[browser_use] Click element [${elem.id}] <${elem.tag}> "${elem.text || elem.placeholder}" on ${activeTab.title}`);
  };

  return (
    <div className="flex h-screen w-screen bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Left Sidebar: Workspaces, Supertabs & Subagents */}
      <Sidebar 
        agents={DIA_AGENTS}
        activeAgent={activeAgent}
        setActiveAgent={setActiveAgent}
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
      />

      {/* 2. Center Column: TopBar + Active Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar 
          activeTab={activeTab}
          activeView={activeView}
          setActiveView={setActiveView}
          activeAgent={activeAgent}
          onRefresh={() => handleNavigate(activeTab?.url || 'https://dia.browser')}
          onNavigate={handleNavigate}
          isNavigating={isNavigating}
          isStreaming={isStreaming}
          serverStatus={serverStatus}
        />

        <main className="flex-1 flex overflow-hidden relative">
          {activeView === 'canvas' && (
            <TabCanvas 
              activeTab={activeTab}
              onDomElementClick={handleDomElementClick}
              onSendToAgent={handleSendMessage}
            />
          )}

          {activeView === 'artifacts' && (
            <ArtifactStage 
              artifacts={artifacts}
              onCreateSlideDeck={() => handleSendMessage('Create a 3-slide executive presentation')}
              onCreateReport={() => handleSendMessage('Generate an executive investigation report')}
            />
          )}

          {activeView === 'terminal' && (
            <AgentSandbox 
              agents={DIA_AGENTS}
              activeAgent={activeAgent}
              onExecuteTool={(tool) => handleSendMessage(`Execute tool: ${tool}`)}
            />
          )}
        </main>
      </div>

      {/* 3. Right Sidebar: SvelteKit-Style AI Assistant Drawer */}
      <AssistantDrawer 
        activeAgent={activeAgent}
        agents={DIA_AGENTS}
        setActiveAgent={setActiveAgent}
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        streamedText={streamedText}
        activeToolCall={activeToolCall}
        onClearChat={() => setMessages([])}
        activeTab={activeTab}
      />

    </div>
  );
}
