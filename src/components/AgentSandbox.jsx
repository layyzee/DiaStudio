import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Play, 
  Database, 
  CheckCircle2,
  Server,
  Zap
} from 'lucide-react';

export default function AgentSandbox({ agents = [], activeAgent, onExecuteTool }) {
  const [activeTabSub, setActiveTabSub] = useState('processes');
  const [logEntries, setLogEntries] = useState([
    { time: '11:20:04', type: 'info', text: 'Kernel seatbelt profile loaded: agent-claude-code.sb (Mach-O arm64)' },
    { time: '11:20:05', type: 'info', text: 'Bun runtime initialized on /tmp/dia-agent-server.sock' },
    { time: '11:20:05', type: 'success', text: 'libAIInfra.dylib: Apple MLX neural engine attached (Unified Memory: 16 GB)' },
    { time: '11:20:06', type: 'info', text: 'Claude Code harness v2.1.296 ready with 43 specialized subagents' },
    { time: '11:20:07', type: 'success', text: 'GRDB.framework: SQLite state machine open (WAL mode enabled)' }
  ]);

  const handleTestTool = (toolName) => {
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      type: 'tool',
      text: `[Tool Invoked] ${toolName} → Executed within sandboxed seatbelt profile.`
    };
    setLogEntries(prev => [...prev, newEntry]);
    if (onExecuteTool) onExecuteTool(toolName);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e] overflow-hidden p-6 max-w-5xl mx-auto w-full space-y-6">
      
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Forensic Runtime Architecture
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              macOS Seatbelt Enforced
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Dia Agent Multi-Process Sandbox
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Bun Agent Server + Embedded Claude Code Harness (v2.1.296) + Apple MLX Local Inference
          </p>
        </div>

        {/* Quick Test Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTestTool('dia:search_slack')}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" />
            <span>Test Slack Tool</span>
          </button>

          <button
            onClick={() => handleTestTool('dia:create_jira_issue')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" />
            <span>Test Jira Bridge</span>
          </button>
        </div>
      </div>

      {/* Grid: Process Tree & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Subagent Roster</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">43 Agents</div>
            <div className="text-[10px] text-purple-400 mt-1">Clia, Desk, MeetingWatcher</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Local On-Device ML</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">Apple MLX</div>
            <div className="text-[10px] text-emerald-400 mt-1">Neural Engine Optimized</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Agent Sandbox</div>
            <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">Seatbelt Kernel</div>
            <div className="text-[10px] text-indigo-400 mt-1">Filesystem & Net Isolation</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Terminal Telemetry Log Console */}
      <div className="flex-1 rounded-2xl bg-black/70 border border-white/[0.1] flex flex-col overflow-hidden font-mono text-xs">
        <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-200">Dia Agent IPC Stream (Unix Socket: /tmp/dia-agent-server.sock)</span>
          </div>
          <span className="text-[10px] text-emerald-400">● LIVE MONITORING</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300">
          {logEntries.map((log, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-slate-600 select-none">[{log.time}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                log.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                log.type === 'tool' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {log.type}
              </span>
              <span className="leading-relaxed">{log.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
