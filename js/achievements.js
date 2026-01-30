

function checkAchievements() {
    achievements.forEach(ach => {
        // Если ачивка уже есть в списке разблокированных — выходим
        if (unlockedAchievements.includes(ach.id)) return;

        let reached = false;

        // Проверка по ТИПАМ из твоего массива:
        if (ach.type === 'total_coins' && clickCount >= ach.goal) reached = true;
        if (ach.type === 'total_clicks' && userXP >= ach.goal) reached = true; // XP у нас равно кликам
        if (ach.type === 'auto_farm_lvl' && autoFarmLevel >= ach.goal) reached = true;

        if (reached) {
            unlockedAchievements.push(ach.id);
            showAchievementToast(ach.title); // Показываем уведомление
            saveGame(); // Сохраняем, чтобы не потерять медаль
            console.log("Ура! Получена ачивка:", ach.title);
        }
    });
}

function renderAchievements() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    list.innerHTML = ''; // Очищаем старое

    // Проверяем, есть ли данные
    if (typeof achievements === 'undefined') {
        list.innerHTML = '<p style="color:white; text-align:center;">Ачивки загружаются...</p>';
        return;
    }

    achievements.forEach(ach => {
        // Проверяем, выполнена ли ачивка (есть ли её ID в массиве разблокированных)
        const isDone = unlockedAchievements.includes(ach.id);

        const item = document.createElement('div');
        // Используем твои стандартные классы карточек
        item.className = `shop-card ${isDone ? 'bought' : 'locked'}`;

        item.innerHTML = `
            <div style="font-size: 40px; margin: 10px;">${isDone ? '🏆' : '🔒'}</div>
            <h3>${ach.title}</h3>
            <p style="font-size: 11px; color: #ccc;">${ach.desc}</p>
            <span class="price-tag" style="background: ${isDone ? '#2ecc71' : '#555'}">
                ${isDone ? 'ВЫПОЛНЕНО' : 'В ПРОЦЕССЕ'}
            </span>
        `;
        list.appendChild(item);
    });
}
