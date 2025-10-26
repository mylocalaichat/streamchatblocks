import { ChatWindow } from 'streamchatblocks';
import { TableBlock, ChartBlock } from 'streamchatblocks';
import 'streamchatblocks/dist/style.css';
import type { ChatConfig } from 'streamchatblocks';

function App() {
  // Register custom community components
  const customRenderers = new Map();
  customRenderers.set('TableBlock', (block: any) => <TableBlock block={block} />);
  customRenderers.set('ChartBlock', (block: any) => <ChartBlock block={block} />);

  // Configure the chat
  const chatConfig: ChatConfig = {
    apiConfig: {
      baseUrl: window.location.origin, // Same server (FastAPI)
      streamEndpoint: '/api/stream',
      feedbackEndpoint: '/api/feedback',
    },
    customRenderers,
    theme: {
      primaryColor: '#667eea',
      backgroundColor: '#ffffff',
      messageBackgroundColor: '#f5f5f5',
    },
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '700px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}>
        <ChatWindow
          config={chatConfig}
          title="AI Medical Assistant"
          onMessageSent={(msg) => console.log('Message sent:', msg)}
          onError={(err) => console.error('Chat error:', err)}
        />
      </div>
    </div>
  );
}

export default App;
