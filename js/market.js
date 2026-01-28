// Функция запускается только когда страница полностью загружена
window.addEventListener('load', () => {
    generateShopCards();
});

// Генерирует все карточки на рынке
// Генерирует все карточки на рынке
function generateShopCards() {
    const grid = document.getElementById('level-shop-grid');
    // ... (остальной код проверки grid и массивов) ...
    grid.innerHTML = '';

    for (let i = 2; i < levelCosts.length; i++) {
        const cost = levelCosts[i];
        const imageUrl = coinImages[i - 1];

        const card = document.createElement('div');
        card.className = 'shop-card';
        // Пока не привязываем onclick здесь, сделаем это в updateCardStatuses

        card.innerHTML = `
            <img src="${imageUrl}" alt="Уровень ${i}">
            <h3>Уровень ${i}</h3>
            <span class="price-tag">${cost}</span>
        `;
        grid.appendChild(card);
    }
    updateCardStatuses(); // Запускаем обновление статусов сразу после генерации
}

// Обновляет статус карточек (куплено/не куплено/недоступно)
function updateCardStatuses() {
    const cards = document.querySelectorAll('.shop-card');
    cards.forEach(card => {
        const titleText = card.querySelector('h3').innerText;
        const cardLevel = parseInt(titleText.replace('Уровень ', ''));
        const cost = levelCosts[cardLevel];

        // Сбрасываем все статусы
        card.classList.remove('bought', 'unavailable-card');
        card.onclick = null; // Сбрасываем обработчик клика

        if (cardLevel <= level) {
            // Если уровень уже куплен
            card.classList.add('bought');
            card.querySelector('.price-tag').innerText = 'КУПЛЕНО';
        } else if (clickCount >= cost) {
            // Если монет хватает, но уровень не куплен - делаем активным
            card.onclick = () => openMarketModal(cardLevel);
        } else {
            // Если монет не хватает - делаем серым и некликабельным
            card.classList.add('unavailable-card');
            card.querySelector('.price-tag').innerText = cost;
        }
    });
}


// Открывает модальное окно товара
function openMarketModal(targetLevel) {
    const modal = document.getElementById('shop-modal');
    if (!modal) return;

    const cost = levelCosts[targetLevel];
    const buyBtn = document.getElementById('modal-buy-btn');

    document.getElementById('modal-title').innerText = `Купить уровень ${targetLevel}`;
    document.getElementById('modal-desc').innerText = `Разблокирует новый дизайн монеты!`;
    document.getElementById('modal-price').innerText = cost;
    document.getElementById('modal-img').src = coinImages[targetLevel - 1];

    // Проверяем, хватает ли монет
    if (clickCount >= cost) {
        buyBtn.classList.remove('unavailable'); // Кнопка активна
        buyBtn.innerText = "КУПИТЬ";
        buyBtn.onclick = () => buyNextLevel(targetLevel);
    } else {
        buyBtn.classList.add('unavailable'); // Кнопка неактивна и серая
        buyBtn.innerText = "НЕДОСТАТОЧНО МОНЕТ";
        buyBtn.onclick = null; // Отключаем действие при клике
    }

    modal.style.display = 'flex';
}


// Закрывает модальное окно
function closeModal() {
    document.getElementById('shop-modal').style.display = 'none';
}

// Добавляем дубликат для совместимости с твоим HTML
function closeMarketModal() {
    closeModal();
}

// Логика покупки уровня
function buyNextLevel(targetLevel) {
    const cost = levelCosts[targetLevel];
    if (clickCount >= cost) {
        clickCount -= cost;
        level = targetLevel;
        scoreElem.textContent = clickCount;
        updateCoinImage();
        closeModal();
        updateCardStatuses();
        switchTab('screen-farm'); // Возвращаем на экран фарма
        saveUserData();
        alert(`Поздравляю! Уровень ${level} активирован!`);
    } else {
        alert("Недостаточно монет!");
    }
}
