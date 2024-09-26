const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./supabaseClient'); // Importa o cliente Supabase
const axios = require('axios'); // Para enviar requisições HTTP

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para a raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo à API do XepaSocial!');
});

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
  const { nome, descricao, numero } = req.body;

  // Verificação de número
  const numeroValido = /^\d{10,15}$/.test(numero);
  if (!numeroValido) {
      return res.status(400).send('Número inválido!');
  }

  // Gerar o link do WhatsApp
  const whatsappLink = `https://api.whatsapp.com/send?phone=${numero}`;

  try {
      const { data, error } = await supabase
          .from('produtos')
          .insert([{ nome, descricao, whatsapp_link: whatsappLink }]) // Use o nome correto do campo
          .select();

      if (error) {
          console.error('Erro ao inserir no Supabase:', error);
          return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
          return res.status(500).json({ error: 'Nenhum dado retornado após a inserção.' });
      }

      res.status(201).json(data[0]);
  } catch (error) {
      console.error('Erro ao adicionar produto:', error.message);
      res.status(500).send('Erro ao adicionar produto');
  }
});


// Rota para deletar produto
app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar produto:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(204).send(); // Responde com "No Content" se a exclusão for bem-sucedida
    } catch (error) {
        console.error('Erro ao remover produto:', error.message);
        res.status(500).send('Erro ao remover produto');
    }
});

// Rota para enviar mensagem via WhatsApp
app.post('/whatsapp', async (req, res) => {
    const { produtoId, numeroWhatsApp } = req.body;

    try {
        // Obtendo os detalhes do produto
        const { data: produto, error: produtoError } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', produtoId)
            .single(); // Obtém um único produto

        if (produtoError || !produto) {
            console.error('Erro ao obter produto:', produtoError);
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Montando a mensagem
        const mensagem = `Produto: ${produto.nome}\nDescrição: ${produto.descricao}`;

        // Gerar o link do WhatsApp
        const whatsappLink = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

        // Redirecionar o usuário para o link do WhatsApp
        res.status(200).json({ message: 'Mensagem enviada com sucesso!', link: whatsappLink });
    } catch (error) {
        console.error('Erro ao enviar mensagem via WhatsApp:', error.message);
        res.status(500).send('Erro ao enviar mensagem via WhatsApp');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
