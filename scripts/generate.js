const fs = require('fs');
const Path = require('path');
const pathRegex = /\sd="(.*)"/;

// reduce string-copy-and-paste
const svgPath = Path.resolve(__dirname, '../mdi/svg');
const buildPath = Path.resolve(__dirname, '../build');
const publishPath = Path.resolve(__dirname, '../publish');

// container for the collected components
const components = [];

const svgFiles = fs.readdirSync(`${__dirname}/../mdi/svg`);
for (let svgFile of svgFiles) {
  // build name
  const name = svgFile.split(/-/g)
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')
  .slice(0, -4);

  const content = fs.readFileSync(Path.join(svgPath, svgFile));
  const pathMatches = pathRegex.exec(content);
  const path = pathMatches && pathMatches[1];

  // Skip on empty path
  if (!path) continue;

  // only concat once
  const component = {
    name: `${name}Icon`,
    fileName: `${name}Icon.js`,
    definition: `${name}Icon.d.ts`
  };
  components.push(component)

  const fileContent =
`import React from 'react';

const ${component.name} = ({ color = '#000', size = 24, width = size, height = size, viewBox, className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={width} height={height} viewBox={viewBox || \`0 0 0 \${size}\`} className={classes}>
      <path d="${path}" />
    </svg>
  );
};

export default ${component.name};
`;
  fs.writeFileSync(Path.join(buildPath, component.fileName), fileContent);

  // create the [name].d.ts contents
  const definitionContent =
`import { ReactMdiIconProps, ReactMdiIconComponentType } from './typings'
export { ReactMdiIconProps, ReactMdiIconComponentType }

declare const ${component.name}: ReactMdiIconComponentType;
export default ${component.name};
`;
  fs.writeFileSync(Path.join(publishPath, component.definition), definitionContent);
}

// create the global typings.d.ts
const typingsContent =
`import { ComponentType } from "react";

export interface ReactMdiIconProps {
  color?: string
  size?: number
  width?: number
  height?: number
  viewBox?: string
  className?: string
  // should not have any children
  children?: never
}

export type ReactMdiIconComponentType = ComponentType<ReactMdiIconProps>;

${components.map(component =>
`declare const ${component.name}: ReactMdiIconComponentType;
`).join('')}
`;

fs.writeFileSync(Path.join(publishPath, 'typings.d.ts'), typingsContent);

// Build the index.js file, before babel compile
const indexContent = components
.map(component => `export { default as ${component.name} } from './${component.fileName}'`)
.join('\n');

fs.writeFileSync(Path.join(buildPath, 'index.js'), indexContent);
