document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('produto-form');
    const produtosList = document.getElementById('produtos-list');
    const search = document.getElementById('search');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;

        await fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, quantidade, preco }),
        });

        loadProdutos();
    });

    async function loadProdutos(query = '') {
        const response = await fetch(`/produtos?search=${encodeURIComponent(query)}`);
        const produtos = await response.json();
        produtosList.innerHTML = '';
        produtos.forEach(produto => {
            const li = document.createElement('li');
            li.textContent = `${produto.nome} - ${produto.quantidade} - R$ ${produto.preco}`;
            produtosList.appendChild(li);
        });
    }

    search.addEventListener('input', () => {
        loadProdutos(search.value);
    });

    loadProdutos();
});
