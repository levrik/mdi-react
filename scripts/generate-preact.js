const generate = require('./generate');

generate('preact', component => `import { h } from 'preact';

const ${component.name} = ({ color = 'currentColor', size = 24, children, ...props }) => {
  const className = 'mdi-icon ' + (props.class || props.className || '');

  return (
    <svg {...props} class={className} width={size} height={size} fill={color} viewBox="0 0 24 24">
      <path d="${component.svgPath}" />
    </svg>
  );
};

export default ${component.name};
`, component => `import { MdiReactIconComponentType } from './dist/typings';

declare const ${component.name}: MdiReactIconComponentType;
export default ${component.name};
`, components => `import { FunctionalComponent } from 'preact';

export interface MdiReactIconProps {
  color?: string;
  size?: number | string;
  class?: string;
  className?: string;
  // should not have any children
  children?: never;
}
export type MdiReactIconComponentType = FunctionalComponent<MdiReactIconProps>;

${components.map(component => `declare const ${component.name}: MdiReactIconComponentType;`).join('\n')}
`).catch(err => console.error(err));
