import React from 'react';
import { ResponseBlock } from '../../types';

interface DrugBlockProps {
  block: ResponseBlock;
}

export const DrugBlock: React.FC<DrugBlockProps> = ({ block }) => {
  const { name, dosage, interactions, warnings, description } = block.data || {};

  return (
    <div
      style={{
        border: '1px solid #3d5d52',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '12px',
        backgroundColor: '#2d4d42',
        fontFamily: 'inherit',
      }}
    >
      <div style={{
        fontWeight: '600',
        fontSize: '15px',
        marginBottom: '12px',
        color: '#7CA982',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '18px' }}>💊</span>
        {name}
      </div>

      {description && (
        <div style={{
          marginBottom: '12px',
          fontSize: '14px',
          color: '#E0EEC6',
          lineHeight: '1.6',
        }}>
          {description}
        </div>
      )}

      {dosage && (
        <div style={{
          marginBottom: '12px',
          fontSize: '14px',
          color: '#E0EEC6',
        }}>
          <strong style={{ color: '#F1F7ED' }}>Dosage:</strong> {dosage}
        </div>
      )}

      {interactions && interactions.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#F1F7ED', fontSize: '14px' }}>Interactions:</strong>
          <ul style={{
            margin: '8px 0',
            paddingLeft: '20px',
            color: '#E0EEC6',
            fontSize: '14px',
          }}>
            {interactions.map((interaction: string, index: number) => (
              <li key={index} style={{ marginBottom: '4px' }}>{interaction}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div>
          <strong style={{
            color: '#C2A83E',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>⚠️</span> Warnings:
          </strong>
          <ul style={{
            margin: '8px 0',
            paddingLeft: '20px',
            fontSize: '14px',
          }}>
            {warnings.map((warning: string, index: number) => (
              <li key={index} style={{
                color: '#C2A83E',
                marginBottom: '4px',
              }}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DrugBlock;
