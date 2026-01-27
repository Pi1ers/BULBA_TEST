const levelCosts = [0, 0, 100, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000];

function openMarketModal(type) {
    if (type === 'level') {
        let nextLevel = level + 1;
        if (nextLevel >= levelCosts.length) return alert("Макс уровень!");

        document.getElementById('modal-title').innerText = "Улучшить монету";
        document.getElementById('modal-desc').innerText = "Повышает статус твоей монеты.";
        document.getElementById('modal-price').innerText = levelCosts[nextLevel];
        document.getElementById('modal-img').src = coinImages[nextLevel - 1];
        document.getElementById('shop-modal').style.display = 'flex';
    }
}

function closeMarketModal() { document.getElementById('shop-modal').style.display = 'none'; }

function buyNextLevel() {
    let nextLevel = level + 1;
    let cost = levelCosts[nextLevel];
    if (clickCount >= cost) {
        clickCount -= cost;
        level = nextLevel;
        scoreElem.textContent = clickCount;
        updateCoinImage();
        closeMarketModal();
        alert("Уровень повышен!");
    } else {
        alert("Недостаточно монет!");
    }
}

// Обновление цены на плитке
setInterval(() => {
    let nextLevel = level + 1;
    let priceDisp = document.getElementById('market-price-display');
    if (priceDisp) priceDisp.innerText = levelCosts[nextLevel] || "MAX";
}, 1000);
