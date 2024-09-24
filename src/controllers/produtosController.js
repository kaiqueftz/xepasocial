const supabase = require('../supabaseClient');

// Obter todos os produtos
exports.getProdutos = async (req, res) => {
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
};

// Adicionar um novo produto
exports.addProduto = async (req, res) => {
  const { nome, descricao } = req.body;

  try {
    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, descricao }]);

    if (error) {
      throw error;
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Erro ao adicionar produto:', error.message);
    res.status(500).send('Erro ao adicionar produto');
  }
};
