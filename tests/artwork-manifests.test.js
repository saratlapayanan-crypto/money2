import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadJson } from './helpers/load-json.js';
import { validateArtworkManifests } from '../scripts/validate-artwork-manifests.mjs';

const SEASONS = Object.freeze({
    christmas: {
        palette: ['#071827', '#1f5132', '#7b2235', '#d8af54'],
        symbols: ['star', 'candle', 'evergreen', 'frost'],
        language: 'Christmas / Winter Solstice'
    },
    valentine: {
        palette: ['#4b1326', '#a53f5b', '#e9a8b6', '#d8af54'],
        symbols: ['rose', 'letter', 'ribbon', 'mirror'],
        language: 'Valentine'
    },
    songkran: {
        palette: ['#0b6574', '#55c5d1', '#f4eee1', '#e57a65'],
        symbols: ['water', 'jasmine', 'silver bowl', 'renewal'],
        language: 'Songkran'
    },
    'loy-krathong': {
        palette: ['#131c4a', '#d56a9d', '#397557', '#e7b64c'],
        symbols: ['water', 'lotus', 'moon', 'flame'],
        language: 'Loy Krathong'
    },
    halloween: {
        palette: ['#17131c', '#4f2b59', '#b85d2d', '#d1a64c'],
        symbols: ['pumpkin', 'black cat', 'dry leaves', 'threshold'],
        language: 'Halloween'
    }
});

const REQUIRED_RECORD_FIELDS = [
    'card_id',
    'style_version',
    'semantic_goal',
    'festival_scene',
    'required_symbols',
    'avoid',
    'prompt',
    'status',
    'master_png',
    'web_asset',
    'review'
];
const REPOSITORY_ROOT = fileURLToPath(new URL('../', import.meta.url));

async function loadProductionData() {
    const deckIds = Object.keys(SEASONS);
    const [cards, decks, ...manifests] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json'),
        ...deckIds.map((deckId) => loadJson(`artwork/decks/${deckId}.json`))
    ]);
    return { cards, decks, manifests };
}

function approveChristmasFool(production, {
    masterPng = 'artwork/masters/christmas/major-0-v1.png',
    webAsset = 'assets/cards/christmas/major-0.webp'
} = {}) {
    const record = production.manifests[0].records[0];
    const runtimeRecord = production.decks.find((deck) => deck.id === 'christmas').cards['major-0'];
    record.status = 'approved';
    record.master_png = masterPng;
    record.web_asset = webAsset;
    record.review = {
        reviewer: 'art-reviewer',
        reviewed_at: '2026-09-21',
        sha256: 'a'.repeat(64),
        dimensions: { width: 1024, height: 1536 },
        checks: {
            semantic: 'pass',
            festival: 'pass',
            style: 'pass',
            anatomy: 'pass',
            no_text: 'pass',
            originality: 'pass',
            safe_crop: 'pass',
            thumbnail: 'pass'
        }
    };
    runtimeRecord.status = 'approved';
    runtimeRecord.asset = webAsset;
}

test('production manifests start with every canonical front and one back placeholder', async () => {
    const { cards, manifests } = await loadProductionData();
    const expectedIds = [...cards.map((card) => card.id), 'back'].sort();

    assert.equal(manifests.length, 5);
    for (const manifest of manifests) {
        assert.equal(manifest.style_version, 'seasonal-art-nouveau-v1');
        assert.deepEqual(manifest.palette, SEASONS[manifest.deck_id].palette);
        assert.deepEqual(manifest.symbol_vocabulary, SEASONS[manifest.deck_id].symbols);
        assert.equal(manifest.season_language, SEASONS[manifest.deck_id].language);
        assert.equal(manifest.records.length, 79);
        assert.deepEqual(manifest.records.map((record) => record.card_id).sort(), expectedIds);

        for (const record of manifest.records) {
            assert.deepEqual(Object.keys(record).sort(), [...REQUIRED_RECORD_FIELDS].sort());
            assert.equal(record.style_version, manifest.style_version);
            assert.equal(record.status, 'placeholder');
            assert.equal(record.master_png, null);
            assert.equal(record.web_asset, null);
            assert.deepEqual(record.review, {});
            assert.ok(record.semantic_goal.trim());
            assert.ok(record.festival_scene.trim());
            assert.ok(record.required_symbols.length > 0);
            assert.ok(record.avoid.length > 0);
            assert.match(record.prompt, /No embedded text, letters, numbers, logos, signatures, or watermarks\./);
            assert.match(record.prompt, /Original composition only/);
            assert.match(record.prompt, /anatomically plausible/);
            assert.match(record.prompt, /10% safe-crop margin/);
            assert.match(record.prompt, new RegExp(manifest.season_language.replace('/', '\\/')));
        }
    }
});

test('all 390 front prompts are distinct', async () => {
    const { manifests } = await loadProductionData();
    const frontPrompts = manifests.flatMap((manifest) =>
        manifest.records.filter((record) => record.card_id !== 'back').map((record) => record.prompt)
    );

    assert.equal(frontPrompts.length, 390);
    assert.equal(new Set(frontPrompts).size, 390);
});

test('runtime festival decks stay aligned with production manifests', async () => {
    const { cards, decks, manifests } = await loadProductionData();
    const canonicalIds = cards.map((card) => card.id).sort();
    const festivalDecks = decks.filter((deck) => deck.id !== 'standard');

    assert.deepEqual(festivalDecks.map((deck) => deck.id), Object.keys(SEASONS));
    for (const manifest of manifests) {
        const deck = festivalDecks.find((candidate) => candidate.id === manifest.deck_id);
        assert.ok(deck);
        assert.deepEqual(Object.keys(deck.cards).sort(), canonicalIds);
        assert.deepEqual(deck.palette, manifest.palette);
        assert.deepEqual(deck.symbols, manifest.symbol_vocabulary);
        assert.deepEqual(deck.back, { status: 'placeholder', asset: null });
    }
});

test('artwork validator reports the initial production counts', async () => {
    const packageJson = await loadJson('package.json');
    assert.equal(
        packageJson.scripts['validate:artwork'],
        'node scripts/validate-artwork-manifests.mjs'
    );

    const result = spawnSync(process.execPath, ['scripts/validate-artwork-manifests.mjs'], {
        cwd: new URL('..', import.meta.url),
        encoding: 'utf8'
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(
        result.stdout,
        /Artwork manifests valid: 390 front placeholders, 5 back placeholders, 0 approved\./
    );
});

test('validator rejects missing or duplicate canonical IDs and a missing back', async () => {
    const production = await loadProductionData();

    const missing = structuredClone(production);
    missing.manifests[0].records = missing.manifests[0].records.filter((record) => record.card_id !== 'major-0');
    assert.throws(
        () => validateArtworkManifests(missing),
        /christmas must contain each canonical card ID exactly once/
    );

    const duplicate = structuredClone(production);
    duplicate.manifests[0].records[1].card_id = 'major-0';
    assert.throws(
        () => validateArtworkManifests(duplicate),
        /christmas must contain each canonical card ID exactly once/
    );

    const missingBack = structuredClone(production);
    missingBack.manifests[0].records = missingBack.manifests[0].records.filter((record) => record.card_id !== 'back');
    assert.throws(
        () => validateArtworkManifests(missingBack),
        /christmas must contain exactly one back record/
    );
});

test('validator rejects missing fields and invalid statuses', async () => {
    const production = await loadProductionData();

    const missingField = structuredClone(production);
    delete missingField.manifests[0].records[0].semantic_goal;
    assert.throws(
        () => validateArtworkManifests(missingField),
        /christmas\/major-0 is missing semantic_goal/
    );

    const invalidStatus = structuredClone(production);
    invalidStatus.manifests[0].records[0].status = 'queued';
    assert.throws(
        () => validateArtworkManifests(invalidStatus),
        /christmas\/major-0 has invalid status queued/
    );
});

test('validator rejects duplicate or under-constrained front prompts', async () => {
    const production = await loadProductionData();

    const duplicate = structuredClone(production);
    const duplicatePrompt = `${duplicate.manifests[0].records[0].prompt} ${duplicate.manifests[0].records[1].prompt}`;
    duplicate.manifests[0].records[0].prompt = duplicatePrompt;
    duplicate.manifests[0].records[1].prompt = duplicatePrompt;
    assert.throws(
        () => validateArtworkManifests(duplicate),
        /duplicate front prompt/
    );

    const underConstrained = structuredClone(production);
    underConstrained.manifests[0].records[0].prompt = 'A festive Tarot card.';
    assert.throws(
        () => validateArtworkManifests(underConstrained),
        /christmas\/major-0 prompt is missing required constraints/
    );
});

test('validator rejects approved entries without complete review evidence or files', async () => {
    const production = await loadProductionData();
    const record = production.manifests[0].records[0];
    const runtimeRecord = production.decks.find((deck) => deck.id === 'christmas').cards['major-0'];
    record.status = 'approved';
    record.master_png = 'artwork/masters/christmas/major-0-v1.png';
    record.web_asset = 'assets/cards/christmas/major-0.webp';
    runtimeRecord.status = 'approved';
    runtimeRecord.asset = record.web_asset;

    assert.throws(
        () => validateArtworkManifests(production, { fileExists: () => true }),
        /christmas\/major-0 approved entry requires complete review evidence/
    );

    record.review = {
        reviewer: 'art-reviewer',
        reviewed_at: '2026-09-21',
        sha256: 'a'.repeat(64),
        dimensions: { width: 1024, height: 1536 },
        checks: {
            semantic: 'pass',
            festival: 'pass',
            style: 'pass',
            anatomy: 'pass',
            no_text: 'pass',
            originality: 'pass',
            safe_crop: 'pass',
            thumbnail: 'pass'
        }
    };
    assert.throws(
        () => validateArtworkManifests(production, { fileExists: () => false }),
        /christmas\/major-0 approved files do not exist/
    );
});

test('validator rejects season and runtime drift', async () => {
    const production = await loadProductionData();

    const paletteDrift = structuredClone(production);
    paletteDrift.manifests[0].palette[0] = '#000000';
    assert.throws(
        () => validateArtworkManifests(paletteDrift),
        /christmas palette drifts from runtime deck metadata/
    );

    const recordDrift = structuredClone(production);
    recordDrift.decks.find((deck) => deck.id === 'christmas').cards['major-0'].status = 'draft';
    assert.throws(
        () => validateArtworkManifests(recordDrift),
        /christmas\/major-0 drifts from runtime artwork metadata/
    );
});

test('validator rejects canonical semantic-goal drift', async () => {
    const production = await loadProductionData();
    production.manifests[0].records[0].semantic_goal = 'A generic celebration unrelated to The Fool.';
    assert.throws(
        () => validateArtworkManifests(production),
        /christmas\/major-0 semantic goal drifts from canonical card data/
    );
});

test('validator rejects a prompt that omits the canonical semantic goal', async () => {
    const production = await loadProductionData();
    const record = production.manifests[0].records[0];
    record.prompt = record.prompt.replace(record.semantic_goal, 'A generic celebration unrelated to The Fool.');
    assert.throws(
        () => validateArtworkManifests(production),
        /christmas\/major-0 prompt omits its canonical semantic goal/
    );
});

test('validator rejects required symbols outside the manifest vocabulary', async () => {
    const production = await loadProductionData();
    production.manifests[0].records[0].required_symbols = ['unrelated decoration'];
    assert.throws(
        () => validateArtworkManifests(production),
        /christmas\/major-0 required symbols do not use the manifest vocabulary/
    );
});

test('validator rejects approved paths that traverse outside exact deck roots', async () => {
    const masterTraversal = await loadProductionData();
    approveChristmasFool(masterTraversal, {
        masterPng: 'artwork/masters/christmas/../../halloween/major-0.png'
    });
    assert.throws(
        () => validateArtworkManifests(masterTraversal, { fileExists: () => true }),
        /christmas\/major-0 approved master path escapes its deck root/
    );

    const webTraversal = await loadProductionData();
    approveChristmasFool(webTraversal, {
        webAsset: 'assets/cards/christmas/../../halloween/major-0.webp'
    });
    assert.throws(
        () => validateArtworkManifests(webTraversal, { fileExists: () => true }),
        /christmas\/major-0 approved web asset path escapes its deck root/
    );
});

test('default approved-file checker accepts real files inside exact deck roots', async (context) => {
    const masterRoot = join(REPOSITORY_ROOT, 'artwork', 'masters', 'christmas');
    const webRoot = join(REPOSITORY_ROOT, 'assets', 'cards', 'christmas');
    await Promise.all([
        mkdir(masterRoot, { recursive: true }),
        mkdir(webRoot, { recursive: true })
    ]);
    const [masterDirectory, webDirectory] = await Promise.all([
        mkdtemp(join(masterRoot, 'validator-')),
        mkdtemp(join(webRoot, 'validator-'))
    ]);
    context.after(async () => {
        await Promise.all([
            rm(masterDirectory, { recursive: true, force: true }),
            rm(webDirectory, { recursive: true, force: true })
        ]);
    });

    const masterFile = join(masterDirectory, 'major-0.png');
    const webFile = join(webDirectory, 'major-0.webp');
    await Promise.all([
        writeFile(masterFile, 'png fixture', 'utf8'),
        writeFile(webFile, 'webp fixture', 'utf8')
    ]);
    const manifestPath = (absolutePath) => relative(REPOSITORY_ROOT, absolutePath).split(sep).join('/');
    const production = await loadProductionData();
    approveChristmasFool(production, {
        masterPng: manifestPath(masterFile),
        webAsset: manifestPath(webFile)
    });

    assert.doesNotThrow(() => validateArtworkManifests(production));
});

test('validator rejects percent-encoded traversal outside the approved web root', async () => {
    const production = await loadProductionData();
    approveChristmasFool(production, {
        webAsset: 'assets/cards/christmas/%2e%2e/%2e%2e/outside.webp'
    });

    assert.throws(
        () => validateArtworkManifests(production, { fileExists: () => true }),
        /christmas\/major-0 approved web asset path escapes its deck root/
    );
});
