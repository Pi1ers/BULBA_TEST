const achievementsData = [
    {
        id: 'ach_clicks',  type: 'progressive', title: 'Пальцы-Молоты', variable: 'userXP', // Считаем по XP (твои клики)
        tiers: [
            { goal: 1000, name: 'Салага', icon: '🌱' },
            { goal: 5000, name: 'Начинающий', icon: '🌿' },
            { goal: 25000, name: 'Стахановец', icon: '🚜' },
            { goal: 50000, name: 'Мастер лопаты', icon: '⚔️' },
            { goal: 100000, name: 'Картофельный Барон', icon: '👑' },
            { goal: 1000000, name: 'Самые быстрые пальцы на диком западном огороде', icon: '🌵' }
        ]
    },
    {
        id: 'ach_balance', type: 'progressive', title: 'Олигарх с тяпкой', variable: 'clickCount', // Считаем по текущему счету
        tiers: [
            { goal: 10000, name: 'На мешок хватит', icon: '💰' },
            { goal: 100000, name: 'Кулак', icon: '🏛️' },
            { goal: 1000000, name: 'Миллионер из трущоб', icon: '💎' },
            { goal: 10000000, name: 'Картофельный магнат', icon: '🏬' }
        ]
    },
    {   id: 'ach_honey', type: 'unique', title: 'Мёдоед',desc: 'Прокачать мёд до 10 уровня',  check: () => energyRegenSpeed >= 10, icon: '🍯' },
    {   id: 'ach_first_biz', type: 'unique', title: 'Первые шаги', desc: 'Купить любой бизнес', check: () => Object.keys(window.ownedBusiness || {}).length > 0,  icon: '🏠' },
    {   id: 'ach_biz_count',  type: 'progressive',  title: 'Агрохолдинг', variable: 'ownedBusinessCount', // Мы добавили логику подсчета Object.keys(window.ownedBusiness).length
    tiers: [
        { goal: 1, name: 'Первая грядка', icon: '🌱' },
        { goal: 5, name: 'Фермер', icon: '🚜' },
        { goal: 10, name: 'Агроном', icon: '🌽' },
        { goal: 15, name: 'Земельный магнат', icon: '🏛️' },
        { goal: 20, name: 'Властелин Огородов', icon: '👑' } ]},

    {   id: 'ach_airdrop', type: 'progressive', title: 'ПВО Огорода', variable: 'airdropCount',
     tiers: [
        { goal: 10, name: 'Зоркий глаз', icon: '🏹' },
        { goal: 50, name: 'Ловец посылок', icon: '📦' },
        { goal: 100, name: 'Гроза тарелок', icon: '🛸' },
        { goal: 500, name: 'Звездный маршал', icon: '🌌' } ]},

     {  id: 'ach_energy', type: 'progressive',title: 'Энерджайзер', variable: 'totalEnergySpent',
      tiers: [
        { goal: 1000, name: 'Бодрячок', icon: '⚡' },
        { goal: 10000, name: 'Батарейка', icon: '🔋' },
        { goal: 50000, name: 'Вечный двигатель', icon: '🎡' },
        { goal: 100000, name: 'Ядерный реактор', icon: '☢️' } ]},

      {  id: 'ach_user_level', type: 'progressive', title: 'Авторитет', variable: 'userLevel',
        tiers: [
        { goal: 5, name: 'Опытный', icon: '🎓' },
        { goal: 10, name: 'Уважаемый', icon: '😎' },
        { goal: 20, name: 'Легенда села', icon: '🌟' },
        { goal: 50, name: 'Мировой лидер', icon: '🌍' } ]},


      {id: 'ach_millionaire',type: 'unique', title: 'Первый миллион', desc: 'Накопить 1 000 000 🥔 на счету одновременно', check: () => clickCount >= 1000000, icon: '💎'},
      {id: 'ach_all_skins',  type: 'unique', title: 'Модник',  desc: 'Купить 5 разных скинов для монеты', check: () => purchasedSkins.length >= 5, icon: '🎭'}










];
