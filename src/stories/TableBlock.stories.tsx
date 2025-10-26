import type { Meta, StoryObj } from '@storybook/react';
import { TableBlock } from '../community/TableBlock';

const meta = {
  title: 'Community/TableBlock',
  component: TableBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TableBlock>;

export default meta;

export const PatientVitals: StoryObj<typeof meta> = {
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

export const LabResults: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        caption: 'Laboratory Results',
        headers: ['Test', 'Result', 'Reference Range', 'Flag'],
        rows: [
          ['Glucose', '95 mg/dL', '70-99 mg/dL', 'Normal'],
          ['Cholesterol', '220 mg/dL', '<200 mg/dL', '⚠️ High'],
          ['HDL', '45 mg/dL', '>40 mg/dL', 'Normal'],
          ['LDL', '150 mg/dL', '<100 mg/dL', '⚠️ High'],
          ['Triglycerides', '180 mg/dL', '<150 mg/dL', '⚠️ High'],
        ],
      },
    },
  },
};

export const BasicTable: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        headers: ['Name', 'Age', 'City'],
        rows: [
          ['John Doe', '30', 'New York'],
          ['Jane Smith', '25', 'Los Angeles'],
          ['Bob Johnson', '35', 'Chicago'],
        ],
      },
    },
  },
};