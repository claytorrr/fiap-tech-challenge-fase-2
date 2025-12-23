# Tech Challenge - Plataforma de Blogging para Professores

## Sumário
- [Descrição](#descrição)
- [Setup do Projeto](#setup-do-projeto)
- [Arquitetura](#arquitetura)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Experiências e Desafios](#experiências-e-desafios)
- [Autores](#autores)

## Descrição
Aplicação de blogging para professores da rede pública, permitindo criar, editar, listar, buscar e excluir postagens de forma centralizada e tecnológica. Desenvolvida em Node.js, com persistência em MongoDB, dockerizada e com CI/CD automatizado.

## Setup do Projeto

### Pré-requisitos
- Node.js 18+
- npm
- Docker e Docker Compose (opcional, para rodar em containers)

### Rodando localmente
1. Clone o repositório:
	 ```sh
	 git clone https://github.com/claytorrr/fiap-tech-challenge-fase-2.git
	 cd fiap-tech-challenge-fase-2
	 ```
2. Instale as dependências:
	 ```sh
	 npm install
	 ```
3. Configure o arquivo `.env`:
	 ```env
	 MONGODB_URI=mongodb://localhost:27017/fiap_tech_challenge
	 PORT=3000
	 ```
4. Inicie o MongoDB localmente e rode a aplicação:
	 ```sh
	 npm start
	 ```
5. Acesse: [http://localhost:3000](http://localhost:3000)

### Rodando com Docker
1. Certifique-se de que Docker está instalado e rodando.
2. Execute:
	 ```sh
	 docker-compose up --build
	 ```
3. Acesse: [http://localhost:3000](http://localhost:3000)

## Arquitetura

- **Node.js + Express**: Backend RESTful
- **MongoDB + Mongoose**: Persistência de dados
- **Jest + Supertest**: Testes automatizados
- **Docker**: Containerização
- **GitHub Actions**: CI/CD

**Estrutura de pastas:**

```
src/
	app.js
	index.js
	models/
		Post.js
	routes/
		posts.js
tests/
	posts.test.js
.github/workflows/ci.yml
Dockerfile
docker-compose.yml
README.md
```

## Endpoints da API

### Listar todos os posts
- **GET** `/posts`

### Buscar post por ID
- **GET** `/posts/:id`

### Criar novo post
- **POST** `/posts`
	- Body (JSON):
		```json
		{
			"titulo": "Título do post",
			"conteudo": "Conteúdo do post",
			"autor": "Nome do autor"
		}
		```

### Editar post
- **PUT** `/posts/:id`
	- Body (JSON):
		```json
		{
			"titulo": "Novo título",
			"conteudo": "Novo conteúdo",
			"autor": "Nome do autor"
		}
		```

### Excluir post
- **DELETE** `/posts/:id`

### Buscar posts por palavra-chave
- **GET** `/posts/search?q=palavra`

## Testes

- Para rodar os testes automatizados:
	```sh
	npm test
	```
- Para gerar relatório de cobertura:
	```sh
	npm test -- --coverage
	```

## CI/CD

- O projeto utiliza GitHub Actions para rodar os testes automaticamente a cada push ou pull request.
- Workflow: `.github/workflows/ci.yml`
- O workflow sobe um MongoDB de teste, instala dependências e executa os testes.

## Experiências e Desafios

- Integração de múltiplas tecnologias modernas (Node.js, MongoDB, Docker, CI/CD)
- Superação de problemas de ambiente e permissões (ex: node_modules, Docker, MongoDB)
- Garantia de qualidade com testes automatizados e cobertura superior a 70%
- Aprendizado prático de DevOps e boas práticas de versionamento

## Autores

- Clayton Gomes (claytonabgomes@gmail.com)
# fiap-tech-challenge-fase-2
