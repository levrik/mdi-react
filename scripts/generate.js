const fs = require('fs');

const template =
`import React from 'react';

const $NAME$Icon = ({ width = 24, height = 24, viewBox = '0 0 24 24', className, children, ...props }) => {
  let classes = 'mdi-icon';
  if (className) classes += \` \${className}\`;

  return (
    <svg {...props} width={width} height={height} viewBox={viewBox} className={classes}>
      <path d="$PATH$" />
    </svg>
  );
};

export default $NAME$Icon;
`;

/*
  Object that contains arrays that will be used in generating the typescript definition file.
*/
let defFileFillIns = {
  declareIconClasses: [],
  declareConsts: [],
  declareModules: []
};

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
  
  /*
    Pushing the different formats of typescript definitions to their respective arrays.
  */
  defFileFillIns.declareIconClasses.push(`class ${component.name}Icon extends GenericMdiIcon {}`);
  defFileFillIns.declareConsts.push(`const ${component.name}Icon: new() => MdiReact.${component.name}Icon;`);
  defFileFillIns.declareModules.push(
  `declare module "mdi-react/${component.name}Icon" {
    const ${component.name}Icon: new() => MdiReact.${component.name}Icon;
    export default ${component.name}Icon;
  }`);
}

fs.writeFileSync(`${__dirname}/../build/index.js`, indexContent);

/*
 The template for the typescript definition file.
*/
const typeDefinitionFile =
`declare namespace MdiReact {
  interface IMdiIconProps {
    width?: number,
    height?: number,
    viewBox?: string,
    className?: string,
    children?: __React.ReactNode[],
  }

  class MdiIcon<T> extends __React.Component<T, {}>{}
  class GenericMdiIcon extends MdiIcon<IMdiIconProps>{}

  ${defFileFillIns.declareIconClasses.join('\n  ')}
}

declare module "mdi-react" {
  ${defFileFillIns.declareConsts.join('\n  ')}
}

${defFileFillIns.declareModules.join('\n  ')}`
fs.writeFileSync(`${__dirname}/../build/typings.d.ts`, typeDefinitionFile);
