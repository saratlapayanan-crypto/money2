/* ================================================================
   Deck Borders & Signature Architecture Engine (ระบบกรอบไพ่ประจำสำรับ)
   สร้างกรอบ ขอบมุม ยอดซุ้ม และป้ายชื่อด้านล่างที่เหมือนกัน 100% ในแต่ละสำรับ
   - standard     : มนตราสยาม (Royal Siamese Gold & Kanok Filigree)
   - songkran     : สงกรานต์ (Jasmine Garland & Sacred Water Splash)
   - loy-krathong : ลอยกระทง (Floating Lotus Lantern & Full Moon Glow)
   - christmas    : คริสต์มาส / เหมายัน (Evergreen Holly & Bethlehem Star)
   - valentine    : วาเลนไทน์ (Blooming Rose Vines & Golden Cupid Ribbon)
   - halloween    : ฮาโลวีน (Autumn Ivy, Pumpkin Lantern & Bat Wings)
   - minimalist   : มินิมอล (Architectural Fine-Line & Geometric Precision)
   ================================================================ */

import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, crescent, snowflake, drop
} from './helpers.js';

const W = 240, H = 380, CX = 120;

/** ลวดลายมุม 4 ทิศเฉพาะเทศกาล */
function renderCornerOrnaments(deckId, t, gold) {
    const s = 24; // ขนาดลวดลายมุม
    const m = 18; // ระยะขอบ

    // ตำแหน่ง 4 มุม
    const corners = [
        { x: m, y: m, sx: 1, sy: 1 },
        { x: W - m, y: m, sx: -1, sy: 1 },
        { x: m, y: H - m, sx: 1, sy: -1 },
        { x: W - m, y: H - m, sx: -1, sy: -1 }
    ];

    return corners.map(c => {
        let motif = '';
        if (deckId === 'songkran') {
            // ดอกมะลิร้อยมาลัยและหยาดน้ำทิพย์
            motif = (
                circle(0, 0, 4.5, { fill: '#ffffff', stroke: gold, 'stroke-width': 1.2 }) +
                circle(6, 4, 3, { fill: '#ffffff' }) +
                circle(4, 6, 3, { fill: '#ffffff' }) +
                drop(8, 12, 4, { fill: t.suits.cups || '#38bdf8' }) +
                sparkle(0, 0, 3, gold, 0.9)
            );
        } else if (deckId === 'loy-krathong') {
            // กลีบบัวกระทงทองคำและเปลวประทีป
            motif = (
                path('M 0 0 C 4 6, 12 8, 14 0 C 10 -4, 4 -4, 0 0 Z', { fill: gold }) +
                circle(8, -2, 2.5, { fill: '#f59e0b' }) +
                sparkle(8, -5, 3, '#ffffff', 0.95)
            );
        } else if (deckId === 'christmas') {
            // กิ่งสนฮอลลี่และผลเบอร์รี่สีแดง
            motif = (
                path('M 0 0 Q 8 2, 14 8 Q 8 14, 0 0 Z', { fill: '#15803d' }) +
                circle(4, 4, 2.8, { fill: '#dc2626' }) +
                circle(8, 3, 2.5, { fill: '#dc2626' }) +
                snowflake(10, 10, 4, gold)
            );
        } else if (deckId === 'valentine') {
            // ดอกกุหลาบแย้มบานและริบบิ้นทอง
            motif = (
                circle(4, 4, 4.5, { fill: '#e11d48' }) +
                circle(4, 4, 2.5, { fill: '#fda4af' }) +
                heart(10, 10, 3.5, { fill: gold })
            );
        } else if (deckId === 'halloween') {
            // เถาใบเมเปิ้ลและค้างคาวทองคำ
            motif = (
                path('M 0 0 Q 6 8, 12 6 Q 8 12, 0 0 Z', { fill: '#ea580c' }) +
                circle(4, 4, 2, { fill: gold }) +
                path('M 4 8 Q 8 6, 12 10', { stroke: gold, 'stroke-width': 1.2, fill: 'none' })
            );
        } else if (deckId === 'minimalist') {
            // เส้นเรขาคณิตคลีนมินิมอล
            motif = (
                line(0, 0, 12, 0, { stroke: t.frame, 'stroke-width': 1.8 }) +
                line(0, 0, 0, 12, { stroke: t.frame, 'stroke-width': 1.8 }) +
                circle(4, 4, 1.5, { fill: t.frame })
            );
        } else {
            // มนตราสยาม: ลายกนกทองคำ 3 ชั้น (Royal Siamese Kanok)
            motif = path(
                `M 0 16 C 1 6, 6 1, 16 0 ` +
                `C 9 3, 7 5, 9 9 ` +
                `C 5 7, 3 9, 0 16 Z`,
                { fill: gold, opacity: 0.9 }
            );
        }

        return g(motif, { transform: `translate(${c.x} ${c.y}) scale(${c.sx} ${c.sy})` });
    }).join('');
}

/** กรอบนอก 3 ชั้นประจำสำรับ */
export function renderDeckBorder(deckId, t, uid, includeBg = true) {
    const gold = `url(#${uid}gold)`;

    return g(
        // พื้นหลังไพ่ (เฉพาะเมื่อไม่ใช้ภาพวาดเต็มใบ)
        (includeBg ? rect(0, 0, W, H, { rx: 16, fill: `url(#${uid}bg)` }) : '') +
        // กรอบนอก 3 ชั้น
        rect(6, 6, W - 12, H - 12, { rx: 12, fill: 'none', stroke: gold, 'stroke-width': 1.8 }) +
        rect(11, 11, W - 22, H - 22, { rx: 9, fill: 'none', stroke: t.frameSoft, 'stroke-width': 1 }) +
        rect(15, 15, W - 30, H - 30, { rx: 7, fill: 'none', stroke: t.frameSoft, 'stroke-width': 0.75, 'stroke-dasharray': deckId === 'minimalist' ? 'none' : '4 2' }) +
        // ลวดลายมุม 4 ทิศประจำสำรับ
        renderCornerOrnaments(deckId, t, t.suitGold),
        {}
    );
}

/** ซุ้มวิหาร / ช่องเปิดภาพศิลป์ตรงกลาง (Cathedral / Festive Arch) */
export function renderDeckArch(deckId, t, uid) {
    const gold = `url(#${uid}gold)`;

    return g(
        // ออร่าเรืองแสงภายในซุ้ม
        path(`M 28 92 C 28 62, 70 42, ${CX} 42 C 170 42, 212 62, 212 92 L 212 284 C 212 288, 208 292, 202 292 L 38 292 C 32 292, 28 288, 28 284 Z`,
             { fill: `url(#${uid}archAura)`, stroke: t.frameSoft, 'stroke-width': 1.2 }) +
        // เส้นขอบทองรอบซุ้มวิหาร
        path(`M 32 94 C 32 68, 72 48, ${CX} 48 C 168 48, 208 68, 208 94 L 208 280 C 208 284, 204 288, 198 288 L 42 288 C 36 288, 32 284, 32 280 Z`,
             { fill: 'none', stroke: gold, 'stroke-width': 1.5 }),
        {}
    );
}

/** ตรายอดซุ้มและตัวเลขกำกับไพ่ (Top Numeral / Rank Crest) */
export function renderDeckNumeralBadge(card, deckId, t, uid, numeralStr) {
    const gold = `url(#${uid}gold)`;

    // สัญลักษณ์ยอดซุ้มเฉพาะเทศกาล
    let apexFinial = '';
    if (deckId === 'songkran') {
        apexFinial = drop(CX, 38, 4.5, { fill: t.suits.cups || '#38bdf8' });
    } else if (deckId === 'loy-krathong') {
        apexFinial = crescent(CX, 38, 5, t.suitGold);
    } else if (deckId === 'christmas') {
        apexFinial = star(CX, 38, 6, 2.5, 8, -90, { fill: t.suitGold });
    } else if (deckId === 'valentine') {
        apexFinial = heart(CX, 38, 4.5, { fill: '#e11d48' });
    } else if (deckId === 'halloween') {
        apexFinial = star(CX, 38, 5, 2, 5, -90, { fill: '#ea580c' });
    } else {
        apexFinial = circle(CX, 42, 3.5, { fill: gold }) + sparkle(CX, 35, 4.5, t.sparkle, 0.95);
    }

    return g(
        apexFinial +
        // ตัวเลขโรมันหรือลำดับไพ่ด้านบน
        txt(CX, 68, numeralStr, { fill: t.numeral, 'font-size': 17, 'font-family': "'Outfit', sans-serif", 'font-weight': 700, 'letter-spacing': '2.2' }) +
        line(85, 74, 155, 74, { stroke: t.frameSoft, 'stroke-width': 0.8 }) +
        circle(CX, 74, 1.8, { fill: t.suitGold }),
        {}
    );
}

/** ป้ายชื่อไพ่ด้านล่าง (Bottom Cartouche) — เหมือนกันทุกใบในสำรับ */
export function renderDeckCartouche(card, deckId, t, uid) {
    const gold = `url(#${uid}gold)`;
    const thaiTitle = card.name_th || card.thai_name || card.name;
    const englishTitle = (card.name || '').toUpperCase();

    // คำโปรยด้านล่างตามเทศกาล
    let subBrand = '✦ THAI TAROT · MOON RABBIT ✦';
    if (deckId === 'songkran') {
        subBrand = '✦ SONGKRAN · WATER OF BLESSINGS ✦';
    } else if (deckId === 'loy-krathong') {
        subBrand = '✦ LOY KRATHONG · MOONLIT WATERS ✦';
    } else if (deckId === 'christmas') {
        subBrand = '✦ WINTER SOLSTICE · LIGHT OF HOPE ✦';
    } else if (deckId === 'valentine') {
        subBrand = '✦ VALENTINE · DEVOTION & GRACE ✦';
    } else if (deckId === 'halloween') {
        subBrand = '✦ HALLOWEEN · MYSTIC VEIL ✦';
    } else if (deckId === 'minimalist') {
        subBrand = '✦ CONTEMPORARY · MODERN TAROT ✦';
    }

    return g(
        // ฐานป้ายชื่อไพ่
        rect(32, 298, 176, 70, { rx: 8, fill: `url(#${uid}bg)`, opacity: 0.88 }) +
        rect(32, 298, 176, 70, { rx: 8, fill: 'none', stroke: t.frameSoft, 'stroke-width': 0.8 }) +
        line(42, 298, 198, 298, { stroke: gold, 'stroke-width': 1.4 }) +
        circle(CX, 298, 2.5, { fill: gold }) +
        // ชื่อไพ่ภาษาไทย: ฟอนต์ Mitr ตัวหนา สดใส อบอุ่น
        txt(CX, 323, thaiTitle, { fill: t.title, 'font-size': 18, 'font-family': "'Mitr', sans-serif", 'font-weight': 600 }) +
        // ชื่อไพ่ภาษาอังกฤษ: ฟอนต์ Outfit โมเดิร์นสากล
        txt(CX, 343, englishTitle, { fill: t.subtitle, 'font-size': 9, 'font-family': "'Outfit', sans-serif", 'letter-spacing': '2.4', 'font-weight': 600 }) +
        // สโลแกนประจำสำรับ
        txt(CX, 361, subBrand, { fill: t.frameSoft, 'font-size': 7, 'font-family': "'Outfit', 'Mitr', sans-serif", 'letter-spacing': '1.8', 'font-weight': 600 }),
        {}
    );
}
