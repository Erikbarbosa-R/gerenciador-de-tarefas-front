import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent) => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: #007bff;
          color: white;
          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `;
      case 'secondary':
        return css`
          background-color: #6c757d;
          color: white;
          &:hover:not(:disabled) {
            background-color: #545b62;
          }
        `;
      case 'danger':
        return css`
          background-color: #dc3545;
          color: white;
          &:hover:not(:disabled) {
            background-color: #c82333;
          }
        `;
      case 'success':
        return css`
          background-color: #28a745;
          color: white;
          &:hover:not(:disabled) {
            background-color: #218838;
          }
        `;
      default:
        return css`
          background-color: #007bff;
          color: white;
        `;
    }
  }}

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 6px 12px;
          font-size: 12px;
        `;
      case 'medium':
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'large':
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
      default:
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => {
  return <StyledButton {...props} style={style}>{children}</StyledButton>;
};

export default Button;
