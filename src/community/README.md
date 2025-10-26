# Community Components

This directory contains community-contributed components for StreamChatBlocks.

## Creating a Community Component

Community components allow you to extend StreamChatBlocks with custom block types for your specific use case.

### Quick Start

1. Create a new file in this directory (e.g., `MyCustomBlock.tsx`)
2. Export a React component that accepts `CommunityComponentProps`
3. Register your component with the chat configuration

### Component Template

```tsx
import React from 'react';
import { CommunityComponentProps } from '../types';

export const MyCustomBlock: React.FC<CommunityComponentProps> = ({ block, onAction }) => {
  const data = block.data;

  const handleClick = () => {
    // Trigger an action that can be handled by the parent
    onAction?.('myCustomAction', { someData: 'value' });
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '8px'
    }}>
      <h4>{data.title}</h4>
      <p>{data.description}</p>
      <button onClick={handleClick}>Take Action</button>
    </div>
  );
};

export default MyCustomBlock;
```

### Expected Backend Response Format

Your FastAPI backend should return SSE events with blocks in this format:

```json
{
  "type": "block",
  "block": {
    "type": "custom",
    "data": {
      "componentType": "MyCustomBlock",
      "props": {
        "title": "Custom Title",
        "description": "Custom Description"
      }
    }
  }
}
```

### Registering Your Component

```tsx
import { ChatWindow } from 'streamchatblocks';
import { MyCustomBlock } from './community/MyCustomBlock';

const customRenderers = new Map();
customRenderers.set('MyCustomBlock', (block) => (
  <MyCustomBlock block={block} onAction={handleAction} />
));

function App() {
  return (
    <ChatWindow
      config={{
        apiConfig: { baseUrl: 'http://localhost:8000' },
        customRenderers,
      }}
    />
  );
}
```

## Examples

Check out the example components in this directory:
- `ChartBlock.tsx` - Display charts and data visualizations
- `TableBlock.tsx` - Display tabular data

## Guidelines

1. **Props**: Always accept `CommunityComponentProps` as your component props
2. **Styling**: Use inline styles or CSS modules to avoid conflicts
3. **Actions**: Use the `onAction` callback to communicate with the parent
4. **Accessibility**: Ensure your components are accessible (ARIA labels, keyboard navigation)
5. **Error Handling**: Handle missing or invalid data gracefully
6. **TypeScript**: Always provide proper type definitions

## Contributing

Want to share your component with the community? Submit a PR with:
1. Your component file
2. Documentation of the expected data format
3. A Storybook story demonstrating usage
4. Unit tests (if applicable)

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for more details.
