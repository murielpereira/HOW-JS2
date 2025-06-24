// Funções para salvar dados de categoria
function salvarCategoria() {
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const seo = document.getElementById('seo').value.trim();

    if (!nome || !descricao || !seo) {
        alert('Preencha todos os campos.');
        return;
    }

    fetch('http://localhost:3000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, tags_seo: seo })
    })
    .then(res => res.json())
    .then(data => {
        alert(`Categoria cadastrada com ID ${data.id}`);
        document.querySelector('form').reset(); 
        carregarCategorias(); // Chama a função para recarregar as categorias na tabela
    })
    .catch((error) => {
        console.error('Erro ao cadastrar categoria:', error);
        alert('Erro ao cadastrar categoria. Verifique o console para mais detalhes.');
    });
}

// Funções para salvar dados de produto
function salvarProduto() {
    const nome = document.getElementById('nome').value.trim();
    const fabricante = document.getElementById('fabricante').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria_id = parseInt(document.getElementById('categoria_id').value);

    if (!nome || !fabricante || !descricao || !quantidade || !preco || !categoria_id) {
        alert('Preencha todos os campos.');
        return;
    }

    if (isNaN(quantidade) || isNaN(preco) || isNaN(categoria_id)) {
        alert('Quantidade, Preço e Categoria devem ser números válidos.');
        return;
    }

    fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, fabricante, descricao, quantidade, preco, categoria_id })
    })
    .then(res => res.json())
    .then(data => {
        alert(`Produto cadastrado com ID ${data.id}`);
        document.querySelector('form').reset();
        carregarProdutos(); // Chama a função para recarregar os produtos na tabela
    })
    .catch((error) => {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao cadastrar produto. Verifique o console para mais detalhes.');
    });
}

// Funções para carregar e exibir categorias na tabela
async function carregarCategorias() {
    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();
        
        const tbody = document.getElementById('listaCategorias'); 
        if (!tbody) {
            console.warn("Elemento 'listaCategorias' não encontrado. Verifique o HTML.");
            return; 
        }
        tbody.innerHTML = '';

        categorias.forEach(categoria => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = categoria.id;
            row.insertCell(1).textContent = categoria.nome;
            row.insertCell(2).textContent = categoria.descricao;
            row.insertCell(3).textContent = categoria.tags_seo;
            
            const acoesCell = row.insertCell(4);
            acoesCell.innerHTML = `
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Não foi possível carregar as categorias. Verifique a conexão com o servidor.');
    }
}

// Funções para carregar e exibir produtos na tabela
async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const produtos = await response.json();

        const tbody = document.getElementById('listaProdutos');
        if (!tbody) {
            console.warn("Elemento 'listaProdutos' não encontrado. Verifique o HTML.");
            return;
        }

        tbody.innerHTML = ''; // Limpa o corpo da tabela

        produtos.forEach(produto => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = produto.id;
            row.insertCell(1).textContent = produto.categoria_nome; // Nome da categoria
            row.insertCell(2).textContent = produto.fabricante;
            row.insertCell(3).textContent = produto.nome;
            row.insertCell(4).textContent = produto.descricao;
            row.insertCell(5).textContent = produto.quantidade;
            row.insertCell(6).textContent = parseFloat(produto.preco).toFixed(2); // Garante que é número antes de formatar

            const acoesCell = row.insertCell(7);
            acoesCell.innerHTML = `
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
            `;

        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Não foi possível carregar os produtos. Verifique a conexão com o servidor.');
    }
}

// Função para preencher o select de categorias no formulário de produtos
async function preencherCategoriasSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        // Verifica se a resposta da rede foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categorias = await response.json();
        
        const selectElement = document.getElementById('categoria_id');
        if (!selectElement) return; // Garante que estamos na página de produtos

        // Limpa as opções existentes, exceto a primeira (opção "Selecione...")
        selectElement.innerHTML = '<option value="">Selecione uma categoria</option>'; 

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao preencher categorias no select:', error);
        alert('Não foi possível carregar as categorias para o seletor. Verifique a conexão com o servidor.');
    }
}


// Adiciona um Event Listener para carregar os dados quando a página estiver totalmente carregada
document.addEventListener('DOMContentLoaded', () => {
    // Verifica qual página estamos e chama a função de carregamento apropriada
    if (document.querySelector('title').textContent === 'Cadastro de Categoria') {

        const tbodyCategorias = document.getElementById('listaProdutos'); // Tenta encontrar o ID antigo
        if (tbodyCategorias) {
            tbodyCategorias.id = 'listaCategorias'; // Renomeia para o ID esperado pela função
        }
        carregarCategorias(); // Chama a função para carregar e exibir as categorias
    } else if (document.querySelector('title').textContent === 'Cadastro de Produto') {
        carregarProdutos(); // Chama a função para carregar e exibir os produtos
        preencherCategoriasSelect(); // Preenche o select de categorias
    }
});
