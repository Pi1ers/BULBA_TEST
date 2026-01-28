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

    avatarImages.forEach((imgUrl, index) => {
        const item = document.createElement('div');
        item.className = 'avatar-item';
        item.style.backgroundImage = `url('${imgUrl}')`;

        // Проверяем, куплен ли этот аватар (массив из game.js)
        if (purchasedAvatars.includes(index)) {
            // Если выбран текущий — подсвечиваем золотой рамкой (класс .active в CSS)
            if (index === currentAvatarIndex) item.classList.add('active');
            item.onclick = () => selectAvatar(index);
        } else {
            // Если заблокирован — накладываем фильтр (класс .locked в CSS)
            item.classList.add('locked');
            item.onclick = () => buyAvatar(index);
        }
        grid.appendChild(item);
    });
}

// Функция покупки нового аватара
function buyAvatar(index) {
    if (clickCount >= avatarCost) {
        if (confirm(`Купить этот аватар за ${avatarCost} монет?`)) {
            clickCount -= avatarCost; // Списываем баланс
            purchasedAvatars.push(index); // Добавляем в список купленных

            if (scoreElem) scoreElem.textContent = clickCount; // Обновляем текст на экране

            renderAvatarSelection(); // Перерисовываем сетку (убираем замок)
            updateProgress(); // Обновляем прогресс-бар, так как деньги изменились
        }
    } else {
        alert("Недостаточно монет для покупки аватара!");
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