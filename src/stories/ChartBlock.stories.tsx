import type { Meta, StoryObj } from '@storybook/react';
import { ChartBlock } from '../community/ChartBlock';

const meta = {
  title: 'Community/ChartBlock',
  component: ChartBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartBlock>;

export default meta;

export const SymptomSeverity: StoryObj<typeof meta> = {
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

export const BloodPressure: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        title: 'Blood Pressure Readings',
        data: [
          { label: 'Week 1', value: 140 },
          { label: 'Week 2', value: 135 },
          { label: 'Week 3', value: 130 },
          { label: 'Week 4', value: 125 },
          { label: 'Week 5', value: 120 },
        ],
        color: '#28a745',
      },
    },
  },
};

export const WeightProgress: StoryObj<typeof meta> = {
  args: {
    block: {
      type: 'custom',
      data: {
        title: 'Weight Loss Progress',
        data: [
          { label: 'Month 1', value: 180 },
          { label: 'Month 2', value: 175 },
          { label: 'Month 3', value: 170 },
          { label: 'Month 4', value: 165 },
          { label: 'Month 5', value: 162 },
          { label: 'Month 6', value: 160 },
        ],
        color: '#007bff',
      },
    },
  },
};