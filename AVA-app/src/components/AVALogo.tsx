import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

interface Props {
  size?: number;
  style?: ViewStyle;
}

export default function AVALogo({ size = 60, style }: Props) {
  const scale = size / 100;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      {/* Shield */}
      <Path
        d="M50 8 L85 20 L85 52 C85 70 70 83 50 92 C30 83 15 70 15 52 L15 20 Z"
        fill="#B85C72"
        opacity={0.15}
      />
      <Path
        d="M50 12 L81 23 L81 52 C81 68 67 80 50 88 C33 80 19 68 19 52 L19 23 Z"
        fill="none"
        stroke="#B85C72"
        strokeWidth="2.5"
      />
      {/* Feminine silhouette */}
      <Circle cx="50" cy="36" r="8" fill="#B85C72" opacity={0.8} />
      <Path
        d="M36 62 C36 50 42 44 50 44 C58 44 64 50 64 62 L64 65 L36 65 Z"
        fill="#B85C72"
        opacity={0.8}
      />
      {/* IA nodes */}
      <Circle cx="20" cy="50" r="3" fill="#B85C72" opacity={0.5} />
      <Circle cx="80" cy="50" r="3" fill="#B85C72" opacity={0.5} />
      <Path d="M23 50 L37 46" stroke="#B85C72" strokeWidth="1" opacity={0.4} />
      <Path d="M77 50 L63 46" stroke="#B85C72" strokeWidth="1" opacity={0.4} />
    </Svg>
  );
}
