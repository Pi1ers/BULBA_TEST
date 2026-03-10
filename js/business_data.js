const businessCards = [
    // --- НАЧАЛЬНЫЙ ЭТАП (ДАЧА) ---
    { id: 'rassada', name: 'КУПИТЬ СЕМЕНА', basePrice: 100, baseProfit: 5, icon: '🌱', requires: null },
    { id: 'semena', name: 'ЗАКУПИТЬ РАССАДУ', basePrice: 300, baseProfit: 15, icon: '🌿', requires: 'rassada' },
    { id: 'udobrenie', name: 'НАЙТИ УДОБРЕНИЕ', basePrice: 800, baseProfit: 45, icon: '💩', requires: 'semena' },
    { id: 'sornyaki', name: 'ПРОПОЛОТЬ ГРЯДКИ', basePrice: 1500, baseProfit: 90, icon: '🧤', requires: 'udobrenie' },
    { id: 'ZYKI', name: 'СОБРАТЬ ЖУКОВ', basePrice: 3000, baseProfit: 200, icon: '🐞', requires: 'sornyaki' },

    // --- СРЕДНИЙ ЭТАП (ФЕРМЕРСТВО) ---
    { id: 'scarecrow', name: 'УМНОЕ ПУГАЛО', basePrice: 7000, baseProfit: 500, icon: '🤖', requires: 'ZYKI' },
    { id: 'garden', name: 'ОГОРОД БАБУЛИ', basePrice: 15000, baseProfit: 1200, icon: '🏡', requires: 'scarecrow' },
    { id: 'sprinkler', name: 'ДОЖДИК-3000', basePrice: 30000, baseProfit: 2600, icon: '🚿', requires: 'garden' },
    { id: 'market', name: 'МЕСТНЫЙ РЫНОК', basePrice: 70000, baseProfit: 6500, icon: '🏪', requires: 'sprinkler' },
    { id: 'tiktok_house', name: 'ТИКТОК ХАУС В ПОЛЕ', basePrice: 150000, baseProfit: 15000, icon: '📱', requires: 'market' },

    // --- ВЫСОКИЙ ЭТАП (БИЗНЕС) ---
    { id: 'tractor', name: 'ТРАКТОР БЕЛАРУС', basePrice: 400000, baseProfit: 45000, icon: '🚜', requires: 'tiktok_house' },
    { id: 'mining_barn', name: 'МАЙНИНГ В САРАЕ', basePrice: 1000000, baseProfit: 120000, icon: '🔌', requires: 'tractor' },
    { id: 'factory', name: 'ЧИПСОВЫЙ ЗАВОД', basePrice: 2500000, baseProfit: 320000, icon: '🏭', requires: 'mining_barn' },
    { id: 'nft_bulba', name: 'NFT КЛУБНИ', basePrice: 6000000, baseProfit: 850000, icon: '🖼️', requires: 'factory' },
    { id: 'logistics', name: 'ЛОГИСТИКА ЭКСПОРТА', basePrice: 15000000, baseProfit: 2200000, icon: '🚢', requires: 'nft_bulba' },

    // --- ФИНАЛЬНЫЙ ЭТАП (ИМПЕРИЯ) ---
    { id: 'holding', name: 'БУЛЬБА ХОЛДИНГ', basePrice: 50000000, baseProfit: 8000000, icon: '🏢', requires: 'logistics' },
    { id: 'gold_reserve', name: 'ЗОЛОТОЙ РЕЗЕРВ', basePrice: 150000000, baseProfit: 25000000, icon: '💰', requires: 'holding' },
    { id: 'ministry', name: 'МИНИСТЕРСТВО КАРТОФЕЛЯ', basePrice: 500000000, baseProfit: 90000000, icon: '🏛️', requires: 'gold_reserve' },
    { id: 'space', name: 'МАРСИАНСКАЯ ФЕРМА', basePrice: 2000000000, baseProfit: 400000000, icon: '🚀', requires: 'ministry' }
];