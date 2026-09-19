import { loadCards } from './data-loader.js';
import { THEMES } from './art/themes.js';
import { renderCardFront, renderCardBack } from './art/tarot-art.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';

let allCards = [];
let currentTheme = 'standard';

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

document.addEventListener('DOMContentLoaded', init);
