const generate = require('./generate');

generate('react-native', 'react', component => `import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ${component.name} = ({ color = 'currentColor', size = 24, children, ...props }) => {
  const className = 'mdi-icon ' + (props.className || '');

  return (
    <Svg {...props} className={className} width={size} height={size} viewBox="0 0 24 24">
      <Path d="${component.svgPath}" fill={color} />
    </Svg>
  );
};

export default React.memo ? React.memo(${component.name}) : ${component.name};
`, component => `import { MdiReactIconComponentType } from './dist/typings';

declare const ${component.name}: MdiReactIconComponentType;
export default ${component.name};
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
