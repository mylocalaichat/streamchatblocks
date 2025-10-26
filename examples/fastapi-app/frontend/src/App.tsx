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
    // Using default dark theme - you can customize colors here
    theme: {
      primaryColor: '#c17767',
      backgroundColor: '#1f1f1f',
      messageBackgroundColor: 'transparent',
    },
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#1f1f1f',
    }}>
      <ChatWindow
        config={chatConfig}
        title="AI Medical Assistant"
        onMessageSent={(msg) => console.log('Message sent:', msg)}
        onError={(err) => console.error('Chat error:', err)}
      />
    </div>
  );
}

export default App;
