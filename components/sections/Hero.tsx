"use client";
// WHY "use client": This component uses React state (useState) to track the URL input, 
// a custom hook (useAnalysis) for API calls, and Framer Motion for scroll animations, 
// all of which require client-side execution in Next.js App Router.

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useAnalysis } from '../../hooks/useAnalysis';
import { ReportView } from '../ReportView';
import { ErrorBoundary } from '../ErrorBoundary';


const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "Fetching page...",
    "Analyzing meta tags...",
    "Checking performance...",
    "Calculating your score..."
  ];

  useEffect(() => {
    const int = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(int);
  }, [messages.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 mt-12 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-[3rem] max-w-2xl mx-auto"
    >
      <svg className="animate-spin h-12 w-12 text-[var(--color-accent)] mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl font-bold text-[var(--color-text-primary)] font-bricolage">{messages[msgIndex]}</p>
    </motion.div>
  );
}

function ErrorState({ error, onReset }: { error: string, onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 mt-12 bg-[var(--color-card)] border-2 border-[var(--color-fail)] rounded-[3rem] max-w-2xl mx-auto text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[var(--color-fail)]/10 text-[var(--color-fail)] flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-2xl font-black text-[var(--color-text-primary)] font-bricolage mb-3">Analysis Failed</h3>
      <p className="text-[var(--color-text-muted)] max-w-md mb-8">{error}</p>
      <button 
        onClick={onReset}
        className="rounded-full bg-[var(--color-fail)] text-white font-bold px-8 py-3 border-2 border-[var(--color-border)] border-b-[4px] active:border-b-2 active:translate-y-[2px] transition-all hover:brightness-110"
      >
        Try Again
      </button>
    </motion.div>
  );
}

export function Hero() {
  const [url, setUrl] = useState('');
  const { analyze, status, error, result, reset } = useAnalysis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      analyze(url.trim());
      // Smooth scroll slightly down to see the loading state
      setTimeout(() => {
        window.scrollBy({ top: 300, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleReset = () => {
    setUrl('');
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (status === 'complete') {
      setTimeout(() => {
        document.getElementById('report-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [status]);

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="rounded-[3rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] px-8 py-16 md:px-16 md:py-24 text-center relative overflow-hidden">
          
          {/* Handwritten Annotation */}
          <div className="flex justify-center mb-6">
            <span className="font-caveat text-xl text-[var(--color-accent)] font-semibold rotate-[-5deg] bg-[var(--color-canvas)] px-4 py-1 rounded-full border border-[var(--color-border)] shadow-sm">
              Free. No signup.
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-bricolage text-[var(--color-text-primary)] leading-[1.1] mb-8 tracking-tight">
            Your Website&apos;s SEO,<br />
            Laid Bare in<br />
            30 Seconds.
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-12">
            Stop guessing. Enter any URL and get a full audit — meta, performance, content, and trust signals.
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-4 items-center justify-center relative z-10">
            <input 
              type="url" 
              placeholder="https://yourwebsite.com" 
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full sm:flex-1 rounded-full px-8 py-5 border-2 border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-text-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 transition-all font-medium text-lg placeholder:text-[var(--color-text-muted)]"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full sm:w-auto shrink-0 rounded-full bg-[var(--color-accent)] text-white font-bold px-10 py-5 border-2 border-[var(--color-border)] border-b-[5px] active:border-b-2 active:translate-y-[2px] transition-all duration-100 hover:bg-[var(--color-accent-hover)] disabled:opacity-70 flex items-center justify-center gap-2 text-lg whitespace-nowrap"
            >
              {status === 'loading' ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Check →'
              )}
            </button>
          </form>

          {/* Decorative Floating Card Mockup */}
          {status === 'idle' && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] max-w-md h-32 rounded-t-3xl border-2 border-[var(--color-border)] bg-[var(--color-canvas)] shadow-2xl opacity-50 hidden md:block">
              <div className="p-6 flex flex-col gap-3">
                <div className="h-4 w-1/3 bg-[var(--color-border)]/10 rounded-full"></div>
                <div className="h-4 w-1/2 bg-[var(--color-border)]/10 rounded-full"></div>
              </div>
            </div>
          )}

          {/* Injected Loading/Error States */}
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState error={error || 'An error occurred'} onReset={reset} />}

        </div>
      </motion.div>

      {/* Render the full report just below the hero when ready */}
      {status === 'complete' && result && (
        <ErrorBoundary>
          <ReportView result={result} url={url} onReset={handleReset} />
        </ErrorBoundary>
      )}
    </>
  );
}
