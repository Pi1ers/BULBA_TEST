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

        // Сбрасываем классы
        card.classList.remove('bought', 'unavailable-card');
        card.onclick = null;

        if (cardLevel <= level) {
            // Уже куплено
            card.classList.add('bought');
            card.querySelector('.price-tag').innerText = 'КУПЛЕНО';
        } else if (clickCount >= cost) {
            // Можно купить
            card.onclick = () => openMarketModal(cardLevel);
        } else {
            // Не хватает денег
            card.classList.add('unavailable-card');
            card.querySelector('.price-tag').innerText = cost;
        }
    });
}

// Открывает модальное окно
function openMarketModal(targetLevel) {
    const modal = document.getElementById('shop-modal');
    if (!modal) return;

    const cost = levelCosts[targetLevel];
    const buyBtn = document.getElementById('modal-buy-btn');

    document.getElementById('modal-title').innerText = `Купить уровень ${targetLevel}`;
    document.getElementById('modal-desc').innerText = `Разблокирует новый дизайн монеты!`;
    document.getElementById('modal-price').innerText = cost;
    document.getElementById('modal-img').src = coinImages[targetLevel - 1];

    if (clickCount >= cost) {
        buyBtn.classList.remove('unavailable');
        buyBtn.innerText = "КУПИТЬ";
        buyBtn.onclick = () => buyNextLevel(targetLevel);
    } else {
        buyBtn.classList.add('unavailable');
        buyBtn.innerText = "НЕДОСТАТОЧНО МОНЕТ";
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
