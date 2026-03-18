document.addEventListener('DOMContentLoaded', () => {
    const genreFilter = document.getElementById('genre-filter');
    const tickets = document.querySelectorAll('.ticket-card');

    genreFilter.addEventListener('change', (e) => {
        const selectedGenre = e.target.value;

        tickets.forEach(ticket => {
            if (selectedGenre === 'all' || ticket.getAttribute('data-genre') === selectedGenre) {
                ticket.style.display = 'grid'; // Показываем
            } else {
                ticket.style.display = 'none'; // Скрываем
            }
        });
    });
});