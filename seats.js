const state = { selected: [] };
const prices = { 'c-1': 40, 'c-2': 50, 'c-3': 30, 'c-4': 20 };

// Вспомогательная функция для создания чекбокса места
function createSeat(r, s, cat, prefix = 'p') {
    const id = `${prefix}-r${r}-s${s}`;
    return `<input type="checkbox" id="${id}" onchange="handleUpdate('${cat}', this.checked, '${r}', '${s}', '${id}')">
            <label for="${id}" class="seat ${cat}">${s}</label>`;
}

function getRowStyle(r) {
    let scale = r <= 11 ? 0.85 + (r * 0.01) : 1.0 + ((r - 12) * 0.012);
    return `style="transform: scaleX(${scale}); transform-origin: center;"`;
}

// 1. Генерация Партера 1
const p1 = document.getElementById('parter-1');
for(let r=1; r<=11; r++) {
    let rowHtml = `<div class="row" ${getRowStyle(r)}><div class="row-num">${r}</div>`;
    let cat = r <= 5 ? 'c-2' : 'c-1';
    for(let i=32; i>=17; i--) rowHtml += createSeat(r, i, cat, 'p1');
    rowHtml += `<div style="width:20px"></div>`;
    for(let i=16; i>=1; i--) rowHtml += createSeat(r, i, cat, 'p1');
    rowHtml += `<div class="row-num">${r}</div></div>`;
    p1.innerHTML += rowHtml;
}

// 2. Генерация Партера 2 + ВОЗВРАТ ЛОЖИ
const p2 = document.getElementById('parter-2');
for(let r=12; r<=21; r++) {
    let rowHtml = `<div class="row" ${getRowStyle(r)}><div class="row-num">${r}</div>`;
    let cat = r <= 14 ? 'c-1' : (r <= 17 ? 'c-3' : 'c-4');
    
    // Левая часть ряда
    for(let i=33; i>=18; i--) rowHtml += createSeat(r, i, cat, 'p2');
    
    // Центральная часть (Ложа или номер ряда)
    rowHtml += `<div class="central-gap">`;
    if (r === 15 || r === 16) {
        rowHtml += `<div class="lodge-box">`;
        if(r === 15) rowHtml += `<div class="lodge-title">Ложа</div>`;
        rowHtml += `<div class="row" style="gap:1px; transform: scale(0.9);">`;
        for(let li=5; li>=1; li--) rowHtml += createSeat('L'+(r-14), li, 'c-3', 'lodge');
        rowHtml += `</div></div>`;
    } else if (r <= 14) {
        rowHtml += `<span style="font-size:10px; font-weight:bold; color:color:rgb(206, 206, 206);">${r}</span>`;
    }
    rowHtml += `</div>`;
    
    // Правая часть ряда
    for(let i=17; i>=1; i--) rowHtml += createSeat(r, i, cat, 'p2');
    rowHtml += `<div class="row-num">${r}</div></div>`;
    p2.innerHTML += rowHtml;
}

// 3. Бенуары
const b1 = document.getElementById('ben-1');
const b2 = document.getElementById('ben-2');
for(let r=1; r<=2; r++) {
    let r1 = `<div class="row">`, r2 = `<div class="row">`;
    for(let i=6; i>=1; i--) {
        r1 += createSeat(r, i, 'c-4', 'b1');
        r2 += createSeat(r, i, 'c-4', 'b2');
    }
    b1.innerHTML += r1 + `</div>`;
    b2.innerHTML += r2 + `</div>`;
}

// ЛОГИКА ОБНОВЛЕНИЯ
function handleUpdate(cat, isChecked, row, seat, id) {
    if (isChecked) {
        state.selected.push({ id, row, seat, price: prices[cat] });
    } else {
        state.selected = state.selected.filter(item => item.id !== id);
    }
    renderCart();
}

function removeItem(id) {
    const cb = document.getElementById(id);
    if (cb) cb.checked = false;
    state.selected = state.selected.filter(item => item.id !== id);
    renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-items');
    const orderBtn = document.getElementById('order-btn'); // Получаем кнопку

    if (state.selected.length === 0) {
        list.innerHTML = '<p class="empty-msg">Места не выбраны</p>';
        orderBtn.disabled = true; // Выключаем кнопку
    } else {
        list.innerHTML = state.selected.map(item => `
            <div class="cart-item">
                <span>Ряд ${item.row}, Мест ${item.seat}</span>
                <span><b>${item.price} BYN</b> <span class="remove-item" onclick="removeItem('${item.id}')">✕</span></span>
            </div>
        `).join('');
        orderBtn.disabled = false; // Включаем кнопку
    }
    
    document.getElementById('count').innerText = state.selected.length;
    document.getElementById('total').innerText = state.selected.reduce((s, i) => s + i.price, 0);
}

// --- ФУНКЦИИ МОДАЛЬНОГО ОКНА ---

// Открытие модального окна (сброс на первый шаг)
function openModal() { 
    if(state.selected.length === 0) return; 
    document.getElementById('step-contacts').style.display = 'block';
    document.getElementById('step-payment').style.display = 'none';
    document.getElementById('regModal').style.display = 'block'; 
}

function closeModal() { 
    document.getElementById('regModal').style.display = 'none'; 
}

// Переход к оплате
// Переход к оплате с проверкой данных
function goToPayment() {
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const phoneInput = document.getElementById('user-phone');

    // Проверка имени (только буквы)
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/;
    if (!nameRegex.test(nameInput.value)) {
        alert("В поле 'Имя' не должно быть цифр и спецсимволов!");
        nameInput.focus();
        return;
    }

    // Проверка Email (стандартная браузерная проверка)
    if (!emailInput.checkValidity()) {
        alert("Введите корректный адрес электронной почты!");
        emailInput.focus();
        return;
    }

    // Проверка телефона (минимум 7 цифр для базовой защиты)
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
        alert("Введите корректный номер телефона!");
        phoneInput.focus();
        return;
    }
    
    // Если всё ок, переходим дальше
    document.getElementById('step-contacts').style.display = 'none';
    document.getElementById('step-payment').style.display = 'block';
}

// Возврат на шаг назад
function backToContacts() {
    document.getElementById('step-payment').style.display = 'none';
    document.getElementById('step-contacts').style.display = 'block';
}

// Финальное подтверждение (Кнопка "КУПИТЬ")
function confirmOrder() {
    const name = document.getElementById('user-name').value;
    const total = document.getElementById('total').innerText;

    // 1. Скрываем кнопки и крестик, чтобы пользователь не мог прервать процесс
    document.querySelector('.close-x').style.visibility = 'hidden';
    document.querySelector('.modal-actions').style.display = 'none';
    
    // 2. Выводим уведомление
    alert(`Успешно! Спасибо, ${name}.\nБилеты отправлены на вашу почту.\nСумма оплаты: ${total} BYN.`);
    
    // 3. После нажатия "ОК" в alert — закрываем окно автоматически
    closeModal();

    // 4. Очистка данных зала и корзины
    state.selected = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);

    renderCart();

    // 5. Возвращаем видимость элементов для следующего заказа
    document.querySelector('.close-x').style.visibility = 'visible';
    document.querySelector('.modal-actions').style.display = 'flex';
    
    // Сброс полей ввода
    document.querySelectorAll('#regModal input').forEach(input => input.value = '');
}


function confirmOrder() {
    const card = document.getElementById('card-number').value;
    const expiry = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;

    if (card.length < 19) {
        alert("Введите полный номер карты (16 цифр)");
        return;
    }
    if (expiry.length < 5) {
        alert("Введите срок действия карты (ММ/ГГ)");
        return;
    }
    if (cvv.length < 3) {
        alert("Введите CVV код (3 цифры)");
        return;
    }

    // Блокируем кнопки и показываем загрузку...
    document.querySelector('.close-x').style.display = 'none';
    document.getElementById('final-buy-btn').disabled = true;
    document.getElementById('final-cancel-btn').style.display = 'none';
    document.getElementById('final-buy-btn').innerText = "ОБРАБОТКА...";

    setTimeout(() => {
        alert(`Успешно! Билеты отправлены на почту. До встречи в театре!`);
        location.reload(); 
    }, 1500);
}

// Закрытие окна при клике на темный фон (вне контента)
window.onclick = function(event) {
    const modal = document.getElementById('regModal');
    if (event.target == modal) {
        closeModal();
    }
}

let zoomLevel = 1;
const hallMap = document.getElementById('hall-map');

function changeZoom(amount) {
    zoomLevel *= amount;
    // Ограничения, чтобы не сделать слишком мелко или слишком крупно
    if (zoomLevel < 0.5) zoomLevel = 0.5;
    if (zoomLevel > 2.5) zoomLevel = 2.5;
    
    updateZoom();
}

function resetZoom() {
    zoomLevel = 1;
    updateZoom();
}

function updateZoom() {
    hallMap.style.transform = `scale(${zoomLevel})`;
}

// Позволяет использовать колесико мыши для зума (Ctrl + Колесо)
document.getElementById('zoom-viewport').addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();
        changeZoom(e.deltaY > 0 ? 0.9 : 1.1);
    }
}, { passive: false });

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('name')) {
        const infoBlock = document.getElementById('selected-event-info');
        infoBlock.style.display = 'flex'; // Показываем блок

        document.getElementById('header-event-name').textContent = decodeURIComponent(params.get('name'));
        document.getElementById('header-event-date').textContent = decodeURIComponent(params.get('date'));
        document.getElementById('header-event-time').textContent = decodeURIComponent(params.get('time'));
        
        const imgPath = decodeURIComponent(params.get('img'));
        if (imgPath) {
            document.getElementById('header-event-img').src = imgPath;
        }
    }
});

document.addEventListener('input', (e) => {
    const input = e.target;
    
    // 1. Форматирование номера карты (пробелы каждые 4 цифры)
    if (input.id === 'card-number') {
        let value = input.value.replace(/\D/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
        input.value = formatted;
        document.getElementById('card-num-mirror').innerText = formatted || '•••• •••• •••• ••••';
        
        if (value.length === 16) document.getElementById('card-expiry').focus();
    }

    // 2. Форматирование срока действия (добавление /)
    if (input.id === 'card-expiry') {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            input.value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        if (value.length === 4) document.getElementById('card-cvv').focus();
    }

    // 3. CVV - ограничение только цифры
    if (input.id === 'card-cvv') {
        input.value = input.value.replace(/\D/g, '');
    }
});

// Обновленная функция завершения
function confirmOrder() {
    const name = document.getElementById('user-name').value;
    const card = document.getElementById('card-number').value;

    if (card.length < 19) {
        alert("Пожалуйста, введите корректный номер карты");
        return;
    }

    // Блокируем всё
    document.querySelector('.close-x').style.display = 'none';
    document.getElementById('final-buy-btn').disabled = true;
    document.getElementById('final-cancel-btn').style.display = 'none';
    document.getElementById('final-buy-btn').innerText = "ОБРАБОТКА...";

    setTimeout(() => {
        alert(`Успешно! Билеты отправлены на почту. До встречи в театре!`);
        
        // Очистка и закрытие
        state.selected = [];
        renderCart();
        closeModal();
        location.reload(); // Перезагружаем для сброса всех состояний
    }, 1500);
}