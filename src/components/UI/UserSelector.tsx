import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import Icon from './Icon';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSelectorProps {
  users: User[];
  selectedUserId?: string | null;
  onUserChange: (userId: string | null) => void;
  onRemoveUser?: () => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  editable?: boolean;
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

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select.withConfig({
  shouldForwardProp: (prop) => !['hasError', 'hasSelectedUser'].includes(prop),
})<{ hasError?: boolean; hasSelectedUser?: boolean }>`
  width: 100%;
  padding: 10px ${({ hasSelectedUser }) => (hasSelectedUser ? '40px' : '12px')} 10px 12px;
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

const RemoveButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8d7da;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
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
  onRemoveUser,
  label = 'Atribuir para',
  placeholder = 'Selecione um usuário',
  disabled = false,
  loading = false,
  editable = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onUserChange(value === '' ? null : value);
  };

  const handleRemoveUser = () => {
    if (onRemoveUser) {
      onRemoveUser();
    } else {
      onUserChange(null);
    }
  };

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <SelectorContainer>
        <Label>{label}</Label>
        <SelectWrapper>
          <StyledSelect disabled>
            <option value="">Carregando usuários...</option>
          </StyledSelect>
        </SelectWrapper>
      </SelectorContainer>
    );
  }

  // Se não há usuários, mostrar mensagem informativa
  if (users.length === 0) {
    return (
      <SelectorContainer>
        <Label>{label}</Label>
        <SelectWrapper>
          <StyledSelect disabled>
            <option value="">Atribuição não disponível</option>
          </StyledSelect>
        </SelectWrapper>
        <ErrorMessage>
          Campo opcional: Não foi possível carregar usuários do backend
        </ErrorMessage>
      </SelectorContainer>
    );
  }

  const showRemoveButton = editable && !!selectedUserId;

  return (
    <SelectorContainer>
      <Label>{label}</Label>
      <SelectWrapper>
        <StyledSelect
          value={selectedUserId || ''}
          onChange={handleChange}
          disabled={disabled}
          hasSelectedUser={showRemoveButton}
        >
          <option value="">{placeholder}</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </StyledSelect>
        {showRemoveButton && (
          <RemoveButton
            type="button"
            onClick={handleRemoveUser}
            title="Remover"
          >
            <Icon icon={MdClose} size={16} />
          </RemoveButton>
        )}
      </SelectWrapper>
    </SelectorContainer>
  );
};

export default UserSelector;
