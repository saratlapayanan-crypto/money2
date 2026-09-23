import fs from 'fs';
import { getTheme, THEMES } from '../js/art/themes.js';
import { renderDeckBorder, renderDeckNumeralBadge, renderDeckCartouche } from '../js/art/borders.js';
import { toRoman } from '../js/art/helpers.js';

const cards = JSON.parse(fs.readFileSync('./data/cards.json', 'utf8'));

function renderQueuedCardSvg(card, themeId) {
    const t = getTheme(themeId);
    const uid = `queue_${card.id}_test`;
    const W = 240, H = 380, CX = 120;

    let numeralStr = '';
    if (card.arcana === 'major') {
        numeralStr = toRoman(card.number);
    } else {
        const rankNames = { 1: 'ACE', 11: 'PAGE', 12: 'KNIGHT', 13: 'QUEEN', 14: 'KING' };
        numeralStr = rankNames[card.number] || String(card.number);
    }

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.name_th || card.name} - รอคิว AI">
<defs>
    <clipPath id="${uid}clip"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#140b20"/>
        <stop offset="50%" stop-color="#1c102e"/>
        <stop offset="100%" stop-color="#28153f"/>
    </linearGradient>
    <linearGradient id="${uid}gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff5cc"/>
        <stop offset="35%" stop-color="${t.frame}"/>
        <stop offset="70%" stop-color="#b8860b"/>
        <stop offset="100%" stop-color="${t.frame}"/>
    </linearGradient>
    <radialGradient id="${uid}centerGlow" cx="50%" cy="46%" r="55%">
        <stop offset="0%" stop-color="#ffd54f" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#7c3aed" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
</defs>
<rect width="${W}" height="${H}" rx="14" fill="url(#${uid}bg)"/>
<circle cx="${CX}" cy="175" r="90" fill="url(#${uid}centerGlow)"/>
<g opacity="0.65" fill="#fef08a">
    <circle cx="55" cy="115" r="1.2"/>
    <circle cx="185" cy="125" r="1.4"/>
    <circle cx="65" cy="225" r="1.1"/>
    <circle cx="178" cy="235" r="1.3"/>
    <circle cx="120" cy="100" r="1.5"/>
</g>
<g transform="translate(${CX}, 172)">
    <circle cx="0" cy="0" r="54" fill="none" stroke="url(#${uid}gold)" stroke-width="1.4" opacity="0.85"/>
    <circle cx="0" cy="0" r="48" fill="none" stroke="${t.frameSoft}" stroke-width="0.8" stroke-dasharray="3, 3" opacity="0.7"/>
    <circle cx="0" cy="0" r="40" fill="none" stroke="url(#${uid}gold)" stroke-width="0.9" opacity="0.6"/>
    <path d="M 0 -58 L 0 -48 M 0 48 L 0 58 M -58 0 L -48 0 M 48 0 L 58 0 M -41 -41 L -34 -34 M 34 34 L 41 41 M -41 41 L -34 34 M 34 -34 L 41 -41" stroke="url(#${uid}gold)" stroke-width="1.2" opacity="0.75"/>
    <path d="M -14 -20 L 14 -20 L 0 0 L 14 20 L -14 20 L 0 0 Z" fill="rgba(245, 158, 11, 0.15)" stroke="url(#${uid}gold)" stroke-width="1.6"/>
    <circle cx="0" cy="0" r="2.2" fill="#fff5cc"/>
    <circle cx="0" cy="10" r="3.2" fill="#fbbf24"/>
    <circle cx="0" cy="14" r="5" fill="#f59e0b" opacity="0.8"/>
    <polygon points="0,-28 2.5,-22 8.5,-20 2.5,-18 0,-12 -2.5,-18 -8.5,-20 -2.5,-22" fill="#ffffff" opacity="0.95"/>
</g>
<g transform="translate(${CX}, 245)">
    <rect x="-68" y="-12" width="136" height="24" rx="12" fill="#2d124d" stroke="url(#${uid}gold)" stroke-width="1.1" opacity="0.95"/>
    <text x="0" y="4" fill="#fbbf24" font-size="9.5" font-family="'Outfit', sans-serif" font-weight="700" letter-spacing="1.5" text-anchor="middle">✦ AI IN QUEUE ✦</text>
    <text x="0" y="22" fill="#e9d5ff" font-size="8" font-family="'Mitr', sans-serif" font-weight="400" text-anchor="middle">รอบโควตา 13:52 น.</text>
</g>
${renderDeckBorder(themeId, t, uid, false)}
${renderDeckNumeralBadge(card, themeId, t, uid, numeralStr)}
${renderDeckCartouche(card, themeId, t, uid)}
</svg>`;
}

let errors = 0;
for (const themeId of Object.keys(THEMES)) {
    for (const card of cards) {
        const svg = renderQueuedCardSvg(card, themeId);
        if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
            console.error(`Invalid queued SVG for ${card.id} in ${themeId}`);
            errors++;
        }
    }
}
console.log(`Queued Card SVG test complete across 546 cards. Errors: ${errors}`);
