import * as React from 'react';
import { ReactAnyNode, ReactShallowRenderer } from '../src';

describe('ReactShallowRenderer', () => {
  describe('internalToJSON', () => {
    it('throws an error if the node is invalid', () => {
      const renderer = new ReactShallowRenderer(<div />);

      expect(() =>
        // tslint:disable-next-line:no-string-literal
        renderer['internalToJSON'](({} as unknown) as ReactAnyNode)
      ).toThrow(/invalid/i);
    });
  });

  describe('resolveChildren', () => {
    it('returns an empty array when undefined is provided', () => {
      const renderer = new ReactShallowRenderer(<div />);

      // tslint:disable-next-line:no-string-literal
      expect(renderer['resolveChildren'](undefined)).toEqual([]);
    });

    it('calls resolveNestedChildren with non-undefined children', () => {
      const renderer = new ReactShallowRenderer(<div />);
      // tslint:disable-next-line:no-string-literal
      renderer['resolveNestedChildren'] = jest.fn();

      const nonUndefinedChildren = ['Hello'];

      // tslint:disable-next-line:no-string-literal
      renderer['resolveChildren'](nonUndefinedChildren);

      // tslint:disable-next-line:no-string-literal
      expect(renderer['resolveNestedChildren']).toHaveBeenCalledTimes(1);
      // tslint:disable-next-line:no-string-literal
      expect(renderer['resolveNestedChildren']).toHaveBeenCalledWith(
        nonUndefinedChildren
      );
    });
  });

  describe('resolveChildName', () => {
    it('throws an error if the node is invalid', () => {
      const renderer = new ReactShallowRenderer(<div />);

      expect(() =>
        // tslint:disable-next-line:no-string-literal
        renderer['resolveChildName'](({} as unknown) as ReactAnyNode)
      ).toThrow(/invalid/i);
    });
  });

  describe('invalidNodeToString', () => {
    it('returns a string representation of the invalid node', () => {
      const renderer = new ReactShallowRenderer(<div />);

      const selfReferencing: Record<string, any> = {};

      selfReferencing.reference = selfReferencing;

      // tslint:disable:no-string-literal
      expect(renderer['invalidNodeToString']('string')).toBe('"string"');
      expect(renderer['invalidNodeToString'](null)).toBe('null');
      expect(renderer['invalidNodeToString'](undefined)).toBe('undefined');
      expect(renderer['invalidNodeToString'](123)).toBe('123');
      expect(renderer['invalidNodeToString'](['foo'])).toBe('[\n  "foo"\n]');
      expect(renderer['invalidNodeToString']({ foo: 'bar' })).toBe(
        '{\n  "foo": "bar"\n}'
      );
      expect(renderer['invalidNodeToString'](new Error('error'))).toBe(
        'Error: "error"'
      );
      expect(renderer['invalidNodeToString'](selfReferencing)).toBe(
        '[object Object]\nCould not stringify: TypeError: Converting circular structure to JSON'
      );
      // tslint:enable:no-string-literal
    });
  });
});
