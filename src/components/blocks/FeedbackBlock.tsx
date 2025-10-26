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
          border: '1px solid #28a745',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '8px',
          backgroundColor: '#d4edda',
          color: '#155724',
        }}
      >
        ✓ Thank you for your feedback!
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #6c757d',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '8px',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>
        {question}
      </div>

      {options && options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {options.map((option: string, index: number) => (
            <label
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: selectedOption === option ? '#e7f3ff' : 'transparent',
                border: selectedOption === option ? '1px solid #007bff' : '1px solid transparent',
              }}
            >
              <input
                type="radio"
                name="feedback"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{ marginRight: '8px' }}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {allowCustom && (
        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <input
              type="radio"
              name="feedback"
              value="custom"
              checked={selectedOption === 'custom'}
              onChange={(e) => setSelectedOption(e.target.value)}
              style={{ marginRight: '8px' }}
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
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                resize: 'vertical',
                minHeight: '60px',
                fontFamily: 'inherit',
              }}
            />
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || (selectedOption === 'custom' && !customInput.trim())}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600',
          opacity: !selectedOption || (selectedOption === 'custom' && !customInput.trim()) ? 0.5 : 1,
        }}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackBlock;
