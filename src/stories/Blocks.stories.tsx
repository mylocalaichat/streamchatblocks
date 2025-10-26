import type { Meta, StoryObj } from '@storybook/react';
import { DrugBlock } from '../components/blocks/DrugBlock';
import { FeedbackBlock } from '../components/blocks/FeedbackBlock';
import { TableBlock } from '../community/TableBlock';
import { ChartBlock } from '../community/ChartBlock';

// DrugBlock Stories
const drugMeta = {
  title: 'Blocks/DrugBlock',
  component: DrugBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DrugBlock>;

export default drugMeta;

export const DrugBlockExample: StoryObj<typeof drugMeta> = {
  args: {
    block: {
      type: 'drug',
      data: {
        name: 'Ibuprofen',
        dosage: '200-400 mg every 4-6 hours',
        description: 'A nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation',
        interactions: ['Blood thinners', 'Aspirin', 'ACE inhibitors'],
        warnings: [
          'May increase risk of heart attack or stroke',
          'Can cause stomach bleeding',
          'Do not use if you have had recent heart surgery',
        ],
      },
    },
  },
};

// FeedbackBlock Stories
const feedbackMeta = {
  title: 'Blocks/FeedbackBlock',
  component: FeedbackBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackBlock>;

export const FeedbackBlockExample: StoryObj<typeof feedbackMeta> = {
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

// TableBlock Stories
const tableMeta = {
  title: 'Community/TableBlock',
  component: TableBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TableBlock>;

export const TableBlockExample: StoryObj<typeof tableMeta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        caption: 'Patient Vitals',
        headers: ['Metric', 'Value', 'Normal Range', 'Status'],
        rows: [
          ['Heart Rate', '72 bpm', '60-100 bpm', '✓ Normal'],
          ['Blood Pressure', '120/80 mmHg', '90/60-120/80 mmHg', '✓ Normal'],
          ['Temperature', '98.6°F', '97.8-99.1°F', '✓ Normal'],
          ['Respiratory Rate', '16 breaths/min', '12-20 breaths/min', '✓ Normal'],
        ],
      },
    },
  },
};

// ChartBlock Stories
const chartMeta = {
  title: 'Community/ChartBlock',
  component: ChartBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartBlock>;

export const ChartBlockExample: StoryObj<typeof chartMeta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        title: 'Symptom Severity Over Time',
        data: [
          { label: 'Day 1', value: 8 },
          { label: 'Day 2', value: 7 },
          { label: 'Day 3', value: 5 },
          { label: 'Day 4', value: 3 },
          { label: 'Day 5', value: 2 },
        ],
        color: '#dc3545',
      },
    },
  },
};
