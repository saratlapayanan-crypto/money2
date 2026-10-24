import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('C:/Users/frame/Desktop/Money');

test('all required JSON data files and PWA manifest exist and are valid JSON', () => {
    const jsonFiles = [
        'data/cards.json',
        'data/interpretations.json',
        'data/questions.json',
        'data/remedies.json',
        'data/colors.json',
        'data/wallpapers.json',
        'data/affiliates.json',
        'data/decks.json',
        'manifest.json'
    ];

    for (const f of jsonFiles) {
        const fullPath = path.join(projectRoot, f);
        assert.ok(fs.existsSync(fullPath), `File ${f} must exist`);
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.doesNotThrow(() => JSON.parse(content), `File ${f} must be valid JSON`);
    }

    assert.ok(fs.existsSync(path.join(projectRoot, 'sw.js')), 'Service Worker sw.js must exist');
    assert.ok(fs.existsSync(path.join(projectRoot, 'assets/icons/app-icon.svg')), 'PWA app-icon.svg must exist');
});

test('all HTML files have Mitr + Outfit fonts, PWA manifest links, and no text-white on body', () => {
    const htmlFiles = [
        'index.html',
        'daily.html',
        'reading.html',
        'result.html',
        'cards-preview.html'
    ];

    for (const f of htmlFiles) {
        const fullPath = path.join(projectRoot, f);
        const content = fs.readFileSync(fullPath, 'utf8');

        assert.ok(content.includes('family=Mitr:'), `${f} must include Mitr font`);
        assert.ok(content.includes('family=Outfit:'), `${f} must include Outfit font`);
        assert.ok(!content.includes('<body class="text-white'), `${f} must not have text-white on body`);
        assert.ok(content.includes('text-[#261633]'), `${f} must have text-[#261633] on body`);
        assert.ok(content.includes('rel="manifest" href="manifest.json"'), `${f} must include PWA manifest link`);
        assert.ok(content.includes('assets/icons/app-icon.svg'), `${f} must include app icon link`);
    }
});

test('HTTP server responds with 200 OK for all HTML pages and PWA files', async () => {
    const http = await import('node:http');
    const filesToTest = ['index.html', 'daily.html', 'reading.html', 'result.html', 'cards-preview.html', 'manifest.json', 'sw.js'];

    const server = http.createServer((req, res) => {
        const cleanPath = (req.url || '/index.html').split('?')[0].replace(/^\/+/, '') || 'index.html';
        const filePath = path.join(projectRoot, cleanPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();

    try {
        for (const page of filesToTest) {
            const url = `http://127.0.0.1:${port}/${page}`;
            const res = await fetch(url);
            assert.equal(res.status, 200, `Expected 200 for ${url}`);
            const text = await res.text();
            assert.ok(text.length > 100, `Expected content length > 100 for ${url}`);
        }
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
});

test('all 78 standard Masterpiece card images are registered in APPROVED_CARD_ASSETS and exist on disk', async () => {
    const { APPROVED_CARD_ASSETS } = await import('../js/art/fronts.js');
    const cards = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cards.json'), 'utf8'));

    assert.equal(Object.keys(APPROVED_CARD_ASSETS).length, 78, 'APPROVED_CARD_ASSETS must have all 78 cards');

    for (const card of cards) {
        const relPath = APPROVED_CARD_ASSETS[card.id];
        assert.ok(relPath, `Card ${card.id} must be registered in APPROVED_CARD_ASSETS`);
        const fullPath = path.join(projectRoot, relPath);
        assert.ok(fs.existsSync(fullPath), `Asset file ${relPath} for ${card.id} must exist on disk`);
        const stat = fs.statSync(fullPath);
        assert.ok(stat.size > 10000, `Asset file ${relPath} must be a valid non-empty image (>10KB)`);
    }
});

test('SVG Art engine renders all 78 Masterpiece oil-painting cards in standard and festival themes without disappearing on seasonal dates', async () => {
    const { renderCardFront, renderCardBack } = await import('../js/art/tarot-art.js');
    const { THEMES } = await import('../js/art/themes.js');
    const { getActiveDeck } = await import('../js/engines/deck-engine.js');
    const cards = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cards.json'), 'utf8'));
    const decks = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/decks.json'), 'utf8'));
    const seasons = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/seasons.json'), 'utf8'));

    assert.equal(cards.length, 78);
    assert.equal(getActiveDeck(decks, seasons), 'standard', 'Default active deck must be standard Masterpiece deck');

    for (const themeId of Object.keys(THEMES)) {
        const backSvg = renderCardBack(themeId);
        assert.ok(backSvg.startsWith('<svg width="240" height="380"'), `Theme ${themeId} back must have explicit dimensions`);

        for (const card of cards) {
            const frontSvg = renderCardFront(card, themeId);
            assert.ok(frontSvg.startsWith('<svg width="240" height="380"'), `Card ${card.id} in theme ${themeId} must be valid SVG with dimensions`);
            assert.ok(
                frontSvg.includes(`href="assets/cards/standard/${card.id}.jpg"`),
                `Card ${card.id} in theme ${themeId} must embed its Masterpiece oil-painting image`
            );
            assert.ok(!frontSvg.includes('undefined'), `Card ${card.id} in theme ${themeId} must not contain undefined`);
            assert.ok(!frontSvg.includes('NaN'), `Card ${card.id} in theme ${themeId} must not contain NaN`);
        }
    }
});

test('Outfit Advice engine works for all 7 days with valid mannequins and distinct looks', async () => {
    const { calculateOutfitAdvice } = await import('../js/domain/lucky-colors.js');
    const { renderOutfitMannequinSvg, renderShirtIconSvg, renderPantsIconSvg } = await import('../js/art/outfit-icons.js');
    const { renderMoonRabbitSvg } = await import('../js/art/moon-rabbit.js');

    const rabbitSvg = renderMoonRabbitSvg({ size: 100 });
    assert.ok(rabbitSvg.startsWith('<svg'), 'Moon rabbit must be SVG');

    for (let day = 0; day < 7; day++) {
        const advice = calculateOutfitAdvice({
            dayIndex: day,
            loveScore: 2,
            financeScore: 3,
            workScore: 5
        });

        assert.ok(advice.looks.length >= 2, 'Must have at least 2 looks');
        assert.ok(advice.formula.ratioMain > 0);
        assert.ok(advice.formula.ratioSub > 0);

        for (const look of advice.looks) {
            assert.ok(look.top.hex.startsWith('#'), 'Top hex must start with #');
            assert.ok(look.bottom.hex.startsWith('#'), 'Bottom hex must start with #');

            const mSvg = renderOutfitMannequinSvg({
                topHex: look.top.hex,
                bottomHex: look.bottom.hex,
                width: 76,
                height: 104
            });
            assert.ok(mSvg.startsWith('<svg'), 'Mannequin must be SVG');
            assert.ok(!mSvg.includes('undefined'), 'Mannequin must not have undefined');

            const shirtSvg = renderShirtIconSvg({ hex: look.top.hex, size: 24 });
            const pantsSvg = renderPantsIconSvg({ hex: look.bottom.hex, size: 24 });
            assert.ok(shirtSvg.startsWith('<svg'));
            assert.ok(pantsSvg.startsWith('<svg'));
        }
    }
});

test('Personal Reading Engine supports 1-card and 3-card spread modes correctly', async () => {
    const store = new Map();
    globalThis.sessionStorage = {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k)
    };
    globalThis.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    };

    const { createReadingSession, selectPosition, confirmSelection, SPREAD_MODES } = await import('../js/engines/personal-engine.js');
    assert.ok(SPREAD_MODES.single && SPREAD_MODES['three-time'] && SPREAD_MODES['three-insight']);

    // 1. Test 1-Card Mode
    const s1 = createReadingSession('work', 'overall', 'single');
    assert.equal(s1.cardCount, 1);
    selectPosition(12);
    const c1 = confirmSelection();
    assert.equal(c1.locked, true);
    assert.equal(c1.cardIds.length, 1);
    assert.equal(c1.cardId, c1.cardIds[0]);

    // 2. Test 3-Card Mode (three-time)
    const s3 = createReadingSession('love', 'relationship', 'three-time');
    assert.equal(s3.cardCount, 3);
    selectPosition(5);
    selectPosition(18);
    // Toggle off 18
    let afterToggle = selectPosition(18);
    assert.deepEqual(afterToggle.selectedPositions, [5]);
    // Re-pick 18 and 42
    selectPosition(18);
    selectPosition(42);
    const c3 = confirmSelection();
    assert.equal(c3.locked, true);
    assert.equal(c3.cardIds.length, 3);
    assert.equal(new Set(c3.cardIds).size, 3, 'All 3 drawn cards must be distinct');
});

test('Yes/No Verdict, Plain-Language Card Explainer, and Monetization Config work for all 78 cards', async () => {
    const { getYesNoVerdict } = await import('../js/utils/share-and-history.js');
    const { getCardElementExplanation, getMysticRank } = await import('../js/utils/streak-and-guide.js');
    const { MONETIZATION_CONFIG, buildAffiliateSearchUrl } = await import('../js/config/monetization-config.js');

    const cards = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cards.json'), 'utf8'));
    const affiliates = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/affiliates.json'), 'utf8'));

    for (const card of cards) {
        const verdict = getYesNoVerdict(card, 'neutral');
        assert.ok(['YES', 'LIKELY', 'WAIT'].includes(verdict.code));
        assert.ok(verdict.label.length > 5);

        const exp = getCardElementExplanation(card);
        assert.ok(exp.badge && exp.element && exp.simpleMeaning);
        assert.ok(!exp.simpleMeaning.includes('undefined'));
    }

    assert.equal(MONETIZATION_CONFIG.tipping.amounts.length, 3);
    const shopUrl = buildAffiliateSearchUrl('กำไลหินมงคล');
    assert.ok(shopUrl.startsWith('https://shopee.co.th/search?keyword='));

    assert.ok(affiliates.length >= 6, 'Should have at least 6 rich affiliate items');
    for (const item of affiliates) {
        assert.ok(!item.url.includes('example.com'), `Affiliate ${item.id} must not use placeholder example.com URL`);
        assert.ok(item.icon && item.badge && item.price_range && item.cta_th);
    }

    const rank = getMysticRank(7, 15);
    assert.ok(rank.title && rank.icon);
});
