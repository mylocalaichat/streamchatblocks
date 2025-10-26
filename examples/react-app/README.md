# React App Example

This example demonstrates how to use StreamChatBlocks in a React application.

## Setup

### 1. Install Dependencies

First, install StreamChatBlocks in your React project:

```bash
npm install streamchatblocks
# or
yarn add streamchatblocks
```

### 2. Import and Use

```tsx
import { ChatWindow, TableBlock, ChartBlock } from 'streamchatblocks';
import type { ChatConfig } from 'streamchatblocks';

function App() {
  // Set up custom renderers
  const customRenderers = new Map();
  customRenderers.set('TableBlock', (block) => <TableBlock block={block} />);
  customRenderers.set('ChartBlock', (block) => <ChartBlock block={block} />);

  // Configure the chat
  const chatConfig: ChatConfig = {
    apiConfig: {
      baseUrl: 'http://localhost:8000',
    },
    customRenderers,
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatWindow config={chatConfig} title="AI Assistant" />
    </div>
  );
}
```

## Local Development with npm link

If you're developing StreamChatBlocks locally and want to test it in this example:

```bash
# In the streamchatblocks root directory
npm link

# In your React app directory
npm link streamchatblocks
```

## Running with FastAPI Backend

1. Start the FastAPI backend:
   ```bash
   cd ../fastapi-backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. Start your React app:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Open your browser to `http://localhost:3000`

## Features Demonstrated

- Basic chat interface
- SSE streaming from FastAPI backend
- Custom block renderers (Table, Chart)
- Custom theming
- Error handling
- Message callbacks

## Customization

### Custom Theme

```tsx
const chatConfig: ChatConfig = {
  apiConfig: { baseUrl: 'http://localhost:8000' },
  theme: {
    primaryColor: '#28a745',
    backgroundColor: '#f8f9fa',
    messageBackgroundColor: '#e9ecef',
    fontFamily: 'Arial, sans-serif',
  },
};
```

### Adding Custom Components

```tsx
import { MyCustomBlock } from './components/MyCustomBlock';

const customRenderers = new Map();
customRenderers.set('MyCustomBlock', (block) => (
  <MyCustomBlock block={block} onAction={handleAction} />
));
```

### Handling Events

```tsx
<ChatWindow
  config={chatConfig}
  onMessageSent={(msg) => console.log('Sent:', msg)}
  onError={(err) => console.error('Error:', err)}
/>
```

## TypeScript Support

StreamChatBlocks includes full TypeScript support. Import types as needed:

```tsx
import type { ChatConfig, Message, ResponseBlock } from 'streamchatblocks';
```
