const fs = require('fs');

const template =
`import React from 'react';

const $NAME$Icon = ({ viewBox = '0 0 24 24', className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} className={classes} viewBox={viewBox}>
      <path d="$PATH$" />
    </svg>
  );
};

export default $NAME$Icon;
`;

const pathRegex = /\sd="(.*)"/;

const svgs = fs.readdirSync(`${__dirname}/../mdi/icons/svg`);

const components = svgs.map(svg => {
  return {
    name: svg.split(/-/g).map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('').slice(0, -4),
    path: (() => {
      const content = fs.readFileSync(`${__dirname}/../mdi/icons/svg/${svg}`, { encoding: 'utf8' });

      let pathMatches = pathRegex.exec(content);
      if (pathMatches) {
        return pathMatches[1];
      }
    })()
  };
}).filter(component => component.path);

let indexContent = '';

for (let component of components) {
  let fileContent = template.replace(/\$NAME\$/g, component.name).replace(/\$PATH\$/g, component.path);
  fs.writeFileSync(`${__dirname}/../build/${component.name}Icon.js`, fileContent);

  indexContent += `export ${component.name} from './${component.name}Icon';\n`;
}

fs.writeFileSync(`${__dirname}/../build/index.js`, indexContent);
