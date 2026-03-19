import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 450px;
  margin: ${props => props.theme.spacing.xxl} auto;
  padding: ${props => props.theme.spacing.md};
`;

const Card = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  padding: ${props => props.theme.spacing.xxl};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme.colors.success};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.textLight};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.primaryDark : props.theme.colors.primary};
    color: white;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });
  
  const [registerData, setRegisterData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(loginData);
    
    if (result.success) {
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (registerData.senha !== registerData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    if (registerData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    const { confirmarSenha, ...dataToSend } = registerData;
    const result = await register(dataToSend);
    
    if (result.success) {
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <Card>
        <Title>Bem-vindo!</Title>
        <Subtitle>
          {isLogin ? 'Faça login para gerenciar posts' : 'Crie sua conta de professor'}
        </Subtitle>
        
        <TabContainer>
          <Tab $active={isLogin} onClick={() => setIsLogin(true)} type="button">
            Login
          </Tab>
          <Tab $active={!isLogin} onClick={() => setIsLogin(false)} type="button">
            Cadastro
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {isLogin ? (
          <Form onSubmit={handleLoginSubmit}>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="seu@email.com"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="senha">Senha</Label>
              <Input
                type="password"
                id="senha"
                name="senha"
                value={loginData.senha}
                onChange={handleLoginChange}
                placeholder="••••••"
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleRegisterSubmit}>
            <FormGroup>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                type="text"
                id="nome"
                name="nome"
                value={registerData.nome}
                onChange={handleRegisterChange}
                placeholder="Professor(a) Fulano"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="register-email">Email</Label>
              <Input
                type="email"
                id="register-email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="seu@email.com"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="register-senha">Senha</Label>
              <Input
                type="password"
                id="register-senha"
                name="senha"
                value={registerData.senha}
                onChange={handleRegisterChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={registerData.confirmarSenha}
                onChange={handleRegisterChange}
                placeholder="Digite a senha novamente"
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default Login;
