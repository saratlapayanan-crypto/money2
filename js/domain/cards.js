export const SUITS = Object.freeze(['wands', 'cups', 'swords', 'pentacles']);

const REQUIRED_TEXT_FIELDS = Object.freeze([
    'name_en',
    'name_th',
    'meaning_upright',
    'meaning_reversed',
    'reflection',
    'alt_text'
]);

function invalid(message) {
    const error = new Error(message);
    error.code = 'CARD_DATA_INVALID';
    return error;
}

function expectedIds() {
    return new Set([
        ...Array.from({ length: 22 }, (_, index) => `major-${index}`),
        ...SUITS.flatMap((suit) =>
            Array.from({ length: 14 }, (_, index) => `${suit}-${index + 1}`)
        )
    ]);
}

export function validateCards(cards) {
    if (!Array.isArray(cards)) {
        throw invalid('Card data must be an array');
    }

    const requiredIds = expectedIds();
    const actualIds = new Set(cards.map((card) => card?.id));
    if (cards.length !== 78 || actualIds.size !== 78) {
        throw invalid('Card data must contain 78 unique records');
    }
    for (const id of requiredIds) {
        if (!actualIds.has(id)) throw invalid(`Missing canonical card ID: ${id}`);
    }

    for (const card of cards) {
        for (const field of REQUIRED_TEXT_FIELDS) {
            if (typeof card[field] !== 'string' || card[field].trim() === '') {
                throw invalid(`${card.id} has an invalid ${field}`);
            }
        }
        if (!Array.isArray(card.keywords_upright) || card.keywords_upright.length === 0 ||
            !Array.isArray(card.keywords_reversed) || card.keywords_reversed.length === 0) {
            throw invalid(`${card.id} must define upright and reversed keywords`);
        }

        if (card.arcana === 'major') {
            if (card.suit !== null || card.rank !== null || card.sequence < 0 || card.sequence > 21) {
                throw invalid(`${card.id} has an invalid Major Arcana shape`);
            }
        } else if (card.arcana === 'minor') {
            if (!SUITS.includes(card.suit) || !Number.isInteger(card.rank) ||
                card.rank < 1 || card.rank > 14 || card.sequence !== card.rank) {
                throw invalid(`${card.id} has an invalid Minor Arcana shape`);
            }
        } else {
            throw invalid(`${card.id} has an invalid arcana value`);
        }
    }

    return cards;
}

export function indexCards(cards) {
    return new Map(validateCards(cards).map((card) => [card.id, card]));
}
