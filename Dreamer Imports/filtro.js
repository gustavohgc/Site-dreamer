const produtos = {
  acessorios: [
    {
      id: 1,
      nome: "Boné Streetwear Dreamer Curved Black",
      preco: 99.00,
      cores: ["preta", "branca", "bege"],
      imagens: ["../img/bone1.png", "../img/bone2.png", "../img/bone3.png"],
      categoria: "acessorios"
    },
    // Adicione mais produtos aqui
  ],
  // Outras categorias
};

function filtrarProdutos(categoria, filtros) {
  let produtosFiltrados = produtos[categoria];

  if (filtros.cor) {
    produtosFiltrados = produtosFiltrados.filter(p => p.cor.includes(filtros.cor));
  }
  if (filtros.precoMin) {
    produtosFiltrados = produtosFiltrados.filter(p => p.preco >= filtros.precoMin);
  }
  if (filtros.precoMax) {
    produtosFiltrados = produtosFiltrados.filter(p => p.preco <= filtros.precoMax);
  }

  return produtosFiltrados;
}

function exibirProdutos(produtos) {
  const container = document.querySelector('.produtos-grid');
  container.innerHTML = '';

  produtos.forEach(produto => {
    const produtoElement = document.createElement('div');
    produtoElement.className = 'produto-card';
    produtoElement.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" 
           onclick="abrirProduto('${produto.id}', '${produto.categoria}')">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
    `;
    container.appendChild(produtoElement);
  });
}