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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Добавляй пути к новым фото в этот массив
    const slides = [
        'resurse/afisha_baleta_slajder.webp', 
        'resurse/solovej_slajder.webp', 
        'resurse/mirskij_zamok_1920h645.webp', 
        'resurse/23_aprelya.webp'
    ];
    
    let currentIndex = 0;
    const sliderImage = document.querySelector('.slider-image-placeholder img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Функция смены слайда
    function updateSlider(index) {
        sliderImage.style.opacity = '0'; // Плавное исчезновение
        setTimeout(() => {
            sliderImage.src = slides[index];
            sliderImage.style.opacity = '0.8'; // Плавное появление
        }, 300);
    }

    // Логика кнопки "Вперед"
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider(currentIndex);
        resetTimer(); // Сбрасываем таймер при ручном нажатии
    }

    // Логика кнопки "Назад"
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider(currentIndex);
        resetTimer(); // Сбрасываем таймер при ручном нажатии
    }

    nextBtn.addEventListener('click', showNextSlide);
    prevBtn.addEventListener('click', showPrevSlide);

    // 2. Автоматическое перелистывание каждые 5 секунд (5000 мс)
    let autoSlideTimer = setInterval(showNextSlide, 5000);

    // Функция для сброса таймера, чтобы слайд не переключился сразу после того, 
    // как пользователь нажал на кнопку вручную
    function resetTimer() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(showNextSlide, 10000);
    }
});