import React from 'react';
import styled from 'styled-components';

interface TextareaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

const TextareaContainer = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

const StyledTextarea = styled.textarea.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
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

const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  label,
  required,
  disabled,
  rows = 4,
}) => {
  return (
    <TextareaContainer>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </Label>
      )}
      <StyledTextarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        hasError={!!error}
        required={required}
        disabled={disabled}
        rows={rows}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextareaContainer>
  );
};

export default Textarea;
