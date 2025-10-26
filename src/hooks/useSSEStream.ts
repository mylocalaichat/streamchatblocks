import { useEffect, useRef, useCallback } from 'react';
import { SSEClient } from '../utils/sseClient';
import { StreamMessage } from '../types';

interface UseSSEStreamOptions {
  onMessage: (message: StreamMessage) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  headers?: Record<string, string>;
}

/**
 * React hook for SSE streaming
 */
export function useSSEStream(options: UseSSEStreamOptions) {
  const { onMessage, onError, onComplete, headers } = options;
  const clientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    clientRef.current = new SSEClient();

    return () => {
      clientRef.current?.disconnect();
    };
  }, []);

  const startStream = useCallback(
    async (url: string, data?: any) => {
      if (!clientRef.current) {
        clientRef.current = new SSEClient();
      }

      if (data) {
        await clientRef.current.postAndStream(
          url,
          data,
          onMessage,
          onError,
          onComplete,
          headers
        );
      } else {
        await clientRef.current.connect(
          url,
          onMessage,
          onError,
          onComplete,
          headers
        );
      }
    },
    [onMessage, onError, onComplete, headers]
  );

  const stopStream = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  const isConnected = useCallback(() => {
    return clientRef.current?.isConnected() ?? false;
  }, []);

  return {
    startStream,
    stopStream,
    isConnected,
  };
}

export default useSSEStream;
