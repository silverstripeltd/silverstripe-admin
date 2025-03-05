import { jsxDecorator } from 'storybook-addon-jsx';
import React from 'react';
import Paginator from 'components/Paginator/Paginator';

export default {
  title: 'Admin/Paginator',
  component: Paginator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Generic data paginator. Component has no internal state and relies on parent component to manage it via props.',
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  decorators: [
    jsxDecorator,
  ],
  argTypes: {
    totalItems: {
      description: 'The total number of items to paginate.',
      control: 'number',
      type: {
        required: true,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    maxItemsPerPage: {
      description: 'The maximum number of items per page.',
      control: 'number',
      type: {
        required: true,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    currentPage: {
      description: 'The current page number.',
      control: 'number',
      type: {
        required: true,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    onChangePage: {
      description: 'Event handler for when the page changes.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    }
  }
};

export const _Paginator = (args) => <Paginator {...args} />;
_Paginator.args = {
  totalItems: 15,
  maxItemsPerPage: 10,
  currentPage: 1,
  onChangePage: () => null,
};
