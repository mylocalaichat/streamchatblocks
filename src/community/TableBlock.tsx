import React from 'react';
import { CommunityComponentProps } from '../types';

/**
 * Community component for displaying tabular data
 *
 * Expected data format:
 * {
 *   headers: string[],
 *   rows: any[][],
 *   caption?: string
 * }
 */
export const TableBlock: React.FC<CommunityComponentProps> = ({ block }) => {
  const { headers = [], rows = [], caption } = block.data || {};

  if (!headers.length || !rows.length) {
    return (
      <div style={{ padding: '12px', color: '#666', fontStyle: 'italic' }}>
        No table data available
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {caption && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            borderBottom: '1px solid #ddd',
          }}
        >
          {caption}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {headers.map((header: string, index: number) => (
                <th
                  key={index}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '2px solid #dee2e6',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any[], rowIndex: number) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8f9fa',
                }}
              >
                {row.map((cell: any, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBlock;
