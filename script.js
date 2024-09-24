// Função para adicionar produto (POST)
document.getElementById('produtoForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    try {
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao }),
        });

        if (response.ok) {
            alert('Produto adicionado com sucesso!');
            // Limpar o formulário
            document.getElementById('produtoForm').reset();
            // Atualizar a lista de produtos
            await atualizarListaDeProdutos();
        } else {
            alert('Erro ao adicionar o produto.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao se conectar ao servidor.');
    }
});

// Função para atualizar a lista de produtos (GET)
async function atualizarListaDeProdutos() {
    try {
        const response = await fetch('http://localhost:3000/produtos');
        const produtos = await response.json();

        // Limpar os produtos existentes
        const produtosContainer = document.getElementById('produtosContainer');
        produtosContainer.innerHTML = '';

        // Adicionar novos produtos à página
        produtos.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
            produtoDiv.innerHTML = `
                <div class="card">
                    <img src="img/produtos/produto_default.jpg" class="card-img-top" alt="${produto.nome}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">${produto.descricao}</p>
                        <a href="#" class="btn btn-primary align-self-center">Comprar</a>
                        <button class="btn btn-warning align-self-center mb-2" onclick="carregarProdutoParaEdicao(${produto.id})">Editar</button>
                        <button class="btn btn-danger align-self-center" onclick="deletarProduto(${produto.id})">Excluir</button>
                    </div>
                </div>
            `;
            produtosContainer.appendChild(produtoDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Função para carregar os dados do produto no formulário para edição
function carregarProdutoParaEdicao(id) {
    fetch(`http://localhost:3000/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('nome').value = produto.nome;
            document.getElementById('descricao').value = produto.descricao;

            // Atualiza o comportamento do formulário para editar o produto
            document.getElementById('produtoForm').onsubmit = async function(event) {
                event.preventDefault();
                await editarProduto(id);
            };
        })
        .catch(error => console.error('Erro ao carregar produto:', error));
}

// Função para editar produto (PUT)
async function editarProduto(id) {
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao }),
        });

        if (response.ok) {
            alert('Produto atualizado com sucesso!');
            document.getElementById('produtoForm').reset();
            document.getElementById('produtoForm').onsubmit = adicionarProduto; // Volta ao modo de adicionar
            await atualizarListaDeProdutos();
        } else {
            alert('Erro ao atualizar o produto.');
        }
    } catch (error) {
        console.error('Erro ao editar o produto:', error);
        alert('Erro ao se conectar ao servidor.');
    }
}

// Função para adicionar produto de volta após edição
async function adicionarProduto(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    try {
        const response = await fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, descricao }),
        });

        if (response.ok) {
            alert('Produto adicionado com sucesso!');
            document.getElementById('produtoForm').reset();
            await atualizarListaDeProdutos();
        } else {
            alert('Erro ao adicionar o produto.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao se conectar ao servidor.');
    }
}

// Função para deletar produto (DELETE)
async function deletarProduto(id) {
    try {
        const response = await fetch(`http://localhost:3000/produtos/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Produto removido com sucesso!');
            await atualizarListaDeProdutos();
        } else {
            alert('Erro ao remover o produto.');
        }
    } catch (error) {
        console.error('Erro ao se conectar ao servidor:', error);
        alert('Erro ao se conectar ao servidor.');
    }
}

// Carrega os produtos ao iniciar a página
document.addEventListener('DOMContentLoaded', atualizarListaDeProdutos);

