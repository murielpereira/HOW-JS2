const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000; // Define a porta em que o servidor irá escutar

app.use(express.json());
app.use(cors());

// Configuração da conexão com o banco de dados MySQL
const dbConfig = {
    host: 'localhost', // Endereço do servidor MySQL
    user: 'root',      // Usuário do MySQL
    password: 'admin', // Senha do MySQL
    database: 'loja_virtual' // Nome do banco de dados
};

// Função para obter uma conexão com o banco de dados
async function getConnection() {
    try {
        // Cria e retorna uma conexão usando a configuração
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        return connection;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);  // Em caso de erro na conexão, exibe a mensagem de erro e encerra a aplicação
    }
}

// Rota para cadastrar uma nova categoria
app.post('/api/categorias', async (req, res) => {
    const { nome, descricao, tags_seo } = req.body;

    // Validação básica dos dados recebidos
    if (!nome || !descricao) {
        // Se faltar nome ou descrição, envia um erro 400
        return res.status(400).json({ error: 'Nome e descrição da categoria são obrigatórios.' });
    }

    let connection;
    try {
        connection = await getConnection(); // Obtém uma conexão com o banco de dados
        const sql = 'INSERT INTO categorias (nome, descricao, tags_seo) VALUES (?, ?, ?)'; // Consulta SQL para inserir a nova categoria
        const [result] = await connection.execute(sql, [nome, descricao, tags_seo]); // Executa a consulta, passando os valores como um array

        // Envia uma mensagem para informar se a categoria foi cadastrada com sucesso ou não
        res.status(201).json({ message: 'Categoria cadastrada com sucesso!', id: result.insertId });
    } catch (err) {
        console.error('Erro ao cadastrar categoria:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao cadastrar categoria.' });
    } finally {
        if (connection) connection.end();
    }
});

// Rota para cadastrar um novo produto
app.post('/api/produtos', async (req, res) => {
    const { nome, fabricante, descricao, quantidade, preco, categoria_id } = req.body;

    if (!nome || !fabricante || !descricao || !quantidade || !preco || !categoria_id) {
        return res.status(400).json({ error: 'Todos os campos do produto são obrigatórios.' });
    }
    // Validação para garantir que quantidade e preco são números válidos
    if (isNaN(quantidade) || isNaN(preco)) {
        return res.status(400).json({ error: 'Quantidade e Preço devem ser números válidos.' });
    }

    let connection;
    try {
        // Obtém uma conexão com o banco de dados
        connection = await getConnection();
        
        const sql = 'INSERT INTO produtos (nome, fabricante, descricao, quantidade, preco, categoria_id) VALUES (?, ?, ?, ?, ?, ?)'; // Consulta SQL para inserir o novo produto
        const [result] = await connection.execute(sql, [nome, fabricante, descricao, quantidade, preco, categoria_id]); // Executa a consulta
        
        // Envia uma mensagem para informar se a categoria foi cadastrada com sucesso ou não
        res.status(201).json({ message: 'Produto cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        
        console.error('Erro ao cadastrar produto:', err.message);
        
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'A categoria informada não existe.' });
        }
        res.status(500).json({ error: 'Erro interno do servidor ao cadastrar produto.' });
    } finally {
        if (connection) connection.end();
    }
});


// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para buscar todas as categorias
app.get('/api/categorias', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute('SELECT id, nome, descricao, tags_seo FROM categorias'); // Consulta SQL para selecionar todas as categorias
        res.status(200).json(rows); // Envia as categorias encontradas como resposta JSON
    } catch (err) {
        console.error('Erro ao buscar categorias:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar categorias.' });
    } finally {
        if (connection) connection.end();
    }
});

// Rota para buscar todos os produtos
app.get('/api/produtos', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        // Consulta SQL usando JOIN para selecionar todos os produtos e suas categorias.
        const sql = `
            SELECT 
                p.id, 
                p.nome, 
                p.fabricante, 
                p.descricao, 
                p.quantidade, 
                p.preco, 
                c.nome AS categoria_nome, 
                p.categoria_id 
            FROM 
                produtos p
            JOIN 
                categorias c ON p.categoria_id = c.id;
        `;
        const [rows] = await connection.execute(sql);
        res.status(200).json(rows); // Envia os resultados como resposta JSON
    } catch (err) {
        console.error('Erro ao buscar produtos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar produtos.' });
    } finally {
        if (connection) connection.end();
    }
});
