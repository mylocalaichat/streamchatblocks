import type { Meta, StoryObj } from '@storybook/react';
import { DrugBlock } from '../components/blocks/DrugBlock';

const meta = {
  title: 'Blocks/DrugBlock',
  component: DrugBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DrugBlock>;

export default meta;

export const DrugBlockExample: StoryObj<typeof meta> = {
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
