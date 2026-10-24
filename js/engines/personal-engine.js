import { secureShuffle } from '../utils/crypto.js';

const SESSION_KEY = 'tarot_reading_session';

export const SPREAD_MODES = {
    single: {
        id: 'single',
        cardCount: 1,
        title_th: 'เปิดไพ่ 1 ใบฟันธง (Yes / No)',
        subtitle_th: 'คำตอบชัดเจน ตรงประเด็น รู้แนวทางทันที',
        badge_th: '1 ใบฟันธง',
        slots: ['คำตอบฟันธง']
    },
    'three-time': {
        id: 'three-time',
        cardCount: 3,
        title_th: 'เปิดไพ่ 3 ใบ (อดีต • ปัจจุบัน • อนาคต)',
        subtitle_th: 'ไล่เรียงที่มา สถานการณ์ตอนนี้ และแนวโน้มข้างหน้า',
        badge_th: '3 ใบ เส้นเวลา',
        slots: ['อดีต / ที่มา', 'ปัจจุบัน / ตอนนี้', 'อนาคต / แนวโน้ม']
    },
    'three-insight': {
        id: 'three-insight',
        cardCount: 3,
        title_th: 'เปิดไพ่ 3 ใบเจาะลึก (ใจเรา • ใจเขา/อุปสรรค • ทางออก)',
        subtitle_th: 'เหมาะกับเรื่องความรัก ความสัมพันธ์ หรือการแก้ปัญหาสำคัญ',
        badge_th: '3 ใบ เจาะลึก',
        slots: ['ตัวเรา / จุดแข็ง', 'ใจเขา / อุปสรรค', 'ทางออก / บทสรุป']
    }
};

/**
 * Generates an array of all exactly 78 unique Tarot Card IDs.
 * 22 Major, 14 Wands, 14 Cups, 14 Swords, 14 Pentacles
 */
function generateAllCardIds() {
    const ids = [];
    for (let i = 0; i <= 21; i++) ids.push(`major-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`wands-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`cups-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`swords-${i}`);
    for (let i = 1; i <= 14; i++) ids.push(`pentacles-${i}`);
    return ids;
}

/**
 * Create a new personal reading session.
 * 78 cards mapped to position instantly after secure shuffle.
 */
export function createReadingSession(category, subtopic, spreadMode = 'single') {
    const allIds = generateAllCardIds();

    // Safety check invariant rule
    if (new Set(allIds).size !== 78) {
        throw new Error('Critical Error: Deck size is not exactly 78');
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

    const modeObj = SPREAD_MODES[spreadMode] || SPREAD_MODES.single;

    const sessionData = {
        sessionId,
        category,
        subtopic,
        spreadMode: modeObj.id,
        cardCount: modeObj.cardCount,
        slots: modeObj.slots,
        deckMapping: shuffled, // The position -> card map
        selectedPosition: null,
        selectedPositions: [],
        locked: false,
        cardId: null,
        cardIds: []
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    // Log debug if enabled
    if (localStorage.getItem('tarot_debug') === 'true') {
        console.log('[Personal Engine] Session Created:', {
            sessionId: sessionData.sessionId,
            deckSize: sessionData.deckMapping.length,
            spreadMode: sessionData.spreadMode,
            cardCount: sessionData.cardCount,
            category: sessionData.category,
            subtopic: sessionData.subtopic
        });
    }

    return sessionData;
}

/**
 * Temporarily select a position (can be changed until confirmed).
 * Supports both 1-card and 3-card spread modes.
 */
export function selectPosition(position) {
    const session = getSession();
    if (!session) throw new Error('No active session');
    if (session.locked) throw new Error('Session is locked');

    const cardCount = session.cardCount || 1;
    if (!Array.isArray(session.selectedPositions)) {
        session.selectedPositions = session.selectedPosition !== null ? [session.selectedPosition] : [];
    }

    if (cardCount === 1) {
        session.selectedPositions = [position];
        session.selectedPosition = position;
    } else {
        const existingIdx = session.selectedPositions.indexOf(position);
        if (existingIdx !== -1) {
            // Toggling an already selected card removes it
            session.selectedPositions.splice(existingIdx, 1);
        } else if (session.selectedPositions.length < cardCount) {
            session.selectedPositions.push(position);
        } else {
            // Replace the last slot if already full
            session.selectedPositions[cardCount - 1] = position;
        }
        session.selectedPosition = session.selectedPositions.length > 0 ? session.selectedPositions[0] : null;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

/**
 * Locks the selected position(s) and reveals the mapped card ID(s).
 */
export function confirmSelection() {
    const session = getSession();
    if (!session) throw new Error('No active session');
    if (session.locked) return session; // Already locked

    const requiredCount = session.cardCount || 1;
    const positions =
        Array.isArray(session.selectedPositions) && session.selectedPositions.length > 0
            ? session.selectedPositions
            : session.selectedPosition !== null
              ? [session.selectedPosition]
              : [];

    if (positions.length === 0) {
        throw new Error('No card selected');
    }
    if (positions.length < requiredCount) {
        throw new Error(`กรุณาเลือกไพ่ให้ครบ ${requiredCount} ใบ`);
    }

    session.locked = true;
    session.selectedPositions = positions.slice(0, requiredCount);
    session.selectedPosition = session.selectedPositions[0];
    session.cardIds = session.selectedPositions.map(pos => session.deckMapping[pos]);
    session.cardId = session.cardIds[0];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    if (localStorage.getItem('tarot_debug') === 'true') {
        console.log('[Personal Engine] Confirmed:', {
            selectedPositions: session.selectedPositions,
            mappedCardIds: session.cardIds
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
