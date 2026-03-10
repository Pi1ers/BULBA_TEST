function checkAchievements() {
    achievements.forEach(ach => {
        // Если ачивка уже есть в списке разблокированных — выходим
        if (unlockedAchievements.includes(ach.id)) return;

        let reached = false;

        // Проверка по ТИПАМ из твоего массива:
        if (ach.type === 'total_coins' && clickCount >= ach.goal) reached = true;
        if (ach.type === 'total_clicks' && userXP >= ach.goal) reached = true; // XP у нас равно кликам


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
    list.innerHTML = '';

    achievementsData.forEach(ach => {
        let isUnlocked = false;
        let currentTierIdx = -1;
        let percent = 0;
        let displayData = { icon: '🔒', name: ach.title }; // По умолчанию замок

        // --- ЛОГИКА ДЛЯ ПРОГРЕССИВНЫХ (УРОВНЕВЫХ) ---
        if (ach.type === 'progressive') {
            const val = window[ach.variable] || 0;

            if (ach.tiers) {
                ach.tiers.forEach((t, i) => { if (val >= t.goal) currentTierIdx = i; });

                isUnlocked = currentTierIdx >= 0;
                const nextTier = ach.tiers[currentTierIdx + 1];

                if (!nextTier && isUnlocked) percent = 100;
                else if (nextTier) {
                    const start = currentTierIdx >= 0 ? ach.tiers[currentTierIdx].goal : 0;
                    percent = ((val - start) / (nextTier.goal - start)) * 100;
                }
                if (isUnlocked) displayData = ach.tiers[currentTierIdx];
            }
        }
        // --- ЛОГИКА ДЛЯ УНИКАЛЬНЫХ (МЁД, БИЗНЕС) ---
        else if (ach.type === 'unique') {
            isUnlocked = (typeof ach.check === 'function') ? ach.check() : false;
            percent = isUnlocked ? 100 : 0;
            if (isUnlocked) {
                displayData = { icon: ach.icon, name: ach.title };
            }
        }

        // --- ОТРИСОВКА ---
        const offset = 138 - (138 * Math.min(percent, 100)) / 100;
        const item = document.createElement('div');
        item.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'} tier-${currentTierIdx + 1}`;

        item.innerHTML = `
            <div class="ach-status-badge">${isUnlocked ? (ach.type === 'unique' ? 'OK' : (currentTierIdx + 1) + ' LVL') : 'LOCK'}</div>
            <div class="ach-progress-container">
                <svg class="ach-svg-ring" width="50" height="50">
                    <circle class="ring-bg" cx="25" cy="25" r="22"></circle>
                    <circle class="ring-fill" cx="25" cy="25" r="22"
                            style="stroke-dasharray: 138; stroke-dashoffset: ${offset};
                            stroke: ${getTierColor(currentTierIdx + 1)}"></circle>
                </svg>
                <div class="ach-icon">${displayData.icon}</div>
            </div>
            <div class="ach-name">${displayData.name}</div>
        `;

        // КЛИК ДЛЯ ИНФО
        item.onclick = () => {
            if (ach.type === 'progressive') {
                const val = window[ach.variable] || 0;
                const nextTier = ach.tiers[currentTierIdx + 1];
                let message = `🏆 ${ach.title.toUpperCase()}\n`;
                if (isUnlocked) message += `Текущий ранг: ${displayData.name}\n`;
                if (nextTier) {
                    message += `\n🎯 Цель: ${nextTier.name}\nПрогресс: ${Math.floor(val).toLocaleString()} / ${nextTier.goal.toLocaleString()}`;
                } else {
                    message += `\n⭐ МАКСИМАЛЬНЫЙ УРОВЕНЬ!`;
                }
                alert(message);
            } else {
                alert(`🏆 ${ach.title}\n${ach.desc}\nСтатус: ${isUnlocked ? '✅ Выполнено' : '❌ Закрыто'}`);
            }
        };

        list.appendChild(item);
    });
}


function getTierColor(tier) {
    if (tier >= 6) return '#ff00ff'; // Легенда
    if (tier >= 3) return '#ffd700'; // Золото
    if (tier >= 2) return '#c0c0c0'; // Серебро
    return '#cd7f32'; // Бронза
}

function showAchInfo(ach, tierIdx) {
    let text = "";
    if (ach.type === 'progressive') {
        const next = ach.tiers[tierIdx + 1];
        text = `Твой статус: ${tierIdx >= 0 ? ach.tiers[tierIdx].name : 'Нет'}\n`;
        if (next) text += `До следующего: ${next.goal.toLocaleString()} 🥔`;
    } else {
        text = ach.desc;
    }
    alert(text);
}

function showAchInfo(title, currentName, currentVal, goalVal, nextName) {
    // Если у тебя есть универсальное окно уведомлений, вызывай его тут.
    // Если нет, давай пока оставим alert, но отформатируем его:
    const percent = Math.floor((currentVal / goalVal) * 100);
    alert(
        `--- ${title} ---\n` +
        `Ранг: ${currentName}\n` +
        `Прогресс: ${percent}% (${Math.floor(currentVal)} / ${goalVal})\n` +
        `Следующий ранг: ${nextName}`
    );
}


const clickAchievement = {
    id: 'click_master',
    title: 'Кликер',
    type: 'total_clicks',
    tiers: [
        { goal: 1000, name: 'Салага', icon: '🌱' },
        { goal: 5000, name: 'Начинающий', icon: '🌿' },
        { goal: 25000, name: 'Стахановец', icon: '🚜' },
        { goal: 50000, name: 'Мастер лопаты', icon: '⚔️' },
        { goal: 100000, name: 'Картофельный Барон', icon: '👑' },
        { goal: 1000000, name: 'Самые быстрые пальцы на диком западе', icon: '🌵' }
    ]
};
