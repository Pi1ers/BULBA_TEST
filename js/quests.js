// Данные квестов
const dailyQuestsData = [
    { id: 'q_clicks', text: 'Сделать 1000 кликов', goal: 1000, reward: 50000, type: 'clicks' },
    { id: 'q_airdrop', text: 'Сбить 10 коробок', goal: 10, reward: 100000, type: 'airdrop' },
    { id: 'q_energy', text: 'Потратить 2000 энергии', goal: 2000, reward: 75000, type: 'energy' }
];

function openQuestsModal() {
    const modal = document.getElementById('daily-quests-modal');
    if (modal) {
        modal.style.display = 'flex';
        renderQuests(); // Рисуем список при открытии
    }
}

function closeQuestsModal() {
    const modal = document.getElementById('daily-quests-modal');
    if (modal) modal.style.display = 'none';
}


// Переменные прогресса (сохраняем их в localStorage)
window.questProgress = JSON.parse(localStorage.getItem('questProgress')) || { clicks: 0, airdrop: 0, energy: 0, claimed: [] };
window.lastQuestReset = localStorage.getItem('lastQuestReset') || "";

// Проверка сброса дня
function checkQuestReset() {
    const today = new Date().toDateString();
    if (window.lastQuestReset !== today) {
        window.questProgress = { clicks: 0, airdrop: 0, energy: 0, claimed: [] };
        window.lastQuestReset = today;
        saveQuests();
    }
}

function saveQuests() {
    localStorage.setItem('questProgress', JSON.stringify(window.questProgress));
    localStorage.setItem('lastQuestReset', window.lastQuestReset);
}

// Функция обновления прогресса (вызывай её при кликах, сбитии НЛО и трате энергии)
function updateQuestProgress(type, amount) {
    checkQuestReset();
    if (window.questProgress.hasOwnProperty(type)) {
        window.questProgress[type] += amount;
        saveQuests();
        // Если открыто окно квестов — перерисовываем
        if (document.getElementById('daily-quests-modal')?.style.display === 'flex') {
            renderQuests();
        }
    }
}

function renderQuests() {
    const list = document.getElementById('quests-list');
    if (!list) {
        console.error("Элемент quests-list не найден!");
        return;
    }
    list.innerHTML = ''; // Чистим старое

    dailyQuestsData.forEach(q => {
        const current = window.questProgress[q.type] || 0;
        const isDone = current >= q.goal;
        const isClaimed = window.questProgress.claimed.includes(q.id);

        const card = document.createElement('div');
        card.className = 'quest-card'; // Стиль из твоего CSS

        card.innerHTML = `
            <div class="quest-info">
                <span class="quest-title">${q.text}</span>
                <span class="quest-reward">💰 +${q.reward.toLocaleString()}</span>
                <span class="quest-progress-text">${Math.min(current, q.goal)} / ${q.goal}</span>
            </div>
            <button class="quest-btn ${isDone && !isClaimed ? 'ready' : ''} ${isClaimed ? 'claimed' : ''}"
                    onclick="claimQuestReward('${q.id}', ${q.reward})"
                    ${!isDone || isClaimed ? 'disabled' : ''}>
                ${isClaimed ? 'ВЗЯТО' : (isDone ? 'ЗАБРАТЬ' : 'В ПРОЦЕССЕ')}
            </button>
        `;
        list.appendChild(card);
    });
}
