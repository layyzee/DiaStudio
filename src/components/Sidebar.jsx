import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Video, 
  Globe, 
  Presentation, 
  Layers, 
  Plus, 
  Folder, 
  Pin, 
  ChevronDown, 
  ExternalLink,
  Shield,
  Activity,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Compass,
  Video,
  Globe,
  Presentation,
  Layers
};

export default function Sidebar({ 
  agents, 
  activeAgent, 
  setActiveAgent, 
  tabs, 
  activeTab, 
  onSelectTab, 
  onNewTab, 
  onCloseTab 
}) {
  return (
    <aside className="w-64 bg-[#0a0d14] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none z-10">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Workspace Brand Header */}
        <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Dia Studio
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-normal">v1.55</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">Agentic Workplace Browser</p>
            </div>
          </div>
          <button 
            onClick={onNewTab}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-all"
            title="Open New Tab"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Tab Tree & Agents */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-5">
          
          {/* 1. Supertabs & Pinned Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1">
                <Pin className="w-3 h-3 text-indigo-400" />
                <span>Supertabs ({tabs.filter(t => t.isSupertab).length})</span>
              </span>
              <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                PERSISTENT
              </span>
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab?.id === tab.id;
                return (
                  <div
                    key={tab.id}
                    onClick={() => onSelectTab(tab)}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all border ${
                      isActive 
                        ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/40 text-white border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-medium' 
                        : 'text-slate-300 hover:bg-white/[0.04] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm shrink-0">{tab.favicon}</span>
                      <span className="truncate">{tab.title}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {tab.isSupertab && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" title="Supertab" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseTab(tab.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-0.5 rounded text-[11px]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Reverse-Engineered Agent Roster */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Dia Subagents ({agents.length})</span>
              <span className="text-[9px] text-purple-400">Claude Code</span>
            </div>

            <div className="space-y-1.5">
              {agents.map((agent) => {
                const IconComponent = iconMap[agent.icon] || Sparkles;
                const isCurrent = activeAgent.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setActiveAgent(agent)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border flex items-start gap-2.5 ${
                      isCurrent
                        ? 'bg-white/[0.07] border-purple-500/40 text-white shadow-md shadow-purple-500/10'
                        : 'bg-black/20 hover:bg-white/[0.03] border-white/[0.04] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm`}>
                      <IconComponent className="w-3.5 h-3.5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                          {agent.name}
                        </span>
                        {isCurrent && (
                          <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* User Profile & Infrastructure Footprint Footer */}
        <div className="p-3 border-t border-white/[0.06] bg-black/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                B
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-white">Balaji Palani</div>
                <div className="text-[10px] text-slate-400 font-mono">Senior Scrum Master</div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <Shield className="w-3 h-3" />
              <span>Seatbelt OK</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
