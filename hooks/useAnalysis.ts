import { useState, useCallback, useRef, useEffect } from 'react';
import { AnalysisResult } from '../types/analysis';
import axios from 'axios';

type Status = 'idle' | 'loading' | 'complete' | 'error';

interface UseAnalysisState {
  status: Status;
  result: AnalysisResult | null;
  error: string | null;
}

/**
 * Custom hook to manage the full SEO analysis lifecycle.
 * Initiates the job via POST, then polls the GET endpoint until completion.
 */
export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    status: 'idle',
    result: null,
    error: null,
  });

  // Ref to store the interval ID for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Cleans up the active polling interval safely.
   */
  const clearPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Ensure polling is cleared if the component unmounts
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  /**
   * Starts a new analysis job for the given URL.
   */
  const analyze = useCallback(async (url: string) => {
    // Reset state and clear previous polls before starting a new job
    clearPolling();
    setState({ status: 'loading', result: null, error: null });

    try {
      // 1. Initiate analysis
      const initRes = await axios.post('/api/analyze', { url });
      const jobId = initRes.data.jobId;

      if (!jobId) {
        throw new Error('Failed to retrieve job ID from server.');
      }

      // 2. Poll for results every 1.5 seconds
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await axios.get(`/api/results/${jobId}`);
          const job = pollRes.data;

          if (job.status === 'complete') {
            clearPolling();
            setState({ status: 'complete', result: job.result, error: null });
          } else if (job.status === 'error') {
            clearPolling();
            setState({ status: 'error', result: null, error: job.error || 'Analysis failed.' });
          }
          // If status is 'processing', do nothing and let the interval tick again
        } catch (pollError: any) {
          clearPolling();
          setState({ 
            status: 'error', 
            result: null, 
            error: pollError.response?.data?.error || 'Lost connection to server while polling.' 
          });
        }
      }, 1500);

    } catch (initError: any) {
      clearPolling();
      setState({ 
        status: 'error', 
        result: null, 
        error: initError.response?.data?.error || 'Failed to start analysis. Please check the URL and try again.' 
      });
    }
  }, [clearPolling]);

  const reset = useCallback(() => {
    clearPolling();
    setState({ status: 'idle', result: null, error: null });
  }, [clearPolling]);

  return {
    ...state,
    analyze,
    clearPolling,
    reset
  };
}
