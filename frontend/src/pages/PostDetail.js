import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getPostById } from '../services/api';
import Loading from '../components/Loading';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.lg};
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
  
  &::before {
    content: '←';
    margin-right: ${props => props.theme.spacing.sm};
    font-size: 1.2rem;
  }
`;

const PostContainer = styled.article`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  padding: ${props => props.theme.spacing.xxl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.2;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const Meta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.95rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
`;

const Author = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  
  &::before {
    content: '✍️ ';
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

const DateText = styled.div`
  &::before {
    content: '📅 ';
    margin-right: ${props => props.theme.spacing.xs};
  }
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const NotFound = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  
  h2 {
    font-size: 2rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    color: ${props => props.theme.colors.textLight};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = dateString.split('T')[0].split('-');
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${d[2]} de ${months[parseInt(d[1]) - 1]} de ${d[0]}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Buscando post:', id);
        setLoading(true);
        setError(null);
        const data = await getPostById(id);
        console.log('Post recebido:', data);
        setPost(data);
      } catch (err) {
        console.error('Erro ao buscar post:', err);
        setError('Erro ao carregar o post. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <Container>
        <BackButton to="/">Voltar para o início</BackButton>
        <Loading />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton to="/">Voltar para o início</BackButton>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <BackButton to="/">Voltar para o início</BackButton>
        <NotFound>
          <h2>Post não encontrado</h2>
          <p>O post que você está procurando não existe ou foi removido.</p>
        </NotFound>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton to="/">Voltar para o início</BackButton>
      <PostContainer>
        <Title>{post.titulo}</Title>
        <Meta>
          <Author>{post.autor}</Author>
          <DateText>{formatDate(post.criadoEm)}</DateText>
        </Meta>
        <Content>{post.conteudo}</Content>
      </PostContainer>
    </Container>
  );
};

export default PostDetail;
