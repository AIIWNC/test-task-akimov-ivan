// Логика для задачи 2

// Элементы DOM
const imageInfo = document.getElementById('image-info');
const imageGrid = document.querySelector('.image-grid');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalCloseBtn = document.querySelector('.modal-close');

// Подсчет и вывод даты
function updateImageInfo() {
    const images = document.querySelectorAll('.image-item img');
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
document.addEventListener('DOMContentLoaded', updateImageInfo);


// 8) Логика модального окна
imageGrid.addEventListener('click', (event) => {
    // Если клик был по изображению, открываем модальное окно
    if (event.target.tagName === 'IMG') {
        const imageSrc = event.target.src;
        modalContent.src = imageSrc;
        overlay.style.display = 'flex';
    }
});

// Закрытие модального окна по клику на крестик
modalCloseBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
});

// Закрытие модального окна по клику на затемненную область
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
        imageItem.remove();
        updateImageInfo();
    }
}
});