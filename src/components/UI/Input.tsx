import React from 'react';
import styled from 'styled-components';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'date' | 'datetime-local';
  id?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hasError?: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const InputContainer = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
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

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  hasError,
  label,
  required,
  disabled,
  min,
  max,
}) => {
  return (
    <InputContainer>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </Label>
      )}
      <StyledInput
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        hasError={hasError || !!error}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;
