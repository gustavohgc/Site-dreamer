
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

  // Configurar eventos dos botões de cor
  const botoesCor = document.querySelectorAll('.opcoes-cores button');
  botoesCor.forEach(botao => {
    botao.addEventListener('click', () => {
      botoesCor.forEach(b => b.classList.remove('selecionado'));
      botao.classList.add('selecionado');
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
  cart.push(item);
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
  return cart.reduce((s, it) => s + (parseFloat(String(it.price).replace(/[^\d.,]/g,"").replace(",",".") || 0)), 0);
}
function formatBRL(n) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/* ======= BADGE DO CARRINHO ======= */
function updateCartBadge() {
  const cart = getCart();
  const count = cart.length;
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
  return { title, price: priceNum, priceText, img };
}

function initAddToCartButtons() {
  // botões com classe .btn-carrinho, .add, .opcao (quando relevante)
  document.querySelectorAll(".btn-carrinho, .add, button.add-to-cart").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      const p = extractProductFromPage(btn);
      addToCart({ title: p.title, price: p.price, img: p.img });
      alert("Adicionado ao carrinho: " + p.title);
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
    itemEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;flex:1">
        <img src="${item.img || '../img/exemplo1.png'}" alt="" style="width:60px;height:auto;border-radius:6px;border:1px solid #ddd">
        <div>
          <div style="font-weight:600;text-transform:lowercase">${item.title}</div>
          <div style="color:#666">Quantidade: 1</div>
        </div>
      </div>
      <div style="text-align:right;min-width:140px">
        <div style="font-weight:700">${formatBRL(item.price)}</div>
        <button data-idx="${i}" class="remove-item" style="margin-top:8px;background:#ddd;border:none;padding:6px;border-radius:6px;cursor:pointer">Remover</button>
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
  const finalizar = document.getElementById("btn-finalizar-carrinho");
  if (finalizar) finalizar.addEventListener("click", () => {
    window.location.href = "checkout.html";
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
      row.innerHTML = `<span style="display:flex;gap:8px;align-items:center">
        <img src="${item.img || '../img/exemplo1.png'}" style="width:48px;border-radius:6px">
        <span style="text-transform:lowercase">${item.title}</span>
      </span><strong>${formatBRL(item.price)}</strong>`;
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