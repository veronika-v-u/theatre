// tickets_logic.js

const ticketData = [
    { id: 101, name: "МЭРИ ПОППИНС", author: "М. Дунаевский", desc: "Шоу-мюзикл в 2-х действиях", date: "01 МАРТА", monthCode: "03", weekday: "ВОСКРЕСЕНЬЕ", time: "11:00", age: "+6", genre: "musical", img: "resurse/meri_glavnaya.webp", price: 25.00, isPremiere: false },
    { id: 102, name: "ДЖЕЙН ЭЙР", author: "К. Брейтбург", desc: "Мюзикл в 2-х действиях", date: "01 МАРТА", monthCode: "03", weekday: "ВОСКРЕСЕНЬЕ", time: "19:00", age: "+16", genre: "musical", img: "resurse/dzhejn-glavnaya-yurochkina.webp", price: 30.00, isPremiere: false },
    { id: 103, name: "ДЕВЧАТА", author: "Е. Шашин", desc: "Мюзикл в 2-х действиях", date: "07 МАРТА", monthCode: "03", weekday: "СУББОТА", time: "18:00", age: "+16", genre: "musical", img: "resurse/devchata_afisha.webp", price: 30.00, isPremiere: true },
    { id: 104, name: "ДЕВЧАТА", author: "Е. Шашин", desc: "Мюзикл в 2-х действиях", date: "06 МАРТА", monthCode: "03", weekday: "ПЯТНИЦА", time: "19:00", age: "+16", genre: "musical", img: "resurse/devchata_afisha.webp", price: 30.00, isPremiere: true },
    { id: 105, name: "ДЕВЧАТА", author: "Е. Шашин", desc: "Мюзикл в 2-х действиях", date: "08 МАРТА", monthCode: "03", weekday: "ВОСКРЕСЕНЬЕ", time: "18:00", age: "+16", genre: "musical", img: "resurse/devchata_afisha.webp", price: 30.00, isPremiere: true },
    { id: 106, name: "НЕВЕСТА ИЗ ИМЕРЕТИИ", author: "Г. Канчели", desc: "музыкальная комедия в 2-х действиях", date: "10 МАРТА", monthCode: "03", weekday: "ВТОРНИК", time: "19:00", age: "+16", genre: "comedy", img: "resurse/nevesta-glavnaya.webp", price: 30.00, isPremiere: false },
    { id: 107, name: "БУРАТИНО.BY", author: "А. Рыбников", desc: "мюзикл для детей и взрослых в 2-х действиях", date: "15 МАРТА", monthCode: "03", weekday: "ВОСКРЕСЕНЬЕ", time: "11:00", age: "+6", genre: "kids", img: "resurse/buratino-glavnaya-1.webp", price: 30.00, isPremiere: false },
    { id: 201, name: "ЛЕТНИЙ КОНЦЕРТ", author: "Оркестр", desc: "Праздничная программа", date: "15 ИЮНЯ", monthCode: "06", weekday: "ПОНЕДЕЛЬНИК", time: "19:00", age: "+6", genre: "music", img: "resurse/nevesta-glavnaya.webp", price: 40.00, isPremiere: true },
];

function renderTickets() {
    const container = document.getElementById('tickets-catalog');
    const genreFilter = document.getElementById('genre-filter').value;
    const monthFilter = document.getElementById('month-filter').value;
    
    updateMonthLabel();

    container.innerHTML = '';

    // 1. Фильтрация
    let filtered = ticketData.filter(t => {
        const matchGenre = (genreFilter === 'all' || t.genre === genreFilter);
        const matchMonth = (t.monthCode === monthFilter);
        return matchGenre && matchMonth;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-tickets">На выбранный месяц спектаклей не найдено.</p>';
    }

    // 2. Сортировка по дате (по числу в строке "01 МАРТА")
    filtered.sort((a, b) => {
        const dayA = parseInt(a.date);
        const dayB = parseInt(b.date);
        return dayA - dayB;
    });

    // 3. Отрисовка
    filtered.forEach(t => {
        const row = document.createElement('div');
        row.className = 'ticket-card-row';
        
        // Условие для плашки "Премьера"
        const premiereBadge = t.isPremiere ? `<div class="badge premiere">Премьера</div>` : '';

        row.innerHTML = `
            <div class="content-wrapper">
                <div class="ticket-card">
                    <div class="date-info">
                        <span class="day">${t.date}</span>
                        <span class="weekday">${t.weekday}</span>
                        ${premiereBadge}
                    </div>
                    <div class="event-image">
                        <img src="${t.img}" alt="${t.name}">
                    </div>
                    <div class="event-details">
                        <p class="author">${t.author}</p>
                        <h3 class="event-name">${t.name}</h3>
                        <p class="description">${t.desc}</p>
                    </div>
                    <div class="event-meta">
                        <span class="time">${t.time}</span>
                        <span class="age-limit">${t.age}</span>
                        <button class="buy-btn cart-button" 
                                data-id="${t.id}" data-name="${t.name}" 
                                data-price="${t.price}" data-img="${t.img}">
                            Купить билет
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(row);
    });

   
}

// Обновление заголовка месяца (МАРТ -> АПРЕЛЬ и т.д.)
function updateMonthLabel() {
    const select = document.getElementById('month-filter');
    const monthText = select.options[select.selectedIndex].text.toUpperCase();
    const label = document.querySelector('.month-label');
    if (label) label.textContent = monthText;
}

document.addEventListener('DOMContentLoaded', () => {
    renderTickets();

    // Слушатели на оба фильтра
    document.getElementById('genre-filter').addEventListener('change', renderTickets);
    document.getElementById('month-filter').addEventListener('change', renderTickets);
});
