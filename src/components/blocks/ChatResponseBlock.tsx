import React from 'react';
import { ResponseBlock } from '../../types';
import styles from './ChatResponseBlock.module.css';

export interface ChatResponseBlockData {
  content: string;
  timestamp?: string;
}

export interface ChatResponseBlockProps {
  block: ResponseBlock;
}

export const ChatResponseBlock: React.FC<ChatResponseBlockProps> = ({ block }) => {
  // Type assertion since we know this is a chatresponse block
  const data = block.data as ChatResponseBlockData;
  const { content, timestamp } = data;

  return (
    <div className={styles.chatResponseBlock}>
      <div className={styles.content}>
        {content}
      </div>
      {timestamp && (
        <div className={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};