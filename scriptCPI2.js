/* carrinho */
let carrinho = [];

/* O html que vai adicionar a pagina */
let produtosHTML = '';
produtos.forEach((produto)=>{
    produtosHTML += `
        <div class="col produto-div">
                    <div class="img-produto">
                        <img src="${produto.foto}" alt="">
                    </div>
                    <div class="nome-preco-produto">
                        <p class="nome-produto">${produto.nome}</p>
                        <p class="preco-produto">R$${(produto.precoCentavos / 100).toFixed(2)}</p>
                    </div>
                    <div class="btn-produto">
                        <select id="qnt-produto" class="js-quantity-selector-${produto.nome}">
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <button id="add-produto" class="js-add-carrinho" data-produto-nome="${produto.nome}">Adicionar ao carrinho</button>
                    </div>
                </div>
    `;
    
});
/* adiciona o html feito acima */
document.querySelector('.js-produto-grid').innerHTML = produtosHTML;

/* Função para adicionar ao carrinho */
function addAoCarrinho(produtoNome){
    let itemCarrinho;
    carrinho.forEach((item) => {
        if(produtoNome === item.produtoNome)itemCarrinho = item
    });

    const selectQuantidade = document.querySelector(`.js-quantity-selector-${produtoNome}`);
    const numero = Number(selectQuantidade.value);
    if(itemCarrinho){
        itemCarrinho.quantidade += numero;
    }else{
        carrinho.push({
            produtoNome: produtoNome,
            quantidade: numero
        });
    }
}

/* Função para atualizar o numero no carrinho e somar o valor total */
function attCarrinho() {
    let carrinhoQuant = 0;
    let valorTotalCentavos = 0;

    carrinho.forEach((item) => { carrinhoQuant += item.quantidade;

        // Procura o produto original na lista de produtos para pegar o preço correto

        let produtoListado;
        produtos.forEach((produto) => {
            if (produto.nome === item.produtoNome) {
                produtoListado = produto;
            }
        });

        if (produtoListado) {
            valorTotalCentavos += produtoListado.precoCentavos * item.quantidade;
        }
    });

    // Atualiza o valor total no HTML (procure ter um elemento com a classe .js-total-carrinho no seu HTML)
    const elementoTotal = document.querySelector('.js-total-carrinho');
    if (elementoTotal) {
        elementoTotal.innerHTML = `R$ ${(valorTotalCentavos / 100).toFixed(2)}`;
    }

    const btnCart = document.getElementById("btn-carrinho-div");
    if(carrinho.length > 0){
        document.querySelector('.quantidade-cart').innerHTML = carrinhoQuant;
        btnCart.classList.remove("some-btn");
    } else {
        // Se o carrinho estiver vazio, zera o contador e esconde o botão
        document.querySelector('.quantidade-cart').innerHTML = 0;
        if (btnCart) {
            btnCart.classList.add("some-btn");
        }
    }

    porNoCarrinho();
    console.log(carrinho);
}

/* o HTML q vai adicionar no carrinho */
function porNoCarrinho(){   
    let itemDentroCarrinhoHTML = '';
    carrinho.forEach((itemDoCarrinho) => {
        let produtoListado;
        produtos.forEach((produto) =>{
            if(produto.nome === itemDoCarrinho.produtoNome){produtoListado = produto;}
        });
        if(!produtoListado) return;

        itemDentroCarrinhoHTML += `
            <div class="produto-carrinho-div js-produto-carrinho-${produtoListado.nome}">
                <div class="produto-imagem">
                    <img src="${produtoListado.foto}" alt=""></img>
                </div>
                <div class="produto-detalhes-div">
                    <p class="produto-nome produto-detalhes">${produtoListado.nome}</p>
                    <p class="produto-preco produto-detalhes">R$${(produtoListado.precoCentavos / 100).toFixed(2)}</p>
                    <p class="produto-quantidade produto-detalhes">Quantidade: ${itemDoCarrinho.quantidade}</p>
                </div>
                <div id="btn-fecha-div">
                    <button id="btn-carrinho-fecha" type="button" class="btn-close js-btn-fecha" data-produto-nome="${produtoListado.nome}" aria-label="Close"></button>
                </div>
            </div>
        `;
    });
    document.querySelector('.js-produto-carrinho').innerHTML = itemDentroCarrinhoHTML;

    document.querySelectorAll('.js-btn-fecha').forEach((button) => {
        button.addEventListener('click', () => {
            const btnProduto = button.dataset.produtoNome;
            removerDoCarrinho(btnProduto);
            attCarrinho();
        });
    });
}

document.querySelectorAll('.js-add-carrinho').forEach((button) => {
    button.addEventListener('click', () => {
        const produtoNome = button.dataset.produtoNome;
        addAoCarrinho(produtoNome);
        attCarrinho();
        console.log(carrinho);
    });




});


/* Remover do carrinho */
function removerDoCarrinho(btnProduto) {
    carrinho = carrinho.filter((item) => item.produtoNome !== btnProduto);
}
document.querySelector('.js-btn-finalizar').addEventListener('click', () => {
    if (carrinho.length > 0) {
        alert('Compra realizada com sucesso! Obrigado.');
        // Aqui você pode limpar o carrinho ou redirecionar o usuário
        carrinho = [];
       
    }
// Inicializa a página
function finalizarCompra() { // <-- Precisa ter o mesmo nome exato
    carregando.value = true;
    sucesso.value = true;
    mensagemSucesso.value = "Seu pedido foi processado com sucesso!";
}
// ...
return {
    carregando,
    sucesso,
    mensagemSucesso,
    finalizarCompra // <-- Não esqueça de retornar a função aqui!
}
// Inicializa o carrinho na página
attCarrinho();
console.log(carrinho);

});

