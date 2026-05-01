// Lista oficial de produtos do Cantinho Doce da Jack
const produtos = [
    // --- SEÇÃO DE AÇAÍ ---
    { id: 1, nome: "Açaí Tradicional", preco: 15.00, categoria: "acai", img: "img/acai.jpg" },
    { id: 2, nome: "Barca de Açaí", preco: 35.00, categoria: "acai", img: "img/barca.jpg" },

    // --- SEÇÃO DE PASTÉIS ---
    { id: 10, nome: "Pastel de Carne", preco: 10.00, categoria: "pastel", img: "img/pastel-carne.jpg" },
    { id: 11, nome: "Pastel de Queijo", preco: 10.00, categoria: "pastel", img: "img/pastel-queijo.jpg" },
    { id: 12, nome: "Pastel Frango c/ Catupiry", preco: 12.00, categoria: "pastel", img: "img/pastel-frango.jpg" },
    { id: 13, nome: "Pastel de Calabresa", preco: 10.00, categoria: "pastel", img: "img/pastel-calabresa.jpg" },
    { id: 14, nome: "Pastel de Chocolate", preco: 12.00, categoria: "pastel", img: "img/pastel-chocolate.jpg" },
    
    // --- SEÇÃO DE BEBIDAS ---
    { id: 30, nome: "Coca-Cola 350ml", preco: 6.00, categoria: "bebida" },
    { id: 31, nome: "Guaraná 350ml", preco: 6.00, categoria: "bebida" },
    { id: 32, nome: "Suco de Laranja 500ml", preco: 10.00, categoria: "bebida" },
    { id: 33, nome: "Água Mineral 500ml", preco: 4.00, categoria: "bebida" }
];

// 1. Nossas caixas de memória
let carrinho = [];
let valorTotal = 0;

// Lista de produtos indisponíveis (altere aqui para mudar a disponibilidade)
// Use os nomes exatamente como aparecem nos botões
const produtosIndisponiveis = [
    "Crepes"
];

// Inicializa o estado de disponibilidade dos produtos
function inicializarDisponibilidade() {
    produtosIndisponiveis.forEach(nome => {
        let botoes = document.querySelectorAll('.btn-adicionar');
        botoes.forEach(botao => {
            let produtoBtn = botao.getAttribute('data-produto') || botao.innerText;
            if (produtoBtn.includes(nome) || 
                botao.getAttribute('onclick')?.includes(nome)) {
                marcarProdutoIndisponivel(botao);
            }
        });
    });
}

// Chama a inicialização quando a página carrega
window.onload = inicializarDisponibilidade;

// Caixas temporárias para lembrar qual açaí o cliente clicou antes de abrir o Modal
let produtoSendoMontadoNome = "";
let produtoSendoMontadoPreco = 0;

// Função para produtos de tamanho único (Churros, Barca)
function adicionarDireto(nomeProduto, precoProduto) {
    carrinho.push({
        nome: nomeProduto,
        preco: precoProduto
    });

    valorTotal = valorTotal + precoProduto;
    atualizarBotaoCarrinho();
    alert(nomeProduto + " adicionado ao carrinho!");
}

function marcarProdutoIndisponivel(botaoElemento) {
    if (!botaoElemento) return;
    let card = botaoElemento.closest('.card-produto');
    if (!card) return;
    card.classList.add('indisponivel');
    botaoElemento.disabled = true;
    botaoElemento.classList.add('btn-indisponivel');
    botaoElemento.innerText = 'Indisponível';
}

function marcarProdutoDisponivel(botaoElemento, textoOriginal) {
    if (!botaoElemento) return;
    let card = botaoElemento.closest('.card-produto');
    if (!card) return;
    card.classList.remove('indisponivel');
    botaoElemento.disabled = false;
    botaoElemento.classList.remove('btn-indisponivel');
    botaoElemento.innerText = textoOriginal || '+ Adicionar';
}

// 2. Esta função agora não joga no carrinho direto, ela ABRE A JANELA
function adicionarAoCarrinho(nomeProduto, precoProduto) {
    // Guarda o nome e preço do açaí escolhido
    produtoSendoMontadoNome = nomeProduto;
    produtoSendoMontadoPreco = precoProduto;

    // Muda o título e o preço lá dentro da janela do Modal
    document.getElementById("modal-titulo").innerText = "Montando: " + nomeProduto;
    document.getElementById("modal-preco-base").innerText = "Escolha o tamanho";

    // O truque: removemos a classe "oculta" para a janela aparecer na tela!
    document.getElementById("modal-complementos").classList.remove("oculta");
}

// Funções para o Modal de Pastéis
function abrirModalPastel() {
    document.getElementById("modal-pastel").classList.remove("oculta");
}

function fecharModalPastel() {
    document.getElementById("modal-pastel").classList.add("oculta");
    // Limpa seleção
    let pasteis = document.querySelectorAll('input[name="pastel"]');
    pasteis.forEach(p => p.checked = false);
}

function confirmarPastel() {
    let pastelSelecionado = document.querySelector('input[name="pastel"]:checked');
    if (!pastelSelecionado) {
        alert("Por favor, escolha um sabor de pastel!");
        return;
    }

    let nomePastel = pastelSelecionado.value;
    let precoPastel = parseFloat(pastelSelecionado.dataset.preco);

    carrinho.push({
        nome: nomePastel,
        preco: precoPastel
    });

    valorTotal = valorTotal + precoPastel;
    atualizarBotaoCarrinho();
    fecharModalPastel();
}

// Funções para o Modal de Crepes
function abrirModalCrepe() {
    document.getElementById("modal-crepe").classList.remove("oculta");
}

function fecharModalCrepe() {
    document.getElementById("modal-crepe").classList.add("oculta");
    let crepes = document.querySelectorAll('input[name="crepe"]');
    crepes.forEach(p => p.checked = false);
}

function confirmarCrepe() {
    let crepeSelecionado = document.querySelector('input[name="crepe"]:checked');
    if (!crepeSelecionado) {
        alert("Por favor, escolha um crepe!");
        return;
    }

    let nomeCrepe = crepeSelecionado.value;
    let precoCrepe = parseFloat(crepeSelecionado.dataset.preco);

    carrinho.push({
        nome: nomeCrepe,
        preco: precoCrepe
    });

    valorTotal = valorTotal + precoCrepe;
    atualizarBotaoCarrinho();
    fecharModalCrepe();
}

// Funções para o Modal de Bebidas
function abrirModalBebidas() {
    document.getElementById("modal-bebidas").classList.remove("oculta");
}

function fecharModalBebidas() {
    document.getElementById("modal-bebidas").classList.add("oculta");
    let bebidas = document.querySelectorAll('input[name="bebida"]');
    bebidas.forEach(b => b.checked = false);
}

function confirmarBebida() {
    let bebidaSelecionada = document.querySelector('input[name="bebida"]:checked');
    if (!bebidaSelecionada) {
        alert("Por favor, escolha uma bebida!");
        return;
    }

    let nomeBebida = bebidaSelecionada.value;
    let precoBebida = parseFloat(bebidaSelecionada.dataset.preco);

    carrinho.push({
        nome: nomeBebida,
        preco: precoBebida
    });

    valorTotal = valorTotal + precoBebida;
    atualizarBotaoCarrinho();
    fecharModalBebidas();
}

// 3. Função para fechar a janela (chamada no X)
function fecharModal() {
    // Colocamos a classe "oculta" de volta, fazendo a janela sumir
    document.getElementById("modal-complementos").classList.add("oculta");
}

// 4. A Inteligência do botão "Confirmar Adicionais" de dentro da Janela (CORRIGIDO AQUI)
function confirmarAcai() {
    
    // Primeiro, verifica se um tamanho foi selecionado
    let tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
    if (!tamanhoSelecionado) {
        alert("Por favor, escolha um tamanho!");
        return;
    }

    let nomesDosComplementos = [];
    let valorDosComplementos = 0;

    // Pega o preço e limite do tamanho selecionado
    let precoTamanho = parseFloat(tamanhoSelecionado.dataset.preco);
    let limiteGratis = parseInt(tamanhoSelecionado.dataset.max);
    let nomeTamanho = tamanhoSelecionado.value;

    // Procura todos os adicionais GRÁTIS que o cliente marcou
    let gratisMarcados = document.querySelectorAll('.add-gratis:checked');
    let countGratis = 0;
    gratisMarcados.forEach(function(item) {
        if (countGratis < limiteGratis || limiteGratis === 0) {
            // Dentro do limite grátis
            nomesDosComplementos.push(item.value);
        } else {
            // Acima do limite, cobra R$ 3,00 por adicional extra
            nomesDosComplementos.push(item.value + " (+R$3,00)");
            valorDosComplementos += 3.00;
        }
        countGratis++;
    });

    // Procura todos os adicionais PAGOS que o cliente marcou
    let pagosMarcados = document.querySelectorAll('.add-pago:checked');
    pagosMarcados.forEach(function(item) {
        nomesDosComplementos.push(item.value);
        // Pega o preço extra e soma
        valorDosComplementos = valorDosComplementos + parseFloat(item.dataset.preco);
    });

    // Calcula o preço final (Tamanho + Adicionais)
    let precoFinalDoItem = precoTamanho + valorDosComplementos;

    // Monta o nome completão para aparecer no WhatsApp
    let nomeFinalParaCarrinho = nomeTamanho;
    if (nomesDosComplementos.length > 0) {
        // Junta todos os complementos separados por vírgula
        nomeFinalParaCarrinho = nomeFinalParaCarrinho + " (Com: " + nomesDosComplementos.join(", ") + ")";
    }

    // Finalmente, joga o açaí montado na nossa gaveta oficial
    carrinho.push({
        nome: nomeFinalParaCarrinho,
        preco: precoFinalDoItem
    });

    // Soma no dinheiro total do caixa e atualiza o botão verde
    valorTotal = valorTotal + precoFinalDoItem;
    atualizarBotaoCarrinho();

    // Limpa todas as caixinhas marcadas para o próximo cliente/açaí
    let todosCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    todosCheckboxes.forEach(function(box) {
        box.checked = false;
    });

    // Esconde a janela
    fecharModal();
}

// ==========================================
// FUNÇÕES EXCLUSIVAS DO COMBO FAMÍLIA
// ==========================================

function abrirModalCombo() {
    document.getElementById("modal-combo").classList.remove("oculta");
}

function fecharModalCombo() {
    document.getElementById("modal-combo").classList.add("oculta");
}

function confirmarCombo() {
    let copo1 = capturarCopoCombo('combo-copo1', 6, 'Copo 1 (550ml)');
    let copo2 = capturarCopoCombo('combo-copo2', 6, 'Copo 2 (550ml)');
    let copo3 = capturarCopoCombo('combo-copo3', 4, 'Copo 3 (330ml)');
    let copo4 = capturarCopoCombo('combo-copo4', 4, 'Copo 4 (330ml)');

    let precoFinal = 65.00 + copo1.valorExtra + copo2.valorExtra + copo3.valorExtra + copo4.valorExtra;
    
    let descricaoFinal = "Combo Família\n  ↳ " + copo1.desc + "\n  ↳ " + copo2.desc + "\n  ↳ " + copo3.desc + "\n  ↳ " + copo4.desc;

    carrinho.push({
        nome: descricaoFinal,
        preco: precoFinal
    });

    valorTotal += precoFinal;
    atualizarBotaoCarrinho();
    
    let todosCheckboxes = document.getElementById('modal-combo').querySelectorAll('input[type="checkbox"]');
    todosCheckboxes.forEach(box => box.checked = false);

    fecharModalCombo();
}

function capturarCopoCombo(classeCopo, limiteGratis, nomeCopo) {
    let ingredientes = [];
    let valorExtra = 0;
    let countGratis = 0;

    let marcadosGratis = document.querySelectorAll(`.${classeCopo}.add-gratis:checked`);
    marcadosGratis.forEach(function(item) {
        if (countGratis < limiteGratis) {
            ingredientes.push(item.value);
        } else {
            ingredientes.push(item.value + " (+R$3,00)");
            valorExtra += 3.00;
        }
        countGratis++;
    });

    let marcadosPagos = document.querySelectorAll(`.${classeCopo}.add-pago:checked`);
    marcadosPagos.forEach(function(item) {
        ingredientes.push(item.value);
        valorExtra += parseFloat(item.dataset.preco);
    });

    let desc = ingredientes.length > 0 ? `${nomeCopo} com: ${ingredientes.join(', ')}` : `${nomeCopo} (Puro)`;
    
    return { desc: desc, valorExtra: valorExtra };
}

// ==========================================

// 5. A função ajudante que muda o texto do botão verde
function atualizarBotaoCarrinho() {
    let botaoElemento = document.getElementById("btn-carrinho");
    let quantidade = carrinho.length;
    let totalFormatado = valorTotal.toFixed(2);
    botaoElemento.innerHTML = `🛒 Ver Carrinho (${quantidade}) - R$ ${totalFormatado}`;
}

// Funções do Modal do Carrinho
function abrirModalCarrinho() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    renderizarCarrinho();
    document.getElementById("modal-carrinho").classList.remove("oculta");
}

function fecharModalCarrinho() {
    document.getElementById("modal-carrinho").classList.add("oculta");
}

function renderizarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let totalSpan = document.getElementById("total-carrinho");
    
    lista.innerHTML = "";
    
    carrinho.forEach(function(item, index) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "item-carrinho";
        itemDiv.innerHTML = `
            <div class="info-item">
                <span class="nome-item">${item.nome}</span>
                <span class="preco-item">R$ ${item.preco.toFixed(2)}</span>
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho(${index})">🗑️ Remover</button>
        `;
        lista.appendChild(itemDiv);
    });
    
    totalSpan.innerText = valorTotal.toFixed(2).replace(".", ",");
}

function removerDoCarrinho(index) {
    let itemRemovido = carrinho[index];
    valorTotal = valorTotal - itemRemovido.preco;
    carrinho.splice(index, 1);
    atualizarBotaoCarrinho();
    renderizarCarrinho();
    
    if (carrinho.length === 0) {
        fecharModalCarrinho();
    }
}

// 6. A função que empacota tudo e manda pro WhatsApp
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione um açaí primeiro.");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";

    carrinho.forEach(function(item) {
        mensagem = mensagem + "- " + item.nome + " (R$ " + item.preco.toFixed(2) + ")\n";
    });

    mensagem = mensagem + "\n*Total do Pedido: R$ " + valorTotal.toFixed(2) + "*";

    let mensagemFormatada = encodeURIComponent(mensagem);
    
    // 👇 OLHA A MÁGICA AQUI 👇
    // O atob() vai desembaralhar o número apenas quando o cliente clicar no botão
    let telefoneWhatsApp = atob("NTU1MTk4NTg2NjEzMw=="); 

    let linkWhatsApp = `https://wa.me/${telefoneWhatsApp}?text=${mensagemFormatada}`;
    window.open(linkWhatsApp, "_blank");
}