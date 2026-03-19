import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPosts, searchPosts } from '../services/api';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
  line-height: 1.6;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textLight};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.error};
  color: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`;

const SearchInfo = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: 1rem;
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Erro ao carregar os posts. Tente novamente mais tarde.');
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      const data = await searchPosts(query);
      setPosts(data);
    } catch (err) {
      setError('Erro ao buscar posts. Tente novamente.');
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <Title>Blog dos Professores da Rede Pública</Title>
      <Subtitle>
        Compartilhando conhecimento e experiências educacionais para transformar a educação brasileira
      </Subtitle>

      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {searchQuery && (
        <SearchInfo>
          Resultados para: <strong>"{searchQuery}"</strong> ({posts.length} {posts.length === 1 ? 'post encontrado' : 'posts encontrados'})
        </SearchInfo>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyState>
          {searchQuery
            ? 'Nenhum post encontrado com essa palavra-chave. Tente buscar por outro termo.'
            : 'Nenhum post disponível no momento.'}
        </EmptyState>
      ) : (
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </PostsGrid>
      )}
    </Container>
  );
};

export default Home;
