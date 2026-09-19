/* ================================================================
   หน้าไพ่ 78 ใบ — original cartoon SVG art (แนวการ์ตูนไทย)
   องค์ประกอบสัญลักษณ์อ้างอิง: Wikipedia "Major Arcana"
   ภาพวาดทั้งหมดเป็น vector ต้นฉบับของโปรเจกต์นี้
   ================================================================ */
import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, flame, crescent, bat, snowflake,
    corners, sunburst, wave, toRoman, face
} from './helpers.js';
import { getTheme } from './themes.js';

const W = 240, H = 380;
const SKIN = '#ffd9b3';
const HAIR = '#3b2a20';

/* ---------- ไอคอนชุดไพ่ (suit icons) วาดที่จุดกำเนิด สูง ~30 ---------- */
function wandIcon(t) {
    const gold = t.suitGold, hot = t.suits.wands;
    return g(
        line(0, 15, 0, -8, { stroke: gold, 'stroke-width': 5, 'stroke-linecap': 'round' }) +
        circle(0, -8, 3.4, { fill: gold }) +
        path('M 0 -22 C 7 -26, 9 -18, 3 -16 C 8 -15, 5 -9, 0 -13 C -5 -9, -8 -15, -3 -16 C -9 -18, -7 -26, 0 -22 Z', { fill: hot }) +
        sparkle(0, -26, 4.5, gold, 0.9),
        {}
    );
}
function cupIcon(t) {
    const gold = t.suitGold, blue = t.suits.cups;
    return g(
        path('M -11 -14 L 11 -14 C 11 -2, 5 5, 0 6 C -5 5, -11 -2, -11 -14 Z', { fill: gold }) +
        ell(0, -14, 11, 2.6, { fill: blue }) +
        line(0, 6, 0, 13, { stroke: gold, 'stroke-width': 4 }) +
        ell(0, 16, 8, 2.8, { fill: gold }) +
        circle(0, -6, 3, { fill: t.bg[0], opacity: 0.5 }),
        {}
    );
}
function swordIcon(t) {
    const steel = t.suits.swords, gold = t.suitGold, grip = t.ribbon || '#c0392b';
    return g(
        poly('0,-26 4.5,-8 4.5,8 -4.5,8 -4.5,-8', { fill: steel }) +
        line(-9, 9, 9, 9, { stroke: gold, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
        line(0, 9, 0, 18, { stroke: grip, 'stroke-width': 4 }) +
        circle(0, 20, 3.4, { fill: gold }),
        {}
    );
}
function coinIcon(t) {
    const gold = t.suitGold, green = t.suits.pentacles;
    return g(
        circle(0, 0, 14, { fill: gold }) +
        circle(0, 0, 10.5, { fill: 'none', stroke: t.bg[1], 'stroke-width': 1.6 }) +
        star(0, 0, 8.5, 3.4, 5, -90, { fill: 'none', stroke: t.bg[1], 'stroke-width': 1.6 }) +
        circle(0, 0, 2.4, { fill: green }),
        {}
    );
}
const SUIT_ICONS = { wands: wandIcon, cups: cupIcon, swords: swordIcon, pentacles: coinIcon };

/* ---------- ผังจัดวาง pips 1–10 (พื้นที่ศิลป์ 160×165) ---------- */
const PIPS = {
    1: [[80, 82, 1.75]],
    2: [[80, 40, 1.05], [80, 124, 1.05]],
    3: [[80, 30, 1.05], [44, 122, 1.05], [116, 122, 1.05]],
    4: [[52, 42, 1.05], [108, 42, 1.05], [52, 124, 1.05], [108, 124, 1.05]],
    5: [[52, 32, 1], [108, 32, 1], [80, 78, 1], [52, 128, 1], [108, 128, 1]],
    6: [[52, 32, 0.95], [108, 32, 0.95], [52, 82, 0.95], [108, 82, 0.95], [52, 132, 0.95], [108, 132, 0.95]],
    7: [[80, 24, 0.9], [52, 58, 0.9], [108, 58, 0.9], [52, 104, 0.9], [108, 104, 0.9], [80, 140, 0.9], [80, 81, 0.9]],
    8: [[52, 26, 0.85], [108, 26, 0.85], [52, 66, 0.85], [108, 66, 0.85], [52, 106, 0.85], [108, 106, 0.85], [52, 144, 0.85], [108, 144, 0.85]],
    9: [[45, 30, 0.85], [80, 30, 0.85], [115, 30, 0.85], [45, 82, 0.85], [80, 82, 0.85], [115, 82, 0.85], [45, 134, 0.85], [80, 134, 0.85], [115, 134, 0.85]],
    10: [[80, 24, 0.75], [58, 58, 0.75], [102, 58, 0.75], [36, 96, 0.75], [80, 96, 0.75], [124, 96, 0.75], [28, 136, 0.75], [69, 136, 0.75], [110, 136, 0.75], [148, 136, 0.75]],
};

/* ---------- การ์ดสำคัญ (Page/Knight/Queen/King) ---------- */
function courtArt(kind, suit, t) {
    const suitColor = t.suits[suit];
    const gold = t.suitGold;
    let headgear = '';
    if (kind === 11) { // Page — หมวกแก๊ป + ขนนก
        headgear = g(
            path(`M -13 -19 Q 0 -30, 13 -19 L 13 -14 Q 0 -19, -13 -14 Z`, { fill: suitColor }) +
            path('M 10 -18 Q 20 -30, 24 -24 Q 16 -22, 12 -16 Z', { fill: gold }),
            { transform: 'translate(80 47)' }
        );
    } else if (kind === 12) { // Knight — หมวกกันน็อค + ขนนกแดง
        headgear = g(
            rrect(-13, -24, 26, 12, 5, { fill: t.suits.swords }) +
            path('M 0 -24 C 4 -36, 14 -38, 18 -30 C 10 -30, 6 -26, 4 -22 Z', { fill: t.ribbon || '#c0392b' }),
            { transform: 'translate(80 47)' }
        );
    } else if (kind === 13) { // Queen — มงกุฎโค้ง + ผ้าคลุม
        headgear = g(
            path('M -13 -18 Q -13 -27, -6 -24 Q 0 -32, 6 -24 Q 13 -27, 13 -18 Z', { fill: gold }) +
            circle(0, -30, 2.2, { fill: t.sparkle }),
            { transform: 'translate(80 47)' }
        );
    } else { // King — มงกุกแหลม + เครา
        headgear = g(
            poly('-13,-18 0,-36 13,-18', { fill: gold }) +
            circle(-6, -20, 1.8, { fill: t.sparkle }) + circle(6, -20, 1.8, { fill: t.sparkle }),
            { transform: 'translate(80 47)' }
        );
    }
    const beard = kind === 14 ? path('M -9 8 Q 0 26, 9 8 Q 0 14, -9 8 Z', { fill: '#d8d3c8', transform: 'translate(80 52)' }) : '';
    const veil = kind === 13 ? path('M -16 -12 Q 0 -22, 16 -12 L 14 6 Q 0 -2, -14 6 Z', { fill: t.sparkle, opacity: 0.35, transform: 'translate(80 50)' }) : '';

    return g(
        // เมดัลลิออนพื้นหลัง
        circle(80, 78, 62, { fill: t.bg[0], opacity: 0.55 }) +
        circle(80, 78, 62, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1.5 }) +
        // ลำตัว/เสื้อคลุม
        path('M 80 34 C 52 38, 40 78, 34 132 L 126 132 C 120 78, 108 38, 80 34 Z', { fill: suitColor }) +
        path('M 80 34 L 66 132 L 94 132 Z', { fill: t.bg[1], opacity: 0.35 }) +
        // อินทรียวัตถุประจำชุดบนอก
        g(SUIT_ICONS[suit](t), { transform: 'translate(80 96) scale(0.9)' }) +
        // สร้อย
        path('M 62 52 Q 80 66, 98 52', { stroke: gold, 'stroke-width': 2.5, fill: 'none' }) +
        // หน้า + ผม
        face(80, 47, 17, SKIN, { blush: true }) +
        path('M 63 44 C 62 26, 98 26, 97 44 C 94 34, 66 34, 63 44 Z', { fill: HAIR }) +
        veil + beard + headgear,
        {}
    );
}

/* ---------- Major Arcana 22 ใบ (องค์ประกอบอ้างอิง Wikipedia) ---------- */
const MAJORS = {
    0: (t) => // The Fool — คนหนุ่มเฝือกผา + สุนัข + ถุงผูกไม้
        g(
            poly('92,92 160,92 160,165 60,165', { fill: '#8a6b4f' }) +
            poly('92,92 160,92 160,104 104,104', { fill: '#a3835f', opacity: 0.6 }) +
            circle(24, 22, 11, { fill: '#f6d98a' }) + sunburst(24, 22, 22, t.suitGold, 8, 1.6) +
            face(102, 52, 13, SKIN, { blush: true }) +
            path('M 102 66 C 90 70, 86 84, 88 92 L 116 92 C 118 80, 112 70, 102 66 Z', { fill: '#e8b84f' }) +
            line(112, 46, 132, 30, { stroke: '#8a6b4f', 'stroke-width': 3, 'stroke-linecap': 'round' }) +
            circle(136, 26, 9, { fill: t.suits.pentacles }) +
            line(96, 74, 78, 80, { stroke: SKIN, 'stroke-width': 5, 'stroke-linecap': 'round' }) +
            circle(74, 78, 4, { fill: '#ffffff' }) + circle(74, 78, 2, { fill: '#f3a3a3' }) +
            ell(116, 118, 14, 8, { fill: '#d9a066' }) +
            circle(130, 112, 7, { fill: '#d9a066' }) +
            poly('132,106 138,112 130,114', { fill: '#b57f4a' }) +
            path('M 102 124 Q 92 118, 94 112', { stroke: '#d9a066', 'stroke-width': 3, fill: 'none' }) +
            sparkle(40, 130, 5, t.sparkle, 0.8) + sparkle(140, 60, 5, t.sparkle, 0.7),
            {}
        ),
    1: (t) => // The Magician — สัญลักษณ์อนันต์ + โต๊ะ 4 ธาตุ + ไม้กายสิทธิ์
        g(
            path('M 66 18 C 66 8, 80 8, 80 18 C 80 8, 94 8, 94 18 C 94 28, 80 32, 80 40 C 80 32, 66 28, 66 18 Z', { fill: t.suitGold, transform: 'translate(0 -4)' }) +
            face(80, 58, 13, SKIN) +
            path('M 80 72 C 62 76, 56 100, 58 124 L 102 124 C 104 100, 98 76, 80 72 Z', { fill: '#f2ead8' }) +
            path('M 80 72 C 92 78, 100 96, 102 124 L 80 124 Z', { fill: t.suits.wands, opacity: 0.85 }) +
            line(94, 66, 118, 38, { stroke: '#8a6b4f', 'stroke-width': 3.5, 'stroke-linecap': 'round' }) +
            sparkle(121, 33, 7, t.suitGold) +
            line(66, 82, 52, 104, { stroke: SKIN, 'stroke-width': 5, 'stroke-linecap': 'round' }) +
            rrect(38, 124, 84, 10, 3, { fill: t.suitGold }) +
            line(46, 134, 46, 148, { stroke: '#8a6b4f', 'stroke-width': 4 }) + line(114, 134, 114, 148, { stroke: '#8a6b4f', 'stroke-width': 4 }) +
            g(SUIT_ICONS.cups(t), { transform: 'translate(56 112) scale(0.5)' }) +
            g(SUIT_ICONS.pentacles(t), { transform: 'translate(80 111) scale(0.5)' }) +
            g(SUIT_ICONS.swords(t), { transform: 'translate(102 112) scale(0.5)' }),
            {}
        ),
    2: (t) => // High Priestess — สองเสา + ผ้าม่าน + จันทร์เสี้ยว + ม้วนหนังสือ
        g(
            rrect(28, 20, 18, 130, 5, { fill: t.suits.swords, opacity: 0.9 }) +
            rrect(114, 20, 18, 130, 5, { fill: t.suits.swords, opacity: 0.55 }) +
            path('M 46 26 Q 80 6, 114 26 L 114 120 Q 80 132, 46 120 Z', { fill: t.sparkle, opacity: 0.16 }) +
            face(80, 56, 12, SKIN) +
            path('M 80 70 C 60 74, 56 100, 60 126 L 100 126 C 104 100, 100 74, 80 70 Z', { fill: t.suits.cups }) +
            rrect(96, 84, 16, 12, 4, { fill: t.suitGold }) + circle(95, 90, 2, { fill: t.suitGold }) + circle(113, 90, 2, { fill: t.suitGold }) +
            crescent(80, 136, 11, t.suitGold) +
            circle(58, 40, 3, { fill: t.suits.wands, opacity: 0.8 }) + circle(102, 44, 3, { fill: t.suits.wands, opacity: 0.8 }),
            {}
        ),
    3: (t) => // The Empress — มงกุฎดาว ทุ่งข้าวสาลี โล่ห์หัวใจสัญลักษณ์ศุกร์
        g(
            star(80, 22, 5, 2, 5, -90, { fill: t.suitGold }) +
            star(64, 28, 5, 2, 5, -90, { fill: t.suitGold }) + star(96, 28, 5, 2, 5, -90, { fill: t.suitGold }) +
            face(80, 52, 13, SKIN, { blush: true }) +
            path('M 80 68 C 62 72, 58 98, 62 130 L 98 130 C 102 98, 98 72, 80 68 Z', { fill: t.suits.pentacles }) +
            heart(80, 100, 13, { fill: '#f2ead8' }) +
            circle(80, 98, 3.4, { stroke: t.suits.wands, 'stroke-width': 2, fill: 'none' }) +
            line(80, 101, 80, 108, { stroke: t.suits.wands, 'stroke-width': 2 }) +
            g([0, 1, 2, 3].map(i => ell(i * 6, 18 - i * 4, 3.2, 5, { fill: '#f1c40f' })).join('') + line(0, 20, 0, 46, { stroke: '#c79a2e', 'stroke-width': 2 }), { transform: 'translate(38 104)' }) +
            g([0, 1, 2, 3].map(i => ell(-i * 6, 18 - i * 4, 3.2, 5, { fill: '#f1c40f' })).join('') + line(0, 20, 0, 46, { stroke: '#c79a2e', 'stroke-width': 2 }), { transform: 'translate(122 104)' }),
            {}
        ),
    4: (t) => // The Emperor — บัลลังก์หัวแกะ คทา อาภรณ์แดง
        g(
            rrect(40, 18, 80, 108, 8, { fill: t.suits.wands, opacity: 0.85 }) +
            circle(48, 26, 7, { fill: t.suitGold }) + path('M 44 24 C 38 18, 44 14, 47 20', { stroke: t.suitGold, 'stroke-width': 2.5, fill: 'none' }) +
            circle(112, 26, 7, { fill: t.suitGold }) + path('M 116 24 C 122 18, 116 14, 113 20', { stroke: t.suitGold, 'stroke-width': 2.5, fill: 'none' }) +
            face(80, 54, 13, SKIN) +
            path('M 92 44 Q 108 40, 112 30', { stroke: HAIR, 'stroke-width': 3, fill: 'none' }) +
            path('M 80 68 C 66 72, 62 96, 64 122 L 96 122 C 98 96, 94 72, 80 68 Z', { fill: '#b03a3a' }) +
            path('M 71 76 L 80 76 L 80 122 L 66 122 Z', { fill: t.suitGold, opacity: 0.4 }) +
            line(100, 84, 116, 60, { stroke: t.suitGold, 'stroke-width': 3.5, 'stroke-linecap': 'round' }) +
            circle(118, 57, 4.5, { fill: t.suitGold }) +
            rrect(30, 126, 100, 8, 3, { fill: t.suitGold, opacity: 0.7 }),
            {}
        ),
    5: (t) => // The Hierophant — ไม้กางเขนสามชั้น กุญแจไขว้ ศิษย์สองข้าง
        g(
            face(80, 50, 13, SKIN) +
            path('M 80 64 C 64 68, 60 92, 62 120 L 98 120 C 100 92, 96 68, 80 64 Z', { fill: t.suitGold }) +
            path('M 80 64 L 80 120', { stroke: t.bg[1], 'stroke-width': 1.5, opacity: 0.5 }) +
            line(58, 24, 58, 148, { stroke: t.suitGold, 'stroke-width': 3.5 }) +
            line(50, 40, 66, 40, { stroke: t.suitGold, 'stroke-width': 3 }) + line(50, 56, 66, 56, { stroke: t.suitGold, 'stroke-width': 3 }) + line(50, 72, 66, 72, { stroke: t.suitGold, 'stroke-width': 3 }) +
            line(66, 132, 94, 120, { stroke: t.suitGold, 'stroke-width': 2.5 }) + line(66, 120, 94, 132, { stroke: t.suitGold, 'stroke-width': 2.5 }) +
            circle(69, 132, 4, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) + circle(91, 132, 4, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            face(32, 116, 7, SKIN) + circle(32, 106, 2.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.2 }) +
            face(128, 116, 7, SKIN) + circle(128, 106, 2.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.2 }),
            {}
        ),
    6: (t) => // The Lovers — คู่รัก + เทวดาปีก + ดวงอาทิตย์
        g(
            circle(80, 20, 10, { fill: '#f6d98a' }) + sunburst(80, 20, 20, t.suitGold, 10, 1.5) +
            face(80, 40, 8, SKIN) +
            path('M 62 38 Q 66 28, 74 36 Q 68 40, 62 44 Z', { fill: '#f2ead8' }) +
            path('M 98 38 Q 94 28, 86 36 Q 92 40, 98 44 Z', { fill: '#f2ead8' }) +
            heart(80, 58, 10, { fill: t.ribbon || '#e35d6a' }) +
            face(56, 88, 11, SKIN, { blush: true }) + face(104, 88, 11, SKIN, { blush: true }) +
            path('M 56 100 C 46 106, 44 124, 46 140 L 66 140 C 68 124, 66 106, 56 100 Z', { fill: t.suits.cups }) +
            path('M 104 100 C 94 106, 92 124, 94 140 L 114 140 C 116 124, 114 106, 104 100 Z', { fill: t.suits.wands }) +
            line(66, 112, 94, 112, { stroke: SKIN, 'stroke-width': 4.5, 'stroke-linecap': 'round' }) +
            path('M 20 148 Q 80 158, 140 148 L 140 165 L 20 165 Z', { fill: t.suits.pentacles, opacity: 0.7 }),
            {}
        ),
    7: (t) => // The Chariot — รถศึก มงกุฎดาว สฟิงซ์สองตัว
        g(
            poly('30,44 130,44 122,18 38,18', { fill: t.suits.cups, opacity: 0.55 }) +
            star(80, 30, 5, 2, 5, -90, { fill: t.suitGold }) + star(56, 30, 4, 1.6, 5, -90, { fill: t.suitGold }) + star(104, 30, 4, 1.6, 5, -90, { fill: t.suitGold }) +
            rrect(44, 62, 72, 46, 6, { fill: t.suits.cups }) +
            face(80, 62, 9, SKIN) + poly('72,54 80,44 88,54', { fill: t.suitGold }) +
            star(64, 84, 5, 2, 5, -90, { fill: t.suitGold }) + star(96, 84, 5, 2, 5, -90, { fill: t.suitGold }) +
            circle(58, 116, 11, { fill: t.suitGold }) + circle(102, 116, 11, { fill: t.suitGold }) +
            circle(58, 116, 4, { fill: t.bg[1] }) + circle(102, 116, 4, { fill: t.bg[1] }) +
            ell(28, 132, 16, 9, { fill: '#d8d3e8' }) + circle(42, 124, 6.5, { fill: '#d8d3e8' }) +
            ell(132, 132, 16, 9, { fill: t.suits.swords }) + circle(118, 124, 6.5, { fill: t.suits.swords }),
            {}
        ),
    8: (t) => // Strength — หญิงสาง + สิงโต + อนันต์ + มาลัยดอกไม้
        g(
            path('M 66 16 C 66 8, 78 8, 78 16 C 78 8, 90 8, 90 16 C 90 24, 78 27, 78 33 C 78 27, 66 24, 66 16 Z', { fill: t.suitGold, transform: 'translate(0 -3)' }) +
            face(52, 62, 12, SKIN, { blush: true }) +
            [0, 1, 2, 3, 4].map(i => circle(52 - 14 + i * 7, 44 - (i % 2) * 4, 4, { fill: t.ribbon ? '#f0a8b4' : '#e88f9c', opacity: 0.9 })).join('') +
            path('M 52 74 C 40 78, 36 96, 38 112 L 66 112 C 68 96, 64 78, 52 74 Z', { fill: '#f2ead8' }) +
            circle(108, 78, 26, { fill: t.suits.wands }) +
            g([0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                const a = i * 45;
                return g(ell(0, -30, 8, 13, { fill: '#d97b3a', opacity: 0.9 }), { transform: `rotate(${a})` });
            }).join(''), { transform: 'translate(108 78)' }) +
            face(108, 78, 15, '#f5b76e') +
            path('M 101 84 Q 108 90, 115 84', { stroke: '#3b2a20', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }) +
            circle(103, 76, 2, { fill: '#3b2a20' }) + circle(113, 76, 2, { fill: '#3b2a20' }) +
            path('M 66 96 Q 86 106, 96 98', { stroke: SKIN, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }) +
            heart(30, 130, 7, { fill: t.ribbon || '#e35d6a', opacity: 0.9 }),
            {}
        ),
    9: (t) => // The Hermit — ฤๅษีหิ้วโคม ตามภูเขา
        g(
            poly('0,165 60,60 110,165', { fill: t.bg[0], opacity: 0.7 }) +
            poly('80,165 130,80 160,165', { fill: t.bg[0], opacity: 0.5 }) +
            star(28, 24, 4, 1.6, 5, -90, { fill: t.sparkle, opacity: 0.8 }) + star(134, 30, 4, 1.6, 5, -90, { fill: t.sparkle, opacity: 0.8 }) +
            face(80, 66, 10, SKIN) +
            path('M 80 48 Q 60 52, 62 80', { stroke: '#8d8d99', 'stroke-width': 3, fill: 'none' }) +
            path('M 80 48 Q 100 52, 98 80', { stroke: '#8d8d99', 'stroke-width': 3, fill: 'none' }) +
            path('M 80 78 C 64 82, 62 108, 66 138 L 94 138 C 98 108, 96 82, 80 78 Z', { fill: '#8d8d99' }) +
            line(64, 92, 46, 150, { stroke: '#8a6b4f', 'stroke-width': 3.5, 'stroke-linecap': 'round' }) +
            line(96, 92, 116, 102, { stroke: '#8a6b4f', 'stroke-width': 2.5 }) +
            poly('116,102 130,116 116,130 102,116', { fill: 'none', stroke: t.suitGold, 'stroke-width': 2.5 }) +
            sparkle(116, 116, 7, '#ffe3a3') +
            path('M 102 116 L 96 110', { stroke: t.suitGold, 'stroke-width': 1.5 }),
            {}
        ),
    10: (t) => // Wheel of Fortune — วงล้อ + สฟิงซ์ + สัตว์สี่มุม
        g(
            circle(80, 88, 46, { fill: 'none', stroke: t.suitGold, 'stroke-width': 6 }) +
            circle(80, 88, 34, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            circle(80, 88, 10, { fill: t.suitGold }) +
            [0, 45, 90, 135].map(a => g(
                line(0, -10, 0, -34, { stroke: t.suitGold, 'stroke-width': 2 }),
                { transform: `translate(80 88) rotate(${a})` }
            ) + g(
                line(0, -10, 0, -34, { stroke: t.suitGold, 'stroke-width': 2 }),
                { transform: `translate(80 88) rotate(${a + 22.5})` }
            )).join('') +
            poly('72,40 88,40 88,30 72,30', { fill: t.suits.wands }) + face(80, 30, 5, t.suitGold, { eyeColor: t.bg[1], smile: false }) +
            circle(26, 24, 8, { fill: t.suits.cups }) + g(path('M -12 -2 Q 0 -12, 12 -2 L 8 6 Q 0 0, -8 6 Z', { fill: '#f2ead8' }), { transform: 'translate(26 18)' }) +
            circle(134, 24, 8, { fill: t.suits.swords }) + g(path('M -8 2 Q 0 -8, 8 2 L 6 8 Q 0 2, -6 8 Z', { fill: '#f2ead8' }), { transform: 'translate(134 18)' }) +
            circle(26, 152, 8, { fill: t.suits.pentacles }) + poly('20,146 32,146 26,138', { fill: '#f2ead8' }) +
            circle(134, 152, 8, { fill: t.suits.wands }) + ell(134, 158, 6, 3, { fill: '#f2ead8' }),
            {}
        ),
    11: (t) => // Justice — ตาชั่ง + ดาบ + มงกุฎ
        g(
            rrect(30, 24, 14, 120, 5, { fill: t.suits.swords, opacity: 0.6 }) +
            rrect(116, 24, 14, 120, 5, { fill: t.suits.swords, opacity: 0.6 }) +
            poly('70,26 90,26 80,14', { fill: t.suitGold }) +
            face(80, 52, 12, SKIN) +
            path('M 80 66 C 66 70, 62 92, 64 116 L 96 116 C 98 92, 94 70, 80 66 Z', { fill: '#b03a3a' }) +
            line(50, 56, 110, 56, { stroke: t.suitGold, 'stroke-width': 2.5 }) +
            line(50, 56, 50, 96, { stroke: t.suitGold, 'stroke-width': 2 }) +
            path('M 38 96 Q 50 106, 62 96', { fill: 'none', stroke: t.suitGold, 'stroke-width': 2.5 }) +
            g(SUIT_ICONS.swords(t), { transform: 'translate(112 76) scale(0.85)' }),
            {}
        ),
    12: (t) => // Hanged Man — ชายห้อยหัว รัศมีรอบหน้า
        g(
            path('M 20 22 Q 80 10, 140 22', { stroke: '#8a6b4f', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }) +
            circle(30, 22, 9, { fill: t.suits.pentacles, opacity: 0.85 }) + circle(130, 22, 9, { fill: t.suits.pentacles, opacity: 0.85 }) +
            line(80, 28, 80, 52, { stroke: '#d9a066', 'stroke-width': 2.5 }) +
            line(80, 128, 80, 146, { stroke: '#8a6b4f', 'stroke-width': 4.5, 'stroke-linecap': 'round' }) +
            path('M 80 146 L 100 136', { stroke: '#8a6b4f', 'stroke-width': 4.5, 'stroke-linecap': 'round' }) +
            path('M 80 60 C 66 64, 62 90, 64 118 L 96 118 C 98 90, 94 64, 80 60 Z', { fill: t.suits.cups }) +
            circle(80, 132, 13, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2.5 }) +
            face(80, 132, 9, SKIN) +
            line(64, 74, 50, 92, { stroke: SKIN, 'stroke-width': 4.5, 'stroke-linecap': 'round' }) +
            line(96, 74, 110, 92, { stroke: SKIN, 'stroke-width': 4.5, 'stroke-linecap': 'round' }),
            {}
        ),
    13: (t) => // Death — กุหลาบขาว ม้าขาว อาทิตย์ขึ้นระหว่างหอคอย
        g(
            rrect(18, 44, 16, 66, 3, { fill: t.suits.swords, opacity: 0.7 }) +
            rrect(126, 44, 16, 66, 3, { fill: t.suits.swords, opacity: 0.7 }) +
            circle(80, 66, 16, { fill: '#f6d98a', opacity: 0.9 }) + sunburst(80, 66, 26, t.suitGold, 12, 1.5) +
            rrect(34, 86, 92, 26, 8, { fill: '#f2ead8' }) +
            rrect(34, 86, 92, 26, 8, { fill: 'none', stroke: t.bg[1], 'stroke-width': 1.2 }) +
            poly('30,86 42,78 54,86', { fill: '#f2ead8' }) + poly('106,86 118,78 130,86', { fill: '#f2ead8' }) +
            line(44, 112, 44, 132, { stroke: '#e0d8c8', 'stroke-width': 4 }) + line(116, 112, 116, 132, { stroke: '#e0d8c8', 'stroke-width': 4 }) +
            ell(88, 100, 9, 8, { fill: '#e8e0d0' }) + circle(102, 94, 6, { fill: '#3b2a20' }) +
            path('M 84 122 Q 92 128, 100 124', { stroke: '#3b2a20', 'stroke-width': 2.5, fill: 'none' }) +
            [0, 1, 2, 3, 4].map(i => ell(80 - 12 + i * 6, 138 - (i % 2) * 5, 5.5, 9, { fill: '#f5f0e6', stroke: '#d8cfc0', 'stroke-width': 1 })).join('') +
            circle(80, 134, 5, { fill: t.suitGold }),
            {}
        ),
    14: (t) => // Temperance — เทวดาเทน้ำระหว่างถ้วย + บ่อน้ำ
        g(
            circle(80, 34, 10, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            path('M 52 40 Q 38 52, 44 66 Q 50 52, 58 46 Z', { fill: '#f2ead8' }) +
            path('M 108 40 Q 122 52, 116 66 Q 110 52, 102 46 Z', { fill: '#f2ead8' }) +
            face(80, 54, 12, SKIN) +
            path('M 80 68 C 66 72, 62 94, 64 114 L 96 114 C 98 94, 94 72, 80 68 Z', { fill: t.suitGold }) +
            poly('76,82 84,82 84,90 76,90', { fill: 'none', stroke: t.bg[1], 'stroke-width': 1.5 }) +
            g(SUIT_ICONS.cups(t), { transform: 'translate(52 92) scale(0.75)' }) +
            g(SUIT_ICONS.cups(t), { transform: 'translate(108 88) scale(0.75)' }) +
            path('M 56 96 Q 80 84, 104 92', { stroke: t.suits.cups, 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }) +
            ell(80, 140, 42, 9, { fill: t.suits.cups, opacity: 0.4 }) +
            ell(80, 140, 24, 5, { fill: t.suits.cups, opacity: 0.5 }),
            {}
        ),
    15: (t) => // The Devil — หัวเขา + ปีกค้างคาว + โซ่หลวม
        g(
            rrect(48, 118, 64, 14, 4, { fill: t.suits.swords, opacity: 0.7 }) +
            face(80, 58, 16, '#6b4a8a') +
            path('M 66 48 C 56 36, 62 30, 70 38', { stroke: '#4a3060', 'stroke-width': 4, fill: 'none' }) +
            path('M 94 48 C 104 36, 98 30, 90 38', { stroke: '#4a3060', 'stroke-width': 4, fill: 'none' }) +
            path('M 60 60 Q 44 66, 46 82 Q 56 74, 62 72 Z', { fill: '#3b2a52' }) +
            path('M 100 60 Q 116 66, 114 82 Q 104 74, 98 72 Z', { fill: '#3b2a52' }) +
            path('M 74 66 Q 80 70, 86 66', { stroke: '#f2d48a', 'stroke-width': 2, fill: 'none' }) +
            face(52, 138, 8, SKIN) + face(108, 138, 8, SKIN) +
            path('M 62 132 Q 80 142, 98 132', { stroke: t.suitGold, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4 3' }),
            {}
        ),
    16: (t) => // The Tower — หอคอยถูกฟ้าผ่า
        g(
            poly('70,20 90,20 90,30 82,30 82,26 78,26 78,30 70,30', { fill: t.suitGold, transform: 'rotate(-14 80 30)' }) +
            poly('58,40 102,40 102,34 58,34', { fill: t.suits.swords, opacity: 0.8 }) +
            rrect(62, 40, 36, 108, 3, { fill: t.suits.swords }) +
            poly('132,14 126,34 138,30', { fill: '#f6d98a' }) +
            poly('129,26 70,52 74,60 133,34', { fill: '#ffe27a', opacity: 0.95 }) +
            flame(74, 70, 7, { fill: '#f08c3a' }) + flame(88, 102, 7, { fill: '#f08c3a' }) +
            circle(30, 76, 6, { fill: SKIN }) + line(24, 84, 36, 90, { stroke: SKIN, 'stroke-width': 3 }) + line(36, 84, 24, 90, { stroke: SKIN, 'stroke-width': 3 }) +
            circle(132, 96, 6, { fill: SKIN }) + line(126, 104, 138, 110, { stroke: SKIN, 'stroke-width': 3 }) + line(138, 104, 126, 110, { stroke: SKIN, 'stroke-width': 3 }) +
            sparkle(38, 130, 5, t.sparkle) + sparkle(124, 140, 5, t.sparkle),
            {}
        ),
    17: (t) => // The Star — ดาวใหญ่ 8 แฉก + ดาวเล็ก 7 + เทน้ำสองขวด
        g(
            star(80, 28, 16, 6.5, 8, -90, { fill: t.suitGold }) +
            [[36, 22], [56, 12], [104, 12], [124, 22], [30, 48], [130, 48], [80, 8]].map(p => star(p[0], p[1], 4.5, 1.8, 5, -90, { fill: t.sparkle, opacity: 0.9 })).join('') +
            face(66, 84, 10, SKIN) +
            path('M 66 70 Q 54 74, 58 88', { stroke: '#2a5f6e', 'stroke-width': 5, fill: 'none' }) +
            path('M 66 70 Q 78 74, 74 88', { stroke: '#2a5f6e', 'stroke-width': 5, fill: 'none' }) +
            path('M 66 96 C 56 100, 54 118, 56 134 L 76 134 C 78 118, 76 100, 66 96 Z', { fill: '#2a5f6e' }) +
            line(52, 100, 40, 116, { stroke: SKIN, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            g(SUIT_ICONS.cups(t), { transform: 'translate(38 120) scale(0.55)' }) +
            path('M 42 116 Q 34 130, 30 142', { stroke: t.suits.cups, 'stroke-width': 2, fill: 'none', opacity: 0.7 }) +
            line(80, 100, 96, 112, { stroke: SKIN, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            g(SUIT_ICONS.cups(t), { transform: 'translate(104 110) scale(0.55)' }) +
            ell(104, 146, 38, 8, { fill: t.suits.cups, opacity: 0.4 }) +
            ell(104, 146, 20, 4, { fill: t.suits.cups, opacity: 0.5 }),
            {}
        ),
    18: (t) => // The Moon — จันทร์หน้ายิ้ม หอคอยสอง หมา+หมาป่า กุ้ง
        g(
            crescent(80, 30, 18, '#f2e9c8') +
            circle(76, 26, 1.6, { fill: t.bg[1] }) + circle(70, 32, 1.6, { fill: t.bg[1] }) +
            path('M 70 36 Q 76 40, 82 36', { stroke: t.bg[1], 'stroke-width': 1.5, fill: 'none' }) +
            star(30, 18, 4, 1.6, 5, -90, { fill: t.sparkle }) + star(130, 20, 4, 1.6, 5, -90, { fill: t.sparkle }) +
            rrect(16, 78, 16, 56, 3, { fill: t.suits.swords, opacity: 0.7 }) +
            rrect(128, 78, 16, 56, 3, { fill: t.suits.swords, opacity: 0.7 }) +
            path('M 10 140 Q 80 122, 150 140 L 150 165 L 10 165 Z', { fill: t.suits.pentacles, opacity: 0.6 }) +
            ell(46, 136, 12, 7, { fill: '#d9a066' }) + circle(58, 128, 6, { fill: '#d9a066' }) +
            poly('56,124 58,118 60,124', { fill: '#d9a066' }) +
            ell(114, 136, 12, 7, { fill: '#8d8d99' }) + circle(102, 128, 6, { fill: '#8d8d99' }) +
            poly('100,124 102,118 104,124', { fill: '#8d8d99' }) +
            ell(80, 152, 13, 6, { fill: '#d95f4e' }) +
            poly('64,150 58,142 68,146', { fill: '#d95f4e' }) + poly('96,150 102,142 92,146', { fill: '#d95f4e' }) +
            line(74, 158, 74, 163, { stroke: '#d95f4e', 'stroke-width': 1.5 }) + line(80, 158, 80, 164, { stroke: '#d95f4e', 'stroke-width': 1.5 }) + line(86, 158, 86, 163, { stroke: '#d95f4e', 'stroke-width': 1.5 }),
            {}
        ),
    19: (t) => // The Sun — ดวงอาทิตย์หน้ายิ้ม ทานตะวัน เด็กบนม้า
        g(
            circle(80, 28, 15, { fill: '#f6c344' }) + sunburst(80, 28, 27, '#f6d98a', 16, 2) +
            circle(75, 26, 1.8, { fill: '#3b2a20' }) + circle(85, 26, 1.8, { fill: '#3b2a20' }) +
            path('M 74 32 Q 80 36, 86 32', { stroke: '#3b2a20', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }) +
            ell(80, 92, 30, 16, { fill: '#f2ead8' }) +
            circle(112, 82, 10, { fill: '#f2ead8' }) + poly('118,78 128,70 122,82', { fill: '#e0d8c8' }) +
            path('M 56 96 Q 44 100, 46 112', { stroke: '#e0d8c8', 'stroke-width': 4, fill: 'none' }) +
            line(62, 108, 62, 126, { stroke: '#e0d8c8', 'stroke-width': 4 }) + line(74, 108, 74, 126, { stroke: '#e0d8c8', 'stroke-width': 4 }) +
            line(88, 108, 88, 126, { stroke: '#e0d8c8', 'stroke-width': 4 }) + line(100, 108, 100, 126, { stroke: '#e0d8c8', 'stroke-width': 4 }) +
            face(70, 68, 8, SKIN, { blush: true }) +
            path('M 62 62 C 64 56, 78 56, 80 62', { stroke: HAIR, 'stroke-width': 3, fill: 'none' }) +
            path('M 70 78 L 70 88 L 80 88', { stroke: t.ribbon || '#c0392b', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }) +
            [20, 60, 100, 140].map(x => {
                const petals = [0, 1, 2, 3, 4, 5].map(i => {
                    const a = i * 60;
                    return g(ell(0, -8, 3.4, 6.5, { fill: '#f1c40f' }), { transform: `rotate(${a})` });
                }).join('') + circle(0, 0, 4, { fill: '#8a5a2e' }) + line(0, 4, 0, 18, { stroke: '#4a7c3a', 'stroke-width': 2.5 });
                return g(petals, { transform: `translate(${x} 146)` });
            }).join(''),
            {}
        ),
    20: (t) => // Judgement — เทวดาแตรวาที คนตายฟื้น
        g(
            path('M 10 40 Q 80 4, 150 40 L 150 52 Q 80 24, 10 52 Z', { fill: '#f2ead8', opacity: 0.85 }) +
            circle(70, 52, 11, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            face(70, 56, 9, SKIN) +
            path('M 60 48 Q 48 40, 52 32 Q 60 36, 62 44 Z', { fill: '#f2ead8' }) +
            path('M 80 48 Q 92 40, 88 32 Q 80 36, 78 44 Z', { fill: '#f2ead8' }) +
            poly('84,58 116,50 118,58 86,66', { fill: t.suitGold }) +
            rrect(114, 42, 16, 22, 3, { fill: '#f2ead8', opacity: 0.9 }) +
            line(120, 48, 120, 58, { stroke: t.ribbon || '#c0392b', 'stroke-width': 2 }) + line(116, 53, 124, 53, { stroke: t.ribbon || '#c0392b', 'stroke-width': 2 }) +
            [[36, 108], [80, 104], [124, 108]].map(p => g(
                face(0, 0, 8, SKIN, { blush: true }) +
                line(-8, -8, -14, -18, { stroke: SKIN, 'stroke-width': 3, 'stroke-linecap': 'round' }) +
                line(8, -8, 14, -18, { stroke: SKIN, 'stroke-width': 3, 'stroke-linecap': 'round' }) +
                path('M -10 8 C -14 22, -8 34, 0 38 C 8 34, 14 22, 10 8 Z', { fill: t.suits.cups }),
                { transform: `translate(${p[0]} ${p[1]})` }
            )).join('') +
            rrect(20, 140, 120, 12, 4, { fill: t.suits.pentacles, opacity: 0.5 }),
            {}
        ),
    21: (t) => // The World — นางรำในพวงมาลัย + สัตว์สี่มุม
        g(
            ell(80, 84, 52, 66, { fill: 'none', stroke: t.suits.pentacles, 'stroke-width': 9, opacity: 0.85, 'stroke-dasharray': '14 7' }) +
            poly('68,16 92,16 84,28 76,28', { fill: t.ribbon || '#c0392b' }) +
            face(80, 62, 11, SKIN, { blush: true }) +
            path('M 80 74 C 68 78, 66 94, 68 108 C 74 118, 66 128, 58 132 C 50 124, 58 112, 62 104 C 64 88, 70 78, 80 74 Z', { fill: t.suits.cups }) +
            path('M 80 74 C 92 78, 94 92, 90 104 C 96 114, 102 124, 96 134 C 86 134, 82 120, 82 108 C 80 92, 74 78, 80 74 Z', { fill: t.suitGold, opacity: 0.9 }) +
            line(68, 82, 56, 70, { stroke: SKIN, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            line(92, 82, 104, 68, { stroke: SKIN, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            sparkle(56, 58, 5, t.sparkle) + sparkle(104, 56, 5, t.sparkle) +
            circle(22, 22, 7, { fill: t.suits.wands }) + g(path('M -10 -1 Q 0 -9, 10 -1 L 7 5 Q 0 0, -7 5 Z', { fill: '#f2ead8' }), { transform: 'translate(22 16)' }) +
            circle(138, 22, 7, { fill: t.suits.cups }) + poly('132,16 144,16 138,8', { fill: '#f2ead8' }) +
            circle(22, 146, 7, { fill: t.suits.pentacles }) + ell(22, 153, 5, 3, { fill: '#f2ead8' }) +
            circle(138, 146, 7, { fill: t.suits.swords }) + circle(138, 141, 2.4, { fill: 'none', stroke: '#f2ead8', 'stroke-width': 1.2 }),
            {}
        ),
};

/* ---------- ลายพื้นหลังจาง ๆ ตามธีม ---------- */
function bgPattern(t, uid) {
    switch (t.pattern) {
        case 'star':
            return [[30, 90], [200, 130], [60, 300], [185, 260], [215, 70], [25, 210]].map(p => sparkle(p[0], p[1], 5, t.sparkle, 0.35)).join('');
        case 'wave':
            return wave(70, W, t.sparkle, 0.14) + wave(320, W, t.sparkle, 0.12) + wave(150, W, t.sparkle, 0.07);
        case 'ripple':
            return [[120, 40], [120, 58], [120, 76]].map((p, i) => ell(p[0], 330, 60 + i * 22, 8 + i * 3, { fill: 'none', stroke: t.sparkle, 'stroke-width': 1, opacity: 0.25 })).join('') +
                sparkle(30, 80, 4, t.sparkle, 0.3) + sparkle(210, 110, 4, t.sparkle, 0.3);
        case 'batfly':
            return bat(28, 90, 5, t.sparkle) + bat(205, 250, 4, t.sparkle) + bat(35, 300, 5, t.sparkle) + bat(200, 80, 4, t.sparkle);
        case 'snow':
            return [[30, 80], [210, 120], [50, 290], [190, 320], [120, 60], [90, 335]].map((p, i) => snowflake(p[0], p[1], i % 2 ? 5 : 7, t.sparkle)).map(s => g(s, { opacity: 0.35 })).join('');
        case 'heart':
            return [[28, 90], [210, 130], [40, 300], [195, 275], [120, 50]].map(p => heart(p[0], p[1], 9, t.sparkle)).map(s => g(s, { opacity: 0.3 })).join('');
        default:
            return '';
    }
}

/* ---------- ประกอบหน้าไพ่เต็ม ---------- */
let uidCounter = 0;

export function renderFront(card, deckId = 'standard') {
    const t = getTheme(deckId);
    const uid = `tt${++uidCounter}`;

    // ศิลป์กลางการ์ด (พื้นที่ออกแบบ 160×165 วางที่ translate(40,100))
    let art;
    if (card.arcana === 'major') {
        art = (MAJORS[card.number] || MAJORS[0])(t);
    } else if (card.number >= 11) {
        art = courtArt(card.number, card.suit, t);
    } else {
        const spots = PIPS[card.number] || PIPS[1];
        art = spots.map(([x, y, s], i) =>
            g(SUIT_ICONS[card.suit](t), { transform: `translate(${x} ${y}) scale(${s}) rotate(${i % 2 ? 9 : -9})` })
        ).join('');
    }

    // ตัวเลขบนการ์ด
    const numeral = card.arcana === 'major'
        ? toRoman(card.number)
        : (card.number >= 11 ? '✦' : String(card.number));

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.thai_name} (${card.name})">
<defs>
<linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#${uid}bg)"/>
${bgPattern(t, uid)}
<rect x="5" y="5" width="${W - 10}" height="${H - 10}" rx="11" fill="none" stroke="${t.frame}" stroke-width="2"/>
<rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="8" fill="none" stroke="${t.frameSoft}" stroke-width="1"/>
${corners(t.corner, W, H, 17, 26, t.frame)}
${txt(W / 2, 66, numeral, { fill: t.numeral, 'font-size': 24, 'font-family': "'Charm', serif", 'font-weight': 700 })}
${card.arcana === 'major' ? g(path(`M 96 76 Q ${W / 2} 84, 144 76`, { stroke: t.frameSoft, 'stroke-width': 1.2, fill: 'none' }), {}) : ''}
<g transform="translate(40 100)">${art}</g>
${txt(W / 2, 330, card.thai_name, { fill: t.title, 'font-size': 25, 'font-family': "'Charm', 'Noto Sans Thai', serif", 'font-weight': 700 })}
${txt(W / 2, 352, card.name, { fill: t.subtitle, 'font-size': 10.5, 'font-family': "'Noto Sans Thai', sans-serif", 'letter-spacing': '1.2' })}
</svg>`;
}
