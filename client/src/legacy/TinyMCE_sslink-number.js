/* global tinymce, window */
import i18n from 'i18n';
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { createInsertLinkModal } from 'containers/InsertLinkModal/InsertLinkModal';
import { loadComponent } from 'lib/Injector';

const commandName = 'sslinknumber';

const plugin = {
  init(editor) {
    // Add "Link to phone number" to link menu for this editor
    TinyMCEActionRegistrar.addAction(
      'sslink',
      {
        text: i18n._t('Admin.LINKLABEL_NUMBER', 'Link to phone number'),
        onclick: (editorInst) => editorInst.execCommand(commandName),
        priority: 52,
      },
      editor.settings.editorIdentifier,
    ).addCommandWithUrlTest(commandName, /^tel:/);

    // Add a command that corresponds with the above menu item
    editor.addCommand(commandName, () => {
      const field = window.jQuery(`#${editor.id}`).entwine('ss');

      field.openLinkNumberDialog();
    });
  },
};

const modalId = 'insert-link__dialog-wrapper--number';
const sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
const formName = 'EditorNumberLink';
const InsertLinkNumberModal = loadComponent(createInsertLinkModal(sectionConfigKey, formName));

jQuery.entwine('ss', ($) => {
  $('textarea.htmleditor').entwine({
    openLinkNumberDialog() {
      let dialog = $(`#${modalId}`);

      if (!dialog.length) {
        dialog = $(`<div id="${modalId}" />`);
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');

      dialog.setElement(this);
      dialog.open();
    },
  });

  /**
   * Assumes that $('.insert-link__dialog-wrapper').entwine({}); is defined for shared functions
   */
  $(`#${modalId}`).entwine({
    renderModal(isOpen) {
      const handleHide = () => this.close();
      const handleInsert = (...args) => this.handleInsert(...args);
      const attrs = this.getOriginalAttributes();
      const requireLinkText = this.getRequireLinkText();

      // create/update the react component
      ReactDOM.render(
        <InsertLinkNumberModal
          isOpen={isOpen}
          onInsert={handleInsert}
          onClosed={handleHide}
          title={i18n._t('Admin.LINK_NUMBER', 'Insert number link')}
          bodyClassName="modal__dialog"
          className="insert-link__dialog-wrapper--number"
          fileAttributes={attrs}
          identifier="Admin.InsertLinkNumberModal"
          requireLinkText={requireLinkText}
        />,
        this[0]
      );
    },

    getOriginalAttributes() {
      const editor = this.getElement().getEditor();
      const node = $(editor.getSelectedNode());

      const hrefParts = (node.attr('href') || '').split('?');

      let number = hrefParts[0].replace(/^tel:/, '').split('?')[0];
      // simple valid regex check if is a number
      if (!number.match(/^[0-9]+$/)) {
        number = '';
      }

      return {
        Link: number,
      };
    },

    buildAttributes(data) {
      const attributes = this._super(data);

      let href = '';

      let number = attributes.href.replace(/^tel:/, '').split('?')[0];
      // simple valid regex check if is a number
      if (!number.match(/^[0-9]+$/)) {
        number = '';
      }

      // Prefix the URL with "http://" if no prefix is found
      if (number) {
        href = `tel:${number}`;
      }
      attributes.href = href;

      delete attributes.target;

      return attributes;
    },
  });
});

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add(commandName, (editor) => plugin.init(editor));
export default plugin;
