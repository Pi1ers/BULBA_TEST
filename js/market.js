// Запуск при загрузке страницы
window.addEventListener('load', () => {
    generateShopCards();
});

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
        card.onclick = () => openMarketModal(i);

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

// Открывает модальное окно скина
function openMarketModal(data, type = 'skin') {
    const modal = document.getElementById('shop-modal');
    const buyBtn = document.getElementById('modal-buy-btn');
    if (!modal) return;

    let title, desc, price, img;

    if (type === 'skin') {
        // Логика для скинов (как у тебя была)
        const skin = coinSkinsData[data];
        title = skin.name;
        desc = skin.desc;
        price = levelCosts[data];
        img = skin.url;

        // Кнопка для скинов
        if (purchasedSkins.includes(data)) {
            buyBtn.innerText = (data === currentCoinSkin) ? "УЖЕ ВЫБРАН" : "ВЫБРАТЬ";
            buyBtn.disabled = (data === currentCoinSkin);
            buyBtn.onclick = () => {
                currentCoinSkin = data;
                updateCoinImage();
                closeMarketModal();
                saveGame();
            };
        } else {
            buyBtn.innerText = clickCount >= price ? "КУПИТЬ" : "МАЛО КАРТОШКИ";
            buyBtn.disabled = clickCount < price;
            buyBtn.onclick = () => buyAndSelectSkin(data, price);
        }
    }
         else if (type === 'business') {
        // 1. Уровень
        let currentLvl = window.ownedBusiness[data.id] || 0;
        price = Math.floor(data.basePrice * Math.pow(1.15, currentLvl));
        title = data.name;

        // ИСПРАВЛЕНО: берем baseProfit
        const displayProfit = data.baseProfit || 0;
        desc = `Приносит +${displayProfit.toLocaleString()} 🥔 в час.\nУровень: ${currentLvl}`;
        img = data.url || 'https://raw.githubusercontent.com';

        buyBtn.innerText = clickCount >= price ? "УЛУЧШИТЬ" : "МАЛО КАРТОШКИ";
        buyBtn.disabled = clickCount < price;
        buyBtn.onclick = () => {
            buyBusiness(data.id);
            closeMarketModal();
        };
    }



    // Заполняем поля
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-desc').innerText = desc;
    // Тут мы используем (price || 0), чтобы даже если что-то пойдет не так,
    // код не падал, а просто рисовал "0"
    document.getElementById('modal-price').innerText = (price || 0).toLocaleString();

    document.getElementById('modal-img').src = img;

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

    let cloverPrice = "MAX";
    if (typeof cloverCosts !== 'undefined' && cloverLevel < cloverCosts.length) {
        cloverPrice = cloverCosts[cloverLevel];
    }

    let honeyPrice = "MAX";
    if (typeof honeyCosts !== 'undefined' && honeyLevel < honeyCosts.length) {
        honeyPrice = honeyCosts[honeyLevel];
    }
    let storagePrice = "MAX";
    if (typeof storageUpgradeCosts !== 'undefined' && storageLevel < storageUpgradeCosts.length) {
    storagePrice = storageUpgradeCosts[storageLevel];
}

    // ВОТ ТУТ ОШИБКА: проверь, чтобы везде стояли правильные названия
    const boosts = [
        { id: 'click', name: 'СИЛА КЛИКА', desc: `Урон: ${clickPower}`, price: boostClickCost, icon: '🎯', lvl: clickPower },
        { id: 'energy', name: 'ЗАПАС ЭНЕРГИИ', desc: `Макс: ${maxEnergy}`, price: boostEnergyCost, icon: '⚡', lvl: (maxEnergy/100) },
        { id: 'clover', name: 'КЛЕВЕР УДАЧИ', desc: `Шанс: ${Math.round(criticalChance * 100)}%`, price: (typeof cloverCosts !== 'undefined' ? cloverCosts[cloverLevel] : 'MAX'), icon: '🍀', lvl: cloverLevel },
        { id: 'honey', name: 'БОЧКА МЁДА', desc: `Реген: +${energyRegenSpeed}`, price: (typeof honeyCosts !== 'undefined' ? honeyCosts[honeyLevel] : 'MAX'), icon: '🍯', lvl: honeyLevel }
    ];

        boosts.forEach(boost => {
        const card = document.createElement('div');
        card.className = 'boost-card';
        card.onclick = () => openBoostModal(boost);

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
    else if (type === 'clover') {
    if (cloverLevel < cloverCosts.length) {
        const currentCost = cloverCosts[cloverLevel];

        if (clickCount >= currentCost) {
            clickCount -= currentCost;
            cloverLevel++; // Повышаем уровень
            criticalChance += 0.05; // Повышаем шанс
            saveGame();
        } else {
            alert("Маловато картошки!");
        }
    } else {
        alert("Максимальный уровень удачи!");
    }
}
    else if (type === 'honey' && clickCount >= honeyCost) {
        clickCount -= honeyCost;
        energyRegenSpeed += 1; // Увеличиваем силу регена
        honeyCost = Math.round(honeyCost * 2.5);
        saveGame();
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


function buyBusiness(cardId) {
    const card = businessCards.find(c => c.id === cardId);
    if (!card) return;

    let currentLvl = (window.ownedBusiness && window.ownedBusiness[cardId]) ? window.ownedBusiness[cardId] : 0;
    let currentPrice = Math.floor(card.basePrice * Math.pow(1.15, currentLvl));

    if (clickCount >= currentPrice) {
        clickCount -= currentPrice;
        window.ownedBusiness[cardId] = currentLvl + 1;

        // ИСПРАВЛЕНО: используем baseProfit
        let addProfit = Number(card.baseProfit) || 0;
        passiveIncome = (Number(passiveIncome) || 0) + addProfit;

        saveGame();
        updateProgress();
        renderBusinessShop();
    } else {
        alert("Нужно больше Бульбы!");
    }
}




function renderBusinessShop() {
    const grid = document.getElementById('business-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    businessCards.forEach(card => {
        let currentLvl = (window.ownedBusiness && window.ownedBusiness[card.id]) ? window.ownedBusiness[card.id] : 0;
        let currentPrice = Math.floor(card.basePrice * Math.pow(1.15, currentLvl));

        const item = document.createElement('div');
        item.className = 'business-card';
        item.onclick = () => openMarketModal(card, 'business');
        item.innerHTML = `
    <div class="biz-header">
        <div class="biz-left">
            <div class="biz-icon-box">${card.icon}</div>
        </div>
        <div class="biz-right">
            <div class="biz-name">${card.name}</div>
            <div class="biz-profit-title">ПРИБЫЛЬ В ЧАС</div>
            <div class="biz-profit-num">
                <span>🥔 +${card.baseProfit.toLocaleString()}</span>
            </div>
        </div>
    </div> <!-- ВОТ ТУТ ДОЛЖЕН ЗАКРЫТЬСЯ HEADER -->

    <div class="biz-divider"></div> <!-- ПОЛОСКА СНАРУЖИ -->

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


// КРЕСТИК ТЕПЕРЬ РАБОТАЕТ
function closeMarketModal() {
    const modal = document.getElementById('shop-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}


