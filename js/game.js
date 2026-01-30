// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ИГРЫ (Динамические) ===
var usedBonusCodes = [];
var clickCount = 0;
var currentCoinSkin = 0;
var purchasedSkins = [0];

var clickPower = 1;
var maxEnergy = 100;
var energy = 100;

var userLevel = 1;
var userXP = 0;
var xpToNextLevel = 100;

var autoClicksPerSecond = 0;
var autoFarmLevel = 0;
var farmStorage = 0;

var currentAvatarIndex = 0;
var purchasedAvatars = [0];

var criticalChance = 0;
var critMultiplier = 10;
var unlockedAchievements = [];

var criticalChance = 0.1; // 10% шанс
var critMultiplier = 10;  // Множитель x10

// Элементы DOM
var scoreElem, coin, energyElem;

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
function initDOM() {
    scoreElem = document.getElementById('score');
    coin = document.getElementById('coin'); // ПРОВЕРЬ ЭТОТ ID
    energyElem = document.getElementById('energy');

    // Сразу после поиска вешаем событие (надежный способ)
    if (coin) {
        coin.onclick = handlePress;
        console.log("Монета найдена, клик привязан!");
    } else {
        console.error("Элемент монеты не найден!");
    }
}

// === ЛОГИКА ОПЫТА И ПРОГРЕССА ===
function addXP(amount) {
    userXP += amount;

    // Ищем данные для СЛЕДУЮЩЕГО уровня в массиве
    const nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);

    // Если опыт достиг планки следующего уровня
    if (nextLevelData && userXP >= nextLevelData.xpRequired) {
        userLevel++;
        showLevelModal(); // Теперь она сработает и закроется
        saveGame();
    }
    updateProgress();
}

function updateProgress() {
    const levelNameElemLocal = document.getElementById('level-name');
    const progressBarLocal = document.getElementById('level-progress');

    if (!levelNameElemLocal) return;

    // Ищем данные текущего уровня
    const currentLevelData = levelsData.find(l => l.lvl === userLevel);
    // Ищем данные СЛЕДУЮЩЕГО уровня для полоски
    const nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);

    // ВАЖНО: Оставляем ТОЛЬКО название и уровень в скобках
    const name = currentLevelData ? currentLevelData.name : "Копатель";
    levelNameElemLocal.innerText = `${name} (${userLevel}  УР.)`;

    // Полоска остается чисто визуальной
    if (progressBarLocal && nextLevelData) {
        let percent = (userXP / nextLevelData.xpRequired) * 100;
        progressBarLocal.style.width = Math.min(percent, 100) + "%";
    }
}




// === МОДАЛЬНОЕ ОКНО УРОВНЯ (ТО ЧТО ПРОПАЛО) ===
function showLevelModal() {
    const modal = document.getElementById('level-up-modal');
    if (!modal) {
        console.error("Модалка уровня не найдена в HTML!");
        return;
    }

    const reward = userLevel * 500;
    const numElem = document.getElementById('new-lvl-num');
    const rewElem = document.getElementById('lvl-reward-amt');

    if (numElem) numElem.innerText = userLevel;
    if (rewElem) rewElem.innerText = `+${reward}`;

    clickCount += reward;
    if (scoreElem) scoreElem.textContent = clickCount;

    modal.style.display = 'flex'; // Показываем окно
}

function closeLevelModal() {
    const modal = document.getElementById('level-up-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Обновляем данные на экране на всякий случай
    if (scoreElem) scoreElem.textContent = clickCount;
    updateProgress();

    console.log("Модалка закрыта, погнали дальше!");
}

// === ЛОГИКА КЛИКА ===
function handlePress(e) {
    // 1. Сначала определяем, будет ли удар критическим (шанс 10%)
    const isCrit = Math.random() < 0.1;
    const currentDamage = isCrit ? (clickPower * 10) : clickPower;

    // 2. Проверяем энергию (тратим энергию только за БАЗОВЫЙ клик, крит — это бонус!)
    const energyCost = clickPower;
    if (energy < energyCost) {
        if (energyElem) {
            energyElem.style.color = 'red';
            setTimeout(() => energyElem.style.color = 'white', 300);
        }
        return;
    }

    // 3. Начисляем валюту (уже с учетом возможного крита)
    clickCount += currentDamage;

    // 4. Начисляем опыт (всегда +1)
    if (typeof addXP === 'function') {
        addXP(1);
    }

    // 5. Тратим энергию
    energy -= energyCost;

    // 6. Обновляем текст на экране
    if (scoreElem) scoreElem.textContent = clickCount;
    if (energyElem) energyElem.textContent = `⚡ ${energy}`;

    // 7. Анимация монеты (при крите трясем сильнее)
    if (coin) {
        coin.style.transform = isCrit ? 'scale(0.8) rotate(10deg)' : 'scale(0.95)';
        setTimeout(() => {
            if (coin) coin.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }

    // 8. ВАЖНО: передаем урон и статус крита в вылетающие цифры
    if (typeof createFloatingText === 'function') {
        createFloatingText(e, currentDamage, isCrit);
    }

    // 9. Обновляем прогресс и сохраняем
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
    saveGame();
}



function createFloatingText(e, amount, isCrit) {
    const text = document.createElement('div');
    // Если крит - пишем огненный текст
    text.innerText = isCrit ? `🔥 КРИТ! +${amount}` : `+${amount}`;
    text.className = 'floating-number';

    if (isCrit) {
        text.style.color = 'red';
        text.style.fontSize = '40px';
        text.style.fontWeight = '600';
    }

    // Позиционирование
    let clientX = e.clientX || (e.touches && e.touches[0].clientX);
    let clientY = e.clientY || (e.touches && e.touches[0].clientY);

    text.style.left = `${clientX}px`;
    text.style.top = `${clientY}px`;

    document.body.appendChild(text);
    setTimeout(() => text.remove(), 800);
}


// === СКЛАД И ФЕРМА ===
function updateFarmUI() {
    const box = document.getElementById('farm-box');
    const bubble = document.getElementById('farm-storage-text');
    if (autoClicksPerSecond > 0) {
        if (box) box.style.display = 'flex';
        if (bubble) bubble.innerText = `📦 ${Math.floor(farmStorage)}`;
    } else {
        if (box) box.style.display = 'none';
    }
}

function collectFarm() {
    if (farmStorage > 0) {
        clickCount += Math.floor(farmStorage);

        farmStorage = 0;
        if (scoreElem) scoreElem.textContent = clickCount;
        updateFarmUI();
        updateProgress();
        saveGame();
    }
}


function renderLevelsRoadmap() {
    const container = document.getElementById('levels-roadmap');
    if (!container) return;
    container.innerHTML = '';

    levelsData.forEach((data) => {
        const isReached = userLevel > data.lvl;
        const isCurrent = userLevel === data.lvl;
        const isLocked = userLevel < data.lvl;

        let counterText = "";
        let percent = 0;

        if (isReached) {
            counterText = "✅ ВЫПОЛНЕНО";
            percent = 100;
        } else if (isCurrent) {
            // Ищем данные следующего уровня, чтобы понять цель
            const nextLvl = levelsData.find(l => l.lvl === userLevel + 1);
            if (nextLvl) {
                const remaining = nextLvl.xpRequired - userXP;
                counterText = `Осталось: ${Math.max(0, remaining)} 🥔`;
                percent = (userXP / nextLvl.xpRequired) * 100;
            } else {
                counterText = "МАКСИМУМ";
                percent = 100;
            }
        } else {
            counterText = `Цель: ${data.xpRequired} 🥔`;
            percent = 0;
        }

        const item = document.createElement('div');
        item.className = `level-item ${isReached ? 'reached' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`;

        item.innerHTML = `
            <div class="lvl-num">${data.lvl}</div>
            <div class="lvl-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="${isLocked ? 'color: #777;' : ''}">${data.name}</h3>
                    <span class="lvl-counter" style="color: ${isCurrent ? 'gold' : '#888'}; font-size: 12px;">${counterText}</span>
                </div>
                <div class="lvl-mini-progress-bg" style="height: 4px; margin-top: 8px;">
                    <div class="lvl-mini-progress-fill" style="width: ${Math.min(percent, 100)}%; background: ${isReached ? '#2ecc71' : 'gold'}"></div>
                </div>
            </div>
            <div class="lvl-status" style="margin-left: 10px;">${isCurrent ? '⭐' : (isReached ? '✅' : '🔒')}</div>
        `;
        container.appendChild(item);


    });
}



// === СОХРАНЕНИЕ И ЗАГРУЗКА ===
function saveGame() {
    if (typeof checkAchievements === 'function') checkAchievements();
    const gameState = {
        clickCount, currentCoinSkin, purchasedSkins, clickPower, maxEnergy,
        userLevel, userXP, xpToNextLevel, autoClicksPerSecond, autoFarmLevel,
        farmStorage, currentAvatarIndex, purchasedAvatars, unlockedAchievements,
        energy, lastLogin: Date.now(),usedBonusCodes
    };
    localStorage.setItem('bulbaSave', JSON.stringify(gameState));
}

function loadGame() {
    initDOM();
    const saved = localStorage.getItem('bulbaSave');

    if (saved) {
        const data = JSON.parse(saved); // Переменная 'data' живет ТОЛЬКО ВНУТРИ этого блока {}

        clickCount = data.clickCount || 0;
        currentCoinSkin = data.currentCoinSkin || 0;
        purchasedSkins = data.purchasedSkins || [0];
        clickPower = data.clickPower || 1;
        maxEnergy = data.maxEnergy || 100;
        userLevel = data.userLevel || 1;
        userXP = data.userXP || 0;
        xpToNextLevel = data.xpToNextLevel || 100;
        autoClicksPerSecond = data.autoClicksPerSecond || 0;
        autoFarmLevel = data.autoFarmLevel || 0;
        farmStorage = data.farmStorage || 0;
        unlockedAchievements = data.unlockedAchievements || [];
        purchasedAvatars = data.purchasedAvatars || [0];
        currentAvatarIndex = data.currentAvatarIndex || 0;

        // ИСПРАВЛЕННО: теперь 'data' здесь видна!
        usedBonusCodes = data.usedBonusCodes || [];

        const lastLoginTime = data.lastLogin || Date.now();
        const secondsPassed = Math.floor((Date.now() - lastLoginTime) / 1000);
        const energyGained = Math.floor(secondsPassed / 3);
        energy = Math.min((data.energy || 100) + energyGained, maxEnergy);
    } else {
        energy = 100;
        usedBonusCodes = []; // Инициализируем для нового игрока
    }

    // Обновляем UI
    if(scoreElem) scoreElem.textContent = clickCount;
    if(energyElem) energyElem.textContent = `⚡ ${energy}`;
    updateCoinImage();
    updateProgress();
    updateFarmUI();
}


function updateCoinImage() {
    if (coin && typeof coinSkinsData !== 'undefined' && coinSkinsData[currentCoinSkin]) {
        coin.style.backgroundImage = `url('${coinSkinsData[currentCoinSkin].url}')`;
    }
}

window.addEventListener('load', () => {
    loadGame(); // Сначала загружаем всё

    // Таймер восстановления ЭНЕРГИИ (+1 каждые 3 сек)
    setInterval(() => {
        if (energy < maxEnergy) {
            energy++;
            if (energyElem) energyElem.textContent = `⚡ ${energy}`;
        }
    }, 3000);

    // Таймер АВТОФЕРМЫ (если куплена)
    setInterval(() => {
        if (autoClicksPerSecond > 0) {
            farmStorage += autoClicksPerSecond;
            updateFarmUI();
        }
    }, 1000);

    // Таймер АВТОСОХРАНЕНИЯ (раз в 5 сек)
    setInterval(saveGame, 5000);
});