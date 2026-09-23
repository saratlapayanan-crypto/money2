import { readFileSync } from 'fs';
import { renderFront } from '../js/art/fronts.js';
import { THEMES } from '../js/art/themes.js';

const cards = JSON.parse(readFileSync('./data/cards.json', 'utf-8'));
const deckIds = Object.keys(THEMES);

console.log(`Testing ${cards.length} cards across ${deckIds.length} themes (${cards.length * deckIds.length} combinations)...`);

let totalRendered = 0;
let errors = 0;

for (const deckId of deckIds) {
    for (const card of cards) {
        try {
            const svg = renderFront(card, deckId);
            totalRendered++;
            if (typeof svg !== 'string' || !svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
                console.error(`Invalid SVG for card ${card.id} in theme ${deckId}`);
                errors++;
            }
            if (svg.includes('NaN')) {
                console.error(`NaN found in SVG for card ${card.id} in theme ${deckId}`);
                errors++;
            }
            if (svg.includes('undefined')) {
                console.error(`undefined found in SVG for card ${card.id} in theme ${deckId}`);
                errors++;
            }
        } catch (err) {
            console.error(`Error rendering card ${card.id} in theme ${deckId}:`, err);
            errors++;
        }
    }
}

console.log(`Total rendered: ${totalRendered}, Errors: ${errors}`);
if (errors === 0) {
    console.log('ALL 546 CARD SVGS RENDERED PERFECTLY WITHOUT ERRORS, NAN, OR UNDEFINED!');
} else {
    process.exit(1);
}
