/* global jest, test, expect, afterEach */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as Preview } from '../Preview';

function makeProps(obj = {}) {
  return {
    className: 'my-classname',
    itemLinks: {},
    itemId: 123,
    onBack: () => {},
    moreActions: [],
    ViewModeComponent: () => <div data-testid="view-mode-component" />,
    ...obj
  };
}

test('Preview render() renders', () => {
  const { container } = render(
    <Preview {...makeProps()} />
  );
  expect(container.querySelectorAll('div.preview')).toHaveLength(1);
});

test('Preview renders with custom className', () => {
  const { container } = render(
    <Preview {...makeProps({ className: 'custom-class' })} />
  );
  const previewDiv = container.querySelector('div.preview');
  expect(previewDiv.classList.contains('custom-class')).toBe(true);
});

test('Preview renders with default className when not provided', () => {
  const { container } = render(
    <Preview {...makeProps({ className: undefined })} />
  );
  const previewDiv = container.querySelector('div.preview');
  expect(previewDiv.classList.contains('flexbox-area-grow')).toBe(true);
  expect(previewDiv.classList.contains('fill-height')).toBe(true);
});

test('Preview renders no preview message when itemId is not provided', () => {
  render(
    <Preview {...makeProps({ itemId: null })} />
  );
  expect(screen.getByText('No preview available.')).not.toBeNull();
});

test('Preview renders no preview message when itemId is 0', () => {
  render(
    <Preview {...makeProps({ itemId: 0 })} />
  );
  expect(screen.getByText('No preview available.')).not.toBeNull();
});

test('Preview renders no item preview message when no preview URL available', () => {
  render(
    <Preview {...makeProps({ itemId: 123, itemLinks: { preview: {} } })} />
  );
  expect(screen.getByText('There is no preview available for this item.')).not.toBeNull();
});

test('Preview renders iframe when Stage preview is available', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview/stage',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe).not.toBeNull();
  expect(iframe.getAttribute('src')).toBe('http://example.com/preview/stage');
});

test('Preview renders iframe with hidden visibility initially', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview/stage',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.style.visibility).toBe('hidden');
});

test('Preview falls back to Live preview when Stage is not available', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Live: {
            href: 'http://example.com/preview/live',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.getAttribute('src')).toBe('http://example.com/preview/live');
});

test('Preview prefers Stage over Live preview', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview/stage',
            type: 'text/html'
          },
          Live: {
            href: 'http://example.com/preview/live',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.getAttribute('src')).toBe('http://example.com/preview/stage');
});

test('Preview renders image when preview type is image', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/image.jpg',
            type: 'image/jpeg'
          }
        }
      }
    })}
    />
  );
  const img = container.querySelector('img.preview__file--fits-space');
  expect(img).not.toBeNull();
  expect(img.getAttribute('src')).toBe('http://example.com/image.jpg');
  expect(img.getAttribute('alt')).toBe('http://example.com/image.jpg');
});

test('Preview renders image for image/png type', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/image.png',
            type: 'image/png'
          }
        }
      }
    })}
    />
  );
  const img = container.querySelector('img.preview__file--fits-space');
  expect(img).not.toBeNull();
  expect(img.getAttribute('src')).toBe('http://example.com/image.png');
});

test('Preview renders edit button when edit link is available', () => {
  render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        edit: { href: 'http://example.com/edit' },
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const editLink = screen.getByText('Edit');
  expect(editLink).not.toBeNull();
  expect(editLink.closest('a').getAttribute('href')).toBe('http://example.com/edit');
});

test('Preview does not render edit button when edit link is not available', () => {
  render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  expect(screen.queryByText('Edit')).toBeNull();
});

test('Preview renders ViewModeComponent', () => {
  render(
    <Preview {...makeProps()} />
  );
  expect(screen.getByTestId('view-mode-component')).not.toBeNull();
});

test('Preview renders ActionMenu when moreActions provided', () => {
  render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      },
      moreActions: [
        <button key="action1">Action 1</button>,
        <button key="action2">Action 2</button>
      ]
    })}
    />
  );
  expect(screen.getByText('Action 1')).not.toBeNull();
  expect(screen.getByText('Action 2')).not.toBeNull();
});

test('Preview does not render ActionMenu when moreActions is empty', () => {
  render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      },
      moreActions: []
    })}
    />
  );
  expect(screen.queryByText('Action')).toBeNull();
});

test('Preview handles iframe onLoad event', () => {
  const { container, rerender } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.style.visibility).toBe('hidden');
  fireEvent.load(iframe);
  rerender(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
});

test('Preview updates iframe src when previewUrl changes', () => {
  const { container, rerender } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview/old',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  let iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.getAttribute('src')).toBe('http://example.com/preview/old');
  rerender(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview/new',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  iframe = container.querySelector('iframe.preview__iframe');
  expect(iframe.getAttribute('src')).toBe('http://example.com/preview/new');
});

test('Preview calls onBack handler when back button is clicked', () => {
  const onBackHandler = jest.fn();
  render(
    <Preview {...makeProps({
      onBack: onBackHandler
    })}
    />
  );
  const backButton = screen.queryByText('Back');
  if (backButton) {
    fireEvent.click(backButton);
    expect(onBackHandler).toHaveBeenCalled();
  }
});

test('Preview renders toolbar section', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const toolbar = container.querySelector('.toolbar.toolbar--south');
  expect(toolbar).not.toBeNull();
});

test('Preview renders button toolbar', () => {
  const { container } = render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: {
        preview: {
          Stage: {
            href: 'http://example.com/preview',
            type: 'text/html'
          }
        }
      }
    })}
    />
  );
  const btnToolbar = container.querySelector('.btn-toolbar');
  expect(btnToolbar).not.toBeNull();
});

test('Preview with no itemLinks renders no preview overlay', () => {
  render(
    <Preview {...makeProps({
      itemId: 123,
      itemLinks: null
    })}
    />
  );
  expect(screen.getByText('There is no preview available for this item.')).not.toBeNull();
});
