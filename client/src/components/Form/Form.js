import React, { useEffect, useRef } from 'react';
import FormAlert from 'components/FormAlert/FormAlert';
import PropTypes from 'prop-types';

const Form = ({
  autoFocus,
  setDOM = () => null,
  valid,
  actions,
  fieldHolder,
  actionHolder = {
    className: 'btn-toolbar'
  },
  afterMessages,
  attributes,
  fields,
  handleSubmit,
  mapActionsToComponents,
  mapFieldsToComponents,
  messages,
  formTag: FormTag = 'form',
  FormAlertComponent = FormAlert,
}) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    if (formRef.current) {
      const input = formRef.current.querySelector('input:not([type=hidden]), select, textarea');
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, []);

  /**
   * Generates a list of messages if any are available
   *
   * @returns {Array|null}
   */
  const renderMessages = () => {
    if (Array.isArray(messages)) {
      return messages.map((message, index) => (
        <FormAlertComponent
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={!index ? 'message-box--panel-top' : ''}
          {...message}
        />
      ));
    }
    return null;
  };

  const handleSubmitForm = (event, ...args) => {
    // Ensure submitting a nested form doesn't submit the parent form
    event.stopPropagation();
    // Pass submission handling up the component stack
    handleSubmit(event, ...args);
  };

  const validForm = valid !== false;
  const fieldsContent = mapFieldsToComponents(fields);
  const actionsContent = mapActionsToComponents(actions);
  const messagesContent = renderMessages();

  const className = ['form'];
  if (validForm === false) {
    className.push('form--invalid');
  }
  if (attributes && attributes.className) {
    className.push(attributes.className);
  }
  const formProps = {
    ...attributes,
    onSubmit: handleSubmitForm,
    className: className.join(' '),
  };

  return (
    <FormTag
      {...formProps}
      ref={(formEl) => { formRef.current = formEl; setDOM(formEl); }}
      role="form"
    >
      {fieldsContent &&
        <fieldset {...fieldHolder}>
          {messagesContent}
          {afterMessages}

          {fieldsContent}
        </fieldset>
      }

      { actionsContent && actionsContent.length
        ?
          <div {...actionHolder}>
            {actionsContent}
          </div>
        : null
      }
    </FormTag>
  );
};

Form.propTypes = {
  autoFocus: PropTypes.bool,
  setDOM: PropTypes.func,
  valid: PropTypes.bool,
  actions: PropTypes.array,
  fieldHolder: PropTypes.shape({
    className: PropTypes.string
  }),
  actionHolder: PropTypes.shape({
    className: PropTypes.string
  }),
  extraClass: PropTypes.string,
  afterMessages: PropTypes.node,
  attributes: PropTypes.shape({
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    encType: PropTypes.string,
    id: PropTypes.string,
    method: PropTypes.string.isRequired,
  }),
  fields: PropTypes.array.isRequired,
  // props is named `handleSubmit` as it is recieved from redux-form
  handleSubmit: PropTypes.func,
  mapActionsToComponents: PropTypes.func.isRequired,
  mapFieldsToComponents: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    extraClass: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
  })),
  formTag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  FormAlertComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

export { Form as Component };

export default Form;
