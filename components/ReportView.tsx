"use client";
// WHY "use client": This component uses React state (useState) to manage expandable sections,
// which requires client-side execution in Next.js App Router.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult, AuditItem as AuditItemType } from '../types/analysis';
import { Gauge } from './ui/Gauge';
import { ScoreCard } from './ui/ScoreCard';
import { AuditItem } from './ui/AuditItem';

interface ReportViewProps {
  result: AnalysisResult;
  url: string;
  onReset: () => void;
}

function Section({ title, score, items, defaultExpanded = true }: { title: string, score: number, items: AuditItemType[], defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setTimeout(() => setExpanded(false), 0);
    }
  }, []);

  let dotColor = 'bg-[var(--color-fail)]';
  if (score >= 70) dotColor = 'bg-[var(--color-pass)]';
  else if (score >= 40) dotColor = 'bg-[var(--color-warn)]';

  return (
    <div className="border-2 border-[var(--color-border)] rounded-3xl bg-[var(--color-card)] overflow-hidden mb-6 transition-all shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 md:p-6 bg-[var(--color-canvas)]/40 hover:bg-[var(--color-canvas)] transition-colors text-left border-b-2 border-transparent"
        style={{ borderBottomColor: expanded ? 'var(--color-border)' : 'transparent' }}
      >
        <div className="flex items-center gap-4">
          <span className={`w-4 h-4 rounded-full ${dotColor} border-2 border-[var(--color-border)]`}></span>
          <span className="text-xl md:text-2xl font-bold font-bricolage text-[var(--color-text-primary)]">{title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[var(--color-text-muted)]">{score} / 100</span>
          <svg className={`w-6 h-6 transition-transform text-[var(--color-text-muted)] ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {expanded && (
        <div className="p-4 flex flex-col gap-2">
          {items.map((item, idx) => (
            <AuditItem key={idx} item={item} />
          ))}
          {items.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] p-4 text-center font-medium">No audit items found for this category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ReportView({ result, url, onReset }: ReportViewProps) {
  const { scores, items, analyzedAt } = result;

  const date = new Date(analyzedAt).toLocaleString(undefined, { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 w-full mt-12"
      id="report-view"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
        
        {/* Left Panel: Score Summary (Sticky) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="rounded-[3rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center flex flex-col items-center">
            <h2 className="text-2xl font-black font-bricolage text-[var(--color-text-primary)] mb-8">
              Overall Score
            </h2>
            <Gauge score={scores.overall} size={240} animated={true} />
            
            <div className="mt-10 w-full text-left space-y-1 p-4 rounded-2xl bg-[var(--color-canvas)] border-2 border-[var(--color-border)]">
              <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Analyzed URL</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate" title={url}>{url}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">Tested on {date}</p>
            </div>
            
            <button 
              onClick={onReset}
              className="mt-6 w-full rounded-full bg-transparent text-[var(--color-text-primary)] font-bold px-8 py-4 border-2 border-[var(--color-border)] border-b-[5px] active:border-b-2 active:translate-y-[2px] transition-all duration-100 hover:bg-[var(--color-canvas)]"
            >
              Analyze Another URL
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:hidden">
            <ScoreCard label="Technical" score={scores.technical} />
            <ScoreCard label="On-Page" score={scores.onPage} />
            <ScoreCard label="Performance" score={scores.performance} />
            <ScoreCard label="Content" score={scores.content} />
          </div>
        </div>

        {/* Right Panel: Audit Details */}
        <div className="flex flex-col">
          <div className="hidden lg:grid grid-cols-4 gap-4 mb-8">
            <ScoreCard label="Technical" score={scores.technical} />
            <ScoreCard label="On-Page" score={scores.onPage} />
            <ScoreCard label="Performance" score={scores.performance} />
            <ScoreCard label="Content" score={scores.content} />
          </div>

          <h2 className="text-3xl font-black font-bricolage text-[var(--color-text-primary)] mb-6">
            Detailed Audit Report
          </h2>
          
          <Section 
            title="On-Page SEO" 
            score={scores.onPage} 
            items={[...(items.meta || []), ...(items.headings || [])]} 
          />
          
          <Section 
            title="Technical SEO" 
            score={scores.technical} 
            items={items.technical || []} 
          />
          
          <Section 
            title="Performance" 
            score={scores.performance} 
            items={items.performance || []} 
          />
          
          <Section 
            title="Content & Links" 
            score={scores.content} 
            items={[...(items.content || []), ...(items.images || []), ...(items.links || [])]} 
          />
        </div>

      </div>
    </motion.div>
  );
}
