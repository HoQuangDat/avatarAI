'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface VideoStatus {
  status: 'draft' | 'generating_audio' | 'generating_video' | 'ready' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
}

export function useVideoStatus(videoId: string | null) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const MAX_POLL_DURATION = 10 * 60 * 1000; // 10 minutes

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const poll = useCallback(async () => {
    if (!videoId) return;

    // Timeout after 10 minutes
    if (Date.now() - startTimeRef.current > MAX_POLL_DURATION) {
      stopPolling();
      setStatus({
        status: 'failed',
        errorMessage: 'Video render timeout. Vui lòng thử lại.',
      });
      return;
    }

    try {
      const res = await fetch(`/api/video/status/${videoId}`);
      const data = await res.json();

      setStatus(data);

      if (data.status === 'ready' || data.status === 'failed') {
        stopPolling();
      }
    } catch {
      // Continue polling on network errors
    }
  }, [videoId, stopPolling]);

  const startPolling = useCallback(() => {
    if (!videoId) return;
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    setIsPolling(true);
    startTimeRef.current = Date.now();

    // Initial poll
    poll();

    // Poll every 3 seconds
    intervalRef.current = setInterval(poll, 3000);
  }, [videoId, poll]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { status, isPolling, startPolling, stopPolling };
}
