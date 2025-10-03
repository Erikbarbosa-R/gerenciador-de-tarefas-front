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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  
  const { login } = useAuth();
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
      await login(formData);
      navigate('/');
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.status === 401) {
        errorMessage = 'Email ou senha incorretos';
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
            required
          />
          
          <Input
            type="password"
            name="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
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
        
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px', fontSize: '14px' }}>
          <strong>🔧 Dicas para debug:</strong>
          <br />
          1. Abra o Console (F12) para ver logs detalhados
          <br />
          2. Se não tem conta, use o botão "Cadastre-se" abaixo
          <br />
          3. Verifique se o backend está online
        </div>
        
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
