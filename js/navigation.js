function switchTab(screenId) {
    // 1. Скрываем все экраны
    document.querySelectorAll('.game-screen').forEach(s => s.style.display = 'none');

    // 2. Показываем нужный экран
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
    } else {
        console.error("Экран не найден:", screenId);
    }

   // 3. Скрываем/показываем новую шапку (только на главном экране)
const headerStrip = document.querySelector('.header-strip');

if (headerStrip) {
    // Если мы на ферме — показываем (flex), если в магазине/банке — убираем (none)
    headerStrip.style.display = (screenId === 'screen-farm') ? 'flex' : 'none';
}

    // 4. Подсветка кнопок в футере
    document.querySelectorAll('.custom-btn').forEach(b => b.style.opacity = '0.6');
    const activeBtnId = screenId.replace('screen-', 'btn-');
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
        activeBtn.style.opacity = '1';
    }

    // 5. Отрисовка контента при переходе
    if (screenId === 'screen-avatars' && typeof renderAvatarSelection === 'function') {
        renderAvatarSelection();
    }

    if (screenId === 'screen-achievements') {
        // Сначала проверяем, не выполнил ли игрок что-то новое
        if (typeof checkAchievements === 'function') checkAchievements();
        // Потом рисуем список
        if (typeof renderAchievements === 'function') renderAchievements();
    }

    if (screenId === 'screen-levels' && typeof renderLevelsRoadmap === 'function') {
        renderLevelsRoadmap();
    }

    if (screenId === 'screen-market' && typeof showMarketTab === 'function') {
    // Находим первую кнопку в табах (это "МОНЕТЫ")
    const firstTabBtn = document.querySelector('.market-tabs .tab-btn');
    // Передаем 'level' (без S на конце!) и саму кнопку
    showMarketTab('level', firstTabBtn);
}
} // <--- ПРОВЕРЬ, ЧТО ЭТА СКОБКА ЕСТЬ!




document.getElementById('btn-farm').onclick = () => switchTab('screen-farm');
document.getElementById('btn-market').onclick = () => switchTab('screen-market');
document.getElementById('btn-friends').onclick = () => switchTab('screen-friends');
document.getElementById('btn-bank').onclick = () => switchTab('screen-bank');
document.getElementById('btn-airdrop').onclick = () => switchTab('screen-airdrop');