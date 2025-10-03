import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 16, color, style }) => {
  // Usar type assertion para resolver o problema de tipagem
  const Component = IconComponent as React.ComponentType<any>;
  
  return (
    <Component 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

export default Icon;
