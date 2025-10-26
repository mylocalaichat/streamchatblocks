# StreamChatBlocks Development Guide

## Architecture Overview

StreamChatBlocks is a React component library for AI chat interfaces with Server-Sent Events (SSE) streaming and FastAPI integration. The library follows a **block-based response pattern** where AI responses can contain multiple structured components (text, drug info, tables, charts, feedback forms).

### Core Architecture

- **`src/components/`**: Main React components (`ChatWindow`, `Message`, `BlockRenderer`)
- **`src/components/blocks/`**: Built-in block types (`TextBlock`, `DrugBlock`, `FeedbackBlock`)
- **`src/community/`**: Community-contributed blocks (`TableBlock`, `ChartBlock`)
- **`src/hooks/useSSEStream.ts`**: SSE streaming hook using `SSEClient`
- **`src/utils/sseClient.ts`**: Raw SSE handling with fetch streams and AbortController
- **`src/types/index.ts`**: TypeScript definitions for all block types and configs

### Block System Pattern

The library uses a **registry-based block renderer** (`BlockRenderer.tsx`):
1. Custom renderers take priority via `customRenderers` Map
2. Built-in blocks use switch statement for `type` matching
3. Custom blocks use `block.data.componentType` for component lookup
4. Unknown blocks show fallback message

```tsx
// Example block in SSE stream
{ "type": "block", "block": { "type": "drug", "data": { "name": "Aspirin", "dosage": "..." } } }
```

## Development Workflows

### Build & Development
```bash
make install && make build          # Install deps and build library
make storybook                      # Component development with Storybook
make setup-example && make dev-example  # FastAPI integration testing
```

### Adding New Block Types
1. Create component in `src/components/blocks/` following `DrugBlock.tsx` pattern
2. Export from `src/index.ts` 
3. Add type definition to `src/types/index.ts`
4. Update `BlockRenderer.tsx` switch statement
5. Create Storybook story in `src/stories/`

### Community Components
Place in `src/community/`, export from `src/community/index.ts`. Use `CommunityComponentProps` interface for consistent API with `onAction` callback for interactions.

## FastAPI Integration Patterns

### SSE Response Format
```python
# Token streaming
yield f"data: {json.dumps({'type': 'token', 'content': char})}\n\n"

# Block insertion
yield f"data: {json.dumps({'type': 'block', 'block': {'type': 'drug', 'data': {...}}})}\n\n"

# Completion
yield f"data: {json.dumps({'type': 'done'})}\n\n"
```

### Production Deployment Pattern
FastAPI serves both UI and API - no separate frontend server needed. Frontend builds to `backend/static/`, FastAPI mounts static files at `/assets`.

## Key Conventions

- **CSS Modules**: All component styles use `.module.css` files
- **Theme Colors**: Use `7CA982` (primary), `243E36` (background), `E0EEC6` (text)
- **SSE Error Handling**: Always use AbortController for cancellation, handle connection cleanup
- **Block Data**: Keep `block.data` flat and serializable for FastAPI compatibility
- **TypeScript**: Strict typing required - all block types must extend `ResponseBlock`

## Configuration Defaults

Located in `src/config/defaults.ts`:
- API endpoints: `/chat`, `/stream`, `/feedback`
- CORS enabled for development
- Default headers and theme values

## Testing & Quality

- Use `make lint` for ESLint validation
- Storybook for component testing
- Example app in `examples/fastapi-app/` for integration testing
- Vite build with UMD + ESM outputs for library distribution