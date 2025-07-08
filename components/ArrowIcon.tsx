import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

const ArrowIcon = (props: SvgProps) => (
  <Svg
    
    width={123}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M2 10.5a1.5 1.5 0 0 0 0 3v-3Zm120.061 2.56a1.502 1.502 0 0 0 0-2.12l-9.546-9.547a1.5 1.5 0 0 0-2.122 2.122L118.879 12l-8.486 8.485a1.501 1.501 0 0 0 2.122 2.122l9.546-9.546ZM2 12v1.5h119v-3H2V12Z"
    />
  </Svg>
);

export default ArrowIcon;
