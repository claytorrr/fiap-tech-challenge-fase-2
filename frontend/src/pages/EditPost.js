import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getPostById, updatePost } from '../services/api';
import Loading from '../components/Loading';

const Container = styled.div`
  max-width: 800px;
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
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  min-height: 300px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => props.$variant === 'primary' && `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.primaryDark};
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `}
  
  ${props => props.$variant === 'secondary' && `
    background-color: transparent;
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      background-color: ${props.theme.colors.border};
    }
  `}
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
`;

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    autor: ''
  });

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPostById(id);
      setFormData({
        titulo: data.titulo,
        conteudo: data.conteudo,
        autor: data.autor
      });
    } catch (err) {
      setError('Erro ao carregar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.conteudo.trim() || !formData.autor.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    try {
      setSaving(true);
      await updatePost(id, formData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao atualizar post. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Card>
        <Title>Editar Post</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="titulo">Título</Label>
            <Input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título do post"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="autor">Autor</Label>
            <Input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="conteudo">Conteúdo</Label>
            <TextArea
              id="conteudo"
              name="conteudo"
              value={formData.conteudo}
              onChange={handleChange}
              placeholder="Escreva o conteúdo do post aqui..."
              required
            />
          </FormGroup>
          
          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" $variant="primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default EditPost;
