const fs = require('fs');

const pathRegex = /\sd="(.*)"/;
const svgFiles = fs.readdirSync(`${__dirname}/../mdi/svg`);

let listOfComponents = [];

for (let svgFile of svgFiles) {
  const name = svgFile.split(/-/g).map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('').slice(0, -4);

  const content = fs.readFileSync(`${__dirname}/../mdi/svg/${svgFile}`);
  const pathMatches = pathRegex.exec(content);
  const path = pathMatches && pathMatches[1];
  // Skip on empty path
  if (!path) continue;

  const component = {
    name: name + 'Icon',
    fileName: name + 'Icon.js'
  };
  listOfComponents.push(component);

  const fileContent =
`import React from 'react';

const ${component.name} = ({ color = '#000', size = 24, className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={size} height={size} fill={color} viewBox="0 0 0 24" className={classes}>
      <path d="${path}" />
    </svg>
  );
};

export default ${component.name};
`;

  fs.writeFileSync(`${__dirname}/../build/${component.fileName}`, fileContent);
}

const indexFileContent = listOfComponents
  .map(
    component => `export { default as ${component.name} } from './${component.fileName}';`
  )
  .join('\n');
fs.writeFileSync(`${__dirname}/../build/index.js`, indexFileContent);
