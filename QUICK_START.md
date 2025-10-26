# Quick Start Guide

Get started with StreamChatBlocks in 5 minutes!

## FastAPI with Integrated UI (No Separate Frontend!)

This is the recommended approach - FastAPI serves both the UI and API.

### Method 1: Using Make (Easiest)

```bash
# Clone the repo
git clone https://github.com/yourusername/streamchatblocks.git
cd streamchatblocks

# Install dependencies
npm install

# Setup and run
make setup-example && make run-example
```

Open `http://localhost:8000` - Done!

### Method 2: Manual Setup

```bash
# Step 1: Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Step 2: Clone and install
git clone https://github.com/yourusername/streamchatblocks.git
cd streamchatblocks
npm install

# Step 3: Build and setup
npm run build
./examples/fastapi-backend/setup.sh

# Step 4: Run the server
cd examples/fastapi-backend
uv run uvicorn main:app --reload

# Step 5: Open browser
# Navigate to http://localhost:8000
```

That's it! You now have a fully functional AI chat interface served by FastAPI.

## Available Make Commands

```bash
# From project root:
make help           # Show all available commands
make install        # Install npm dependencies
make build          # Build the library
make storybook      # Run interactive component docs
make setup-example  # Build and setup FastAPI example
make run-example    # Run FastAPI server

# From examples/fastapi-backend:
make help           # Show FastAPI-specific commands
make setup          # Setup static files
make run            # Run dev server
make prod           # Run production server
```

## How It Works

1. FastAPI serves an HTML file at `/` (root)
2. The HTML loads the StreamChatBlocks UMD bundle from `/static/`
3. React is loaded from CDN
4. The chat UI connects to `/stream` endpoint for SSE streaming
5. Everything runs on a single server - no CORS issues!

## Try These Queries

- "What is aspirin?" - See a drug information block
- "Show me vitals" - See a data table
- "Show me the trend" - See a chart
- Any question - Get a feedback form

## Customizing

### Change Theme

Edit `examples/fastapi-backend/static/index.html`:

```javascript
const config = {
    theme: {
        primaryColor: '#28a745',  // Your color!
        backgroundColor: '#ffffff',
        messageBackgroundColor: '#f5f5f5'
    }
};
```

### Add Your AI Model

Edit `examples/fastapi-backend/main.py`:

```python
async def generate_sse_response(user_message: str):
    # Replace this with your AI model
    response = await your_ai_model.generate(user_message)

    for token in response:
        yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
```

## Using in Your Own FastAPI App

1. Install: `npm install streamchatblocks`
2. Build: `npm run build`
3. Copy `dist/index.umd.js` and `dist/style.css` to your `static/` folder
4. Create an HTML file that loads the bundle
5. Add SSE streaming endpoints

See the [FastAPI example](examples/fastapi-backend/) for the complete template!

## Alternative: Use as React Component

If you have an existing React app:

```bash
npm install streamchatblocks
```

```tsx
import { ChatWindow } from 'streamchatblocks';
import 'streamchatblocks/dist/style.css';

function App() {
  return (
    <ChatWindow
      config={{
        apiConfig: { baseUrl: 'http://localhost:8000' }
      }}
      title="AI Assistant"
    />
  );
}
```

## Common Issues

### Port Already in Use
Change the port: `uvicorn main:app --port 8001 --reload`

### Files Not Found
Run the setup script again: `./examples/fastapi-backend/setup.sh`

### UI Not Loading
Check that the static files were copied: `ls examples/fastapi-backend/static/`

## Need Help?

- Check the [examples/fastapi-backend/](examples/fastapi-backend/) directory
- Read the full [README.md](README.md)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
