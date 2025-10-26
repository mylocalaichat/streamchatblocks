import { StreamMessage, SSEEvent } from '../types';

/**
 * SSE Client for handling Server-Sent Events from FastAPI backend
 */
export class SSEClient {
  private controller: AbortController | null = null;

  /**
   * Connect to SSE endpoint and stream messages
   */
  async connect(
    url: string,
    onMessage: (message: StreamMessage) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    headers?: Record<string, string>
  ): Promise<void> {
    this.controller = new AbortController();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          ...headers,
        },
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          const event = this.parseSSELine(line);
          if (event) {
            const message = this.parseStreamMessage(event);
            if (message) {
              onMessage(message);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        onError?.(error);
      }
    }
  }

  /**
   * Post data and stream response
   */
  async postAndStream(
    url: string,
    data: any,
    onMessage: (message: StreamMessage) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
    headers?: Record<string, string>
  ): Promise<void> {
    this.controller = new AbortController();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          ...headers,
        },
        body: JSON.stringify(data),
        signal: this.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          const event = this.parseSSELine(line);
          if (event) {
            const message = this.parseStreamMessage(event);
            if (message) {
              onMessage(message);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        onError?.(error);
      }
    }
  }

  /**
   * Parse SSE line into event object
   */
  private parseSSELine(line: string): SSEEvent | null {
    if (line.startsWith('data: ')) {
      return {
        data: line.slice(6),
      };
    }
    if (line.startsWith('event: ')) {
      return {
        event: line.slice(7),
        data: '',
      };
    }
    if (line.startsWith('id: ')) {
      return {
        id: line.slice(4),
        data: '',
      };
    }
    return null;
  }

  /**
   * Parse stream message from SSE event
   */
  private parseStreamMessage(event: SSEEvent): StreamMessage | null {
    try {
      const parsed = JSON.parse(event.data);

      // Handle different message types
      if (parsed.type === 'token') {
        return {
          type: 'token',
          content: parsed.content || parsed.token,
        };
      }

      if (parsed.type === 'block') {
        return {
          type: 'block',
          block: parsed.block || parsed.data,
        };
      }

      if (parsed.type === 'done' || parsed.type === 'complete') {
        return {
          type: 'done',
        };
      }

      if (parsed.type === 'error') {
        return {
          type: 'error',
          error: parsed.error || parsed.message,
        };
      }

      // Default: treat as token
      return {
        type: 'token',
        content: parsed.content || event.data,
      };
    } catch (error) {
      // If not JSON, treat as plain text token
      return {
        type: 'token',
        content: event.data,
      };
    }
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.controller !== null;
  }
}

export default SSEClient;
