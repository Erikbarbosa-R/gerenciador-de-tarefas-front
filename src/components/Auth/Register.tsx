import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../UI/Input';
import PasswordInput from '../UI/PasswordInput';
import Button from '../UI/Button';
import { RegisterData } from '../../types';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const PasswordRequirements = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #495057;

  strong {
    color: #212529;
    display: block;
    margin-bottom: 8px;
  }

  ul {
    margin: 0;
    padding-left: 16px;
  }

  li {
    margin-bottom: 4px;
  }
`;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/');
    } catch (error: any) {
      let errorMessage = 'Erro ao criar conta';
      
      if (error.status === 400) {
        errorMessage = 'Email já está em uso ou dados inválidos';
      } else if (error.status === 404) {
        errorMessage = 'Servidor não encontrado. Verifique se o backend está rodando.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Criar Conta</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            label="Nome"
            placeholder="Digite seu nome"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <PasswordInput
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <PasswordRequirements>
            <strong>Requisitos da senha:</strong>
            <ul>
              <li>Mínimo de 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula</li>
              <li>Pelo menos 1 letra minúscula</li>
              <li>Pelo menos 1 número</li>
              <li>Pelo menos 1 caractere especial (!@#$%^&*)</li>
            </ul>
          </PasswordRequirements>
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </Form>
        
        <LinkContainer>
          <p>
            Já tem uma conta?{' '}
            <StyledLink to="/login">Faça login</StyledLink>
          </p>
        </LinkContainer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
