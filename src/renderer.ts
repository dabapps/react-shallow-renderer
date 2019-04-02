import * as React from 'react';
import { elementSymbol } from './constants';
import {
  isArray,
  isClass,
  isConsumer,
  isForwardRef,
  isFragment,
  isFunction,
  isHTML,
  isMemo,
  isPortal,
  isProvider,
} from './guards';
import {
  ReactAnyChild,
  ReactAnyChildren,
  ReactAnyChildrenArray,
  ReactAnyNode,
  ReactResolvedChild,
  ReactResolvedChildren,
  ReactResolvedChildrenArray,
} from './types';

export class ReactShallowRenderer {
  private element: ReactAnyNode;

  public constructor(element: React.ReactElement) {
    this.element = element as ReactAnyNode;
  }

  public toJSON(): ReactResolvedChildren {
    return this.internalToJSON(this.element);
  }

  private internalToJSON(node: ReactAnyNode): ReactResolvedChildren {
    if (isHTML(node)) {
      return {
        ...node,
        props: {
          ...node.props,
          children: this.resolveChildren(node.props.children),
        },
      };
    }

    if (isFunction(node)) {
      const rendered = node.type(node.props) as ReactAnyChildren;
      const children = this.resolveChildren(
        ([] as ReactAnyChildrenArray).concat(rendered)
      );

      if (children.length === 1) {
        return children[0];
      }

      return children;
    }

    if (isClass(node)) {
      const rendered = new node.type(node.props).render() as ReactAnyChildren;
      const children = this.resolveChildren(
        ([] as ReactAnyChildrenArray).concat(rendered)
      );

      if (children.length === 1) {
        return children[0];
      }

      return children;
    }

    if (isMemo(node)) {
      return this.internalToJSON({
        ...node,
        type: node.type.type,
      });
    }

    if (isFragment(node) || isProvider(node) || isConsumer(node)) {
      return this.internalToJSON({
        ...node,
        type: this.resolveChildName(node),
      });
    }

    if (isForwardRef(node)) {
      const rendered = node.type.render(
        node.props,
        node.ref
      ) as ReactAnyChildren;
      const children = this.resolveChildren(
        ([] as ReactAnyChildrenArray).concat(rendered)
      );

      if (children.length === 1) {
        return children[0];
      }

      return children;
    }

    if (isPortal(node)) {
      return this.resolveChild(node);
    }

    throw new Error(this.constructInvalidNodeMessage(node));
  }

  private resolveChildren(
    children: ReactAnyChildren
  ): ReactResolvedChildrenArray {
    if (typeof children === 'undefined') {
      return [];
    }

    return ([] as ReactResolvedChildrenArray).concat(
      this.resolveNestedChildren(children)
    );
  }

  private resolveNestedChildren(
    children: ReactAnyChildren
  ): ReactResolvedChildren {
    if (
      !children ||
      typeof children === 'string' ||
      typeof children === 'number' ||
      typeof children === 'boolean'
    ) {
      return children;
    }

    if (!isArray(children)) {
      return this.resolveChild(children);
    }

    return children.map(child => {
      if (isArray(child)) {
        return this.resolveNestedChildren(child);
      }

      return this.resolveChild(child);
    });
  }

  private resolveChild(node: ReactAnyChild): ReactResolvedChild {
    if (!node) {
      return node;
    }

    if (typeof node === 'object') {
      if (isPortal(node)) {
        return {
          $$typeof: elementSymbol,
          type: this.resolveChildName(node),
          key: null,
          ref: null,
          props: {
            children: this.resolveChildren(node.children),
          },
          _owner: null,
          _store: {},
        };
      }

      return {
        ...node,
        $$typeof: elementSymbol,
        type: this.resolveChildName(node),
        props: {
          ...node.props,
          children: this.resolveChildren(node.props.children),
        },
      };
    }

    if (typeof node === 'function') {
      return `[Function: ${this.resolveFunctionName(node)}]`;
    }

    return node;
  }

  private resolveChildName(node: ReactAnyNode): string {
    if (isHTML(node)) {
      return node.type;
    }

    if (isFunction(node) || isClass(node)) {
      return this.resolveFunctionName(node.type);
    }

    if (isMemo(node)) {
      return `React.memo(${this.resolveChildName({
        ...node,
        type: node.type.type,
      })})`;
    }

    if (isForwardRef(node)) {
      return `React.forwardRef(${this.resolveChildName({
        ...node,
        type:
          node.type.displayName || this.resolveFunctionName(node.type.render),
      })})`;
    }

    if (isFragment(node)) {
      return 'React.Fragment';
    }

    if (isProvider(node)) {
      return 'React.Provider';
    }

    if (isConsumer(node)) {
      return 'React.Consumer';
    }

    if (isPortal(node)) {
      return 'ReactDOM.Portal';
    }

    throw new Error(this.constructInvalidNodeMessage(node));
  }

  private resolveFunctionName(
    fn: React.FunctionComponent | React.ComponentClass
  ) {
    return fn.displayName || fn.name || 'Unknown';
  }

  private constructInvalidNodeMessage(node: unknown): string {
    return `Invalid or unsupported React element / child: ${this.invalidNodeToString(
      node
    )}`;
  }

  private invalidNodeToString(node: unknown): string {
    if (typeof node === 'string') {
      return `"${node}"`;
    }

    if (
      typeof node === 'number' ||
      typeof node === 'undefined' ||
      node === null
    ) {
      return `${node}`;
    }

    if (node instanceof Error) {
      return `${node.name}: "${node.message}"`;
    }

    let stringified;

    try {
      stringified = JSON.stringify(node, undefined, 2);
    } catch (error) {
      return `${Object.prototype.toString.call(
        node
      )}\nCould not stringify: ${error}`;
    }

    return stringified;
  }
}
