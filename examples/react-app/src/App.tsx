import React from 'react';
import { ChatWindow, TableBlock, ChartBlock } from 'streamchatblocks';
import type { ChatConfig } from 'streamchatblocks';

/**
 * Example React App using StreamChatBlocks
 *
 * This demonstrates how to integrate StreamChatBlocks into your React application.
 */

function App() {
  // Set up custom renderers for community components
  const customRenderers = new Map();
  customRenderers.set('TableBlock', (block: any) => (
    <TableBlock block={block} />
  ));
  customRenderers.set('ChartBlock', (block: any) => (
    <ChartBlock block={block} />
  ));

  // Configure the chat component
  const chatConfig: ChatConfig = {
    apiConfig: {
      baseUrl: 'http://localhost:8000', // Your FastAPI backend URL
      streamEndpoint: '/stream',
      feedbackEndpoint: '/feedback',
      headers: {
        // Add custom headers if needed (e.g., authorization)
        // 'Authorization': 'Bearer your-token',
      },
    },
    customRenderers,
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#ffffff',
      messageBackgroundColor: '#f5f5f5',
    },
    features: {
      feedback: true,
      markdown: true,
    },
  };

  const handleMessageSent = (message: string) => {
    console.log('Message sent:', message);
  };

  const handleError = (error: Error) => {
    console.error('Chat error:', error);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        height: '600px'
      }}>
        <ChatWindow
          config={chatConfig}
          title="Medical Assistant"
          onMessageSent={handleMessageSent}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default App;
