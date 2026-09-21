import test from 'node:test';
import assert from 'node:assert/strict';

import { loadJson } from './helpers/load-json.js';

test('cards.json contains exactly 78 unique canonical card IDs', async () => {
    const cards = await loadJson('data/cards.json');
    const expectedIds = [
        ...Array.from({ length: 22 }, (_, index) => `major-${index}`),
        ...['wands', 'cups', 'swords', 'pentacles'].flatMap((suit) =>
            Array.from({ length: 14 }, (_, index) => `${suit}-${index + 1}`)
        )
    ];

    assert.ok(Array.isArray(cards));
    assert.equal(cards.length, 78);
    assert.deepEqual(
        [...new Set(cards.map((card) => card.id))].sort(),
        expectedIds.sort()
    );

    for (const card of cards) {
        assert.ok(card.name_en.trim());
        assert.ok(card.name_th.trim());
        assert.equal(card.name, card.name_en);
        assert.equal(card.thai_name, card.name_th);
        assert.equal(card.number, card.sequence);
    }
});

test('interpretations reference canonical card IDs only', async () => {
    const [cards, interpretations] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/interpretations.json')
    ]);
    const cardIds = new Set(cards.map((card) => card.id));

    assert.deepEqual(
        [...new Set(interpretations.map((entry) => entry.card_id).filter((id) => !cardIds.has(id)))],
        []
    );
});

test('each festival deck maps all 78 canonical IDs', async () => {
    const [cards, decks] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json')
    ]);
    const cardIds = cards.map((card) => card.id).sort();

    for (const deck of decks.filter((entry) => entry.id !== 'standard')) {
        assert.deepEqual(Object.keys(deck.cards).sort(), cardIds);
    }
});
