var boostClickCost = 150;
var boostEnergyCost = 200;

var criticalChance = 0.1; // Шанс крита (10%)
let energyRegenSpeed = parseInt(localStorage.getItem('energyRegenSpeed')) || 1;
let honeyCost = parseInt(localStorage.getItem('honeyCost')) || 1000;
var energyRegenInterval = 3000; // Раз в 3 секунды (по умолчанию)

// Цены для новых бустов
var cloverCosts = [500, 1500, 5000, 15000, 50000]; // 5 уровней прокачки
var cloverLevel = 0; // Начинаем с нулевого индекса (цена 500)

var honeyCosts = [1000, 3000, 7000, 15000, 40000]; // Сделаем и меду массив для порядка



var storageLevel = 0; // Текущий уровень прокачки склада







/////////////     МАССИВ ДЛЯ АВАТАРОВ //////////////
const avatarData = [
    { id: 0, price: 0,   reqLvl: 0,  url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/старт_аватар-removebg-preview.png' }, // Бесплатный
    { id: 1, price: 500, reqLvl: 0,  url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar1.png' }, // Только за деньги
    { id: 2, price: 0,   reqLvl: 3,  url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar2.png' }, // Только за уровень
    { id: 3, price: 1000, reqLvl: 5,  url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar4.png' }, // Уровень + Деньги
    { id: 4, price: 5000, reqLvl: 10, url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar5.png' }, // Элитный
    { id: 5, price: 5000, reqLvl: 10, url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/avatar6.png' }, // Элитный
];



// Цены для покупки новых дизайнов монет (скинов)
const levelCosts = [0, 500, 1000, 2500, 5000, 25000, 50000, 100000, 205000, 500000, 1000000];
// === ДАННЫЕ ДИЗАЙНОВ МОНЕТ ===
const coinSkinsData = [
    { name: 'Разбитая монета.', desc: 'Стартовый скин, пахнет землей.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%200.png' },
    { name: 'Медная Бульба', desc: 'Блестит на солнце, тяжелая.', url:     'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%201.png', },
    { name: 'Каменная Бульба', desc: 'Очень прочная, но дешевая.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/AVATARS/NEWCOINTEST.png', },
    { name: 'Глиняная Бульба', desc: 'Хрупкая, но красивая.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%203%20CLAY_COIN.png' , },
    { name: 'Железная Бульба', desc: 'Настоящая мощь индустрии.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%204%20IRON_BULBA.png' , },
    { name: 'Медная Бульба', desc: 'Классика чеканки.', url:  'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%205%20Copper_COIN.png' , },
    { name: 'Бронзовая Бульба', desc: 'Сплав опыта и упорства.', url:  'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%206%20Broize_coin.png', },
    { name: 'Серебряная Бульба', desc: 'Сияет как полная луна.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%207%20Silver_coin.png' ,},
    { name: 'Золотая Бульба', desc: 'Символ богатства и успеха.', url:  'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%208%20GOLD_COIN.png', },
    { name: 'Титановая Бульба', desc: 'Легче воздуха, крепче стали.', url: 'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%209%20Titanium_coin.png' },
    { name: 'Алмазная Бульба', desc: 'Вершина эволюции картошки.', url:  'https://raw.githubusercontent.com/Pi1ers/BULBA_TEST/refs/heads/main/IMG%20COIN/LEVEL%2010%20DIAMOND_COIN.png' }
        ];


///////// МАССИВ ДОСТИЖЕНИЙ /////////

const achievements = [
    { id: 'first_1000', title: 'Новичок', desc: 'Собрать 1,000 картошки', goal: 1000, type: 'total_coins', done: false },
    { id: 'click_master', title: 'Палец-молот', desc: 'Сделать 500 кликов', goal: 500, type: 'total_clicks', done: false },
    { id: 'farm_owner', title: 'Фермер', desc: 'Купить 3 уровня авто-фермы', goal: 3, type: 'auto_farm_lvl', done: false }
];

///////// МАССИВ ДОСТИЖЕНИЙ /////////





/////////////     МАССИВ ДЛЯ УРОВНЕЙ //////////////
const levelsData = [
    { lvl: 1, name: "Картофельный эмбрион", xpRequired: 0, reward: 0 },
    { lvl: 2, name: "Первый росток", xpRequired: 20, reward: 100 },
    { lvl: 3, name: "Садовый вредитель", xpRequired: 100, reward: 250 },
    { lvl: 4, name: "Копатель-стажер", xpRequired: 250, reward: 500 },
    { lvl: 5, name: "Владелец тяпки", xpRequired: 600, reward: 1000 },
    { lvl: 6, name: "Картофельный вор", xpRequired: 1000, reward: 1200 },
    { lvl: 7, name: "Сторож огорода", xpRequired: 2000, reward: 1500 },
    { lvl: 8, name: "Любитель драников", xpRequired: 3500, reward: 2000 },
    { lvl: 9, name: "Мастер окучивания", xpRequired: 5000, reward: 2500 },
    { lvl: 10, name: "Барон чернозема", xpRequired: 7500, reward: 5000 },

    // ЭТАП: Фермерское хозяйство
    { lvl: 11, name: "Тракторист", xpRequired: 10000, reward: 6000 },
    { lvl: 12, name: "Начальник склада", xpRequired: 15000, reward: 7000 },
    { lvl: 13, name: "Гроза колорадских жуков", xpRequired: 22000, reward: 8000 },
    { lvl: 14, name: "Поставщик сельпо", xpRequired: 30000, reward: 9000 },
    { lvl: 15, name: "Картофельный барыга", xpRequired: 40000, reward: 10000 },
    { lvl: 16, name: "Король овощебазы", xpRequired: 55000, reward: 12000 },
    { lvl: 17, name: "Оптовик-затейник", xpRequired: 75000, reward: 15000 },
    { lvl: 18, name: "Агроном-провидец", xpRequired: 100000, reward: 20000 },
    { lvl: 19, name: "Фермер года", xpRequired: 130000, reward: 25000 },
    { lvl: 20, name: "Властелин полей", xpRequired: 170000, reward: 50000 },

    // ЭТАП: Промышленный гигант
    { lvl: 21, name: "Директор хладокомбината", xpRequired: 220000, reward: 30000 },
    { lvl: 22, name: "Чипсовый магнат", xpRequired: 280000, reward: 35000 },
    { lvl: 23, name: "Пюрешный монополист", xpRequired: 350000, reward: 40000 },
    { lvl: 24, name: "Крахмальный делец", xpRequired: 450000, reward: 45000 },
    { lvl: 25, name: "Министр земледелия", xpRequired: 570000, reward: 100000 },
    { lvl: 26, name: "Картофельный лоббист", xpRequired: 700000, reward: 60000 },
    { lvl: 27, name: "Инвестор в семена", xpRequired: 850000, reward: 70000 },
    { lvl: 28, name: "Олигарх грядок", xpRequired: 1000000, reward: 80000 },
    { lvl: 29, name: "Генный инженер Бульбы", xpRequired: 1200000, reward: 90000 },
    { lvl: 30, name: "Картофельный пророк", xpRequired: 1500000, reward: 250000 },

    // ЭТАП: Глобальное господство
    { lvl: 31, name: "Бульба-Футурист", xpRequired: 2000000, reward: 150000 },
    { lvl: 32, name: "Завоеватель рынков", xpRequired: 2600000, reward: 175000 },
    { lvl: 33, name: "Картофельный Иллюминат", xpRequired: 3300000, reward: 200000 },
    { lvl: 34, name: "Император Фри", xpRequired: 4200000, reward: 250000 },
    { lvl: 35, name: "Бог урожая", xpRequired: 5500000, reward: 1000000 },
    { lvl: 36, name: "Межпланетный пахарь", xpRequired: 7000000, reward: 350000 },
    { lvl: 37, name: "Колонизатор Марса", xpRequired: 9000000, reward: 400000 },
    { lvl: 38, name: "Создатель био-картофеля", xpRequired: 12000000, reward: 450000 },
    { lvl: 39, name: "Владелец созвездия Драника", xpRequired: 16000000, reward: 500000 },
    { lvl: 40, name: "Галактический Овощевод", xpRequired: 21000000, reward: 2000000 },

    // ЭТАП: Божественный финал
    { lvl: 41, name: "Верховный Корнеплод", xpRequired: 30000000, reward: 1000000 },
    { lvl: 42, name: "Архитектор Клубней", xpRequired: 40000000, reward: 1200000 },
    { lvl: 43, name: "Повелитель Фотосинтеза", xpRequired: 55000000, reward: 1500000 },
    { lvl: 44, name: "Хранитель Золотой Кожуры", xpRequired: 75000000, reward: 2000000 },
    { lvl: 45, name: "Дух Крахмала", xpRequired: 100000000, reward: 5000000 },
    { lvl: 46, name: "Разрушитель Голода", xpRequired: 150000000, reward: 3000000 },
    { lvl: 47, name: "Вечный Сеятель", xpRequired: 200000000, reward: 4000000 },
    { lvl: 48, name: "Начало и Конец Грядки", xpRequired: 300000000, reward: 5000000 },
    { lvl: 49, name: "Картофельная Сингулярность", xpRequired: 500000000, reward: 10000000 },
    { lvl: 50, name: "АБСОЛЮТНАЯ БУЛЬБА", xpRequired: 1000000000, reward: 1000000000 }
];