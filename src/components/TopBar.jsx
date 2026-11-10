import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Layers, 
  Terminal, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  Loader2,
  Maximize2
} from 'lucide-react';

export default function TopBar({ 
  activeTab, 
  activeView, 
  setActiveView, 
  activeAgent, 
  onRefresh, 
  onNavigate,
  isNavigating = false,
  isStreaming,
  serverStatus 
}) {
  const [inputUrl, setInputUrl] = useState(activeTab?.url || '');

  useEffect(() => {
    if (activeTab?.url) {
      setInputUrl(activeTab.url);
    }
  }, [activeTab?.url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim() || isNavigating) return;
    if (onNavigate) {
      onNavigate(inputUrl.trim());
    }
  };
  return (
    <header className="h-14 bg-[#0a0d14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 flex items-center justify-between gap-4 z-20">
      {/* Left: Window controls & Navigation buttons */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/[0.08]">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer" title="Close" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" title="Zoom" />
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors" title="Back">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors" title="Forward">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button 
            onClick={onRefresh}
            className={`p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors ${isStreaming ? 'animate-spin text-indigo-400' : ''}`} 
            title="Reload Tab"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Dia Omnibar / Interactive URL Navigation */}
      <div className="flex-1 max-w-xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/[0.1] hover:border-white/[0.2] focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all text-xs font-mono group"
        >
          {isNavigating ? (
            <Loader2 className="w-3.5 h-3.5 text-indigo-400 mr-2 shrink-0 animate-spin" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
          )}

          <input 
            type="text" 
            value={inputUrl} 
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Search, query or enter URL (e.g. github.com)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-xs font-mono truncate"
          />

          <div className="flex items-center gap-1.5 ml-2 shrink-0">
            <button
              type="submit"
              disabled={isNavigating || !inputUrl.trim()}
              className="p-1 rounded bg-white/[0.08] hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors disabled:opacity-40"
              title="Navigate to URL"
            >
              <CornerDownLeft className="w-3 h-3" />
            </button>
            <a 
              href={activeTab?.url?.startsWith('http') ? activeTab.url : `https://${activeTab?.url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-white transition-colors p-1" 
              title="Open in Native Browser Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </form>
      </div>

      {/* Right: View Switcher & Engine Telemetry */}
      <div className="flex items-center gap-3">
        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs">
          <button
            onClick={() => setActiveView('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              activeView === 'canvas' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Browser</span>
          </button>

          <button
            onClick={() => setActiveView('artifacts')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              activeView === 'artifacts' 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Artifact Stage</span>
          </button>

          <button
            onClick={() => setActiveView('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              activeView === 'terminal' 
                ? 'bg-slate-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Agent Sandbox</span>
          </button>
        </div>

        {/* Engine Badge */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Bun + Claude Code
          </span>
        </div>
      </div>
    </header>
  );
}
