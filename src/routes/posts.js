const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// GET /posts - Lista de Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ criadoEm: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

// GET /posts/:id - Leitura de Post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar post.' });
  }
});

// POST /posts - Criação de Postagem
router.post('/', async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const novoPost = new Post({ titulo, conteudo, autor });
    await novoPost.save();
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar post.' });
  }
});

// PUT /posts/:id - Edição de Postagem
router.put('/:id', async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const postAtualizado = await Post.findByIdAndUpdate(
      req.params.id,
      { titulo, conteudo, autor },
      { new: true, runValidators: true }
    );
    if (!postAtualizado) return res.status(404).json({ error: 'Post não encontrado.' });
    res.json(postAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar post.' });
  }
});

// DELETE /posts/:id - Exclusão de Postagem
router.delete('/:id', async (req, res) => {
  try {
    const postRemovido = await Post.findByIdAndDelete(req.params.id);
    if (!postRemovido) return res.status(404).json({ error: 'Post não encontrado.' });
    res.json({ message: 'Post removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover post.' });
  }
});

// GET /posts/search - Busca de Posts
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Termo de busca não informado.' });
    const posts = await Post.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { conteudo: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

module.exports = router;
