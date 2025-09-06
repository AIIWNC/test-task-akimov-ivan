// Элементы DOM
const imageInfo = document.getElementById('image-info');
const imageGrid = document.querySelector('.image-grid');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalCloseBtn = document.querySelector('.modal-close');
const restoreBtn = document.getElementById('restore-btn');


// Подсчет и вывод даты
function updateImageInfo() {
    const images = document.querySelectorAll('.image-item:not(.hidden)');
    const imageCount = images.length;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    imageInfo.textContent = `Количество картинок: ${imageCount}, Дата: ${formattedDate}`;
}


// Запускаем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Получаем удаленные картинки из localStorage
    const deletedImages = JSON.parse(localStorage.getItem('deletedImages')) || [];

    // Скрываем удаленные картинки
    deletedImages.forEach(src => {
        const imageItem = document.querySelector(`[data-img-src="${src}"]`);
        if (imageItem) {
            imageItem.classList.add('hidden');
        }
    });

    updateImageInfo();
});


// Логика модального окна
imageGrid.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
        const imageSrc = event.target.src;
        modalContent.src = imageSrc;
        overlay.style.display = 'flex';
    }
});

modalCloseBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});

overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});


// Логика удаления картинок
imageGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const imageItem = event.target.closest('.image-item');
        if (imageItem) {
            const imageSrc = imageItem.getAttribute('data-img-src');

            // Добавляем путь к картинке в localStorage
            const deletedImages = JSON.parse(localStorage.getItem('deletedImages')) || [];
            if (!deletedImages.includes(imageSrc)) {
                deletedImages.push(imageSrc);
                localStorage.setItem('deletedImages', JSON.stringify(deletedImages));
            }

            // Скрываем элемент
            imageItem.classList.add('hidden');
            updateImageInfo();
        }
    }
});

// Логика для кнопки "Восстановить"
restoreBtn.addEventListener('click', () => {
    // Очищаем localStorage
    localStorage.removeItem('deletedImages');

    // Показываем все картинки
    const allImages = document.querySelectorAll('.image-item');
    allImages.forEach(item => {
        item.classList.remove('hidden');
    });

    updateImageInfo();
});
