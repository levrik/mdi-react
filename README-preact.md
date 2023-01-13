# mdi-preact [![npm package](https://img.shields.io/npm/v/mdi-preact.svg?style=flat-square)](https://npmjs.org/package/mdi-preact) [![Material Design Icons version](https://img.shields.io/badge/mdi-v7.1.96-blue.svg?style=flat-square)](https://materialdesignicons.com) [![build status](https://img.shields.io/travis/levrik/mdi-preact/master.svg?style=flat-square)](https://travis-ci.org/levrik/mdi-preact)
[Material Design Icons](https://materialdesignicons.com) for Preact/React packaged as single components

**New v9.1.0 released: See [CHANGELOG.md](./CHANGELOG.md)**

## Installation

```bash
npm install mdi-preact
# or if you use Yarn
yarn add mdi-preact
```

Support for [React](https://reactjs.org/) is available via the `mdi-react` package.

## Usage

Just search for an icon on [materialdesignicons.com](https://materialdesignicons.com) and look for its name.  
The name translates to PascalCase followed by the suffix `Icon` in `mdi-preact`.  
Also it's possible to import with an alias. You can find them on the detail page of the respective icon.

For example the icons named `alert` and `alert-circle`:

```javascript
import AlertIcon from 'mdi-preact/AlertIcon';
import AlertCircleIcon from 'mdi-preact/AlertCircleIcon';

const MyComponent = () => {
  return (
    <div>
      {/* The default color is the current text color (currentColor) */}
      <AlertIcon color="#fff" />
      {/* The default size is 24 */}
      <AlertCircleIcon class="some-class" size={16} />
      {/* This sets the icon size to the current font size */}
      <AlertIcon size="1em" />
    </div>
  );
};
```

To change the color on hover you can just use your own class and plain CSS.

```css
.some-class:hover {
  fill: red;
}
```

You can also add default styling via the `mdi-icon` class.

```css
.mdi-icon {
  background-color: green;
}
```
