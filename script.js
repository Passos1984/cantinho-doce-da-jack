// ==========================================
// DADOS E CONFIGURAÇÕES GLOBAIS
// ==========================================

// Lista oficial de produtos do Cantinho Doce da Jack
const produtos = [
    // --- SEÇÃO DE AÇAÍ ---
    { id: 1, nome: "Açaí Tradicional", preco: 15.00, categoria: "acai", img: "img/acai.jpg" },
    { id: 2, nome: "Barca de Açaí", preco: 35.00, categoria: "acai", img: "img/barca.jpg" },

    // =========================
    // 🥟 PASTÉIS (ATUALIZADOS)
    // =========================
    { id: 10, nome: "Pastel Carne Ovo", preco: 10.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 11, nome: "Pastel Carne Ovo Azeitona", preco: 10.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 12, nome: "Pastel Frango", preco: 10.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 13, nome: "Pastel Frango Azeitona", preco: 10.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 14, nome: "Pastel Frango com Queijo", preco: 12.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 15, nome: "Pastel Napolitano Tomate,Presunto,Queijo", preco: 12.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 16, nome: "Pastel Mistão", descricao: "Carne,Frango,Ovo,Queijo,Azeitona", preco: 12.00, categoria: "pastel", img: "img/pastel_salgado.png" },
    { id: 17, nome: "Pastel Chocolate", preco: 12.00, categoria: "pastel", img: "img/pastel_doce.jpeg" },
    { id: 18, nome: "Pastel doce de leite com Banana", preco: 12.00, categoria: "pastel", img: "img/pastel_doce.jpeg" },
    { id: 19, nome: "Pastel Morango com Chocolate", preco: 12.00, categoria: "pastel", img: "img/pastel_doce.jpeg" },

    // =========================
    // 🥤 BEBIDAS (ATUALIZADAS)
    // =========================
    { id: 30, nome: "café", preco: 5.00, categoria: "bebida" },
    { id: 31, nome: "Café Especial Capsula", preco: 8.00, categoria: "bebida" },
    { id: 32, nome: "Chocolate Quente Quente 180ML", preco: 8.00, categoria: "bebida" },
    { id: 33, nome: "Água", preco: 3.50, categoria: "bebida" },
    { id: 34, nome: "Refrigerante Lata", preco: 6.00, categoria: "bebida" },
    { id: 35, nome: "Refrigerante 200 ML", preco: 3.50, categoria: "bebida" },
    { id: 36, nome: "Cerveja", preco: 8.00, categoria: "bebida" },
    { id: 37, nome: "Quentão copo 180ML", preco: 7.00, categoria: "bebida" }
];

// Caixas de memória
let carrinho = [];
let valorTotal = 0;

// 🔴 CONTROLE DE DISPONIBILIDADE DO CREPE (ALTERE AQUI)
let crepeDisponivel = false;   // false = indisponível, true = disponível

// Lista de produtos indisponíveis por nome (para outros produtos que usam .btn-adicionar)
const produtosIndisponiveis = [
    // "Crepes"  // removido porque já tratamos separadamente
];

// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================

// Inicializa o estado de disponibilidade (para produtos com botão .btn-adicionar)
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
    
    // 👇 Desabilita visualmente o botão do Crepe (caso ele exista com onclick)
    let botaoCrepe = document.querySelector('button[onclick="abrirModalCrepe()"]');
    if (botaoCrepe && !crepeDisponivel) {
        botaoCrepe.disabled = true;
        botaoCrepe.classList.add('btn-indisponivel');
        botaoCrepe.innerText = 'Indisponível';
        let card = botaoCrepe.closest('.card-produto');
        if (card) card.classList.add('indisponivel');
    }
}

// Chama a inicialização quando a página carrega
window.onload = inicializarDisponibilidade;

// ==========================================
// AUXILIARES DE DISPONIBILIDADE VISUAL
// ==========================================

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

// ==========================================
// VARIÁVEIS E FUNÇÕES DO MODAL DE AÇAÍ
// ==========================================

let produtoSendoMontadoNome = "";
let produtoSendoMontadoPreco = 0;

function adicionarAoCarrinho(nomeProduto, precoProduto) {
    produtoSendoMontadoNome = nomeProduto;
    produtoSendoMontadoPreco = precoProduto;
    document.getElementById("modal-titulo").innerText = "Montando: " + nomeProduto;
    document.getElementById("modal-preco-base").innerText = "Escolha o tamanho";
    document.getElementById("modal-complementos").classList.remove("oculta");
}

function fecharModal() {
    document.getElementById("modal-complementos").classList.add("oculta");
}

function confirmarAcai() {
    let tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
    if (!tamanhoSelecionado) {
        alert("Por favor, escolha um tamanho!");
        return;
    }

    let nomesDosComplementos = [];
    let valorDosComplementos = 0;
    let precoTamanho = parseFloat(tamanhoSelecionado.dataset.preco);
    let limiteGratis = parseInt(tamanhoSelecionado.dataset.max);
    let nomeTamanho = tamanhoSelecionado.value;

    let gratisMarcados = document.querySelectorAll('.add-gratis:checked');
    let countGratis = 0;
    gratisMarcados.forEach(function(item) {
        if (countGratis < limiteGratis || limiteGratis === 0) {
            nomesDosComplementos.push(item.value);
        } else {
            nomesDosComplementos.push(item.value + " (+R$3,00)");
            valorDosComplementos += 3.00;
        }
        countGratis++;
    });

    let pagosMarcados = document.querySelectorAll('.add-pago:checked');
    pagosMarcados.forEach(function(item) {
        nomesDosComplementos.push(item.value);
        valorDosComplementos += parseFloat(item.dataset.preco);
    });

    let precoFinalDoItem = precoTamanho + valorDosComplementos;
    let nomeFinalParaCarrinho = nomeTamanho;
    if (nomesDosComplementos.length > 0) {
        nomeFinalParaCarrinho = nomeFinalParaCarrinho + " (Com: " + nomesDosComplementos.join(", ") + ")";
    }

    carrinho.push({
        nome: nomeFinalParaCarrinho,
        preco: precoFinalDoItem
    });

    valorTotal += precoFinalDoItem;
    atualizarBotaoCarrinho();

    let todosCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    todosCheckboxes.forEach(box => box.checked = false);

    fecharModal();
}

// ==========================================
// FUNÇÕES PARA PASTÉIS, CREPES E BEBIDAS
// ==========================================

// ------------------ PASTÉIS ------------------
function abrirModalPastel() {
    document.getElementById("modal-pastel").classList.remove("oculta");
}

function fecharModalPastel() {
    document.getElementById("modal-pastel").classList.add("oculta");
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
    carrinho.push({ nome: nomePastel, preco: precoPastel });
    valorTotal += precoPastel;
    atualizarBotaoCarrinho();
    fecharModalPastel();
}

// ------------------ CREPES (agora com indisponibilidade) ------------------
function abrirModalCrepe() {
    // 🚫 VERIFICA SE O CREPE ESTÁ DISPONÍVEL
    if (!crepeDisponivel) {
        alert("Desculpe, os crepes estão indisponíveis no momento.");
        return;
    }
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
    carrinho.push({ nome: nomeCrepe, preco: precoCrepe });
    valorTotal += precoCrepe;
    atualizarBotaoCarrinho();
    fecharModalCrepe();
}

// ------------------ BEBIDAS ------------------
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
    carrinho.push({ nome: nomeBebida, preco: precoBebida });
    valorTotal += precoBebida;
    atualizarBotaoCarrinho();
    fecharModalBebidas();
}

// ==========================================
// PRODUTOS DE TAMANHO ÚNICO (CHURROS, BARCA...)
// ==========================================

function adicionarDireto(nomeProduto, precoProduto) {
    carrinho.push({ nome: nomeProduto, preco: precoProduto });
    valorTotal += precoProduto;
    atualizarBotaoCarrinho();
    alert(nomeProduto + " adicionado ao carrinho!");
}

// ==========================================
// COMBO FAMÍLIA
// ==========================================

function abrirModalCombo() {
    document.getElementById("modal-combo").classList.remove("oculta");
}

function fecharModalCombo() {
    document.getElementById("modal-combo").classList.add("oculta");
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

function confirmarCombo() {
    let copo1 = capturarCopoCombo('combo-copo1', 6, 'Copo 1 (550ml)');
    let copo2 = capturarCopoCombo('combo-copo2', 6, 'Copo 2 (550ml)');
    let copo3 = capturarCopoCombo('combo-copo3', 4, 'Copo 3 (330ml)');
    let copo4 = capturarCopoCombo('combo-copo4', 4, 'Copo 4 (330ml)');

    let precoFinal = 65.00 + copo1.valorExtra + copo2.valorExtra + copo3.valorExtra + copo4.valorExtra;
    let descricaoFinal = "Combo Família\n  ↳ " + copo1.desc + "\n  ↳ " + copo2.desc + "\n  ↳ " + copo3.desc + "\n  ↳ " + copo4.desc;

    carrinho.push({ nome: descricaoFinal, preco: precoFinal });
    valorTotal += precoFinal;
    atualizarBotaoCarrinho();

    let todosCheckboxes = document.getElementById('modal-combo').querySelectorAll('input[type="checkbox"]');
    todosCheckboxes.forEach(box => box.checked = false);

    fecharModalCombo();
}

// ==========================================
// CARRINHO E FINALIZAÇÃO
// ==========================================

function atualizarBotaoCarrinho() {
    let botaoElemento = document.getElementById("btn-carrinho");
    let quantidade = carrinho.length;
    let totalFormatado = valorTotal.toFixed(2);
    botaoElemento.innerHTML = `🛒 Ver Carrinho (${quantidade}) - R$ ${totalFormatado}`;
}

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
    valorTotal -= itemRemovido.preco;
    carrinho.splice(index, 1);
    atualizarBotaoCarrinho();
    renderizarCarrinho();
    if (carrinho.length === 0) {
        fecharModalCarrinho();
    }
}

// ✅ FUNÇÃO CORRIGIDA (sem erro de sintaxe)
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione um açaí primeiro.");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    carrinho.forEach(function(item) {
        mensagem += "- " + item.nome + " (R$ " + item.preco.toFixed(2) + ")\n";
    });
    mensagem += "\n*Total do Pedido: R$ " + valorTotal.toFixed(2) + "*";

    let mensagemFormatada = encodeURIComponent(mensagem);
    let telefoneWhatsApp = atob("NTU1MTk4NTg2NjEzMw==");
    let linkWhatsApp = `https://wa.me/${telefoneWhatsApp}?text=${mensagemFormatada}`;
    window.open(linkWhatsApp, "_blank");
}