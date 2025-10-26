# FastAPI Backend Example

This is a sample FastAPI backend that demonstrates how to integrate with StreamChatBlocks.

## Features

- Server-Sent Events (SSE) streaming for real-time responses
- Multiple block types: text, drug information, tables, charts, feedback
- CORS enabled for local development
- Example endpoints for chat streaming and feedback

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## Running the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

## API Endpoints

### POST /stream

Stream chat responses using Server-Sent Events.

**Request Body:**
```json
{
  "message": "What is aspirin?",
  "history": []
}
```

**Response:** SSE stream with JSON events

### POST /feedback

Submit user feedback.

**Request Body:**
```json
{
  "message_id": "123",
  "feedback": "Very helpful"
}
```

### GET /health

Health check endpoint.

## SSE Event Format

The backend sends SSE events in the following formats:

### Token Event (for streaming text)
```json
{
  "type": "token",
  "content": "character"
}
```

### Block Event (for structured data)
```json
{
  "type": "block",
  "block": {
    "type": "drug",
    "data": {
      "name": "Aspirin",
      "dosage": "325-650 mg",
      ...
    }
  }
}
```

### Done Event (completion signal)
```json
{
  "type": "done"
}
```

## Integrating with Your Frontend

```tsx
import { ChatWindow } from 'streamchatblocks';

function App() {
  return (
    <ChatWindow
      config={{
        apiConfig: {
          baseUrl: 'http://localhost:8000',
          streamEndpoint: '/stream',
          feedbackEndpoint: '/feedback',
        },
      }}
      title="Medical Assistant"
    />
  );
}
```

## Customizing the Response

Modify the `generate_sse_response` function in `main.py` to:
- Integrate with your AI model
- Add custom business logic
- Return different block types based on user input
- Implement authentication and authorization

## Example Queries

Try these queries to see different block types:

- "What is aspirin?" - Returns drug information block
- "Show me vitals" - Returns table block
- "Show me the trend" - Returns chart block
- Any question will include a feedback block at the end
