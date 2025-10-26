import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, ChatConfig, StreamMessage } from '../types';
import { DEFAULT_API_CONFIG, DEFAULT_THEME, DEFAULT_FEATURES } from '../config/defaults';
import { useSSEStream } from '../hooks/useSSEStream';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
  config: ChatConfig;
  initialMessages?: MessageType[];
  title?: string;
  onMessageSent?: (message: string) => void;
  onError?: (error: Error) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  config,
  initialMessages = [],
  title = 'Chat',
  onMessageSent,
  onError,
}) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamContent, setCurrentStreamContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiConfig = {
    ...DEFAULT_API_CONFIG,
    ...config.apiConfig,
  };

  const theme = {
    ...DEFAULT_THEME,
    ...config.theme,
  };

  const features = {
    ...DEFAULT_FEATURES,
    ...config.features,
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamContent]);

  const handleStreamMessage = (streamMessage: StreamMessage) => {
    if (streamMessage.type === 'token' && streamMessage.content) {
      setCurrentStreamContent((prev) => prev + streamMessage.content);
    } else if (streamMessage.type === 'block' && streamMessage.block) {
      // Add block to the current message
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          const updatedMessage = {
            ...lastMessage,
            blocks: [...(lastMessage.blocks || []), streamMessage.block!],
          };
          return [...prev.slice(0, -1), updatedMessage];
        }
        return prev;
      });
    } else if (streamMessage.type === 'done') {
      // Finalize the streaming message
      if (currentStreamContent) {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + currentStreamContent,
            };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return prev;
        });
      }
      setCurrentStreamContent('');
      setIsStreaming(false);
    } else if (streamMessage.type === 'error') {
      onError?.(new Error(streamMessage.error || 'Unknown error'));
      setCurrentStreamContent('');
      setIsStreaming(false);
    }
  };

  const { startStream, stopStream } = useSSEStream({
    onMessage: handleStreamMessage,
    onError: (error) => {
      onError?.(error);
      setIsStreaming(false);
      setCurrentStreamContent('');
    },
    onComplete: () => {
      setIsStreaming(false);
    },
    headers: apiConfig.headers,
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onMessageSent?.(content);

    // Create assistant message placeholder
    const assistantMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      blocks: [],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsStreaming(true);
    setCurrentStreamContent('');

    // Start SSE stream
    const streamUrl = `${apiConfig.baseUrl}${apiConfig.streamEndpoint}`;
    try {
      await startStream(streamUrl, {
        message: content,
        history: messages,
      });
    } catch (error) {
      onError?.(error as Error);
      setIsStreaming(false);
    }
  };

  return (
    <div
      className={styles.chatWindow}
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <div className={styles.header} style={{ backgroundColor: theme.primaryColor }}>
        {title}
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            customRenderers={config.customRenderers}
          />
        ))}

        {isStreaming && currentStreamContent && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageHeader}>Assistant</div>
            <div
              className={styles.messageContent}
              style={{ backgroundColor: theme.messageBackgroundColor }}
            >
              {currentStreamContent}
              <span className={styles.cursor}>▊</span>
            </div>
          </div>
        )}

        {isStreaming && !currentStreamContent && (
          <div className={styles.loadingIndicator}>
            <em>Assistant is thinking...</em>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
};

export default ChatWindow;
