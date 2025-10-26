import { ChatWindow } from 'streamchatblocks';
import { TableBlock, ChartBlock } from 'streamchatblocks';
import 'streamchatblocks/dist/style.css';
import type { ChatConfig } from 'streamchatblocks';

function App() {
  // Register custom community components
  const customRenderers = new Map();
  customRenderers.set('TableBlock', (block: any) => <TableBlock block={block} />);
  customRenderers.set('ChartBlock', (block: any) => <ChartBlock block={block} />);

  // Configure the chat with LangChain theming
  const chatConfig: ChatConfig = {
    apiConfig: {
      baseUrl: window.location.origin, // Same server (FastAPI)
      streamEndpoint: '/api/stream',
      feedbackEndpoint: '/api/feedback',
    },
    customRenderers,
    // LangChain-inspired theme
    theme: {
      primaryColor: '#10b981', // Green accent for AI/tech feel
      backgroundColor: '#0f172a', // Dark slate background
      messageBackgroundColor: 'transparent',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#0f172a',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      <ChatWindow
        config={chatConfig}
        title="LangChain AI Assistant"
        onMessageSent={(msg) => console.log('Message sent:', msg)}
        onError={(err) => console.error('Chat error:', err)}
      />
    </div>
  );
}

export default App;