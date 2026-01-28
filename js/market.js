// Запуск при загрузке страницы
window.addEventListener('load', () => {
    generateShopCards();
});

// Генерирует все карточки на рынке
function generateShopCards() {
    const grid = document.getElementById('level-shop-grid');
    
    // Проверка наличия сетки и данных
    if (!grid) return;
    if (typeof levelCosts === 'undefined' || typeof coinImages === 'undefined') return;

    grid.innerHTML = '';

    // Цикл по уровням со 2 по 10
    for (let i = 2; i < levelCosts.length; i++) {
        const cost = levelCosts[i];
        const imageUrl = coinImages[i - 1];

        const card = document.createElement('div');
        card.className = 'shop-card';

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
    if (!cards.length) return;

    cards.forEach(card => {
        const titleText = card.querySelector('h3').innerText;
        const cardLevel = parseInt(titleText.replace('Уровень ', ''));
        const cost = levelCosts[cardLevel];
        
        // Сбрасываем старый статус, но оставляем кликабельность
        card.classList.remove('bought');
        // card.onclick = () => openMarketModal(cardLevel); // Клик теперь всегда активен

        if (cardLevel <= level) {
            // Если уровень уже куплен
            card.classList.add('bought');
            card.querySelector('.price-tag').innerText = 'КУПЛЕНО';
        } else {
            // Всегда показываем цену и даем нажать на карточку
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

    // Проверяем баланс и меняем только кнопку "Купить"
    if (clickCount >= cost) {
        buyBtn.classList.remove('unavailable'); // Активная кнопка
        buyBtn.innerText = "КУПИТЬ";
        buyBtn.onclick = () => buyNextLevel(targetLevel);
    } else {
        buyBtn.classList.add('unavailable'); // Неактивная кнопка (серая)
        buyBtn.innerText = "НЕДОСТАТОЧНО МОНЕТ"; // Текст меняется
        // Кнопка все еще может быть нажата, но функция buyNextLevel обработает баланс
        buyBtn.onclick = () => buyNextLevel(targetLevel); 
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
        
        // Обновляем UI в game.js
        if (typeof scoreElem !== 'undefined') scoreElem.textContent = clickCount;
        if (typeof updateCoinImage === 'function') updateCoinImage();
        
        closeMarketModal();
        updateCardStatuses();
        
        // Сохраняем в Firebase
        if (typeof saveUserData === 'function') saveUserData();
        
        // Если функция switchTab существует (в navigation.js)
        if (typeof switchTab === 'function') switchTab('screen-farm');
        
        alert(`Поздравляю! Уровень ${level} активирован!`);
    } else {
        alert("Недостаточно монет!");
    }
}

