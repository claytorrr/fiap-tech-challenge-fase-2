import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.lg} 0;
  box-shadow: ${props => props.theme.boxShadow};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserName = styled.span`
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">Blog dos Professores</Logo>
        <Nav>
          <NavLink to="/">Início</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/admin">Meus Posts</NavLink>
              <UserInfo>
                <UserName>Olá, {user?.nome}</UserName>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </UserInfo>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
