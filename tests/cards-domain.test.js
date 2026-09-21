import test from 'node:test';
import assert from 'node:assert/strict';

import { indexCards, validateCards } from '../js/domain/cards.js';
import { loadJson } from './helpers/load-json.js';

function clone(value) {
    return structuredClone(value);
}

test('validates and indexes the canonical 78-card registry', async () => {
    const cards = await loadJson('data/cards.json');

    assert.equal(validateCards(cards), cards);
    assert.equal(indexCards(cards).size, 78);
});

test('rejects a non-array registry with CARD_DATA_INVALID', () => {
    assert.throws(() => validateCards({}), { code: 'CARD_DATA_INVALID' });
});

test('rejects duplicate and missing canonical IDs', async () => {
    const cards = await loadJson('data/cards.json');
    const invalid = clone(cards);
    invalid[77].id = invalid[0].id;

    assert.throws(() => validateCards(invalid), { code: 'CARD_DATA_INVALID' });
});

test('rejects missing bilingual names and semantic fields', async () => {
    const cards = await loadJson('data/cards.json');
    for (const field of ['name_en', 'name_th', 'meaning_upright', 'meaning_reversed', 'reflection', 'alt_text']) {
        const invalid = clone(cards);
        invalid[0][field] = '';
        assert.throws(() => validateCards(invalid), { code: 'CARD_DATA_INVALID' });
    }
});

test('rejects an invalid suit and rank combination', async () => {
    const cards = await loadJson('data/cards.json');
    const invalid = clone(cards);
    const wandsAce = invalid.find((card) => card.id === 'wands-1');
    wandsAce.rank = 15;

    assert.throws(() => validateCards(invalid), { code: 'CARD_DATA_INVALID' });
});
