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

    // Добавляем постоянную плашку с уровнем (или ценой)
    const label = document.createElement('div');
    label.className = 'avatar-badge';

    const isPurchased = purchasedAvatars.includes(index);
    const isLevelOk = userLevel >= (avatar.reqLvl || 1);

    if (isPurchased) {
        label.innerText = `Ур. ${avatar.reqLvl || index + 1}`;
        if (index === currentAvatarIndex) item.classList.add('active');
        item.onclick = () => selectAvatar(index);
    }
    else if (!isLevelOk) {
        item.classList.add('locked');
        label.innerText = `Lvl ${avatar.reqLvl}`;
        item.onclick = () => alert(`Нужен уровень ${avatar.reqLvl}!`);
    }
    else {
        item.classList.add('can-buy');
        label.innerText = `${avatar.price} 🥔`;
        item.onclick = () => buyAvatar(index, avatar.price);
    }

    item.appendChild(label); // Добавляем плашку ВНУТРЬ кружочка
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