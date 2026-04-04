// Находим все кнопки покупки
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('buy-btn')) {
        const btn = e.target;
        // Собираем данные из атрибутов кнопки
        const name = encodeURIComponent(btn.getAttribute('data-name'));
        const time = encodeURIComponent(btn.getAttribute('data-time') || '19:00');
        const date = encodeURIComponent(btn.getAttribute('data-date') || '20 Марта');
        const img = encodeURIComponent(btn.getAttribute('data-img'));

        // Формируем URL с параметрами
        const url = `seats.html?name=${name}&time=${time}&date=${date}&img=${img}`;
        window.location.href = url;
    }
});