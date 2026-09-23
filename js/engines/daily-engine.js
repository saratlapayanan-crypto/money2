import { getThaiDateString, getTimeUntilMidnightBangkok } from '../utils/timezone.js';
import { getOrCreateUserId } from '../utils/user.js';
import { secureShuffle } from '../utils/crypto.js';

const DAILY_STORAGE_PREFIX = 'tarot_daily_record_v2_';

/**
 * Generates an array of all exactly 78 canonical Tarot Card IDs.
 * 22 Major, 14 Wands, 14 Cups, 14 Swords, 14 Pentacles
 * @returns {Array<string>}
 */
export function generateAllCardIds() {
    const ids = [];
    for (let i = 0; i <= 21; i++) ids.push(`major-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`wands-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`cups-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`swords-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`pentacles-${i}`);
    return ids;
}

/**
 * Retrieves the stored daily card record for today (if user has already drawn today).
 * @returns {{ cardId: string, position: number, date: string, timestamp: number } | null}
 */
export function getStoredDailyRecord() {
    const thaiDate = getThaiDateString();
    try {
        const stored = localStorage.getItem(`${DAILY_STORAGE_PREFIX}${thaiDate}`);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.cardId && parsed.date === thaiDate) {
                return parsed;
            }
        }
    } catch (_) {}
    return null;
}

/**
 * Saves the user's chosen daily card for today. Locked for 24h until next Thai midnight.
 * @param {string} cardId - The chosen card ID
 * @param {number} position - Position in the spread (0-77)
 * @returns {Object} Saved record
 */
export function saveDailyRecord(cardId, position = 0) {
    const thaiDate = getThaiDateString();
    const record = {
        cardId,
        position,
        date: thaiDate,
        timestamp: Date.now()
    };
    try {
        localStorage.setItem(`${DAILY_STORAGE_PREFIX}${thaiDate}`, JSON.stringify(record));
    } catch (_) {}
    return record;
}

/**
 * Prepares the 78-card spread deck for today's draw.
 * Cached in sessionStorage so positions don't scramble while browsing on the same day before confirming.
 * @returns {Array<string>} Shuffled 78 card IDs
 */
export function getDailySpreadDeck() {
    const thaiDate = getThaiDateString();
    const sessionKey = `tarot_daily_spread_deck_${thaiDate}`;
    try {
        const cached = sessionStorage.getItem(sessionKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length === 78) {
                return parsed;
            }
        }
    } catch (_) {}

    const allIds = generateAllCardIds();
    const shuffled = secureShuffle(allIds);
    try {
        sessionStorage.setItem(sessionKey, JSON.stringify(shuffled));
    } catch (_) {}
    return shuffled;
}

/**
 * Get daily card object. If user has already drawn, returns their locked card.
 * If not drawn yet, returns null card.
 * @param {Array} cards - All card objects
 * @returns {Promise<{ card: Object|null, record: Object|null }>}
 */
export async function getDailyCard(cards) {
    if (!cards || cards.length === 0) {
        throw new Error("No cards available to draw from.");
    }
    const record = getStoredDailyRecord();
    if (record) {
        const card = cards.find(c => c.id === record.cardId);
        if (card) return { card, record };
    }
    return { card: null, record: null };
}

export { getTimeUntilMidnightBangkok };
