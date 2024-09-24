const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./supabaseClient'); // Importa o cliente Supabase

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Erro ao listar produtos:', error.message);
    res.status(500).send('Erro ao listar produtos');
  }
});

// Rota para adicionar produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao } = req.body;

  try {
    // Tentativa de inserção no Supabase
    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, descricao }])
      .select();  // Certifique-se de selecionar os dados recém inseridos

    // Se houver erro na operação
    if (error) {
      console.error('Erro ao inserir no Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    // Verifica se a resposta contém dados válidos
    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'Nenhum dado retornado após a inserção.' });
    }

    // Responde com o primeiro item inserido
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.message);
    res.status(500).send('Erro ao adicionar produto');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:${PORT}');
});