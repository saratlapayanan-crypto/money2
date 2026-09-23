import { getThaiDateString } from '../utils/timezone.js';
import { getOrCreateUserId } from '../utils/user.js';
import { getDeterministicNumber } from '../utils/crypto.js';

const DAILY_ALGO_VERSION = 'v1';
// This secret should be securely generated or fetched from an API in the future
// For MVP, we use a static obfuscated string
const DAILY_SECRET = 'tarot_obfuscated_secret_2026_xyz';

/**
 * Get the daily card for the current user deterministically.
 * @param {Array} cards - The full deck of available cards
 * @returns {Promise<{card: Object, debugInfo: Object|null}>}
 */
export async function getDailyCard(cards, forceNew = false) {
    if (!cards || cards.length === 0) {
        throw new Error("No cards available to draw from.");
    }

    const userId = getOrCreateUserId();
    const thaiDate = getThaiDateString(); // Changes exactly at Asia/Bangkok midnight
    
    let drawCount = 0;
    try {
        const stored = sessionStorage.getItem('tarot_daily_draw_count');
        if (stored) drawCount = parseInt(stored, 10) || 0;
        if (forceNew) {
            drawCount += 1;
            sessionStorage.setItem('tarot_daily_draw_count', String(drawCount));
        }
    } catch (_) {}

    // Seed structure: includes userId and drawCount for user diversity and redraw capability
    const seed = `${DAILY_ALGO_VERSION}|${userId}|${thaiDate}|daily|${drawCount}|${DAILY_SECRET}`;
    
    // Get deterministic index (0 to cards.length - 1)
    const index = await getDeterministicNumber(seed, cards.length);
    const selectedCard = cards[index];

    // Debugging Support
    const isDebug = localStorage.getItem('tarot_debug') === 'true';
    let debugInfo = null;
    
    if (isDebug) {
        debugInfo = {
            userId,
            thaiDate,
            timezone: 'Asia/Bangkok',
            scope: 'daily',
            version: DAILY_ALGO_VERSION,
            seedMasked: seed.replace(userId, '[USER_ID]').replace(DAILY_SECRET, '[SECRET]'),
            hashResultIndex: index,
            cardId: selectedCard.id,
            cardName: selectedCard.name
        };
        console.log("[Daily Engine Debug]", debugInfo);
    }

    return {
        card: selectedCard,
        debugInfo
    };
}
