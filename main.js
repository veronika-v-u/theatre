document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-toggle');
    const navList = document.getElementById('nav-list');

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            navList.classList.toggle('active');
        });
    }

    // Закрывать меню при клике на ссылку
    document.querySelectorAll('.top-nav a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            navList.classList.remove('active');
        });
    });
});