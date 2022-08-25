const generate = require('./generate');

generate('react', component => `import React from 'react';

const ${component.name} = ({ color = 'currentColor', size = 24, children, ...props }) => {
  const className = 'mdi-icon ' + (props.className || '');

  return (
    <svg {...props} className={className} width={size} height={size} fill={color} viewBox="0 0 24 24">
      <path d="${component.svgPath}" />
    </svg>
  );
};

export default React.memo ? React.memo(${component.name}) : ${component.name};
`, component => `import { MdiReactIconComponentType } from './dist/typings';

declare const ${component.name}: MdiReactIconComponentType;
export = ${component.name};
`, () => `import { ComponentType, SVGProps } from 'react';

type AllSVGProps = SVGProps<SVGSVGElement>

type ReservedProps = 'color' | 'size' | 'width' | 'height' | 'fill' | 'viewBox'

export interface MdiReactIconProps extends Pick<AllSVGProps, Exclude<keyof AllSVGProps, ReservedProps>> {
  color?: string;
  size?: number | string;
  // should not have any children
  children?: never;
}
export type MdiReactIconComponentType = ComponentType<MdiReactIconProps>;
`).catch(err => console.error(err));
