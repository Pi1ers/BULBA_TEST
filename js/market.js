// Запуск при загрузке страницы
window.addEventListener('load', () => {
    generateShopCards();
});

// Переключение вкладок Магазина
function showMarketTab(tabName) {
    const levelGrid = document.getElementById('level-shop-grid');
    const boostGrid = document.getElementById('boost-shop-grid');
    // Должен быть в HTML
    const bgGrid = document.getElementById('bg-shop-grid');
    const tabs = document.querySelectorAll('.tab-btn');

    // Проверка, чтобы скрипт не падал, если фон еще не добавлен в HTML
    if (!levelGrid || !boostGrid || !bgGrid) return;

    // Скрываем все сетки
    levelGrid.style.display = 'none';
    boostGrid.style.display = 'none';
    bgGrid.style.display = 'none';

    // Убираем подсветку со всех кнопок
    tabs.forEach(t => t.classList.remove('active'));

    if (tabName === 'levels') {
        levelGrid.style.display = 'grid';
        if(tabs[0]) tabs[0].classList.add('active'); // ПЕРВАЯ КНОПКА
        generateShopCards();
    } else if (tabName === 'boosts') {
        boostGrid.style.display = 'grid';
        if(tabs[1]) tabs[1].classList.add('active'); // ВТОРАЯ КНОПКА
        generateBoostCards();
    } else if (tabName === 'backgrounds') {
        bgGrid.style.display = 'grid';
        if(tabs[2]) tabs[2].classList.add('active'); // ТРЕТЬЯ КНОПКА
        generateBgCards();
    }
}

// Генерирует карточки скинов
function generateShopCards() {
    const grid = document.getElementById('level-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // ГЛАВНАЯ ПРОВЕРКА: видит ли функция массив из constants.js?
    if (typeof coinSkinsData === 'undefined') {
        console.error("Массив coinSkinsData не найден!");
        return;
    }

    for (let i = 0; i < levelCosts.length; i++) {
        const skin = coinSkinsData[i];
        const cost = levelCosts[i];

        const card = document.createElement('div');
        card.className = 'shop-card';
        card.onclick = () => openMarketModal(i); // По клику открываем покупку
        card.innerHTML = `
            <img src="${skin.url}">
            <h3>${skin.name}</h3>
            <span class="price-tag">${cost}</span>
        `;
        grid.appendChild(card);
    }
}


function applyBackground(url) {
    if (url === 'default' || !url) {
        // Просто УДАЛЯЕМ инлайновый фон, тогда сработает тот, что в CSS
        document.body.style.backgroundImage = 'none';
        currentBackgroundUrl = 'default';
    } else {
        // Ставим картинку только если это реальная ссылка
        document.body.style.backgroundImage = `url('${url}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        currentBackgroundUrl = url;
    }
    saveGame();
}


// Обновляет визуальное состояние карточек (Куплено/Надето)
function updateCardStatuses() {
    const cards = document.querySelectorAll('#level-shop-grid .shop-card');
    cards.forEach((card, index) => {
        card.classList.remove('bought', 'active-skin');

        // Проверяем через массив purchasedSkins (должен быть в game.js)
        if (typeof purchasedSkins !== 'undefined' && purchasedSkins.includes(index)) {
            card.classList.add('bought');

            if (index === currentCoinSkin) {
                card.classList.add('active-skin');
                card.querySelector('.price-tag').innerText = 'НАДЕТО';
            } else {
                card.querySelector('.price-tag').innerText = 'КУПЛЕНО';
            }
        } else {
            // Если не куплено — просто цена
            card.querySelector('.price-tag').innerText = levelCosts[index];
        }
    });
}

// Открывает модальное окно скина
function openMarketModal(targetSkinIndex) {
    const modal = document.getElementById('shop-modal');
    const buyBtn = document.getElementById('modal-buy-btn');
    if (!modal) return;

    const cost = levelCosts[targetSkinIndex];
    const skinData = coinSkinsData[targetSkinIndex];

    document.getElementById('modal-title').innerText = skinData.name;
    document.getElementById('modal-desc').innerText = skinData.desc;
    document.getElementById('modal-price').innerText = cost;
    document.getElementById('modal-img').src = skinData.url;

    // ГЛАВНАЯ ЛОГИКА КНОПКИ
    if (purchasedSkins.includes(targetSkinIndex)) {
        // Если уже куплено
        buyBtn.disabled = (targetSkinIndex === currentCoinSkin);
        buyBtn.innerText = (targetSkinIndex === currentCoinSkin) ? "УЖЕ ВЫБРАН" : "ВЫБРАТЬ";
        buyBtn.style.opacity = (targetSkinIndex === currentCoinSkin) ? "0.5" : "1";

        buyBtn.onclick = () => {
            currentCoinSkin = targetSkinIndex;
            if (typeof updateCoinImage === 'function') updateCoinImage();
            updateCardStatuses();
            closeMarketModal();
            saveGame();
        };
    } else {
        // Если еще НЕ куплено
        if (clickCount >= cost) {
            buyBtn.disabled = false;
            buyBtn.innerText = "КУПИТЬ И ВЫБРАТЬ";
            buyBtn.style.opacity = "1";
            buyBtn.onclick = () => buyAndSelectSkin(targetSkinIndex, cost);
        } else {
            buyBtn.disabled = true;
            buyBtn.innerText = "МАЛО КАРТОШКИ";
            buyBtn.style.opacity = "0.5";
        }
    }

    modal.style.display = 'flex';
}

// Функция покупки
function buyAndSelectSkin(skinIndex, cost) {
    if (clickCount >= cost) {
        clickCount -= cost;
        currentCoinSkin = skinIndex;

        // Добавляем в список купленных вещей
        if (!purchasedSkins.includes(skinIndex)) {
            purchasedSkins.push(skinIndex);
        }

        if (typeof scoreElem !== 'undefined') scoreElem.textContent = clickCount;
        if (typeof updateCoinImage === 'function') updateCoinImage();

        closeMarketModal();
        updateCardStatuses();
        saveGame();
    }
}

// === УЛУЧШЕНИЯ (BOOSTS) ===
function generateBoostCards() {
    const grid = document.getElementById('boost-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ЦЕНЫ (если массива нет, ошибки не будет)
    let currentPrice = "MAX";
    if (typeof autoFarmCosts !== 'undefined' && autoFarmLevel < autoFarmCosts.length) {
        currentPrice = autoFarmCosts[autoFarmLevel];
    }

    const boosts = [
        { id: 'click', name: 'СИЛА КЛИКА', desc: `+1 к клику. Сейчас: ${clickPower}`, price: boostClickCost, icon: '🎯' },
        { id: 'energy', name: 'ЗАПАС ЭНЕРГИИ', desc: `+50 к макс. Сейчас: ${maxEnergy}`, price: boostEnergyCost, icon: '⚡' },
        { id: 'autofarm', name: 'АВТО-ФЕРМА', desc: `+1 к/сек. Уровень: ${autoFarmLevel}`, price: currentPrice, icon: '🚜' }
    ];

    boosts.forEach(boost => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.onclick = () => openBoostModal(boost);
        card.innerHTML = `
            <div style="font-size: 40px; margin: 10px;">${boost.icon}</div>
            <h3>${boost.name}</h3>
            <span class="price-tag">${boost.price}</span>
        `;
        grid.appendChild(card);
    });
}


function openBoostModal(boost) {
    const modal = document.getElementById('shop-modal');
    const buyBtn = document.getElementById('modal-buy-btn');
    if (!modal) return;

    document.getElementById('modal-title').innerText = boost.name;
    document.getElementById('modal-desc').innerText = boost.desc;
    document.getElementById('modal-price').innerText = boost.price;
    document.getElementById('modal-img').src = "";

    if (clickCount >= boost.price) {
        buyBtn.disabled = false;
        buyBtn.innerText = "УЛУЧШИТЬ";
        buyBtn.style.opacity = "1";
        buyBtn.onclick = () => buyBoost(boost.id);
    } else {
        buyBtn.disabled = true;
        buyBtn.innerText = "МАЛО КАРТОШКИ";
        buyBtn.style.opacity = "0.5";
    }
    modal.style.display = 'flex';
}

function buyBoost(type) {
    if (type === 'click' && clickCount >= boostClickCost) {
        clickCount -= boostClickCost;
        clickPower += 1;
        boostClickCost = Math.round(boostClickCost * 1.5);
        saveGame();
    }
    // ДОБАВЛЕН ПРОБЕЛ ЗДЕСЬ
    else if (type === 'energy' && clickCount >= boostEnergyCost) {
        clickCount -= boostEnergyCost;
        maxEnergy += 50;
        boostEnergyCost = Math.round(boostEnergyCost * 1.5);
        saveGame()
    }
    // И ДОБАВЛЕН ПРОБЕЛ ЗДЕСЬ
    else if (type === 'autofarm') {
        // Проверяем, есть ли еще доступные цены в массиве
        if (autoFarmLevel < autoFarmCosts.length) {
            const currentCost = autoFarmCosts[autoFarmLevel]; // Берем цену из массива

            if (clickCount >= currentCost) {
                clickCount -= currentCost;
                autoClicksPerSecond += 1;
                autoFarmLevel += 1; // Увеличиваем уровень, чтобы в след. раз цена была выше
                // === ВАЖНО: Добавляем эти строки ===
                if (typeof updateFarmUI === 'function') updateFarmUI();
                saveGame();
            } else {
                return; // Денег не хватило
            }
        } else {
            return; // Максимальный уровень достигнут
        }
    }
    // ИЛИ ВОТ ТУТ
    else {
        return;
    }

    // Общие действия после любой успешной покупки
    if (typeof scoreElem !== 'undefined') scoreElem.textContent = clickCount;
    closeMarketModal();
    generateBoostCards();
    saveGame();
}
// КРЕСТИК ТЕПЕРЬ РАБОТАЕТ
function closeMarketModal() {
    const modal = document.getElementById('shop-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateBgCards() {
    const grid = document.getElementById('bg-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (typeof backgroundsData === 'undefined') {
        grid.innerHTML = '<p style="color:white; padding:20px;">Данные фонов не найдены</p>';
        return;
    }

    backgroundsData.forEach((bg, index) => {
        const card = document.createElement('div');
        card.className = 'shop-card';

        let isLocked = false;
        let priceText = bg.price + " 💰";

        // Проверка условий
        if (bg.type === 'achievement' && !unlockedAchievements.includes(bg.req)) {
            isLocked = true;
            priceText = "НУЖНА АЧИВКА";
        } else if (bg.type === 'level_buy' && userLevel < bg.req) {
            isLocked = true;
            priceText = "Lvl " + bg.req;
        }

        card.innerHTML = `
            <div style="width:100%; height:60px; background:url('${bg.url}') center/cover; border-radius:8px;"></div>
            <h3>${bg.name}</h3>
            <span class="price-tag">${priceText}</span>
        `;

        card.onclick = () => {
            if (isLocked) {
                alert("Условие не выполнено: " + priceText);
            } else {
                // Если фон куплен или бесплатен - применяем
                applyBackground(bg.url);
                alert("Фон применен!");
            }
        };
        grid.appendChild(card);
    });
}




