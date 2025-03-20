const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');  // Importa o pacote CORS
const app = express();
const port = 3000;

// Habilita o CORS para todas as origens
app.use(cors());  // Permite todas as origens. Você pode personalizar para um domínio específico se necessário

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token não fornecido');

  jwt.verify(token, 'secrettoken', (err, decoded) => {
    if (err) return res.status(500).send('Falha na autenticação');
    req.userId = decoded.id;
    next();
  });
};

// Configuração do PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'app_residencia',
  password: 'admin',
  port: 5433,
});

client.connect();

// API para cadastro de usuário
app.post('/Cadastro', async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o usuário já existe
  const checkUser = await client.query('SELECT * FROM Usuario WHERE email = $1', [email]);
  if (checkUser.rows.length > 0) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Inserir o novo usuário no banco de dados
    const result = await client.query(
      'INSERT INTO Usuario (nome_user, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', Usuario: result.rows[0] });
  } catch (error) {
    console.error('Erro no cadastro', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// API para login de usuário
app.post('/Login', async (req, res) => {
  const { email, password } = req.body;

  // Buscar o usuário no banco de dados
  const result = await client.query('SELECT * FROM Usuario WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  const user = result.rows[0];

  // Verificar se a senha está correta
  const isMatch = await bcrypt.compare(password, user.senha);
  if (!isMatch) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  // Gerar o JWT
  const token = jwt.sign({ id: user.id, name: user.nome_user }, 'secrettoken', {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'Login bem-sucedido', token });
});

// API para obter os dados do usuário (exemplo de leitura)
app.get('/user', verifyToken, async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Usuario WHERE id = $1', [req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// API para atualizar dados do usuário
app.put('/user', verifyToken, async (req, res) => {
  const { name, email } = req.body;
  
  try {
    const result = await client.query(
      'UPDATE Usuario SET nome_user = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Dados atualizados', Usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

// API para excluir usuário
app.delete('/user', verifyToken, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM Usuario WHERE id = $1 RETURNING *', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso', Usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
