import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveDeckId, validateDecks, validateSeasons } from '../js/domain/decks.js';
import { loadJson } from './helpers/load-json.js';

const REQUIRED_DECKS = ['christmas', 'valentine', 'songkran', 'loy-krathong', 'halloween'];

test('validates five complete festival manifests and standard fallback', async () => {
    const [cards, decks] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json')
    ]);
    const result = validateDecks(decks, cards);

    assert.equal(result, decks);
    assert.deepEqual(
        result.filter((deck) => deck.id !== 'standard').map((deck) => deck.id),
        REQUIRED_DECKS
    );
    for (const deck of result.filter((entry) => entry.id !== 'standard')) {
        assert.equal(Object.keys(deck.cards).length, 78);
        assert.ok(deck.back_asset);
    }
});

test('resolves manual, ordinary seasonal, cross-year, and fallback deck IDs', async () => {
    const [decks, seasons] = await Promise.all([
        loadJson('data/decks.json'),
        loadJson('data/seasons.json')
    ]);

    assert.equal(resolveDeckId({ decks, seasons, mmdd: '07-01', manualId: 'valentine' }), 'valentine');
    assert.equal(resolveDeckId({ decks, seasons, mmdd: '04-13', manualId: 'auto' }), 'songkran');
    assert.equal(resolveDeckId({ decks, seasons, mmdd: '12-25', manualId: 'auto' }), 'christmas');
    assert.equal(resolveDeckId({ decks, seasons, mmdd: '01-02', manualId: null }), 'christmas');
    assert.equal(resolveDeckId({ decks, seasons, mmdd: '07-01', manualId: 'missing' }), 'standard');
    assert.equal(resolveDeckId({ decks, seasons, mmdd: 'not-a-date', manualId: 'auto' }), 'standard');
});

test('rejects duplicate deck IDs and incomplete card status maps', async () => {
    const [cards, decks] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json')
    ]);
    const duplicate = structuredClone(decks);
    duplicate.push(structuredClone(decks[0]));
    assert.throws(() => validateDecks(duplicate, cards), { code: 'DECK_DATA_INVALID' });

    const incomplete = structuredClone(decks);
    delete incomplete.find((deck) => deck.id === 'christmas').cards['major-0'];
    assert.throws(() => validateDecks(incomplete, cards), { code: 'DECK_DATA_INVALID' });
});

test('rejects invalid status values and unknown status card IDs', async () => {
    const [cards, decks] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json')
    ]);
    const invalidStatus = structuredClone(decks);
    invalidStatus.find((deck) => deck.id === 'christmas').cards['major-0'].status = 'queued';
    assert.throws(() => validateDecks(invalidStatus, cards), { code: 'DECK_DATA_INVALID' });

    const unknownCard = structuredClone(decks);
    unknownCard.find((deck) => deck.id === 'christmas').cards['major-999'] = { status: 'placeholder', asset: null };
    assert.throws(() => validateDecks(unknownCard, cards), { code: 'DECK_DATA_INVALID' });
});

test('rejects overlapping or malformed seasonal windows', async () => {
    const seasons = await loadJson('data/seasons.json');
    const overlapping = structuredClone(seasons);
    overlapping.push({ id: 'overlap', name: 'Overlap', deck_id: 'songkran', start: '04-13', end: '04-14' });

    assert.throws(() => validateSeasons(overlapping), { code: 'SEASON_DATA_INVALID' });
    assert.throws(
        () => validateSeasons([{ id: 'bad', name: 'Bad', deck_id: 'christmas', start: '13-01', end: '13-02' }]),
        { code: 'SEASON_DATA_INVALID' }
    );
});
