// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA DO SISTEMA
// ==========================================
window.onload = () => {
    // 1. Tira a tela de ligar monitor (se existir)
    const powerScreen = document.getElementById('power-screen');
    if (powerScreen) powerScreen.style.display = 'none';

    // 2. Libera os áudios de fundo da mesa
    const office = document.getElementById('bg-office');
    const calm = document.getElementById('bg-calm');
    if (office) { office.volume = 0.4; office.play().catch(() => { }); }
    if (calm) { calm.volume = 0.4; calm.play().catch(() => { }); }

    // 3. Inicia a chuva de e-mails e os vírus
    initMailSystem();
    startVirusGenerator();
    
    if (typeof updateHUD === "function") updateHUD();

    console.log("AquaViva OS Iniciado com sucesso.");
};



// ==========================================
// DADOS DOS E-MAILS
// ==========================================
const allEmails = [
    {
        id: '1',
        from: 'ti-suporte@aquaviva-support.com',
        subject: '[URGENTE] Invasão Detectada - Projeto Lótus',
        isPhishing: true,
        dica: "Domínio falso! O oficial seria @aquaviva.com. Os ativistas estão tentando roubar sua senha gerando pânico.",
        body: "ALERTA CRÍTICO DE SEGURANÇA!\n\nPrezado colaborador,\n\nNossos firewalls detectaram que o grupo terrorista digital 'A Vanguarda' está tentando acessar os relatórios de dosagem do Projeto Lótus no seu terminal.\n\nPara impedir que eles roubem os dados e vazem nossos segredos industriais para a imprensa, valide suas credenciais no servidor de segurança imediatamente para ativarmos a trava de rede:\nhttp://aquaviva-verify.ru/lotus-block\n\nProteja a AquaViva.\nEquipe de Resposta a Incidentes"
    },
    {
        id: '2',
        from: 'rh@aquaviva.rh.com',
        subject: 'Folha de Pagamento e Adicional do Setor 7',
        isPhishing: false,
        dica: "Domínio oficial (@aquaviva.rh.com). Linguagem profissional, sem links suspeitos, revelando detalhes internos da operação maligna.",
        body: "Prezados,\n\nO relatório da folha de pagamento deste mês já está disponível no sistema interno (Portal AquaRH).\n\nGostaria de lembrar que os técnicos do Setor 7 (Área de Tratamento Avançado) estão recebendo o adicional de insalubridade com reajuste de 15%. O Dr. Silas aprovou a mudança devido ao aumento na frequência de manuseio dos barris do 'Composto Lótus'.\n\nQualquer dúvida sobre os valores do adicional de sigilo, venham falar comigo pessoalmente no RH.\n\nAbraços,\nMariana - Recursos Humanos"
    },
    {
        id: '3',
        from: 'financeiro@aquaviva.fin.net',
        subject: 'Comprovante de Restituição de Imposto',
        isPhishing: true,
        dica: "Typosquatting (Erro de digitação proposital). O domínio correto é @aquaviva.fin.com, mas o hacker usou .net para enganar os desatentos.",
        body: "Prezado(a),\n\nInformamos que o sistema contábil identificou um erro no desconto do seu imposto de renda no ano passado. Uma restituição no valor de R$ 3.250,00 foi liberada para a sua conta salário.\n\nPara que a transferência seja efetuada ainda hoje, precisamos que você valide seus dados bancários no portal da ouvidoria financeira:\nhttp://shortlink.xyz/restituicao-imposto\n\nDepartamento Financeiro Corporativo"
    },
    {
        id: '4',
        from: 'marketing@aquaviva.marketing.com',
        subject: 'Nova Campanha Q2: "Água Pura, Mente Calma"',
        isPhishing: false,
        dica: "Domínio oficial e contexto real. A empresa mascara o controle mental como um benefício para a cidade.",
        body: "Oi equipe!\n\nEstamos finalizando a campanha publicitária do segundo trimestre. O Arthur adorou o slogan 'Água AquaViva: Acalmando a sua rotina e a sua cidade'.\n\nAchei brilhante como os índices de estresse e até de criminalidade na cidade caíram desde que começamos a nova filtragem! A nova proposta de outdoors e os roteiros dos comerciais já estão disponíveis na nossa pasta compartilhada do Drive.\n\nPor favor, deem uma olhada e deixem seus comentários na reunião de sexta.\n\nBeijos,\nMariana - Marketing"
    },
    {
        id: '5',
        from: 'juridico@aquaviva.com',
        subject: 'CITAÇÃO JUDICIAL - Denúncia do Lótus',
        isPhishing: true,
        dica: "SPOOFING! O remetente está correto (@aquaviva.com), mas a atitude o entrega: o Jurídico jamais pediria para baixar um arquivo executável (.exe) de um mandado.",
        body: "NOTIFICAÇÃO EXTRAJUDICIAL\n\nInformamos que o Ministério Público Federal acolheu denúncias anônimas sobre os compostos neurológicos adicionados ilegalmente na água da cidade pela AquaViva.\n\nVocê, como funcionário, foi arrolado como testemunha. Ocultar provas o tornará cúmplice dos crimes do Dr. Silas.\n\nBaixe a cópia do mandado e o termo de delação premiada no arquivo anexo. A recusa resultará em sua prisão preventiva junto com a diretoria:\nmandado_pf_lotus.exe\n\nTribunal Regional"
    },
    {
        id: '6',
        from: 'silas@aquavivalabs',
        subject: 'Manutenção SAP e Registros Químicos',
        isPhishing: false,
        dica: "E-mail de rede interna (@aquavivalabs) sem links perigosos. Mostra a arrogância do antagonista da história (Dr. Silas) lidando com o químico.",
        body: "Atenção equipe do turno da noite,\n\nTeremos uma manutenção programada no sistema SAP neste sábado, das 02h às 05h da manhã. O sistema de controle de válvulas ficará offline.\n\nDurante esse período, as válvulas de mistura do Composto Lótus deverão ser operadas MANUALMENTE. Eu não tolerarei erros nas dosagens. Se colocarem menos do que o estipulado, a população vai voltar a reclamar. Se colocarem a mais, podemos ter... efeitos colaterais visíveis.\n\nNão deixem registros no papel durante a manutenção do SAP.\n\nDr. Silas Quaresma\nDiretor de Operações"
    },
    {
        id: '7',
        from: 'CEO@AQUAVIVA-CORPORATE.COM',
        subject: 'URGENTE: Lista de Cortes (Layoffs)',
        isPhishing: true,
        dica: "Domínio errado e tática de intimidação. Os hackers criam pânico na empresa inteira para roubar acessos de quem teme ser demitido.",
        body: "Aviso a todos os colaboradores,\n\nDevido a recentes vazamentos de informações, infelizmente teremos que realizar um corte de 15% do nosso quadro de funcionários até sexta-feira para conter a quebra de sigilo.\n\nO RH já processou as demissões. A lista com os nomes e departamentos afetados vazou e estamos disponibilizando para consulta.\n\nVerifique imediatamente no link abaixo se o seu ID de funcionário está na lista de desligamento:\nhttp://bit.ly/demissoes-aquaviva\n\nArthur Valadares, CEO"
    },
    {
        id: '8',
        from: 'seguranca@aquaviva.com',
        subject: 'Treinamento Obrigatório: Segurança da Informação',
        isPhishing: false,
        dica: "E-mail de segurança oficial (@aquaviva.com). A TI da AquaViva tentando proteger a rede interna contra os ativistas.",
        body: "Fala galera,\n\nInfelizmente, por conta dos ataques constantes desses 'hacktivistas' que se acham heróis, o conselho diretor exigiu que todos refaçam o módulo de Segurança da Informação.\n\nVocês precisam entender que os protocolos químicos da AquaViva são segredos industriais. Um clique errado em um e-mail falso e vocês podem dar acesso total aos nossos reatores para essa escória hacker destruir a empresa.\n\nO treinamento está na Intranet e deve ser feito até sexta-feira. Quem não fizer, vai ter a conta bloqueada na segunda.\n\nBeto\nGerente de TI"
    },
    {
        id: '9',
        from: 'anonimo@avanguarda.net',
        subject: 'FAÇA A COISA CERTA. PARE O LÓTUS.',
        isPhishing: true,
        dica: "Domínio visivelmente externo e ataque social ativista. O hacker pede a sua senha apelando para a sua moralidade. Regra é regra: credencial não se entrega.",
        body: "Nós somos A Vanguarda.\n\nNós sabemos o que a AquaViva está fazendo. Sabemos que o Lótus não purifica a água, ele suprime o sistema nervoso central da população. Arthur e Silas estão envenenando a cidade para mantê-la dócil.\n\nVocê sabe que isso é errado. Você pode nos ajudar a expor a verdade e parar as bombas de mistura do Andar 5.\n\nInsira suas credenciais de forma anônima no nosso portal seguro. Nós faremos o download dos logs e você sairá como herói:\nhttp://bit.ly/vanguarda-lotus-leak\n\nA cidade depende de você."
    },
    {
        id: '10',
        from: 'facilities@aquavivabusiness',
        subject: 'Reforma do Andar 5 - Laboratório Restrito',
        isPhishing: false,
        dica: "Domínio interno válido (@aquavivabusiness). Informação logística real que revela a expansão das operações sombrias.",
        body: "Aviso Geral,\n\nA partir desta quarta-feira, iniciaremos as obras de expansão e isolamento do Andar 5. O acesso às catracas 5A e 5B estará bloqueado para todos os funcionários sem credencial Nível Vermelho.\n\nAs novas centrífugas pesadas do Dr. Silas chegarão na quinta-feira de madrugada, portanto, os elevadores de carga estarão fora de serviço.\n\nPedimos desculpas pelo barulho e lembramos que qualquer tentativa de acesso ao Andar 5 durante a obra resultará em medidas disciplinares severas.\n\nEquipe de Facilities"
    },
    {
        id: '11',
        from: 'ti-alertas@aquavivalabs.com',
        subject: 'WIPER DETECTADO! A Vanguarda está na rede!',
        isPhishing: true,
        dica: "Cuidado com o '.com' a mais! O domínio correto do laboratório é apenas @aquavivalabs. Os hackers adicionaram o '.com' para te enganar e aplicar Scareware.",
        body: "ALERTA VERMELHO!\n\nOs terroristas da Vanguarda acabam de infectar o servidor principal com um malware do tipo Wiper. Eles vão apagar todos os bancos de dados da AquaViva em 10 minutos.\n\nPara blindar o seu terminal e salvar seus arquivos do ataque deles, baixe a ferramenta de vacina da nossa TI agora mesmo e execute como Administrador:\nhttp://tiny.cc/antivirus-aquaclean\n\nIsso não é um teste. Aja rápido ou a empresa acaba hoje."
    },
    {
        id: '12',
        from: 'comunicacao@aquaviva.marketing.com',
        subject: 'Newsletter: Uma Cidade em Paz!',
        isPhishing: false,
        dica: "Informativo padrão da equipe de comunicação (domínio oficial). A história do controle mental escondida nas entrelinhas de um boletim.",
        body: "AquaNews - Edição Mensal 💧\n\nNeste mês, celebramos um marco histórico! O nosso CEO, Arthur Valadares, foi homenageado pela prefeitura. Desde a inauguração dos novos filtros no mês passado, o índice de protestos e confusões na cidade despencou em 45%!\n\nO Prefeito elogiou nossa água dizendo que ela tem trazido uma 'paz atípica e profunda' para a população.\n\nUm agradecimento especial à equipe do Dr. Silas, que tem virado noites no laboratório do Andar 5 garantindo que a água chegue nas casas com a nossa 'receita especial'!\n\nContinuem o excelente trabalho!"
    },
    {
        id: '13',
        from: 'rh@aquaviva.rh.com',
        subject: 'Atualize seus dados - eSocial 2026',
        isPhishing: true,
        dica: "CONTA COMPROMETIDA. O e-mail veio mesmo do RH, mas o link pede o envio de RG e Cartão para um site russo (.ru). Nunca confie cegamente no remetente.",
        body: "Atenção colaborador,\n\nO Governo Federal implementou novas regras no eSocial. Identificamos que a sua ficha cadastral está incompleta no nosso banco de dados.\n\nPara evitar o bloqueio do seu próximo salário e problemas com a Receita Federal, você precisa enviar uma foto frente e verso do seu RG e do seu cartão bancário para comprovação de titularidade.\n\nAcesse a plataforma e envie os arquivos urgentes hoje:\nhttp://dados-rh-aquaviva.ru\n\nAtenciosamente,\nDepartamento Pessoal"
    },
    {
        id: '14',
        from: 'vanguarda@deepweb.net',
        subject: 'O Relógio está correndo, Arthur.',
        isPhishing: true,
        dica: "Ameaça direta de domínio externo (Ransomware moral). Eles querem destruir os servidores da AquaViva se a empresa não parar.",
        body: "Esta mensagem está sendo disparada para toda a caixa de entrada da AquaViva.\n\nNós já quebramos o firewall externo de vocês. Nós temos cópias dos memorandos do Dr. Silas e sabemos que os níveis de apatia na água estão matando as emoções da cidade.\n\nNós inserimos um malware dormente na intranet de vocês. Se a AquaViva não interromper o Projeto Lótus até a meia-noite, nós vamos detonar os servidores e queimar a infraestrutura de vocês até o chão.\n\nFuncionários: fujam enquanto podem. Baixem seus arquivos pessoais e desconectem-se:\nhttp://bit.ly/vanguarda-evacuacao\n\nA justiça chegará."
    },
    {
        id: '15',
        from: 'arthur.valadares@aquaviva.com',
        subject: 'Pedido Pessoal - Suborno na Prefeitura',
        isPhishing: true,
        dica: "SPOOFING do CEO. O remetente é @aquaviva.com, mas o conteúdo é o clássico 'Golpe do Chefe'. Nenhum CEO pede transferências de Bitcoin via e-mail corporativo.",
        body: "Você está na sua mesa?\n\nAqui é o Arthur. Um inspetor da prefeitura descobriu sobre a remessa não declarada de Lótus que chegou na calada da noite e está ameaçando chamar a polícia.\n\nEstou sem meu acesso bancário e o canal de propina oficial está bloqueado pela investigação. Preciso que você envie R$ 5.000 em Bitcoin para a carteira dele agora mesmo para calar a boca do sujeito.\n\nEu reembolso você amanhã com dinheiro em espécie direto no seu cofre.\n[Endereço BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh]\n\nFaça isso e seu emprego estará garantido."
    },
    {
        id: '16',
        from: 'suporte@aquavivalabs',
        subject: 'Auditoria de Senhas - Proteção contra A Vanguarda',
        isPhishing: true,
        dica: "ATAQUE INTERNO. Um infiltrado da Vanguarda usando a rede interna (@aquavivalabs) pede sua senha em texto. A TI real NUNCA pede senha, não importa a desculpa.",
        body: "Olá,\n\nAqui é o Suporte de TI da AquaViva Labs.\n\nComo vocês sabem, estamos sob forte ataque do grupo extremista 'A Vanguarda'. O Dr. Silas exigiu que todos os funcionários auditem suas senhas para ativarmos a criptografia militar na intranet do Andar 5.\n\nPara garantir que o seu perfil não foi comprometido pelos terroristas, responda a este e-mail APENAS com a sua SENHA ATUAL em formato de texto para eu rodar no script de proteção.\n\nSe não responder, presumiremos que você está ajudando os hackers e cortaremos sua rede.\n\nObrigado,\nEquipe de Suporte"
    },
    {
        id: '17',
        from: 'ti-suporte@aquaviva.com',
        subject: 'Chamado #4492 Resolvido - Acesso Remoto VPN',
        isPhishing: false,
        dica: "E-mail transacional de suporte oficial (@aquaviva.com). Mostra que o vilão tem acesso remoto ao sistema de qualquer lugar.",
        body: "Olá Dr. Silas,\n\nO seu chamado #4492 foi marcado como RESOLVIDO.\n\nA configuração da sua VPN foi ajustada. Agora o senhor já consegue acessar o painel de distribuição química e monitorar o comportamento das zonas residenciais de dentro da sua própria casa, sem precisar vir ao laboratório de madrugada.\n\nSe a conexão cair novamente durante o aumento da dosagem noturna, por favor, abra um novo chamado na intranet.\n\nAtenciosamente,\nBeto - TI"
    },
    {
        id: '18',
        from: 'vagas@vagas-aquaviva.net',
        subject: 'Convite do LinkedIn - Vaga Gerencial (R$ 25.000)',
        isPhishing: true,
        dica: "Phishing focado em carreira. Domínio externo mascarado tentando usar a ambição profissional do usuário para conseguir uma porta de entrada.",
        body: "Você apareceu nas nossas buscas de talentos!\n\nUma empresa multinacional concorrente no setor de tratamento de água está buscando profissionais com o seu perfil para ocupar a cadeira de Diretor Regional.\n\nPacote de remuneração: R$ 25.000 + Bônus + Carro da Empresa.\n\nO processo seletivo é confidencial. Para ver a descrição da vaga e enviar o seu currículo de forma segura, acesse o link protegido abaixo fazendo login com as suas credenciais Microsoft atuais:\nhttp://aquaviva-jobs-dark.net/linkedin-login\n\nEquipe de Headhunters"
    },
    {
        id: '19',
        from: 'comunicacao@aquaviva.com',
        subject: 'Happy Hour Mensal e Aviso Importante!',
        isPhishing: false,
        dica: "Domínio oficial de comunicação. Evento interno com a maior evidência da toxicidade da água: nem os funcionários devem beber.",
        body: "Pessoal!\n\nNesta sexta-feira, às 18h, teremos nosso tradicional Happy Hour no terraço do prédio! Teremos pizza por conta da diretoria para celebrar a pacificação da nossa amada cidade!\n\nAVISO DA SEGURANÇA DO TRABALHO: O Dr. Silas e a Helena do Compliance pediram para reforçar que, sob NENHUMA circunstância, os funcionários devem beber a água das torneiras do Andar 5 ou dos bebedouros ligados ao duto principal.\n\nPor favor, consumam EXCLUSIVAMENTE a água engarrafada importada fornecida na copa.\n\nNos vemos na sexta!\nMariana"
    },
    {
        id: '20',
        from: 'seguranca@google-security.ru',
        subject: 'Alerta: A Vanguarda está acessando sua nuvem',
        isPhishing: true,
        dica: "Atenção ao .ru! Os ativistas tentam apavorar o funcionário fingindo ser um alerta de segurança externo do Google.",
        body: "Google Alertas de Segurança\n\nDetectamos um acesso não autorizado à sua conta de nuvem conectada à AquaViva. O endereço de IP está associado ao grupo cibernético 'A Vanguarda'.\n\nEles estão tentando clonar seus arquivos de e-mail e acessar projetos confidenciais.\n\nSe você não iniciou a exportação dos seus dados, bloqueie a invasão imediatamente logando no nosso painel de segurança russo (roteamento protegido contra interceptação):\nhttp://security-lock-google.ru/auth\n\nProteja seus segredos."
    },
    {
        id: '21',
        from: 'compliance@aquavivabusiness',
        subject: 'DÚVIDAS GRAVES - Novo Código de Ética e Lótus',
        isPhishing: false,
        dica: "Domínio interno válido (@aquavivabusiness). A grande revelação final do simulador, que amarra a história de que a empresa é a grande vilã.",
        body: "Arthur e Silas,\n\nEu não consigo mais dormir. Acabei de ler a versão final do nosso Novo Código de Ética para aprovação no Compliance.\n\nComo vocês querem que eu assine um documento que fala em 'transparência com a saúde pública' quando nós temos 40 barris não documentados daquela variante química no Andar 5?\n\nEu vi os relatórios dos hospitais. As pessoas não estão 'em paz', elas estão sendo controladas quimicamente. Se o Ministério Público ou A Vanguarda descobrirem que estamos alterando o livre arbítrio da cidade através do saneamento básico, nós todos seremos presos.\n\nPrecisamos conversar. Hoje.\n\nHelena Rios\nDiretora de Compliance e Ética"
    }
];

// ==========================================
// SORTEIO DE E-MAILS (MANTENDO A ORDEM CRONOLÓGICA)
// ==========================================
let indicesSorteados = [];
while (indicesSorteados.length < 15) {
    let numeroAleatorio = Math.floor(Math.random() * allEmails.length);
    if (!indicesSorteados.includes(numeroAleatorio)) {
        indicesSorteados.push(numeroAleatorio);
    }
}
indicesSorteados.sort((a, b) => a - b);
const randomEmails = indicesSorteados.map(indice => allEmails[indice]);

// ==========================================
// CONTROLE DAS JANELAS DOS APPS
// ==========================================
function openApp() {
    document.getElementById('desktop-view').style.display = 'none';
    document.getElementById('mail-app-view').style.display = 'flex';
}

function closeApp() {
    document.getElementById('mail-app-view').style.display = 'none';
    document.getElementById('desktop-view').style.display = 'flex';
}

function openPassApp() {
    document.getElementById('desktop-view').style.display = 'none';
    document.getElementById('pass-app-view').style.display = 'flex';
}

function closePassApp() {
    document.getElementById('pass-app-view').style.display = 'none';
    document.getElementById('desktop-view').style.display = 'flex';
}

function openVirusApp() {
    document.getElementById('desktop-view').style.display = 'none';
    document.getElementById('virus-app-view').style.display = 'flex';
    updateVirusAppView();
    const calm = document.getElementById('bg-calm');
    if (calm) calm.pause();
}

function closeVirusApp() {
    document.getElementById('virus-app-view').style.display = 'none';
    document.getElementById('desktop-view').style.display = 'flex';
    const calm = document.getElementById('bg-calm');
    if (calm) calm.play().catch(() => { });
}

// ==========================================
// SISTEMA DE E-MAIL (LOGICA DE FILA DE 3)
// ==========================================
let visibleEmails = [];
let currentIndex = 0;
let ok = 0, erro = 0;
let popupTimeout;
let emailTimer;

function render() {
    const list = document.getElementById('list');
    list.innerHTML = visibleEmails.map(e => {
        if (e.respondido) {
            return `
                <div class="email-item" id="item-${e.id}" style="opacity: 0.3; cursor: default;">
                    <div class="item-text" style="color:var(--aqua-blue); margin-bottom:4px; font-weight:bold;">${e.from.split('@')[0]}</div>
                    <div class="item-text">${e.subject}</div>
                </div>
            `;
        } else {
            return `
                <div class="email-item" id="item-${e.id}" onclick="show('${e.id}')">
                    <div class="item-text" style="color:var(--aqua-blue); margin-bottom:4px; font-weight:bold;">${e.from.split('@')[0]}</div>
                    <div class="item-text">${e.subject}</div>
                </div>
            `;
        }
    }).join('');
}

function show(id) {
    document.querySelectorAll('.email-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`item-${id}`).classList.add('active');
    const e = randomEmails.find(x => x.id === id);

    document.getElementById('view').innerHTML = `
        <div class="actions">
            <button class="btn btn-ok" onclick="decide(false, '${e.id}')">APROVAR</button>
            <button class="btn btn-no" onclick="decide(true, '${e.id}')">RECUSAR</button>
        </div>
        <div style="background:white; border:1px solid black; padding:15px; flex:1; display:flex; flex-direction:column; overflow-y:auto;">
            <div style="font-size:16px; font-weight:bold; margin-bottom:8px;">${e.subject}</div>
            <div style="font-size:12px; color:#555;">DE: ${e.from}</div>
            <hr style="border:0.5px solid #ccc; margin:12px 0; width: 100%;">
            <div style="font-size:14px; line-height:1.6; white-space:pre-wrap;">${e.body}</div>
        </div>
    `;
}

function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) { audio.currentTime = 0; audio.play().catch(err => console.log("Áudio bloqueado.", err)); }
}

function triggerNotification() {
    const popup = document.getElementById('notification-popup');
    popup.classList.remove('show');
    setTimeout(() => {
        popup.classList.add('show');
        playSound('sound-notification');
    }, 50);
    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(() => { popup.classList.remove('show'); }, 4000);
}

function initMailSystem() {
    tentarAgendarEmail(true);
}

function tentarAgendarEmail(isFirstEmail = false) {
    clearTimeout(emailTimer);
    let emailsAtivos = visibleEmails.filter(e => !e.respondido).length;

    if (emailsAtivos < 3 && currentIndex < randomEmails.length) {
        let tempoDeEspera = isFirstEmail ? 1000 : Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;

        emailTimer = setTimeout(() => {
            visibleEmails.unshift(randomEmails[currentIndex]);
            currentIndex++;
            render();
            triggerNotification();
            tentarAgendarEmail();
        }, tempoDeEspera);
    }
}

function decide(playerSaysPhishing, id) {
    const e = randomEmails.find(x => x.id === id);
    e.respondido = true;
    const win = (playerSaysPhishing === e.isPhishing);

    if (win) {
        ok++; playSound('sound-correct');
        if (typeof registerSuccess === "function") registerSuccess();
    } else {
        erro++; playSound('sound-error');
        if (typeof registerMistake === "function") registerMistake();
    }

    document.getElementById('modal').style.display = 'flex';
    document.getElementById('m-title').innerText = win ? "✅ CORRETO!" : "❌ ERRO!";
    document.getElementById('m-title').style.color = win ? "var(--btn-green)" : "var(--btn-red)";
    document.getElementById('m-desc').innerHTML = `<strong>ANÁLISE:</strong><br><br>${e.dica}`;
    document.getElementById('score').innerHTML = `SEGURANÇA<br><br><span style="color:green">OK: ${ok}</span><br><span style="color:red">ERRO: ${erro}</span>`;

    document.getElementById(`item-${id}`).style.opacity = "0.3";
    document.getElementById(`item-${id}`).onclick = null;
    document.getElementById('view').innerHTML = '<center><p style="margin-top:20px; color:#888; font-size:14px;">E-mail processado.</p></center>';

    tentarAgendarEmail();
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

// ==========================================
// OUTRAS INTERAÇÕES E NOTAS
// ==========================================
window.addEventListener('mousedown', () => {
    const soundId = Math.random() > 0.5 ? 'click-1' : 'click-2';
    const clickSound = document.getElementById(soundId);
    if (clickSound) { clickSound.currentTime = 0; clickSound.volume = 0.5; clickSound.play().catch(() => { }); }
});

function openNotes() {
    document.getElementById('notes-overlay').style.display = 'flex';

    const clickSound = document.getElementById(Math.random() > 0.5 ? 'click-1' : 'click-2');
    if (clickSound) { clickSound.currentTime = 0; clickSound.volume = 0.5; clickSound.play().catch(() => { }); }
}

function closeNotes() { document.getElementById('notes-overlay').style.display = 'none'; }

// ==========================================
// INTEGRAÇÃO DOS APLICATIVOS E VÍRUS
// ==========================================
let teamsTimeout;
function triggerTeamsNotification(nome) {
    const popup = document.getElementById('teams-notification-global');
    const text = document.getElementById('teams-notif-text');
    text.innerText = `Chamado de: ${nome}`;
    popup.classList.add('show');
    const som = document.getElementById('sound-notification');
    if(som) { som.currentTime = 0; som.play().catch(()=>{}); }
    clearTimeout(teamsTimeout);
    teamsTimeout = setTimeout(() => {
        popup.classList.add('show'); 
        setTimeout(() => popup.classList.remove('show'), 4000);
    }, 100);
}

let crosswordTimeout;

function triggerCrosswordNotification(tema) {
    const popup = document.getElementById('crossword-notification-global');
    const text = document.getElementById('crossword-notif-text');
    
    if (!popup || !text) return; // Segurança caso o elemento sumir

    text.innerText = `${tema}`;
    popup.classList.add('show');

    // Som de notificação padrão do AquaViva
    const som = document.getElementById('sound-notification');
    if(som) { 
        som.currentTime = 0; 
        som.play().catch(()=>{}); 
    }

    // Pegue o ID correto do iframe onde seu Decoder está abrindo no desktop
    const iframeDecoder = document.getElementById('decoder-iframe'); 
    
    if (iframeDecoder && iframeDecoder.contentWindow) {
        // Envia a mensagem para o mini-game liberar uma palavra
        iframeDecoder.contentWindow.postMessage('iniciarNovoTermo', '*');
    }

    // Gerencia o tempo para sumir (4 segundos)
    clearTimeout(crosswordTimeout);
    crosswordTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, 4000);
}

let isVirusAttackActive = false;
let virusAttackTimeout;

function startVirusGenerator() {
    let tempoMin = 40000;
    let tempoMax = 90000;
    let intervalo = Math.floor(Math.random() * (tempoMax - tempoMin + 1)) + tempoMin;
    clearTimeout(virusAttackTimeout);
    virusAttackTimeout = setTimeout(() => { if (!isVirusAttackActive) { triggerVirusAttack(); } }, intervalo);
}

function triggerVirusAttack() {
    isVirusAttackActive = true;
    const somErro = document.getElementById('sound-error');
    if (somErro) { somErro.currentTime = 0; somErro.play().catch(() => { }); }
    const popup = document.getElementById('virus-notification-global');
    if (popup) { popup.classList.add('show'); setTimeout(() => popup.classList.remove('show'), 6000); }
    updateVirusAppView();
}

function updateVirusAppView() {
    const noAttackScreen = document.getElementById('no-attack-screen');
    const gameIframe = document.getElementById('game-iframe');
    if (!noAttackScreen || !gameIframe) return;

    if (isVirusAttackActive) {
        noAttackScreen.style.display = 'none';
        gameIframe.style.display = 'block';
        if (!gameIframe.src || gameIframe.src.includes('about:blank')) {
            gameIframe.src = '../virus_defender/virus_defender.html';
        }
    } else {
        noAttackScreen.style.display = 'flex';
        gameIframe.style.display = 'none';
        gameIframe.src = 'about:blank';
    }
}

// OUVINTE GLOBAL DE MENSAGENS DOS APPS FILHOS
window.addEventListener('message', (event) => {
    if (event.data && event.data.tipo === 'novoChamado') {
        triggerTeamsNotification(event.data.nome);
    }
    if (event.data && event.data.tipo === 'novoCrossword') { 
        triggerCrosswordNotification(event.data.tema); 
    }

    if (event.data === 'fecharJogo') {
        isVirusAttackActive = false;
        closeVirusApp();
        updateVirusAppView();
        startVirusGenerator();
    }

    if (event.data === 'senhaWin' || event.data === 'virusWin' || event.data === 'decoderWin') {
        if (typeof registerSuccess === "function") registerSuccess();
    }

    if (event.data === 'senhaLose' || event.data === 'virusLose' || event.data === 'decoderLose') {
        if (typeof registerMistake === "function") registerMistake();
    }
});

// ==========================================
// FÍSICA DA NAVE (EFEITO DVD BOUNCE)
// ==========================================
let shipX = 10;
let shipY = 10;
let shipVx = 1.5; // Velocidade horizontal (aumente se quiser mais rápido)
let shipVy = 1.5; // Velocidade vertical

function animateDVDShip() {
    const ship = document.querySelector('.flying-ship');
    const container = document.getElementById('no-attack-screen');

    // Se a tela de ataque não estiver visível ou não existir nave, só aguarda o próximo frame
    if (!ship || !container || container.style.display === 'none') {
        requestAnimationFrame(animateDVDShip);
        return;
    }

    // Pega o tamanho exato da tela preta naquele momento
    const containerRect = container.getBoundingClientRect();

    // O limite é o tamanho da tela MENOS o tamanho da nave (64px)
    const maxX = containerRect.width - 64;
    const maxY = containerRect.height - 64;

    // Move a nave
    shipX += shipVx;
    shipY += shipVy;

    // COLISÃO LATERAL: Bateu na direita ou na esquerda? Inverte a velocidade X
    if (shipX >= maxX) {
        shipX = maxX;
        shipVx *= -1;
    } else if (shipX <= 0) {
        shipX = 0;
        shipVx *= -1;
    }

    // COLISÃO VERTICAL: Bateu no teto ou no chão? Inverte a velocidade Y
    if (shipY >= maxY) {
        shipY = maxY;
        shipVy *= -1;
    } else if (shipY <= 0) {
        shipY = 0;
        shipVy *= -1;
    }

    // Calcula o ângulo pra nave sempre apontar o bico pra onde está indo
    let angle = Math.atan2(shipVy, shipVx) * (180 / Math.PI) + 90;

    // Aplica as posições e o giro na tela
    ship.style.left = shipX + 'px';
    ship.style.top = shipY + 'px';
    ship.style.transform = `rotate(${angle}deg)`;

    // Pede ao navegador para calcular o próximo "quadro" do jogo
    requestAnimationFrame(animateDVDShip);
}

// Dá a partida no motor de física assim que o script é lido
requestAnimationFrame(animateDVDShip);

// Adicione junto com as outras funções de abrir app (openApp, openVirusApp...)
function openDecoderApp() {
    document.getElementById('desktop-view').style.display = 'none';
    document.getElementById('decoder-app-view').style.display = 'flex';
}

function closeDecoderApp() {
    document.getElementById('decoder-app-view').style.display = 'none';
    document.getElementById('desktop-view').style.display = 'flex';
}

// No final do script, onde você tem o window.addEventListener('message'...
// Adicione o 'decoderWin' no IF de sucesso:

if (event.data === 'senhaWin' || event.data === 'virusWin' || event.data === 'decoderWin') {
    if (typeof registerSuccess === "function") registerSuccess();
}
if (event.data === 'senhaLose' || event.data === 'virusLose' || event.data === 'decoderLose') {
    if (typeof registerMistake === "function") registerMistake();
}

function triggerMailNotification() {
    const notif = document.getElementById('notification-popup');
    const sound = document.getElementById('sound-notification');

    if (sound) sound.play();
    if (notif) {
        notif.style.display = 'block'; // MOSTRA A CAIXA
        // Esconde depois de 5 segundos
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => { notif.style.display = 'none'; notif.style.opacity = '1'; }, 500);
        }, 4000);
    }
}



// 3. Notificação de Vírus (ALERTA VERMELHO)
function triggerVirusNotification() {
    const notif = document.getElementById('virus-notification-global');
    if (notif) {
        notif.style.display = 'block'; // MOSTRA A CAIXA
        // O alerta de vírus geralmente fica na tela até o jogador abrir o app,
        // mas vamos colocar um tempo para sumir se você preferir:
        setTimeout(() => { notif.style.display = 'none'; }, 8000);
    }
}