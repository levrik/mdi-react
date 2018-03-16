# mdi-react [![npm package](https://img.shields.io/npm/v/mdi-react.svg?style=flat-square)](https://npmjs.org/package/mdi-react) [![Material Design Icons version](https://img.shields.io/badge/mdi-v2.1.99-blue.svg?style=flat-square)](https://materialdesignicons.com)
[Material Design Icons](https://materialdesignicons.com) for React packaged as single components

## Installation

```bash
npm install mdi-react
# or if you use Yarn
yarn add mdi-react
```

## Usage

Just search for an icon on [materialdesignicons.com](https://materialdesignicons.com) and look for its name.  
The name translates to PascalCase followed by the suffix `Icon` in `mdi-react`.

For example the icons named `alert` and `alert-circle`:

```javascript
import AlertIcon from 'mdi-react/AlertIcon';
import AlertCircleIcon from 'mdi-react/AlertCircleIcon';
// If your build tools support ES module syntax and tree-shaking (like webpack 2 and above)
import { AlertIcon, AlertCircleIcon } from 'mdi-react';

const MyComponent = () => {
  return (
    <div>
      {/* The default color is #000 */}
      <AlertIcon color="#fff" />
      {/* The default size is 24px */}
      <AlertCircleIcon className="some-class" size={16} />
    </div>
  );
};
```

You can also add other default styling via the `mdi-react` class.

```css
.mdi-icon {
  /* Set this to have the color match the current text color */
  fill: currentColor;
  /* Set this to have the icon size match the current font size */
  width: 1em;
  height: 1em;
}
```
