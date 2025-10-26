.PHONY: help install setup dev-frontend dev-backend dev build clean install-uv link-lib check-ollama

help:
	@echo "StreamChatBlocks LangChain App - Available Commands"
	@echo ""
	@echo "Prerequisites:"
	@echo "  make check-ollama  - Check Ollama installation and qwen2.5:7b model"
	@echo ""
	@echo "Setup:"
	@echo "  make install-uv    - Install uv package manager"
	@echo "  make link-lib      - Link streamchatblocks library for development"
	@echo "  make install       - Install frontend and backend dependencies"
	@echo "  make setup         - Complete setup (install-uv + link-lib + install)"
	@echo ""
	@echo "Development (Two Servers):"
	@echo "  make dev-frontend  - Run frontend dev server (port 3000)"
	@echo "  make dev-backend   - Run backend dev server (port 8000)"
	@echo "  make dev           - Run both in parallel (recommended)"
	@echo ""
	@echo "Production (Single Server):"
	@echo "  make build         - Build frontend for production"
	@echo "  make prod          - Run production server (port 8000)"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean         - Clean build artifacts"
	@echo ""
	@echo "Quick Start:"
	@echo "  make check-ollama && make setup && make dev"

check-ollama:
	@echo "Checking Ollama installation..."
	@command -v ollama >/dev/null 2>&1 || { \
		echo "❌ Ollama not found!"; \
		echo "Install from: https://ollama.ai"; \
		exit 1; \
	}
	@echo "✓ Ollama is installed"
	@echo "Checking if Ollama is running..."
	@curl -s http://localhost:11434/api/tags >/dev/null 2>&1 || { \
		echo "❌ Ollama server not running!"; \
		echo "Start with: ollama serve"; \
		exit 1; \
	}
	@echo "✓ Ollama server is running"
	@echo "Checking for qwen3:8b model..."
	@curl -s http://localhost:11434/api/tags | grep -q "qwen3:8b" || { \
		echo "❌ qwen3:8b model not found!"; \
		echo "Install with: ollama pull qwen3:8b"; \
		echo "Note: This is a large download (~8GB)"; \
		exit 1; \
	}
	@echo "✓ qwen3:8b model is available"
	@echo ""
	@echo "🎉 Ollama setup is ready!"

install-uv:
	@echo "Installing uv..."
	@command -v uv >/dev/null 2>&1 || curl -LsSf https://astral.sh/uv/install.sh | sh
	@echo "✓ uv is installed"

link-lib:
	@echo "Linking streamchatblocks library..."
	@cd ../../ && npm link
	@cd frontend && npm link streamchatblocks
	@echo "✓ Library linked"

install:
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Installing backend dependencies..."
	@cd backend && uv venv && uv pip install -r requirements.txt
	@echo "✓ Dependencies installed"

setup: install-uv link-lib install
	@echo ""
	@echo "✓ Setup complete!"
	@echo ""
	@echo "Before running the app, make sure Ollama is set up:"
	@echo "  make check-ollama"
	@echo ""
	@echo "To run in development mode:"
	@echo "  make dev"

dev-frontend: check-setup
	@echo "Starting frontend dev server on port 3000..."
	@echo "Open http://localhost:3000"
	@cd frontend && npm run dev

dev-backend: check-ollama-running
	@echo "Starting LangChain backend dev server on port 8000..."
	@cd backend && uv run uvicorn main:app --reload

dev: check-setup check-ollama-running
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "Ollama:   http://localhost:11434"
	@echo ""
	@echo "Press Ctrl+C to stop both servers"
	@$(MAKE) -j2 dev-frontend dev-backend

check-setup:
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "❌ Frontend dependencies not installed!"; \
		echo "Run 'make setup' first"; \
		exit 1; \
	fi
	@if [ ! -d "backend/.venv" ]; then \
		echo "❌ Backend dependencies not installed!"; \
		echo "Run 'make setup' first"; \
		exit 1; \
	fi
	@echo "✓ Setup verified"

check-ollama-running:
	@curl -s http://localhost:11434/api/tags >/dev/null 2>&1 || { \
		echo "❌ Ollama server not running!"; \
		echo "Start with: ollama serve"; \
		exit 1; \
	}

build: check-setup
	@echo "Building frontend for production..."
	@cd frontend && npm run build
	@echo "✓ Build complete! Files are in backend/static/"

prod: build check-ollama-running
	@echo "Starting production server..."
	@echo "Open http://localhost:8000"
	@cd backend && uv run uvicorn main:app --host 0.0.0.0 --port 8000

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf frontend/node_modules
	@rm -rf frontend/dist
	@rm -rf backend/static/*
	@rm -rf backend/__pycache__
	@rm -rf backend/.venv
	@echo "✓ Cleaned"