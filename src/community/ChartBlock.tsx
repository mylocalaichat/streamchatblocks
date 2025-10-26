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
export const ChartBlock: React.FC<CommunityComponentProps> = ({ block }) => {
  const { title, data = [], color = '#7CA982' } = block.data || {};

  if (!data.length) {
    return (
      <div style={{
        padding: '12px',
        color: '#7CA982',
        fontStyle: 'italic',
        fontSize: '14px',
        fontFamily: 'inherit',
      }}>
        No chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((item: any) => item.value));

  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid #3d5d52',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#2d4d42',
        fontFamily: 'inherit',
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: '600',
            marginBottom: '16px',
            fontSize: '15px',
            color: '#F1F7ED',
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
                color: '#E0EEC6',
              }}
            >
              <span>{item.label}</span>
              <span style={{ fontWeight: '600', color: '#F1F7ED' }}>{item.value}</span>
            </div>
            <div
              style={{
                height: '24px',
                backgroundColor: '#1a2f28',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #3d5d52',
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
                  color: '#243E36',
                  fontSize: '12px',
                  fontWeight: '600',
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
