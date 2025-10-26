"""
FastAPI Backend for StreamChatBlocks

This FastAPI app serves both the frontend (React build) and API endpoints.

Development:
    Backend: uv run uvicorn main:app --reload
    Frontend: cd ../frontend && npm run dev

Production:
    cd ../frontend && npm run build  # Builds to backend/static
    uv run uvicorn main:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from pathlib import Path
import json
import asyncio
import time

app = FastAPI(title="StreamChatBlocks API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (frontend build)
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")


class Message(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []


class FeedbackRequest(BaseModel):
    message_id: str
    feedback: str


async def generate_sse_response(user_message: str):
    """
    Generate SSE (Server-Sent Events) stream for chat response.

    This simulates an AI response with different block types.
    In production, replace this with your actual AI model.
    """

    # Simulate streaming text response
    response_text = "Let me help you with that. "
    words = response_text.split()
    for i, word in enumerate(words):
        if i == 0:
            yield f"data: {json.dumps({'type': 'token', 'content': word})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'token', 'content': ' ' + word})}\n\n"
        await asyncio.sleep(0.08)  # Simulate streaming delay

    # Check if the user is asking about a drug
    if "aspirin" in user_message.lower():
        # Send a drug block
        drug_block = {
            "type": "block",
            "block": {
                "type": "drug",
                "data": {
                    "name": "Aspirin",
                    "dosage": "325-650 mg every 4-6 hours as needed",
                    "description": "A common pain reliever and anti-inflammatory medication",
                    "interactions": ["Blood thinners", "NSAIDs", "Alcohol"],
                    "warnings": [
                        "Do not use if allergic to aspirin",
                        "May cause stomach bleeding",
                        "Consult doctor if pregnant or breastfeeding"
                    ]
                }
            }
        }
        yield f"data: {json.dumps(drug_block)}\n\n"
        await asyncio.sleep(0.1)

    # Check if the user is asking about vitals or data
    if "vitals" in user_message.lower() or "data" in user_message.lower():
        # Send a table block
        table_block = {
            "type": "block",
            "block": {
                "type": "custom",
                "data": {
                    "componentType": "TableBlock",
                    "props": {
                        "caption": "Patient Vitals",
                        "headers": ["Metric", "Value", "Normal Range", "Status"],
                        "rows": [
                            ["Heart Rate", "72 bpm", "60-100 bpm", "✓ Normal"],
                            ["Blood Pressure", "120/80 mmHg", "90/60-120/80 mmHg", "✓ Normal"],
                            ["Temperature", "98.6°F", "97.8-99.1°F", "✓ Normal"],
                        ]
                    }
                }
            }
        }
        yield f"data: {json.dumps(table_block)}\n\n"
        await asyncio.sleep(0.1)

    # Check if the user is asking about trends or charts
    if "trend" in user_message.lower() or "chart" in user_message.lower():
        # Send a chart block
        chart_block = {
            "type": "block",
            "block": {
                "type": "custom",
                "data": {
                    "componentType": "ChartBlock",
                    "props": {
                        "title": "Symptom Severity Over Time",
                        "data": [
                            {"label": "Day 1", "value": 8},
                            {"label": "Day 2", "value": 7},
                            {"label": "Day 3", "value": 5},
                            {"label": "Day 4", "value": 3},
                            {"label": "Day 5", "value": 2},
                        ],
                        "color": "#dc3545"
                    }
                }
            }
        }
        yield f"data: {json.dumps(chart_block)}\n\n"
        await asyncio.sleep(0.1)

    # Always send a feedback block at the end
    feedback_block = {
        "type": "block",
        "block": {
            "type": "feedback",
            "data": {
                "question": "Was this information helpful?",
                "options": ["Very helpful", "Somewhat helpful", "Not helpful"],
                "allowCustom": True
            }
        }
    }
    yield f"data: {json.dumps(feedback_block)}\n\n"
    await asyncio.sleep(0.1)

    # Send completion signal
    yield f"data: {json.dumps({'type': 'done'})}\n\n"


@app.get("/")
async def root():
    """Serve the frontend React app"""
    html_file = static_dir / "index.html"
    if html_file.exists():
        return FileResponse(html_file)
    return {"message": "Frontend not built. Run 'cd ../frontend && npm run build'"}


# API endpoints
@app.post("/api/stream")
async def stream_chat(request: ChatRequest):
    """
    Stream chat responses using SSE.

    This is the main endpoint that the ChatWindow component will call.
    """
    return StreamingResponse(
        generate_sse_response(request.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Handle feedback submission.

    In production, store this in a database.
    """
    print(f"Feedback received for message {request.message_id}: {request.feedback}")
    return {"status": "success", "message": "Feedback received"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
