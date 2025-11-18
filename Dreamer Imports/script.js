
const promos = [
  "PROMOÇÃO!!!",
  "FRETE GRÁTIS EM TODO O BRASIL!",
  "LEVE 3, PAGUE 2 EM CAMISETAS!",
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
  // Carregar produto se estiver na página de produto
  if (document.querySelector('.produto-container')) {
    carregarProduto();
  }

  // Configurar eventos das miniaturas
  const thumbs = document.querySelectorAll('.galeria .thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelector('.imagem-principal img').src = thumb.src;
    });
  });

  // Seleção de cor e tamanho: listeners diretos por produto
  document.querySelectorAll('.produto-container, .card, .product').forEach(container => {
    // Tamanhos
    const sizeBtns = container.querySelectorAll('.tamanhos .opcoes button');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', function(ev) {
        ev.preventDefault();
        sizeBtns.forEach(b => b.classList.remove('selecionado'));
        btn.classList.add('selecionado');
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
        // nome da cor por classe
        const classes = Array.from(btn.classList);
        const color = classes.find(c => c !== 'cor' && c !== 'selecionado') || btn.getAttribute('aria-label') || '';
        container.dataset.selectedColor = color;
      });
    });
  });

  // Garantir campos de quantidade defaults
  document.querySelectorAll('input.qty, input.quantity').forEach(inp => {
    if (!inp.value) inp.value = 1;
    inp.addEventListener('input', () => {
      if (Number(inp.value) < 1) inp.value = 1;
    });
  });
});


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
  // procura item igual (mesmo título, tamanho e cor) para incrementar quantidade
  const matchIdx = cart.findIndex(it => (
    (it.title || '') === (item.title || '') &&
    (it.size || null) === (item.size || null) &&
    (it.color || null) === (item.color || null)
  ));
  if (matchIdx >= 0) {
    cart[matchIdx].quantity = Number(cart[matchIdx].quantity || 1) + Number(item.quantity || 1);
  } else {
    // garantir campos básicos
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

/* ======= TOAST (pequeno feedback) ======= */
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
    // force reflow then show
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
    // fallback silencioso
    console.warn('Toast error', e);
  }
}

/* ======= BADGE DO CARRINHO ======= */
function updateCartBadge() {
  const cart = getCart();
  // mostrar soma das quantidades no badge
  const count = cart.reduce((s, it) => s + (Number(it.quantity || 1)), 0);
  const cartLink = document.querySelector('.icons a[href="carrinho.html"], .icons a[href="./carrinho.html"]');
  if (!cartLink) return;
  let badge = cartLink.querySelector(".cart-badge");
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-badge";
    badge.style.cssText = "background:#e63946;color:#fff;border-radius:12px;padding:2px 6px;font-size:12px;margin-left:8px";
    cartLink.appendChild(badge);
  }
  badge.textContent = count;
}

/* ======= GALERIA DE PRODUTOS ======= */
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
  // tenta extrair dados do DOM do produto mais próximo
  const card = button.closest(".produto-container") || button.closest(".card") || button.closest(".product") || document.body;
  const title =
    (card.querySelector(".detalhes h2") && card.querySelector(".detalhes h2").textContent.trim()) ||
    (card.querySelector("h4") && card.querySelector("h4").textContent.trim()) ||
    (card.querySelector("h2") && card.querySelector("h2").textContent.trim()) ||
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
  // tenta converter price para número simples
  const priceNum = parseFloat(String(priceText).replace(/[^\d,.-]/g,"").replace(",",".")) || 0;
  // tentar pegar tamanho selecionado
  let size = null;
  if (card && card.dataset && card.dataset.selectedSize) {
    size = card.dataset.selectedSize;
  } else {
    const sizeBtn = card.querySelector('.tamanhos .opcoes button.selecionado');
    if (sizeBtn) size = sizeBtn.textContent.trim();
    else {
      const firstSize = card.querySelector('.tamanhos .opcoes button');
      if (firstSize) size = firstSize.textContent.trim();
    }
  }
  // tentar pegar cor selecionada
  let color = null;
  if (card && card.dataset && card.dataset.selectedColor) {
    color = card.dataset.selectedColor || null;
  } else {
    const colorBtn = card.querySelector('.opcoes-cores button.selecionado');
    if (colorBtn) {
      const classes = Array.from(colorBtn.classList);
      color = classes.find(c => c !== 'cor' && c !== 'selecionado') || colorBtn.getAttribute('aria-label') || null;
    } else {
      const firstColorBtn = card.querySelector('.opcoes-cores button');
      if (firstColorBtn) {
        const classes = Array.from(firstColorBtn.classList);
        color = classes.find(c => c !== 'cor' && c !== 'selecionado') || firstColorBtn.getAttribute('aria-label') || null;
      }
    }
  }
  // quantidade
  let quantity = 1;
  const qtyInput = card.querySelector('input.qty, input.quantity');
  if (qtyInput) quantity = Math.max(1, parseInt(qtyInput.value, 10) || 1);
  return { title, price: priceNum, priceText, img, size, color, quantity };
}

function initAddToCartButtons() {
  // botões com classe .btn-carrinho, .add, .opcao (quando relevante)
  document.querySelectorAll(".btn-carrinho, .add, button.add-to-cart").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      // extrai dados completos incluindo tamanho, cor e quantidade
      const raw = extractProductFromPage(btn);
      const container = btn.closest('.produto-container') || btn.closest('.card') || btn.closest('.product') || document.body;
      // se não houver seleção de tamanho, tenta auto-selecionar o primeiro disponível
      if (!raw.size) {
        const firstSize = container.querySelector('.tamanhos .opcoes button');
        if (firstSize) raw.size = firstSize.textContent.trim();
      }
      // se não houver seleção de cor, tenta auto-selecionar a primeira disponível
      if (!raw.color) {
        const firstColorBtn = container.querySelector('.opcoes-cores button');
        if (firstColorBtn) {
          const classes = Array.from(firstColorBtn.classList);
          raw.color = classes.find(c => c !== 'cor' && c !== 'selecionado') || null;
        }
      }
      const item = {
        title: raw.title,
        price: raw.price,
        img: raw.img,
        size: raw.size || null,
        color: raw.color || null,
        quantity: raw.quantity || 1
      };
      // adiciona ao carrinho e mostra feedback visual (toast)
      addToCart(item);
      showToast(`Adicionado ao carrinho: ${item.title} (x${item.quantity || 1})`);
    });
  });
}

/* ======= RENDERIZA CARRINHO NA PÁGINA carrinho.html ======= */
function renderCartOnCartPage() {
  // detecta página pelo container .carrinho existente ou pathname
  const container = document.querySelector(".carrinho");
  if (!container || !window.location.pathname.endsWith("carrinho.html")) return;
  container.innerHTML = ""; // limpa template
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
            <div style="color:#666">${item.size ? ('Tamanho: ' + item.size) : ''} ${item.color ? ('— Cor: ' + item.color) : ''}</div>
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
      <button id="btn-finalizar-carrinho" style="background:#222;color:#fff;padding:10px 18px;border-radius:8px;border:none;cursor:pointer">Finalizar</button>
    </div>
  `;
  container.appendChild(list);
  container.appendChild(footer);

  container.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      removeFromCart(idx);
      renderCartOnCartPage();
    });
  });
  // controles de quantidade
  container.querySelectorAll('.qty-incr').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const cart = getCart();
      if (cart[idx]) {
        cart[idx].quantity = Number(cart[idx].quantity || 1) + 1;
        saveCart(cart);
        renderCartOnCartPage();
      }
    });
  });
  container.querySelectorAll('.qty-decr').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const cart = getCart();
      if (cart[idx]) {
        const next = Number(cart[idx].quantity || 1) - 1;
        if (next <= 0) {
          removeFromCart(idx);
        } else {
          cart[idx].quantity = next;
          saveCart(cart);
        }
        renderCartOnCartPage();
      }
    });
  });
  container.querySelectorAll('.qty-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const idx = parseInt(inp.getAttribute('data-idx'), 10);
      let v = parseInt(inp.value, 10) || 1;
      if (v < 1) v = 1;
      const cart = getCart();
      if (cart[idx]) {
        cart[idx].quantity = v;
        saveCart(cart);
        renderCartOnCartPage();
      }
    });
  });
  const finalizar = document.getElementById("btn-finalizar-carrinho");
  if (finalizar) finalizar.addEventListener("click", () => {
    // monta ficha do pedido e envia via WhatsApp
    const cart = getCart();
    if (!cart.length) return;
    let msg = "*Pedido - Dreamer Imports*\n";
    cart.forEach((item, i) => {
      const itemTotal = formatBRL(Number(item.price || 0) * Number(item.quantity || 1));
      msg += `${i+1}. ${item.title} ${item.size ? '- Tam: ' + item.size : ''} ${item.color ? '- Cor: ' + item.color : ''} x${item.quantity} - ${itemTotal}\n`;
    });
    msg += `\n*Total:* ${formatBRL(getCartTotal())}`;
    // número com código do país (BR = 55) e DDD 34
    const phone = '5534998716289';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    // abre em nova aba/janela para iniciar conversa no WhatsApp
    try {
      window.open(url, '_blank');
      showToast('Abrindo WhatsApp para finalizar seu pedido...', 3000);
    } catch (e) {
      // fallback: redireciona na mesma janela
      window.location.href = url;
    }
  });
}

/* ======= RENDERIZA RESUMO EM checkout.html / pagamento.html ======= */
function renderSummaryOnCheckoutAndPagamento() {
  const path = window.location.pathname;
  if (!path.endsWith("checkout.html") && !path.endsWith("pagamento.html")) return;
  const cart = getCart();
  const summaryContainers = document.querySelectorAll(".resumo-pedido, .valores, .resumo");
  const total = getCartTotal();
  summaryContainers.forEach(container => {
    // limpa e monta
    container.innerHTML = "";
    cart.forEach(item => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "8px";
      const totalItem = (Number(item.price || 0) * Number(item.quantity || 1));
      row.innerHTML = `<span style="display:flex;gap:8px;align-items:center">
        <img src="${item.img || '../img/exemplo1.png'}" style="width:48px;border-radius:6px">
        <span style="text-transform:lowercase">${item.title} ${item.size ? ('— ' + item.size) : ''} ${item.color ? ('— ' + item.color) : ''} (x${item.quantity || 1})</span>
      </span><strong>${formatBRL(totalItem)}</strong>`;
      container.appendChild(row);
    });
    const hr = document.createElement("hr");
    hr.style.margin = "10px 0";
    container.appendChild(hr);
    const totalEl = document.createElement("h3");
    totalEl.style.display = "flex";
    totalEl.style.justifyContent = "space-between";
    totalEl.innerHTML = `<span>Total</span><span>${formatBRL(total)}</span>`;
    container.appendChild(totalEl);
  });
}

/* ======= BUSCA (redirect to listagem.html?q=...) ======= */
function initSearchBars() {
  document.querySelectorAll(".search-bar input").forEach(inp => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = inp.value.trim();
        const url = "listagem.html" + (q ? `?q=${encodeURIComponent(q)}` : "");
        // como as páginas estão em html/, usamos navegação relativa
        window.location.href = url;
      }
    });
  });
  // se estivermos em listagem.html e existir param q, tentar filtrar (simples)
  if (window.location.pathname.endsWith("listagem.html")) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const products = document.querySelectorAll(".product");
      products.forEach(p => {
        const text = (p.textContent || "").toLowerCase();
        p.style.display = text.includes(q.toLowerCase()) ? "" : "none";
      });
    }
  }
}

/* ======= CADASTRO: validação simples ======= */
function initCadastroValidation() {
  const form = document.querySelector(".form-cadastro");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const pass = form.querySelector('input[type="password"]');
    const passConfirm = Array.from(form.querySelectorAll('input[type="password"]'))[1];
    if (pass && passConfirm && pass.value !== passConfirm.value) {
      alert("As senhas não correspondem.");
      return;
    }
    // opcional: salvar usuário demo
    const email = form.querySelector('input[type="email"]')?.value || "";
    const name = form.querySelector('input[type="text"]')?.value || "";
    localStorage.setItem("dreamer_user", JSON.stringify({ name, email }));
    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
  });
}

/* ======= INICIALIZAÇÃO ======= */
function initSiteJS() {
  updateCartBadge();
  initGalleries();
  initAddToCartButtons();
  renderCartOnCartPage();
  renderSummaryOnCheckoutAndPagamento();
  initSearchBars();
  initCadastroValidation();
}

/* delay small to garantir elementos dinâmicos */
document.addEventListener("DOMContentLoaded", () => {
  initSiteJS();
});