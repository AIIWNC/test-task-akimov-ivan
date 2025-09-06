// Элементы DOM для работы с галереей и модальным окном
const imageInfo = document.getElementById('image-info');
const imageGrid = document.querySelector('.image-grid');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalCloseBtn = document.querySelector('.modal-close');
const restoreBtn = document.getElementById('restore-btn');


// Обновление информации о количестве картинок и текущей дате
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


// Инициализация страницы
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


// Логика модального окна для просмотра картинок
imageGrid.addEventListener('click', (event) => {
    if (event.target.tagName === 'IMG') {
        const imageSrc = event.target.src;
        modalContent.src = imageSrc;
        overlay.style.display = 'flex';
    }

    if (event.target.classList.contains('remove-btn')) {
        const imageItem = event.target.closest('.image-item');
        if (imageItem) removeImage(imageItem);
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


// Удаление картинки и сохранение состояния в localStorage
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

// Восстановление всех удаленных картинок
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

// Задача 3 — поиск университетов
const apiUrl = "http://universities.hipolabs.com/search?country=";

const searchBtn = document.getElementById("search-btn");
const resetBtn = document.getElementById("reset-btn");
const countryInput = document.getElementById("country-input");
const tableContainer = document.getElementById("table-container");
const selectedCount = document.getElementById("selected-count");

// Восстанавливаем сохранённое состояние таблицы и чекбоксов
document.addEventListener("DOMContentLoaded", () => {
    const savedState = JSON.parse(localStorage.getItem("task3State"));
    if (savedState) {
        countryInput.value = savedState.country || "";
        tableContainer.innerHTML = savedState.tableHTML || "";
        selectedCount.textContent = `Выбрано: ${savedState.count || 0}`;

        restoreCheckboxState();
    }
});

// Сохраняем состояние поиска и выбранных чекбоксов
function saveState() {
    const checkboxes = document.querySelectorAll(".save-checkbox");
    const checked = [];
    checkboxes.forEach((cb, index) => {
        if (cb.checked) checked.push(index);
    });

    const state = {
        country: countryInput.value,
        tableHTML: tableContainer.innerHTML,
        count: document.querySelectorAll(".save-checkbox:checked").length,
        checkedIndexes: checked
    };

    localStorage.setItem("task3State", JSON.stringify(state));
}

// Восстанавливаем состояние чекбоксов после перезагрузки
function restoreCheckboxState() {
    const savedState = JSON.parse(localStorage.getItem("task3State"));
    if (savedState && savedState.checkedIndexes) {
        const checkboxes = document.querySelectorAll(".save-checkbox");
        checkboxes.forEach((cb, index) => {
            cb.checked = savedState.checkedIndexes.includes(index);
        });
    }
}

// Поиск университетов через API
searchBtn.addEventListener("click", async () => {
    const country = countryInput.value.trim();
    if (!country) return alert("Введите страну!");

    try {
        const response = await fetch(apiUrl + country);
        const data = await response.json();

        if (!data.length) {
            tableContainer.innerHTML = "<p>Ничего не найдено.</p>";
            return;
        }

        // Формируем таблицу с результатами поиска
        let tableHTML = `<table><thead><tr>
            <th>#</th>
            <th>Название</th>
            <th>Страна</th>
            <th>Код страны</th>
            <th>Сайт</th>
            <th>Сохранить</th>
        </tr></thead><tbody>`;

        data.forEach((uni, index) => {
            tableHTML += `<tr>
                <td>${index + 1}</td>
                <td>${uni.name}</td>
                <td>${uni.country}</td>
                <td>${uni.alpha_two_code}</td>
                <td><a href="${uni.web_pages[0]}" target="_blank">Перейти</a></td>
                <td><input type="checkbox" class="save-checkbox"></td>
            </tr>`;
        });

        tableHTML += "</tbody></table>";

        tableContainer.innerHTML = tableHTML;

        updateSelectedCount();
        saveState();
    } catch (error) {
        console.error("Ошибка:", error);
        tableContainer.innerHTML = "<p>Ошибка загрузки данных.</p>";
    }
});

// Сброс поиска и таблицы
resetBtn.addEventListener("click", () => {
    countryInput.value = "";
    tableContainer.innerHTML = "";
    selectedCount.textContent = "Выбрано: 0";
    localStorage.removeItem("task3State");
});

// Обновляем счетчик выбранных университетов при изменении чекбоксов
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll(".save-checkbox");
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const count = document.querySelectorAll(".save-checkbox:checked").length;
            selectedCount.textContent = `Выбрано: ${count}`;
            saveState();
        });
    });
}

