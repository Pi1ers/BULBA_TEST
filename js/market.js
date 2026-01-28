// Функция запускается только когда страница полностью загружена
window.addEventListener('load', () => {
    generateShopCards();
});

// Генерирует все карточки на рынке
function generateShopCards() {
    const grid = document.getElementById('level-shop-grid');
    if (!grid || typeof levelCosts === 'undefined' || typeof coinImages === 'undefined') {
        console.error("Данные игры не загружены!");
        return;
    }

    grid.innerHTML = '';

    // Начинаем с i = 0, чтобы сгенерировать все 11 карточек
    for (let i = 0; i < levelCosts.length; i++) {
        const cost = levelCosts[i];
        const imageUrl = coinImages[i];

        const card = document.createElement('div');
        card.className = 'shop-card';
        // Привязываем клик (он будет отключен для level 0 в updateCardStatuses)
        card.onclick = () => openMarketModal(i);

        card.innerHTML = `
            <img src="${imageUrl}" alt="Уровень ${i}">
            <h3>Уровень ${i}</h3>
            <span class="price-tag">${cost}</span>
        `;
        grid.appendChild(card);
    }
    updateCardStatuses();
}

// Обновляет статус карточек (куплено/доступно/недоступно)
function updateCardStatuses() {
    const cards = document.querySelectorAll('.shop-card');
    cards.forEach(card => {
        const titleText = card.querySelector('h3').innerText;
        const cardLevel = parseInt(titleText.replace('Уровень ', ''));

        card.classList.remove('bought');

        if (cardLevel <= level) {
            // Если уровень уже куплен (включая стартовый 0)
            card.classList.add('bought');
            card.querySelector('.price-tag').innerText = 'КУПЛЕНО';
            card.onclick = null; // Делаем некликабельным
        } else {
             // Все остальные уровни показываем с ценой и делаем кликабельными
            const cost = levelCosts[cardLevel];
            card.querySelector('.price-tag').innerText = cost;
            card.onclick = () => openMarketModal(cardLevel);
        }
    });
}

// Открывает модальное окно товара
function openMarketModal(targetLevel) {
     // Добавляем защиту: если куплено, не открываем модалку
    if (targetLevel <= level) return;

    const modal = document.getElementById('shop-modal');
    if (!modal) return;

    // ... (остальной код модалки без изменений) ...
    const cost = levelCosts[targetLevel];
    const buyBtn = document.getElementById('modal-buy-btn');

    document.getElementById('modal-title').innerText = `Купить уровень ${targetLevel}`;
    document.getElementById('modal-desc').innerText = `Разблокирует новый дизайн монеты!`;
    document.getElementById('modal-price').innerText = cost;
    document.getElementById('modal-img').src = coinImages[targetLevel];

    if (clickCount >= cost) {
        buyBtn.disabled = false;
        buyBtn.innerText = "КУПИТЬ";
        buyBtn.style.opacity = "1";
        buyBtn.onclick = () => buyNextLevel(targetLevel);
    } else {
        buyBtn.disabled = true;
        buyBtn.innerText = "МАЛО КАРТОШКИ";
        buyBtn.style.opacity = "0.5";
        buyBtn.onclick = null;
    }

    modal.style.display = 'flex';
}

function closeMarketModal() {
    document.getElementById('shop-modal').style.display = 'none';
}

// Логика покупки
function buyNextLevel(targetLevel) {
    const cost = levelCosts[targetLevel];
    if (clickCount >= cost) {
        clickCount -= cost;
        level = targetLevel;

        if (typeof scoreElem !== 'undefined') scoreElem.textContent = clickCount;
        if (typeof updateCoinImage === 'function') updateCoinImage();

        closeMarketModal();
        updateCardStatuses();

        if (typeof switchTab === 'function') switchTab('screen-farm');

        alert(`Уровень ${level} разблокирован!`);
    }
}
