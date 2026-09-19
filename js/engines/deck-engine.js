import { getThaiDateString } from '../utils/timezone.js';
import { loadDecks, loadSeasons } from '../data-loader.js';

export async function setupGlobalDecks() {
    try {
        const [decks, seasons] = await Promise.all([loadDecks(), loadSeasons()]);
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
    // 1. Manual override
    const manual = localStorage.getItem(MANUAL_DECK_KEY);
    if (manual && manual !== 'auto') {
        const valid = decks.find(d => d.id === manual);
        if (valid) return valid.id;
    }

    // 2. Seasonal auto-detect
    const todayIso = getThaiDateString(); // e.g. "2026-09-16"
    const mmdd = todayIso.substring(5, 10); // "09-16"

    if (seasons && seasons.length > 0) {
        for (const season of seasons) {
            const start = season.start;
            const end = season.end;
            let match = false;
            
            if (start <= end) {
                // e.g. "04-12" to "04-16"
                match = mmdd >= start && mmdd <= end;
            } else {
                // e.g. "12-25" to "01-05" (spanning new year)
                match = mmdd >= start || mmdd <= end;
            }
            
            if (match) return season.deck_id;
        }
    }

    // 3. Fallback
    return 'standard';
}

/**
 * Applies the selected deck to the UI (e.g. adding a data attribute to body)
 */
export function applyDeckTheme(deckId) {
    document.body.setAttribute('data-deck', deckId);
    try { localStorage.setItem('tarot_active_deck', deckId); } catch (_) { /* ignore */ }
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
        container.className = 'absolute top-4 right-4 md:static md:ml-auto';
        
        selector = document.createElement('select');
        selector.id = 'deck-selector';
        selector.className = 'bg-mystic border border-white/20 text-xs text-white p-1 rounded focus:outline-none focus:border-gold';
        
        container.appendChild(selector);
        header.appendChild(container);
    }

    // Clear existing
    selector.innerHTML = '<option value="auto">🌟 Auto (ตามเทศกาล)</option>';
    
    // Add available decks
    decks.forEach(deck => {
        const opt = document.createElement('option');
        opt.value = deck.id;
        opt.textContent = deck.name;
        selector.appendChild(opt);
    });

    // Set selected
    const manual = localStorage.getItem(MANUAL_DECK_KEY);
    if (manual && manual !== 'auto' && decks.find(d => d.id === manual)) {
        selector.value = manual;
    } else {
        selector.value = 'auto';
    }

    // Listen for changes
    selector.addEventListener('change', (e) => {
        localStorage.setItem(MANUAL_DECK_KEY, e.target.value);
        window.location.reload(); // Apply changes immediately
    });
}
