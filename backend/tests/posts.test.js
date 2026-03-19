const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Post = require('../src/models/Post');

describe('Posts API', () => {
  beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'fiap_tech_challenge_test' });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Post.deleteMany();
  });

  it('deve criar um novo post', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.titulo).toBe('Teste');
  });

  it('deve listar posts', async () => {
    await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).get('/posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve buscar post por id', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).get(`/posts/${post._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toBe('Teste');
  });

  it('deve editar um post', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app)
      .put(`/posts/${post._id}`)
      .send({ titulo: 'Editado', conteudo: 'Novo conteúdo', autor: 'Autor' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.titulo).toBe('Editado');
  });

  it('deve deletar um post', async () => {
    const post = await Post.create({ titulo: 'Teste', conteudo: 'Conteúdo', autor: 'Autor' });
    const res = await request(app).delete(`/posts/${post._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Post removido com sucesso.');
  });

  it('deve buscar posts por palavra-chave', async () => {
    await Post.create({ titulo: 'JavaScript é incrível', conteudo: 'Conteúdo sobre JS', autor: 'Autor' });
    await Post.create({ titulo: 'Python para iniciantes', conteudo: 'Conteúdo sobre Python', autor: 'Autor' });
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
