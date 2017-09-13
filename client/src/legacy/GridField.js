import $ from 'jQuery';
import i18n from 'i18n';

require('../../../thirdparty/jquery-ui/jquery-ui.js');
require('../../../thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');

// TODO Enable once https://github.com/webpack/extract-text-webpack-plugin/issues/179 is resolved. Included in bundle.scss for now.
// require('../styles/legacy/GridField.scss');

$.entwine('ss', function($) {
  $('.grid-field').entwine({
    /**
     * @param {Object} Additional options for jQuery.ajax() call
     * @param {successCallback} callback to call after reloading succeeded.
     */

    reload: function(ajaxOpts, successCallback) {
      var self = this, form = this.closest('form'),
        focusedElName = this.find(':input:focus').attr('name'), // Save focused element for restoring after refresh
        data = form.find(':input').serializeArray();

      if(!ajaxOpts) ajaxOpts = {};
      if(!ajaxOpts.data) ajaxOpts.data = [];
      ajaxOpts.data = ajaxOpts.data.concat(data);


      // Include any GET parameters from the current URL, as the view state might depend on it.
      // For example, a list prefiltered through external search criteria might be passed to GridField.
      if(window.location.search) {
        ajaxOpts.data = window.location.search.replace(/^\?/, '') + '&' + $.param(ajaxOpts.data);
      }

      form.addClass('loading');

      $.ajax($.extend({}, {
        headers: {"X-Pjax" : 'CurrentField'},
        type: "POST",
        url: this.data('url'),
        dataType: 'html',
        success: function(data) {
          // Replace the grid field with response, not the form.
          // TODO Only replaces all its children, to avoid replacing the current scope
          // of the executing method. Means that it doesn't retrigger the onmatch() on the main container.
          self.empty().append($(data).children());

          // Refocus previously focused element. Useful e.g. for finding+adding
          // multiple relationships via keyboard.
          if(focusedElName) self.find(':input[name="' + focusedElName + '"]').focus();

          // Update filter
          if(self.find('.grid-field__filter-header').length) {
            var content;
            if(ajaxOpts.data[0].filter=="show") {
              content = '<span class="non-sortable"></span>';
              self.addClass('show-filter').find('.grid-field__filter-header').show();
            } else {
              content = '<button type="button" title="Open search and filter" name="showFilter" class="btn btn-secondary font-icon-search btn--no-text btn--icon-large grid-field__filter-open"></button>';
              self.removeClass('show-filter').find('.grid-field__filter-header').hide();
            }

            self.find('.sortable-header th:last').html(content);
          }

          form.removeClass('loading');
          if(successCallback) successCallback.apply(this, arguments);
          self.trigger('reload', self);
        },
        error: function(e) {
          alert(i18n._t('Admin.ERRORINTRANSACTION'));
          form.removeClass('loading');
        }
      }, ajaxOpts));
    },
    showDetailView: function(url) {
      window.location.href = url;
    },
    getItems: function() {
      return this.find('.ss-gridfield-item');
    },
    /**
     * @param {String}
     * @param {Mixed}
     */
    setState: function(k, v) {
      var state = this.getState();
      state[k] = v;
      this.find(':input[name="' + this.data('name') + '[GridState]"]').val(JSON.stringify(state));
    },
    /**
     * @return {Object}
     */
    getState: function() {
      return JSON.parse(this.find(':input[name="' + this.data('name') + '[GridState]"]').val());
    }
  });

  $('.grid-field *').entwine({
    getGridField: function() {
      return this.closest('.grid-field');
    }
  });



  $('.grid-field :button[name=showFilter]').entwine({
    onclick: function(e) {
      this.closest('.grid-field__table')
        .find('.grid-field__filter-header')
        .show()
        .find(':input:first').focus(); // focus first search field

      this.closest('.grid-field').addClass('show-filter');
      this.parent().html('<span class="non-sortable"></span>');
      e.preventDefault();
    }
  });


  $('.grid-field .ss-gridfield-item').entwine({
    onclick: function(e) {
      if($(e.target).closest('.action').length) {
        this._super(e);
        return false;
      }

      var editLink = this.find('.edit-link');
      if(editLink.length) this.getGridField().showDetailView(editLink.prop('href'));
    },
    onmouseover: function() {
      if(this.find('.edit-link').length) this.css('cursor', 'pointer');
    },
    onmouseout: function() {
      this.css('cursor', 'default');
    }
  });

  $('.grid-field .action.action_import:button').entwine({
    onclick: function(e) {
      e.preventDefault();
      this.openmodal();
    },
    onmatch: function() {
      this._super();
      // Trigger auto-open
      if (this.data('state') === 'open') {
        this.openmodal();
      }
    },
    onunmatch: function() {
      this._super();
    },

    openmodal: function() {
      // Remove existing modal
      let modal = $(this.data('target'));
      let newModal = $(this.data('modal'));
      if (modal.length < 1) {
        // Add modal to end of body tag
        modal = newModal;
        modal.appendTo(document.body);
      } else {
        // Replace inner content
        modal.innerHTML = newModal.innerHTML;
      }

      // Apply backdrop
      let backdrop = $('.modal-backdrop');
      if(backdrop.length < 1) {
        backdrop = $('<div class="modal-backdrop fade"></div>');
        backdrop.appendTo(document.body);
      }

      // Set close action
      modal.find('[data-dismiss]').on('click', function() {
        backdrop.removeClass('show');
        modal.removeClass('show');
        setTimeout(function() {
          backdrop.remove();
        }, 150) // Simulate the bootstrap out-transition period
      })

      // Fade each element in (use setTimeout to ensure initial render at opacity=0 works)
      setTimeout(function() {
        backdrop.addClass('show');
        modal.addClass('show');
      }, 0);

    }
  });

  $('.grid-field .action:button').entwine({
    onclick: function(e){
      var filterState='show'; //filterstate should equal current state.

      // If the button is disabled, do nothing.
      if (this.is(':disabled')) {
        e.preventDefault();
        return;
      }

      if(this.hasClass('ss-gridfield-button-close') || !(this.closest('.grid-field').hasClass('show-filter'))) {
        filterState='hidden';
      }

      this.getGridField().reload({
        data: [{name: this.attr('name'), value: this.val(), filter: filterState}]
      });

      e.preventDefault();
    },
    /**
     * Get the url this action should submit to
     */
    actionurl: function() {
      var btn = this.closest(':button'), grid = this.getGridField(),
        form = this.closest('form'), data = form.find(':input.gridstate').serialize(),
        csrf = form.find('input[name="SecurityID"]').val();

      // Add current button
      data += "&" + encodeURIComponent(btn.attr('name')) + '=' + encodeURIComponent(btn.val());

      // Add csrf
      if(csrf) {
        data += "&SecurityID=" + encodeURIComponent(csrf);
      }

      // Include any GET parameters from the current URL, as the view
      // state might depend on it. For example, a list pre-filtered
      // through external search criteria might be passed to GridField.
      if(window.location.search) {
        data = window.location.search.replace(/^\?/, '') + '&' + data;
      }

      // decide whether we should use ? or & to connect the URL
      var connector = grid.data('url').indexOf('?') == -1 ? '?' : '&';

      return $.path.makeUrlAbsolute(
        grid.data('url') + connector + data,
        $('base').attr('href')
      );
    }

  });

  /**
   * Don't allow users to submit empty values in grid field auto complete inputs.
   */
  $('.grid-field .add-existing-autocompleter').entwine({
    onbuttoncreate: function () {
      var self = this;

      this.toggleDisabled();

      this.find('input[type="text"]').on('keyup', function () {
        self.toggleDisabled();
      });
    },
    onunmatch: function () {
      this.find('input[type="text"]').off('keyup');
    },
    toggleDisabled: function () {
      var $button = this.find('.ss-ui-button'),
        $input = this.find('input[type="text"]'),
        inputHasValue = $input.val() !== '',
        buttonDisabled = $button.is(':disabled');

      if ((inputHasValue && buttonDisabled) || (!inputHasValue && !buttonDisabled)) {
        $button.attr("disabled", !buttonDisabled);
      }
    }
  });

  // Covers both tabular delete button, and the button on the detail form
  $('.grid-field .grid-field__col-compact .action.gridfield-button-delete, .cms-edit-form .btn-toolbar button.action.action-delete').entwine({
    onclick: function(e){
      if(!confirm(i18n._t('Admin.DELETECONFIRMMESSAGE'))) {
        e.preventDefault();
        return false;
      } else {
        this._super(e);
      }
    }
  });

  $('.grid-field .grid-print-button.action:button').entwine({
    UUID: null,
    onmatch: function() {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function() {
      this._super();
    },
    onclick: function(e) {
      var url = this.actionurl();
      window.open(url);
      e.preventDefault();
      return false;
    }
  });

  $('.ss-gridfield-print-iframe').entwine({
    onmatch: function(){
      this._super();

      this.hide().bind('load', function() {
        this.focus();
        var ifWin = this.contentWindow || this;
        ifWin.print();
      });
    },
    onunmatch: function() {
      this._super();
    }
  });

  /**
   * Prevents actions from causing an ajax reload of the field.
   *
   * Useful e.g. for actions which rely on HTTP response headers being
   * interpreted natively by the browser, like file download triggers.
   */
  $('.grid-field .action.no-ajax, .grid-field .no-ajax .action:button').entwine({
    onclick: function(e){
      window.location.href = this.actionurl();
      e.preventDefault();
      return false;
    }
  });

  $('.grid-field .action-detail').entwine({
    onclick: function() {
      this.getGridField().showDetailView($(this).prop('href'));
      return false;
    }
  });

  /**
   * Allows selection of one or more rows in the grid field.
   * Purely clientside at the moment.
   */
  $('.grid-field[data-selectable]').entwine({
    /**
     * @return {jQuery} Collection
     */
    getSelectedItems: function() {
      return this.find('.ss-gridfield-item.ui-selected');
    },
    /**
     * @return {Array} Of record IDs
     */
    getSelectedIDs: function() {
      return $.map(this.getSelectedItems(), function(el) {return $(el).data('id');});
    }
  });
  $('.grid-field[data-selectable] .ss-gridfield-items').entwine({
    onadd: function() {
      this._super();

      // TODO Limit to single selection
      this.selectable();
    },
    onremove: function() {
      this._super();
      if (this.data('selectable')) this.selectable('destroy');
    }
  });

  /**
   * Catch submission event in filter input fields, and submit the correct button
   * rather than the whole form.
   */
  $('.grid-field .grid-field__filter-header :input').entwine({
    onmatch: function() {
      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
        resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');

      if(this.val()) {
        filterbtn.addClass('filtered');
        resetbtn.addClass('filtered');
      }
      this._super();
    },
    onunmatch: function() {
      this._super();
    },
    onkeydown: function(e) {
      // Skip reset button events, they should trigger default submission
      if(this.closest('.ss-gridfield-button-reset').length) return;

      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
        resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');

      if(e.keyCode == '13') {
        var btns = this.closest('.grid-field__filter-header').find('.ss-gridfield-button-filter');
        var filterState='show'; //filterstate should equal current state.
        if(this.hasClass('ss-gridfield-button-close')||!(this.closest('.grid-field').hasClass('show-filter'))){
          filterState='hidden';
        }

        this.getGridField().reload({data: [{name: btns.attr('name'), value: btns.val(), filter: filterState}]});
        return false;
      }else{
        filterbtn.addClass('hover-alike');
        resetbtn.addClass('hover-alike');
      }
    }
  });

  $(".grid-field .relation-search").entwine({
    onfocusin: function (event) {
      this.autocomplete({
        source: function(request, response){
          var searchField = $(this.element);
          var form = $(this.element).closest("form");
          $.ajax({
            headers: {
              "X-Pjax" : 'Partial'
            },
            dataType: 'json',
            type: "GET",
            url: $(searchField).data('searchUrl'),
            data: encodeURIComponent(searchField.attr('name'))+'='+encodeURIComponent(searchField.val()),
            success: response,
            error: function(e) {
              alert(i18n._t('Admin.ERRORINTRANSACTION', 'An error occured while fetching data from the server\n Please try again later.'));
            }
          });
        },
        select: function(event, ui) {
          var hiddenField = $('<input type="hidden" name="relationID" class="action_gridfield_relationfind" />');
            hiddenField.val(ui.item.id);
            $(this)
              .closest(".grid-field")
              .find(".action_gridfield_relationfind")
              .replaceWith(hiddenField);
          var addbutton = $(this).closest(".grid-field").find(".action_gridfield_relationadd");

          addbutton.removeAttr('disabled');
        }
      });
    }
  });

  $(".grid-field .pagination-page-number input").entwine({
    onkeydown: function(event) {
      if(event.keyCode == 13) {
        var newpage = parseInt($(this).val(), 10);

        var gridfield = $(this).getGridField();
        gridfield.setState('GridFieldPaginator', {currentPage: newpage});
        gridfield.reload();

        return false;
      }
    }
  });
});
