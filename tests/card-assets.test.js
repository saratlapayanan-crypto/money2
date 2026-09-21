import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveCardAsset } from '../js/art/card-assets.js';

const card = { id: 'major-0', name_en: 'The Fool', name_th: 'คนโง่', alt_text: 'ภาพไพ่คนโง่' };

function deck(status, asset) {
    return { id: 'christmas', cards: { 'major-0': { status, asset } } };
}

test('resolves only approved artwork with a non-empty asset path', () => {
    assert.deepEqual(resolveCardAsset(deck('approved', 'assets/cards/christmas/major-0.webp'), card), {
        kind: 'image',
        src: 'assets/cards/christmas/major-0.webp',
        status: 'approved'
    });
});

test('resolves draft, placeholder, missing, and malformed artwork to a placeholder', () => {
    for (const candidate of [deck('draft', 'draft.webp'), deck('placeholder', null), deck('approved', ''), { id: 'christmas', cards: {} }]) {
        const result = resolveCardAsset(candidate, card);
        assert.equal(result.kind, 'placeholder');
        assert.equal(result.src, null);
    }
});
