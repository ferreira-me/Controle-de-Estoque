const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'controle_estoque',
    password: 'me',
    port: 5433,
});

app.use(express.json());
app.use(express.static('public'));

// Endpoint para listar produtos
app.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para adicionar um novo produto
app.post('/produtos', async (req, res) => {
    const { nome, quantidade, preco } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO produtos (nome, quantidade, preco) VALUES ($1, $2, $3) RETURNING *',
            [nome, quantidade, preco]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para atualizar um produto
app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, quantidade, preco } = req.body;
    try {
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, quantidade = $2, preco = $3 WHERE id = $4 RETURNING *',
            [nome, quantidade, preco, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para deletar um produto
app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
