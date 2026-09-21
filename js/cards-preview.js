import { loadCards } from './data-loader.js';
import { THEMES } from './art/themes.js';
import { renderCardFront, renderCardBack } from './art/tarot-art.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';

let allCards = [];
let currentTheme = 'standard';

// Generated concept art is kept separate from the 78-card registry until each
// card has its own reviewed asset. Showing the reviewed pilot here makes the
// new visual direction visible without pretending that the whole deck is done.
const GENERATED_PREVIEWS = {
    christmas: {
        src: 'output/imagegen/christmas-solstice-style-02-art-nouveau.png',
        alt: 'ตัวอย่างไพ่คริสต์มาสและหลังไพ่ Art Nouveau ที่สร้างใหม่',
        title: 'ตัวอย่างภาพใหม่ · Christmas / Winter Solstice',
        note: 'ภาพตัวอย่าง Art Nouveau ที่สร้างขึ้นใหม่ — ยังไม่ใช่ภาพครบ 78 ใบ'
    }
};

async function init() {
    try { await setupGlobalDecks(); } catch (_) { /* optional */ }
    currentTheme = getActiveDeckId();
    allCards = await loadCards();
    buildThemePicker();
    renderGrid();
}

function buildThemePicker() {
    const picker = document.getElementById('theme-picker');
    picker.innerHTML = '';
    Object.entries(THEMES).forEach(([id, t]) => {
        const btn = document.createElement('button');
        btn.className = 'chip' + (id === currentTheme ? ' !bg-gold/25 !border-gold font-bold' : '');
        btn.textContent = t.label;
        btn.addEventListener('click', () => { currentTheme = id; buildThemePicker(); renderGrid(); });
        picker.appendChild(btn);
    });
}

function renderGrid() {
    const grid = document.getElementById('cards-preview');
    grid.innerHTML = '';

    renderGeneratedPreview();

    // หลังไพ่ใบแรกของธีม
    const backCell = document.createElement('div');
    backCell.innerHTML = renderCardBack(currentTheme);
    backCell.querySelector('svg').classList.add('w-full', 'h-auto', 'rounded-lg', 'shadow-lg');
    grid.appendChild(backCell);

    allCards.forEach(card => {
        const cell = document.createElement('div');
        cell.innerHTML = renderCardFront(card, currentTheme);
        const svg = cell.querySelector('svg');
        svg.classList.add('w-full', 'h-auto', 'rounded-lg', 'shadow-lg');
        grid.appendChild(cell);
    });
}

function renderGeneratedPreview() {
    const previous = document.getElementById('generated-preview');
    previous?.remove();

    const preview = GENERATED_PREVIEWS[currentTheme];
    if (!preview) return;

    const section = document.createElement('section');
    section.id = 'generated-preview';
    section.className = 'mb-8 rounded-2xl border border-gold/35 bg-black/20 p-4 shadow-xl';
    section.innerHTML = `
        <div class="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-lg font-semibold text-gold">${preview.title}</h2>
            <span class="text-xs text-gray-400">pilot artwork</span>
        </div>
        <img src="${preview.src}" alt="${preview.alt}" loading="eager"
             class="mx-auto w-full max-w-4xl rounded-xl border border-gold/25 shadow-2xl" />
        <p class="mt-3 text-center text-xs text-gray-400">${preview.note}</p>
    `;
    document.getElementById('cards-preview').before(section);
}

document.addEventListener('DOMContentLoaded', init);
