import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  

  return (
    <HeaderContainer>
      <Title>Gerenciador de Tarefas</Title>
      <UserInfo>
        <UserName>Olá, {user?.name || 'Usuário'}</UserName>
        <Button variant="secondary" size="small" onClick={logout}>
          Sair
        </Button>
      </UserInfo>
    </HeaderContainer>
  );
};

export default Header;
