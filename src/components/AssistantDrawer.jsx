import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  Paperclip, 
  Terminal, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  Globe, 
  Code 
} from 'lucide-react';

export default function AssistantDrawer({ 
  activeAgent, 
  agents, 
  setActiveAgent, 
  messages, 
  onSendMessage, 
  isStreaming, 
  streamedText, 
  activeToolCall,
  onClearChat,
  activeTab 
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText, activeToolCall]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input);
    setInput('');
  };

  const handleQuickPrompt = (promptText) => {
    if (isStreaming) return;
    onSendMessage(promptText);
  };

  return (
    <aside className="w-96 bg-[#0a0d14] border-l border-white/[0.08] flex flex-col justify-between shrink-0 select-none z-10">
      
      {/* Assistant Header */}
      <div className="p-3.5 border-b border-white/[0.06] bg-[#0c101c]/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeAgent.color} flex items-center justify-center text-white shadow-md`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{activeAgent.name}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {activeAgent.badge}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[190px]">
              {activeAgent.role}
            </p>
          </div>
        </div>

        <button 
          onClick={onClearChat}
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin text-xs">
        
        {/* Welcome Banner */}
        {messages.length === 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3 text-center">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeAgent.color} text-white flex items-center justify-center mx-auto shadow-lg`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Ready in Context: {activeTab?.title?.slice(0, 30)}...
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {activeAgent.description}
              </p>
            </div>

            {/* Quick Action Chips */}
            <div className="grid grid-cols-1 gap-1.5 pt-2 text-left">
              <button
                onClick={() => handleQuickPrompt(`Synthesize executive morning brief from active tab and open deliverables`)}
                className="p-2 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.06] text-[11px] text-slate-300 transition-all flex items-center justify-between group"
              >
                <span>🌅 Executive Morning Brief</span>
                <span className="text-[10px] text-slate-500 group-hover:text-purple-400">↵</span>
              </button>

              <button
                onClick={() => handleQuickPrompt(`Generate a 3-slide executive presentation from ${activeTab?.title}`)}
                className="p-2 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.06] text-[11px] text-slate-300 transition-all flex items-center justify-between group"
              >
                <span>📊 Create SlideKit Deck</span>
                <span className="text-[10px] text-slate-500 group-hover:text-purple-400">↵</span>
              </button>

              <button
                onClick={() => handleQuickPrompt(`Inspect interactable DOM elements and propose autonomous navigation steps`)}
                className="p-2 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.06] text-[11px] text-slate-300 transition-all flex items-center justify-between group"
              >
                <span>🌐 Autonomous Browser Action</span>
                <span className="text-[10px] text-slate-500 group-hover:text-purple-400">↵</span>
              </button>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={index} 
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="text-[9px] font-mono text-slate-500 px-1">
                {isUser ? 'You' : activeAgent.name} • {msg.timestamp}
              </div>

              <div 
                className={`p-3 rounded-2xl max-w-[92%] leading-relaxed ${
                  isUser 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md shadow-indigo-600/20' 
                    : 'bg-[#121726] border border-white/[0.08] text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-light">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Active Tool Call Card */}
        {activeToolCall && (
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs animate-fade-in space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Tool: {activeToolCall.tool}</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/30">
                EXECUTING
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate">
              Input: {JSON.stringify(activeToolCall.input)}
            </div>
          </div>
        )}

        {/* Streaming Token Response */}
        {isStreaming && streamedText && (
          <div className="flex flex-col items-start space-y-1 animate-fade-in">
            <div className="text-[9px] font-mono text-purple-400 px-1 flex items-center gap-1">
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span>{activeAgent.name} streaming...</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#121726] border border-purple-500/30 text-slate-200 rounded-bl-none shadow-md shadow-purple-500/10 max-w-[92%] leading-relaxed whitespace-pre-line text-xs font-light">
              {streamedText}
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-purple-400 animate-pulse" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field & Toolbar */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0c101c]/90">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative flex items-end rounded-2xl bg-black/50 border border-white/[0.1] focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all p-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Ask ${activeAgent.name} (Enter to send)...`}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none resize-none px-1 py-1 font-sans"
            />

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button 
                type="button" 
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Voice Dictation (Dia Speech Engine)"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>Model: {activeAgent.model}</span>
            <span>Dia Seatbelt: Armed</span>
          </div>
        </form>
      </div>

    </aside>
  );
}
