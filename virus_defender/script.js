const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280; canvas.height = 720;

// ==========================================
// CONFIGURAÇÃO DE DIFICULDADE (LOCAL STORAGE)
// ==========================================
const gameDiff = parseInt(localStorage.getItem('gameDifficulty')) || 2; 
const diffMult = gameDiff === 1 ? 0.7 : (gameDiff === 3 ? 1.5 : 1.0);
const spawnRate = gameDiff === 1 ? 120 : (gameDiff === 3 ? 60 : 90);

const M_SCALE = 1.8; 
let gameStarted = false, score = 0, frame = 0, superCharge = 0, killsToUpgrade = 15;
let isGameOver = false, isPaused = false, bossActive = false, legacyMode = false, bossEntity = null;
let unlockedFire = false, unlockedChain = false, unlockedIce = false, unlockedShield = false;
let globalDamageMult = 1.0, bossesDefeated = 0; 

let player = { x: 0, y: 0, hp: 100, maxHp: 100, angle: 0, speed: 4.5, bulletSize: 6, shieldActive: 0 };
let enemies = [], projectiles = [], items = [], fireTrails = [], chainLightning = null, iceVortexes = [];
let enemyProjectiles = []; 
const keys = {};
let mousePos = { x: 0, y: 0 };

const cooldowns = { fireball: { current: 0, max: 180 }, chain: { current: 0, max: 360 }, ice: { current: 0, max: 400 }, shield: { current: 0, max: 600 } };

let lastTime = 0;
const FPS = 60;
const frameInterval = 1000 / FPS;

// ==========================================
// ASSETS (AGORA COM O SHOT.PNG)
// ==========================================
const shipImg = new Image(); 
const imgVirusVerde = new Image(); 
const imgVirusRoxo = new Image();  
const imgVirusLaranja = new Image(); 
const imgVirusVermelho = new Image(); 
const imgTeia = new Image(); 
const imgShot = new Image(); // NOVA IMAGEM DO TIRO INIMIGO

let assetsLoaded = 0;
const totalAssets = 7; // AUMENTAMOS PARA 7 ASSETS
function assetLoaded() { 
    assetsLoaded++; 
    if (assetsLoaded >= totalAssets) { 
        const btn = document.getElementById('btn-start'); 
        if(btn) { btn.disabled = false; btn.innerText = "INICIAR DEFESA"; } 
    } 
}

shipImg.onload = assetLoaded; shipImg.src = '../img/ship2.png'; 
imgVirusVerde.onload = assetLoaded; imgVirusVerde.src = '../img/Adware.png';
imgVirusRoxo.onload = assetLoaded; imgVirusRoxo.src = '../img/Trojan.png';
imgVirusLaranja.onload = assetLoaded; imgVirusLaranja.src = '../img/Ransom.png';
imgVirusVermelho.onload = assetLoaded; imgVirusVermelho.src = '../img/Worm.png';
imgTeia.onload = assetLoaded; imgTeia.src = '../img/teia.png';
imgShot.onload = assetLoaded; imgShot.src = '../img/shot.png'; // CARREGANDO O TIRO

const somTiro1 = new Audio('../audio/shoot1.mp3'), somTiro2 = new Audio('../audio/shoot2.mp3'), somTiro3 = new Audio('../audio/shoot3.mp3');
const arrayTiros = [somTiro1, somTiro2, somTiro3];
const somEspecial = new Audio('../audio/specialAttack.mp3'), somZap = new Audio('../audio/zaps.mp3');

const musicaBoss = new Audio('../audio/boss.ogg'); musicaBoss.loop = true; musicaBoss.volume = 0.3; 
const musicaDeath = new Audio('../audio/death.ogg'); musicaDeath.loop = true; musicaDeath.volume = 0.4; 

// ==========================================
// FUNÇÕES DE DESENHO
// ==========================================
function drawRect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h)); }

function drawShip(x, y, angle) {
    ctx.save(); ctx.translate(x, y); 
    if(player.shieldActive > 0) {
        ctx.strokeStyle = "#00d2ff"; ctx.lineWidth = 4; ctx.shadowBlur = 15; ctx.shadowColor = "#00d2ff";
        ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI*2); ctx.stroke(); ctx.shadowBlur = 0;
    }
    ctx.scale(M_SCALE, M_SCALE); ctx.rotate(angle);
    ctx.save(); ctx.rotate(Math.PI / 2); ctx.drawImage(shipImg, -16, -16, 32, 32); ctx.restore();
    const staffColor = legacyMode ? "#26af61" : "#00d2ff";
    ctx.shadowBlur = 15; ctx.shadowColor = staffColor;
    drawRect(14, -4, 8, 8, staffColor); ctx.restore();
}

function drawEnemy(en) {
    ctx.save(); ctx.translate(en.x, en.y);
    let imgToDraw = en.isBoss ? (en.bossType === 'shooter' ? imgVirusLaranja : imgVirusVermelho) : (en.type === 'archer' ? imgVirusRoxo : imgVirusVerde);
    let imgSize = en.isBoss ? 180 : 48;
    if (imgToDraw.complete) { ctx.drawImage(imgToDraw, -imgSize / 2, -imgSize / 2, imgSize, imgSize); }
    if (en.hitFlash > 0) {
        ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; ctx.fillRect(-imgSize/2, -imgSize/2, imgSize, imgSize); ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#14141a";
    for(let i=0; i<canvas.width; i+=80) for(let j=0; j<canvas.height; j+=80) if((i+j)%160==0) drawRect(i, j, 6, 6, "#1a1a24");
    
    fireTrails.forEach(trail => { ctx.globalAlpha = 0.5; ctx.fillStyle = "#ff4757"; ctx.beginPath(); ctx.arc(trail.x, trail.y, trail.radius, 0, Math.PI*2); ctx.fill(); }); ctx.globalAlpha = 1;
    iceVortexes.forEach(v => { ctx.strokeStyle = "#70a1ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(v.x, v.y, v.radius, 0, Math.PI*2); ctx.stroke(); });
    items.forEach(it => { ctx.fillStyle = "#ff4757"; drawRect(it.x-10, it.y-10, 20, 20, "#ff4757"); ctx.fillStyle = "#fff"; drawRect(it.x-2, it.y-7, 4, 14, "#fff"); drawRect(it.x-7, it.y-2, 14, 4, "#fff"); });

    enemies.forEach(drawEnemy); 

    // DESENHANDO O NOVO TIRO DOS INIMIGOS
    enemyProjectiles.forEach(ep => { 
        ctx.save(); 
        ctx.translate(ep.x, ep.y); 
        if (imgShot.complete) {
            // Rotaciona a imagem para apontar na direção que está voando
            ctx.rotate(Math.atan2(ep.vy, ep.vx) + Math.PI / 2); 
            // O visual fica 3x maior que a caixa de colisão pra ficar bonito
            let imgSize = ep.size * 3; 
            ctx.drawImage(imgShot, -imgSize/2, -imgSize/2, imgSize, imgSize);
        } else {
            drawRect(-ep.size, -ep.size, ep.size*2, ep.size*2, ep.color); 
        }
        ctx.restore();
    });

    if(chainLightning && chainLightning.timer > 0) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 8; ctx.shadowBlur = 20; ctx.shadowColor = "#70a1ff"; ctx.beginPath(); ctx.moveTo(player.x, player.y); chainLightning.targets.forEach(en => ctx.lineTo(en.x, en.y)); ctx.stroke(); ctx.shadowBlur = 0; }
    
    projectiles.forEach(p => { 
        ctx.save(); ctx.translate(p.x, p.y); ctx.shadowBlur = 15; ctx.shadowColor = p.color; 
        if ((p.type === 'normal' || p.isSuper) && imgTeia.complete) {
            ctx.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2); 
            let imgSize = p.isSuper ? p.size * 4.5 : p.size * 5; 
            ctx.drawImage(imgTeia, -imgSize/2, -imgSize/2, imgSize, imgSize);
        } else { drawRect(-p.size, -p.size, p.size*2, p.size*2, p.color); }
        ctx.restore();
    });

    drawShip(player.x, player.y, player.angle);
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; ctx.fillRect(player.x - 25, player.y - 45, 50, 6);
    ctx.fillStyle = "#26af61"; ctx.fillRect(player.x - 25, player.y - 45, 50 * (Math.max(0, player.hp) / player.maxHp), 6);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(player.x - 25, player.y - 45, 50, 6);
}

// ==========================================
// UPGRADES
// ==========================================
function openSkillMenu() {
    isPaused = true; 
    const menu = document.getElementById('skill-options'); menu.innerHTML = "";
    let pool = [{id:'fire', t:"CARGA DE FIREWALL (E)", u:unlockedFire}, {id:'chain', t:"PULSO ANTIMALWARE (Q)", u:unlockedChain}, {id:'ice', t:"QUARENTENA DE DADOS (R)", u:unlockedIce}, {id:'shield', t:"CRIPTOGRAFIA VPN (F)", u:unlockedShield}].filter(o => !o.u);
    pool.push({id:'dmg', t:"OVERCLOCK DE CPU (+Dano)"}, {id:'spd', t:"OTIMIZAÇÃO DE REDE (+Velocidade)"});
    pool.sort(() => Math.random() - 0.5).slice(0, 3).forEach(opt => {
        const btn = document.createElement('button'); btn.className = 'skill-btn'; btn.innerHTML = `<strong>${opt.t}</strong>`;
        btn.onclick = () => {
            if(opt.id === 'fire') { unlockedFire = true; document.getElementById('abi-fire').style.display = 'flex'; }
            if(opt.id === 'chain') { unlockedChain = true; document.getElementById('abi-chain').style.display = 'flex'; }
            if(opt.id === 'ice') { unlockedIce = true; document.getElementById('abi-ice').style.display = 'flex'; }
            if(opt.id === 'shield') { unlockedShield = true; document.getElementById('abi-shield').style.display = 'flex'; }
            if(opt.id === 'dmg') globalDamageMult += 0.5; if(opt.id === 'spd') player.speed += 1.2;
            isPaused = false; document.getElementById('skill-menu').style.display = 'none';
        };
        menu.appendChild(btn);
    });
    document.getElementById('skill-menu').style.display = 'flex';
}

function voltarParaDesktop() { musicaBoss.pause(); musicaDeath.pause(); window.parent.postMessage('fecharJogo', '*'); }

// ==========================================
// UPDATE
// ==========================================
function update() {
    if (isGameOver || isPaused || !gameStarted) return;
    frame++;
    enemies.forEach(en => { if(en.hitFlash > 0) en.hitFlash--; });
    if(player.shieldActive > 0) player.shieldActive--;
    for(let k in cooldowns) if(cooldowns[k].current > 0) {
        cooldowns[k].current--;
        const el = document.getElementById(`cd-${k === 'fireball' ? 'fire' : k}`);
        if(el) el.style.height = (cooldowns[k].current/cooldowns[k].max*100) + "%";
    }

    let dx = 0, dy = 0;
    if(keys['KeyW']) dy--; if(keys['KeyS']) dy++; if(keys['KeyA']) dx--; if(keys['KeyD']) dx++;
    if(dx||dy) { const m = Math.sqrt(dx*dx+dy*dy); player.x += (dx/m)*player.speed; player.y += (dy/m)*player.speed; }
    player.x = Math.max(20, Math.min(canvas.width-20, player.x)); player.y = Math.max(20, Math.min(canvas.height-20, player.y));
    player.angle = Math.atan2(mousePos.y - player.y, mousePos.x - player.x);

    iceVortexes.forEach((v, vi) => { v.timer--; enemies.forEach(en => { if(Math.hypot(en.x - v.x, en.y - v.y) < v.radius) { en.x -= (en.x-v.x)*0.03; en.y -= (en.y-v.y)*0.03; if(frame % 15 === 0) { en.hp -= 1.0 * globalDamageMult; en.hitFlash = 5; } } }); if(v.timer <= 0) iceVortexes.splice(vi, 1); });
    fireTrails.forEach((trail, ti) => { trail.life--; enemies.forEach(en => { if(Math.hypot(en.x-trail.x, en.y-trail.y)<trail.radius) if(frame%8===0) { en.hp -= 1.5 * globalDamageMult; en.hitFlash = 5; } }); if(trail.life <= 0) fireTrails.splice(ti, 1); });

    for(let pi = projectiles.length - 1; pi >= 0; pi--) {
        let p = projectiles[pi]; p.x += p.vx; p.y += p.vy; 
        if(p.type === 'fireball' && frame % 4 === 0) fireTrails.push({x: p.x, y: p.y, life: 120, radius: 35});
        for(let ei = 0; ei < enemies.length; ei++) {
            let en = enemies[ei]; let collisionRadius = en.isBoss ? 70 : 15; 
            if(Math.hypot(p.x-en.x, p.y-en.y) < collisionRadius) {
                let danoCalc = p.damage; if(en.isBoss && p.isSuper) { danoCalc = 3.0 * globalDamageMult; }
                en.hp -= danoCalc; en.hitFlash = 5; 
                if (p.type !== 'fireball' && !p.isSuper) projectiles.splice(pi, 1);
                break; 
            }
        }
    }

    if(bossEntity && bossEntity.bossType === 'shooter' && frame % 80 === 0) {
        for(let i = -2; i <= 2; i++) {
            const a = Math.atan2(player.y - bossEntity.y, player.x - bossEntity.x) + (i * 0.2);
            enemyProjectiles.push({ x: bossEntity.x, y: bossEntity.y, vx: Math.cos(a)*5, vy: Math.sin(a)*5, size: 10, color: "#ff4757" });
        }
    }

    for(let i = enemyProjectiles.length - 1; i >= 0; i--) {
        let ep = enemyProjectiles[i]; ep.x += ep.vx; ep.y += ep.vy;
        if(ep.x < -50 || ep.x > canvas.width + 50 || ep.y < -50 || ep.y > canvas.height + 50) { enemyProjectiles.splice(i, 1); continue; }
        if(Math.hypot(player.x - ep.x, player.y - ep.y) < 20) { 
            if(player.shieldActive <= 0) player.hp -= (10 * diffMult); 
            enemyProjectiles.splice(i, 1); 
        }
    }

    for(let i = items.length - 1; i >= 0; i--) { if(Math.hypot(player.x - items[i].x, player.y - items[i].y) < 40) { player.hp = Math.min(player.maxHp, player.hp + 20); items.splice(i, 1); } }

    for(let i = enemies.length-1; i >= 0; i--) if(enemies[i].hp <= 0) { 
        const ex = enemies[i].x, ey = enemies[i].y;
        if(enemies[i].isBoss) { 
            bossesDefeated++; bossActive = false; bossEntity = null; document.getElementById('boss-ui').style.display = 'none'; 
            if(bossesDefeated >= 2 && !isGameOver) { 
                isGameOver = true; 
                document.getElementById('win-overlay').style.display = 'flex'; 
                musicaBoss.pause(); 
                
                // MENSAGEM DE SUCESSO ENVIADA AO DESKTOP
                window.parent.postMessage('sucesso_virus', '*'); 
            } 
        } 
        score++; superCharge = Math.min(100, superCharge + 6); 
        if(score % 10 === 0) player.hp = Math.min(player.maxHp, player.hp + 15);
        if(Math.random() < 0.3) items.push({ x: ex, y: ey });
        enemies.splice(i, 1); 
    }

    if(score >= killsToUpgrade) { killsToUpgrade += 15; openSkillMenu(); }

    if(score >= 45 && !bossActive && bossesDefeated === 0) { 
        bossActive = true; 
        bossEntity = { x: player.x + 500, y: player.y, hp: 500 * diffMult, maxHp: 500 * diffMult, isBoss: true, speed: 1.1 * diffMult, radius: 90, hitFlash: 0, bossType: 'shooter' }; 
        enemies.push(bossEntity); document.getElementById('boss-ui').style.display = 'flex'; 
    }
    if(score >= 90 && !bossActive && bossesDefeated === 1) { 
        bossActive = true; 
        bossEntity = { x: player.x - 500, y: player.y, hp: 800 * diffMult, maxHp: 800 * diffMult, isBoss: true, speed: 2.0 * diffMult, radius: 90, hitFlash: 0, bossType: 'crasher' }; 
        enemies.push(bossEntity); document.getElementById('boss-ui').style.display = 'flex'; document.getElementById('boss-name-id').innerText = "Worm Devastador"; 
    }
    
    if(frame % spawnRate === 0 && enemies.length < (8 + gameDiff)) {
        const a = Math.random() * Math.PI * 2; let sx = Math.max(40, Math.min(canvas.width-40, player.x + Math.cos(a)*500));
        let sy = Math.max(40, Math.min(canvas.height-40, player.y + Math.sin(a)*500));
        const isA = Math.random() > 0.8; 
        enemies.push({ x: sx, y: sy, hp: 8.0 * diffMult, hitFlash: 0, speed: isA ? 0 : (1.2 * (gameDiff * 0.4 + 0.2)), radius: 12, type: isA ? 'archer' : 'runner' });
    }
    
    enemies.forEach(en => { 
        if(en.type === 'runner' || en.isBoss) { 
            const a = Math.atan2(player.y-en.y, player.x-en.x); en.x += Math.cos(a)*en.speed; en.y += Math.sin(a)*en.speed; 
        } 
        else if(en.type === 'archer' && frame % 120 === 0) { 
            const a = Math.atan2(player.y-en.y, player.x-en.x); enemyProjectiles.push({ x: en.x, y: en.y, vx: Math.cos(a)*6, vy: Math.sin(a)*6, size: 6, color: "#9b59b6" }); 
        } 
        if(Math.hypot(player.x - en.x, player.y - en.y) < en.radius + 15) {
            if(player.shieldActive <= 0) player.hp -= (0.5 * diffMult); 
        }
    });

    if(bossEntity) document.getElementById('boss-hp-fill').style.width = (bossEntity.hp/bossEntity.maxHp*100) + "%";
    document.getElementById('hp-fill').style.width = (player.hp/player.maxHp*100) + "%";
    document.getElementById('super-fill').style.width = superCharge + "%";
    document.getElementById('val-score').innerText = score;
    
    if(player.hp <= 0 && !isGameOver) { 
        isGameOver = true; 
        document.getElementById('overlay').style.display = 'flex'; 
        musicaBoss.pause(); 
        musicaDeath.currentTime = 0; 
        musicaDeath.play().catch(() => {}); 
        
        // MENSAGEM DE ERRO ENVIADA AO DESKTOP
        window.parent.postMessage('dano_virus', '*');
    }
}

// ==========================================
// LOOP E INICIALIZAÇÃO
// ==========================================
function startGame() { 
    gameStarted = true; document.getElementById('start-menu').style.display = 'none'; 
    document.getElementById('ui').style.display = 'block'; document.getElementById('abilities-ui').style.display = 'flex'; 
    player.x = canvas.width / 2; player.y = canvas.height / 2; 
    musicaBoss.currentTime = 0; musicaBoss.play().catch(() => {});
    lastTime = 0; 
    requestAnimationFrame(loop); 
}

function loop(timestamp) { 
    if(!isGameOver && gameStarted) { 
        requestAnimationFrame(loop); 
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        if (deltaTime >= frameInterval) {
            lastTime = timestamp - (deltaTime % frameInterval);
            if(!isPaused) update(); 
            if(chainLightning) { chainLightning.timer--; if(chainLightning.timer <= 0) chainLightning = null; }
            draw(); 
        }
    } 
}

function spawnProjectile(type) {
    if(type === 'normal') projectiles.push({ type: 'normal', x: player.x, y: player.y, vx: Math.cos(player.angle) * 12, vy: Math.sin(player.angle) * 12, size: player.bulletSize, color: "#00d2ff", damage: 7.0 * globalDamageMult });
    else if(type === 'fireball' && unlockedFire && cooldowns.fireball.current === 0) { projectiles.push({ x: player.x, y: player.y, type: 'fireball', vx: Math.cos(player.angle) * 7, vy: Math.sin(player.angle) * 7, size: 18, color: "#ff4757", damage: 10 * globalDamageMult }); cooldowns.fireball.current = cooldowns.fireball.max; }
    else if(type === 'ice' && unlockedIce && cooldowns.ice.current === 0) { iceVortexes.push({ x: mousePos.x, y: mousePos.y, timer: 300, radius: 120 }); cooldowns.ice.current = cooldowns.ice.max; }
    else if(type === 'super') for(let i=0; i<40; i++) setTimeout(() => { if(isGameOver) return; projectiles.push({ x: player.x, y: player.y, vx: Math.cos(player.angle + (Math.random()-0.5)*0.2) * 20, vy: Math.sin(player.angle + (Math.random()-0.5)*0.2) * 20, size: 15, color: "#fff", damage: 12 * globalDamageMult, isSuper: true }); }, i * 40);
}

function triggerChainLightning() {
    if(!unlockedChain || cooldowns.chain.current > 0 || enemies.length === 0) return;
    let target = null; let minDist = Infinity;
    enemies.forEach(en => { const d = Math.hypot(en.x - mousePos.x, en.y - mousePos.y); if(d < minDist && d < 400) { minDist = d; target = en; } });
    if(!target) return;
    const chain = [target]; let current = target;
    const applyDmg = (en) => { if(en.isBoss) { en.hp -= 20 * globalDamageMult; } else { en.hp = -999; } en.hitFlash = 10; };
    applyDmg(current);
    for(let i=0; i<8; i++) {
        let next = null; let nextMinDist = Infinity;
        enemies.forEach(en => { if(chain.includes(en)) return; const d = Math.hypot(en.x - current.x, en.y - current.y); if(d < nextMinDist && d < 300) { nextMinDist = d; next = en; } });
        if(next) { chain.push(next); current = next; applyDmg(current); } else break;
    }
    chainLightning = { targets: chain, timer: 25 }; cooldowns.chain.current = cooldowns.chain.max;
    somZap.currentTime = 0; somZap.volume = 0.8; somZap.play().catch(() => {});
}

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if(e.code === 'Space' && superCharge >= 100) { spawnProjectile('super'); superCharge = 0; somEspecial.play().catch(()=>{}); }
    if(e.code === 'KeyQ') triggerChainLightning();
    if(e.code === 'KeyE') spawnProjectile('fireball');
    if(e.code === 'KeyR') spawnProjectile('ice');
    if(e.code === 'KeyF' && unlockedShield && cooldowns.shield.current === 0) { player.shieldActive = 240; cooldowns.shield.current = cooldowns.shield.max; }
});
window.addEventListener('keyup', e => keys[e.code] = false);

window.addEventListener('mousemove', e => { 
    const rect = canvas.getBoundingClientRect(); 
    if(rect.width > 0 && rect.height > 0) {
        mousePos.x = (e.clientX - rect.left) * (canvas.width / rect.width); 
        mousePos.y = (e.clientY - rect.top) * (canvas.height / rect.height); 
    }
});

window.addEventListener('mousedown', e => { 
    if(gameStarted && !isPaused && e.button === 0) { 
        spawnProjectile('normal'); 
        const s = arrayTiros[Math.floor(Math.random()*3)]; 
        s.currentTime = 0; s.volume = 0.2; s.play().catch(()=>{}); 
    } 
});
window.addEventListener('contextmenu', e => e.preventDefault());