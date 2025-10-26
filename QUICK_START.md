# Quick Start Guide

Get started with StreamChatBlocks in 5 minutes!

## Step 1: Install the Package

```bash
npm install streamchatblocks
```

## Step 2: Set Up Your React Component

```tsx
import { ChatWindow } from 'streamchatblocks';

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

## Step 3: Set Up Your FastAPI Backend

Create `main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

async def generate_response(message: str):
    # Stream response
    text = "Hello! How can I help you today?"
    for char in text:
        yield f"data: {json.dumps({'type': 'token', 'content': char})}\n\n"

    # Signal completion
    yield f"data: {json.dumps({'type': 'done'})}\n\n"

@app.post("/stream")
async def stream_chat(request: dict):
    return StreamingResponse(
        generate_response(request["message"]),
        media_type="text/event-stream"
    )
```

## Step 4: Install FastAPI Dependencies

```bash
pip install fastapi uvicorn
```

## Step 5: Run Everything

Terminal 1 (Backend):
```bash
uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
npm start
```

## Next Steps

- Add custom block types (see `src/community/` for examples)
- Customize the theme
- Add authentication headers
- Integrate with your AI model

For more details, see the full [README.md](README.md) and [examples/](examples/).

## Common Issues

### CORS Errors
Make sure your FastAPI backend has CORS middleware enabled (see Step 3).

### Connection Refused
Ensure your FastAPI backend is running on `http://localhost:8000`.

### No Streaming
Check that your backend is returning `text/event-stream` media type.

## Need Help?

- Check the [examples/](examples/) directory
- Read the full [README.md](README.md)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
