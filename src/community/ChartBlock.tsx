import React from 'react';
import { CommunityComponentProps } from '../types';

/**
 * Community component for displaying simple bar charts
 *
 * Expected data format:
 * {
 *   title?: string,
 *   data: { label: string, value: number }[],
 *   color?: string
 * }
 */
export const ChartBlock: React.FC<CommunityComponentProps> = ({ block, onAction }) => {
  const { title, data = [], color = '#007bff' } = block.data || {};

  if (!data.length) {
    return (
      <div style={{ padding: '12px', color: '#666', fontStyle: 'italic' }}>
        No chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item: any) => item.value));

  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 'bold',
            marginBottom: '16px',
            fontSize: '16px',
          }}
        >
          {title}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.map((item: any, index: number) => (
          <div key={index}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '14px',
              }}
            >
              <span>{item.label}</span>
              <span style={{ fontWeight: 'bold' }}>{item.value}</span>
            </div>
            <div
              style={{
                height: '24px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                  transition: 'width 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartBlock;
