// ==========================================
// MÚSICA SOMBRIA DO MENU E TEXTOS
// ==========================================
const evilMusic = document.getElementById('evil-music');
if(evilMusic) {
    evilMusic.volume = 0.4;
    evilMusic.play().catch(() => {
        document.addEventListener('click', () => { evilMusic.play().catch(()=>{}); }, { once: true });
    });
}

const introLines = [
    { 
        title: "[ ACESSO CONCEDIDO ]", 
        text: "Bem-vindo ao seu primeiro dia, estagiário de Infraestrutura de TI. Sua função é monitorar a rede, filtrar comunicações e mitigar ameaças cibernéticas em tempo real. A empresa confia em você." 
    },
    { 
        title: "[ DIRETRIZ 01: PHISHING ]", 
        text: "Phishing é a arte da enganação digital. Hackers usam e-mails e domínios falsos para criar pânico e roubar suas senhas e dados. Analise sempre o remetente. Na dúvida, RECUSE." 
    },
    { 
        title: "[ DIRETRIZ 02: SENHAS ]", 
        text: "Senhas curtas são quebradas facilmente. A segurança máxima exige 14 caracteres, contendo letras, números e símbolos. Jamais utilize palavras restritas (confira as regras depois)." 
    },
    { 
        title: "[ DIRETRIZ 03: INVASÃO ]", 
        text: "Ataques diretos ao nosso firewall são frequentes. Se o alerta de segurança soar, acione o VIRUS DEFENDER e neutralize a ameaça cibernética imediatamente." 
    },
    { 
        title: "[ STATUS DO SISTEMA ]", 
        text: "Carregando módulos de segurança... Setor 7 operacional. Boa sorte em seu turno." 
    }
];

// ==========================================
// AÇÃO DO BOTÃO JOGAR (A TRANSIÇÃO)
// ==========================================
document.getElementById('play-btn').addEventListener('click', () => {
    const menuScreen = document.getElementById('menu-screen');
    const terminalScreen = document.getElementById('intro-terminal-screen');
    
    if(evilMusic) evilMusic.pause();
    menuScreen.style.opacity = '0';
    
    setTimeout(() => {
        menuScreen.style.display = 'none';
        terminalScreen.style.display = 'flex'; // Abre a tela toda escura
        playIntroSequence(0); // Começa a digitar
    }, 1000); 
});

function playIntroSequence(step) {
    const textTarget = document.getElementById('typewriter-text');
    
    // VERIFICAÇÃO: Se já passou por todas as linhas da introdução
    if (step >= introLines.length) {
        console.log("Fim da introdução. Redirecionando para o Desktop...");
        
        // Espera 1.5 segundos na tela preta final e pula para o jogo
        setTimeout(() => {
            // O segredo está aqui: saindo da pasta 'menu' (..) e entrando na 'desktop'
            window.location.href = '../desktop/index.html'; 
        }, 1500);
        return;
    }

    // Configura o título e o texto do slide atual
    textTarget.innerHTML = `<span style="color:#fff; text-decoration:underline;">${introLines[step].title}</span><br><br>`;
    let fullText = introLines[step].text;
    let charIndex = 0;

    // Efeito de Digitação
    const typer = setInterval(() => {
        textTarget.innerHTML += fullText[charIndex];
        charIndex++;
        
        // Som de tecladinho (usando seu click-1 que está no HTML do Menu)
        if(charIndex % 2 === 0) {
            const click = document.getElementById('click-1');
            if(click) { click.currentTime = 0; click.volume = 0.2; click.play().catch(()=>{}); }
        }

        if (charIndex >= fullText.length) {
            clearInterval(typer);
            // Tempo para o jogador ler antes de ir para a próxima instrução
            setTimeout(() => playIntroSequence(step + 1), 3500); 
        }
    }, 40);
}

// ==========================================
// MODAIS E DIFICULDADE
// ==========================================
const credModal = document.getElementById('cred-modal');
const diffModal = document.getElementById('diff-modal');

document.getElementById('credits-btn').addEventListener('click', () => credModal.style.display = 'flex');
document.getElementById('difficulty-btn').addEventListener('click', () => diffModal.style.display = 'flex');

function closeModals() {
    const diffInputs = document.querySelectorAll('input[name="diff"]:checked');
    if (diffInputs.length > 0) {
        const selectedDiff = diffInputs[0].value;
        localStorage.setItem('gameDifficulty', selectedDiff);
    }
    credModal.style.display = 'none';
    diffModal.style.display = 'none';
}