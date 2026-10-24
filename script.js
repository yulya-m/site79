// Новости хранятся в одном месте, на главной выводятся 3 последние,
// в разделе "Новости" — все. Новую новость добавлять в начало массива.
const news = [
    {
        title: 'День открытых дверей',
        text: 'Приглашаем родителей будущих первоклассников познакомиться со школой.',
        date: 'Сентябрь 2026'
    },
    {
        title: 'Школьные мероприятия',
        text: 'В школе прошли праздничные мероприятия, посвящённые началу учебного года.',
        date: 'Сентябрь 2026'
    },
    {
        title: 'Спортивные достижения',
        text: 'Ученики школы приняли участие в городских спортивных соревнованиях.',
        date: 'Сентябрь 2026'
    },
    {
        title: 'Театральная поездка',
        text: 'Ученики начальных классов посетили театральное представление.',
        date: 'Сентябрь 2026'
    }
];

function renderNews(container, count) {
    if (!container) return;

    let list = news;
    if (count) {
        list = news.slice(0, count);
    }

    let html = '';
    list.forEach(item => {
        html += `
            <article class="news-item">
                <div class="news-item__img"></div>
                <div class="news-item__body">
                    <span class="news-item__date">${item.date}</span>
                    <h3 class="news-item__title">${item.title}</h3>
                    <p class="news-item__text">${item.text}</p>
                </div>
            </article>`;
    });
    container.innerHTML = html;
}

renderNews(document.getElementById('home-news'), 3);
renderNews(document.getElementById('all-news'));


// Мобильное меню

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

function closeMenu() {
    nav.classList.remove('nav--open');
    burger.classList.remove('burger--open');
}

burger.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--open');
});


// Переключение разделов через адрес (#news, #info-main и т.д.)
// Благодаря этому работают кнопка "Назад" в браузере и обновление страницы

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

function showSection(id) {
    let target = document.getElementById(id);

    // если такого раздела нет — открываем главную
    if (!target || !target.classList.contains('section')) {
        target = document.getElementById('home');
        id = 'home';
    }

    sections.forEach(sec => sec.classList.remove('section--active'));
    target.classList.add('section--active');

    // подсвечиваем пункт меню. У подразделов id начинается с id раздела:
    // info-main -> info, parents-safety -> parents
    const mainId = id.split('-')[0];
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + mainId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // меняем заголовок вкладки
    const title = target.querySelector('h1, h2');
    if (id === 'home' || !title) {
        document.title = 'МАОУ «СОШ №79» г. Перми — официальный сайт';
    } else {
        document.title = title.textContent + ' — МАОУ «СОШ №79»';
    }

    window.scrollTo(0, 0);
}

function openFromHash() {
    const id = location.hash.replace('#', '');
    showSection(id || 'home');
    closeMenu();
}

window.addEventListener('hashchange', openFromHash);
openFromHash();

// если открыть сразу адрес вида index.html#info-docs, браузер после загрузки
// сам прокручивает к секции и заголовок уезжает под шапку. Возвращаем наверх
window.addEventListener('load', () => {
    setTimeout(() => window.scrollTo(0, 0), 50);
});


// Ссылки-заглушки (href="#"), пока для них нет файлов.
// Без этого клик по ним открывал бы главную

document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
    });
});


// Формы в электронной приёмной
// Кнопка "Открыть форму" показывает/скрывает форму.
// Отправка пока не подключена, поэтому просто показываем сообщение

document.querySelectorAll('.form-open').forEach(btn => {
    btn.addEventListener('click', () => {
        const form = document.getElementById(btn.dataset.form);
        form.hidden = !form.hidden;

        if (form.hidden) {
            btn.textContent = 'Открыть форму';
        } else {
            btn.textContent = 'Скрыть форму';
        }
    });
});

document.querySelectorAll('.form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();

        const message = form.querySelector('.form__message');
        message.textContent = 'Спасибо! Заявка заполнена.';
        message.hidden = false;

        form.reset();
    });
});


// Поиск по сайту

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search');
const searchInfo = document.getElementById('search-info');
const searchResults = document.getElementById('search-results');

// в этих разделах не ищем: на главной дубли новостей, в карте сайта только ссылки
const skipSections = ['home', 'map', 'search'];

searchForm.addEventListener('submit', e => {
    e.preventDefault();

    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query.length < 2) {
        searchInfo.textContent = 'Введите хотя бы 2 символа.';
        location.hash = 'search';
        return;
    }

    let count = 0;
    let html = '';

    sections.forEach(sec => {
        if (skipSections.includes(sec.id)) return;

        if (sec.textContent.toLowerCase().includes(query)) {
            const title = sec.querySelector('h2').textContent;
            html += '<li><a href="#' + sec.id + '">' + title + '</a></li>';
            count++;
        }
    });

    searchResults.innerHTML = html;

    if (count === 0) {
        searchInfo.textContent = 'По запросу «' + searchInput.value.trim() + '» ничего не найдено.';
    } else {
        searchInfo.textContent = 'По запросу «' + searchInput.value.trim() + '» найдено разделов: ' + count;
    }

    // если уже на странице поиска, hashchange не сработает, поэтому показываем вручную
    if (location.hash === '#search') {
        showSection('search');
    } else {
        location.hash = 'search';
    }
});


// Фильтр педагогов по предметам

const filters = document.querySelectorAll('.filter');
const teachers = document.querySelectorAll('.teacher');
const teachersEmpty = document.querySelector('.teachers__empty');

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        const subject = btn.dataset.subject;
        let shown = 0;

        filters.forEach(f => f.classList.remove('filter--active'));
        btn.classList.add('filter--active');

        teachers.forEach(t => {
            // у одного учителя может быть несколько предметов через пробел
            const subjects = t.dataset.subject.split(' ');
            if (subject === 'all' || subjects.includes(subject)) {
                t.hidden = false;
                shown++;
            } else {
                t.hidden = true;
            }
        });

        teachersEmpty.hidden = shown > 0;
    });
});


// Версия для слабовидящих
// Настройки сохраняются в localStorage, чтобы не сбрасывались после перезагрузки

const btnEye = document.querySelector('.btn-eye');
const panel = document.querySelector('.a11y-panel');
const fontButtons = document.querySelectorAll('[data-font]');
const themeButtons = document.querySelectorAll('[data-theme]');
const imagesButton = document.querySelector('[data-images]');
const resetButton = document.querySelector('.a11y-reset');

let settings = {
    panel: false,
    font: 'normal',
    theme: '',
    noImages: false
};

const saved = localStorage.getItem('a11y');
if (saved) {
    settings = JSON.parse(saved);
}

function applySettings() {
    panel.hidden = !settings.panel;
    if (settings.panel) {
        btnEye.classList.add('btn-eye--active');
    } else {
        btnEye.classList.remove('btn-eye--active');
    }

    document.documentElement.classList.remove('font-large', 'font-xlarge');
    if (settings.font !== 'normal') {
        document.documentElement.classList.add('font-' + settings.font);
    }

    document.body.classList.remove('theme-bw', 'theme-wb');
    if (settings.theme) {
        document.body.classList.add('theme-' + settings.theme);
    }

    if (settings.noImages) {
        document.body.classList.add('no-images');
        imagesButton.textContent = 'Включить';
    } else {
        document.body.classList.remove('no-images');
        imagesButton.textContent = 'Выключить';
    }

    // отмечаем выбранные кнопки
    fontButtons.forEach(b => {
        b.classList.remove('selected');
        if (b.dataset.font === settings.font) b.classList.add('selected');
    });
    themeButtons.forEach(b => {
        b.classList.remove('selected');
        if (b.dataset.theme === settings.theme) b.classList.add('selected');
    });

    localStorage.setItem('a11y', JSON.stringify(settings));
}

btnEye.addEventListener('click', () => {
    settings.panel = !settings.panel;
    // при первом открытии сразу включаем крупный шрифт и чёрно-белую схему
    if (settings.panel && !settings.theme && settings.font === 'normal') {
        settings.font = 'large';
        settings.theme = 'bw';
    }
    applySettings();
});

fontButtons.forEach(b => {
    b.addEventListener('click', () => {
        settings.font = b.dataset.font;
        applySettings();
    });
});

themeButtons.forEach(b => {
    b.addEventListener('click', () => {
        settings.theme = b.dataset.theme;
        applySettings();
    });
});

imagesButton.addEventListener('click', () => {
    settings.noImages = !settings.noImages;
    applySettings();
});

resetButton.addEventListener('click', () => {
    settings = { panel: false, font: 'normal', theme: '', noImages: false };
    applySettings();
});

applySettings();
