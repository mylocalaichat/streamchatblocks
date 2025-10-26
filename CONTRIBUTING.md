# Contributing to StreamChatBlocks

Thank you for your interest in contributing to StreamChatBlocks! This document provides guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Creating Community Components](#creating-community-components)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Testing](#testing)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/streamchatblocks.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run Storybook for component development
npm run storybook

# Build the library
npm run build

# Run linter
npm run lint
```

## Project Structure

```
streamchatblocks/
├── src/
│   ├── components/        # Core components
│   │   ├── blocks/        # Built-in block components
│   │   ├── ChatWindow.tsx
│   │   ├── Message.tsx
│   │   └── ChatInput.tsx
│   ├── community/         # Community-contributed components
│   ├── hooks/             # React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── config/            # Default configurations
│   └── stories/           # Storybook stories
├── examples/
│   └── fastapi-backend/   # FastAPI backend example
└── dist/                  # Build output (generated)
```

## Creating Community Components

Community components are custom block renderers that extend StreamChatBlocks functionality.

### Step-by-Step Guide

1. **Create Your Component File**

   Create a new file in `src/community/` (e.g., `MyCustomBlock.tsx`):

   ```tsx
   import React from 'react';
   import { CommunityComponentProps } from '../types';

   export const MyCustomBlock: React.FC<CommunityComponentProps> = ({ block, onAction }) => {
     const { title, description } = block.data;

     const handleAction = () => {
       onAction?.('customAction', { data: 'value' });
     };

     return (
       <div style={{
         border: '1px solid #ddd',
         borderRadius: '8px',
         padding: '12px',
         marginTop: '8px'
       }}>
         <h4>{title}</h4>
         <p>{description}</p>
         <button onClick={handleAction}>Action</button>
       </div>
     );
   };

   export default MyCustomBlock;
   ```

2. **Export Your Component**

   Add your component to `src/community/index.ts`:

   ```tsx
   export { MyCustomBlock } from './MyCustomBlock';
   ```

3. **Create a Storybook Story**

   Create a story file in `src/stories/` to document your component:

   ```tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { MyCustomBlock } from '../community/MyCustomBlock';

   const meta = {
     title: 'Community/MyCustomBlock',
     component: MyCustomBlock,
     parameters: {
       layout: 'padded',
     },
     tags: ['autodocs'],
   } satisfies Meta<typeof MyCustomBlock>;

   export default meta;

   export const Example: StoryObj<typeof meta> = {
     args: {
       block: {
         type: 'custom',
         data: {
           title: 'Example Title',
           description: 'Example description',
         },
       },
     },
   };
   ```

4. **Document the Expected Data Format**

   In your component file, add JSDoc comments documenting the expected data format:

   ```tsx
   /**
    * Community component for displaying custom content
    *
    * Expected data format:
    * {
    *   title: string,
    *   description: string,
    *   metadata?: Record<string, any>
    * }
    */
   ```

5. **Update Community README**

   Add your component to `src/community/README.md` with usage examples.

### Component Guidelines

1. **Props**: Always accept `CommunityComponentProps`
2. **Styling**: Use inline styles or CSS modules to avoid style conflicts
3. **Actions**: Use the `onAction` callback for user interactions
4. **Accessibility**: Include proper ARIA labels and keyboard navigation
5. **Error Handling**: Handle missing or invalid data gracefully
6. **TypeScript**: Provide proper type definitions
7. **Documentation**: Document expected data format and usage

### Example Backend Response

Your FastAPI backend should return blocks in this format:

```json
{
  "type": "block",
  "block": {
    "type": "custom",
    "data": {
      "componentType": "MyCustomBlock",
      "props": {
        "title": "Title",
        "description": "Description"
      }
    }
  }
}
```

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: Ensure README and relevant docs are updated
2. **Add Tests**: Include tests for new functionality (when applicable)
3. **Run Linter**: Ensure code passes linting (`npm run lint`)
4. **Build Successfully**: Verify the library builds (`npm run build`)
5. **Update Storybook**: Add or update stories for new components
6. **Write Clear Commit Messages**: Use descriptive commit messages

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Community component

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation has been updated
- [ ] Storybook stories have been added/updated
- [ ] Build passes successfully
- [ ] No console warnings or errors
```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types when possible
- Export types that might be useful to consumers

### React

- Use functional components with hooks
- Follow React best practices
- Keep components focused and composable
- Use meaningful component and prop names

### Formatting

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Max line length: 100 characters

### Naming Conventions

- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with "use" prefix (`useMyHook.ts`)
- Utilities: camelCase (`myUtility.ts`)
- Types: PascalCase (`MyType`)
- CSS Modules: camelCase (`myClass`)

## Testing

Currently, we rely on Storybook for component testing. When adding new components:

1. Create comprehensive Storybook stories
2. Test different prop combinations
3. Test edge cases (empty data, missing props, etc.)
4. Verify accessibility with Storybook's a11y addon

Future: We plan to add Jest and React Testing Library.

## Questions?

If you have questions or need help:

- Open an issue on GitHub
- Check existing issues and discussions
- Review the examples in the `examples/` directory

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
