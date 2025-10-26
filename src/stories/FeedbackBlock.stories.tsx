import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackBlock } from '../components/blocks/FeedbackBlock';

const meta = {
  title: 'Blocks/FeedbackBlock',
  component: FeedbackBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackBlock>;

export default meta;

export const BasicFeedback: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: {
        question: 'Was this information helpful?',
        options: ['Very helpful', 'Somewhat helpful', 'Not helpful'],
        allowCustom: true,
      },
    },
    onSubmit: (feedback: string) => {
      console.log('Feedback submitted:', feedback);
      alert(`Feedback submitted: ${feedback}`);
    },
  },
};

export const SimpleRating: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: {
        question: 'How would you rate your experience?',
        options: ['Excellent', 'Good', 'Average', 'Poor'],
        allowCustom: false,
      },
    },
    onSubmit: (feedback: string) => {
      console.log('Rating submitted:', feedback);
      alert(`Rating submitted: ${feedback}`);
    },
  },
};

export const CustomInputOnly: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: {
        question: 'Please share your thoughts and suggestions:',
        options: [],
        allowCustom: true,
      },
    },
    onSubmit: (feedback: string) => {
      console.log('Custom feedback submitted:', feedback);
      alert(`Custom feedback submitted: ${feedback}`);
    },
  },
};

export const WithoutSubmitHandler: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: {
        question: 'Did you find what you were looking for?',
        options: ['Yes, exactly', 'Partially', 'No, not at all'],
        allowCustom: true,
      },
    },
    // No onSubmit handler to test default behavior
  },
};

export const EmptyData: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: {},
    },
    onSubmit: (feedback: string) => {
      console.log('Feedback submitted:', feedback);
      alert(`Feedback submitted: ${feedback}`);
    },
  },
};

export const NoData: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'feedback',
      data: null,
    },
    onSubmit: (feedback: string) => {
      console.log('Feedback submitted:', feedback);
      alert(`Feedback submitted: ${feedback}`);
    },
  },
};