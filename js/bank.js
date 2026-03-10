function activateBonusCode() {
    const input = document.getElementById('bonus-code-input');
    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
        alert("Введите код!");
        return;
    }

    // Если переменная usedBonusCodes вдруг не создана, создаем её
    if (typeof usedBonusCodes === 'undefined') window.usedBonusCodes = [];

    if (usedBonusCodes.includes(code)) {
        alert("Вы уже активировали этот код!");
        return;
    }

    const promoCodes = {
        "BULBA_START": 50000,
        "DEV_GIFT": 1000000,
        "HAPPY_2025": 250000
    };

    if (promoCodes[code]) {
        const reward = promoCodes[code];

        clickCount += reward;
        usedBonusCodes.push(code);

        // Красивое обновление баланса
        if (typeof scoreElem !== 'undefined' && scoreElem) {
            scoreElem.textContent = Math.floor(clickCount).toLocaleString('ru-RU');
        }

        alert(`🎉 Успешно! Начислено: ${reward.toLocaleString('ru-RU')} 🥔`);
        input.value = "";
        saveGame();
    } else {
        alert("❌ Неверный код!");
    }
}


// Функция переключения вкладок в Банке (чтобы работала навигация внутри банка)
function showBankTab(tabName) {
    const depositSection = document.getElementById('bank-deposit-section');
    const bonusSection = document.getElementById('bank-bonus-section');
    const tabs = document.querySelectorAll('#screen-bank .tab-btn');

    if (!depositSection || !bonusSection) return;

    depositSection.style.display = 'none';
    bonusSection.style.display = 'none';
    tabs.forEach(t => t.classList.remove('active'));

    if (tabName === 'deposit') {
        depositSection.style.display = 'block';
        tabs[0].classList.add('active');
    } else if (tabName === 'bonus') {
        bonusSection.style.display = 'block';
        tabs[1].classList.add('active');
    }
}