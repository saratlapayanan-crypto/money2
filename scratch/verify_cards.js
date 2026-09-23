import fs from 'fs';
import { renderCardFront, renderCardBack } from '../js/art/tarot-art.js';
import { THEMES } from '../js/art/themes.js';

const cards = JSON.parse(fs.readFileSync('./data/cards.json', 'utf8'));

console.log('=== 1. Testing all 7 themes x 78 cards ===');
let failCount = 0;
for (const themeId of Object.keys(THEMES)) {
    const back = renderCardBack(themeId);
    if (!back.startsWith('<svg') || !back.endsWith('</svg>')) {
        console.error(`Back SVG invalid for theme ${themeId}`);
        failCount++;
    }

    for (const card of cards) {
        const front = renderCardFront(card, themeId);
        if (!front.startsWith('<svg') || !front.endsWith('</svg>')) {
            console.error(`Front SVG invalid for ${card.id} in ${themeId}`);
            failCount++;
        }
        if (front.includes('undefined') || front.includes('NaN')) {
            console.error(`Front contains NaN/undefined for ${card.id} in ${themeId}`);
            failCount++;
        }
    }
}
console.log(`Rendered 546 cards. Failures: ${failCount}`);

console.log('=== 2. Testing secular & figure integrity ===');
const card2 = cards.find(c => c.id === 'major-2');
const card5 = cards.find(c => c.id === 'major-5');
const card13 = cards.find(c => c.id === 'major-13');
const card16 = cards.find(c => c.id === 'major-16');
const card18 = cards.find(c => c.id === 'major-18');
const card20 = cards.find(c => c.id === 'major-20');

for (const themeId of Object.keys(THEMES)) {
    const svg2 = renderCardFront(card2, themeId);
    const svg5 = renderCardFront(card5, themeId);
    const svg13 = renderCardFront(card13, themeId);
    const svg16 = renderCardFront(card16, themeId);
    const svg18 = renderCardFront(card18, themeId);
    const svg20 = renderCardFront(card20, themeId);

    if (svg2.includes('stroke="#ffffff" stroke-width="2"><line') || svg2.includes('กางเขน')) {
        console.error(`Card 2 has cross in ${themeId}`);
        failCount++;
    }
    if (svg20.includes('stroke="#c0392b" stroke-width="2"') || svg20.includes('กางเขน')) {
        console.error(`Card 20 has cross in ${themeId}`);
        failCount++;
    }
    if (svg5.includes('พระสงฆ์') || svg5.includes('จีวร')) {
        console.error(`Card 5 has religious elements in ${themeId}`);
        failCount++;
    }
    if (svg13.length < 2000 && !svg13.includes('<image')) {
        console.error(`Card 13 too short (missing figure?) in ${themeId}`);
        failCount++;
    }
    if (svg18.length < 2000 && !svg18.includes('<image')) {
        console.error(`Card 18 too short (missing figure?) in ${themeId}`);
        failCount++;
    }
}

console.log(`Secular and figure checks done. Failures: ${failCount}`);
if (failCount === 0) {
    console.log('ALL CHECKS PASSED PERFECTLY!');
} else {
    process.exit(1);
}
