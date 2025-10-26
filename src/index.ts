/**
 * StreamChatBlocks - AI Chat Interface Components with SSE Streaming
 *
 * A React component library for building AI chat interfaces with
 * Server-Sent Events (SSE) streaming support and FastAPI compatibility.
 */

// Main components
export { ChatWindow } from './components/ChatWindow';
export { Message } from './components/Message';
export { ChatInput } from './components/ChatInput';
export { BlockRenderer } from './components/BlockRenderer';

// Block components
export { TextBlock } from './components/blocks/TextBlock';
export { DrugBlock } from './components/blocks/DrugBlock';
export { FeedbackBlock } from './components/blocks/FeedbackBlock';

// Community components
export * from './community';

// Hooks
export { useSSEStream } from './hooks/useSSEStream';

// Utilities
export { SSEClient } from './utils/sseClient';

// Types
export type {
  Message as MessageType,
  ResponseBlock,
  BlockType,
  TextBlock as TextBlockType,
  DrugBlock as DrugBlockType,
  FeedbackBlock as FeedbackBlockType,
  CustomBlock,
  BlockRenderer as BlockRendererType,
  BlockRendererRegistry,
  ApiConfig,
  SSEEvent,
  StreamMessage,
  ChatConfig,
  CommunityComponentProps,
} from './types';

// Configuration
export { DEFAULT_API_CONFIG, DEFAULT_THEME, DEFAULT_FEATURES } from './config/defaults';
