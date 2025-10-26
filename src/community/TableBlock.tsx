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
      <div style={{
        padding: '12px',
        color: '#7CA982',
        fontStyle: 'italic',
        fontSize: '14px',
        fontFamily: 'inherit',
      }}>
        No table data available
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '12px',
        border: '1px solid #3d5d52',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#2d4d42',
        fontFamily: 'inherit',
      }}
    >
      {caption && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#1a2f28',
            fontWeight: '600',
            borderBottom: '1px solid #3d5d52',
            color: '#F1F7ED',
            fontSize: '15px',
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
            <tr style={{ backgroundColor: '#1a2f28' }}>
              {headers.map((header: string, index: number) => (
                <th
                  key={index}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    borderBottom: '1px solid #3d5d52',
                    color: '#F1F7ED',
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
                  backgroundColor: rowIndex % 2 === 0 ? '#2d4d42' : '#1a2f28',
                }}
              >
                {row.map((cell: any, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #3d5d52',
                      color: '#E0EEC6',
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
