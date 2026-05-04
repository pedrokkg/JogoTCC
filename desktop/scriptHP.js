// ==========================================
// GERENCIADOR DE VIDA E PROGRESSO GERAL
// ==========================================

let systemHP = 100;
let systemProgress = 0;

// O jogador precisa de 15 acertos (5 emails, 5 senhas, 5 vírus)
const maxProgress = 15;
// Se errar 4 vezes (25 de dano cada), a vida zera e é Game Over
const damagePerMistake = 25;

function updateHUD() {
    const hpBar = document.getElementById('hp-bar');
    const progBar = document.getElementById('prog-bar');

    if (!hpBar || !progBar) return;

    // Atualiza o tamanho das barras
    hpBar.style.width = systemHP + '%';
    progBar.style.width = (systemProgress / maxProgress * 100) + '%';

    // Muda a cor da vida se estiver morrendo
    if (systemHP <= 25) {
        hpBar.style.background = '#ff4757'; // Vermelho piscante
    } else if (systemHP <= 50) {
        hpBar.style.background = '#ffa502'; // Laranja
    } else {
        hpBar.style.background = '#00ce64'; // Verde
    }
}

let gatilhoVidaOk = false;
let gatilhoProgressoOk = false;

function verificarGatilhoCrossword() {
    const metadeProgresso = Math.floor(maxProgress / 2);

    // Se atingiu 75 de HP e ainda não disparou o gatilho de vida
    if (systemHP <= 75 && !gatilhoVidaOk) {
        triggerCrosswordNotification("Emergência: Sistema Instável!"); // Uma notificação especial
        startCrosswordGenerator(); // Inicia o loop se ainda não começou
        gatilhoVidaOk = true;
    }

    // SE (independente da vida) chegou na metade do progresso e não disparou esse gatilho
    if (systemProgress >= metadeProgresso && !gatilhoProgressoOk) {
        triggerCrosswordNotification("Desafio de Elite Liberado!"); 
        startCrosswordGenerator(); // Se o loop já iniciou, ele só ignora
        gatilhoProgressoOk = true;
    }
}


function registerSuccess() {
    systemProgress++;
    updateHUD();

    verificarGatilhoCrossword();

    if (systemProgress >= maxProgress) {
        setTimeout(() => {
            document.getElementById('game-win-screen').style.display = 'flex';
        }, 1000);
    }
}

// Configurações do Gerador
function startCrosswordGenerator() {
    // Define um tempo para a PRIMEIRA notificação aparecer (ex: 30 segundos após ligar o PC)
    setTimeout(() => {
        sendAutomaticCrossword();
    }, 5000);
}

function sendAutomaticCrossword() {
    const temas = ["Cibersegurança", "Redes", "Hardware", "Privacidade", "Senhas"];
    const temaSorteado = temas[Math.floor(Math.random() * temas.length)];

    // Chama a função que faz o balãozinho aparecer na tela
    triggerCrosswordNotification(temaSorteado);

    // Programa a PRÓXIMA notificação para daqui a 60 a 90 segundos (aleatório para não ser mecânico)
    const proximoTempo = Math.floor(Math.random() * (90000 - 60000) + 60000);
    setTimeout(sendAutomaticCrossword, proximoTempo);
}


function registerMistake() {    
    systemHP -= damagePerMistake;
    updateHUD();

    verificarGatilhoCrossword();

    // Efeito de tela tremendo
    const monitor = document.getElementById('monitor-screen');
    monitor.style.transform = "translate(5px, 5px)";
    setTimeout(() => monitor.style.transform = "translate(-5px, -5px)", 50);
    setTimeout(() => monitor.style.transform = "translate(5px, -5px)", 100);
    setTimeout(() => monitor.style.transform = "translate(0, 0)", 150);

    if (systemHP <= 0) {
        setTimeout(() => {
            document.getElementById('game-over-screen').style.display = 'flex';
        }, 500);
    }

}

// ==========================================
// INTEGRAÇÃO COM OS MINIGAMES (IFRAMES)
// ==========================================
window.addEventListener('message', function(event) {
    // Se a nave do Virus Defender explodiu
    if (event.data === 'dano_virus') {
        registerMistake(); // Tira 25 de vida e treme a tela
    }
    
    // Se o jogador venceu o Virus Defender (derrotou os 2 bosses)
    if (event.data === 'sucesso_virus') {
        registerSuccess(); // Aumenta a barra de progresso
    }
});