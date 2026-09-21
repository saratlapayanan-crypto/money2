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

const GENERATED_CARD_ASSETS = {
    christmas: {
        cardId: 'major-0',
        src: 'output/imagegen/christmas-the-fool-art-nouveau.png',
        alt: 'ไพ่ The Fool ธีม Christmas / Winter Solstice วาดใหม่สไตล์ Art Nouveau',
        label: 'The Fool · ไพ่ใบแรกที่สร้างเป็นภาพแยก'
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

    const generatedCard = GENERATED_CARD_ASSETS[currentTheme];
    if (generatedCard) {
        renderGeneratedCard(grid, generatedCard);
        return;
    }

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

function renderGeneratedCard(grid, asset) {
    const section = document.createElement('section');
    section.className = 'col-span-full rounded-2xl border border-gold/35 bg-black/20 p-4 text-center shadow-xl';
    section.innerHTML = `
        <div class="mb-4 flex flex-wrap items-baseline justify-between gap-2 text-left">
            <h2 class="text-lg font-semibold text-gold">${asset.label}</h2>
            <span class="text-xs text-gray-400">1 / 78 approved artwork</span>
        </div>
        <img src="${asset.src}" alt="${asset.alt}" loading="eager"
             class="mx-auto w-full max-w-xs rounded-xl border border-gold/35 shadow-2xl" />
        <p class="mt-4 text-xs leading-6 text-gray-400">
            ไพ่ใบนี้เป็นภาพ raster ใหม่จริง จึงไม่มี SVG ปะปนในธีม Christmas ตอนนี้
            ไพ่ที่เหลืออีก 77 ใบจะถูกสร้างและตรวจทีละใบก่อนนำมาแสดง
        </p>
    `;
    grid.appendChild(section);
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
