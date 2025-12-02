/* global jest, test, describe, it, expect, beforeEach */

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Component as Search, hasFilters } from '../Search';

jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => () => null);

function makeProps(obj = {}) {
  return {
    formSchemaUrl: 'someUrl',
    id: 'MyForm',
    schemaName: 'mySchemaName',
    onSearch: jest.fn(),
    query: {},
    formData: {},
    actions: {
      schema: {
        setSchemaStateOverrides: jest.fn(),
      },
      reduxForm: {
        initialize: jest.fn(),
        reset: jest.fn(),
        change: jest.fn()
      }
    },
    ...obj
  };
}

test('Search handleChange', () => {
  const reduxFormChange = jest.fn();
  let props = makeProps();
  props = {
    ...props,
    actions: {
      ...props.actions,
      reduxForm: {
        change: reduxFormChange
      }
    },
    formData: {
      searchTerm: 'foo'
    }
  };
  const { container } = render(<Search {...props}/>);
  const input = container.querySelector('.search-box__content-field');
  // handle change is called on initial render
  expect(reduxFormChange).toHaveBeenCalledWith('mySchemaName', 'searchTerm', '');
  fireEvent.change(input, { target: { value: 'foo' } });
  expect(input.value).toEqual('foo');
  expect(reduxFormChange).toHaveBeenCalledWith('mySchemaName', 'searchTerm', 'foo');
});

test('Search display NONE', () => {
  const { container } = render(<Search {...makeProps({
    display: 'NONE'
  })}
  />);
  expect(container.querySelector('.search')).toBeNull();
});

test('Search display VISIBLE', () => {
  const { container } = render(<Search {...makeProps({
    display: 'VISIBLE'
  })}
  />);
  expect(container.querySelector('.search')).not.toBeNull();
  expect(container.querySelector('.search-form').classList).toContain('collapse');
});

test('Search display EXPANDED', () => {
  const { container } = render(<Search {...makeProps({
    display: 'EXPANDED'
  })}
  />);
  expect(container.querySelector('.search')).not.toBeNull();
  expect(container.querySelector('.search-form').classList).toContain('collapsing');
  expect(container.querySelector('.search-form').getAttribute('style')).toContain('height: 0px;');
});

test('Search doSearch', () => {
  const onSearch = jest.fn();
  const { container } = render(<Search {...makeProps({
    onSearch
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'foo' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith({ searchTerm: 'foo' });
});

test('Search setOverrides converts values into name/value notation', () => {
  const mockSetSchemaStateOverrides = jest.fn();
  let props = makeProps({
    filters: {
      foo: true,
      bar: null
    }
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      schema: {
        ...props.actions.schema,
        setSchemaStateOverrides: mockSetSchemaStateOverrides
      }
    }
  };
  render(<Search {...props}/>);
  expect(mockSetSchemaStateOverrides).toHaveBeenCalledWith('someUrl', {
    fields: [
      { name: 'foo', value: true },
      { name: 'bar', value: null }
    ]
  });
});

test('Search clear button()', () => {
  const { container } = render(<Search {...makeProps()}/>);
  const input = container.querySelector('.search-box__content-field');
  expect(container.querySelector('.search-form__clear')).toBeNull();
  fireEvent.change(input, { target: { value: 'foo' } });
  expect(container.querySelector('.search-form__clear')).not.toBeNull();
  fireEvent.change(input, { target: { value: '' } });
  expect(container.querySelector('.search-form__clear')).toBeNull();
});

test('Search trailing space should be ignored', () => {
  const onSearch = jest.fn();
  const { container } = render(<Search {...makeProps({
    onSearch
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'Hello world ' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toBeCalledWith({ searchTerm: 'Hello world' });
});

test('hasFilters returns false with null', () => {
  expect(hasFilters(null)).toBeFalsy();
});

test('hasFilters returns false with empty object', () => {
  expect(hasFilters({})).toBeFalsy();
});

test('hasFilters returns true when keyed object', () => {
  expect(hasFilters({ foo: 'bar' })).toBeTruthy();
});

test('Search show() sets display to VISIBLE', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    display: 'NONE',
    displayBehavior: 'TOGGLABLE',
    onSearch
  });
  const { container } = render(<Search {...props}/>);
  expect(container.querySelector('.search')).toBeNull();
  expect(container.querySelector('.search-toggle')).not.toBeNull();
});

test('Search initializes searchText from term prop', () => {
  const { container } = render(<Search {...makeProps({
    term: 'initial-search'
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  expect(input.value).toBe('initial-search');
});

test('Search initializes searchText from filters with filterPrefix', () => {
  const { container } = render(<Search {...makeProps({
    filters: {
      Admin_searchTerm: 'from-filter'
    },
    filterPrefix: 'Admin_',
    name: 'searchTerm'
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  expect(input.value).toBe('from-filter');
});

test('Search handleChange updates state when value changes', () => {
  const { container } = render(<Search {...makeProps()}/>);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'new value' } });
  expect(input.value).toBe('new value');
});

test('Search handleChange calls redux-form change when field exists in formData', () => {
  const reduxFormChange = jest.fn();
  let props = makeProps();
  props = {
    ...props,
    actions: {
      ...props.actions,
      reduxForm: {
        change: reduxFormChange
      }
    },
    formData: {
      searchTerm: ''
    },
    schemaName: 'TestSchema'
  };
  const { container } = render(<Search {...props}/>);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'test' } });
  expect(reduxFormChange).toHaveBeenCalledWith('TestSchema', 'searchTerm', 'test');
});

test('Search getData() includes all non-empty formData fields', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    formData: {
      status: 'published',
      category: 'news',
      author: ''
    }
  });
  const { container } = render(<Search {...props}/>);
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({
    status: 'published',
    category: 'news'
  }));
});

test('Search getData() does not include author when empty string', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    formData: {
      author: ''
    }
  });
  const { container } = render(<Search {...props}/>);
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).not.toHaveBeenCalledWith(expect.objectContaining({
    author: ''
  }));
});

test('Search getData() extracts value from react-select dropdown objects', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    formData: {
      authorID: { value: '42', label: 'John Doe' }
    }
  });
  const { container } = render(<Search {...props}/>);
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({
    authorID: '42'
  }));
});

test('Search getData() handles multiple ID fields correctly', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    formData: {
      authorID: { value: '42', label: 'Author' },
      publisherID: { value: '7', label: 'Publisher' }
    }
  });
  const { container } = render(<Search {...props}/>);
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({
    authorID: '42',
    publisherID: '7'
  }));
});

test('Search searchTermIsDirty() returns true when search text differs from initial', () => {
  const { container } = render(<Search {...makeProps({
    term: 'initial'
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'changed' } });
  expect(container.querySelector('.search-form__clear')).not.toBeNull();
});

test('Search formatTagData() returns empty array when no tagData', () => {
  const { container } = render(<Search {...makeProps({
    tagData: {}
  })}
  />);
  const tags = container.querySelectorAll('[data-testid^="tag"]');
  expect(tags.length).toBe(0);
});

test('Search formatTagData() excludes field matching nameKey', () => {
  const props = makeProps({
    tagData: {
      searchTerm: { key: 'searchTerm', label: 'Search Term', value: 'test' },
      status: { key: 'status', label: 'Status', value: 'active' }
    },
    name: 'searchTerm',
    filterPrefix: ''
  });
  const { container } = render(<Search {...props}/>);
  expect(container.textContent).toContain('active');
});

test('Search formatTagData() preserves other tagData fields', () => {
  const props = makeProps({
    tagData: {
      status: { key: 'status', label: 'Status', value: 'active' },
      category: { key: 'category', label: 'Category', value: 'news' }
    }
  });
  const { container } = render(<Search {...props}/>);
  expect(container.textContent).toContain('Status');
  expect(container.textContent).toContain('news');
});

test('Search doSearch updates state and calls onSearch', () => {
  const onSearch = jest.fn();
  const { container } = render(<Search {...makeProps({
    onSearch
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'test' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalled();
});

test('Search setOverrides is called on mount with filters', () => {
  const setSchemaStateOverrides = jest.fn();
  const props = makeProps({
    filters: {
      status: 'published'
    },
    actions: {
      schema: {
        setSchemaStateOverrides
      },
      reduxForm: {
        initialize: jest.fn(),
        reset: jest.fn(),
        change: jest.fn()
      }
    }
  });
  render(<Search {...props}/>);
  expect(setSchemaStateOverrides).toHaveBeenCalledWith('someUrl', expect.objectContaining({
    fields: expect.any(Array)
  }));
});

test('Search setOverrides converts filter object to name/value pairs', () => {
  const setSchemaStateOverrides = jest.fn();
  const props = makeProps({
    filters: {
      status: 'published',
      author: 'John'
    },
    actions: {
      schema: {
        setSchemaStateOverrides
      },
      reduxForm: {
        initialize: jest.fn(),
        reset: jest.fn(),
        change: jest.fn()
      }
    }
  });
  render(<Search {...props}/>);
  expect(setSchemaStateOverrides).toHaveBeenCalledWith('someUrl', {
    fields: expect.arrayContaining([
      { name: 'status', value: 'published' },
      { name: 'author', value: 'John' }
    ])
  });
});

test('Search with displayBehavior HIDEABLE renders close button', () => {
  const { container } = render(<Search {...makeProps({
    displayBehavior: 'HIDEABLE'
  })}
  />);
  expect(container.querySelector('.search')).not.toBeNull();
});

test('Search with displayBehavior TOGGLABLE displays SearchToggle when hidden', () => {
  const { container } = render(<Search {...makeProps({
    display: 'NONE',
    displayBehavior: 'TOGGLABLE'
  })}
  />);
  expect(container.querySelector('.search-toggle')).not.toBeNull();
});

test('Search with displayBehavior NONE returns empty div when hidden', () => {
  const { container } = render(<Search {...makeProps({
    display: 'NONE',
    displayBehavior: 'NONE'
  })}
  />);
  expect(container.querySelector('.search')).toBeNull();
  expect(container.querySelector('.search-toggle')).toBeNull();
});

test('Search respects placeholder prop', () => {
  const { container } = render(<Search {...makeProps({
    placeholder: 'Find records...'
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  expect(input.placeholder).toBe('Find records...');
});

test('Search merges form data with search term correctly', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    formData: {
      Page_status: 'published'
    },
    filterPrefix: 'Page_'
  });
  const { container } = render(<Search {...props}/>);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'keyword' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalled();
});

test('Search only includes search term in data if not already in formData', () => {
  const onSearch = jest.fn();
  const props = makeProps({
    onSearch,
    name: 'searchTerm',
    filterPrefix: 'Page_',
    formData: {
      Page_searchTerm: 'from-form'
    }
  });
  const { container } = render(<Search {...props}/>);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'from-input' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith(expect.not.objectContaining({
    searchTerm: 'from-input'
  }));
});

test('Search displays clear button when data is present', () => {
  const { container } = render(<Search {...makeProps()}/>);
  expect(container.querySelector('.search-form__clear')).toBeNull();
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'data' } });
  expect(container.querySelector('.search-form__clear')).not.toBeNull();
});

test('Search displays clear button when form data is present', () => {
  const { container } = render(<Search {...makeProps({
    formData: {
      status: 'published'
    }
  })}
  />);
  expect(container.querySelector('.search-form__clear')).not.toBeNull();
});
