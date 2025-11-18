document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.products') || document.querySelector('.produtos-grid');
  if (!container) return;

  // Seleciona todos os elementos de produto (compatível com diferentes templates)
  const produtoSelector = '.product, .produto-card';
  const produtos = Array.from(container.querySelectorAll(produtoSelector));

  const sidebar = document.querySelector('.sidebar');
  const searchInput = document.querySelector('.search-bar input');

  // Agrupa opções de filtro por título (h4)
  function coletarOpcoes() {
    const groups = [];
    if (!sidebar) return groups;

    const headings = Array.from(sidebar.querySelectorAll('h4'));
    headings.forEach(h => {
      const group = { title: h.textContent.trim(), options: [] };
      // recolhe os .filter-option até o próximo h4
      let node = h.nextElementSibling;
      while (node && node.tagName.toLowerCase() !== 'h4') {
        if (node.classList && node.classList.contains('filter-option')) {
          const checkbox = node.querySelector('input[type="checkbox"]');
          const text = node.textContent.replace(/\s+/g, ' ').trim();
          group.options.push({ el: node, checkbox, text });
        }
        node = node.nextElementSibling;
      }
      if (group.options.length) groups.push(group);
    });
    return groups;
  }

  const grupos = coletarOpcoes();

  // parse número a partir de strings como "R$ 199,90" ou "200"
  function parseNumber(str) {
    if (!str) return NaN;
    const m = str.replace(/\s/g, '').match(/(\d+[.,]?\d*)/);
    if (!m) return NaN;
    return Number(m[1].replace(',', '.'));
  }

  function parsePriceRange(text) {
    const t = text.toLowerCase();
    const num = parseNumber(t);
    if (t.includes('até') && !isNaN(num)) return { min: 0, max: num };
    if (t.includes('acima') && !isNaN(num)) return { min: num, max: Infinity };
    // intervalo tipo "R$100 - R$300"
    const m = t.match(/(\d+[.,]?\d*)[^\d]+(\d+[.,]?\d*)/);
    if (m) return { min: Number(m[1].replace(',', '.')), max: Number(m[2].replace(',', '.')) };
    return null;
  }

  function obterDadosProduto(el) {
    // nome: busca primeiro <h3> ou primeiro <p> não .price
    const nomeEl = el.querySelector('h3') || Array.from(el.querySelectorAll('p')).find(p => !p.classList.contains('price'));
    const nome = nomeEl ? nomeEl.textContent.trim() : '';
    const priceEl = el.querySelector('.price') || Array.from(el.querySelectorAll('p')).find(p => /r\$/i.test(p.textContent));
    const preco = priceEl ? parseNumber(priceEl.textContent) : NaN;
    const sizes = Array.from(el.querySelectorAll('.sizes .size')).map(s => s.textContent.trim().toLowerCase());
    return { el, nome: nome.toLowerCase(), preco, sizes };
  }

  const produtosDados = produtos.map(obterDadosProduto);

  function produtoCasaFiltro(produto, filtrosSelecionados) {
    // filtrosSelecionados: { titulo: [opcoes-texto] }
    for (const [titulo, opcoes] of Object.entries(filtrosSelecionados)) {
      if (!opcoes || !opcoes.length) continue; // nenhum filtro ativo nesse grupo
      const t = titulo.toLowerCase();
      if (t.includes('cor')) {
        // verifica se o nome contém alguma das cores selecionadas
        const matches = opcoes.some(opt => produto.nome.includes(opt));
        if (!matches) return false;
      } else if (t.includes('taman') || t.includes('tamanho') || t.includes('tamanhos') || t.includes('tamanho')) {
        const matches = opcoes.some(opt => produto.sizes.includes(opt));
        if (!matches) return false;
      } else if (t.includes('faixa') || t.includes('preço') || t.includes('preco')) {
        // opcoes são ranges; o produto deve estar dentro de pelo menos uma
        const matches = opcoes.some(opt => {
          const range = parsePriceRange(opt);
          if (!range) return false;
          return (!isNaN(produto.preco)) && produto.preco >= range.min && produto.preco <= range.max;
        });
        if (!matches) return false;
      } else {
        // tipo/generic: verifica se nome contém a opção
        const matches = opcoes.some(opt => produto.nome.includes(opt));
        if (!matches) return false;
      }
    }
    return true;
  }

  function coletarFiltrosSelecionados() {
    const sel = {};
    grupos.forEach(g => {
      const ativos = g.options.filter(o => o.checkbox && o.checkbox.checked).map(o => o.text.toLowerCase());
      sel[g.title] = ativos;
    });
    return sel;
  }

  function aplicarFiltros() {
    const filtros = coletarFiltrosSelecionados();
    const termoBusca = searchInput ? (searchInput.value || '').toLowerCase().trim() : '';

    produtosDados.forEach(p => {
      let passa = true;
      if (termoBusca) {
        passa = p.nome.includes(termoBusca);
      }
      if (passa) passa = produtoCasaFiltro(p, filtros);
      p.el.style.display = passa ? '' : 'none';
    });
  }

  // ligar eventos nos checkboxes
  grupos.forEach(g => g.options.forEach(o => {
    if (o.checkbox) o.checkbox.addEventListener('change', aplicarFiltros);
  }));

  if (searchInput) searchInput.addEventListener('input', aplicarFiltros);

  // exposição global para debug/uso manual
  window.aplicarFiltros = aplicarFiltros;

  // aplica filtro inicial (caso tenha checkboxes pré-selecionados)
  aplicarFiltros();
});
