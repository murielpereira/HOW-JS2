// Importa o módulo Express para criar o servidor web
const express = require('express');
// Importa o módulo CORS para permitir requisições de origens diferentes (seu frontend)
const cors = require('cors');
// Importa o módulo mysql2 para interagir com o banco de dados MySQL
const mysql = require('mysql2/promise'); // Usamos a versão com 'promise' para facilitar o uso de async/await

// Cria uma instância do aplicativo Express
const app = express();
// Define a porta em que o servidor irá escutar
const PORT = 3000;

// Middleware: Permite que o Express processe requisições com corpo JSON
app.use(express.json());
// Middleware: Habilita o CORS para todas as requisições (importante para o desenvolvimento)
app.use(cors());

// Configuração da conexão com o banco de dados MySQL
const dbConfig = {
    host: 'localhost', // Endereço do seu servidor MySQL (geralmente localhost)
    user: 'root',      // Seu usuário do MySQL (geralmente root)
    password: 'admin', // Sua senha do MySQL. ATENÇÃO: Mude para sua senha real!
    database: 'loja_virtual' // O nome do banco de dados que você criou no MySQL Workbench
};

// Função assíncrona para obter uma conexão com o banco de dados
async function getConnection() {
    try {
        // Cria e retorna uma conexão usando a configuração
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        return connection;
    } catch (err) {
        // Em caso de erro na conexão, loga o erro e encerra o processo
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
    }
}

// Rota para cadastrar uma nova categoria (POST /api/categorias)
app.post('/api/categorias', async (req, res) => {
    // Extrai os dados do corpo da requisição
    const { nome, descricao, tags_seo } = req.body;

    // Validação básica dos dados recebidos
    if (!nome || !descricao) {
        // Se faltar nome ou descrição, envia um erro 400 (Bad Request)
        return res.status(400).json({ error: 'Nome e descrição da categoria são obrigatórios.' });
    }

    let connection;
    try {
        // Obtém uma conexão com o banco de dados
        connection = await getConnection();
        // Prepara a consulta SQL para inserir a nova categoria
        const sql = 'INSERT INTO categorias (nome, descricao, tags_seo) VALUES (?, ?, ?)';
        // Executa a consulta, passando os valores como um array
        const [result] = await connection.execute(sql, [nome, descricao, tags_seo]);

        // Envia uma resposta de sucesso com o ID da nova categoria
        res.status(201).json({ message: 'Categoria cadastrada com sucesso!', id: result.insertId });
    } catch (err) {
        // Em caso de erro, loga o erro e envia uma resposta de erro 500 (Internal Server Error)
        console.error('Erro ao cadastrar categoria:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao cadastrar categoria.' });
    } finally {
        // Garante que a conexão com o banco de dados seja fechada, se estiver aberta
        if (connection) connection.end();
    }
});

// Rota para cadastrar um novo produto (POST /api/produtos)
app.post('/api/produtos', async (req, res) => {
    // Extrai os dados do corpo da requisição
    const { nome, fabricante, descricao, quantidade, preco, categoria_id } = req.body;

    // Validação básica dos dados
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
        // Prepara a consulta SQL para inserir o novo produto
        const sql = 'INSERT INTO produtos (nome, fabricante, descricao, quantidade, preco, categoria_id) VALUES (?, ?, ?, ?, ?, ?)';
        // Executa a consulta
        const [result] = await connection.execute(sql, [nome, fabricante, descricao, quantidade, preco, categoria_id]);

        // Envia uma resposta de sucesso com o ID do novo produto
        res.status(201).json({ message: 'Produto cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        // Em caso de erro, loga o erro e envia uma resposta de erro 500
        console.error('Erro ao cadastrar produto:', err.message);
        // Pode haver um erro específico se categoria_id não existir (Foreign Key constraint failed)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'A categoria informada não existe.' });
        }
        res.status(500).json({ error: 'Erro interno do servidor ao cadastrar produto.' });
    } finally {
        // Garante que a conexão seja fechada
        if (connection) connection.end();
    }
});


// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para buscar todas as categorias (GET /api/categorias)
app.get('/api/categorias', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        // Consulta SQL para selecionar todas as categorias
        const [rows] = await connection.execute('SELECT id, nome, descricao, tags_seo FROM categorias');
        // Envia as categorias encontradas como resposta JSON
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar categorias:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar categorias.' });
    } finally {
        if (connection) connection.end();
    }
});

// Rota para buscar todos os produtos (GET /api/produtos)
app.get('/api/produtos', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        // Consulta SQL para selecionar todos os produtos.
        // Usamos um JOIN para obter o nome da categoria junto com os dados do produto.
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
        res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar produtos.' });
    } finally {
        if (connection) connection.end();
    }
});