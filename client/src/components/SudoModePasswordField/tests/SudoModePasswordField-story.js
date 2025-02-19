import React from 'react';
import { Component as SudoModePasswordField } from '../SudoModePasswordField';

window.ss.config = {
  SecurityID: '12345',
  sections: [
    {
      name: 'SilverStripe\\Admin\\SudoModeController',
      endpoints: {
        // Setting the endpoint to null will prevent an XHR request from being made
        activate: null,
      }
    },
  ],
};

export default {
  title: 'Admin/SudoModePasswordField',
  component: SudoModePasswordField,
  decorators: [],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The SudoModePasswordField component. Enter "password" to simulate a successful request.'
      },
      canvas: {
        sourceState: 'shown',
      },
    }
  },
  argTypes: {
    autocomplete: {
      description: 'The autocomplete attribute for the password field.',
      control: 'text',
      type: {
        required: true
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'off' },
      },
    },
  }
};

export const _SudoModePasswordField = (props) => <SudoModePasswordField
  {...props}
  onSuccess={() => {}}
  autocomplete={props.autocomplete || 'off'}
/>;
