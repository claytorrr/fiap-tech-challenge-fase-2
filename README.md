# Tech Challenge - Plataforma de Blogging para Professores

## Sumário
- [Descrição](#descrição)
- [Setup do Projeto](#setup-do-projeto)
- [Mobile (Fase 4)](#mobile-fase-4)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Experiências e Desafios](#experiências-e-desafios)
- [Autores](#autores)

## Descrição
Plataforma completa de blogging para professores da rede pública, com interface React moderna, API RESTful em Node.js e aplicativo mobile em React Native. Permite que professores criem, editem, visualizem e excluam postagens de forma segura, com sistema de autenticação JWT e controle de permissões por papel (professor/aluno). Desenvolvida em monorepo com backend Node.js + MongoDB, frontend React e mobile React Native, completamente dockerizada.

**Fase 4 - Tech Challenge FIAP**

## Setup do Projeto

### Pré-requisitos
- Docker e Docker Compose (para backend e MongoDB)
- Node.js 18+ (para rodar o mobile localmente)
- Xcode + iOS Simulator **ou** Android Studio **ou** Expo Go no celular

### Rodando backend + banco (Docker)

1. Clone o repositório:
   ```sh
   git clone https://github.com/claytorrr/fiap-tech-challenge-fase-2.git
   cd fiap-tech-challenge-fase-2
   ```

2. Suba backend e MongoDB:
   ```sh
   docker compose up backend mongo -d --build
   ```

3. Serviços disponíveis:
   - **Backend API**: [http://localhost:3000](http://localhost:3000)
   - **Frontend Web**: suba com `docker compose up frontend -d`
   - **MongoDB**: `localhost:27017`

### Rodando o app mobile

```sh
cd mobile
npm install --registry https://registry.npmjs.org
npx expo start --ios      # iOS Simulator
npx expo start --android  # Android Emulator
npx expo start            # Expo Go (celular físico)
```

### Primeiro acesso

Crie um usuário professor via API:
```sh
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Professor","email":"prof@fiap.com","senha":"123456","role":"teacher"}'
```

---

## Mobile (Fase 4)

### Arquitetura do app mobile

O app foi desenvolvido com **React Native + Expo SDK 51**, utilizando:

| Tecnologia | Uso |
|---|---|
| React Native 0.74 | Framework mobile |
| Expo SDK 51 | Toolchain e build |
| React Navigation 6 | Navegação Stack + Bottom Tabs |
| Axios | Requisições HTTP à API REST |
| AsyncStorage | Persistência do token JWT |
| Context API | Gerenciamento de estado de autenticação |
| Expo Vector Icons | Ícones da interface |

### Estrutura de pastas do mobile

```
mobile/
├── App.js                        # Ponto de entrada
├── app.json                      # Configuração Expo
├── babel.config.js
├── Dockerfile
└── src/
    ├── api/
    │   └── index.js              # Todas as chamadas à API REST
    ├── contexts/
    │   └── AuthContext.js        # Estado global de autenticação
    ├── navigation/
    │   └── index.js              # Rotas e tabs (professor/aluno)
    ├── components/
    │   └── Loading.js
    └── screens/
        ├── LoginScreen.js        # Tela de login
        ├── HomeScreen.js         # Lista de posts + busca
        ├── PostDetailScreen.js   # Leitura completa do post
        ├── AdminPostsScreen.js   # Painel admin de posts
        ├── CreatePostScreen.js   # Criar post
        ├── EditPostScreen.js     # Editar post
        ├── teachers/
        │   ├── TeacherListScreen.js    # Listagem paginada
        │   ├── CreateTeacherScreen.js  # Criar professor
        │   └── EditTeacherScreen.js    # Editar professor
        └── students/
            ├── StudentListScreen.js    # Listagem paginada
            ├── CreateStudentScreen.js  # Criar aluno
            └── EditStudentScreen.js    # Editar aluno
```

### Telas e funcionalidades

#### Perfil Professor (autenticado com `role: teacher`)
- **Posts** — lista todos os posts com busca por palavras-chave em tempo real
- **Admin** — gerencia posts (criar, editar, excluir)
- **Professores** — listagem paginada com criar, editar e excluir
- **Alunos** — listagem paginada com criar, editar e excluir

#### Perfil Aluno (autenticado com `role: student`)
- **Posts** — apenas visualização da lista e leitura completa dos posts

### Controle de acesso
- Rotas protegidas: navegação condicional baseada no `role` retornado pelo `/auth/me`
- Professores: acesso total (CRUD de posts, professores e alunos)
- Alunos: somente leitura de posts
- Backend: endpoints de criação/edição/exclusão de posts e usuários exigem `role: teacher`

### Integração com a API

Todas as chamadas estão centralizadas em `src/api/index.js`:

```
GET    /posts               → lista posts
GET    /posts/:id           → lê post
GET    /posts/search?q=...  → busca posts (conectada ao campo de busca)
POST   /posts               → cria post (teacher)
PUT    /posts/:id           → edita post (teacher)
DELETE /posts/:id           → exclui post (teacher)

POST   /auth/login          → login
GET    /auth/me             → valida sessão e obtém role

GET    /users?role=teacher  → lista professores (paginado)
GET    /users?role=student  → lista alunos (paginado)
POST   /users               → cria usuário
PUT    /users/:id           → edita usuário
DELETE /users/:id           → exclui usuário
```

---

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

### Fase 4
- **React Native com Expo**: Desenvolvimento do app mobile com SDK 51, navegação Stack + Bottom Tabs
- **Controle de acesso por role**: Navegação condicional professor/aluno baseada no JWT retornado pelo backend
- **Busca conectada de ponta a ponta**: Campo de busca no mobile consome o endpoint `/posts/search` em tempo real
- **CRUD completo de usuários**: Backend estendido com rotas `/users` (paginação, criação, edição, exclusão)
- **Middleware de role**: `requireRole('teacher')` reutilizável protegendo rotas de criação/edição no backend
- **Auto-refresh de listas**: Listener de foco nas telas recarrega dados ao retornar de outra tab
- **Ambiente isolado**: Backend e MongoDB no Docker; Expo roda no host para comunicação com iOS Simulator
- **Registry npm do trabalho**: Necessário usar `--registry https://registry.npmjs.org` para instalar dependências fora da rede corporativa

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
