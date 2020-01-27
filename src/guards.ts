import * as React from 'react';
import {
  contextSymbol,
  elementSymbol,
  forwardRefSymbol,
  fragmentSymbol,
  MATCHES_CLASS,
  memoSymbol,
  portalSymbol,
  providerSymbol,
} from './constants';
import {
  ReactAnyChildren,
  ReactAnyChildrenArray,
  ReactAnyNode,
  ReactClassNode,
  ReactConsumerNode,
  ReactDOMPortalNode,
  ReactForwardRefNode,
  ReactFragmentNode,
  ReactFunctionNode,
  ReactHTMLNode,
  ReactMemoNode,
  ReactProviderNode,
} from './types';

export function isFragment(node: ReactAnyNode): node is ReactFragmentNode {
  return node.$$typeof === elementSymbol && node.type === fragmentSymbol;
}

export function isHTML(node: ReactAnyNode): node is ReactHTMLNode {
  return node.$$typeof === elementSymbol && typeof node.type === 'string';
}

export function isClass(node: ReactAnyNode): node is ReactClassNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'function' &&
    (node.type instanceof React.Component ||
      (node.type.prototype && 'render' in node.type.prototype) ||
      MATCHES_CLASS.test(Object.toString.call(node.type)))
  );
}

export function isFunction(node: ReactAnyNode): node is ReactFunctionNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'function' &&
    !isClass(node)
  );
}

export function isMemo(node: ReactAnyNode): node is ReactMemoNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'object' &&
    '$$typeof' in node.type &&
    node.type.$$typeof === memoSymbol
  );
}

export function isProvider(node: ReactAnyNode): node is ReactProviderNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'object' &&
    '$$typeof' in node.type &&
    node.type.$$typeof === providerSymbol
  );
}

export function isConsumer(node: ReactAnyNode): node is ReactConsumerNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'object' &&
    '$$typeof' in node.type &&
    node.type.$$typeof === contextSymbol
  );
}

export function isForwardRef(node: ReactAnyNode): node is ReactForwardRefNode {
  return (
    node.$$typeof === elementSymbol &&
    typeof node.type === 'object' &&
    '$$typeof' in node.type &&
    node.type.$$typeof === forwardRefSymbol
  );
}

export function isPortal(node: ReactAnyNode): node is ReactDOMPortalNode {
  return node.$$typeof === portalSymbol;
}

export function isArrayOfChildren(
  node: ReactAnyChildren
): node is ReactAnyChildrenArray {
  return Array.isArray(node);
}
