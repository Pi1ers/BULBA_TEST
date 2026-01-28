// 1. Конфиг Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAGExfz8xyabDdFwy7PCYg1ub251S9fCDg",
    authDomain: "bulbacoin.firebaseapp.com",
    projectId: "bulbacoin",
    storageBucket: "bulbacoin.firebasestorage.app",
    messagingSenderId: "815317813546",
    appId: "1:815317813546:web:a9355f4cf7d6c23a623653",
    databaseURL: "https://bulbacoin-default-rtdb.europe-west1.firebasedatabase.app"
};

// 2. Инициализация (с проверкой)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}
var db = firebase.database();
var tg = window.Telegram.WebApp;
var userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "test_user_1";

// 3. Переменные игры (используем var для глобального доступа)
var clickCount = 0;
var energy = 100;
var level = 1;
var maxEnergy = 100;
var levelCosts = [0, 0, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];

var scoreElem = document.getElementById('score');
var coin = document.getElementById('coin');
var energyElem = document.getElementById('energy');

var coinImages = [
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

// 4. Функции
function updateCoinImage() {
    if (coin) {
        coin.style.backgroundImage = `url('${coinImages[level - 1]}')`;
    }
}

function updateEnergyDisplay() {
    if (energyElem) {
        energyElem.textContent = `⚡ ${energy}`;
    }
}

function loadUserData() {
    db.ref('users/' + userId).once('value').then((snapshot) => {
        var data = snapshot.val();
        if (data) {
            clickCount = data.clickCount || 0;
            level = data.level || 1;
            energy = data.energy || 100;

            scoreElem.textContent = clickCount;
            updateCoinImage();
            updateEnergyDisplay();
            // Обновляем рынок, если он загружен
            if (typeof updateCardStatuses === 'function') updateCardStatuses();
        }
    });
}

function saveUserData() {
    db.ref('users/' + userId).set({
        clickCount: clickCount,
        level: level,
        energy: energy,
        userName: tg.initDataUnsafe.user ? tg.initDataUnsafe.user.first_name : "Guest"
    });
}

function createFloatingText(e) {
    var text = document.createElement('div');
    text.innerText = '+1';
    text.className = 'floating-number';
    var x = e.clientX || (e.touches && e.touches[0].clientX);
    var y = e.clientY || (e.touches && e.touches[0].clientY);
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
        updateEnergyDisplay();
        coin.style.transform = 'scale(0.9)';
        setTimeout(() => coin.style.transform = 'scale(1)', 100);
        createFloatingText(e);
        
    }
}

// Добавляем автоматическое сохранение каждые 3 секунды
setInterval(() => {
    saveUserData();
}, 3000);

// И сохранение при закрытии (для Telegram)
tg.onEvent('viewportChanged', saveUserData); 

// 5. Запуск
setInterval(() => {
    if(energy < maxEnergy) {
        energy++;
        updateEnergyDisplay();
    }
}, 3000);

if (coin) {
    coin.addEventListener('click', handlePress);
    coin.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(e);
    }, { passive: false });
}

updateCoinImage();
loadUserData();

