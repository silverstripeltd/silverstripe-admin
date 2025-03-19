/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  // `.SudoModePasswordField` will match both the field holder and the field
  // we only want to run this on the field holder, hence the `:not(:input)`
  $('.js-injector-boot .SudoModePasswordField:not(:input)').entwine({
    ReactRoot: null,
    ForGridField: null,

    onmatch() {
      this._super();
      const cmsContentID = this.closest('.cms-content').attr('id');
      const context = (cmsContentID)
        ? { context: cmsContentID }
        : {};

      const SudoModePasswordField = loadComponent('SudoModePasswordField', context);
      const input = this.find('input.SudoModePasswordField')[0];
      const props = {
        autocomplete: input.getAttribute('autocomplete'),
        initiallyCollapsed: input.getAttribute('data-initially-collapsed'),
        sectionTitle: input.getAttribute('data-section-title') || '',
        onSuccess: () => this.reloadSection(),
      };

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }

      root.render(<SudoModePasswordField {...props}/>);
      this.setReactRoot(root);
      this.setForGridField(input.hasAttribute('data-for-gridfield'));
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    /**
     * This is used by the react component to reload the page after sudo mode is activated.
     * This is here instead of inside the react component because in a pure react form the success handler
     * should result in re-rendering the react form with editable fields, instead of reloading the whole page.
     */
    reloadSection() {
      if (this.getForGridField()) {
        // Reload all sudo protected gridfields (not just this one)
        const gridFields = this
          .closest('.cms-container')
          .find('.ss-gridfield')
          .filter((_, el) => jQuery(el).find('.SudoModePasswordField').length);
        // Remove Readonly gridstate from the gridfields. This is done because they will have
        // a readonly gridstate if sudo mode is active, and we want to remove that state
        // so that the gridfields are editable again when they are reloaded
        gridFields.each((_, el) => {
          const gridField = jQuery(el);
          const gridState = gridField.find('.gridstate');
          const json = JSON.parse(gridState.attr('value'));
          delete json.Readonly;
          gridState.attr('value', JSON.stringify(json));
        });
        // Also update the window.location.search gridstate
        gridFields.updateUrlGridState(obj => {
          if (obj.Readonly) {
            delete obj.Readonly;
          }
        });
        // Reload the gridfields
        gridFields.reload();
      } else {
        this.closest('.cms-container').reloadCurrentPanel();
      }
    },
  });
});
