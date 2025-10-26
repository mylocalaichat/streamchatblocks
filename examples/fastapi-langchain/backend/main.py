"""
FastAPI Backend with LangChain and Ollama Integration

This FastAPI app demonstrates how to use StreamChatBlocks with LangChain's 
create-react-agent and local Ollama (qwen3:8b model).

Features:
- LangChain create-react-agent with Ollama
- In-memory checkpointer for conversation state
- Streaming responses with SSE
- Tool calling capabilities
- StreamChatBlocks integration

Development:
    Backend: uv run uvicorn main:app --reload
    Frontend: cd ../frontend && npm run dev

Production:
    cd ../frontend && npm run build  # Builds to backend/static
    uv run uvicorn main:app --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, AsyncGenerator
from pathlib import Path
import json
import asyncio
import time
import logging
import uuid
from datetime import datetime

# LangChain imports
from langchain_community.llms import Ollama
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langgraph.checkpoint.memory import MemorySaver

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="StreamChatBlocks LangChain API")

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
    # Mount assets directory
    app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")
    # Mount static directory for any other static files
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Initialize Ollama with qwen3:8b
try:
    llm = Ollama(
        model="qwen3:8b",  # Using qwen3:8b model
        base_url="http://localhost:11434",
        temperature=0.7,
    )
    logger.info("✓ Ollama initialized with qwen3:8b model")
except Exception as e:
    logger.error(f"❌ Failed to initialize Ollama: {e}")
    logger.error("Make sure Ollama is running: 'ollama serve' and model is available: 'ollama pull qwen3:8b'")

# In-memory checkpointer for conversation state
memory_saver = MemorySaver()
conversation_memories: Dict[str, ConversationBufferMemory] = {}

# Define tools for the agent
def get_patient_vitals(patient_id: str) -> str:
    """Get patient vital signs data"""
    # Simulate patient data
    vitals = {
        "patient_123": {
            "heart_rate": "72 bpm",
            "blood_pressure": "120/80 mmHg",
            "temperature": "98.6°F",
            "oxygen_saturation": "98%",
            "status": "Normal"
        }
    }
    return json.dumps(vitals.get(patient_id, {"error": "Patient not found"}))

def get_drug_information(drug_name: str) -> str:
    """Get detailed drug information"""
    drugs = {
        "aspirin": {
            "name": "Aspirin",
            "dosage": "325-650 mg every 4-6 hours as needed",
            "description": "A common pain reliever and anti-inflammatory medication",
            "interactions": ["Blood thinners", "NSAIDs", "Alcohol"],
            "warnings": [
                "Do not use if allergic to aspirin",
                "May cause stomach bleeding",
                "Consult doctor if pregnant or breastfeeding"
            ]
        },
        "ibuprofen": {
            "name": "Ibuprofen",
            "dosage": "200-400 mg every 4-6 hours as needed",
            "description": "Nonsteroidal anti-inflammatory drug (NSAID)",
            "interactions": ["Blood thinners", "ACE inhibitors", "Lithium"],
            "warnings": [
                "May increase risk of heart attack or stroke",
                "Can cause stomach bleeding",
                "Avoid if you have kidney disease"
            ]
        }
    }
    return json.dumps(drugs.get(drug_name.lower(), {"error": f"Drug {drug_name} not found"}))

def get_medical_trends(metric: str) -> str:
    """Get medical trend data for charts"""
    trends = {
        "pain": [
            {"label": "Day 1", "value": 8},
            {"label": "Day 2", "value": 7},
            {"label": "Day 3", "value": 5},
            {"label": "Day 4", "value": 3},
            {"label": "Day 5", "value": 2},
        ],
        "blood_pressure": [
            {"label": "Week 1", "value": 140},
            {"label": "Week 2", "value": 135},
            {"label": "Week 3", "value": 128},
            {"label": "Week 4", "value": 122},
        ]
    }
    return json.dumps(trends.get(metric.lower(), {"error": f"Trend data for {metric} not found"}))

# Create tools for the agent
tools = [
    Tool(
        name="get_patient_vitals",
        description="Get patient vital signs including heart rate, blood pressure, temperature, and oxygen saturation. Use patient ID as input.",
        func=get_patient_vitals
    ),
    Tool(
        name="get_drug_information",
        description="Get detailed information about medications including dosage, interactions, and warnings. Use drug name as input.",
        func=get_drug_information
    ),
    Tool(
        name="get_medical_trends",
        description="Get trend data for medical metrics like pain levels or blood pressure over time. Use metric name as input.",
        func=get_medical_trends
    )
]

# Create React agent prompt
react_prompt = PromptTemplate.from_template("""
You are a helpful AI medical assistant. You have access to tools to help answer questions about patient care, medications, and medical data.

When providing drug information, you should format it as a structured response that can be displayed as a drug block.
When providing vital signs or tabular data, format it appropriately for display.
When discussing trends over time, mention that chart visualization is available.

TOOLS:
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Question: {input}
{agent_scratchpad}
""")

# Create the React agent and executor
try:
    react_agent = create_react_agent(llm, tools, react_prompt)
    agent_executor = AgentExecutor(
        agent=react_agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5
    )
    logger.info("✓ LangChain React agent created successfully")
except Exception as e:
    logger.error(f"❌ Failed to create agent: {e}")
    agent_executor = None

class Message(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    session_id: Optional[str] = None

class FeedbackRequest(BaseModel):
    message_id: str
    feedback: str

def get_or_create_memory(session_id: str) -> ConversationBufferMemory:
    """Get or create conversation memory for a session"""
    if session_id not in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
    return conversation_memories[session_id]

async def generate_langchain_response(agent_executor: AgentExecutor, query: str, session_id: str = "default"):
    """Generate streaming response using LangChain agent"""
    try:
        # Get or create memory for this session
        memory = get_or_create_memory(session_id)
        agent_executor.memory = memory
        
        # Generate response asynchronously
        result = await agent_executor.ainvoke({"input": query})
        
        # Extract the output
        response = result.get("output", "I couldn't generate a response.")
        
        # Send as a single chat response block
        yield f"data: {json.dumps({'type': 'block', 'block': {'type': 'chatresponse', 'data': {'content': response, 'timestamp': datetime.now().isoformat()}}})}\n\n"
        
        # Send relevant blocks based on specific drug mentions (not general medication talk)
        specific_drugs = ['aspirin', 'ibuprofen', 'acetaminophen', 'tylenol', 'advil', 'motrin']
        mentioned_drug = None
        for drug in specific_drugs:
            if drug in response.lower():
                mentioned_drug = drug.capitalize()
                break
        
        if mentioned_drug:
            drug_block = {
                "type": "drug",
                "data": {
                    "name": mentioned_drug,
                    "dosage": "325mg" if mentioned_drug == "Aspirin" else "200-400mg",
                    "frequency": "Once daily" if mentioned_drug == "Aspirin" else "Every 4-6 hours as needed",
                    "interactions": ["Blood thinners", "Alcohol"] if mentioned_drug == "Aspirin" else ["Blood thinners", "ACE inhibitors"],
                    "sideEffects": ["Stomach upset", "Nausea"]
                }
            }
            yield f"data: {json.dumps({'type': 'block', 'block': drug_block})}\n\n"
        
        # Send vitals table only if specifically mentioned (not general mentions)
        if any(keyword in response.lower() for keyword in ["patient vitals", "vital signs", "blood pressure reading", "heart rate is", "temperature is"]):
            # Format data for TableBlock component
            table_block = {
                "type": "custom",
                "data": {
                    "componentType": "TableBlock",
                    "caption": "Patient Vitals",
                    "headers": ["Metric", "Value"],
                    "rows": [
                        ["Patient ID", "12345"],
                        ["Blood Pressure", "120/80 mmHg"],
                        ["Heart Rate", "72 bpm"],
                        ["Temperature", "98.6°F"],
                        ["Oxygen Saturation", "98%"],
                        ["Respiratory Rate", "16 breaths/min"]
                    ]
                }
            }
            yield f"data: {json.dumps({'type': 'block', 'block': table_block})}\n\n"
        
        # Send completion signal
        yield f"data: {json.dumps({'type': 'done'})}\n\n"
        
    except Exception as e:
        print(f"Error in generate_langchain_response: {e}")
        error_block = {
            "type": "chatresponse",
            "data": {
                "content": f"Sorry, I encountered an error: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
        }
        yield f"data: {json.dumps({'type': 'block', 'block': error_block})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

async def send_relevant_blocks(user_message: str, agent_response: str) -> AsyncGenerator[str, None]:
    """Send relevant blocks based on the conversation content"""
    user_lower = user_message.lower()
    response_lower = agent_response.lower()
    
    # Check for drug information
    drug_keywords = ["aspirin", "ibuprofen", "medication", "drug", "medicine"]
    if any(keyword in user_lower or keyword in response_lower for keyword in drug_keywords):
        # Extract drug name (simplified)
        drug_name = None
        if "aspirin" in user_lower or "aspirin" in response_lower:
            drug_name = "Aspirin"
        elif "ibuprofen" in user_lower or "ibuprofen" in response_lower:
            drug_name = "Ibuprofen"
        
        if drug_name:
            drug_block = {
                "type": "block",
                "block": {
                    "type": "drug",
                    "data": {
                        "name": drug_name,
                        "dosage": "325-650 mg every 4-6 hours as needed" if drug_name == "Aspirin" else "200-400 mg every 4-6 hours as needed",
                        "description": "A common pain reliever and anti-inflammatory medication" if drug_name == "Aspirin" else "Nonsteroidal anti-inflammatory drug (NSAID)",
                        "interactions": ["Blood thinners", "NSAIDs", "Alcohol"] if drug_name == "Aspirin" else ["Blood thinners", "ACE inhibitors", "Lithium"],
                        "warnings": [
                            "Do not use if allergic to aspirin" if drug_name == "Aspirin" else "May increase risk of heart attack or stroke",
                            "May cause stomach bleeding",
                            "Consult doctor if pregnant or breastfeeding" if drug_name == "Aspirin" else "Avoid if you have kidney disease"
                        ]
                    }
                }
            }
            yield f"data: {json.dumps(drug_block)}\n\n"
            await asyncio.sleep(0.1)
    
    # Check for vitals or data
    if any(keyword in user_lower for keyword in ["vitals", "vital signs", "data", "patient data", "health data"]):
        table_block = {
            "type": "block",
            "block": {
                "type": "custom",
                "data": {
                    "componentType": "TableBlock",
                    "caption": "Patient Vitals",
                    "headers": ["Metric", "Value", "Normal Range", "Status"],
                    "rows": [
                        ["Heart Rate", "72 bpm", "60-100 bpm", "✓ Normal"],
                        ["Blood Pressure", "120/80 mmHg", "90/60-120/80 mmHg", "✓ Normal"],
                        ["Temperature", "98.6°F", "97.8-99.1°F", "✓ Normal"],
                        ["Oxygen Saturation", "98%", "95-100%", "✓ Normal"],
                    ]
                }
            }
        }
        yield f"data: {json.dumps(table_block)}\n\n"
        await asyncio.sleep(0.1)
    
    # Check for trends or charts
    if any(keyword in user_lower for keyword in ["trend", "trends", "chart", "graph", "over time", "progression"]):
        chart_block = {
            "type": "block",
            "block": {
                "type": "custom",
                "data": {
                    "componentType": "ChartBlock",
                    "title": "Pain Level Progression",
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
        yield f"data: {json.dumps(chart_block)}\n\n"
        await asyncio.sleep(0.1)
    
    # Always send feedback block
    feedback_block = {
        "type": "block",
        "block": {
            "type": "feedback",
            "data": {
                "question": "Was this AI assistant helpful?",
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

@app.post("/api/stream")
async def stream_chat(request: ChatRequest):
    """
    Stream chat responses using LangChain agent with Ollama.
    """
    if agent_executor is None:
        raise HTTPException(status_code=500, detail="Agent not initialized. Check server logs.")
    
    session_id = request.session_id or str(uuid.uuid4())
    
    try:
        return StreamingResponse(
            generate_langchain_response(agent_executor, request.message, session_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    except Exception as e:
        logger.error(f"Error in stream_chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Handle feedback submission.
    """
    logger.info(f"Feedback received for message {request.message_id}: {request.feedback}")
    return {"status": "success", "message": "Feedback received"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Ollama connection using async
        await llm.ainvoke("Hello")
        ollama_status = "connected"
    except Exception as e:
        ollama_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "ollama": ollama_status,
        "memory_sessions": len(conversation_memories)
    }

@app.get("/api/sessions")
async def list_sessions():
    """List active conversation sessions"""
    return {
        "sessions": list(conversation_memories.keys()),
        "count": len(conversation_memories)
    }

@app.delete("/api/sessions/{session_id}")
async def clear_session(session_id: str):
    """Clear a specific conversation session"""
    if session_id in conversation_memories:
        del conversation_memories[session_id]
        return {"status": "success", "message": f"Session {session_id} cleared"}
    return {"status": "error", "message": "Session not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)