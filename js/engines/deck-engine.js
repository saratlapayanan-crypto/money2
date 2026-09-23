import { getThaiDateString } from '../utils/timezone.js';
import { loadCards, loadDecks, loadSeasons } from '../data-loader.js';
import { resolveDeckId, validateDecks, validateSeasons } from '../domain/decks.js';

export async function setupGlobalDecks() {
    try {
        const [cards, rawDecks, rawSeasons] = await Promise.all([loadCards(), loadDecks(), loadSeasons()]);
        const decks = validateDecks(rawDecks, cards);
        const seasons = validateSeasons(rawSeasons);
        const activeId = getActiveDeck(decks, seasons);
        applyDeckTheme(activeId);
        initDeckSelector(decks);
        return activeId;
    } catch (e) {
        console.error("Deck setup failed:", e);
        return 'standard';
    }
}

const MANUAL_DECK_KEY = 'tarot_manual_deck';

/**
 * Determines the active deck ID.
 * Priority: 1. Manual override (localStorage) 2. Seasonal mapping 3. Default ('standard')
 */
export function getActiveDeck(decks, seasons) {
    let manual = null;
    try { manual = localStorage.getItem(MANUAL_DECK_KEY); } catch (_) { /* storage unavailable */ }
    return resolveDeckId({
        decks,
        seasons,
        mmdd: getThaiDateString().substring(5, 10),
        manualId: manual
    });
}

/**
 * Applies the selected deck to the UI (e.g. adding a data attribute to body)
 */
export function applyDeckTheme(deckId) {
    document.body.setAttribute('data-deck', deckId);
    try { localStorage.setItem('tarot_active_deck', deckId); } catch (_) { /* storage unavailable */ }
}

/**
 * รหัสสำรับที่ใช้งานอยู่ตอนนี้ (สำหรับระบบวาดภาพไพ่)
 */
export function getActiveDeckId() {
    return document.body.getAttribute('data-deck') || 'standard';
}

/**
 * Initializes the dropdown selector and injects it into the header.
 */
export function initDeckSelector(decks) {
    let selector = document.getElementById('deck-selector');
    
    // Inject if not present
    if (!selector) {
        const header = document.querySelector('header');
        if (!header) return;

        const container = document.createElement('div');
        container.className = 'header-theme-pill flex items-center gap-1 bg-white border border-amber-300/80 rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs';
        
        const sun = document.createElement('span');
        sun.className = 'text-amber-500 text-xs';
        sun.textContent = '☀️';
        container.appendChild(sun);

        selector = document.createElement('select');
        selector.id = 'deck-selector';
        selector.className = 'bg-transparent text-[11px] font-medium text-[#231230] focus:outline-none cursor-pointer border-none p-0';
        
        container.appendChild(selector);
        header.appendChild(container);
    }

    // Clear existing
    selector.innerHTML = '<option value="auto">Auto (ตามเทศกาล)</option>';
    
    // Add available decks
    decks.forEach(deck => {
        const opt = document.createElement('option');
        opt.value = deck.id;
        opt.textContent = deck.name;
        selector.appendChild(opt);
    });

    // Set selected
    let manual = null;
    try { manual = localStorage.getItem(MANUAL_DECK_KEY); } catch (_) { /* storage unavailable */ }
    if (manual && manual !== 'auto' && decks.find(d => d.id === manual)) {
        selector.value = manual;
    } else {
        selector.value = 'auto';
    }

    // Listen for changes
    selector.addEventListener('change', (e) => {
        const selected = decks.some((deck) => deck.id === e.target.value) ? e.target.value : 'auto';
        try { localStorage.setItem(MANUAL_DECK_KEY, selected); } catch (_) { /* storage unavailable */ }
        window.location.reload(); // Apply changes immediately
    });
}
