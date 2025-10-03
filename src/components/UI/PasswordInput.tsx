import React, { useState } from 'react';
import styled from 'styled-components';

interface PasswordInputProps {
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hasError?: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputContainer = styled.div`
  margin-bottom: 16px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 45px 10px 12px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }

  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  error,
  hasError,
  label,
  required,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputContainer>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </Label>
      )}
      <InputWrapper>
        <StyledInput
          id={name}
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          hasError={hasError || !!error}
          required={required}
          disabled={disabled}
        />
        <ToggleButton
          type="button"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </ToggleButton>
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default PasswordInput;
