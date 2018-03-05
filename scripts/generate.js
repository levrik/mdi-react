const fs = require('fs');
const path = require('path');

const svgPathRegex = /\sd="(.*)"/;
// reduce string-copy-and-paste
const svgFilesPath = path.resolve(__dirname, '../mdi/svg');
const buildPath = path.resolve(__dirname, '../build');
const publishPath = path.resolve(__dirname, '../publish');

// container for the collected components
const components = [];

const svgFiles = fs.readdirSync(svgFilesPath);
for (let svgFile of svgFiles) {
  // build name
  const name = svgFile.split(/-/g).map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('').slice(0, -4);

  const content = fs.readFileSync(path.join(svgFilesPath, svgFile));
  const svgPathMatches = svgPathRegex.exec(content);
  const svgPath = svgPathMatches && svgPathMatches[1];
  // Skip on empty svgPath
  if (!svgPath) continue;

  // only concat once
  const component = {
    name: name + 'Icon',
    fileName: name + 'Icon.js',
    definition: name + 'Icon.d.ts'
  };
  components.push(component);

  const fileContent =
`import React from 'react';

const ${component.name} = ({ color = '#000', size = 24, className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={size} height={size} fill={color} viewBox="0 0 24 24" className={classes}>
      <path d="${svgPath}" />
    </svg>
  );
};

export default ${component.name};
`;

  fs.writeFileSync(path.join(buildPath, component.fileName), fileContent);

  // create the [name].d.ts contents
  const definitionContent =
`import { MdiReactIconProps, MdiReactIconComponentType } from './dist/typings';

declare const ${component.name}: MdiReactIconComponentType;
export default ${component.name};
export { MdiReactIconProps, MdiReactIconComponentType };
`;
  fs.writeFileSync(path.join(publishPath, component.definition), definitionContent);
}

// create the global typings.d.ts
const typingsContent =
`import { ComponentType } from 'react';

export interface MdiReactIconProps {
  color?: string
  size?: number
  className?: string
  // should not have any children
  children?: never
}
export type MdiReactIconComponentType = ComponentType<MdiReactIconProps>;

${components.map(component => `declare const ${component.name}: MdiReactIconComponentType;`).join('\n')}
`;

fs.writeFileSync(path.join(publishPath, 'dist', 'typings.d.ts'), typingsContent);

// Build the index.js file, before rollup compile
const indexFileContent = components
  .map(component => `export { default as ${component.name} } from './${component.fileName}';`)
  .join('\n');
fs.writeFileSync(path.join(buildPath, 'index.js'), indexFileContent);
