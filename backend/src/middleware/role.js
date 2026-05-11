const User = require('../models/User');

const requireRole = (...roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
    }
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar permissão.' });
  }
};

module.exports = requireRole;
