const allTasksData = [
    { 
        id: 1, name: "Beto (TI)", dept: "Suporte", 
        prompt: "Fala suporte! Preciso de uma senha. Bota o nome daquela tecnologia que da internet sem fio pra gente pelo ar.", 
        dica: "wifi", 
        superDica: "Sabe o roteador da sua casa? Ele distribui o sinal W_ _ _." 
    },
    { 
        id: 2, name: "Mariana (RH)", dept: "RH", 
        prompt: "Oii! Pode gerar minha senha? Bota o nome daquele lixo eletronico chato que lota a nossa caixa de e-mail toda semana.", 
        dica: "spam", 
        superDica: "Sao aquelas mensagens de propaganda chatas que comecam com S e terminam com M." 
    },
    { 
        id: 3, name: "Dr. Silas", dept: "Diretoria", 
        prompt: "Gere minha credencial. Exijo que a senha contenha o nome do tipo de programa que usamos para proteger o PC contra ameacas virtuais.", 
        dica: "antivirus", 
        superDica: "E o software que 'vacina' o computador. Anti-V_ _ _ _." 
    },
    { 
        id: 4, name: "Arthur (CEO)", dept: "CEO", 
        prompt: "Preciso de uma senha forte. Coloque o nome daquele 'lugar invisivel' na internet onde a gente salva nossos arquivos para nao perder.", 
        dica: "nuvem", 
        superDica: "Em ingles chamam de 'Cloud'. Fica la no ceu, e a N_ _ _ _." 
    },
    { 
        id: 5, name: "Cadu (Estagiario)", dept: "Dev", 
        prompt: "Mano, bota o nome da abreviacao que a gente usa pra 'Aplicativo' de celular na minha senha? Aquela de 3 letras.", 
        dica: "app", 
        superDica: "E o que voce baixa na Play Store ou App Store. Sao apenas 3 letras: A_ _." 
    },
    { 
        id: 6, name: "Helena (Juridico)", dept: "Compliance", 
        prompt: "Seguranca em primeiro lugar. Qual o nome da copia de seguranca que fazemos dos arquivos caso o PC quebre?", 
        dica: "backup", 
        superDica: "Se o sistema cair, a gente restaura o B_ _ _ _ _." 
    },
    { 
        id: 7, name: "Ricardo (Vendas)", dept: "Comercial", 
        prompt: "Cara, coloca na senha a tecnologia do fone sem fio... aquele negocio que tem o dente azul logo no nome, sabe?", 
        dica: "bluetooth", 
        superDica: "Traduzindo do ingles: Azul = Blue, Dente = Tooth. B_ _ _ _ _ _ _ _." 
    },
    { 
        id: 8, name: "Paula (Marketing)", dept: "Comunicacao", 
        prompt: "Coloca aquele simbolo legal que a gente usa no Instagram antes das palavras pra elas virarem link? O jogo da velha!", 
        dica: "hashtag", 
        superDica: "E o famoso #. Comeca com H e termina com G." 
    },
    { 
        id: 9, name: "Enzo (Suporte)", dept: "TI", 
        prompt: "Aquele erro chato que faz o jogo ou programa travar do nada... comeca com B. Bota na senha pra mim!", 
        dica: "bug", 
        superDica: "E o nome de 'inseto' em ingles. B_ _." 
    },
    { 
        id: 10, name: "Dr. Silas", dept: "Laboratorio", 
        prompt: "Como chamamos o golpe onde os hackers fingem ser um banco por email para pescar os nossos dados?", 
        dica: "phishing", 
        superDica: "Parece a palavra 'pescaria' em ingles, mas com PH no comeco. P_ _ _ _ _ _ _." 
    },
    { 
        id: 11, name: "Beto (TI)", dept: "Redes", 
        prompt: "O periferico cheio de letras e numeros que a gente usa pra digitar as coisas no computador. Qual e o nome?", 
        dica: "teclado", 
        superDica: "E onde voce aperta as teclas para escrever. T_ _ _ _ _ _." 
    },
    { 
        id: 12, name: "Luciana (Financeiro)", dept: "Contabilidade", 
        prompt: "Onde a gente digita o nome do site la em cima no navegador? A sigla de 3 letras (U-R...).", 
        dica: "url", 
        superDica: "E o link do site. Sao 3 letras: U_ _." 
    },
    { 
        id: 13, name: "Marcos (Patrimonial)", dept: "Seguranca", 
        prompt: "Aquele pendrive minusculo ou cabo que a gente espeta no computador... qual o nome dessa entrada?", 
        dica: "usb", 
        superDica: "Universal Serial Bus. Sao 3 letras: U_ _." 
    },
    { 
        id: 14, name: "Julia (Design)", dept: "Criativo", 
        prompt: "Bota o nome generico daquelas carinhas amarelas que a gente manda no WhatsApp o tempo todo!", 
        dica: "emoji", 
        superDica: "A carinha de risada ou de choro e um E_ _ _ _." 
    },
    { 
        id: 15, name: "Dr. Silas", dept: "Diretoria", 
        prompt: "Qual e o botao do teclado que usamos para confirmar uma acao ou pular de linha? Adicione na senha.", 
        dica: "enter", 
        superDica: "Fica no canto direito do teclado, a tecla E_ _ _ _." 
    },
    { 
        id: 16, name: "Tati (Logistica)", dept: "Expedicao", 
        prompt: "Qual a palavra em ingles que usamos quando queremos baixar um arquivo da internet pro nosso PC?", 
        dica: "download", 
        superDica: "O oposto de Upload. Comeca com D e termina com D." 
    },
    { 
        id: 17, name: "Beto (TI)", dept: "Suporte", 
        prompt: "O nome da maior rede de pesquisas da internet. Aquela do G colorido que a gente usa pra achar qualquer coisa.", 
        dica: "google", 
        superDica: "Dica: 'Dá um G_ _ _ _ _ ai'. Seis letras." 
    },
    { 
        id: 18, name: "Mariana (RH)", dept: "RH", 
        prompt: "Quando o Windows pede pra instalar coisas novas e reiniciar, ele diz que vai... o que? Comeca com A.", 
        dica: "atualizar", 
        superDica: "Deixar o sistema na versao mais nova. A_ _ _ _ _ _ _ _." 
    },
    { 
        id: 19, name: "Cadu (Estagiario)", dept: "Dev", 
        prompt: "Aquele cara de capuz que invade computadores nos filmes, qual e o nome em ingles?", 
        dica: "hacker", 
        superDica: "Aquele que faz o 'hack'. H_ _ _ _ _." 
    },
    { 
        id: 20, name: "Vanguarda", dept: "Desconhecido", 
        prompt: "Nos somos a rede. Coloque as 3 letras W que representam a rede mundial de computadores.", 
        dica: "www", 
        superDica: "World Wide Web. Sao 3 letras iguais: _ _ _." 
    },
    { 
        id: 21, name: "Paula (Marketing)", dept: "Marketing", 
        prompt: "Aquele botao do teclado que a gente aperta para apagar as coisas que digitamos errado.", 
        dica: "delete", 
        superDica: "Ao lado do 'End' e 'Insert'. D_ _ _ _ _." 
    },
    { 
        id: 22, name: "Helena (Juridico)", dept: "Juridico", 
        prompt: "A tela inicial dos sistemas onde voce coloca seu nome de usuario e sua senha. Qual o nome desse processo?", 
        dica: "login", 
        superDica: "Entrar na conta. L_ _ _ _." 
    },
    { 
        id: 23, name: "Arthur (CEO)", dept: "CEO", 
        prompt: "O correio eletronico virtual que usamos no trabalho para mandar mensagens formais.", 
        dica: "email", 
        superDica: "Electronic Mail. E-M_ _ _." 
    },
    { 
        id: 24, name: "Enzo (Suporte)", dept: "TI", 
        prompt: "A menor luzinha ou quadradinho que forma a imagem na tela do seu monitor. Como chamamos?", 
        dica: "pixel", 
        superDica: "Ponto de imagem. P_ _ _ _." 
    },
    { 
        id: 25, name: "Marcos (Seguranca)", dept: "Seguranca", 
        prompt: "Aquele cadeado verde que diz que o site e seguro la em cima usa qual protocolo? O HTTP com o S no final.", 
        dica: "https", 
        superDica: "Cinco letras. Termina com S de Seguro. H_ _ _ _." 
    },
    { 
        id: 26, name: "Luciana (Financeiro)", dept: "Financeiro", 
        prompt: "Quando a gente quer comprar algo na internet ou ler noticias, a gente acessa um...", 
        dica: "site", 
        superDica: "O endereco da web. S_ _ _." 
    },
    { 
        id: 27, name: "Dr. Silas", dept: "Diretoria", 
        prompt: "O nome que se da para o codigo secreto que voce esta criando para mim agora. Facil de deduzir.", 
        dica: "senha", 
        superDica: "E o que voce esta tentando validar agora. S_ _ _ _." 
    },
    { 
        id: 28, name: "Beto (TI)", dept: "Suporte", 
        prompt: "O bicho de plastico com botoes que move a setinha branca na tela do computador. Qual o nome?", 
        dica: "mouse", 
        superDica: "Rato em ingles. M_ _ _ _." 
    },
    { 
        id: 29, name: "Vanguarda", dept: "Externo", 
        prompt: "Aquilo que infecta o seu sistema e nos usamos para destruir empresas corruptas.", 
        dica: "virus", 
        superDica: "Infeccao digital. V_ _ _ _." 
    },
    { 
        id: 30, name: "Usuario Final", dept: "Setor 1", 
        prompt: "Aquele papelzinho amarelo colante que a gente gruda no monitor pra nao esquecer as coisas.", 
        dica: "post-it", 
        superDica: "Bloco de notas adesivo. P_ _ _ - _ _." 
    }
];