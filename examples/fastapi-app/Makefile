.PHONY: help install setup dev-frontend dev-backend dev build clean install-uv link-lib

help:
	@echo "StreamChatBlocks FastAPI App - Available Commands"
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
	@echo "  make setup && make dev"

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
	@echo "✓ Dependencies installed"

setup: install-uv link-lib install
	@echo ""
	@echo "✓ Setup complete!"
	@echo ""
	@echo "To run in development mode:"
	@echo "  make dev"

dev-frontend: check-setup
	@echo "Starting frontend dev server on port 3000..."
	@echo "Open http://localhost:3000"
	@cd frontend && npm run dev

dev-backend:
	@echo "Starting backend dev server on port 8000..."
	@cd backend && uv run uvicorn main:app --reload

dev: check-setup
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo ""
	@echo "Press Ctrl+C to stop both servers"
	@$(MAKE) -j2 dev-frontend dev-backend

check-setup:
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "❌ Dependencies not installed!"; \
		echo "Run 'make setup' first"; \
		exit 1; \
	fi
	@echo "✓ Setup verified"

build: check-setup
	@echo "Building frontend for production..."
	@cd frontend && npm run build
	@echo "✓ Build complete! Files are in backend/static/"

prod: build
	@echo "Starting production server..."
	@echo "Open http://localhost:8000"
	@cd backend && uv run uvicorn main:app --host 0.0.0.0 --port 8000

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf frontend/node_modules
	@rm -rf frontend/dist
	@rm -rf backend/static/*
	@rm -rf backend/__pycache__
	@echo "✓ Cleaned"
