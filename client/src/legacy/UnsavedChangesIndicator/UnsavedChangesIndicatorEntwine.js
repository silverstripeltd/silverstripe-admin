/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.cms-edit-form .unsaved-changes-indicator__container').entwine({
    ReactRoot: null,
    IsDirty: false,
    Component: null,
    Observer: null,

    onmatch() {
      this._super();
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      this.renderComponent();
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    renderComponent() {
      let Component = this.getComponent();
      if (!Component) {
        Component = loadComponent('UnsavedChangesIndicator');
        this.setComponent(Component);
      }
      const props = {
        minutes: JSON.parse(this.attr('data-minutes')),
        isDirty: this.getIsDirty(),
      };
      const root = this.getReactRoot();
      if (root) {
        root.render(<Component {...props} />);
      }
    },

    updateDirtyState(isDirty) {
      this.setIsDirty(isDirty);
      this.renderComponent();
    },
  });

  // Monitor the form for dirty state changes
  // "changed" class is added by jquery.changetracker.js
  // Using MutationObserver rather than onmatch()/onunmatch() events on $('.cms-edit-form.changed') as
  // the latter did not seem to work i.e. onmatch was never called when the class was added
  $('.cms-edit-form').entwine({
    onmatch() {
      this._super();
      const container = this.find('.unsaved-changes-indicator__container').first();
      if (!container.length) {
        return;
      }
      const self = this;
      const observer = new MutationObserver(() => {
        const isChanged = self.hasClass('changed');
        container.updateDirtyState(isChanged);
      });
      observer.observe(this[0], {
        attributes: true,
        attributeFilter: ['class'],
      });
      this.setObserver(observer);
    },
    onunmatch() {
      this._super();
      const observer = this.getObserver();
      if (observer) {
        observer.disconnect();
      }
      this.setObserver(null);
    }
  });
});
