# StreamChatBlocks

A React component library for building AI chat interfaces with Server-Sent Events (SSE) streaming support and FastAPI compatibility.

## Features

- **SSE Streaming**: Real-time streaming responses from your backend
- **FastAPI Ready**: Designed to work seamlessly with FastAPI backends - **no separate frontend server needed**!
- **Extensible**: Easy-to-use plugin system for custom block types
- **Community Components**: Share and use community-contributed components
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Storybook**: Interactive component documentation and development
- **Customizable**: Themeable components with sensible defaults
- **Production Ready**: Built for production use with modern tooling

## Installation

```bash
npm install streamchatblocks
```

## Quick Start

### Option 1: FastAPI with Integrated UI (Recommended)

**No separate frontend server needed!** FastAPI serves both the UI and API.

Using Make (easiest):
```bash
make setup-example && make run-example
```

Or manually:
```bash
npm install
npm run build
./examples/fastapi-backend/setup.sh
cd examples/fastapi-backend
uv run uvicorn main:app --reload
```

Then open `http://localhost:8000` - Done!

See the [FastAPI example](examples/fastapi-backend/) for complete setup.

### Option 2: As a React Component

Use StreamChatBlocks in your existing React app:

```tsx
import { ChatWindow } from 'streamchatblocks';
import 'streamchatblocks/dist/style.css';

function App() {
  return (
    <ChatWindow
      config={{
        apiConfig: {
          baseUrl: 'http://localhost:8000',
        },
      }}
      title="AI Assistant"
    />
  );
}

export default App;
```

### FastAPI Backend (for both options)

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import json

app = FastAPI()

async def generate_response(message: str):
    # Stream tokens
    for char in "Hello! How can I help you?":
        yield f"data: {json.dumps({'type': 'token', 'content': char})}\n\n"

    # Send completion
    yield f"data: {json.dumps({'type': 'done'})}\n\n"

@app.post("/stream")
async def stream_chat(request: dict):
    return StreamingResponse(
        generate_response(request["message"]),
        media_type="text/event-stream"
    )
```

See the [FastAPI example](examples/fastapi-backend/) for a complete implementation.

## Core Components

### ChatWindow

The main chat interface component.

```tsx
<ChatWindow
  config={{
    apiConfig: {
      baseUrl: 'http://localhost:8000',
      streamEndpoint: '/stream',
      feedbackEndpoint: '/feedback',
    },
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#ffffff',
    },
    features: {
      feedback: true,
      markdown: true,
    },
  }}
  title="Chat"
  initialMessages={[]}
  onMessageSent={(msg) => console.log('Sent:', msg)}
  onError={(err) => console.error('Error:', err)}
/>
```

### Built-in Block Types

StreamChatBlocks includes several built-in block types:

#### DrugBlock
Display medication information with dosage, warnings, and interactions.

```json
{
  "type": "block",
  "block": {
    "type": "drug",
    "data": {
      "name": "Aspirin",
      "dosage": "325-650 mg every 4-6 hours",
      "warnings": ["May cause stomach bleeding"],
      "interactions": ["Blood thinners"]
    }
  }
}
```

#### FeedbackBlock
Collect user feedback with predefined options or custom input.

```json
{
  "type": "block",
  "block": {
    "type": "feedback",
    "data": {
      "question": "Was this helpful?",
      "options": ["Yes", "No"],
      "allowCustom": true
    }
  }
}
```

#### TextBlock
Display formatted text content.

```json
{
  "type": "block",
  "block": {
    "type": "text",
    "data": {
      "content": "Additional information here"
    }
  }
}
```

## Community Components

Extend StreamChatBlocks with custom components for your use case.

### Using Community Components

```tsx
import { ChatWindow, TableBlock, ChartBlock } from 'streamchatblocks';

const customRenderers = new Map();
customRenderers.set('TableBlock', (block) => (
  <TableBlock block={block} />
));
customRenderers.set('ChartBlock', (block) => (
  <ChartBlock block={block} />
));

function App() {
  return (
    <ChatWindow
      config={{
        apiConfig: { baseUrl: 'http://localhost:8000' },
        customRenderers,
      }}
    />
  );
}
```

### Creating Custom Components

```tsx
import React from 'react';
import { CommunityComponentProps } from 'streamchatblocks';

export const MyCustomBlock: React.FC<CommunityComponentProps> = ({ block, onAction }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '12px' }}>
      <h4>{block.data.title}</h4>
      <p>{block.data.description}</p>
      <button onClick={() => onAction?.('click', { id: block.data.id })}>
        Action
      </button>
    </div>
  );
};
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on creating community components.

## API Configuration

### Default Endpoints

```typescript
{
  chatEndpoint: '/chat',      // POST endpoint for sending messages
  streamEndpoint: '/stream',   // POST endpoint for SSE streaming
  feedbackEndpoint: '/feedback', // POST endpoint for feedback
}
```

### Custom Configuration

```tsx
<ChatWindow
  config={{
    apiConfig: {
      baseUrl: 'https://api.example.com',
      chatEndpoint: '/api/chat',
      streamEndpoint: '/api/stream',
      feedbackEndpoint: '/api/feedback',
      headers: {
        'Authorization': 'Bearer token',
      },
    },
  }}
/>
```

## SSE Event Format

Your backend should send events in this format:

### Token Event (Streaming Text)
```json
{
  "type": "token",
  "content": "word or character"
}
```

### Block Event (Structured Data)
```json
{
  "type": "block",
  "block": {
    "type": "drug",
    "data": { ... }
  }
}
```

### Done Event (Completion)
```json
{
  "type": "done"
}
```

### Error Event
```json
{
  "type": "error",
  "error": "Error message"
}
```

## Theming

Customize the appearance of your chat interface:

```tsx
<ChatWindow
  config={{
    apiConfig: { baseUrl: 'http://localhost:8000' },
    theme: {
      primaryColor: '#28a745',
      backgroundColor: '#f8f9fa',
      messageBackgroundColor: '#e9ecef',
      fontFamily: 'Arial, sans-serif',
    },
  }}
/>
```

## Development

### Quick Commands with Make

```bash
make help           # Show all available commands
make install        # Install npm dependencies
make build          # Build the library
make storybook      # Run Storybook (interactive docs)
make lint           # Run ESLint
make clean          # Clean build artifacts

# FastAPI Example
make setup-example  # Build library and setup example
make run-example    # Run FastAPI server
```

### Or use npm directly

```bash
npm install         # Install dependencies
npm run build       # Build library
npm run storybook   # Run Storybook
npm run lint        # Lint code
```

### Project Structure

```
streamchatblocks/
├── src/
│   ├── components/     # Core components
│   ├── community/      # Community components
│   ├── hooks/          # React hooks
│   ├── utils/          # Utilities
│   ├── types/          # TypeScript types
│   └── config/         # Default configs
├── examples/           # Usage examples
└── dist/               # Build output
```

## Examples

Check out the [examples](examples/) directory for complete implementations:

- [FastAPI Backend](examples/fastapi-backend/) - Complete FastAPI integration with SSE

## Publishing to npm

Once you're ready to publish:

1. Update version in `package.json`
2. Build the library: `npm run build`
3. Login to npm: `npm login`
4. Publish: `npm publish`

For local development in another project:

```bash
# In streamchatblocks directory
npm link

# In your project directory
npm link streamchatblocks
```

## TypeScript Support

StreamChatBlocks is written in TypeScript and includes comprehensive type definitions.

```typescript
import type { ChatConfig, Message, ResponseBlock } from 'streamchatblocks';

const config: ChatConfig = {
  apiConfig: {
    baseUrl: 'http://localhost:8000',
  },
};

const message: Message = {
  id: '1',
  role: 'user',
  content: 'Hello',
  timestamp: new Date(),
};
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- **Add Community Components**: Share reusable components
- **Report Bugs**: Open issues for bugs you find
- **Suggest Features**: Propose new features or improvements
- **Improve Documentation**: Help us improve our docs
- **Write Tests**: Help us increase test coverage

## License

MIT

## Support

- **Documentation**: Check this README and [CONTRIBUTING.md](CONTRIBUTING.md)
- **Examples**: See the [examples](examples/) directory
- **Issues**: [GitHub Issues](https://github.com/yourusername/streamchatblocks/issues)
- **Storybook**: Run `npm run storybook` for interactive component docs

## Roadmap

- [ ] Add more built-in block types (images, videos, code)
- [ ] Markdown support in messages
- [ ] Code syntax highlighting
- [ ] Message persistence
- [ ] File upload support
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Unit and integration tests

## Credits

Built with:
- React
- TypeScript
- Vite
- Storybook

Made for the community by developers who love clean, reusable components.
