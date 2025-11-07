function abrirProduto(id, categoria) {
  // Salva os dados do produto selecionado no localStorage
  const produto = produtos[categoria].find(p => p.id === parseInt(id));
  localStorage.setItem('produtoSelecionado', JSON.stringify(produto));

  // Redireciona para a página apropriada
  const paginas = {
    camisetas: 'roupas.html',
    calcas: 'roupas.html',
    bermudas: 'roupas.html',
    moletom: 'roupas.html',
    calcados: 'calcados.html',
    acessorios: 'acessorios.html'
  };

  window.location.href = paginas[categoria];
}

// Função para carregar os detalhes do produto na página
function carregarDetalhesProduto() {
  const produto = JSON.parse(localStorage.getItem('produtoSelecionado'));
  if (!produto) return;

  // Atualiza as imagens
  document.querySelector('.imagem-principal img').src = produto.imagem;
  const miniaturas = document.querySelectorAll('.galeria .thumb');
  produto.imagens.forEach((img, index) => {
    if (miniaturas[index]) {
      miniaturas[index].src = img;
    }
  });

  // Atualiza as informações
  document.querySelector('.detalhes h2').textContent = produto.nome;
  document.querySelector('.detalhes h3').textContent = `R$ ${produto.preco.toFixed(2)}`;

  // Atualiza as cores disponíveis
  const coresContainer = document.querySelector('.opcoes-cores');
  coresContainer.innerHTML = '';
  produto.cor.forEach(cor => {
    const botaoCor = document.createElement('button');
    botaoCor.className = `cor ${cor}`;
    botaoCor.setAttribute('data-cor', cor);
    coresContainer.appendChild(botaoCor);
  });
}