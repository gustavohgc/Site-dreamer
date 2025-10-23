const promos = [
  "PROMOÇÃO!!!",
  "FRETE GRÁTIS EM TODO O BRASIL!",
  "LEVE 3, PAGUE 2 EM CAMISETAS!",
];

const promoText = document.querySelector(".promo-content h2");
const promoDesc = document.querySelector(".promo-content p");
let index = 0;

function showPromo(i) {
  promoText.style.opacity = 0;
  promoDesc.style.opacity = 0;
  setTimeout(() => {
    promoText.textContent = promos[i];
    promoText.style.opacity = 1;
    promoDesc.style.opacity = 1;
  }, 300);
}

document.querySelector(".right").addEventListener("click", () => {
  index = (index + 1) % promos.length;
  showPromo(index);
});

document.querySelector(".left").addEventListener("click", () => {
  index = (index - 1 + promos.length) % promos.length;
  showPromo(index);
});

// Troca automática a cada 4 segundos
setInterval(() => {
  index = (index + 1) % promos.length;
  showPromo(index);
}, 4000);
