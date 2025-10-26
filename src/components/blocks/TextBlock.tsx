import React from 'react';
import { ResponseBlock } from '../../types';

interface TextBlockProps {
  block: ResponseBlock;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const content = block.data?.content || '';

  return (
    <div style={{ padding: '8px 0' }}>
      {content}
    </div>
  );
};

export default TextBlock;
