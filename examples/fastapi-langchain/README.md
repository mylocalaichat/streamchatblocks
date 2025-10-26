# FastAPI + LangChain + Ollama with StreamChatBlocks

A complete example application showing how to use StreamChatBlocks with **LangChain's create-react-agent**, **local Ollama** (qwen3:8b model), and **in-memory checkpointer** for conversation state management.

## 🚀 Features

- **🤖 LangChain Integration**: Uses create-react-agent with custom tools
- **🦙 Local Ollama**: Runs qwen3:8b model locally (no API keys needed)
- **💾 Memory Management**: In-memory conversation checkpointer
- **🛠️ Tool Calling**: Built-in tools for medical data, drug info, and trends
- **📊 Rich Responses**: Automatic block generation (drugs, tables, charts)
- **🎨 Modern UI**: Dark theme with LangChain-inspired styling
- **🔄 Streaming**: Real-time SSE streaming responses

## 🏗️ Architecture

```
fastapi-langchain/
├── backend/
│   ├── main.py              # FastAPI + LangChain agent
│   ├── requirements.txt     # Python dependencies
│   └── static/              # Production build (generated)
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # React app with LangChain theme
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Modern styling
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Build config
└── Makefile                 # All commands with Ollama checks
```

## 🔧 Prerequisites

### 1. Node.js & Python
- Node.js 18+ and npm
- [uv](https://astral.sh/uv) for Python package management

### 2. Ollama Setup
```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai

# Start Ollama server
ollama serve

# Pull the qwen3:8b model (8GB download)
ollama pull qwen3:8b
```

### 3. Verify Setup
```bash
# Check everything is ready
make check-ollama
```

## 🚦 Quick Start

### Option 1: Development Mode (Recommended)

```bash
# One-time setup
make setup

# Check Ollama is ready
make check-ollama

# Run both servers in parallel
make dev
```

This starts:
- **Frontend dev server**: `http://localhost:3000` (with hot-reload)
- **Backend API server**: `http://localhost:8000`
- **Ollama server**: `http://localhost:11434`

### Option 2: Production Mode (Single Server)

```bash
# Build frontend and serve everything from FastAPI
make build && make prod
```

Open: `http://localhost:8000`

## 🤖 LangChain Agent Details

### Agent Architecture

The backend uses LangChain's **create-react-agent** pattern:

```python
# Agent Tools
tools = [
    get_patient_vitals,    # Retrieves patient vital signs
    get_drug_information,  # Drug dosage, interactions, warnings
    get_medical_trends,    # Chart data for symptoms over time
]

# React Agent with Ollama
agent = create_react_agent(llm=Ollama("qwen3:8b"), tools=tools)
agent_executor = AgentExecutor(agent=agent, tools=tools, memory=memory)
```

### Memory Management

Each conversation session gets its own memory:

```python
# In-memory checkpointer
memory_saver = MemorySaver()
conversation_memories: Dict[str, ConversationBufferMemory] = {}

def get_or_create_memory(session_id: str) -> ConversationBufferMemory:
    if session_id not in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
    return conversation_memories[session_id]
```

### Built-in Tools

1. **`get_patient_vitals(patient_id)`**: Returns heart rate, BP, temperature, O2 sat
2. **`get_drug_information(drug_name)`**: Dosage, interactions, warnings for medications
3. **`get_medical_trends(metric)`**: Time-series data for pain levels, vitals trends

## 💬 Example Conversations

### Drug Information
**User**: "Tell me about aspirin"

**Agent**: 
- Uses `get_drug_information("aspirin")` tool
- Streams text response
- Automatically generates `DrugBlock` with structured data

### Patient Data
**User**: "Show me patient 123's vitals"

**Agent**:
- Uses `get_patient_vitals("patient_123")` tool  
- Generates `TableBlock` with vital signs
- Includes normal ranges and status indicators

### Trend Analysis
**User**: "I want to see pain trends over time"

**Agent**:
- Uses `get_medical_trends("pain")` tool
- Creates `ChartBlock` with time-series visualization
- Shows pain reduction over 5 days

## 🎨 UI Customization

The frontend uses a **LangChain-inspired dark theme**:

```tsx
theme: {
  primaryColor: '#10b981',     // Green accent for AI/tech feel
  backgroundColor: '#0f172a',   // Dark slate background  
  textColor: '#e2e8f0',        // Light gray text
  userMessageBackgroundColor: '#1e293b',
  assistantMessageBackgroundColor: '#134e4a',
}
```

Typography: **Inter font** for modern AI application aesthetics.

## 🔧 Available Commands

```bash
# Setup & Prerequisites
make check-ollama          # Verify Ollama + model setup
make install-uv           # Install uv package manager
make link-lib             # Link streamchatblocks library
make install              # Install all dependencies
make setup                # Complete setup process

# Development
make dev-frontend         # Frontend only (port 3000)
make dev-backend          # Backend only (port 8000)  
make dev                  # Both servers in parallel

# Production
make build               # Build frontend to backend/static/
make prod                # Single server production mode

# Maintenance
make clean               # Remove all build artifacts
```

## 🐛 Troubleshooting

### Ollama Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama && ollama serve

# Re-download model if corrupted
ollama rm qwen2.5:7b && ollama pull qwen2.5:7b
```

### Backend Issues

```bash
# Check backend logs
cd backend && uv run uvicorn main:app --reload --log-level debug

# Test API directly
curl http://localhost:8000/api/health
```

### Frontend Issues

```bash
# Clear cache and reinstall
cd frontend && rm -rf node_modules package-lock.json && npm install

# Check library linking
npm list streamchatblocks
```

## 🔌 API Endpoints

- **`POST /api/stream`**: SSE chat streaming with LangChain agent
- **`POST /api/feedback`**: Submit user feedback on responses  
- **`GET /api/health`**: Health check + Ollama connection status
- **`GET /api/sessions`**: List active conversation sessions
- **`DELETE /api/sessions/{id}`**: Clear specific session memory

## 🛠️ Extending the Agent

### Adding New Tools

1. **Create the tool function**:
```python
def get_lab_results(patient_id: str) -> str:
    # Your implementation
    return json.dumps(results)
```

2. **Register with LangChain**:
```python
tools.append(Tool(
    name="get_lab_results",
    description="Get patient laboratory test results",
    func=get_lab_results
))
```

3. **Update block generation** in `send_relevant_blocks()` for UI components.

### Customizing the Model

Change the Ollama model in `backend/main.py`:

```python
llm = Ollama(
    model="llama2:13b",  # or "mistral:7b", "codellama:7b", etc.
    base_url="http://localhost:11434",
    temperature=0.7,
)
```

## 📊 Performance Notes

- **Model Size**: qwen2.5:7b requires ~8GB RAM
- **Concurrent Users**: Memory usage scales with active sessions
- **Response Time**: ~2-5 seconds for complex tool-using queries
- **Streaming**: Real-time character-by-character output

## 🔐 Production Considerations

- **Memory Management**: Implement session cleanup for long-running deployments
- **Rate Limiting**: Add request throttling for public deployments  
- **Monitoring**: Log agent tool usage and response times
- **Security**: Validate tool inputs and sanitize outputs
- **Scaling**: Consider moving to persistent storage for conversation history

## 📚 Additional Resources

- [LangChain Documentation](https://docs.langchain.com/)
- [Ollama Models](https://ollama.ai/library)
- [StreamChatBlocks Docs](../../README.md)
- [qwen2.5 Model Card](https://ollama.ai/library/qwen2.5)

## 🤝 Contributing

This example demonstrates the core integration patterns. Feel free to:

- Add more sophisticated tools
- Implement persistent storage
- Create domain-specific block types
- Optimize performance for your use case

---

**🎯 Goal**: Showcase how StreamChatBlocks integrates seamlessly with modern AI agent frameworks like LangChain, enabling rich, interactive, tool-enhanced conversations with local AI models.