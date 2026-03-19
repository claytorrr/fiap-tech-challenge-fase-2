# Tech Challenge - Fase 2
## Plataforma de Blogging para Professores da Rede Pública

---

**Aluno:** Clayton Gomes  
**Email:** claytonabgomes@gmail.com  
**Curso:** Pós-graduação FIAP - Software Architecture  
**Data:** Janeiro de 2026  
**Repositório:** https://github.com/claytorrr/fiap-tech-challenge-fase-2

---

## Sumário

1. [Introdução](#introdução)
2. [Objetivos do Projeto](#objetivos-do-projeto)
3. [Requisitos Funcionais](#requisitos-funcionais)
4. [Requisitos Não Funcionais](#requisitos-não-funcionais)
5. [Arquitetura da Solução](#arquitetura-da-solução)
6. [Tecnologias Utilizadas](#tecnologias-utilizadas)
7. [Estrutura do Projeto](#estrutura-do-projeto)
8. [Modelagem de Dados](#modelagem-de-dados)
9. [Endpoints da API](#endpoints-da-api)
10. [Testes Automatizados](#testes-automatizados)
11. [Containerização com Docker](#containerização-com-docker)
12. [CI/CD](#cicd)
13. [Como Executar o Projeto](#como-executar-o-projeto)
14. [Evidências de Funcionamento](#evidências-de-funcionamento)
15. [Desafios e Aprendizados](#desafios-e-aprendizados)
16. [Conclusão](#conclusão)

---

## 1. Introdução

Este projeto foi desenvolvido como parte do **Tech Challenge da Fase 2** da pós-graduação em Software Architecture da FIAP. O desafio consiste em criar uma plataforma de blogging voltada para professores da rede pública de ensino, permitindo que eles compartilhem conhecimentos, experiências e conteúdos educacionais de forma centralizada e acessível.

A solução foi construída seguindo princípios de arquitetura de software, boas práticas de desenvolvimento e metodologias ágeis, com foco em qualidade, testabilidade e facilidade de manutenção.

---

## 2. Objetivos do Projeto

### Objetivo Geral
Desenvolver uma API RESTful robusta e escalável que permita o gerenciamento completo de postagens em um blog educacional.

### Objetivos Específicos
- Implementar operações CRUD (Create, Read, Update, Delete) para postagens
- Desenvolver funcionalidade de busca por palavras-chave
- Garantir persistência de dados em banco de dados NoSQL
- Containerizar a aplicação com Docker
- Implementar testes automatizados com boa cobertura
- Configurar pipeline de CI/CD
- Documentar adequadamente o projeto

---

## 3. Requisitos Funcionais

### RF01 - Criação de Postagens
O sistema deve permitir a criação de novas postagens contendo:
- Título (obrigatório)
- Conteúdo (obrigatório)
- Autor (obrigatório)
- Data de criação (automática)

### RF02 - Listagem de Postagens
O sistema deve listar todas as postagens ordenadas por data de criação (mais recentes primeiro).

### RF03 - Busca por ID
O sistema deve permitir buscar uma postagem específica através de seu identificador único.

### RF04 - Edição de Postagens
O sistema deve permitir atualizar título, conteúdo e autor de postagens existentes.

### RF05 - Exclusão de Postagens
O sistema deve permitir remover postagens do banco de dados.

### RF06 - Busca por Palavra-chave
O sistema deve permitir buscar postagens que contenham determinada palavra-chave no título ou conteúdo (busca case-insensitive).

---

## 4. Requisitos Não Funcionais

### RNF01 - Performance
A API deve responder às requisições em tempo adequado (< 1 segundo).

### RNF02 - Escalabilidade
A arquitetura deve suportar containerização para facilitar escalabilidade horizontal.

### RNF03 - Testabilidade
O código deve ter cobertura de testes superior a 70%.

### RNF04 - Manutenibilidade
O código deve seguir boas práticas e ser bem documentado.

### RNF05 - Disponibilidade
A aplicação deve estar disponível através de containers Docker.

### RNF06 - Qualidade
Pipeline de CI/CD deve garantir que alterações não quebrem a aplicação.

---

## 5. Arquitetura da Solução

### Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│         Cliente (Insomnia)          │
└───────────────┬─────────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────────┐
│        Camada de Rotas (Routes)     │
│         Express Router              │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│      Camada de Modelos (Models)     │
│         Mongoose Schemas            │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│      Banco de Dados (MongoDB)       │
└─────────────────────────────────────┘
```

### Padrões Utilizados
- **REST**: Para comunicação entre cliente e servidor
- **MVC**: Separação de responsabilidades (Model-View-Controller adaptado)
- **Dependency Injection**: Configuração de dependências via Express
- **Repository Pattern**: Mongoose atua como camada de abstração do banco

---

## 6. Tecnologias Utilizadas

### Backend
- **Node.js 18**: Runtime JavaScript
- **Express 5**: Framework web minimalista
- **Mongoose 8**: ODM para MongoDB

### Banco de Dados
- **MongoDB 6**: Banco NoSQL orientado a documentos

### Testes
- **Jest 30**: Framework de testes
- **Supertest 7**: Testes de integração HTTP

### Containerização
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de múltiplos containers

### CI/CD
- **GitHub Actions**: Pipeline de integração contínua

### Outras Dependências
- **dotenv**: Gerenciamento de variáveis de ambiente
- **CORS**: Configuração de Cross-Origin Resource Sharing

---

## 7. Estrutura do Projeto

```
fiap-tech-challenge-fase-2/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD
├── src/
│   ├── models/
│   │   └── Post.js             # Schema do modelo Post
│   ├── routes/
│   │   └── posts.js            # Rotas da API
│   ├── app.js                  # Configuração do Express
│   └── index.js                # Ponto de entrada
├── tests/
│   └── posts.test.js           # Testes automatizados
├── coverage/                   # Relatórios de cobertura
├── .dockerignore               # Arquivos ignorados no build
├── Dockerfile                  # Imagem Docker da aplicação
├── docker-compose.yml          # Orquestração de containers
├── package.json                # Dependências do projeto
├── .env                        # Variáveis de ambiente
└── README.md                   # Documentação principal
```

---

## 8. Modelagem de Dados

### Schema do Post

```javascript
{
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  conteudo: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
}
```

### Exemplo de Documento

```json
{
  "_id": "696ba6705b9ee58729339c5b",
  "titulo": "Introdução à Programação",
  "conteudo": "Neste post vamos aprender os conceitos básicos...",
  "autor": "Prof. Maria Santos",
  "criadoEm": "2026-01-17T15:10:40.768Z",
  "__v": 0
}
```

---

## 9. Endpoints da API

### Base URL
```
http://localhost:3000
```

### 9.1 Health Check
**GET /** 

Verifica se a API está funcionando.

**Response:**
```
API Tech Challenge rodando!
```

---

### 9.2 Listar Todos os Posts
**GET /posts**

Lista todas as postagens ordenadas por data (mais recentes primeiro).

**Response (200 OK):**
```json
[
  {
    "_id": "696ba6705b9ee58729339c5b",
    "titulo": "Introdução à Programação",
    "conteudo": "Conteúdo do post...",
    "autor": "Prof. Maria Santos",
    "criadoEm": "2026-01-17T15:10:40.768Z",
    "__v": 0
  }
]
```

---

### 9.3 Criar Post
**POST /posts**

Cria uma nova postagem.

**Request Body:**
```json
{
  "titulo": "Introdução à Programação",
  "conteudo": "Neste post vamos aprender...",
  "autor": "Prof. Maria Santos"
}
```

**Response (201 Created):**
```json
{
  "_id": "696ba6705b9ee58729339c5b",
  "titulo": "Introdução à Programação",
  "conteudo": "Neste post vamos aprender...",
  "autor": "Prof. Maria Santos",
  "criadoEm": "2026-01-17T15:10:40.768Z",
  "__v": 0
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Erro ao criar post."
}
```

---

### 9.4 Buscar Post por ID
**GET /posts/:id**

Busca uma postagem específica pelo ID.

**Response (200 OK):**
```json
{
  "_id": "696ba6705b9ee58729339c5b",
  "titulo": "Introdução à Programação",
  "conteudo": "Neste post vamos aprender...",
  "autor": "Prof. Maria Santos",
  "criadoEm": "2026-01-17T15:10:40.768Z",
  "__v": 0
}
```

**Response (404 Not Found):**
```json
{
  "error": "Post não encontrado."
}
```

---

### 9.5 Editar Post
**PUT /posts/:id**

Atualiza uma postagem existente.

**Request Body:**
```json
{
  "titulo": "Introdução à Programação - Atualizado",
  "conteudo": "Conteúdo atualizado...",
  "autor": "Prof. Maria Santos"
}
```

**Response (200 OK):**
```json
{
  "_id": "696ba6705b9ee58729339c5b",
  "titulo": "Introdução à Programação - Atualizado",
  "conteudo": "Conteúdo atualizado...",
  "autor": "Prof. Maria Santos",
  "criadoEm": "2026-01-17T15:10:40.768Z",
  "__v": 0
}
```

**Response (404 Not Found):**
```json
{
  "error": "Post não encontrado."
}
```

---

### 9.6 Deletar Post
**DELETE /posts/:id**

Remove uma postagem.

**Response (200 OK):**
```json
{
  "message": "Post removido com sucesso."
}
```

**Response (404 Not Found):**
```json
{
  "error": "Post não encontrado."
}
```

---

### 9.7 Buscar Posts por Palavra-chave
**GET /posts/search?q=palavra**

Busca postagens que contenham a palavra-chave no título ou conteúdo (case-insensitive).

**Query Parameters:**
- `q` (obrigatório): Termo de busca

**Response (200 OK):**
```json
[
  {
    "_id": "696ba6705b9ee58729339c5b",
    "titulo": "Introdução à Programação",
    "conteudo": "Neste post vamos aprender...",
    "autor": "Prof. Maria Santos",
    "criadoEm": "2026-01-17T15:10:40.768Z",
    "__v": 0
  }
]
```

**Response (400 Bad Request):**
```json
{
  "error": "Termo de busca não informado."
}
```

---

## 10. Testes Automatizados

### Estratégia de Testes
Foram implementados **testes de integração** utilizando Jest e Supertest, validando o funcionamento end-to-end da API.

### Casos de Teste Implementados

1. **Deve criar um novo post**
   - Valida criação com status 201
   - Verifica presença do ID no response
   - Confirma dados corretos no post criado

2. **Deve listar posts**
   - Valida status 200
   - Verifica se retorna array
   - Confirma presença de posts na lista

3. **Deve buscar post por ID**
   - Valida status 200
   - Verifica dados corretos do post

4. **Deve editar um post**
   - Valida status 200
   - Confirma atualização dos dados

5. **Deve deletar um post**
   - Valida status 200
   - Verifica mensagem de sucesso

6. **Deve buscar posts por palavra-chave**
   - Valida status 200
   - Confirma busca case-insensitive
   - Verifica resultados corretos

7. **Deve retornar erro ao buscar sem termo**
   - Valida status 400
   - Verifica mensagem de erro

### Cobertura de Testes

```
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |   81.53 |     62.5 |   77.77 |   85.24 |
 src        |   81.25 |      100 |   33.33 |   81.25 |
  app.js    |   81.25 |      100 |   33.33 |   81.25 | 16-17,21
 src/models |     100 |      100 |     100 |     100 |
  Post.js   |     100 |      100 |     100 |     100 |
 src/routes |   80.43 |     62.5 |     100 |   85.71 |
  posts.js  |   80.43 |     62.5 |     100 |   85.71 | 12,29,40,52,68,79
------------|---------|----------|---------|---------|-------------------
```

**Cobertura Total: 81.53%**

A cobertura superior a 80% demonstra que a maior parte do código está validada automaticamente, garantindo qualidade e confiabilidade.

### Execução dos Testes

```bash
# Rodar testes
npm test

# Rodar com cobertura
npm test -- --coverage

# Rodar no Docker
docker exec tech-challenge-app npm test
```

---

## 11. Containerização com Docker

### Dockerfile

```dockerfile
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose

A aplicação utiliza Docker Compose para orquestrar dois serviços:

1. **App**: Aplicação Node.js
2. **MongoDB**: Banco de dados

```yaml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - MONGODB_URI=mongodb://mongo:27017/fiap_tech_challenge
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6.0
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
```

### Comandos Docker

```bash
# Subir aplicação
docker-compose up --build -d

# Ver containers rodando
docker ps

# Ver logs
docker logs tech-challenge-app

# Parar aplicação
docker-compose down
```

---

## 12. CI/CD

### Pipeline GitHub Actions

O projeto utiliza GitHub Actions para executar testes automaticamente a cada push ou pull request.

**Workflow (.github/workflows/ci.yml):**

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:6.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/fiap_tech_challenge_test
```

### Benefícios do CI/CD

- ✅ Execução automática de testes
- ✅ Detecção precoce de bugs
- ✅ Garantia de qualidade contínua
- ✅ Feedback rápido para desenvolvedores
- ✅ Prevenção de regressões

---

## 13. Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados
- Git instalado
- Porta 3000 disponível

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/claytorrr/fiap-tech-challenge-fase-2.git
cd fiap-tech-challenge-fase-2
```

2. **Suba a aplicação com Docker**
```bash
docker-compose up --build -d
```

3. **Verifique se está rodando**
```bash
curl http://localhost:3000/
# Deve retornar: API Tech Challenge rodando!
```

4. **Teste os endpoints**
- Importe a collection `Insomnia_Tech_Challenge.json` no Insomnia
- Ou use curl/Postman para testar os endpoints

5. **Execute os testes**
```bash
docker exec tech-challenge-app npm test
```

6. **Para parar a aplicação**
```bash
docker-compose down
```

---

## 14. Evidências de Funcionamento

### Testes Passando
```
PASS tests/posts.test.js
  Posts API
    ✓ deve criar um novo post (56 ms)
    ✓ deve listar posts (16 ms)
    ✓ deve buscar post por id (12 ms)
    ✓ deve editar um post (12 ms)
    ✓ deve deletar um post (10 ms)
    ✓ deve buscar posts por palavra-chave (10 ms)
    ✓ deve retornar erro ao buscar sem termo (6 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Time:        0.39 s
```

### Containers Rodando
```
CONTAINER ID   IMAGE                            STATUS       PORTS
d342eff6d1ab   fiap-tech-challenge-fase-2-app   Up 2 hours   0.0.0.0:3000->3000/tcp
a443f61f6519   mongo:6.0                        Up 2 hours   0.0.0.0:27017->27017/tcp
```

### API Respondendo
```bash
$ curl http://localhost:3000/posts
[{"_id":"...","titulo":"...","conteudo":"...","autor":"..."}]
```

---

## 15. Desafios e Aprendizados

### Desafios Enfrentados

1. **Configuração do Docker**
   - **Problema**: Volume mapeado causava conflito com node_modules
   - **Solução**: Criação de .dockerignore e remoção do volume no docker-compose

2. **Ordem das Rotas**
   - **Problema**: Rota `/posts/search` conflitando com `/posts/:id`
   - **Solução**: Reordenação das rotas (específicas antes de parametrizadas)

3. **Configuração do CI/CD**
   - **Problema**: MongoDB não disponível durante testes
   - **Solução**: Configuração de service container no GitHub Actions

4. **Cobertura de Testes**
   - **Problema**: Handlers de erro não cobertos
   - **Solução**: Adição de testes específicos para cenários de erro

### Aprendizados

- ✅ **Docker**: Containerização e orquestração de aplicações
- ✅ **NoSQL**: Modelagem de dados em MongoDB
- ✅ **Testes**: Importância de testes automatizados
- ✅ **CI/CD**: Automação de qualidade de código
- ✅ **REST**: Design de APIs RESTful
- ✅ **Git/GitHub**: Versionamento e colaboração

---

## 16. Conclusão

O projeto **Tech Challenge - Fase 2** foi concluído com sucesso, atendendo a todos os requisitos propostos:

✅ **API RESTful completa** com CRUD e busca  
✅ **Persistência de dados** em MongoDB  
✅ **Containerização** com Docker  
✅ **Testes automatizados** com 81.53% de cobertura  
✅ **CI/CD** configurado com GitHub Actions  
✅ **Documentação completa** e clara  

A solução desenvolvida é robusta, escalável e mantível, seguindo boas práticas de desenvolvimento de software e arquitetura. O projeto demonstra a aplicação prática dos conceitos aprendidos na pós-graduação e prepara o terreno para desafios mais complexos nas próximas fases.

---

## Referências

- Node.js Documentation: https://nodejs.org/docs
- Express.js Guide: https://expressjs.com/
- MongoDB Manual: https://docs.mongodb.com/
- Jest Documentation: https://jestjs.io/docs
- Docker Documentation: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/actions

---

**Desenvolvido por Clayton Gomes**  
**FIAP - Software Architecture**  
**Janeiro de 2026**
