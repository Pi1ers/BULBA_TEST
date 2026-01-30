// Функция активации Бонус-кода
function activateBonusCode() {
    const input = document.getElementById('bonus-code-input');
    if (!input) return;

    const code = input.value.trim().toUpperCase(); // Убираем пробелы и в КРУПНЫЙ регистр

    if (!code) {
        alert("Введите код!");
        return;
    }

    // Проверяем, не использовал ли игрок этот код ранее
    if (usedBonusCodes.includes(code)) {
        alert("Вы уже активировали этот код!");
        return;
    }

    // Список кодов и наград
    const promoCodes = {
        "BULBA_START": 50000,
        "DEV_GIFT": 1000000,
        "HAPPY_2025": 250000
    };

    if (promoCodes[code]) {
        const reward = promoCodes[code];

        // Начисляем награду
        clickCount += reward;
        // Добавляем в список использованных
        usedBonusCodes.push(code);

        // Обновляем счетчик на экране
        if (typeof scoreElem !== 'undefined' && scoreElem) {
            scoreElem.textContent = clickCount;
        }

        alert(`🎉 Успешно! Начислено: ${reward} 🥔`);
        input.value = ""; // Очищаем поле ввода
        saveGame(); // Сохраняем прогресс (включая usedBonusCodes)
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
