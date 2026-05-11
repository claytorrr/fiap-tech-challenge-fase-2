const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

// GET /users - Lista paginada de usuários (apenas professores autenticados)
router.get('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const filter = role ? { role } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter).select('-senha').skip(skip).limit(Number(limit)).sort({ criadoEm: -1 }),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
});

// GET /users/:id - Busca usuário por ID (apenas professores autenticados)
router.get('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// POST /users - Criação de usuário (apenas professores autenticados)
router.post('/', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const user = new User({ nome, email, senha, role: role || 'student' });
    await user.save();

    res.status(201).json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      criadoEm: user.criadoEm
    });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar usuário.' });
  }
});

// PUT /users/:id - Edição de usuário (apenas professores autenticados)
router.put('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const { nome, email, senha, role } = req.body;

    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) user.senha = senha;
    if (role) user.role = role;

    await user.save();

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      criadoEm: user.criadoEm
    });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao editar usuário.' });
  }
});

// DELETE /users/:id - Exclusão de usuário (apenas professores autenticados)
router.delete('/:id', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    // Impede que o professor exclua a si mesmo
    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Você não pode excluir sua própria conta.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
});

module.exports = router;
