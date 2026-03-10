// Запуск при загрузке страницы
window.addEventListener('load', () => {
    generateShopCards();
});

function getBusinessStats(basePrice, baseProfit, level) {
    return {
        // Цена растет в 1.5 раза за уровень
        nextPrice: Math.floor(basePrice * Math.pow(1.5, level)),
        // Прибыль растет на +20% от базы за уровень
        nextProfitBonus: Math.floor(baseProfit * (1 + level * 0.2))
    };
}

// Переключение вкладок Магазина
function showMarketTab(tabName, btnElement) {
    // 1. Список всех сеток, которые у нас есть в HTML
    const gridIds = ['level-shop-grid', 'boost-shop-grid', 'business-shop-grid'];

    // 2. Скрываем все сетки
    gridIds.forEach(id => {
        const grid = document.getElementById(id);
        if (grid) grid.style.display = 'none';
    });

    // 3. Показываем нужную сетку
    const targetId = tabName + '-shop-grid';
    const targetGrid = document.getElementById(targetId);
    if (targetGrid) {
        targetGrid.style.display = 'grid';
    } else {
        console.error("Не нашли сетку с ID:", targetId);
    }

    // 4. Переключаем подсветку кнопок
    const allBtns = document.querySelectorAll('.market-tabs .tab-btn');
    allBtns.forEach(btn => btn.classList.remove('active'));

    if (btnElement) {
        btnElement.classList.add('active');
    }

    // 5. Запускаем отрисовку контента для этой вкладки
    if (tabName === 'level') generateShopCards();
    if (tabName === 'boost') generateBoostCards();
    if (tabName === 'business') renderBusinessShop();
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
        card.onclick = () => openSkinModal(i);

      card.innerHTML = `
    <div class="coin-main-row">
        <img src="${skin.url}" class="coin-img-large">
        <div class="coin-title">${skin.name}</div>
    </div>
    <div class="coin-price-row">
        <span>🥔 ${cost.toLocaleString()}</span>
    </div>
`;


        grid.appendChild(card);

    }
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

function openSkinModal(i) {
    const modal = document.getElementById('skin-modal');
    if (!modal) {
        alert("Ошибка: модалка skin-modal не найдена в HTML!");
        return;
    }

    const skin = coinSkinsData[i];
    const cost = levelCosts[i];

    // Заполняем текст
    document.getElementById('skin-modal-title').innerText = skin.name;
    document.getElementById('skin-modal-desc').innerText = skin.desc || "Новый скин!";
    document.getElementById('skin-modal-price').innerText = cost.toLocaleString();

    // Заполняем иконку/картинку
    const iconBox = document.getElementById('skin-modal-icon');
    iconBox.innerHTML = `<img src="${skin.url}" style="width:120px; height:120px; object-fit:contain;">`;

    // Логика кнопки (чистим и вешаем заново)
    const oldBtn = document.getElementById('skin-modal-buy-btn');
    const buyBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(buyBtn, oldBtn);

    // Проверяем, куплен ли
    if (purchasedSkins.includes(i)) {
        buyBtn.innerText = (i === currentCoinSkin) ? "ВЫБРАНО" : "ВЫБРАТЬ";
        buyBtn.onclick = () => {
            currentCoinSkin = i;
            updateCoinImage();
            saveGame();
            closeSkinModal();
            generateShopCards();
        };
    } else {
        buyBtn.innerText = "КУПИТЬ";
        buyBtn.onclick = () => {
            if (clickCount >= cost) {
                clickCount -= cost;
                purchasedSkins.push(i);
                currentCoinSkin = i;
                updateCoinImage();
                saveGame();
                closeSkinModal();
                generateShopCards();
            } else {
                alert("Мало картошки!");
            }
        };
    }

    // ВКЛЮЧАЕМ ВИДИМОСТЬ
    modal.style.display = 'flex';
}

function closeSkinModal() {
    document.getElementById('skin-modal').style.display = 'none';
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

function openUModal(item, type) {
    const modal = document.getElementById('u-modal');
    if (!modal) return;

    // 1. Очистка кнопки (Клон), чтобы не покупались старые товары
    const oldBtn = document.getElementById('u-modal-buy-btn');
    const buyBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(buyBtn, oldBtn);

    // 2. Заполнение данных
    document.getElementById('u-modal-title').innerText = item.name;
    document.getElementById('u-modal-desc').innerText = item.desc || "Улучшение для твоей фермы!";
    document.getElementById('u-modal-icon').innerText = item.icon || '🥔';

    const statsRow = document.getElementById('u-modal-stats');
    let price = 0;

    if (type === 'business') {
        statsRow.style.display = 'flex';
        const lvl = window.ownedBusiness[item.id] || 0;
        const stats = getBusinessStats(item.basePrice, item.baseProfit, lvl);
        price = stats.nextPrice;

        document.getElementById('u-modal-profit').innerText = `+${stats.nextProfitBonus} 🥔/ч`;
        document.getElementById('u-modal-lvl').innerText = lvl;
        document.getElementById('u-modal-btn-text').innerText = "УЛУЧШИТЬ ЗА ";

        buyBtn.onclick = () => {
            if (clickCount >= price) { buyBusiness(item.id); closeUModal(); }
            else { shakeModal('#u-modal .calendar-card'); }
        };
    }
    else if (type === 'boost') {
        statsRow.style.display = 'none';
        price = item.basePrice || item.price;
        document.getElementById('u-modal-btn-text').innerText = "ПРОКАЧАТЬ ЗА ";

        buyBtn.onclick = () => {
            if (clickCount >= price) { buyBoost(item.id); closeUModal(); }
            else { shakeModal('#u-modal .calendar-card'); }
        };
    }

    document.getElementById('u-modal-price').innerText = price.toLocaleString();
    modal.style.display = 'flex';
}

function closeUModal() { document.getElementById('u-modal').style.display = 'none'; }




// === УЛУЧШЕНИЯ (BOOSTS) ===
function generateBoostCards() {
    const grid = document.getElementById('boost-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let cloverPrice = "MAX";
    if (typeof cloverCosts !== 'undefined' && cloverLevel < cloverCosts.length) {
        cloverPrice = cloverCosts[cloverLevel];
    }

        // ИСПРАВЛЕННЫЙ БЛОК ДЛЯ МЁДА
    let honeyPrice = "MAX";
    // Используем energyRegenSpeed вместо honeyLevel
    if (typeof honeyCosts !== 'undefined' && typeof energyRegenSpeed !== 'undefined' && energyRegenSpeed < honeyCosts.length) {
        honeyPrice = honeyCosts[energyRegenSpeed];
    }

    let storagePrice = "MAX";
    if (typeof storageUpgradeCosts !== 'undefined' && storageLevel < storageUpgradeCosts.length) {
    storagePrice = storageUpgradeCosts[storageLevel];
}

    // ВОТ ТУТ ОШИБКА: проверь, чтобы везде стояли правильные названия
    const boosts = [
        { id: 'click', name: 'СИЛА КЛИКА', desc: `Урон: ${clickPower}`, price: boostClickCost, icon: '🎯', lvl: clickPower },
        { id: 'energy', name: 'ЗАПАС ЭНЕРГИИ', desc: `Макс: ${maxEnergy}`, price: boostEnergyCost, icon: '⚡', lvl: Math.floor((maxEnergy - 100) / 50) + 1 },
        { id: 'clover', name: 'КЛЕВЕР УДАЧИ', desc: `Шанс: ${Math.round(criticalChance * 100)}%`, price: (typeof cloverCosts !== 'undefined' ? cloverCosts[cloverLevel] : 'MAX'), icon: '🍀', lvl: cloverLevel },
        { id: 'honey',  name: 'БОЧКА МЁДА', desc: `Реген: +${energyRegenSpeed}`, price: honeyCost , icon: '🍯', lvl: energyRegenSpeed},
        {id: 'airdrop', name: 'СБРОС ПРОВИЗИИ', desc: `Бонус: ${airdropTiers[Math.min((window.airdropLvl || 0) + 1, 10)].min}-${airdropTiers[Math.min((window.airdropLvl || 0) + 1, 10)].max} 🥔`,
        price: airdropUpgradePrices[(window.airdropLvl || 0) + 1] || "MAX",  icon: '🚁', lvl: window.airdropLvl || 0}
    ];

         boosts.forEach(boost => {
        const card = document.createElement('div');
        card.className = 'boost-card';
        card.onclick = () => openUModal(boost, 'boost');

        card.innerHTML = `
            <div class="boost-header">
                <div class="boost-left">
                    <div class="boost-icon-box">${boost.icon}</div>
                </div>
                <div class="boost-right">
                    <div class="boost-name">${boost.name}</div>
                    <div class="boost-desc">${boost.desc}</div>
                </div>
            </div>
            <div class="boost-divider"></div>
            <div class="boost-footer">
                <div class="boost-lvl">Ур. ${boost.lvl}</div>
                <div class="boost-footer-divider"></div>
                <div class="boost-price">
                    <span>🥔 ${boost.price.toLocaleString()}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

//////////////////////////// БУСТЫ //////////////
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
    // 1. ЛОГИКА ДЛЯ КЛИКА
    if (type === 'click' && clickCount >= boostClickCost) {
        clickCount -= boostClickCost;
        clickPower += 1;
        boostClickCost = Math.round(boostClickCost * 1.5);
    }
    // 2. ЛОГИКА ДЛЯ ЭНЕРГИИ
    else if (type === 'energy' && clickCount >= boostEnergyCost) {
        clickCount -= boostEnergyCost;
        maxEnergy += 50;
        energy = maxEnergy; // Бонус: восполняем при покупке
        boostEnergyCost = Math.round(boostEnergyCost * 1.5);
    }
    // 3. ЛОГИКА ДЛЯ КЛЕВЕРА
    else if (type === 'clover') {
        const currentCost = cloverCosts[cloverLevel];
        if (cloverLevel < cloverCosts.length && clickCount >= currentCost) {
            clickCount -= currentCost;
            cloverLevel++;
            criticalChance += 0.05;
        } else { return; }
    }
    // 4. ЛОГИКА ДЛЯ МЁДА
     else if (type === 'honey') {
        if (clickCount >= honeyCost) {
            clickCount -= honeyCost;
            energyRegenSpeed += 1; // Повышаем уровень регена
            honeyCost = Math.round(honeyCost * 2.5); // Цена растет
            console.log("Мёд куплен! Реген: " + energyRegenSpeed);
        } else {
            alert("Маловато картошки! 🥔");
            return;
        }
    }

    // 5. ЛОГИКА ДЛЯ ВЕРТОЛЕТА (АИРДРОПА) ПРИ ПОКУПКЕ
else if (type === 'airdrop') {
    const currentLvl = window.airdropLvl || 0;
    const nextLvl = currentLvl + 1;

    // Проверка на лимит (10 уровней)
    if (nextLvl >= airdropUpgradePrices.length) {
        alert("Вертолет прокачан на максимум! 🚁✨");
        return;
    }

    // Берем цену из массива цен
    const cost = airdropUpgradePrices[nextLvl];

    if (clickCount >= cost) {
        clickCount -= cost;

        // ПОВЫШАЕМ УРОВЕНЬ ГЛОБАЛЬНО
        window.airdropLvl = nextLvl;
        localStorage.setItem('airdropLvl', window.airdropLvl);

        console.log(`Вертолет улучшен до уровня: ${window.airdropLvl}`);

        // После этого код пойдет дальше к ОБЩИМ ДЕЙСТВИЯМ (saveGame, generateBoostCards)
    } else {
        if (typeof shakeModal === 'function') shakeModal('#u-modal .calendar-card');
        return; // Денег мало — выходим
    }
}



    // ОБЩИЕ ДЕЙСТВИЯ ПОСЛЕ ПОКУПКИ
    saveGame();
    if (typeof updateProgress === 'function') updateProgress();
    if (typeof scoreElem !== 'undefined') scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');

    closeMarketModal(); // Закрываем модалку
    generateBoostCards(); // Перерисовываем магазин, чтобы цены обновились
}


// === ПЕРЕСЧЕТ ПАССИВНОГО ДОХОДА ===
function recalculatePassiveIncome() {
    let total = 0;
    // Проверка на существование данных
    if (typeof businessCards === 'undefined' || !window.ownedBusiness) return;

    businessCards.forEach(card => {
        // ИСПОЛЬЗУЕМ Number() И || 0 - это спасет от NaN
        let lvl = Number(window.ownedBusiness[card.id]) || 0;
        if (lvl > 0) {
            let bonusMultiplier = 1 + (lvl - 1) * 0.2;
            total += Math.floor(card.baseProfit * bonusMultiplier);
        }
    });

    passiveIncome = total;

    const profitHourElem = document.getElementById('profit-per-hour');
    if (profitHourElem) {
        profitHourElem.innerText = "+" + Math.floor(total).toLocaleString('ru-RU');
    }
}

// === ПОКУПКА БИЗНЕСА ===
function buyBusiness(cardId) {
    const card = businessCards.find(c => c.id === cardId);
    if (!card) return;

    // ГАРАНТИРУЕМ ЧИСЛА
    let currentLvl = Number(window.ownedBusiness[cardId]) || 0;
    let currentPrice = Math.floor(card.basePrice * Math.pow(1.5, currentLvl));
    let myMoney = Number(clickCount) || 0;

    if (myMoney >= currentPrice) {
        clickCount = myMoney - currentPrice;
        window.ownedBusiness[cardId] = currentLvl + 1;

        recalculatePassiveIncome();
        saveGame();
        updateProgress();
        renderBusinessShop();

        console.log(`Куплено! Уровень: ${currentLvl + 1}, Цена след: ${Math.floor(currentPrice * 1.5)}`);
    } else {
        // Используем твою функцию тряски, если она есть
        if (typeof shakeModal === 'function') {
            shakeModal('#u-modal .calendar-card');
        } else {
            alert("Недостаточно картошки!");
        }
    }
}




function renderBusinessShop() {
    const grid = document.getElementById('business-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    businessCards.forEach(card => {
        let currentLvl = (window.ownedBusiness && window.ownedBusiness[card.id]) ? window.ownedBusiness[card.id] : 0;
        let currentPrice = Math.floor(card.basePrice * Math.pow(1.15, currentLvl));
        let currentProfit = Math.floor(card.baseProfit * (1 + currentLvl * 0.2));
        // 1. ДОБАВЛЯЕМ ПРОВЕРКУ (Картинка или Эмодзи)
        const iconContent = (typeof card.icon === 'string' && card.icon.startsWith('http'))
            ? `<img src="${card.icon}" class="biz-img-icon">`
            : card.icon;

        const item = document.createElement('div');
        item.className = 'business-card';
        item.onclick = () => openUModal(card, 'business');

        // 2. ВСТАВЛЯЕМ iconContent ВМЕСТО card.icon
        item.innerHTML = `
            <div class="biz-header">
                <div class="biz-left">
                    <div class="biz-icon-box">${iconContent}</div>
                </div>
                <div class="biz-right">
                    <div class="biz-name">${card.name}</div>
                    <div class="biz-profit-title">ПРИБЫЛЬ В ЧАС</div>
                    <div class="biz-profit-num">
                        <span>🥔 +${currentProfit.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="biz-divider"></div>

            <div class="biz-footer">
                <div class="biz-lvl">Ур. ${currentLvl}</div>
                <div class="biz-footer-divider"></div>
                <div class="biz-price">
                    <span>🥔 ${currentPrice.toLocaleString()}</span>
                </div>
            </div>
        `;
        grid.appendChild(item);
    });
}

function shakeModal(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    el.classList.add('shake-anim');
    setTimeout(() => {
        el.classList.remove('shake-anim');
    }, 500);
}


// КРЕСТИК ТЕПЕРЬ РАБОТАЕТ
function closeMarketModal() {
    const modal = document.getElementById('shop-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}


