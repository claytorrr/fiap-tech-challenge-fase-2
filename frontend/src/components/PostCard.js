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

const Date = styled.span``;

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
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
        <Title>{post.titulo}</Title>
      </Link>
      <Content>{post.conteudo}</Content>
      <Meta>
        <Author>Por {post.autor}</Author>
        <Date>{formatDate(post.criadoEm)}</Date>
      </Meta>
      <div style={{ marginTop: '16px' }}>
        <ReadMore to={`/post/${post._id}`}>Ler mais →</ReadMore>
      </div>
    </Card>
  );
};

export default PostCard;
