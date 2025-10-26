import { ReactNode } from 'react';

/**
 * Represents a chat message in the conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  blocks?: ResponseBlock[];
}

/**
 * Different types of blocks that can appear in AI responses
 */
export type BlockType = 'text' | 'drug' | 'feedback' | 'table' | 'chart' | 'custom' | 'chatresponse';

/**
 * Base interface for response blocks
 */
export interface ResponseBlock {
  type: BlockType;
  data: any;
  id?: string;
}

/**
 * Text block in response
 */
export interface TextBlock extends ResponseBlock {
  type: 'text';
  data: {
    content: string;
  };
}

/**
 * Drug information block
 */
export interface DrugBlock extends ResponseBlock {
  type: 'drug';
  data: {
    name: string;
    dosage?: string;
    interactions?: string[];
    warnings?: string[];
    description?: string;
  };
}

/**
 * Feedback block for user input
 */
export interface FeedbackBlock extends ResponseBlock {
  type: 'feedback';
  data: {
    question: string;
    options?: string[];
    allowCustom?: boolean;
  };
}

/**
 * Chat response block for displaying AI responses
 */
export interface ChatResponseBlock extends ResponseBlock {
  type: 'chatresponse';
  data: {
    content: string;
    timestamp?: string;
  };
}

/**
 * Custom block for community components
 */
export interface CustomBlock extends ResponseBlock {
  type: 'custom';
  data: {
    componentType: string;
    props: Record<string, any>;
  };
}

/**
 * Component renderer for custom block types
 */
export type BlockRenderer = (block: ResponseBlock) => ReactNode;

/**
 * Registry of block renderers
 */
export type BlockRendererRegistry = Map<BlockType | string, BlockRenderer>;

/**
 * API configuration for the chat component
 */
export interface ApiConfig {
  /**
   * Base URL for the API
   */
  baseUrl: string;

  /**
   * Endpoint for sending messages
   * @default '/chat'
   */
  chatEndpoint?: string;

  /**
   * Endpoint for streaming responses via SSE
   * @default '/stream'
   */
  streamEndpoint?: string;

  /**
   * Endpoint for feedback submission
   * @default '/feedback'
   */
  feedbackEndpoint?: string;

  /**
   * Custom headers to include in requests
   */
  headers?: Record<string, string>;

  /**
   * Custom fetch implementation
   */
  fetchImplementation?: typeof fetch;
}

/**
 * SSE event types from the backend
 */
export interface SSEEvent {
  event?: string;
  data: string;
  id?: string;
}

/**
 * Parsed SSE message from backend
 */
export interface StreamMessage {
  type: 'block' | 'token' | 'done' | 'error';
  content?: string;
  block?: ResponseBlock;
  error?: string;
}

/**
 * Chat configuration
 */
export interface ChatConfig {
  /**
   * API configuration
   */
  apiConfig: ApiConfig;

  /**
   * Custom block renderers
   */
  customRenderers?: BlockRendererRegistry;

  /**
   * Enable/disable features
   */
  features?: {
    feedback?: boolean;
    markdown?: boolean;
    codeHighlighting?: boolean;
  };

  /**
   * UI customization
   */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    messageBackgroundColor?: string;
    fontFamily?: string;
  };
}

/**
 * Props for community component contributions
 */
export interface CommunityComponentProps {
  block: ResponseBlock;
  onAction?: (action: string, data?: any) => void;
}
