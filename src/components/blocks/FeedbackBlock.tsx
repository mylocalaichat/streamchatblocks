import React, { useState } from 'react';
import { ResponseBlock } from '../../types';

interface FeedbackBlockProps {
  block: ResponseBlock;
  onSubmit?: (feedback: string) => void;
}

export const FeedbackBlock: React.FC<FeedbackBlockProps> = ({ block, onSubmit }) => {
  const { question, options, allowCustom } = block.data || {};
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  // If no question is provided, don't render the block
  if (!question) {
    return (
      <div
        style={{
          border: '1px solid #dc3545',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '12px',
          backgroundColor: '#4d2d2d',
          color: '#dc3545',
          fontSize: '14px',
          fontFamily: 'inherit',
        }}
      >
        ⚠️ Feedback block is missing required question data
      </div>
    );
  }

  const handleSubmit = () => {
    const feedback = selectedOption === 'custom' ? customInput : selectedOption;
    if (feedback) {
      onSubmit?.(feedback);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          border: '1px solid #7CA982',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '12px',
          backgroundColor: '#2d4d42',
          color: '#7CA982',
          fontSize: '14px',
          fontFamily: 'inherit',
        }}
      >
        ✓ Thank you for your feedback!
      </div>
    );
  }

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
        marginBottom: '16px',
        color: '#F1F7ED',
        fontSize: '15px',
      }}>
        {question}
      </div>

      {options && options.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '16px',
        }}>
          {options.map((option: string, index: number) => (
            <label
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: selectedOption === option ? '#3d5d52' : '#1a2f28',
                border: selectedOption === option ? '1px solid #7CA982' : '1px solid #3d5d52',
                color: '#E0EEC6',
                fontSize: '14px',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="radio"
                name="feedback"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{
                  marginRight: '10px',
                  accentColor: '#7CA982',
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {allowCustom && (
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '10px',
              color: '#E0EEC6',
              fontSize: '14px',
            }}
          >
            <input
              type="radio"
              name="feedback"
              value="custom"
              checked={selectedOption === 'custom'}
              onChange={(e) => setSelectedOption(e.target.value)}
              style={{
                marginRight: '10px',
                accentColor: '#7CA982',
              }}
            />
            Other (please specify)
          </label>
          {selectedOption === 'custom' && (
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter your feedback..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #3d5d52',
                backgroundColor: '#1a2f28',
                color: '#F1F7ED',
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'inherit',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || (selectedOption === 'custom' && !customInput.trim())}
        style={{
          padding: '10px 20px',
          backgroundColor: !selectedOption || (selectedOption === 'custom' && !customInput.trim()) ? '#3d5d52' : '#7CA982',
          color: !selectedOption || (selectedOption === 'custom' && !customInput.trim()) ? '#5d7d72' : '#243E36',
          border: 'none',
          borderRadius: '6px',
          cursor: !selectedOption || (selectedOption === 'custom' && !customInput.trim()) ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackBlock;
