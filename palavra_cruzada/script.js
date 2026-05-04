const wordsDB = [
    {
        word: "RANSOMWARE",
        hints: [
            "Beto (TI): O Setor 3 parou. Os arquivos sumiram e apareceu um aviso pedindo pagamento em Bitcoin.",
            "Helena (Compliance): Isso é um software malicioso que usa criptografia para 'sequestrar' os dados da empresa.",
            "Dica do Sistema: A palavra começa com R e termina com E."
        ]
    },
    {
        word: "PHISHING",
        hints: [
            "Beto (TI): Cuidado com os links falsos dizendo ser do RH. Eles querem roubar suas senhas.",
            "Helena (Compliance): Ato de enganar as pessoas usando e-mails ou sites falsos para obter informações sensíveis.",
            "Dica do Sistema: É uma palavra em inglês que lembra 'pescaria'."
        ]
    },
    {
        word: "SPOOFING",
        hints: [
            "Arthur (CEO): Eu não mandei aquele e-mail pedindo transferência! Alguém forjou meu endereço.",
            "Helena (Compliance): Técnica onde o criminoso falsifica o remetente (e-mail, IP ou número) para parecer alguém confiável.",
            "Dica do Sistema: Tem 8 letras e dois 'O's no meio."
        ]
    },
    {
        word: "KEYLOGGER",
        hints: [
            "Beto (TI): Um dos diretores reclamou de lentidão. Os logs mostram que tudo o que ele digita está sendo enviado para um IP externo.",
            "Helena (Compliance): É um tipo de spyware que registra as teclas pressionadas pelo usuário para roubar credenciais.",
            "Dica do Sistema: Tem 9 letras e termina com GER."
        ]
    },
    {
        word: "TROJAN",
        hints: [
            "Arthur (CEO): Baixei um conversor de PDF gratuito que o Beto não homologou, e agora meu PC está instalando programas sozinho...",
            "Helena (Compliance): Programa malicioso que se disfarça de software legítimo para enganar o usuário e abrir portas no sistema.",
            "Dica do Sistema: O nome é inspirado no famoso 'Cavalo de Troia' grego."
        ]
    },
    {
        word: "BACKDOOR",
        hints: [
            "Beto (TI): Removemos o vírus, mas o invasor continuou acessando o servidor. Ele deixou uma falha proposital no código.",
            "Helena (Compliance): Método não documentado usado para contornar a autenticação normal e acessar um sistema remotamente.",
            "Dica do Sistema: Significa literalmente 'porta dos fundos' em inglês."
        ]
    },
    {
        word: "DDOS",
        hints: [
            "Beto (TI): Nosso site corporativo caiu! O servidor está recebendo milhões de acessos simultâneos de zumbis do mundo todo.",
            "Helena (Compliance): Ataque de Negação de Serviço Distribuído. O objetivo não é roubar dados, mas derrubar o sistema por sobrecarga.",
            "Dica do Sistema: É uma sigla de 4 letras que começa com D e termina com S."
        ]
    },
    {
        word: "FIREWALL",
        hints: [
            "Beto (TI): O ataque parou na nossa barreira de rede. O tráfego suspeito foi bloqueado pelas regras de segurança.",
            "Helena (Compliance): É o nosso 'guarda de segurança' digital. Ele monitora e controla o tráfego de entrada e saída da rede.",
            "Dica do Sistema: Traduzido literalmente do inglês, significa 'parede de fogo'."
        ]
    },
    {
        word: "MALWARE",
        hints: [
            "Beto (TI): O antivírus detectou uma anomalia na máquina da recepção, mas ainda não sei a categoria exata da ameaça.",
            "Helena (Compliance): É o termo genérico para qualquer software intencionalmente feito para causar danos a um computador ou rede.",
            "Dica do Sistema: Começa com MAL e termina com WARE."
        ]
    }
];

let palavrasNaoJogadas = [];    
let tentativasErradas = 0;
const MAX_TENTATIVAS_ANTES_DO_DANO = 2;
let jogoAtivo = false;
let pacotesPendentes = 0;
let currentWordObj;
let currentHintsRevealed = 0;

function initGame() {
    tentativasErradas = 0;
    currentHintsRevealed = 0;
    
    // SE A LISTA DE PALAVRAS ESTIVER VAZIA, ENCHE ELA DE NOVO
    if (palavrasNaoJogadas.length === 0) {
        // Copia todos os itens do wordsDB para a lista de palavras disponíveis
        palavrasNaoJogadas = [...wordsDB];
    }
    
    // Sorteia um ÍNDICE aleatório das palavras que AINDA NÃO FORAM JOGADAS
    const indiceSorteado = Math.floor(Math.random() * palavrasNaoJogadas.length);
    
    // Pega a palavra sorteada
    currentWordObj = palavrasNaoJogadas[indiceSorteado];
    
    // Remove essa palavra da lista para ela não cair de novo nessa sessão
    palavrasNaoJogadas.splice(indiceSorteado, 1);
    
    document.getElementById('hints-list').innerHTML = '';
    document.getElementById('status-message').innerText = "Aguardando inserção de chave...";
    document.getElementById('status-message').style.color = "#aaa";
    document.getElementById('win-screen').style.display = 'none';

    renderGrid(); 
    configurarNavegacaoGrid(); 
    revealFirstHint();
}

// Adicione esta lógica onde você cria os inputs ou logo após o initGame()
function configurarNavegacaoGrid() {
    const inputs = document.querySelectorAll('.word-grid input');

    inputs.forEach((input, index) => {
        // 1. Ao digitar uma letra
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                pularParaProximo(index);
            }
        });

        // 2. Ao apertar Backspace (para apagar e voltar)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '') {
                voltarParaAnterior(index);
            }
        });
    });
}

function pularParaProximo(indexAtual) {
    const inputs = document.querySelectorAll('.word-grid input');
    let proximo = indexAtual + 1;

    // Enquanto o próximo campo for um campo revelado (ajuda), pula ele
    while (proximo < inputs.length && inputs[proximo].classList.contains('revealed')) {
        proximo++;
    }

    if (proximo < inputs.length) {
        inputs[proximo].focus();
    }
}

function voltarParaAnterior(indexAtual) {
    const inputs = document.querySelectorAll('.word-grid input');
    let anterior = indexAtual - 1;

    // Enquanto o anterior for um campo revelado, pula ele voltando
    while (anterior >= 0 && inputs[anterior].classList.contains('revealed')) {
        anterior--;
    }

    if (anterior >= 0) {
        inputs[anterior].focus();
    }
}

function revelarLetraAutomatica() {
    const inputs = document.querySelectorAll('.word-grid input');
    const indicesDisponiveis = [];

    // Localiza quais letras o usuário ainda não acertou/revelou
    inputs.forEach((input, index) => {
        if (input.value.toUpperCase() !== currentWordObj.word[index]) {
            indicesDisponiveis.push(index);
        }
    });

    if (indicesDisponiveis.length > 0) {
        // Sorteia um dos índices que ainda estão errados ou vazios
        const indiceSorteado = indicesDisponiveis[Math.floor(Math.random() * indicesDisponiveis.length)];
        const inputAlvo = inputs[indiceSorteado];

        inputAlvo.value = currentWordObj.word[indiceSorteado];
        inputAlvo.classList.add('revealed'); // Estilo visual de letra ajudada
        inputAlvo.readOnly = true;           // Impede o usuário de apagar a ajuda
        
        // Efeito visual para o jogador notar a letra aparecendo
        inputAlvo.style.backgroundColor = "rgba(83, 157, 252, 0.3)"; 
    }
}

function renderGrid() {
    const grid = document.getElementById('word-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < currentWordObj.word.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.classList.add('letter-box');
        input.dataset.index = i;

        // Toca som ao digitar e move para o próximo quadrado
        input.addEventListener('input', function() {
            playSound('sound-type');
            this.value = this.value.toUpperCase();
            if (this.value && i < currentWordObj.word.length - 1) {
                // Acha o próximo input que não está desabilitado
                let next = grid.querySelector(`input[data-index="${i + 1}"]`);
                if(next) next.focus();
            }
        });

        // Permite apagar e voltar para a caixa anterior com Backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && i > 0) {
                let prev = grid.querySelector(`input[data-index="${i - 1}"]`);
                if(prev && !prev.classList.contains('revealed')) {
                    prev.focus();
                    prev.value = '';
                }
            }
        });

        grid.appendChild(input);
    }
}

function revealFirstHint() {
    requestHint();
}

function requestHint() {
    if (currentHintsRevealed < currentWordObj.hints.length) {
        const ul = document.getElementById('hints-list');
        const li = document.createElement('li');
        li.innerText = currentWordObj.hints[currentHintsRevealed];
        ul.appendChild(li);
        currentHintsRevealed++;
    } else {
        document.getElementById('status-message').innerText = "Você já esgotou todas as dicas interceptadas.";
        document.getElementById('status-message').style.color = "#ff9f43";
    }
}

function revealLetter() {
    const grid = document.getElementById('word-grid');
    const inputs = grid.querySelectorAll('input:not(.revealed)');
    
    if (inputs.length > 0) {
        // Escolhe uma caixa vazia (ou não revelada pelo sistema) aleatória
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        const index = randomInput.dataset.index;
        
        randomInput.value = currentWordObj.word[index];
        randomInput.classList.add('revealed');
        randomInput.readOnly = true;
    }
}

function checkWord() {
    const inputs = document.querySelectorAll('.word-grid input');
    let userWord = "";
    inputs.forEach(input => userWord += input.value.toUpperCase());

    const status = document.getElementById('status-message');

    if (userWord === currentWordObj.word) {
        // --- CASO DE ACERTO ---
        playSound('sound-win');
        status.innerText = "ACESSO CONCEDIDO!";
        status.style.color = "var(--btn-green)";
        document.getElementById('win-screen').style.display = 'flex';
        window.parent.postMessage('decoderWin', '*');
        
    } else {
        // --- CASO DE ERRO ---
        tentativasErradas++;
        playSound('sound-error');
        
        // Revela uma letra para ajudar o jogador
        revelarLetraAutomatica();
        inputs.forEach(input => {
            if (!input.classList.contains('revealed')) {
                input.value = '';
            }
        });

        if (tentativasErradas < MAX_TENTATIVAS_ANTES_DO_DANO) {
            // Ainda tem chances: apenas avisa e ajuda
            status.innerText = `CHAVE INCORRETA. Tentativa ${tentativasErradas}/${MAX_TENTATIVAS_ANTES_DO_DANO}. Uma letra foi revelada!`;
            status.style.color = "#ff9f43"; // Laranja para alerta suave
        } else {
            // Estourou o limite: agora sim toma dano
            status.innerText = "SISTEMA COMPROMETIDO! Dano enviado ao servidor principal.";
            status.style.color = "var(--btn-red)";
            
            // MANDA MENSAGEM PARA O DESKTOP (SÓ AQUI PERDE HP)
            window.parent.postMessage('decoderLose', '*');
            
            // Opcional: resetar tentativas para permitir que ele continue tentando a mesma palavra
            // ou você pode forçar o 'nextWord()' aqui.
            nextWord();
        }
    }
}

function nextWord() {
    // Esconde a tela de vitória
    document.getElementById('win-screen').style.display = 'none';
    
    // O jogador terminou, então o jogo não está mais ativo
    jogoAtivo = false; 

    // Pega os elementos da tela de standby
    const standbyScreen = document.getElementById('standby-screen');
    const standbyText = standbyScreen.querySelector('p');

    // Verifica se acumulou pacotes enquanto ele jogava 
    if (pacotesPendentes > 0) {
        standbyScreen.style.display = 'flex';
        // Muda o texto para avisar que tem fila e cria um botão para iniciar
        standbyText.innerHTML = `Pacotes pendentes na fila: <span style="color: var(--aqua-blue)">${pacotesPendentes}</span><br><br><button class="btn btn-action" onclick="gerenciarFila()" style="margin-top: 15px;">DESCRIPTOGRAFAR PRÓXIMO</button>`;
    } else {
        standbyScreen.style.display = 'flex';
        // Volta para o texto padrão de descanso
        standbyText.innerHTML = `Nenhum pacote de dados interceptado no momento.<br>Aguarde notificações do sistema.`;
    }
}

function playSound(id) {
    const audio = document.getElementById(id);
    if(audio) {
        audio.currentTime = 0;
        audio.play().catch(()=>{});
    }
}

function gerenciarFila() {
    // Se o jogador NÃO estiver jogando e tiver pacote na fila
    if (!jogoAtivo && pacotesPendentes > 0) {
        pacotesPendentes--; // Tira um da fila para jogar agora
        jogoAtivo = true;   // Tranca a porta (inicia o jogo)
        
        document.getElementById('standby-screen').style.display = 'none';
        initGame(); 
    }
}

window.addEventListener('message', function(event) {
    if (event.data === 'iniciarNovoTermo') {
        pacotesPendentes++; // Opa, chegou um pacote novo! Põe na fila.
        gerenciarFila();
    }
});