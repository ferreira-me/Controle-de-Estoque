document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('produto-form');
    const produtosList = document.getElementById('produtos-list');
    const search = document.getElementById('search');
    let editId = null;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;

        if (editId) {
            // Atualiza o produto existente
            await fetch(`/produtos/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, quantidade, preco }),
            });
            editId = null;
        } else {
            // Adiciona um novo produto
            await fetch('/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, quantidade, preco }),
            });
        }

        loadProdutos();
    });

    async function loadProdutos(query = '') {
        const response = await fetch(`/produtos?search=${encodeURIComponent(query)}`);
        const produtos = await response.json();
        produtosList.innerHTML = '';

        produtos.forEach(produto => {
            const li = document.createElement('li');
            li.textContent = `${produto.nome} - ${produto.quantidade} - R$ ${produto.preco}`;

            // Cria um container para os botões
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            // Botão de editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => {
                document.getElementById('nome').value = produto.nome;
                document.getElementById('quantidade').value = produto.quantidade;
                document.getElementById('preco').value = produto.preco;
                editId = produto.id;
                window.scrollTo(0, 0); // Opcional: rola para o topo para exibir o formulário
            });

            // Botão de deletar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Deletar';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', async () => {
                await fetch(`/produtos/${produto.id}`, {
                    method: 'DELETE',
                });
                loadProdutos();
            });

            // Adiciona os botões ao container
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // Adiciona o container ao item da lista
            li.appendChild(buttonContainer);

            // Adiciona a classe 'highlight' se o produto for encontrado na busca
            if (query && produto.nome.toLowerCase().includes(query.toLowerCase())) {
                li.classList.add('highlight');
            }

            produtosList.appendChild(li);
        });
    }

    search.addEventListener('input', () => {
        loadProdutos(search.value);
    });

    loadProdutos();
});
