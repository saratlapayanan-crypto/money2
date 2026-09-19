import { secureShuffle } from '../utils/crypto.js';

const SESSION_KEY = 'tarot_reading_session';

/**
 * Generates an array of all exactly 78 unique Tarot Card IDs.
 * 22 Major, 14 Wands, 14 Cups, 14 Swords, 14 Pentacles
 */
function generateAllCardIds() {
    const ids = [];
    for(let i = 0; i <= 21; i++) ids.push(`major-${i}`);
    for(let i = 1; i <= 14; i++) ids.push(`wands-${i}`);
    for(let i = 1; i <= 14; i++) ids.push(`cups-${i}`);
    for(let i = 1; i <= 14; i++) ids.push(`swords-${i}`);
    for(let i = 1; i <= 14; i++) ids.push(`pentacles-${i}`);
    return ids;
}

/**
 * Create a new personal reading session.
 * 78 cards mapped to position instantly after secure shuffle.
 */
export function createReadingSession(category, subtopic) {
    const allIds = generateAllCardIds();
    
    // Safety check invariant rule
    if (new Set(allIds).size !== 78) {
        throw new Error("Critical Error: Deck size is not exactly 78");
    }
    
    const shuffled = secureShuffle(allIds);
    
    // Post-shuffle validation
    if (new Set(shuffled).size !== 78) {
        throw new Error('Critical: Deck integrity compromised after shuffle');
    }

    let sessionId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID();
    } else {
        const rand = new Uint32Array(1);
        crypto.getRandomValues(rand);
        sessionId = 'session-' + Date.now() + '-' + rand[0];
    }
    
    const sessionData = {
        sessionId,
        category,
        subtopic,
        deckMapping: shuffled, // The position -> card map
        selectedPosition: null,
        locked: false,
        cardId: null
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    // Log debug if enabled
    if (localStorage.getItem('tarot_debug') === 'true') {
        console.log("[Personal Engine] Session Created:", {
            sessionId: sessionData.sessionId,
            deckSize: sessionData.deckMapping.length,
            first10: sessionData.deckMapping.slice(0, 10),
            category: sessionData.category,
            subtopic: sessionData.subtopic
        });
    }
    
    return sessionData;
}

/**
 * Temporarily select a position (can be changed until confirmed).
 */
export function selectPosition(position) {
    const session = getSession();
    if (!session) throw new Error("No active session");
    if (session.locked) throw new Error("Session is locked");
    
    session.selectedPosition = position;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

/**
 * Locks the selected position and reveals the mapped card ID.
 */
export function confirmSelection() {
    const session = getSession();
    if (!session) throw new Error("No active session");
    if (session.selectedPosition === null) throw new Error("No card selected");
    if (session.locked) return session; // Already locked
    
    session.locked = true;
    session.cardId = session.deckMapping[session.selectedPosition];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    
    if (localStorage.getItem('tarot_debug') === 'true') {
        console.log("[Personal Engine] Confirmed:", {
            selectedPosition: session.selectedPosition,
            mappedCardId: session.cardId
        });
    }
    
    return session;
}

/**
 * Retrieve current session
 */
export function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}
