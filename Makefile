.PHONY: help install build clean storybook setup-example dev-example build-example test lint

help:
	@echo "StreamChatBlocks - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install        - Install npm dependencies"
	@echo "  make build          - Build the library"
	@echo "  make storybook      - Run Storybook (interactive docs)"
	@echo "  make lint           - Run ESLint"
	@echo "  make clean          - Clean build artifacts"
	@echo ""
	@echo "FastAPI Example App:"
	@echo "  make setup-example  - Setup FastAPI example (link library + install deps)"
	@echo "  make dev-example    - Run example in development mode (2 servers)"
	@echo "  make build-example  - Build example for production"
	@echo ""
	@echo "Quick Start:"
	@echo "  make install && make build && make setup-example && make dev-example"

install:
	@echo "Installing dependencies..."
	npm install

build:
	@echo "Building library..."
	npm run build

storybook:
	@echo "Starting Storybook..."
	npm run storybook

lint:
	@echo "Running linter..."
	npm run lint

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/
	rm -rf storybook-static/

setup-example: build
	@echo "Setting up FastAPI example..."
	@$(MAKE) -C examples/fastapi-app setup

dev-example:
	@echo "Running FastAPI example in development mode..."
	@$(MAKE) -C examples/fastapi-app dev

build-example:
	@echo "Building FastAPI example for production..."
	@$(MAKE) -C examples/fastapi-app build

test:
	@echo "Tests not yet implemented"
	@echo "Run 'make storybook' to view component examples"
