import React from 'react';
import { ResponseBlock, BlockRendererRegistry } from '../types';
import { DrugBlock } from './blocks/DrugBlock';
import { FeedbackBlock } from './blocks/FeedbackBlock';
import { TextBlock } from './blocks/TextBlock';
import { ChatResponseBlock } from './blocks/ChatResponseBlock';

interface BlockRendererProps {
  block: ResponseBlock;
  customRenderers?: BlockRendererRegistry;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, customRenderers }) => {
  // Check for custom renderer first
  if (customRenderers?.has(block.type)) {
    const customRenderer = customRenderers.get(block.type);
    return <>{customRenderer?.(block)}</>;
  }

  // Check for custom component type in custom blocks
  if (block.type === 'custom' && block.data?.componentType) {
    const customRenderer = customRenderers?.get(block.data.componentType);
    if (customRenderer) {
      return <>{customRenderer(block)}</>;
    }
  }

  // Default renderers
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'drug':
      return <DrugBlock block={block} />;
    case 'feedback':
      return <FeedbackBlock block={block} />;
    case 'chatresponse':
      return <ChatResponseBlock block={block} />;
    default:
      return (
        <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
          <em>Unsupported block type: {block.type}</em>
        </div>
      );
  }
};

export default BlockRenderer;
