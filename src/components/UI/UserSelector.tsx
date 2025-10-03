import React from 'react';
import styled from 'styled-components';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUserId?: string;
  onUserChange: (userId: string | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

const SelectorContainer = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
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

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
`;

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onUserChange,
  label = 'Atribuir para',
  placeholder = 'Selecione um usuário',
  disabled = false,
  loading = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onUserChange(value === '' ? null : value);
  };

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <SelectorContainer>
        <Label>{label}</Label>
        <StyledSelect disabled>
          <option value="">Carregando usuários...</option>
        </StyledSelect>
      </SelectorContainer>
    );
  }

  // Se não há usuários, mostrar mensagem informativa
  if (users.length === 0) {
    return (
      <SelectorContainer>
        <Label>{label}</Label>
        <StyledSelect disabled>
          <option value="">Atribuição não disponível</option>
        </StyledSelect>
        <ErrorMessage>
          Campo opcional: Não foi possível carregar usuários do backend
        </ErrorMessage>
      </SelectorContainer>
    );
  }

  return (
    <SelectorContainer>
      <Label>{label}</Label>
      <StyledSelect
        value={selectedUserId || ''}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </StyledSelect>
    </SelectorContainer>
  );
};

export default UserSelector;
