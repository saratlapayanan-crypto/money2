const FESTIVAL_DECK_IDS = Object.freeze([
    'christmas',
    'valentine',
    'songkran',
    'loy-krathong',
    'halloween'
]);
const CARD_STATUSES = new Set(['placeholder', 'draft', 'approved']);
const MM_DD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function error(code, message) {
    const value = new Error(message);
    value.code = code;
    return value;
}

function assertMmdd(value) {
    if (typeof value !== 'string' || !MM_DD.test(value)) {
        throw error('SEASON_DATA_INVALID', `Invalid MM-DD value: ${value}`);
    }
    const [month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(2000, month - 1, day));
    if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
        throw error('SEASON_DATA_INVALID', `Invalid calendar date: ${value}`);
    }
    return Math.floor((date - Date.UTC(2000, 0, 1)) / 86_400_000);
}

function daysInWindow(start, end) {
    const first = assertMmdd(start);
    const last = assertMmdd(end);
    const days = new Set();
    if (first <= last) {
        for (let day = first; day <= last; day += 1) days.add(day);
    } else {
        for (let day = first; day <= 365; day += 1) days.add(day);
        for (let day = 0; day <= last; day += 1) days.add(day);
    }
    return days;
}

export function validateSeasons(seasons) {
    if (!Array.isArray(seasons)) throw error('SEASON_DATA_INVALID', 'Seasons must be an array');
    const occupied = new Set();
    for (const season of seasons) {
        if (!season?.id || !season?.deck_id) {
            throw error('SEASON_DATA_INVALID', 'Season identity and deck are required');
        }
        for (const day of daysInWindow(season.start, season.end)) {
            if (occupied.has(day)) throw error('SEASON_DATA_INVALID', `Overlapping season: ${season.id}`);
            occupied.add(day);
        }
    }
    return seasons;
}

export function validateDecks(decks, cards) {
    if (!Array.isArray(decks) || !Array.isArray(cards)) {
        throw error('DECK_DATA_INVALID', 'Decks and cards must be arrays');
    }
    const ids = decks.map((deck) => deck?.id);
    if (new Set(ids).size !== ids.length || ids[0] !== 'standard' ||
        ids.length !== FESTIVAL_DECK_IDS.length + 1 ||
        FESTIVAL_DECK_IDS.some((id, index) => ids[index + 1] !== id)) {
        throw error('DECK_DATA_INVALID', 'Deck IDs or order are invalid');
    }

    const cardIds = new Set(cards.map((card) => card.id));
    for (const deck of decks.slice(1)) {
        for (const field of ['name_en', 'name_th', 'asset_root', 'back_asset', 'tone']) {
            if (typeof deck[field] !== 'string' || deck[field].trim() === '') {
                throw error('DECK_DATA_INVALID', `${deck.id} has an invalid ${field}`);
            }
        }
        if (!Array.isArray(deck.palette) || !Array.isArray(deck.symbols)) {
            throw error('DECK_DATA_INVALID', `${deck.id} palette and symbols are required`);
        }
        const mappedIds = Object.keys(deck.cards ?? {});
        if (mappedIds.length !== 78 || mappedIds.some((id) => !cardIds.has(id))) {
            throw error('DECK_DATA_INVALID', `${deck.id} must map the canonical 78 cards`);
        }
        for (const [cardId, record] of Object.entries(deck.cards)) {
            if (!CARD_STATUSES.has(record?.status) ||
                !(record.asset === null || typeof record.asset === 'string')) {
                throw error('DECK_DATA_INVALID', `${deck.id}/${cardId} has an invalid artwork record`);
            }
        }
    }
    return decks;
}

export function resolveDeckId({ decks, seasons, mmdd, manualId }) {
    const validIds = new Set(Array.isArray(decks) ? decks.map((deck) => deck.id) : []);
    if (manualId && manualId !== 'auto' && validIds.has(manualId)) return manualId;
    if (typeof mmdd !== 'string' || !MM_DD.test(mmdd)) return 'standard';

    let day;
    try {
        day = assertMmdd(mmdd);
        validateSeasons(seasons);
    } catch {
        return 'standard';
    }
    for (const season of seasons) {
        if (daysInWindow(season.start, season.end).has(day) && validIds.has(season.deck_id)) {
            return season.deck_id;
        }
    }
    return 'standard';
}
