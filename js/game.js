let clickCount = 0;
let energy = 100;
let level = 1;
const maxEnergy = 100;

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
    coin.style.backgroundImage = `url('${coinImages[level - 1]}')`;
}

function handlePress() {
    if (energy > 0) {
        clickCount++;
        energy--;
        scoreElem.textContent = clickCount;
        energyElem.textContent = `⚡ ${energy}`;
        coin.style.transform = 'scale(0.9)';
        setTimeout(() => coin.style.transform = 'scale(1)', 100);
    }
}

setInterval(() => { if(energy < maxEnergy) { energy++; energyElem.textContent = `⚡ ${energy}`; } }, 3000);

coin.onclick = handlePress;
updateCoinImage();
