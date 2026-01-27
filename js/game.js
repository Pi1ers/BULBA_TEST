let clickCount = 0;
let energy = 100;
let level = 1;
const maxEnergy = 100;

// Массив цен здесь, чтобы его видели все файлы
var levelCosts = [0, 0, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]

const scoreElem = document.getElementById('score');
const coin = document.getElementById('coin');
const energyElem = document.getElementById('energy');

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

function updateCoinImage() {
    if (coin) {
        coin.style.backgroundImage = `url('${coinImages[level - 1]}')`;
    }
}

// Функция создания летающих цифр
function createFloatingText(e) {
    const text = document.createElement('div');
    text.innerText = '+1';
    text.className = 'floating-number';

    // Координаты (мышь или тач)
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

function handlePress(e) {
    if (energy > 0) {
        clickCount++;
        energy--;
        scoreElem.textContent = clickCount;
        energyElem.textContent = `⚡ ${energy}`;

        coin.style.transform = 'scale(0.9)';
        setTimeout(() => coin.style.transform = 'scale(1)', 100);

        createFloatingText(e);
    }
}

// Регенерация
setInterval(() => {
    if(energy < maxEnergy) {
        energy++;
        energyElem.textContent = `⚡ ${energy}`;
    }
}, 3000);

// События
if (coin) {
    coin.addEventListener('click', handlePress);
    coin.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(e);
    }, { passive: false });
}

updateCoinImage();
