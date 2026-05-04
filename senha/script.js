// ==========================================
// 1. CARGA DE DADOS E ESTADO INICIAL
// ==========================================
// Embaralha e pega 15 tarefas (munição de sobra pro jogo)
const tarefasAleatorias = allTasksData.sort(() => 0.5 - Math.random()).slice(0, 15);

const tasks = tarefasAleatorias.map(task => ({
    ...task,
    completed: false,
    unlocked: false,
    unread: false,
    erros: 0, 
    messages: []
}));

const FORBIDDEN_WORDS = ["aquaviva", "lotus", "silas", "arthur", "agua", "setor 7"];
let currentTask = null;
let proximoIndiceParaDesbloquear = 0;
let senhaTimer; // Controlador do tempo de novos chamados

// ==========================================
// 2. SISTEMA DE TEMPO E FILA (MÁXIMO 3 ATIVOS)
// ==========================================
window.onload = () => {
    console.log("AquaTeams Online. Aguardando chamados...");
    tentarAgendarChamado(true); // O primeiro chamado chega mais rápido
};

function tentarAgendarChamado(isFirst = false) {
    // Limpa qualquer agendamento anterior para não duplicar
    clearTimeout(senhaTimer);
    
    // Conta quantos chamados estão abertos e NÃO concluídos (ativos na barra lateral)
    let chamadosAtivos = tasks.filter(t => t.unlocked && !t.completed).length;

    // Só agenda se tiver menos de 3 na tela e ainda tiver tarefa na lista
    if (chamadosAtivos < 3 && proximoIndiceParaDesbloquear < tasks.length) {
        // Entre 4 e 10 segundos para o próximo (ou 3s se for o primeiro)
        let tempoDeEspera = isFirst ? 3000 : Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
        
        senhaTimer = setTimeout(() => {
            receberChamado(tasks[proximoIndiceParaDesbloquear].id);
            proximoIndiceParaDesbloquear++;
            
            // Tenta agendar o próximo imediatamente (a função vai travar se chegar em 3 ativos)
            tentarAgendarChamado();
        }, tempoDeEspera);
    }
}

function receberChamado(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.unlocked = true;
    task.unread = true;

    if (task.messages.length === 0) {
        task.messages.push({ sender: 'bot', text: task.prompt });
    }

    playAudio('snd-msg'); 
    
    // Notifica o AquaViva OS para mostrar o popup
    window.parent.postMessage({ 
        tipo: 'novoChamado', 
        nome: task.name 
    }, '*');

    renderContacts();
}

// ==========================================
// 3. INTERFACE (Contatos e Chat)
// ==========================================
function renderContacts() {
    const list = document.getElementById('contact-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        if (!task.unlocked) return;

        const div = document.createElement('div');
        div.className = `contact-item ${currentTask === task.id ? 'active' : ''}`;
        div.onclick = () => openChat(task.id);

        let statusText = task.completed ? (task.erros >= 3 ? 'BLOQUEADO' : 'RESOLVIDO') : 'PENDENTE';
        let badge = (task.unread && !task.completed) ? `<div class="notification-badge">!</div>` : '';
        
        div.innerHTML = `
            <div class="contact-header">
                <span class="contact-name">${task.name}</span>
                ${badge}
            </div>
            <span class="contact-status" style="color: ${task.erros >= 3 ? '#ff4757' : '#aaa'}">${statusText}</span>
        `;
        list.appendChild(div);
    });
}

function openChat(id) {
    currentTask = id;
    const task = tasks.find(t => t.id === id);
    task.unread = false; 
    
    document.getElementById('chat-user-name').innerText = task.name;
    document.getElementById('chat-user-dept').innerText = task.dept;
    
    const input = document.getElementById('password-input');
    const btn = document.getElementById('send-btn');
    
    if (task.completed) {
        input.disabled = true;
        btn.disabled = true;
        input.placeholder = task.erros >= 3 ? "USUÁRIO BLOQUEADO." : "CHAMADO ENCERRADO.";
    } else {
        input.disabled = false;
        btn.disabled = false;
        input.placeholder = "DIGITE A SENHA...";
        input.value = '';
        input.focus();
    }

    renderMessages();
    renderContacts(); 
}

function renderMessages() {
    const history = document.getElementById('chat-history');
    history.innerHTML = '';
    if (currentTask === null) return;

    const task = tasks.find(t => t.id === currentTask);
    task.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.sender === 'bot' ? 'msg-received' : 'msg-sent'}`;
        div.innerText = msg.text;
        
        if (msg.text.includes("BLOQUEADA") || msg.text.includes("[ERRO]")) {
            div.style.color = "#ff4757";
            div.style.borderColor = "#ff4757";
        } else if (msg.text.includes("[SUPORTE EXTRA]")) {
            div.style.color = "#20c1e9";
            div.style.borderColor = "#20c1e9";
        }
        
        history.appendChild(div);
    });
    history.scrollTop = history.scrollHeight;
}

// ==========================================
// 4. VALIDAÇÃO E ENVIO (COM SISTEMA DE HP)
// ==========================================
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function validarSenha(senha, dicaRequerida) {
    if (senha.length < 14) return "A senha deve ter no minimo 14 caracteres.";
    if (!/[A-Z]/.test(senha)) return "A senha precisa de pelo menos uma letra MAIUSCULA.";
    if (!/[a-z]/.test(senha)) return "A senha precisa de pelo menos uma letra MINUSCULA.";
    if (!/[0-9]/.test(senha)) return "A senha precisa de pelo menos um NUMERO.";
    if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(senha)) return "A senha precisa de um CARACTERE ESPECIAL.";
    
    let senhaLimpa = removerAcentos(senha.toLowerCase());
    for (let palavra of FORBIDDEN_WORDS) {
        if (senhaLimpa.includes(palavra)) return `Palavra proibida de seguranca detectada: ${palavra.toUpperCase()}`;
    }
    
    let dicaLimpa = removerAcentos(dicaRequerida.toLowerCase());
    if (!senhaLimpa.includes(dicaLimpa)) return `Voce nao incluiu a minha dica no texto!`;

    return "OK";
}

function enviarSenha() {
    const input = document.getElementById('password-input');
    const senha = input.value.trim();
    if (!senha || currentTask === null) return;

    const task = tasks.find(t => t.id === currentTask);
    task.messages.push({ sender: 'user', text: senha });
    input.value = '';
    renderMessages();

    const resultado = validarSenha(senha, task.dica);

    setTimeout(() => {
        if (resultado === "OK") {
            playAudio('snd-ok');
            task.messages.push({ sender: 'bot', text: "PERFEITO! Senha aprovada. Acesso liberado." });
            task.completed = true;
            openChat(currentTask); 
            
            // AVISA O DESKTOP: PROGRESSO +1
            window.parent.postMessage('senhaWin', '*'); 

            // DESAFOGOU A FILA: Tenta mandar novo chamado
            tentarAgendarChamado();

        } else {
            playAudio('snd-erro');
            task.erros++; 
            
            if (task.erros >= 3) {
                task.messages.push({ sender: 'bot', text: `ERRO DE SEGURANÇA: Limite de 3 tentativas atingido. CONTA BLOQUEADA e incidente reportado ao Dr. Silas.` });
                task.completed = true; 
                openChat(currentTask);
                
                // AVISA O DESKTOP: PERDE VIDA
                window.parent.postMessage('senhaLose', '*'); 

                // DESAFOGOU A FILA (mesmo que com erro): Tenta mandar novo chamado
                tentarAgendarChamado();
            } else {
                task.messages.push({ sender: 'bot', text: `[ERRO]: ${resultado} (Tentativa ${task.erros} de 3.)` });
                
                if (task.erros === 2) {
                    setTimeout(() => {
                        task.messages.push({ 
                            sender: 'bot', 
                            text: `[SUPORTE EXTRA]: Calma, voce so tem mais uma chance! Aqui vai uma dica melhor: ${task.superDica}` 
                        });
                        renderMessages();
                        playAudio('snd-msg'); 
                    }, 800);
                }
                renderMessages();
            }
        }
    }, 600);
}

// ==========================================
// 5. ÁUDIO E EVENTOS
// ==========================================
function playAudio(id) {
    const audio = document.getElementById(id);
    if(audio) { audio.currentTime = 0; audio.play().catch(()=>{}); }
}

document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') enviarSenha();
});