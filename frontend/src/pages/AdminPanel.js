import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getMyPosts, deletePost } from '../services/api';
import Loading from '../components/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.text};
`;

const CreateButton = styled(Link)`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius};
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const PostsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg};
`;

const PostInfo = styled.div`
  flex: 1;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  
  ${props => props.$variant === 'edit' && `
    background-color: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props.theme.colors.primaryDark};
    }
  `}
  
  ${props => props.$variant === 'delete' && `
    background-color: ${props.theme.colors.error};
    color: white;
    
    &:hover {
      background-color: #c0392b;
    }
  `}
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textLight};
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getMyPosts();
      setPosts(data);
    } catch (err) {
      setError('Erro ao carregar posts. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir o post "${title}"?`)) {
      return;
    }

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError('Erro ao excluir post. Verifique se você está autenticado.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header>
        <Title>Meus Posts</Title>
        <CreateButton to="/admin/create">+ Novo Post</CreateButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {posts.length === 0 ? (
        <EmptyMessage>
          Nenhum post encontrado. Crie seu primeiro post!
        </EmptyMessage>
      ) : (
        <PostsGrid>
          {posts.map(post => (
            <PostCard key={post._id}>
              <PostInfo>
                <PostTitle>{post.titulo}</PostTitle>
                <PostContent>{post.conteudo}</PostContent>
                <PostMeta>
                  <span>Por {post.autor}</span>
                  <span>•</span>
                  <span>{new Date(post.dataCriacao).toLocaleDateString('pt-BR')}</span>
                </PostMeta>
              </PostInfo>
              <Actions>
                <ActionButton 
                  $variant="edit" 
                  onClick={() => handleEdit(post._id)}
                >
                  Editar
                </ActionButton>
                <ActionButton 
                  $variant="delete" 
                  onClick={() => handleDelete(post._id, post.titulo)}
                >
                  Excluir
                </ActionButton>
              </Actions>
            </PostCard>
          ))}
        </PostsGrid>
      )}
    </Container>
  );
};

export default AdminPanel;
