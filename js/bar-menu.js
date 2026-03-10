// Генерируем награды на месяц (Миллион в конце)
function getMonthlyRewards() {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const rewards = [];
    for (let i = 1; i <= daysInMonth; i++) {
        if (i === daysInMonth) rewards.push(1000000);
        else rewards.push(5000 * i);
    }
    return rewards;
}
const dailyRewards = getMonthlyRewards(); // Глобальная переменная для календаря


// 1. Функция открытия календаря
function openDailyCalendar() {
    const modal = document.getElementById('daily-modal');
    const grid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('calendar-month-name');

    if (!modal || !grid) {
        console.error("Элементы календаря не найдены в HTML!");
        return;
    }

    const now = new Date();
    // Название месяца
    if (monthTitle) {
        monthTitle.innerText = now.toLocaleString('ru', { month: 'long' }).toUpperCase();
    }

    grid.innerHTML = ''; // Очистка сетки перед отрисовкой

    // Отрисовка дней месяца
    dailyRewards.forEach((reward, index) => {
        const dayNum = index + 1;
        const slot = document.createElement('div');
        slot.className = 'day-slot';

        // Статусы: уже забрал или можно забрать сейчас
        const isClaimed = (dayNum < window.dailyStreak) || (dayNum === window.dailyStreak && window.dailyClaimedToday);
        const isActive = (dayNum === window.dailyStreak && !window.dailyClaimedToday);

        if (isClaimed) {
            slot.classList.add('claimed');
        } else if (isActive) {
            slot.classList.add('active');
            slot.onclick = () => claimDailyReward(dayNum, reward);
        }

        slot.innerHTML = `
            <span>ДЕНЬ ${dayNum}</span>
            <span class="day-reward">${(reward >= 1000000 ? '1M' : (reward/1000)+'k')}</span>
        `;
        grid.appendChild(slot);
    });

    modal.style.display = 'flex';
}

// 2. Функция забора награды из сетки
function claimDailyReward(day, amount) {
    clickCount += amount;
    window.dailyClaimedToday = true;
    window.lastLoginDate = new Date().toDateString(); // Фиксируем дату забора

    saveGame();
    updateProgress();

    // Праздничные эффекты (если функция существует)
    if (typeof launchLevelUpEffects === 'function') launchLevelUpEffects();

    // Обновляем календарь (чтобы день стал зеленым сразу)
    openDailyCalendar();

    console.log(`Награда за день ${day} получена: ${amount} 🥔`);
}

// 3. Закрытие
function closeDailyModal() {
    const modal = document.getElementById('daily-modal');
    if (modal) modal.style.display = 'none';
}

// 4. Заглушки для будущих кнопок
function openDailyCombo() {
    alert("Комбо карточки скоро появятся! 🃏");
}

function openMiniGame() {
    alert("Мини-игра в разработке! 🎮");
}


