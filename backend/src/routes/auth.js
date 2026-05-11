const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Registro de novo usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Verificar se usuário já existe
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    // Criar novo usuário
    const user = new User({ nome, email, senha, role: role || 'student' });
    await user.save();

    // Gerar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar usuário.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Verificar senha
    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gerar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao fazer login.' });
  }
});

// Retorna dados do usuário autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-senha');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
});

module.exports = router;
