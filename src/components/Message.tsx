import React from 'react';
import { Message as MessageType, BlockRendererRegistry } from '../types';
import { BlockRenderer } from './BlockRenderer';
import styles from './Message.module.css';

interface MessageProps {
  message: MessageType;
  customRenderers?: BlockRendererRegistry;
}

export const Message: React.FC<MessageProps> = ({ message, customRenderers }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`${styles.message} ${styles[message.role]}`}>
      <div className={styles.messageHeader}>
        {message.role === 'user' ? 'You' : 'Assistant'}
      </div>
      <div className={styles.messageContent}>
        {message.content}
      </div>
      {message.blocks && message.blocks.length > 0 && (
        <div className={styles.blocks}>
          {message.blocks.map((block, index) => (
            <BlockRenderer
              key={block.id || index}
              block={block}
              customRenderers={customRenderers}
            />
          ))}
        </div>
      )}
      <div className={styles.timestamp}>{formatTime(message.timestamp)}</div>
    </div>
  );
};

export default Message;
