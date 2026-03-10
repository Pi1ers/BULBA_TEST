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

//////////// КАЛЕНДАРЬ ЕЖД, ВХОДА
let lastLogin = localStorage.getItem('lastLogin') || null;
let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;


// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
let isInitialized = false; // Флаг запуска

function initDOM() {
    // 1. Ищем элементы
    scoreElem = document.getElementById('score');
    coin = document.getElementById('coin');
    energyElem = document.getElementById('energy');

    if (coin) {
        // ОЧИСТКА: Сначала полностью убираем все старые обработчики
        coin.onclick = null;
        coin.onpointerdown = null;

        // УСТАНОВКА: Ставим только ОДИН свежий обработчик
        // Используем onpointerdown, так как он быстрее для мобилок
        coin.onpointerdown = (e) => {
            // Предотвращаем стандартное поведение браузера (чтобы не было "двойного тапа")
            if (e.cancelable) e.preventDefault();
            handlePress(e);
        };

        console.log("Монета настроена: старые клики удалены, новый активен.");
    }
}
/////////////// АВАТАРЫ УРОВНЯ /////////////
function autoEvolveAvatar(newLevel) {
    const avatarIndex = newLevel - 1; // Коррекция индекса (1 уровень = 0 индекс)

    if (avatarData[avatarIndex]) {
        // Разблокируем (открываем в магазине)
        if (!purchasedAvatars.includes(avatarIndex)) {
            purchasedAvatars.push(avatarIndex);
        }

        // Если у игрока стоял аватар от ПРОШЛОГО уровня (значит он сам не менял)
        // Прошлый уровень имел индекс avatarIndex - 1
        if (currentAvatarIndex === avatarIndex - 1) {
            currentAvatarIndex = avatarIndex;

            // Обновляем иконку в шапке
            const headerAvatar = document.getElementById('user-avatar-mini');
            if (headerAvatar) {
                headerAvatar.src = avatarData[avatarIndex].url;
            }
            console.log(`Эволюция! Уровень ${newLevel}: ${avatarData[avatarIndex].name}`);
        }
    }
}

// === ЛОГИКА ОПЫТА И ПРОГРЕССА ===
function addXP(amount) {
    userXP += amount;

    // Ищем данные следующего уровня
    let nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);

    // Цикл while позволяет повысить уровень несколько раз,
    // если опыта пришло ОЧЕНЬ много за один раз
    while (nextLevelData && userXP >= nextLevelData.xpRequired) {
        userXP -= nextLevelData.xpRequired; // Вычитаем стоимость уровня, остаток опыта сохраняем
        userLevel++; // Повышаем уровень
        autoEvolveAvatar(userLevel);
        // 1. ЗАПУСКАЕМ ЭФФЕКТЫ (Салют и Вспышку)
        if (typeof launchLevelUpEffects === 'function') {
            launchLevelUpEffects();
        }

        // 2. ПОКАЗЫВАЕМ ТВОЮ МОДАЛКУ
        showLevelModal();

        // Ищем данные для следующего уровня (вдруг опыта хватит еще на один)
        nextLevelData = levelsData.find(l => l.lvl === userLevel + 1);
    }

    // Сохраняем прогресс
    saveGame();

    // ВАЖНО: Принудительно округляем счет перед выходом
    if (scoreElem) {
        scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
    }

    // Обновляем полоски и тексты
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
        // Добавляем плавное исчезновение
        modal.style.transition = "opacity 0.4s ease";
        modal.style.opacity = "0";

        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = "1"; // Сбрасываем прозрачность для следующего раза

            // Обновляем всё на экране
            updateProgress();
            saveGame();
        }, 400);
    }
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

    // === ВОТ ЭТО ДОБАВЛЯЕМ ДЛЯ СТАТИСТИКИ ===
    window.totalClicks = (Number(window.totalClicks) || 0) + 1;
    window.totalPotatoEarned = (Number(window.totalPotatoEarned) || 0) + currentDamage;
    // =======================================


    // ПЛЮСУЕМ В ОБЩУЮ КОПИЛКУ ДЛЯ АЧИВКИ:
    window.totalEnergySpent = (window.totalEnergySpent || 0) + energyCost;
    // 4. Начисляем опыт
    if (typeof addXP === 'function') {
        addXP(1);
    }
     // --- ДОБАВЛЯЕМ ОБНОВЛЕНИЕ КВЕСТОВ ТУТ ---

    if (typeof updateQuestProgress === 'function') {
        updateQuestProgress('clicks', 1); // Убедись, что тут 'clicks', а не t
        updateQuestProgress('energy', energyCost);
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
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY);

    // --- ДОБАВЛЯЕМ КАРТОФЕЛЬНЫЙ САЛЮТ ТУТ ---
    if (clientX && clientY && typeof spawnPotatoParticle === 'function') {
        spawnPotatoParticle(clientX, clientY);
    }
    // ----------------------------------------

    const coinCenterX = coinRect.left + coinRect.width / 2;
    const coinCenterY = coinRect.top + coinRect.height / 2;

    const offsetX = (clientX - coinCenterX) / (coinRect.width / 2);
    const offsetY = (clientY - coinCenterY) / (coinRect.height / 2);

    const rotateY = offsetX * 20;
    const rotateX = -offsetY * 20;

    coin.style.transform = `scale(0.95) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    setTimeout(() => {
        coin.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    }, 100);
}
// <--- ЗДЕСЬ БЫЛА ОШИБКА (нужно закрыть скобку)

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

////////////    ТЕКСТ CRITICAL ///////////////////////
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




////////////////   УРОВНИ ///////////////////////

function renderLevelsRoadmap() {
    const container = document.getElementById('levels-roadmap');
    if (!container) return;
    container.innerHTML = '';

    // === БЛОК СТАТИСТИКИ ===
    const statsHeader = document.createElement('div');
    statsHeader.style = "display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px;";

    // Берем данные (убедись, что переменные созданы в начале скрипта)
    const clicks = (window.totalClicks || 0).toLocaleString();
    const airdrops = (window.airdropCount || 0).toLocaleString();
    const totalEarned = (window.totalPotatoEarned || 0).toLocaleString();

    statsHeader.innerHTML = `
        <div class="level-item" style="padding: 10px; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 10px; color: #888;">КЛИКИ</span>
            <span style="color: #ffd700; font-weight: 900;">${clicks}</span>
        </div>
        <div class="level-item" style="padding: 10px; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 10px; color: #888;">КОРОБКИ</span>
            <span style="color: #ffd700; font-weight: 900;">${airdrops}</span>
        </div>
        <div class="level-item" style="grid-column: span 2; padding: 10px; flex-direction: column; align-items: center; gap: 4px;">
            <span style="font-size: 10px; color: #888;">ВСЕГО ДОБЫТО КАРТОШКИ</span>
            <span style="color: #ffd700; font-weight: 900;">${totalEarned} 🥔</span>
        </div>
    `;
    container.appendChild(statsHeader);

    // === СПИСОК УРОВНЕЙ ===
    levelsData.forEach((data) => {
        const isReached = userLevel > data.lvl;
        const isCurrent = userLevel === data.lvl;
        const isLocked = userLevel < data.lvl;

        let percent = isReached ? 100 : (isCurrent ? Math.min((userXP / xpToNextLevel) * 100, 100) : 0);
        let counterText = isReached ? "ЗАВЕРШЕНО" : (isCurrent ? `${Math.floor(userXP)} / ${xpToNextLevel} XP` : `Закрыто`);

        const item = document.createElement('div');
        item.className = `level-item ${isReached ? 'reached' : ''} ${isCurrent ? 'current' : ''}`;

        item.innerHTML = `
            <div class="lvl-num">${data.lvl}</div>
            <div class="lvl-info">
                <h3>${data.name || "Уровень " + data.lvl}</h3>
                <div class="lvl-mini-progress-bg">
                    <div class="lvl-mini-progress-fill" style="width: ${percent}%"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                    <span style="font-size: 10px; color: #888;">${counterText}</span>
                    <!-- НАГРАДА -->
                    <span style="font-size: 10px; color: #ffd700; font-weight: bold;">
                        🎁 ${data.reward ? data.reward.toLocaleString() : '---'} 🥔
                    </span>
                </div>
            </div>
            <div class="lvl-status">${isReached ? '✅' : (isCurrent ? '🔥' : '🔒')}</div>
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
        cloverLevel, honeyLevel: energyRegenSpeed,passiveIncome: passiveIncome,ownedBusiness: window.ownedBusiness,
        lastLoginDate: window.lastLoginDate, dailyStreak: window.dailyStreak,airdropCount: window.airdropCount || 0,
        totalEnergySpent: window.totalEnergySpent || 0, totalClicks: window.totalClicks || 0,
        totalPotatoEarned: window.totalPotatoEarned || 0

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
        energyRegenSpeed = data.honeyLevel || 1;
        honeyCost = data.honeyCost || 1000;
        usedBonusCodes = data.usedBonusCodes || [];
        window.airdropCount = data.airdropCount || 0;
        window.totalEnergySpent = data.totalEnergySpent || 0;
        window.airdropLvl = parseInt(localStorage.getItem('airdropLvl')) || 0;

        window.totalClicks = Number(data.totalClicks) || 0;
        window.totalPotatoEarned = Number(data.totalPotatoEarned) || 0;

        const lastLoginTime = data.lastLogin || Date.now();
        const secondsPassed = Math.floor((Date.now() - lastLoginTime) / 1000);

        // --- ДОБАВЛЯЕМ: Начисление за время отсутствия ---
        // Внутри loadGame, там где считается доход за время отсутствия:
    if (secondsPassed > 60 && passiveIncome > 0) {
    // Вычисляем ЧЕСТНЫЙ доход за время отсутствия
    const earned = (secondsPassed * (passiveIncome / 3600));

    // Начисляем на баланс
    clickCount += earned;

    // ПЛЮСУЕМ В СТАТИСТИКУ (Только если это число адекватное!)
    if (!isNaN(earned) && earned > 0) {
        window.totalPotatoEarned = (window.totalPotatoEarned || 0) + earned;
    }

    console.log(`Оффлайн доход: ${Math.floor(earned)} 🥔 за ${secondsPassed} сек.`);
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
        window.airdropCount = 0;
        window.totalEnergySpent = 0;
    }

    if(scoreElem) scoreElem.textContent = Math.floor(clickCount);
    // Обновляем энергию в формате (34 / 100)
    if(energyElem) energyElem.textContent = `⚡ ${Math.floor(energy)} / ${maxEnergy}`;

        updateCoinImage();
    updateProgress();

    // Обновляем аватарку в шапке при загрузке
    if (typeof updateHeaderAvatar === 'function') updateHeaderAvatar();

    // --- ЕЖЕДНЕВНЫЕ НАГРАДЫ (Daily Reward) ---
        // В конце loadGame вместо старого кода:
    const now = new Date();
    const today = now.toDateString();
    const savedData = saved ? JSON.parse(saved) : {};

    const nextLevel = levelsData.find(l => l.lvl === userLevel + 1);
    xpToNextLevel = nextLevel ? nextLevel.xpRequired : 999999999;

    window.lastLoginDate = savedData.lastLoginDate || "";
    window.dailyStreak = savedData.dailyStreak || 1;
    // Новая переменная: забрал ли уже сегодня?
    window.dailyClaimedToday = (window.lastLoginDate === today);

    // Если пропустил день (заходил не вчера и не сегодня) - сброс
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (window.lastLoginDate !== yesterday.toDateString() && window.lastLoginDate !== today) {
        window.dailyStreak = 1;
    }

    // Если сегодня зашел впервые за день и это новый стрик — обновляем дату (но не claimed)
    if (window.lastLoginDate !== today && window.lastLoginDate === yesterday.toDateString()) {
        window.dailyStreak = (window.dailyStreak % dailyRewards.length) + 1;
        window.lastLoginDate = today; // Обновим при сохранении
    }
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

function spawnPotatoParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle-potato';
    particle.innerText = '🥔'; // Или путь к твоей картинке: <img src="...">

    // Генерируем случайный разлет
    const tx = (Math.random() - 0.5) * 200 + 'px'; // Влево-вправо на 100px
    const ty = (Math.random() * -150 - 50) + 'px'; // Всегда вверх на 50-200px
    const tr = (Math.random() * 360) + 'px';       // Случайный поворот

    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.setProperty('--tr', tr);

    // Ставим в точку клика
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.body.appendChild(particle);

    // Удаляем после анимации
    setTimeout(() => particle.remove(), 800);
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

// Проверяем, нет ли уже запущенного таймера
// В самом низу файла, вне всех функций
if (!window.incomeIntervalID) {
    window.incomeIntervalID = setInterval(() => {
        const pIncome = Number(passiveIncome) || 0;
        if (pIncome > 0) {
            const incomePerSecond = pIncome / 3600;
            clickCount = (Number(clickCount) || 0) + incomePerSecond;
            window.totalPotatoEarned = (Number(window.totalPotatoEarned) || 0) + incomePerSecond;

            const scoreElemLocal = document.getElementById('score');
            if (scoreElemLocal) {
                scoreElemLocal.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
            }

            if (typeof currentTab !== 'undefined' && currentTab === 'levels') {
                const statsCards = document.querySelectorAll('.level-item');
                if (statsCards && statsCards.length >= 3) {
                    const totalDisplay = statsCards[2].querySelector('span:last-child');
                    if (totalDisplay) {
                        totalDisplay.textContent = Math.floor(window.totalPotatoEarned).toLocaleString('ru-RU') + " 🥔";
                    }
                }
            }
        }
    }, 1000);
}





    // Таймер АВТОСОХРАНЕНИЯ (раз в 5 сек)
    setInterval(saveGame, 5000);
});

