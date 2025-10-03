import React from 'react';
import styled from 'styled-components';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  name?: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const SelectContainer = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

const StyledSelect = styled.select.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ hasError }) => (hasError ? '#dc3545' : '#ddd')};
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
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

const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  onChange,
  error,
  label,
  required,
  disabled,
  placeholder,
}) => {
  return (
    <SelectContainer>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </Label>
      )}
      <StyledSelect
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        hasError={!!error}
        required={required}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  );
};

export default Select;
