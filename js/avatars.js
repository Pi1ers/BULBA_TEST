// Специальный массив для твоих уникальных аватаров
const avatarImages = [
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/старт_аватар-removebg-preview.png', // Индекс 0 (Бесплатно)
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar1.png', // Пример ссылки 1
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar2.png', // Пример ссылки 2
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar4.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar5.png',
    'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar6.png',


    // Сюда просто добавляй новые ссылки через запятую
];

// Функция отрисовки сетки в меню выбора
function renderAvatarSelection() {
    const grid = document.getElementById('avatar-selection-grid');
    if (!grid) return;
    grid.innerHTML = '';

    avatarData.forEach((avatar, index) => {
        const item = document.createElement('div');
        item.className = 'avatar-item';
        item.style.backgroundImage = `url('${avatar.url}')`;

        const isPurchased = purchasedAvatars.includes(index);
        const isLevelOk = userLevel >= avatar.reqLvl;

        if (isPurchased) {
            // КУПЛЕНО
            if (index === currentAvatarIndex) item.classList.add('active');
            item.onclick = () => selectAvatar(index);
        }
        else if (!isLevelOk) {
            // ЗАБЛОКИРОВАНО УРОВНЕМ
            item.classList.add('locked');
            item.setAttribute('data-level', `Lvl ${avatar.reqLvl}`);
            item.onclick = () => alert(`Нужен уровень ${avatar.reqLvl}!`);
        }
        else {
            // МОЖНО КУПИТЬ (Уровень ок, но не куплено)
            item.classList.add('locked');
            item.setAttribute('data-level', `${avatar.price} 💰`);
            item.onclick = () => buyAvatar(index, avatar.price);
        }

        grid.appendChild(item);
    });
}

// Функция покупки нового аватара
function buyAvatar(index, price) {
    if (clickCount >= price) {
        clickCount -= price;
        purchasedAvatars.push(index);
        if (scoreElem) scoreElem.textContent = clickCount;
        renderAvatarSelection(); // Перерисовываем сетку
        saveGame();
        alert("Аватар разблокирован!");
    } else {
        alert("Недостаточно картошки! Нужно " + price);
    }
}

// Функция выбора аватара
function selectAvatar(index) {
    currentAvatarIndex = index; // Меняем индекс выбранного аватара
    const avatarImg = document.getElementById('user-avatar');

    // Ставим картинку в профиль на главном экране
    if (avatarImg) avatarImg.src = avatarImages[index];

    renderAvatarSelection(); // Обновляем рамки в меню

    // Опционально: возвращаем на главный экран после выбора
    // switchTab('screen-farm');
}
