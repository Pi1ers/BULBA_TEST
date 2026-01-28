function switchTab(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) target.style.display = 'flex';

    document.querySelectorAll('.custom-btn').forEach(b => b.style.opacity = '0.6');
    const activeBtnId = screenId.replace('screen-', 'btn-');
    if(document.getElementById(activeBtnId)) {
        document.getElementById(activeBtnId).style.opacity = '1';
    }

    // ДОБАВЛЯЕМ: Если заходим на экран аватаров, отрисовываем их
    if (screenId === 'screen-avatars' && typeof renderAvatarSelection === 'function') {
        renderAvatarSelection();
    }
}


document.getElementById('btn-farm').onclick = () => switchTab('screen-farm');
document.getElementById('btn-market').onclick = () => switchTab('screen-market');
document.getElementById('btn-friends').onclick = () => switchTab('screen-friends');
document.getElementById('btn-bank').onclick = () => switchTab('screen-bank');
document.getElementById('btn-airdrop').onclick = () => switchTab('screen-airdrop');
