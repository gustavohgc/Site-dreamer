
const promos = [
  "PROMOÇÃO!!!",
  "FRETE GRÁTIS EM TODO O BRASIL!",
  "LEVE 3, PAGUE 2 EM CAMISETAS!",
];

/* ======= BANCO DE DADOS DE PRODUTOS (SIMULADO) ======= */
// Centraliza todos os produtos para que a busca funcione em qualquer lugar
const productsDB = [
  // Camisetas
  { id: 1, title: "Camisa Bege Streetwear", price: 120.00, img: "img/camiseta01.png", link: "roupas.html", category: "camisetas" },
  { id: 2, title: "Camiseta Preta Blunt", price: 135.00, img: "img/camiseta02.png", link: "camiseta02.html", category: "camisetas" },
  { id: 3, title: "Camiseta Preta NG", price: 299.90, img: "img/camiseta3.png", link: "camiseta03.html", category: "camisetas" },
  { id: 4, title: "Camiseta Preta Logo", price: 229.90, img: "img/camiseta04.png", link: "camiseta04.html", category: "camisetas" },
  // Bermudas
  { id: 5, title: "Bermuda Cargo Bege", price: 129.90, img: "img/bermuda01.png", link: "bermuda01.html", category: "bermudas" },
  { id: 6, title: "Bermuda Cargo Marrom", price: 159.90, img: "img/bermuda02.png", link: "bermuda02.html", category: "bermudas" },
  { id: 7, title: "Bermuda Cargo Preta", price: 100.00, img: "img/bermuda03.png", link: "bermuda03.html", category: "bermudas" },
  { id: 8, title: "Bermuda Preta", price: 60.00, img: "img/bermuda04.png", link: "bermuda04.html", category: "bermudas" },
  { id: 9, title: "Bermuda Branca", price: 110.00, img: "img/bermuda05.png", link: "bermuda05.html", category: "bermudas" },
  // Calças
  { id: 10, title: "Calça Cargo", price: 199.90, img: "img/calca01.png", link: "calca.html", category: "calcas" },
  // Calçados
  { id: 11, title: "Tênis Hooks", price: 200.00, img: "img/sapato01.png", link: "sapato01.html", category: "calcados"},
  { id: 12, title: "Tênis Bege", price: 249.90, img: "img/sapato02.png", link: "sapato02.html", category: "calcados" },
  { id: 13, title: "Tênis Hooks Rosa", price: 299.90, img: "img/sapato03.png", link: "sapato03.html", category: "calcados" },
  // Acessórios
  { id: 14, title: "Mochila Fire", price: 199.90, img: "img/mochila01.png", link: "mochila.html", category: "acessorios" },
];

let index = 0;

/* Promo carousel */
function showPromo(i) {
  const promoText = document.querySelector(".promo-content h2");
  const promoDesc = document.querySelector(".promo-content p");
  if (!promoText || !promoDesc) return;
  promoText.style.opacity = 0;
  promoDesc.style.opacity = 0;
  setTimeout(() => {
    promoText.textContent = promos[i];
    promoText.style.opacity = 1;
    promoDesc.style.opacity = 1;
  }, 300);
}
document.addEventListener("DOMContentLoaded", () => {
  // inicializa promo quando existir
  if (document.querySelector(".promo-content h2")) showPromo(0);
});
setInterval(() => {
  index = (index + 1) % promos.length;
  showPromo(index);
}, 4000);

/* ======= DETALHES DO PRODUTO ======= */
document.addEventListener('DOMContentLoaded', () => {
  // Carregar produto se estiver na página de produto (se houver função carregarProduto externa)
  if (document.querySelector('.produto-container') && typeof carregarProduto === 'function') {
    carregarProduto();
  }

  // Configurar eventos das miniaturas
  const thumbs = document.querySelectorAll('.galeria .thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelector('.imagem-principal img').src = thumb.src;
    });
  });

  setupProductInteractions(document); // Inicializa eventos para elementos existentes
});

// Função auxiliar para configurar eventos de tamanho/cor e botões de adicionar
// Útil para chamar após renderizar produtos dinamicamente
function setupProductInteractions(rootElement) {
  // Seleção de cor e tamanho
  rootElement.querySelectorAll('.produto-container, .card, .product').forEach(container => {
    // Tamanhos
    const sizeBtns = container.querySelectorAll('.tamanhos .opcoes button, .sizes .size');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', function(ev) {
        ev.preventDefault();
        sizeBtns.forEach(b => b.classList.remove('selecionado', 'highlight'));
        btn.classList.add('selecionado', 'highlight'); // highlight usado na listagem
        container.dataset.selectedSize = btn.textContent.trim();
      });
    });
    // Cores
    const colorBtns = container.querySelectorAll('.opcoes-cores button');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', function(ev) {
        ev.preventDefault();
        colorBtns.forEach(b => b.classList.remove('selecionado'));
        btn.classList.add('selecionado');
        const classes = Array.from(btn.classList);
        const color = classes.find(c => c !== 'cor' && c !== 'selecionado') || btn.getAttribute('aria-label') || '';
        container.dataset.selectedColor = color;
      });
    });
  });

  // Garantir campos de quantidade defaults
  rootElement.querySelectorAll('input.qty, input.quantity').forEach(inp => {
    if (!inp.value) inp.value = 1;
    inp.addEventListener('input', () => {
      if (Number(inp.value) < 1) inp.value = 1;
    });
  });
  initAddToCartButtons(rootElement); 
}


/* ======= UTILITÁRIOS DE CARRINHO ======= */
const CART_KEY = "dreamer_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro lendo carrinho:", e);
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(item) {
  const cart = getCart();
  const matchIdx = cart.findIndex(it => (
    (it.title || '') === (item.title || '') &&
    (it.size || null) === (item.size || null) &&
    (it.color || null) === (item.color || null)
  ));
  if (matchIdx >= 0) {
    cart[matchIdx].quantity = Number(cart[matchIdx].quantity || 1) + Number(item.quantity || 1);
  } else {
    if (typeof item.quantity === 'undefined') item.quantity = 1;
    cart.push(item);
  }
  saveCart(cart);
}
function removeFromCart(idx) {
  const cart = getCart();
  if (idx >= 0 && idx < cart.length) {
    cart.splice(idx, 1);
    saveCart(cart);
  }
}
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || 1))), 0);
}
function formatBRL(n) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/* ======= TOAST ======= */
function showToast(text, duration = 2200) {
  try {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:9999';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.cssText = 'background:rgba(0,0,0,0.85);color:#fff;padding:10px 14px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.2);font-size:14px;opacity:0;transform:translateY(6px);transition:all 220ms ease';
    t.textContent = text;
    container.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(6px)';
      setTimeout(() => t.remove(), 240);
    }, duration);
  } catch (e) {
    console.warn('Toast error', e);
  }
}

/* ======= BADGE DO CARRINHO ======= */
function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, it) => s + (Number(it.quantity || 1)), 0);
  const cartLink = document.querySelector('.icons a[href="carrinho.html"], .icons a[href="./carrinho.html"]');
  if (!cartLink) return;
  
  let badge = cartLink.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    badge.style.cssText = "background:#e63946;color:#fff;border-radius:12px;padding:2px 6px;font-size:12px;margin-left:4px;vertical-align:top";
    cartLink.appendChild(badge);
  }
  
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-block' : 'none';
}

/* ======= GALERIA ======= */
function initGalleries() {
  document.querySelectorAll(".produto-container").forEach(container => {
    const mainImg = container.querySelector(".imagem-principal img");
    if (!mainImg) return;
    container.querySelectorAll(".galeria .thumb").forEach(thumb => {
      thumb.style.cursor = "pointer";
      thumb.addEventListener("click", () => {
        if (thumb.src) mainImg.src = thumb.src;
      });
    });
  });
}

/* ======= ADD AO CARRINHO ======= */
function extractProductFromPage(button) {
  const card = button.closest(".produto-container") || button.closest(".card") || button.closest(".product") || document.body;
  const title =
    (card.querySelector(".detalhes h2") && card.querySelector(".detalhes h2").textContent.trim()) ||
    (card.querySelector("h4") && card.querySelector("h4").textContent.trim()) ||
    (card.querySelector("h2") && card.querySelector("h2").textContent.trim()) ||
    (card.querySelector("p:first-of-type") && card.querySelector("p:first-of-type").textContent.trim()) ||
    document.title || "Produto";
  
  const priceText =
    (card.querySelector(".detalhes h3") && card.querySelector(".detalhes h3").textContent.trim()) ||
    (card.querySelector(".price") && card.querySelector(".price").textContent.trim()) ||
    (card.querySelector(".preco") && card.querySelector(".preco").textContent.trim()) ||
    "R$ 0,00";
    
  const imgEl =
    card.querySelector(".imagem-principal img") ||
    card.querySelector("img") ||
    null;
  const img = imgEl ? imgEl.getAttribute("src") : "";
  
  const priceNum = parseFloat(String(priceText).replace(/[^\d,.-]/g,"").replace(",",".")) || 0;
  
  let size = null;
  if (card && card.dataset && card.dataset.selectedSize) {
    size = card.dataset.selectedSize;
  } else {
    // Tenta pegar da classe highlight (comum na listagem)
    const sizeBtn = card.querySelector('.tamanhos .opcoes button.selecionado') || card.querySelector('.sizes .size.highlight');
    if (sizeBtn) size = sizeBtn.textContent.trim();
    else {
        // Auto select first
        const first = card.querySelector('.tamanhos .opcoes button') || card.querySelector('.sizes .size');
        if(first) size = first.textContent.trim();
    }
  }
  
  let color = null;
  if (card && card.dataset && card.dataset.selectedColor) {
    color = card.dataset.selectedColor || null;
  } else {
    const colorBtn = card.querySelector('.opcoes-cores button.selecionado');
    if (colorBtn) {
      const classes = Array.from(colorBtn.classList);
      color = classes.find(c => c !== 'cor' && c !== 'selecionado') || colorBtn.getAttribute('aria-label') || null;
    }
  }
  
  let quantity = 1;
  const qtyInput = card.querySelector('input.qty, input.quantity');
  if (qtyInput) quantity = Math.max(1, parseInt(qtyInput.value, 10) || 1);
  return { title, price: priceNum, priceText, img, size, color, quantity };
}

function initAddToCartButtons(scope = document) {
  scope.querySelectorAll(".btn-carrinho, .add, button.add-to-cart").forEach(btn => {
    // Remove listener antigo para evitar duplicação (hack simples)
    const newBtn = btn.cloneNode(true);
    if(btn.parentNode) btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const raw = extractProductFromPage(newBtn);
      
      const item = {
        title: raw.title,
        price: raw.price,
        img: raw.img,
        size: raw.size || null,
        color: raw.color || null,
        quantity: raw.quantity || 1
      };
      addToCart(item);
      showToast(`Adicionado: ${item.title}`);
    });
  });
}

/* ======= RENDERIZA CARRINHO ======= */
function renderCartOnCartPage() {
  const container = document.querySelector(".carrinho");
  if (!container || !window.location.pathname.endsWith("carrinho.html")) return;
  container.innerHTML = "";
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }
  const list = document.createElement("div");
  list.className = "cart-list";
    cart.forEach((item, i) => {
      const itemEl = document.createElement("div");
      itemEl.className = "item";
      itemEl.style.display = "flex";
      itemEl.style.alignItems = "center";
      itemEl.style.justifyContent = "space-between";
      itemEl.style.gap = "12px";
      const itemTotal = (Number(item.price || 0) * Number(item.quantity || 1));
      itemEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;flex:1">
          <img src="${item.img || '../img/exemplo1.png'}" alt="" style="width:60px;height:auto;border-radius:6px;border:1px solid #ddd">
          <div>
            <div style="font-weight:600;text-transform:lowercase">${item.title}</div>
            <div style="color:#666">${item.size ? ('Tam: ' + item.size) : ''} ${item.color ? ('| ' + item.color) : ''}</div>
          </div>
        </div>
        <div style="text-align:right;min-width:220px">
          <div style="font-weight:700;margin-bottom:8px">${formatBRL(itemTotal)}</div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:flex-end">
            <button data-idx="${i}" class="qty-decr" style="width:32px;height:32px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer">-</button>
            <input data-idx="${i}" type="number" class="qty-input" value="${item.quantity || 1}" min="1" style="width:64px;padding:6px;border-radius:6px;border:1px solid #ccc;text-align:center">
            <button data-idx="${i}" class="qty-incr" style="width:32px;height:32px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer">+</button>
            <button data-idx="${i}" class="remove-item" style="margin-left:8px;background:#ddd;border:none;padding:6px;border-radius:6px;cursor:pointer">Remover</button>
          </div>
        </div>
      `;
      list.appendChild(itemEl);
    });
  const subtotal = getCartTotal();
  const footer = document.createElement("div");
  footer.style.marginTop = "16px";
  footer.innerHTML = `
    <div style="text-align:right;font-weight:700">Subtotal: ${formatBRL(subtotal)}</div>
    <div style="text-align:center;margin-top:12px">
      <button id="btn-finalizar-carrinho" class="finalizar">Finalizar Compra</button>
    </div>
  `;
  container.appendChild(list);
  container.appendChild(footer);

  container.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(parseInt(btn.getAttribute("data-idx"), 10));
      renderCartOnCartPage();
    });
  });
  
  // Events delegation could be better, but sticking to existing pattern
  container.querySelectorAll('.qty-incr').forEach(btn => {
    btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const c = getCart(); c[idx].quantity++; saveCart(c); renderCartOnCartPage();
    });
  });
  container.querySelectorAll('.qty-decr').forEach(btn => {
    btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const c = getCart(); 
        if(c[idx].quantity > 1) { c[idx].quantity--; } 
        else { c.splice(idx,1); }
        saveCart(c); renderCartOnCartPage();
    });
  });

  const finalizar = document.getElementById("btn-finalizar-carrinho");
  if (finalizar) finalizar.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

/* ======= RENDERIZA RESUMO EM checkout.html ======= */
function renderSummaryOnCheckoutAndPagamento() {
  const path = window.location.pathname;
  if (!path.endsWith("checkout.html") && !path.endsWith("pagamento.html")) return;
  
  const cart = getCart();
  const listaProdutosEl = document.getElementById('lista-produtos-resumo');
  const valoresEl = document.getElementById('valores-resumo');
  const total = getCartTotal();

  if (listaProdutosEl && valoresEl) {
     listaProdutosEl.innerHTML = "";
     if(cart.length === 0) listaProdutosEl.innerHTML = "<p>Seu carrinho está vazio.</p>";

     cart.forEach(item => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; font-size: 0.9em;";
        const totalItem = (Number(item.price || 0) * Number(item.quantity || 1));
        
        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.img || '../img/exemplo1.png'}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div>
                    <strong>${item.title}</strong><br>
                    <span style="color:#666; font-size:0.85em;">${item.size ? 'Tam: '+item.size : ''} ${item.color ? '| '+item.color : ''}</span><br>
                    <span>Qtd: ${item.quantity}</span>
                </div>
            </div>
            <div>${formatBRL(totalItem)}</div>
        `;
        listaProdutosEl.appendChild(row);
     });

     valoresEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <span>Subtotal</span>
            <span>${formatBRL(total)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:5px; color:#27ae60;">
            <span>Entrega</span>
            <span>A combinar</span>
        </div>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        <div style="display:flex; justify-content:space-between; font-size:1.2em; font-weight:bold;">
            <span>Total</span>
            <span>${formatBRL(total)}</span>
        </div>
     `;
  }
}

/* ======= WHATSAPP ======= */
function initCheckoutForm() {
    const form = document.getElementById("form-cliente");
    if (!form) return;
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const cart = getCart();
        if (cart.length === 0) { alert("Carrinho vazio!"); return; }

        const nome = document.getElementById("nome-checkout")?.value || "";
        const telefone = document.getElementById("telefone-checkout")?.value || "";
        const rua = document.getElementById("rua-checkout")?.value || "";
        const numero = document.getElementById("numero-checkout")?.value || "";
        
        let msg = `*NOVO PEDIDO - DREAMER IMPORTS*\n\n*Cliente:* ${nome}\n*Tel:* ${telefone}\n*Endereço:* ${rua}, ${numero}\n\n*Itens:*\n, *CHAVE PIX: 34998716289\n*`;
        cart.forEach((item, i) => {
            msg += `${i+1}. ${item.title} (${item.size || '-'}) x${item.quantity}\n`;
        });
        msg += `\n*Total: ${formatBRL(getCartTotal())}*`;

        const phone = '5534998716289'; 
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    });
}

/* ======= BUSCA E RENDERIZAÇÃO DE LISTAGEM ======= */
function initSearchBars() {
  // Configura input de busca
  document.querySelectorAll(".search-bar input").forEach(inp => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = inp.value.trim();
        // Redireciona sempre para listagem.html (relativo à pasta atual)
        // Se estiver em html/, vai para listagem.html. Se na raiz, html/listagem.html?
        // Assumindo estrutura html/pages.
        const target = window.location.pathname.includes('/html/') ? "listagem.html" : "html/listagem.html";
        window.location.href = `${target}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
      }
    });
  });

  // Renderiza produtos na listagem.html
  if (window.location.pathname.endsWith("listagem.html")) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || ""; // string vazia = mostrar todos
    renderProductsList(q);
  }
}

function renderProductsList(query) {
  const container = document.querySelector("section.products");
  if (!container) return; // Não estamos na página correta ou estrutura mudou

  container.innerHTML = ""; // Limpa produtos hardcoded

  // Filtra produtos
  const terms = query.toLowerCase().split(" ");
  const filtered = productsDB.filter(p => {
    if (!query) return true; // Mostra tudo se não tiver busca
    const text = (p.title + " " + p.category).toLowerCase();
    return terms.every(term => text.includes(term));
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="width:100%;text-align:center;padding:40px;">Nenhum produto encontrado para "${query}".</p>`;
    return;
  }

  // Gera HTML
  filtered.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";
    
    // Gera HTML dos tamanhos
    let sizesHTML = "";
    if (p.sizes && p.sizes.length) {
      sizesHTML = `<div class="sizes">
        ${p.sizes.map(s => `<div class="size">${s}</div>`).join('')}
      </div>`;
    }

    el.innerHTML = `
      <a href="${p.link}">
        <img src="${p.img}" alt="${p.title}">
      </a>
      <p>${p.title}</p>
      <p class="price">${formatBRL(p.price)}</p>
      ${sizesHTML}
    `;
    container.appendChild(el);
  });

  // Re-atribui eventos (clique em tamanho, etc) aos novos elementos
  setupProductInteractions(container);
}

/* ======= INICIALIZAÇÃO ======= */
function initSiteJS() {
  updateCartBadge();
  initGalleries();
  initAddToCartButtons(); // init inicial
  renderCartOnCartPage();
  renderSummaryOnCheckoutAndPagamento();
  initCheckoutForm();
  initSearchBars();
}

document.addEventListener("DOMContentLoaded", () => {
  initSiteJS();
});
