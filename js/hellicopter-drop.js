function spawnAirdrop() {
    const farmScreen = document.getElementById('screen-farm');
    if (!farmScreen || farmScreen.style.display === 'none') return;

   const flyers = [
    { icon: '🛸', type: 'ufo', prop: true },
    { icon: '🪂', type: 'parachute', prop: false }
];

    const flyer = flyers[Math.floor(Math.random() * flyers.length)];
    const container = document.createElement('div');
    container.className = `airdrop-container ${flyer.type}`;

   container.innerHTML = `
        <div class="flyer-wrap">
            <div class="flyer-body">${flyer.icon}</div>
        </div>
        <div class="rope"></div>
        <div class="airdrop-box">📦</div>
    `;

    document.body.appendChild(container);

    const randomY = Math.random() * 200 + 100;
    container.style.top = randomY + 'px';
    container.style.left = '-150px';

    let posX = -150;
    const speed = 2 + Math.random();

    function fly() {
        posX += speed;
        container.style.left = posX + 'px';

        if (flyer.type === 'balloon') {
            container.style.transform = `translateX(${Math.sin(posX / 30) * 20}px)`;
        } else {
            container.style.transform = `translateY(${Math.sin(posX / 40) * 10}px)`;
        }

        if (posX < window.innerWidth + 150) {
            requestAnimationFrame(fly);
        } else {
            container.remove();
        }
    }
    requestAnimationFrame(fly);

    container.onclick = (e) => {
        container.style.pointerEvents = 'none';

        // Убедись, что переменная airdropLvl объявлена в game.js
        const base = 100;
        const perLvl = 200;
        const bonus = Math.floor((base + (airdropLvl - 1) * perLvl) + (typeof passiveIncome !== 'undefined' ? passiveIncome * 0.1 : 0));

        clickCount += bonus;

        if (typeof createConfettiExplosion === 'function') createConfettiExplosion(e.clientX, e.clientY);
        if (typeof createFloatingBonusText === 'function') createFloatingBonusText(e.clientX, e.clientY, `+${bonus.toLocaleString()}`);

        container.style.transition = '0.3s ease-out';
        container.style.transform = 'scale(0) translateY(-50px)';
        container.style.opacity = '0';

        setTimeout(() => container.remove(), 300);

        if (scoreElem) scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
        saveGame();
    };
}

// Запуск раз в 2 минуты (для теста поставь 5000)
setInterval(spawnAirdrop, 5000);

// --- ЭФФЕКТЫ (НЕ ЗАБУДЬ ИХ ЗАКРЫТЬ ТОЖЕ) ---
// === ФУНКЦИИ ЭФФЕКТОВ (ОДИН ЭКЗЕМПЛЯР) ===

function createConfettiExplosion(x, y) {
    const colors = ['#FFD700', '#FF4500', '#00FF7F', '#1E90FF', '#FF1493'];
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (Math.random() * 8 + 4) + 'px';
        particle.style.height = (Math.random() * 4 + 2) + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.zIndex = '10005';
        particle.style.pointerEvents = 'none';
        particle.style.borderRadius = '2px';
        document.body.appendChild(particle);

        const destX = (Math.random() - 0.5) * 250;
        const destY = (Math.random() - 0.5) * 250;
        const rotation = Math.random() * 720;

        particle.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => particle.remove(), 1000);
    }
}

function createFloatingBonusText(x, y, text) {
    const floatText = document.createElement('div');
    floatText.innerText = text;
    floatText.style.position = 'fixed';
    floatText.style.left = x + 'px';
    floatText.style.top = y + 'px';
    floatText.style.color = '#ffd700';
    floatText.style.fontWeight = '900';
    floatText.style.fontSize = '32px';
    floatText.style.zIndex = '10006';
    floatText.style.textShadow = '0 0 10px rgba(0,0,0,0.8)';
    floatText.style.pointerEvents = 'none';
    floatText.style.fontFamily = 'sans-serif';
    document.body.appendChild(floatText);

    // Анимация полета вверх прямо в JS
    floatText.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-150px)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
    });

    setTimeout(() => floatText.remove(), 2000);
}
