import React, { useState } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Lock, 
  Eye, 
  MousePointerClick, 
  KeyRound, 
  CheckCircle, 
  ExternalLink,
  Code,
  Sparkles,
  ArrowRight,
  Send,
  Plus
} from 'lucide-react';

export default function TabCanvas({ activeTab, onDomElementClick, onSendToAgent }) {
  const [showDomNumbers, setShowDomNumbers] = useState(true);
  const [handoffActive, setHandoffActive] = useState(false);
  const [handoffCompleted, setHandoffCompleted] = useState(false);
  const [clickedElementId, setClickedElementId] = useState(null);

  const handleElementClick = (elem) => {
    setClickedElementId(elem.id);
    if (onDomElementClick) {
      onDomElementClick(elem);
    }
  };

  const handleSimulateHandoff = () => {
    setHandoffActive(true);
    setHandoffCompleted(false);
  };

  const handleCompleteHandoff = () => {
    setHandoffActive(false);
    setHandoffCompleted(true);
    if (onSendToAgent) {
      onSendToAgent(`[Human Handoff Completed] Verified identity and authenticated session for ${activeTab?.domain || 'target page'}. Resuming autonomous task.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#080b12] overflow-hidden relative">
      
      {/* Canvas Header & Browser Navigation Ribbon */}
      <div className="px-5 py-3 border-b border-white/[0.08] bg-[#0c101c]/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">{activeTab?.favicon || '🌐'}</span>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              {activeTab?.title}
              {activeTab?.isSupertab && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                  Supertab
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> TLS 1.3
              </span>
              <span>•</span>
              <span>{activeTab?.domain}</span>
              <span>•</span>
              <span className="text-slate-500">{activeTab?.group}</span>
            </div>
          </div>
        </div>

        {/* DOM Inspector & Handoff Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowDomNumbers(!showDomNumbers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              showDomNumbers
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white'
            }`}
            title="Toggle Dia's Numbered DOM Elements for browser_use"
          >
            <Code className="w-3.5 h-3.5" />
            <span>DOM Numbers {showDomNumbers ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleSimulateHandoff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 text-xs font-mono transition-all"
            title="Simulate Dia's Human-in-the-Loop Handoff"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Simulate Handoff</span>
          </button>
        </div>
      </div>

      {/* Human-in-the-loop (Handoff) Banner if triggered */}
      {handoffActive && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-900/90 border-b border-purple-500/40 p-4 text-white flex items-center justify-between shadow-xl animate-fade-in z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md animate-bounce">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Human-in-the-Loop Handoff Active</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20">handoff_page_id: {activeTab?.id}</span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                The autonomous agent paused to protect your privacy: Please sign in or complete 2FA on this page before agent control resumes.
              </p>
            </div>
          </div>

          <button
            onClick={handleCompleteHandoff}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Authenticate & Return Control</span>
          </button>
        </div>
      )}

      {handoffCompleted && !handoffActive && (
        <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-2 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session verified by user. Dia browser-use autonomous execution resumed.</span>
          </span>
          <button 
            onClick={() => setHandoffCompleted(false)}
            className="text-slate-400 hover:text-white text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Simulated Web View Canvas Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Page Context Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111626] to-[#0c101d] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Synthesized Document Context
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Last Crawled: Just now
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            {activeTab?.title}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
            {activeTab?.summary}
          </p>

          {/* Interactive Numbered DOM Elements (Dia browser_use format) */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-amber-400" />
                <span>Interactable DOM Elements (Numbered for Dia Agent)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Click to trigger action</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeTab?.domElements?.map((elem) => {
                const isSelected = clickedElementId === elem.id;
                return (
                  <div
                    key={elem.id}
                    onClick={() => handleElementClick(elem)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-black/30 hover:bg-white/[0.05] border-white/[0.06] text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {showDomNumbers && (
                        <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                          {elem.id}
                        </span>
                      )}
                      <span className="font-medium truncate">
                        {elem.text || elem.placeholder}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 uppercase bg-white/[0.05] px-1.5 py-0.5 rounded shrink-0">
                      &lt;{elem.tag}&gt;
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Agent Actions Bar */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Ask Dia about this tab:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSendToAgent(`Generate a 3-slide executive deck from ${activeTab?.title}`)}
              className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>SlideKit Deck</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onSendToAgent(`Summarize key findings from this page into an executive memo`)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>ReportKit Memo</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onSendToAgent(`Convert ${activeTab?.title} insights into a Jira user story with acceptance criteria`)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
            >
              <span>Push to Jira</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
