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


var currentAvatarIndex = 0;
var purchasedAvatars = [0];


var criticalChance = 0;
var critMultiplier = 10;
var unlockedAchievements = [];


var criticalChance = 0.1; // 10% шанс
var critMultiplier = 10;  // Множитель x10

// Элементы DOM
var scoreElem, coin, energyElem;

// летающая коробка
let airdropLvl = localStorage.getItem('airdropLvl') ? parseInt(localStorage.getItem('airdropLvl')) : 1;
// Начальный бонус 100, каждый уровень дает +200 (или сколько захочешь)
let airdropBaseBonus = 100;



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

    const nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);

    if (nextLevelData && userXP >= nextLevelData.xpRequired) {
        userLevel++;
        showLevelModal();
        saveGame();
    }

    // ВАЖНО: Принудительно округляем счет перед выходом
    if (scoreElem) scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');

    updateProgress();
}



function updateEnergyUI() {
    if (energyElem) {
        // Всегда показываем Текущая / Максимальная
        energyElem.textContent = `⚡ ${Math.floor(energy)} / ${maxEnergy}`;
    }
}




function updateProgress() {
    // 1. ОБНОВЛЯЕМ ТЕКСТ СЧЕТА (🥔)
    const scoreElemLocal = document.getElementById('score');
    if (scoreElemLocal) {
        scoreElemLocal.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
    }

    // 2. ОБНОВЛЯЕМ ЭНЕРГИЮ (⚡ 100 / 100)
    const energyElemLocal = document.getElementById('energy-val');
    if (energyElemLocal) {
        energyElemLocal.textContent = `⚡ ${Math.floor(energy)} / ${maxEnergy}`;
    }

    // 3. ОБНОВЛЯЕМ ПОЛОСКУ ЭНЕРГИИ
    const energyBarLocal = document.getElementById('energy-progress');
    if (energyBarLocal) {
        const energyPercent = (energy / maxEnergy) * 100;
        energyBarLocal.style.width = Math.min(energyPercent, 100) + "%";
    }

    // 4. ОБНОВЛЯЕМ УРОВЕНЬ И ОПЫТ (Bulba-Track)
    const levelNameElemLocal = document.getElementById('level-name');
    const progressBarLocal = document.getElementById('level-progress');
    if (levelNameElemLocal) {
        const currentLevelData = levelsData.find(l => l.lvl === userLevel);
        const nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);
        const name = currentLevelData ? currentLevelData.name : "Копатель";
        levelNameElemLocal.innerText = `${name} (${userLevel} / ${levelsData.length})`;

        if (nextLevelData && progressBarLocal) {
            let percent = (userXP / nextLevelData.xpRequired) * 100;
            progressBarLocal.style.width = Math.min(percent, 100) + "%";
        }
    }

    // 5. ОБНОВЛЯЕМ ПРИБЫЛЬ В ЧАС
    const profitHourElem = document.getElementById('profit-per-hour');
    if (profitHourElem) {
        profitHourElem.innerText = "+" + Math.floor(passiveIncome || 0).toLocaleString('ru-RU');
    }

    // 6. ОБНОВЛЯЕМ АВАТАРКУ
    const miniAvatar = document.getElementById('user-avatar-mini');
    if (miniAvatar && typeof avatarData !== 'undefined' && avatarData[currentAvatarIndex]) {
        miniAvatar.src = avatarData[currentAvatarIndex].url;
    }


} // Конец функции updateProgress








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
    const isCrit = Math.random() < criticalChance;
    const currentDamage = isCrit ? (clickPower * 10) : clickPower;

    // 2. Проверяем энергию
    const energyCost = clickPower;
    if (energy < energyCost) {
        if (energyElem) {
            energyElem.style.color = 'red';
            setTimeout(() => energyElem.style.color = 'white', 300);
        }
        return;
    }

    // 3. Начисляем валюту
    clickCount += currentDamage;

    // 4. Начисляем опыт
    if (typeof addXP === 'function') {
        addXP(1);
    }

    // 5. Тратим энергию
    energy -= energyCost;

    // 6. Обновляем текст на экране (только целые числа)
    if (scoreElem) scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
    updateEnergyUI(); // Используем новую функцию
    if (energyElem) {
        // Энергию тоже лучше округлить на всякий случай
        energyElem.textContent = `⚡ ${Math.floor(energy)} / ${maxEnergy}`;
    }

    // 7. Анимация монеты 3D наклон
    if (coin) {
        const coinRect = coin.getBoundingClientRect();

        // Корректное получение координат для ПК и мобилок
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const coinCenterX = coinRect.left + coinRect.width / 2;
        const coinCenterY = coinRect.top + coinRect.height / 2;

        const offsetX = (clientX - coinCenterX) / (coinRect.width / 2);
        const offsetY = (clientY - coinCenterY) / (coinRect.height / 2);

        const rotateY = offsetX * 20; // Угол наклона по горизонтали
        const rotateX = -offsetY * 20; // Угол наклона по вертикали

        coin.style.transform = `scale(0.95) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        setTimeout(() => {
            coin.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        }, 100);
    } // <--- ЗДЕСЬ БЫЛА ОШИБКА (нужно закрыть скобку)

    // 8. Вылетающие цифры
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
    text.innerText = isCrit ? `🔥 CRITICAL! +${amount}` : `+${amount}`;
    text.className = 'floating-number';

    if (isCrit) {
        text.style.color = 'red';
        text.style.fontSize = '20px';
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

        container.innerHTML = `
    <div class="flyer-wrap">
        ${flyer.prop ? '<div class="propeller"></div>' : ''}
        ${flyer.type === 'plane' ? '<div class="smoke"></div>' : ''}
        <div class="flyer-body ${flyer.flipped ? 'flipped' : ''}">${flyer.icon}</div>
    </div>
    <div class="rope"></div>
    <div class="airdrop-box">📦</div>
`;
        container.appendChild(item);


    });
}





// === СОХРАНЕНИЕ И ЗАГРУЗКА ===
function saveGame() {
    if (typeof checkAchievements === 'function') checkAchievements();
    const gameState = {
        clickCount, currentCoinSkin, purchasedSkins, clickPower, maxEnergy,
        userLevel, userXP, xpToNextLevel,currentAvatarIndex, purchasedAvatars, unlockedAchievements,
        energy, lastLogin: Date.now(),usedBonusCodes,criticalChance, energyRegenSpeed,
        cloverLevel, honeyLevel,passiveIncome: passiveIncome,ownedBusiness: window.ownedBusiness
    };
    localStorage.setItem('bulbaSave', JSON.stringify(gameState));
    localStorage.setItem('ownedBusiness', JSON.stringify(window.ownedBusiness));
    localStorage.setItem('airdropLvl', airdropLvl);

}

function loadGame() {
    initDOM();
    const saved = localStorage.getItem('bulbaSave');

    if (saved) {
        const data = JSON.parse(saved);

        clickCount = data.clickCount || 0;
        currentCoinSkin = data.currentCoinSkin || 0;
        purchasedSkins = data.purchasedSkins || [0];
        clickPower = data.clickPower || 1;
        maxEnergy = data.maxEnergy || 100;
        userLevel = data.userLevel || 1;
        userXP = data.userXP || 0;
        xpToNextLevel = data.xpToNextLevel || 100;

        // ЧИСТИМ: Удаляем autoClicksPerSecond, заменяем на пассивный доход
        passiveIncome = data.passiveIncome || 0;
        window.ownedBusiness = data.ownedBusiness || {}; // Загружаем уровни бизнеса

        unlockedAchievements = data.unlockedAchievements || [];
        purchasedAvatars = data.purchasedAvatars || [0];
        currentAvatarIndex = data.currentAvatarIndex || 0;
        criticalChance = data.criticalChance || 0.1;
        energyRegenSpeed = data.energyRegenSpeed || 1;
        cloverLevel = data.cloverLevel || 0;
        honeyLevel = data.honeyLevel || 0;
        honeyCost = data.honeyCost || 1000;
        usedBonusCodes = data.usedBonusCodes || [];

        const lastLoginTime = data.lastLogin || Date.now();
        const secondsPassed = Math.floor((Date.now() - lastLoginTime) / 1000);

        // --- ДОБАВЛЯЕМ: Начисление за время отсутствия ---
        if (secondsPassed > 60 && passiveIncome > 0) {
            const earned = secondsPassed * passiveIncome;
            clickCount += earned;
            // Уведомление покажем чуть позже, когда UI загрузится
            console.log(`Бизнес принес: ${earned} картофелин за ${secondsPassed} сек.`);
        }

        const energyGained = Math.floor(secondsPassed / 3);
        energy = Math.min((data.energy || 100) + energyGained, maxEnergy);
    } else {
        energy = 100;
        honeyLevel = 0;
        cloverLevel = 0;
        usedBonusCodes = [];
        passiveIncome = 0; // Инициализация
        window.ownedBusiness = {};
        updateCoinImage();
        updateProgress();
        updateEnergyUI();
    }

    if(scoreElem) scoreElem.textContent = Math.floor(clickCount);
    // Обновляем энергию в формате (34 / 100)
    if(energyElem) energyElem.textContent = `⚡ ${Math.floor(energy)} / ${maxEnergy}`;

    updateCoinImage();
    updateProgress();
    // Обновляем аватарку в шапке при загрузке
    if (typeof updateHeaderAvatar === 'function') updateHeaderAvatar();
}


function updateCoinImage() {
    if (coin && typeof coinSkinsData !== 'undefined' && coinSkinsData[currentCoinSkin]) {
        coin.style.backgroundImage = `url('${coinSkinsData[currentCoinSkin].url}')`;
    }
}

function showAchievementToast(text) {
    console.log("Достижение получено: " + text);
    // Позже здесь можно нарисовать красивое всплывающее окошко
}


window.addEventListener('load', () => {
    loadGame(); // Сначала загружаем всё

    setInterval(() => {
    if (energy < maxEnergy) {
        energy += energyRegenSpeed; // Вот тут используется наша переменная
        if (energy > maxEnergy) energy = maxEnergy;
        updateProgress(); // Обновляем полоску и цифры 100/100
    }
}, 3000); // Раз в 3 секунды (или как у тебя настроено)

setInterval(() => {
    if (typeof passiveIncome !== 'undefined' && passiveIncome > 0) {
        // Начисляем долю (Доход в час / 3600 секунд)
        clickCount += (passiveIncome / 3600);

        // ОБНОВЛЕНИЕ ТЕКСТА НА ЭКРАНЕ
        if (scoreElem) {
            // Math.floor — убирает дробную часть
            // toLocaleString('ru-RU') — делает красивые пробелы (1 000 вместо 1000)
            scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
        }
    }
}, 1000);


    // Таймер АВТОСОХРАНЕНИЯ (раз в 5 сек)
    setInterval(saveGame, 5000);
});

