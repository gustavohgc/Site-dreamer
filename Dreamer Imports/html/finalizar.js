// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona as áreas onde o JS vai trabalhar
    const listaProdutosResumo = document.getElementById('lista-produtos-resumo');
    const valoresResumo = document.getElementById('valores-resumo');
    const formCliente = document.getElementById('form-cliente');
    
    // Verifica se os elementos essenciais existem
    if (!listaProdutosResumo || !valoresResumo || !formCliente) {
        console.error('ERRO: Elementos essenciais do checkout (resumo ou formulário) não foram encontrados no HTML.');
        return; // Para a execução se o HTML estiver quebrado
    }

    /**
     * Carrega os itens do localStorage e os renderiza no "Resumo do Pedido".
     */
    function renderizarResumo() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Limpa o conteúdo anterior
        listaProdutosResumo.innerHTML = ''; 
        
        if (carrinho.length === 0) {
            listaProdutosResumo.innerHTML = '<p>Seu carrinho está vazio.</p>';
            // Desativa o formulário se o carrinho estiver vazio
            formCliente.style.opacity = '0.5';
            formCliente.querySelector('button').disabled = true;
            valoresResumo.innerHTML = `
                <p>Subtotal <span>R$ 0,00</span></p>
                <hr>
                <h3>Total <span>R$ 0,00</span></h3>
            `;
            return;
        } else {
            // Ativa o formulário
            formCliente.style.opacity = '1';
            formCliente.querySelector('button').disabled = false;
        }

        let totalGeral = 0;
        
        // Cria um elemento HTML para cada produto
        carrinho.forEach(item => {
            // Garante que os dados são números
            const preco = parseFloat(item.preco) || 0;
            const quantidade = parseInt(item.quantidade) || 0;
            
            const totalItem = preco * quantidade;
            totalGeral += totalItem;

            const divProduto = document.createElement('div');
            divProduto.classList.add('produto'); // Usa a classe do seu HTML
            
            divProduto.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}" class="produto-img">
                <div class="produto-info">
                  <p>${item.nome} (${item.tamanho} / ${item.cor})</p>
                  <p>x ${quantidade}</p>
                </div>
                <p class="produto-preco">R$ ${totalItem.toFixed(2).replace('.', ',')}</p>
            `;
            // Adiciona o produto na lista
            listaProdutosResumo.appendChild(divProduto);
        });

        // Atualiza os valores de Subtotal e Total
        valoresResumo.innerHTML = `
            <p>Subtotal <span>R$ ${totalGeral.toFixed(2).replace('.', ',')}</span></p>
            <!-- <p> Cupom de desconto <strong>DREAMER (10%)</strong></p> -->
            <hr>
            <h3>Total <span>R$ ${totalGeral.toFixed(2).replace('.', ',')}</span></h3>
        `;
    }

    /**
     * Função principal: Finalizar Compra (Adaptada do seu script)
     */
    function finalizarCompra(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }

        // 1. Coleta os dados do cliente do NOVO formulário
        const nome = document.getElementById('nome-checkout').value.trim();
        const sobrenome = document.getElementById('sobrenome-checkout').value.trim();
        const telefone = document.getElementById('telefone-checkout').value.trim();
        
        const rua = document.getElementById('rua-checkout').value.trim();
        const numero = document.getElementById('numero-checkout').value.trim();
        const bairro = document.getElementById('bairro-checkout').value.trim();
        const complemento = document.getElementById('complemento-checkout').value.trim();

        // Combina o nome e o endereço
        const nomeCliente = `${nome} ${sobrenome}`;
        let enderecoCliente = `Rua ${rua}, Nº ${numero}, Bairro ${bairro}`;
        if (complemento) {
            enderecoCliente += ` (${complemento})`;
        }

        if (!nome || !telefone || !rua || !numero || !bairro) {
             alert('Por favor, preencha todos os dados obrigatórios (Nome, Telefone, Rua, Número e Bairro).');
             return;
        }

        // 2. Formata a lista de produtos 
        let mensagemItens = "--- Pedido ---\n";
        let total = 0;

        carrinho.forEach((item, index) => {
            const preco = parseFloat(item.preco) || 0;
            const quantidade = parseInt(item.quantidade) || 0;
            const subtotal = preco * quantidade;
            total += subtotal;

            mensagemItens += `*${index + 1}. ${item.nome.toUpperCase()}*\n`;
            mensagemItens += `   - Qtd: ${quantidade}\n`;
            mensagemItens += `   - Tam: ${item.tamanho}\n`;
            mensagemItens += `   - Cor: ${item.cor}\n`;
            mensagemItens += `   - Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        });

        const totalFormatado = total.toFixed(2).replace('.', ',');

        // 3. Monta a mensagem completa 
        let mensagemCompleta = 
            "Olá! Gostaria de fazer o pedido abaixo:\n\n" +
            "==========================\n" +
            mensagemItens +
            "==========================\n" +
            `*TOTAL DA COMPRA: R$ ${totalFormatado}*\n\n` +
            "--- Dados do Cliente ---\n" +
            `*Nome:* ${nomeCliente}\n` +
            `*Endereço:* ${enderecoCliente}\n` + 
            `*WhatsApp do Cliente:* ${telefone}\n` +
            "\nPor favor, confirme a disponibilidade e o valor do frete. Obrigado(a)!";

        // 4. Codifica e Redireciona 
        const mensagemCodificada = encodeURIComponent(mensagemCompleta);
        const urlBaseWhatsapp = 'https://wa.me/5538998747040'; // SEU NÚMERO
        const linkWhatsApp = `${urlBaseWhatsapp}?text=${mensagemCodificada}`;

        window.location.href = linkWhatsApp; 
        
        // Opcional: Limpar o carrinho
        // Recomendo limpar só *depois* que o pagamento for confirmado
        // setTimeout(() => {
        //     localStorage.removeItem('carrinho');
        //     renderizarResumo();
        // }, 3000); // 3 segundos de espera
    }

    // --- INICIALIZAÇÃO ---

    // Associa a função de finalizar ao evento SUBMIT do formulário
    formCliente.addEventListener('submit', finalizarCompra);
    
    // Inicia a renderização do resumo do pedido
    renderizarResumo();
});