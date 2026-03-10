// Диапазоны наград (Мин - Мак) для каждого уровня
const airdropTiers = [
    { min: 0, max: 0 },       // 0 ур: заблокировано (не летает)
    { min: 10, max: 50 },     // 1 ур
    { min: 50, max: 100 },    // 2 ур
    { min: 100, max: 300 },   // 3 ур
    { min: 300, max: 700 },   // 4 ур
    { min: 700, max: 1500 },  // 5 ур
    { min: 1500, max: 5000 }, // 6 ур
    { min: 5000, max: 13000 },// 7 ур
    { min: 13000, max: 30000 },// 8 ур
    { min: 30000, max: 70000 },// 9 ур
    { min: 70000, max: 100000 }// 10 ур
];

// Цены за УЛУЧШЕНИЕ до этого уровня (прогрессия "не на один день")
const airdropUpgradePrices = [
    0,
    5000,       // Цена за саму ПОКУПКУ (ур. 1)
    25000,      // на 2-й
    150000,     // на 3-й
    750000,     // на 4-й
    3500000,    // на 5-й
    15000000,   // на 6-й (15 млн)
    75000000,   // на 7-й (75 млн)
    250000000,  // на 8-й (250 млн)
    1000000000, // на 9-й (1 млрд)
    5000000000  // на 10-й (5 млрд)
];


// 1. Флаг обязательно ВНЕ функции
let isAirdropActive = false;

function spawnAirdrop() {
    // 1. Сначала проверяем, куплен ли вертолет вообще
    // (Если airdropLvl нет в памяти или он равен 0 — выходим)
    if (!window.airdropLvl || window.airdropLvl === 0) return;
    // 2. Твоя проверка: если один уже летает — не спавним второй
    if (isAirdropActive) return;

     // 3. Твоя проверка: находимся ли мы на экране фермы
    const farmScreen = document.getElementById('screen-farm');
    if (!farmScreen || farmScreen.offsetParent === null) return;
    // 2. Поднимаем флаг
    isAirdropActive = true;

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

    farmScreen.appendChild(container);

    const randomY = Math.random() * 200 + 100;
    container.style.top = randomY + 'px';
    let posX = -150;
    const speed = 2 + Math.random();

    function fly() {
        // Если контейнер удалили (кликнули), останавливаем анимацию
        if (!container.parentNode) return;

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
            // 3. СБРОС ФЛАГА (если улетел сам)
            isAirdropActive = false;
        }
    }
    requestAnimationFrame(fly);

container.onclick = (e) => {
    container.style.pointerEvents = 'none';

    // Защита: если уровень выше массива, берем последний тир
    const tierIndex = Math.min(window.airdropLvl || 0, airdropTiers.length - 1);
    const tier = airdropTiers[tierIndex];

    // РАНДОМ между min и max для этого уровня
    const bonus = Math.floor(Math.random() * (tier.max - tier.min + 1) + tier.min);

    clickCount += bonus;
    window.totalPotatoEarned = (window.totalPotatoEarned || 0) + bonus;
    window.airdropCount = (window.airdropCount || 0) + 1;
    // Эффекты и сохранение
    if (typeof createConfettiExplosion === 'function') createConfettiExplosion(e.clientX, e.clientY);
    if (typeof createFloatingBonusText === 'function') {
        createFloatingBonusText(e.clientX, e.clientY, `+${bonus.toLocaleString()} 🥔`);
    }

    // Сброс флага и удаление через анимацию
    setTimeout(() => {
        container.remove();
        isAirdropActive = false;
    }, 300);

    updateProgress();
    saveGame();
};
}

// Интервал 5 сек для теста
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
