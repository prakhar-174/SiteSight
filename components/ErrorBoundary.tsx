"use client";
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught a rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 mt-12 bg-[var(--color-card)] border-2 border-[var(--color-fail)] rounded-[3rem] max-w-2xl mx-auto text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[var(--color-fail)]/10 text-[var(--color-fail)] flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-[var(--color-text-primary)] font-bricolage mb-3">Report Rendering Failed</h3>
          <p className="text-[var(--color-text-muted)] max-w-md mb-8">
            We encountered an unexpected error while trying to display the report UI.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-full bg-[var(--color-fail)] text-white font-bold px-8 py-3 border-2 border-[var(--color-border)] border-b-[4px] active:border-b-2 active:translate-y-[2px] transition-all hover:brightness-110"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
