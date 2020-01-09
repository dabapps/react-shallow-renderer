import * as React from 'react';

import { ReactShallowRenderer } from '../../src';
import { elementSymbol } from '../../src/constants';
import { compare } from '../helpers/compare';

describe('ReactShallowRenderer', () => {
  const ComponentWithFalsyChildren: React.FunctionComponent = () => (
    <div>
      <p>{null}</p>
      <p>{false}</p>
    </div>
  );

  const ComponentWithMappedChildren: React.FunctionComponent = () => (
    <div>
      {[1, 2, 3].map(child => (
        <p key={child}>{child}</p>
      ))}
      {[[<div key={1} />]]}
    </div>
  );

  describe('toJSON', () => {
    it('renders some simple HTML', () => {
      const element = (
        <div>
          <p>I am a child!</p>I am text!
        </div>
      );

      const renderer = new ReactShallowRenderer(element);

      compare(renderer.toJSON(), {
        $$typeof: elementSymbol,
        type: 'div',
        key: null,
        ref: null,
        props: {
          children: [
            {
              $$typeof: elementSymbol,
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: ['I am a child!'],
              },
              _owner: null,
              _store: {},
            },
            'I am text!',
          ],
        },
        _owner: null,
        _store: {},
      });
    });

    it('renders a component with a falsy children', () => {
      const element = <ComponentWithFalsyChildren />;

      const renderer = new ReactShallowRenderer(element);

      compare(renderer.toJSON(), {
        $$typeof: elementSymbol,
        type: 'div',
        key: null,
        ref: null,
        props: {
          children: [
            {
              $$typeof: elementSymbol,
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: [null],
              },
              _owner: null,
              _store: {},
            },
            {
              $$typeof: elementSymbol,
              type: 'p',
              key: null,
              ref: null,
              props: {
                children: [false],
              },
              _owner: null,
              _store: {},
            },
          ],
        },
        _owner: null,
        _store: {},
      });
    });

    it('renders a component with mapped (nested) children', () => {
      const element = <ComponentWithMappedChildren />;

      const renderer = new ReactShallowRenderer(element);

      compare(renderer.toJSON(), {
        $$typeof: elementSymbol,
        type: 'div',
        key: null,
        ref: null,
        props: {
          children: [
            [
              {
                $$typeof: elementSymbol,
                type: 'p',
                key: '1',
                ref: null,
                props: {
                  children: [1],
                },
                _owner: null,
                _store: {},
              },
              {
                $$typeof: elementSymbol,
                type: 'p',
                key: '2',
                ref: null,
                props: {
                  children: [2],
                },
                _owner: null,
                _store: {},
              },
              {
                $$typeof: elementSymbol,
                type: 'p',
                key: '3',
                ref: null,
                props: {
                  children: [3],
                },
                _owner: null,
                _store: {},
              },
            ],
            [
              [
                {
                  $$typeof: elementSymbol,
                  type: 'div',
                  key: '1',
                  ref: null,
                  props: {
                    children: [],
                  },
                  _owner: null,
                  _store: {},
                },
              ],
            ],
          ],
        },
        _owner: null,
        _store: {},
      });
    });
  });
});
