import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { LoginData } from '../../types';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 20px;
`;

const LoginCard = styled.div`
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

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isCredentialsError, setIsCredentialsError] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setIsCredentialsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsCredentialsError(false);

    try {
      await login(formData);
      navigate('/');
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      let isCredentials = false;
      
      if (error.status === 401) {
        errorMessage = 'Email ou senha incorretos';
        isCredentials = true;
      } else if (error.status === 404) {
        errorMessage = 'Servidor não encontrado. Verifique se o backend está rodando.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor';
      } else if (error.message && error.message.includes('credenciais')) {
        errorMessage = 'Email ou senha incorretos';
        isCredentials = true;
      } else if (error.message && error.message.includes('password')) {
        errorMessage = 'Email ou senha incorretos';
        isCredentials = true;
      } else if (error.message && error.message.includes('invalid')) {
        errorMessage = 'Email ou senha incorretos';
        isCredentials = true;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setIsCredentialsError(isCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Entrar</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={handleChange}
            hasError={isCredentialsError}
            required
          />
          
          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
            hasError={isCredentialsError}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
        
        <LinkContainer>
          <p>
            Não tem uma conta?{' '}
            <StyledLink to="/register">Cadastre-se</StyledLink>
          </p>
        </LinkContainer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
