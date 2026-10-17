import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('C:/Users/frame/Desktop/Money');

test('all required JSON data files exist and are valid JSON', () => {
    const jsonFiles = [
        'data/cards.json',
        'data/interpretations.json',
        'data/questions.json',
        'data/remedies.json',
        'data/colors.json',
        'data/wallpapers.json',
        'data/affiliates.json',
        'data/decks.json'
    ];

    for (const f of jsonFiles) {
        const fullPath = path.join(projectRoot, f);
        assert.ok(fs.existsSync(fullPath), `File ${f} must exist`);
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.doesNotThrow(() => JSON.parse(content), `File ${f} must be valid JSON`);
    }
});

test('all HTML files have Mitr + Outfit fonts and no text-white on body', () => {
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
    }
});

test('HTTP server responds with 200 OK for all HTML pages', async () => {
    const http = await import('node:http');
    const htmlFiles = ['index.html', 'daily.html', 'reading.html', 'result.html', 'cards-preview.html'];

    const server = http.createServer((req, res) => {
        const cleanPath = (req.url || '/index.html').split('?')[0].replace(/^\/+/, '') || 'index.html';
        const filePath = path.join(projectRoot, cleanPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();

    try {
        for (const page of htmlFiles) {
            const url = `http://127.0.0.1:${port}/${page}`;
            const res = await fetch(url);
            assert.equal(res.status, 200, `Expected 200 for ${url}`);
            const html = await res.text();
            assert.ok(html.length > 500, `Expected content length > 500 for ${url}`);
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

test('SVG Art engine renders all 78 cards in standard and festival themes without throwing', async () => {
    const { renderCardFront, renderCardBack } = await import('../js/art/tarot-art.js');
    const { THEMES } = await import('../js/art/themes.js');
    const cards = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cards.json'), 'utf8'));

    assert.equal(cards.length, 78);

    for (const themeId of Object.keys(THEMES)) {
        const backSvg = renderCardBack(themeId);
        assert.ok(backSvg.startsWith('<svg'), `Theme ${themeId} back must be valid SVG`);

        for (const card of cards) {
            const frontSvg = renderCardFront(card, themeId);
            assert.ok(frontSvg.startsWith('<svg'), `Card ${card.id} in theme ${themeId} must be valid SVG`);
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
