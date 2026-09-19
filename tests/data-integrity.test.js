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
});
