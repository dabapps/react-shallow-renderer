# react-shallow-renderer

**A shallow renderer for React components**

## About

This is a fork of [@jakesidsmith/react-shallow-renderer](https://github.com/jakesidsmith/react-shallow-renderer).

This is an alternative renderer to `react-test-renderer/shallow` with full support for:

* React.memo
* React.forwardRef
* React.Fragment
* React.createContext (Provider and Consumer)
* ReactDOM.createPortal
* Functional components
* Component classes

The output of this renderer is far more informative than other existing renderers, providing context of memo wrapped components, fragments, etc.

## Install

```shell
npm i @dabapps/react-shallow-renderer -S
```

## Usage

Example with jest:

```jsx
import React from 'react';
import { ReactShallowRenderer } from '@dabapps/react-shallow-renderer';
import MyComponent from './path';

describe('MyComponent', () => {
  it('renders some stuff', () => {
    const renderer = new ReactShallowRenderer(<MyComponent />);

    expect(renderer).toMatchSnapshot();
  });
});
```

Newer versions of jest will automatically call the `toJSON` method of the renderer. If the version you are using doesn't you can try:

```jsx
expect(renderer.toJSON()).toMatchSnapshot();
```

## Example output in jest snapshots

### A form component using `memo`, `Fragment`, a `SubmitButton` component that uses `memo`, and an external form library that uses `forwardRef`

```jsx
import React from 'react';
import { Field } from 'form-library';
import SubmitButton from './path';

const MyComponent = (props) => (
  <>
    <h1>
      Log in
    </h1>
    <form onSubmit={props.handleSubmit}>
      <Field component="input" type="email" name="email"  />
      <Field component="input" type="password" name="password"  />
      <SubmitButton>
        Log in
      </SubmitButton>
    </form>
    <a href="/forgot-password">
      Forgot password?
    </a>
  </>
);

export default React.memo(MyComponent);
```

### The output

```html
<React.Fragment>
  <h1>
    Log in
  </h1>
  <form
    onSubmit={[Function]}
  >
    <React.forwardRef(Field)
      component="input"
      type="email"
      name="email"
    />
    <React.forwardRef(Field)
      component="input"
      type="password"
      name="password"
    />
    <React.memo(SubmitButton)>
      Log in
    </React.memo(SubmitButton)>
  </form>
  <a
    href="/forgot-password"
  >
    Forgot password?
  </a>
</React.Fragment>
```

### A component using ReactDOM.createPortal, and a context consumer

```jsx
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Popover from './path';
import { MyContext } from './another-path';

export default class MyComponent extends PureComponent {
  render() {
    return ReactDOM.createPortal(
      (
        <Popover>
          <MyContext.Consumer>
            {(value) => (
              <p>
                Some content: {value}
              </p>
            )}
          </MyContext.Consumer>
        </Popover>
      ),
      document.getElementById('my-id')
    );
  }
}
```

### The output

```html
<ReactDOM.Portal>
  <Popover>
    <React.Consumer>
      [Function: Unknown]
    </React.Consumer>
  </Popover>
</ReactDOM.Portal>
```

You can avoid the `Unknown` function here by defining a named function, or `const` outside of the render method, which should give you a nicer output, such as:

```html
<React.Consumer>
  [Function: myFunction]
</React.Consumer>
```

## Tips

In order to get better snapshots (and avoid unknown component names in dev tools), you should not define anonymous / arrow functions in your render method, or immediately inside wrappers like React.memo and React.forwardRef. Instead I recommend the following:

```jsx
const MyComponent = () => <div />;

export default React.memo(MyComponent);
```

Or with react-redux:

```jsx
const MyComponent = () => <div />;

export default connect(mapStateToProps)(React.memo(MyComponent));
```

## Updating this fork from upstream

Ensure you have added a remote upstream in git e.g.

```shell
git remote add upstream git@github.com:JakeSidSmith/react-shallow-renderer.git
```

Create a new branch (from master) and run the following to pull changes from [upstream](https://github.com/jakesidsmith/react-shallow-renderer):

```shell
git fetch upstream
git pull upstream master
```
