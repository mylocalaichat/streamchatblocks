import { ApiConfig } from '../types';

/**
 * Default API configuration for FastAPI integration
 */
export const DEFAULT_API_CONFIG: Partial<ApiConfig> = {
  chatEndpoint: '/chat',
  streamEndpoint: '/stream',
  feedbackEndpoint: '/feedback',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Default theme configuration
 */
export const DEFAULT_THEME = {
  primaryColor: '#007bff',
  backgroundColor: '#ffffff',
  messageBackgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

/**
 * Default feature flags
 */
export const DEFAULT_FEATURES = {
  feedback: true,
  markdown: true,
  codeHighlighting: true,
};
