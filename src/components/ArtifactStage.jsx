import React, { useState } from 'react';
import { 
  Presentation, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Sparkles, 
  Maximize2, 
  Download, 
  Calendar, 
  Layers, 
  Award,
  FileCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateStandalonePresentationHtml } from '../utils/presentationExporter.js';

export default function ArtifactStage({ artifacts = [], onCreateSlideDeck, onCreateReport }) {
  const [activeArtifactTab, setActiveArtifactTab] = useState('slide-kit');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloadedHtml, setDownloadedHtml] = useState(false);
  const [downloadedMd, setDownloadedMd] = useState(false);

  // Filter artifacts by type
  const slideDecks = artifacts.filter(a => a.type === 'slide-kit');
  const reports = artifacts.filter(a => a.type === 'report-kit');

  const activeDeck = slideDecks[0];
  const activeReport = reports[0];

  const currentSlide = activeDeck?.slides?.[currentSlideIndex] || activeDeck?.slides?.[0];
  const totalSlides = activeDeck?.slides?.length || 0;

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleExportHtml = () => {
    if (!activeDeck) return;
    const htmlContent = generateStandalonePresentationHtml(activeDeck);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = (activeDeck.title || 'DiaStudio_Presentation')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    link.setAttribute('download', `${sanitizedTitle}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedHtml(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setDownloadedHtml(false), 2500);
  };

  const handleDownloadReport = () => {
    if (!activeReport?.content) return;
    const blob = new Blob([activeReport.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = (activeReport.title || 'DiaStudio_Report')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    link.setAttribute('download', `${sanitizedTitle}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedMd(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setDownloadedMd(false), 2500);
  };

  const handleCopyReport = () => {
    if (activeReport?.content) {
      navigator.clipboard.writeText(activeReport.content);
      setCopied(true);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e] overflow-hidden">
      
      {/* Artifact Stage Header */}
      <div className="px-6 py-3.5 border-b border-white/[0.08] bg-[#0c101c]/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Artifact Stage
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Dia Generative Deliverables
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">Synthesized by SlideKit and ReportKit agents</p>
          </div>
        </div>

        {/* Deliverable Type Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setActiveArtifactTab('slide-kit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeArtifactTab === 'slide-kit'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>SlideKit Decks ({slideDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveArtifactTab('report-kit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeArtifactTab === 'report-kit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ReportKit Memos ({reports.length})</span>
          </button>
        </div>
      </div>

      {/* Artifact View Body */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        
        {/* MODE A: SLIDEKIT DECK VIEWER */}
        {activeArtifactTab === 'slide-kit' && (
          slideDecks.length === 0 ? (
            <div className="w-full aspect-[16/9] max-h-[520px] rounded-3xl bg-[#0e1424] border border-white/[0.1] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
                <Presentation className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No SlideKit Decks Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6">
                Dia SlideKit generates executive slide decks from your active tabs and research context.
              </p>
              <button
                onClick={onCreateSlideDeck}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Executive Slide Deck</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              
              {/* 16:9 Presentation Slide Canvas */}
              <div className="w-full aspect-[16/9] max-h-[520px] rounded-3xl bg-gradient-to-b from-[#131a2e] to-[#0d1222] border border-white/[0.12] p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Slide Header & Metric */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-widest font-bold">
                      Slide {currentSlideIndex + 1} of {totalSlides}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeDeck?.title}
                    </span>
                  </div>

                  {currentSlide?.metric && (
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 font-mono">
                        {currentSlide.metric}
                      </div>
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        {currentSlide.metricLabel}
                      </div>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-2 leading-tight">
                  {currentSlide?.title}
                </h1>
                <p className="text-sm text-purple-300/80 font-mono mb-6">
                  {currentSlide?.subtitle}
                </p>

                {/* Slide Bullets */}
                <div className="space-y-3 max-w-2xl">
                  {currentSlide?.bullets?.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0 shadow-sm shadow-purple-400" />
                      <span className="leading-relaxed font-light">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaker Notes Drawer */}
              {currentSlide?.speakerNotes && (
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono bg-black/20 p-3 rounded-xl">
                  <span className="text-purple-300 font-semibold">🎙️ Talk Track:</span>
                  <span className="truncate flex-1 ml-2 text-slate-300">{currentSlide.speakerNotes}</span>
                </div>
              )}
            </div>

            {/* Slide Navigation Controls & Standalone HTML Export */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-mono border border-white/[0.08] transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  <span>Next Slide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Counter Dots */}
              <div className="flex items-center gap-1.5">
                {activeDeck?.slides?.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlideIndex 
                        ? 'w-6 bg-purple-400' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Standalone HTML Deck Export Button */}
              <div>
                <button
                  onClick={handleExportHtml}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/25 border border-purple-400/30"
                  title="Export offline, full-screen HTML presentation with keyboard arrow navigation"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadedHtml ? 'Exported HTML Deck!' : 'Export Presentation (HTML)'}</span>
                </button>
              </div>
            </div>

          </div>
          )
        )}

        {/* MODE B: REPORTKIT MEMO VIEWER */}
        {activeArtifactTab === 'report-kit' && (
          reports.length === 0 ? (
            <div className="w-full bg-[#101628] border border-white/[0.1] rounded-3xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Executive Reports Generated Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6">
                Dia ReportKit synthesizes multi-tab findings into structured markdown investigation memos.
              </p>
              <button
                onClick={onCreateReport}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Investigation Memo</span>
              </button>
            </div>
          ) : (
          <div className="w-full bg-[#101628] border border-white/[0.1] rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">
                  Executive Investigation Report
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeReport?.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(activeReport?.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Agent: {activeReport?.agent}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReport}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] text-xs font-mono transition-all flex items-center gap-1.5"
                  title="Download report as markdown file"
                >
                  {downloadedMd ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                  <span>{downloadedMd ? 'Saved .md!' : 'Download .md'}</span>
                </button>

                <button
                  onClick={handleCopyReport}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line font-light">
              {activeReport?.content}
            </div>
          </div>
          )
        )}

      </div>
    </div>
  );
}
