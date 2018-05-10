const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.resolve(__dirname, '..', 'README.md'), 'utf8');

content = content.replace(/mdi-react/g, 'mdi-preact');
content = content.replace('React/Preact', 'Preact/React');
content = content.replace(/<!-- Preact intro -->(.|\r?\n)*<!-- Preact intro -->/g, 'Support for [React](https://reactjs.org/) is available via the `mdi-react` package.');
content = content.replace('className', 'class');

fs.writeFileSync(path.resolve(__dirname, '..', 'README-preact.md'), content);
