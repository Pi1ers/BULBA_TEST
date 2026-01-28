

// Глобальные переменные игры (без БД начинаем с нуля)
var clickCount = 0;
var energy = 100;
var level = 0; // Уровень 1 — это первая монета (LEVEL 0.png)
const maxEnergy = 100;

// Массив цен
var levelCosts = [0, 50, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

// Массив цен аватаров
var currentAvatarIndex = 0;
var purchasedAvatars = [0]; // Уровень 0 уже куплен
var avatarCost = 500; // Цена любого нового аватара (или сделай массив цен)

// Элементы DOM
const scoreElem = document.getElementById('score');
const coin = document.getElementById('coin');
const energyElem = document.getElementById('energy');

// Картинки монет
const coinImages = [
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%200.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%201.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%202%20STONE_COIN.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%203%20CLAY_COIN.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%204%20IRON_BULBA.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%205%20Copper_COIN.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%206%20Broize_coin.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%207%20Silver_coin.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%208%20GOLD_COIN.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%209%20Titanium_coin.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%2010%20DIAMOND_COIN.png'
];
// ПРОГРЕСС БАР/ УРОВЕНЬ И ПРОФИЛЬ

function updateProgress() {
    const nextLevel = level + 1;
    const levelNameElem = document.getElementById('level-name');
    const progressBar = document.getElementById('level-progress');
    const avatarImg = document.getElementById('user-avatar');

    if (levelNameElem) levelNameElem.innerText = `Уровень ${level}`;

    // ИСПРАВЛЕНО: аватар берется из выбранного индекса, а не из текущего уровня
    if (avatarImg) avatarImg.src = coinImages[currentAvatarIndex];

    if (nextLevel < levelCosts.length) {
        const targetScore = levelCosts[nextLevel];
        let percent = (clickCount / targetScore) * 100;

        if (percent >= 100) {
            percent = 100;
            progressBar.style.background = "#2ecc71";
            progressBar.style.boxShadow = "0 0 10px #2ecc71";
        } else {
            progressBar.style.background = "linear-gradient(90deg, gold, #ffcc00)";
            progressBar.style.boxShadow = "none";
        }

        if (progressBar) progressBar.style.width = percent + "%";
    } else {
        if (progressBar) {
            progressBar.style.width = "100%";
            progressBar.style.background = "#2ecc71";
        }
        if (levelNameElem) levelNameElem.innerText = "MAX LEVEL";
    }
}



// Обновление картинки монеты
function updateCoinImage() {
    if (coin && coinImages[level]) { // Убрали - 1
        // Теперь если level = 0, возьмется coinImages[0] (LEVEL 0.png)
        // Если level = 1, возьмется coinImages[1] (LEVEL 1.png)
        coin.style.backgroundImage = `url('${coinImages[level]}')`;
    }
}

// Летающий текст +1
function createFloatingText(e) {
    const text = document.createElement('div');
    text.innerText = '+1';
    text.className = 'floating-number';

    let x, y;
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    text.style.left = `${x}px`;
    text.style.top = `${y}px`;

    document.body.appendChild(text);
    setTimeout(() => text.remove(), 800);
}

// Обработка клика
function handlePress(e) {
    if (energy > 0) {
        clickCount++;
        energy--;

        // Обновляем текст
        if(scoreElem) scoreElem.textContent = clickCount;
        if(energyElem) energyElem.textContent = `⚡ ${energy}`;

        // Анимация монеты
        if(coin) {
            coin.style.transform = 'scale(0.95)';
            setTimeout(() => coin.style.transform = 'scale(1)', 100);
        }
        updateProgress()
        createFloatingText(e);

        // Обновляем статусы в магазине (чтобы кнопка стала активной, если накопили)
        if (typeof updateCardStatuses === 'function') updateCardStatuses();
    }
}

// Регенерация энергии
setInterval(() => {
    if(energy < maxEnergy) {
        energy++;
        if(energyElem) energyElem.textContent = `⚡ ${energy}`;
    }
}, 3000);

// Навешиваем события
if (coin) {
    coin.addEventListener('click', handlePress);
    coin.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(e);
    }, { passive: false });
}







// Инициализация экрана
updateCoinImage();
updateProgress(); // Добавили, чтобы сразу видеть уровень и аватар
