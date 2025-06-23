-----

Ótima ideia\! Um arquivo `README.md` bem elaborado é essencial para qualquer projeto no GitHub, pois ele serve como a apresentação e documentação principal.

Aqui está um `README.md` completo para o seu projeto, cobrindo o que foi desenvolvido e como configurá-lo e executá-lo.

-----

# Sistema de Cadastro Web (Produtos e Categorias)

Este projeto é um sistema web básico para gerenciamento de produtos e categorias, desenvolvido com **HTML**, **CSS**, **JavaScript** no frontend e **Node.js** com **Express.js** no backend, utilizando **MySQL** como banco de dados. Ele demonstra as funcionalidades essenciais de cadastro e listagem (CRUD - Create, Read).

-----

## 🚀 Tecnologias Utilizadas

  * **Frontend:**
      * **HTML5:** Estrutura das páginas web e formulários.
      * **CSS3:** Estilização e layout da interface.
      * **JavaScript:** Lógica de interação com o usuário, validação de formulários e comunicação com o backend (via `fetch` API).
  * **Backend:**
      * **Node.js:** Ambiente de execução JavaScript no servidor.
      * **Express.js:** Framework web para Node.js, utilizado para construir as APIs RESTful.
      * **CORS:** Middleware para habilitar requisições de diferentes origens (necessário para a comunicação entre frontend e backend em desenvolvimento).
      * **mysql2/promise:** Driver MySQL para Node.js, permitindo a interação com o banco de dados de forma assíncrona.
  * **Banco de Dados:**
      * **MySQL:** Sistema de gerenciamento de banco de dados relacional.
      * **MySQL Workbench:** Ferramenta gráfica para modelagem e administração do banco de dados.

-----

## ✨ Funcionalidades

### Cadastro e Listagem de Categorias

  * Formulário intuitivo para inserir **Nome**, **Descrição** e **Tags SEO** de uma categoria.
  * Validação de campos obrigatórios no frontend.
  * Tabela dinâmica que exibe todas as categorias cadastradas, atualizando em tempo real após um novo cadastro.

### Cadastro e Listagem de Produtos

  * Formulário completo para inserir **Nome**, **Fabricante**, **Descrição**, **Quantidade**, **Preço**.
  * Campo de **Categoria** preenchido dinamicamente com as categorias disponíveis no banco de dados.
  * Validação de campos obrigatórios e tipos de dados (números, decimais).
  * Tabela dinâmica que exibe todos os produtos cadastrados, incluindo o nome da categoria associada, com atualização em tempo real.

### Persistência de Dados

  * Todos os dados de categorias e produtos são armazenados em um banco de dados MySQL.
  * Relacionamento de **um-para-muitos** entre Categorias e Produtos (uma categoria pode ter muitos produtos).

-----

## 📦 Estrutura do Projeto

```
seu_projeto/
├── frontend/
│   ├── cadastro_categoria.html   // Formulário e tabela para categorias
│   ├── cadastro_produto.html     // Formulário e tabela para produtos
│   ├── script.js                 // Lógica JavaScript do frontend (interação, fetch)
│   ├── style.css                 // Estilos CSS
│   └── database.js               // (Não utilizado diretamente para conexão MySQL neste modelo)
└── backend/
    ├── server.js                 // Servidor Node.js (API RESTful e conexão com DB)
    ├── package.json              // Gerenciador de dependências do Node.js
    └── package-lock.json
```

-----

## ⚙️ Como Configurar e Executar

Siga os passos abaixo para configurar e rodar o projeto em sua máquina.

### Pré-requisitos

Certifique-se de ter o seguinte software instalado:

  * **Node.js** e **npm** (Node Package Manager) - [Download Node.js](https://nodejs.org/en/download/)
  * **MySQL Server** - [link suspeito removido]
  * **MySQL Workbench** (Opcional, mas recomendado para gerenciamento de DB) - [Download MySQL Workbench](https://www.mysql.com/products/workbench/)

### 1\. Configuração do Banco de Dados MySQL

1.  **Abra o MySQL Workbench** e conecte-se ao seu servidor MySQL.

2.  **Crie um novo schema (banco de dados)** chamado `loja_online`. Você pode fazer isso clicando com o botão direito em `SCHEMAS` no painel Navigator e selecionando "Create Schema...".

3.  **Execute as seguintes queries SQL** para criar as tabelas `categorias` e `produtos`:

    ```sql
    -- Usar o banco de dados criado
    USE loja_online;

    -- Criar a tabela de categorias
    CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE,
        descricao TEXT NOT NULL,
        tags_seo VARCHAR(512)
    );

    -- Criar a tabela de produtos
    CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        fabricante VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        quantidade INT NOT NULL,
        preco DECIMAL(10, 2) NOT NULL,
        categoria_id INT NOT NULL,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
    ```

    *Certifique-se de que as tabelas foram criadas corretamente, atualizando a visualização dos SCHEMAS no Workbench.*

### 2\. Configuração do Backend (Node.js)

1.  **Navegue até a pasta `backend`** do projeto no seu terminal:
    ```bash
    cd seu_projeto/backend
    ```
2.  **Instale as dependências** do Node.js:
    ```bash
    npm install
    ```
    *(Isso instalará `express`, `mysql2` e `cors` com base no `package.json`.)*
3.  **Abra o arquivo `server.js`** e **atualize suas credenciais do MySQL** na variável `dbConfig`:
    ```javascript
    const dbConfig = {
        host: 'localhost',
        user: 'root',      // Seu usuário MySQL
        password: 'SUA_SENHA_MYSQL', // <-- **MUDE AQUI PARA SUA SENHA REAL DO MYSQL**
        database: 'loja_online'
    };
    ```
4.  **Inicie o servidor backend:**
    ```bash
    node server.js
    ```
    *Você deverá ver uma mensagem no terminal indicando que o servidor está rodando na porta 3000, como `Servidor rodando em http://localhost:3000`.*

### 3\. Execução do Frontend

1.  **Abra os arquivos HTML** (`cadastro_categoria.html` e `cadastro_produto.html`) diretamente no seu navegador. Você pode simplesmente arrastá-los para a janela do navegador ou usar a opção "Abrir com...".

-----

## 🚀 Como Testar

1.  Com o servidor Node.js rodando, abra `cadastro_categoria.html` no navegador.
2.  Preencha o formulário e clique em "Cadastrar". Você deverá ver um alerta de sucesso e o item recém-cadastrado aparecerá na tabela.
3.  Repita o processo com `cadastro_produto.html`. Ao cadastrar um produto, o campo de categoria deverá ser preenchido automaticamente com as categorias que você já inseriu.
