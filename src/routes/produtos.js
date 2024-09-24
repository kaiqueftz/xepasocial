const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');

// Definir as rotas
router.get('/', produtosController.getProdutos);
router.post('/', produtosController.addProduto);

module.exports = router;