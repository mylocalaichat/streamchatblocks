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
        border: '2px solid #007bff',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '8px',
        backgroundColor: '#f0f8ff',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#007bff' }}>
        💊 {name}
      </div>

      {description && (
        <div style={{ marginBottom: '8px', fontSize: '14px' }}>
          {description}
        </div>
      )}

      {dosage && (
        <div style={{ marginBottom: '8px' }}>
          <strong>Dosage:</strong> {dosage}
        </div>
      )}

      {interactions && interactions.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <strong>Interactions:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {interactions.map((interaction: string, index: number) => (
              <li key={index}>{interaction}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div>
          <strong style={{ color: '#dc3545' }}>⚠️ Warnings:</strong>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {warnings.map((warning: string, index: number) => (
              <li key={index} style={{ color: '#dc3545' }}>
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
