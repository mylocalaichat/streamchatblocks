import type { Meta, StoryObj } from '@storybook/react';
import { ChatWindow } from '../components/ChatWindow';
import { Message } from '../types';

const meta = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof ChatWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is aspirin used for?',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Aspirin is commonly used as a pain reliever and to reduce fever. It also has anti-inflammatory properties.',
    timestamp: new Date(Date.now() - 30000),
    blocks: [
      {
        type: 'drug',
        data: {
          name: 'Aspirin',
          dosage: '325-650 mg every 4-6 hours as needed',
          warnings: [
            'Do not use if allergic to aspirin',
            'May cause stomach bleeding',
            'Consult doctor if pregnant or breastfeeding',
          ],
          interactions: ['Blood thinners', 'NSAIDs', 'Alcohol'],
          description: 'A common pain reliever and anti-inflammatory medication',
        },
      },
    ],
  },
];

export const Default: Story = {
  args: {
    config: {
      apiConfig: {
        baseUrl: 'http://localhost:8000',
      },
    },
    title: 'Medical Assistant',
    initialMessages: [],
  },
};

export const WithMessages: Story = {
  args: {
    config: {
      apiConfig: {
        baseUrl: 'http://localhost:8000',
      },
    },
    title: 'Medical Assistant',
    initialMessages: sampleMessages,
  },
};

export const CustomTheme: Story = {
  args: {
    config: {
      apiConfig: {
        baseUrl: 'http://localhost:8000',
      },
      theme: {
        primaryColor: '#28a745',
        backgroundColor: '#f8f9fa',
        messageBackgroundColor: '#e9ecef',
      },
    },
    title: 'Custom Themed Chat',
    initialMessages: sampleMessages,
  },
};
