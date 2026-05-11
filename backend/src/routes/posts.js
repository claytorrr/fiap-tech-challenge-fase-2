const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

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

// GET /posts/me - Posts do usuário autenticado (PROTEGIDA - deve vir antes de /search)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ criadoEm: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

// GET /posts/search - Busca de Posts (deve vir antes de /:id)
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

// GET /posts/:id - Leitura de Post (DEVE VIR DEPOIS de /me e /search)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar post.' });
  }
});

// POST /posts - Criação de Postagem (apenas professores)
router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;
    const novoPost = new Post({ 
      titulo, 
      conteudo, 
      autor,
      userId: req.userId // Vincula o post ao usuário autenticado
    });
    await novoPost.save();
    res.status(201).json(novoPost);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar post.' });
  }
});

// PUT /posts/:id - Edição de Postagem (apenas professores)
router.put('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
    
    // Verifica se o post pertence ao usuário autenticado
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este post.' });
    }
    
    const { titulo, conteudo, autor } = req.body;
    post.titulo = titulo;
    post.conteudo = conteudo;
    post.autor = autor;
    await post.save();
    
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar post.' });
  }
});

// DELETE /posts/:id - Exclusão de Postagem (apenas professores)
router.delete('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado.' });
    
    // Verifica se o post pertence ao usuário autenticado
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este post.' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover post.' });
  }
});

module.exports = router;
