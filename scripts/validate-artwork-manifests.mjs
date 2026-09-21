import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const FESTIVAL_DECK_IDS = Object.freeze([
    'christmas',
    'valentine',
    'songkran',
    'loy-krathong',
    'halloween'
]);

const projectRoot = new URL('../', import.meta.url);
const projectRootPath = fileURLToPath(projectRoot);
const STYLE_VERSION = 'seasonal-art-nouveau-v1';
const VALID_STATUSES = new Set(['placeholder', 'draft', 'approved']);
const REQUIRED_RECORD_FIELDS = Object.freeze([
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
]);
const REQUIRED_REVIEW_CHECKS = Object.freeze([
    'semantic',
    'festival',
    'style',
    'anatomy',
    'no_text',
    'originality',
    'safe_crop',
    'thumbnail'
]);
const SEASON_LANGUAGES = Object.freeze({
    christmas: 'Christmas / Winter Solstice',
    valentine: 'Valentine',
    songkran: 'Songkran',
    'loy-krathong': 'Loy Krathong',
    halloween: 'Halloween'
});
const PROMPT_CONSTRAINTS = Object.freeze([
    'No embedded text, letters, numbers, logos, signatures, or watermarks.',
    'Original composition only',
    'anatomically plausible',
    '10% safe-crop margin'
]);

async function loadJson(relativePath) {
    return JSON.parse(await readFile(new URL(relativePath, projectRoot), 'utf8'));
}

function fail(message) {
    throw new Error(message);
}

function sameValues(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
}

function nonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

function completeReview(review, isBack) {
    if (!review || Array.isArray(review) || typeof review !== 'object') return false;
    if (!nonEmptyString(review.reviewer) || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_at ?? '')) return false;
    if (!/^[a-f\d]{64}$/i.test(review.sha256 ?? '')) return false;
    if (!Number.isInteger(review.dimensions?.width) || review.dimensions.width <= 0 ||
        !Number.isInteger(review.dimensions?.height) || review.dimensions.height <= 0) return false;
    if (Math.abs(review.dimensions.width / review.dimensions.height - 2 / 3) > 0.001) return false;
    if (REQUIRED_REVIEW_CHECKS.some((check) => review.checks?.[check] !== 'pass')) return false;
    return !isBack || review.checks?.rotation === 'pass';
}

function resolveApprovedPath(value, rootRelativePath, extension, escapeMessage, formatMessage) {
    if (!nonEmptyString(value)) fail(formatMessage);
    let decodedValue;
    try {
        decodedValue = decodeURIComponent(value);
    } catch {
        fail(formatMessage);
    }
    const deckRoot = resolve(projectRootPath, rootRelativePath);
    const candidate = resolve(projectRootPath, decodedValue);
    const relation = relative(deckRoot, candidate);
    if (!relation || relation === '..' || relation.startsWith(`..${sep}`) || isAbsolute(relation)) {
        fail(escapeMessage);
    }
    if (extname(candidate).toLowerCase() !== extension) fail(formatMessage);
    return candidate;
}

function validateApprovedRecord(record, deckId, fileExists) {
    const label = `${deckId}/${record.card_id}`;
    if (!completeReview(record.review, record.card_id === 'back')) {
        fail(`${label} approved entry requires complete review evidence`);
    }
    const formatMessage = `${label} approved entry requires PNG master and WebP asset paths`;
    const masterPath = resolveApprovedPath(
        record.master_png,
        `artwork/masters/${deckId}`,
        '.png',
        `${label} approved master path escapes its deck root`,
        formatMessage
    );
    const webAssetPath = resolveApprovedPath(
        record.web_asset,
        `assets/cards/${deckId}`,
        '.webp',
        `${label} approved web asset path escapes its deck root`,
        formatMessage
    );
    if (!fileExists(masterPath) || !fileExists(webAssetPath)) {
        fail(`${label} approved files do not exist`);
    }
}

function validateRecord(record, manifest, canonicalCard, fileExists) {
    const label = `${manifest.deck_id}/${record?.card_id ?? 'unknown'}`;
    for (const field of REQUIRED_RECORD_FIELDS) {
        if (!Object.hasOwn(record ?? {}, field)) fail(`${label} is missing ${field}`);
    }
    if (record.style_version !== STYLE_VERSION) fail(`${label} has invalid style_version`);
    if (!nonEmptyString(record.semantic_goal) || !nonEmptyString(record.festival_scene) ||
        !Array.isArray(record.required_symbols) || record.required_symbols.length === 0 ||
        record.required_symbols.some((symbol) => !nonEmptyString(symbol)) ||
        !Array.isArray(record.avoid) || record.avoid.length === 0 ||
        record.avoid.some((item) => !nonEmptyString(item)) || !nonEmptyString(record.prompt)) {
        fail(`${label} has invalid required fields`);
    }
    if (!VALID_STATUSES.has(record.status)) fail(`${label} has invalid status ${record.status}`);
    if (!(record.master_png === null || nonEmptyString(record.master_png)) ||
        !(record.web_asset === null || nonEmptyString(record.web_asset)) ||
        !record.review || Array.isArray(record.review) || typeof record.review !== 'object') {
        fail(`${label} has invalid production metadata`);
    }
    if (!record.prompt.includes(manifest.season_language) ||
        PROMPT_CONSTRAINTS.some((constraint) => !record.prompt.includes(constraint))) {
        fail(`${label} prompt is missing required constraints`);
    }
    if (canonicalCard) {
        const canonicalSemanticGoal = `Upright: ${canonicalCard.meaning_upright} Reversed boundary: ${canonicalCard.meaning_reversed}`;
        if (record.semantic_goal !== canonicalSemanticGoal) {
            fail(`${label} semantic goal drifts from canonical card data`);
        }
        if (!record.prompt.includes(canonicalSemanticGoal)) {
            fail(`${label} prompt omits its canonical semantic goal`);
        }
        if (!record.required_symbols.some((symbol) => manifest.symbol_vocabulary.includes(symbol))) {
            fail(`${label} required symbols do not use the manifest vocabulary`);
        }
        if (record.required_symbols.some((symbol) => !record.prompt.includes(symbol))) {
            fail(`${label} prompt omits a required symbol`);
        }
    }
    if (record.status === 'placeholder' &&
        (record.master_png !== null || record.web_asset !== null || Object.keys(record.review).length !== 0)) {
        fail(`${label} placeholder must not contain files or review evidence`);
    }
    if (record.status === 'approved') validateApprovedRecord(record, manifest.deck_id, fileExists);
}

export function validateArtworkManifests({ cards, decks, manifests }, options = {}) {
    if (!Array.isArray(cards) || !Array.isArray(decks) || !Array.isArray(manifests)) {
        fail('Cards, decks, and manifests must be arrays');
    }
    const fileExists = options.fileExists ?? existsSync;
    const canonicalIds = cards.map((card) => card?.id);
    if (canonicalIds.length !== 78 || new Set(canonicalIds).size !== 78 || canonicalIds.some((id) => !nonEmptyString(id))) {
        fail('Canonical card registry must contain 78 unique IDs');
    }

    const festivalDecks = decks.filter((deck) => deck?.id !== 'standard');
    if (!sameValues(festivalDecks.map((deck) => deck.id), FESTIVAL_DECK_IDS) ||
        !sameValues(manifests.map((manifest) => manifest?.deck_id), FESTIVAL_DECK_IDS)) {
        fail('Festival deck IDs drift between runtime data and artwork manifests');
    }

    const canonicalSet = new Set(canonicalIds);
    const canonicalById = new Map(cards.map((card) => [card.id, card]));
    const allFrontPrompts = new Set();
    for (const manifest of manifests) {
        const deckId = manifest.deck_id;
        const deck = festivalDecks.find((candidate) => candidate.id === deckId);
        if (manifest.style_version !== STYLE_VERSION) fail(`${deckId} has invalid style_version`);
        if (manifest.season_language !== SEASON_LANGUAGES[deckId]) fail(`${deckId} has invalid season language`);
        if (!sameValues(manifest.palette, deck.palette)) fail(`${deckId} palette drifts from runtime deck metadata`);
        if (!sameValues(manifest.symbol_vocabulary, deck.symbols)) fail(`${deckId} symbols drift from runtime deck metadata`);

        const runtimeIds = Object.keys(deck.cards ?? {});
        if (runtimeIds.length !== 78 || runtimeIds.some((id) => !canonicalSet.has(id))) {
            fail(`${deckId} runtime card IDs drift from the canonical registry`);
        }
        if (!Array.isArray(manifest.records)) fail(`${deckId} records must be an array`);
        const backs = manifest.records.filter((record) => record?.card_id === 'back');
        if (backs.length !== 1) fail(`${deckId} must contain exactly one back record`);
        const fronts = manifest.records.filter((record) => record?.card_id !== 'back');
        const frontIds = fronts.map((record) => record?.card_id);
        if (frontIds.length !== 78 || new Set(frontIds).size !== 78 ||
            frontIds.some((id) => !canonicalSet.has(id)) || canonicalIds.some((id) => !frontIds.includes(id))) {
            fail(`${deckId} must contain each canonical card ID exactly once`);
        }

        for (const record of manifest.records) {
            validateRecord(record, manifest, canonicalById.get(record.card_id), fileExists);
            if (record.card_id !== 'back') {
                if (allFrontPrompts.has(record.prompt)) fail(`${deckId}/${record.card_id} has a duplicate front prompt`);
                allFrontPrompts.add(record.prompt);
                const runtimeRecord = deck.cards[record.card_id];
                if (runtimeRecord?.status !== record.status || runtimeRecord?.asset !== record.web_asset) {
                    fail(`${deckId}/${record.card_id} drifts from runtime artwork metadata`);
                }
            } else if (deck.back?.status !== record.status || deck.back?.asset !== record.web_asset) {
                fail(`${deckId}/back drifts from runtime artwork metadata`);
            }
        }
    }

    const records = manifests.flatMap((manifest) => manifest.records);
    return {
        frontPlaceholders: records.filter((record) => record.card_id !== 'back' && record.status === 'placeholder').length,
        backPlaceholders: records.filter((record) => record.card_id === 'back' && record.status === 'placeholder').length,
        approved: records.filter((record) => record.status === 'approved').length
    };
}

export async function loadArtworkProductionData() {
    const [cards, decks, ...manifests] = await Promise.all([
        loadJson('data/cards.json'),
        loadJson('data/decks.json'),
        ...FESTIVAL_DECK_IDS.map((deckId) => loadJson(`artwork/decks/${deckId}.json`))
    ]);
    return { cards, decks, manifests };
}

async function main() {
    const summary = validateArtworkManifests(await loadArtworkProductionData());
    console.log(
        `Artwork manifests valid: ${summary.frontPlaceholders} front placeholders, ` +
        `${summary.backPlaceholders} back placeholders, ${summary.approved} approved.`
    );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    main().catch((error) => {
        console.error(`Artwork manifest validation failed: ${error.message}`);
        process.exitCode = 1;
    });
}
