require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas de posts
app.use('/posts', postsRouter);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('API Tech Challenge rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
