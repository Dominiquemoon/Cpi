<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produtos - Ristretto Café Bar</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="/vue-project/src/Style.css">
    <!-- Ícones do Bootstrap para o Modal -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body id="body-produto">

    <!-- Toda a aplicação envelopada em um ÚNICO id="app" -->
    <div id="app">
        
        <header>
            <img id="Logo" src="Imagens\Ristretto_oficial_creme 2.png" alt="Logo Ristretto">  
        </header>

        <nav id="menu">
            <div id="barra"></div>
            <div class="navbar-nav d-flex">
                <a class="nav-link" href="index.html">INÍCIO</a>
                <a class="nav-link" href="orçamento.html">ORÇAMENTO</a>
                <a class="nav-link" href="serviços.html">SERVIÇO</a>
                <a class="nav-link" href="produtos.html">PRODUTOS</a>
                <a class="nav-link" aria-current="page" href="sobre.html">SOBRE</a>
            </div>

            <!-- BOTÃO DO CARRINHO (Esconde se o carrinho estiver vazio utilizando a sua classe CSS) -->
            <div id="btn-carrinho-div" :class="{ 'some-btn': carrinho.length === 0 }">
                <button id="btn-carrinho" type="button" @click="abaCarrinhoAberta = true">
                    <div class="quantidade-cart">{{ totalItens }}</div>
                    <img id="img-cart" src="Imagens/cart.png" alt="Carrinho">
                </button>
            </div>

            <!-- OFF-CANVAS LATERAL DO CARRINHO (Controlado via v-if para evitar congelamentos) -->
            <div class="offcanvas offcanvas-end show" tabindex="-1" v-if="abaCarrinhoAberta" style="visibility: visible; background: #fff;">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title">Carrinho</h5>
                    <button type="button" class="btn-close" @click="abaCarrinhoAberta = false" aria-label="Close"></button>
                </div>
                
                <div class="offcanvas-body">
                    <!-- Lista de Itens Adicionados -->
                    <div class="js-produto-carrinho">
                        <div v-for="item in carrinho" :key="item.produtoNome" class="produto-carrinho-div d-flex align-items-center justify-content-between p-2 mb-2 border-bottom">
                            <div class="produto-imagem">
                                <img :src="buscarProduto(item.produtoNome)?.foto" alt="" style="width: 50px; height: auto;">
                            </div>
                            <div class="produto-detalhes-div flex-grow-1 ms-3">
                                <p class="produto-nome produto-detalhes m-0 fw-bold">{{ item.produtoNome }}</p>
                                <p class="produto-preco produto-detalhes m-0 text-muted">
                                    R$ {{ ((buscarProduto(item.produtoNome)?.precoCentavos || 0) / 100).toFixed(2) }}
                                </p>
                                <p class="produto-quantidade produto-detalhes m-0">Quantidade: {{ item.quantidade }}</p>
                            </div>
                            <div id="btn-fecha-div">
                                <button type="button" class="btn-close" @click="removerDoCarrinho(item.produtoNome)" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rodapé do Carrinho com Totalizador e Finalização -->
                <div id="precototal" class="preco-total p-3 border-top">
                    <div class="txt-preco d-flex justify-content-between align-items-center mb-3">
                        <div class="offcanvas-title fw-bold">Total a pagar:</div>
                        <span class="js-total-carrinho fs-5 fw-bold text-success">
                            R$ {{ (valorTotalCentavos / 100).toFixed(2) }}
                        </span>
                    </div>
                    
                    <div class="text-end">
                        <button 
                            @click="finalizarCompra" 
                            class="btn btn-success btn-lg w-100"
                            :disabled="carregando || carrinho.length === 0"
                        >
                            <span v-if="carregando" class="spinner-border spinner-border-sm" role="status"></span>
                            <span v-else>Finalizar Compra</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- VITRINE DE PRODUTOS -->
        <div id="fundo-produto" class="container mt-5">
            <h2 class="text-center mb-4">Produtos</h2>

            <div class="container" id="lista-produtos">
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    
                    <!-- Loop de renderização dos produtos -->
                    <div v-for="produto in listaProdutos" :key="produto.nome" class="col">
                        <div class="card h-100 p-3 text-center shadow-sm produto-div">
                            <div class="img-produto mb-3">
                                <img :src="produto.foto" class="card-img-top img-fluid" alt="" style="max-height: 150px; object-fit: contain;">
                            </div>
                            <div class="card-body p-0 mb-3">
                                <p class="nome-produto card-title fw-bold m-0">{{ produto.nome }}</p>
                                <p class="preco-produto text-success fw-bold">
                                    R$ {{ (Number(produto.precoCentavos) / 100).toFixed(2) }}
                                </p>
                            </div>
                            <div class="btn-produto">
                                <select class="form-select mb-2" v-model="quantidadesSelecionadas[produto.nome]">
                                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                                </select>
                                <button class="btn btn-primary w-100" @click="addAoCarrinho(produto.nome)">
                                    Adicionar ao carrinho
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- MODAL DE SUCESSO REATIVO (Aparece sem travar o fundo) -->
        <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.6);" v-if="sucesso">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Pedido Concluído!</h5>
                        <button type="button" class="btn-close btn-close-white" @click="sucesso = false"></button>
                    </div>
                    <div class="modal-body text-center p-4">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                        <p class="mt-3 fs-5">{{ mensagemSucesso }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="sucesso = false">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

    </div> <!-- Fim do #app -->

    <footer>
        <img src="Imagens\Ristretto_cafebar_branca 1.png" alt="">
        <div id="redes">
            <a href="https://www.instagram.com/ristrettocafebar/"><img src="Imagens/Instagram.png" alt=""></a>
            <a href="https://www.facebook.com/ristrettocafe1"><img src="Imagens/Facebook.png" alt=""></a>
        </div>
    </footer>
    
    <a id="wtsapp-btn" href="https://wa.me/5555555555555" target="_blank">
        <img id="WAB" src="Imagens\whatsapp1.png" alt="">
    </a>

    <!-- Scripts e dependências obrigatórias -->
    <script src="lista-produtos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

    <!-- Script único e unificado do Vue -->
    <script>
        const { createApp, ref, computed, reactive } = Vue

        createApp({
            setup() {
                // Array reativo que consome os dados do arquivo externo 'lista-produtos.js'
                const listaProdutos = ref(produtos)

                // Estados reativos
                const carrinho = ref([])
                const abaCarrinhoAberta = ref(false)
                const carregando = ref(false)
                const sucesso = ref(false)
                const mensagemSucesso = ref('')

                // Mapeia e isola as quantidades selecionadas de cada produto da vitrine
                const quantidadesSelecionadas = reactive({})
                listaProdutos.value.forEach(p => {
                    quantidadesSelecionadas[p.nome] = 1
                })

                // Métodos de Ação
                function buscarProduto(nome) {
                    return listaProdutos.value.find(p => p.nome === nome)
                }

                function addAoCarrinho(produtoNome) {
                    const qtd = Number(quantidadesSelecionadas[produtoNome] || 1)
                    const itemExistente = refrain = carrinho.value.find(item => item.produtoNome === produtoNome)

                    if (itemExistente) {
                        itemExistente.quantidade += qtd
                    } else {
                        carrinho.value.push({
                            produtoNome: produtoNome,
                            quantidade: qtd
                        })
                    }
                    quantidadesSelecionadas[produtoNome] = 1 // Reseta o seletor para 1
                }

                function removerDoCarrinho(produtoNome) {
                    carrinho.value = carrinho.value.filter(item => item.produtoNome !== produtoNome)
                }

                function finalizarCompra() {
                    carregando.value = true
                    sucesso.value = false

                    // Simulação assíncrona que fecha as abas e limpa os dados ordenadamente
                    setTimeout(() => {
                        carregando.value = false
                        abaCarrinhoAberta.value = false // Fecha o carrinho lateral primeiro
                        carrinho.value = [] // Zera os itens comprados
                        mensagemSucesso.value = "Pedido finalizado com sucesso! Obrigado pela preferência."
                        sucesso.value = true // Dispara a exibição controlada do modal de sucesso
                    }, 1500)
                }

                // Propriedades Computadas para reatividade em tempo real
                const totalItens = computed(() => {
                    return carrinho.value.reduce((acc, item) => acc + item.quantidade, 0)
                })

                const valorTotalCentavos = computed(() => {
                    return carrinho.value.reduce((acc, item) => {
                        const p = buscarProduto(item.produtoNome)
                        return acc + (p ? Number(p.precoCentavos) * item.quantidade : 0)
                    }, 0)
                })

                return {
                    listaProdutos,
                    carrinho,
                    quantidadesSelecionadas,
                    abaCarrinhoAberta,
                    carregando,
                    sucesso,
                    mensagemSucesso,
                    buscarProduto,
                    addAoCarrinho,
                    removerDoCarrinho,
                    finalizarCompra,
                    totalItens,
                    valorTotalCentavos
                }
            }
        }).mount('#app')
    </script>
</body>
</html>