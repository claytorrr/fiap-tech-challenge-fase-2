# Frontend - Plataforma de Blogging para Professores

Interface React para a aplicação de blogging desenvolvida na Fase 3 do Tech Challenge FIAP.

## 🚀 Tecnologias

- React 19
- React Router DOM 6
- Styled Components
- Axios
- Docker

## 📦 Estrutura do Projeto

```
frontend/
├── public/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Chamadas à API
│   ├── contexts/       # Context API (autenticação)
│   ├── styles/         # Estilos globais
│   └── App.js          # Componente principal
├── Dockerfile
├── .env.example
└── package.json
```

## 🐳 Executando com Docker

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker-compose up frontend
```

O frontend estará disponível em: [http://localhost:3001](http://localhost:3001)

## 📝 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
REACT_APP_API_URL=http://localhost:3000
```

## 🎯 Páginas Implementadas

- [x] Lista de Posts (Home)
- [ ] Busca por Palavra-chave
- [ ] Leitura de Post Individual
- [ ] Login
- [ ] Criação de Post (protegida)
- [ ] Edição de Post (protegida)
- [ ] Painel Administrativo (protegido)

## 🔐 Autenticação

A aplicação utiliza Context API para gerenciar o estado de autenticação e proteger rotas administrativas.

