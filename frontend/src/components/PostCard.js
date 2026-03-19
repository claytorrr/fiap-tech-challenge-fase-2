import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  padding: ${props => props.theme.spacing.lg};
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Content = styled.p`
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
`;

const Author = styled.span`
  font-weight: 500;
`;

const DateText = styled.span``;

const ReadMore = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Formatação simples sem usar Date constructor
    const d = dateString.split('T')[0].split('-');
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${d[2]} de ${months[parseInt(d[1]) - 1]} de ${d[0]}`;
  };

  return (
    <Card>
      <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
        <Title>{post.titulo}</Title>
      </Link>
      <Content>{post.conteudo}</Content>
      <Meta>
        <Author>Por {post.autor}</Author>
        <DateText>{formatDate(post.criadoEm)}</DateText>
      </Meta>
      <div style={{ marginTop: '16px' }}>
        <ReadMore to={`/post/${post._id}`}>Ler mais →</ReadMore>
      </div>
    </Card>
  );
};

export default PostCard;
