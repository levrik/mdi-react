# mdi-react [![npm package](https://img.shields.io/npm/v/mdi-react.svg?style=flat-square)](https://npmjs.org/package/mdi-react)
[Material Design Icons](https://www.materialdesignicons.com) for React packaged as single components

## Installation

```
npm install mdi-react --save-dev
```

*The version number of `mdi-react` is in sync with the original font.*

## Usage

Just search for an icon on [materialdesignicons.com](https://www.materialdesignicons.com) and look for its name.

For example the icon named `facebook-box`:

```javascript
import FacebookBoxIcon from 'mdi-react/FacebookBoxIcon';
// OR
import { FacebookBoxIcon } from 'mdi-react';
```

The icons get a class named `mdi-icon` attached for styling. You can also attach own additional classes with the `className` property.

*Note that the second method from the example imports every icon from this package. Use the first method if your bundler does not support the removal of unused code.*
