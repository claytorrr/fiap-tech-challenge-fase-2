# Tech Challenge - Plataforma de Blogging para Professores

## Sumário
- [Descrição](#descrição)
- [Setup do Projeto](#setup-do-projeto)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Experiências e Desafios](#experiências-e-desafios)
- [Autores](#autores)

## Descrição
Plataforma completa de blogging para professores da rede pública, com interface React moderna e API RESTful em Node.js. Permite que professores criem, editem, visualizem e excluam postagens de forma segura, com sistema de autenticação JWT. Desenvolvida em monorepo com backend Node.js + MongoDB e frontend React, completamente dockerizada.

**Fase 3 - Tech Challenge FIAP**

## Setup do Projeto

### Pré-requisitos
- Docker e Docker Compose (obrigatório)
- Nenhuma instalação local de Node.js ou MongoDB é necessária!

### Rodando o projeto (Recomendado)

1. Clone o repositório:
   ```sh
   git clone https://github.com/claytorrr/fiap-tech-challenge-fase-2.git
   cd fiap-tech-challenge-fase-2
   ```

2. Inicie todos os serviços com Docker Compose:
   ```sh
   docker-compose up --build
   ```

3. Aguarde a compilação e inicialização (pode levar alguns minutos na primeira vez)

4. Acesse a aplicação:
   - **Frontend**: [http://localhost:3001](http://localhost:3001)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)
   - **MongoDB**: `localhost:27017`

### Primeiro acesso

1. Acesse [http://localhost:3001](http://localhost:3001)
2. Clique em "Login" no header
3. Vá para a aba "Cadastro"
4. Crie sua conta de professor com:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
5. Após o cadastro, você será automaticamente autenticado
6. Clique em "Meus Posts" para começar a gerenciar seus posts

## Arquitetura

O projeto utiliza uma arquitetura monorepo com separação clara entre frontend e backend:

### Stack Tecnológico

**Backend:**
- Node.js 18 + Express 5
- MongoDB 6 + Mongoose 8
- JWT (jsonwebtoken) para autenticação
- bcryptjs para hash de senhas
- Jest + Supertest para testes

**Frontend:**
- React 19
- React Router DOM 6
- Styled Components 6
- Axios para requisições HTTP
- Context API para gerenciamento de estado

**Infraestrutura:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- 3 containers orquestrados: backend, frontend, mongodb

### Estrutura de pastas:

```
backend/
  src/
    app.js
    index.js
    models/
      Post.js
      User.js
    routes/
      posts.js
      auth.js
    middleware/
      auth.js
  tests/
    posts.test.js

frontend/
  src/
    App.js
    components/
      Header.js
      PostCard.js
      SearchBar.js
      Loading.js
      PrivateRoute.js
    pages/
      Home.js
      PostDetail.js
      Login.js
      AdminPanel.js
      CreatePost.js
      EditPost.js
    contexts/
      AuthContext.js
    services/
      api.js
    styles/
      GlobalStyles.js

docker-compose.yml
Dockerfile (backend)
frontend/Dockerfile
```

## Funcionalidades

### Públicas (não requerem login)
- ✅ Visualizar todos os posts na página inicial
- ✅ Buscar posts por palavra-chave
- ✅ Ver detalhes completos de um post
- ✅ Interface responsiva para mobile e desktop

### Autenticadas (requerem login)
- ✅ Criar conta de professor
- ✅ Login com email e senha
- ✅ Criar novos posts
- ✅ Editar posts existentes
- ✅ Excluir posts
- ✅ Painel administrativo com listagem de todos os posts

## Endpoints da API

### Posts

#### Listar todos os posts
- **GET** `/posts`
- Público (não requer autenticação)

#### Buscar post por ID
- **GET** `/posts/:id`
- Público (não requer autenticação)

#### Buscar posts por palavra-chave
- **GET** `/posts/search?q=palavra`
- Público (não requer autenticação)

#### Criar novo post
- **POST** `/posts`
- **Requer autenticação** (JWT token)
- Body (JSON):
  ```json
  {
    "titulo": "Título do post",
    "conteudo": "Conteúdo do post",
    "autor": "Nome do autor"
  }
  ```

#### Editar post
- **PUT** `/posts/:id`
- **Requer autenticação** (JWT token)
- Body (JSON):
  ```json
  {
    "titulo": "Novo título",
    "conteudo": "Novo conteúdo",
    "autor": "Nome do autor"
  }
  ```

#### Excluir post
- **DELETE** `/posts/:id`
- **Requer autenticação** (JWT token)

### Autenticação

#### Registrar novo usuário
- **POST** `/auth/register`
- Body (JSON):
  ```json
  {
    "nome": "Professor João Silva",
    "email": "joao@escola.com",
    "senha": "senha123"
  }
  ```
- Retorna: `{ token: "jwt_token", usuario: { ... } }`

#### Login
- **POST** `/auth/login`
- Body (JSON):
  ```json
  {
    "email": "joao@escola.com",
    "senha": "senha123"
  }
  ```
- Retorna: `{ token: "jwt_token", usuario: { ... } }`

#### Obter dados do usuário autenticado
- **GET** `/auth/me`
- **Requer autenticação** (JWT token)
- Retorna: `{ _id, nome, email }`

## Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos:

1. Registre-se ou faça login para obter um token
2. Inclua o token no header Authorization de cada requisição:
   ```
   Authorization: Bearer seu_token_jwt_aqui
   ```

**Exemplo com curl:**
```sh
# Registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Prof. João","email":"joao@escola.com","senha":"senha123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@escola.com","senha":"senha123"}'

# Criar post (com token)
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"Meu Post","conteudo":"Conteúdo aqui","autor":"Prof. João"}'
```

**Segurança:**
- Senhas são armazenadas com hash bcrypt (10 salt rounds)
- Tokens JWT expiram em 7 dias
- Senhas devem ter no mínimo 6 caracteres

## Testes

- Para rodar os testes automatizados do backend:
  ```sh
  cd backend
  npm test
  ```
- Para gerar relatório de cobertura:
  ```sh
  cd backend
  npm test -- --coverage
  ```

## CI/CD

- O projeto utiliza GitHub Actions para rodar os testes automaticamente a cada push ou pull request.
- Workflow: `.github/workflows/ci.yml`
- O workflow sobe um MongoDB de teste, instala dependências e executa os testes.

## Experiências e Desafios

### Fase 2
- Integração de múltiplas tecnologias modernas (Node.js, MongoDB, Docker, CI/CD)
- Superação de problemas de ambiente e permissões (ex: node_modules, Docker, MongoDB)
- Garantia de qualidade com testes automatizados e cobertura superior a 70%
- Aprendizado prático de DevOps e boas práticas de versionamento

### Fase 3
- **Reestruturação para monorepo**: Migração do projeto para estrutura backend/frontend
- **Frontend React moderno**: Implementação com React 19, Styled Components e Context API
- **Sistema de autenticação completo**: JWT no backend + Context API no frontend
- **Desafio React 19**: Conflito com componente styled "Date" resolvido renomeando para "DateText"
- **Docker multi-container**: Orquestração de 3 serviços (frontend, backend, mongo)
- **Hot reload no Docker**: Configuração de volumes para desenvolvimento ágil
- **Rotas protegidas**: Implementação de PrivateRoute com redirecionamento automático
- **Design responsivo**: Interface adaptável para mobile e desktop
- **UX moderna**: Loading states, mensagens de erro/sucesso, confirmações antes de deletar

### Principais aprendizados técnicos
- Comunicação entre containers Docker via docker-compose networks
- Gerenciamento de estado com Context API (login persistente com localStorage)
- Interceptors do Axios para injeção automática de tokens
- Styled Components com tema centralizado e props dinâmicas
- Hash de senhas com bcrypt e tokens JWT seguros
- React Router DOM 6 com rotas protegidas

## Autores

- Clayton Gomes (claytonabgomes@gmail.com)
# fiap-tech-challenge-fase-2
