const fs = require('fs');
const Path = require('path');
const pathRegex = /\sd="(.*)"/;

// reduce string-copy-and-paste
const svgPath = Path.resolve(__dirname, '../mdi/svg');
const buildPath = Path.resolve(__dirname, '../build');
const publishPath = Path.resolve(__dirname, '../publish');

// container for the collected icons
const icons = [];

const svgFiles = fs.readdirSync(`${__dirname}/../mdi/svg`);
for (let svgFile of svgFiles) {
  // build name
  const name = svgFile.split(/-/g)
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')
  .slice(0, -4);

  // only concat once
  const nameIcon = `${name}Icon`;
  icons.push(nameIcon)

  const content = fs.readFileSync(Path.join(svgPath, svgFile));
  const pathMatches = pathRegex.exec(content);
  const path = pathMatches && pathMatches[1];

  // Skip on empty path
  if (!path) continue;

  const fileContent =
`import React from 'react';

const ${nameIcon} = ({ width = 24, height = 24, viewBox = '0 0 24 24', className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={width} height={height} viewBox={viewBox} className={classes}>
      <path d="${path}" />
    </svg>
  );
};

export default ${nameIcon};
`;
  fs.writeFileSync(Path.join(buildPath, `${nameIcon}.js`), fileContent);

  // create the [name].d.ts contents
  const typeContent =
`import { ReactMdiIconProps, ReactMdiIconComponentType } from './typings'
export { ReactMdiIconProps, ReactMdiIconComponentType }

declare const ${nameIcon}: ReactMdiIconComponentType;
export default ${nameIcon};
`;
  fs.writeFileSync(Path.join(publishPath, `${nameIcon}.d.ts`), typeContent);
}

// create the global typings.d.ts
const typingsContent =
`import { ComponentType } from "react";

export interface ReactMdiIconProps {
  width?: number
  height?: number
  viewBox?: string
  className?: string
}

export type ReactMdiIconComponentType = ComponentType<ReactMdiIconProps>;

${icons.map(nameIcon =>
`declare const ${nameIcon}: ReactMdiIconComponentType;
`).join('')}
`;

fs.writeFileSync(Path.join(publishPath, 'typings.d.ts'), typingsContent);

// Build the index.js file, before babel compile
const indexContent = icons.map(nameIcon => `export ${nameIcon} from './${nameIcon}'`).join('\n')
fs.writeFileSync(Path.join(buildPath, 'index.js'), indexContent);
