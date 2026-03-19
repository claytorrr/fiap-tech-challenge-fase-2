const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Post = require('../src/models/Post');
const User = require('../src/models/User');

describe('Posts API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'fiap_tech_challenge_test' });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpa posts e usuários antes de cada teste
    await Post.deleteMany();
    await User.deleteMany();

    // Cria um usuário de teste e obtém o token
    const registerRes = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'senha123'
      });
    
    token = registerRes.body.token;
    userId = registerRes.body.user.id;
  });

  it('deve criar um novo post', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.titulo).toBe('Teste');
    expect(res.body.userId).toBe(userId);
  });

  it('deve retornar 401 ao criar post sem autenticação', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    expect(res.statusCode).toEqual(401);
  });

  it('deve listar posts', async () => {
    await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });
    const res = await request(app).get('/posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar post por id', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });
    const res = await request(app).get(`/posts/${post._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toBe('Teste');
  });

  it('deve editar um post', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });
    const res = await request(app)
      .put(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Editado', conteudo: 'Novo conteúdo', autor: 'Autor' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toBe('Editado');
  });

  it('deve retornar 403 ao editar post de outro usuário', async () => {
    // Cria outro usuário
    const otherUserRes = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Other User',
        email: 'other@example.com',
        senha: 'senha123'
      });

    // Cria post com o primeiro usuário
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });

    // Tenta editar com o segundo usuário
    const res = await request(app)
      .put(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${otherUserRes.body.token}`)
      .send({ titulo: 'Editado', conteudo: 'Novo conteúdo', autor: 'Autor' });
    
    expect(res.statusCode).toEqual(403);
  });

  it('deve deletar um post', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });
    const res = await request(app)
      .delete(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Post removido com sucesso.');
  });

  it('deve retornar 403 ao deletar post de outro usuário', async () => {
    // Cria outro usuário
    const otherUserRes = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Other User',
        email: 'other@example.com',
        senha: 'senha123'
      });

    // Cria post com o primeiro usuário
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor', userId });

    // Tenta deletar com o segundo usuário
    const res = await request(app)
      .delete(`/posts/${post._id}`)
      .set('Authorization', `Bearer ${otherUserRes.body.token}`);
    
    expect(res.statusCode).toEqual(403);
  });

  it('deve buscar posts por palavra-chave', async () => {
    await Post.create({ titulo: 'JavaScript é incrível', conteudo: 'Conteúdo sobre JS', autor: 'Autor', userId });
    await Post.create({ titulo: 'Python para iniciantes', conteudo: 'Conteúdo sobre Python', autor: 'Autor', userId });
    const res = await request(app).get('/posts/search?q=JavaScript');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toContain('JavaScript');
  });

  it('deve retornar erro ao buscar sem termo', async () => {
    const res = await request(app).get('/posts/search');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Termo de busca não informado.');
  });
});
