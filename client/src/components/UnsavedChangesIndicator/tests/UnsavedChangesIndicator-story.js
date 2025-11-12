import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { Component as UnsavedChangesIndicator } from '../UnsavedChangesIndicator';

export default {
  title: 'Admin/UnsavedChangesIndicator',
  component: UnsavedChangesIndicator,
  decorators: [jsxDecorator],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<UnsavedChangesIndicator />` displays a notice or warning about unsaved changes. Shows after 5 minutes (notice) and escalates to warning after 10 minutes.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['none', 'notice', 'warning'],
      description: 'Indicator level: none, notice, warning'
    },
    elapsedMinutes: {
      control: 'number',
      description: 'Number of elapsed minutes since the form became dirty'
    }
  }
};

export const Indicator = (args) => <UnsavedChangesIndicator {...args} />;
Indicator.args = {
  level: 'none',
  elapsedMinutes: 5,
};
