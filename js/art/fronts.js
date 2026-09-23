/* ================================================================
   หน้าไพ่ 78 ใบ — Modern Celestial Tarot with Siamese Filigree
   ดีไซน์สไตล์อาร์ตนูโว ซุ้มวิหารสวรรค์ (Cathedral Arch) ลายเส้นทองอร่าม
   ใช้สัญลักษณ์สากลแท้ของไพ่ทาโรต์ ไร้หน้าการ์ตูนอิโมจิ คงความขลัง สง่างาม
   พร้อมลายน้ำแบรนด์ "✦ THAI TAROT · MOON RABBIT ✦" สำหรับแชร์ลงโซเชียล
   ================================================================ */

import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, flame, crescent, bat, snowflake, drop,
    corners, sunburst, wave, toRoman
} from './helpers.js';
import { getTheme } from './themes.js';
import {
    drawFoolFigure, drawMagicianFigure, drawPriestessFigure, drawEmpressFigure,
    drawEmperorFigure, drawHierophantFigure, drawLoversFigures, drawChariotFigure,
    drawStrengthFigure, drawHermitFigure, drawJusticeFigure, drawHangedManFigure,
    drawDeathFigure, drawTemperanceFigure, drawDevilFigure, drawStarFigure,
    drawMoonFigure, drawSunFigure, drawJudgementFigure, drawWorldFigure,
    drawCourtFigure
} from './figures.js';
import { renderMinorScene } from './minor-scenes.js';
import {
    renderDeckBorder,
    renderDeckArch,
    renderDeckNumeralBadge,
    renderDeckCartouche
} from './borders.js';

const W = 240, H = 380;
const CX = W / 2;

/** ภาพวาด Masterpiece ลายเส้นอาร์ตนูโวคลาสสิกที่ผ่านการอนุมัติครบ 22 Major Arcana + 4 Aces */
export const APPROVED_CARD_ASSETS = {
    'major-0': 'assets/cards/standard/major-0.jpg',
    'major-1': 'assets/cards/standard/major-1.jpg',
    'major-2': 'assets/cards/standard/major-2.jpg',
    'major-3': 'assets/cards/standard/major-3.jpg',
    'major-4': 'assets/cards/standard/major-4.jpg',
    'major-5': 'assets/cards/standard/major-5.jpg',
    'major-6': 'assets/cards/standard/major-6.jpg',
    'major-7': 'assets/cards/standard/major-7.jpg',
    'major-8': 'assets/cards/standard/major-8.jpg',
    'major-9': 'assets/cards/standard/major-9.jpg',
    'major-10': 'assets/cards/standard/major-10.jpg',
    'major-11': 'assets/cards/standard/major-11.jpg',
    'major-12': 'assets/cards/standard/major-12.jpg',
    'major-13': 'assets/cards/standard/major-13.jpg',
    'major-14': 'assets/cards/standard/major-14.jpg',
    'major-15': 'assets/cards/standard/major-15.jpg',
    'major-16': 'assets/cards/standard/major-16.jpg',
    'major-17': 'assets/cards/standard/major-17.jpg',
    'major-18': 'assets/cards/standard/major-18.jpg',
    'major-19': 'assets/cards/standard/major-19.jpg',
    'major-20': 'assets/cards/standard/major-20.jpg',
    'major-21': 'assets/cards/standard/major-21.jpg',
    'wands-1': 'assets/cards/standard/wands-1.jpg',
    'wands-2': 'assets/cards/standard/wands-2.jpg',
    'wands-3': 'assets/cards/standard/wands-3.jpg',
    'wands-4': 'assets/cards/standard/wands-4.jpg',
    'wands-5': 'assets/cards/standard/wands-5.jpg',
    'wands-6': 'assets/cards/standard/wands-6.jpg',
    'wands-7': 'assets/cards/standard/wands-7.jpg',
    'wands-8': 'assets/cards/standard/wands-8.jpg',
    'wands-9': 'assets/cards/standard/wands-9.jpg',
    'wands-10': 'assets/cards/standard/wands-10.jpg',
    'wands-11': 'assets/cards/standard/wands-11.jpg',
    'wands-12': 'assets/cards/standard/wands-12.jpg',
    'wands-13': 'assets/cards/standard/wands-13.jpg',
    'wands-14': 'assets/cards/standard/wands-14.jpg',
    'cups-1': 'assets/cards/standard/cups-1.jpg',
    'cups-2': 'assets/cards/standard/cups-2.jpg',
    'cups-3': 'assets/cards/standard/cups-3.jpg',
    'cups-4': 'assets/cards/standard/cups-4.jpg',
    'cups-5': 'assets/cards/standard/cups-5.jpg',
    'cups-6': 'assets/cards/standard/cups-6.jpg',
    'cups-7': 'assets/cards/standard/cups-7.jpg',
    'cups-8': 'assets/cards/standard/cups-8.jpg',
    'cups-9': 'assets/cards/standard/cups-9.jpg',
    'cups-10': 'assets/cards/standard/cups-10.jpg',
    'cups-11': 'assets/cards/standard/cups-11.jpg',
    'cups-12': 'assets/cards/standard/cups-12.jpg',
    'cups-13': 'assets/cards/standard/cups-13.jpg',
    'cups-14': 'assets/cards/standard/cups-14.jpg',
    'swords-1': 'assets/cards/standard/swords-1.jpg',
    'swords-2': 'assets/cards/standard/swords-2.jpg',
    'swords-3': 'assets/cards/standard/swords-3.jpg',
    'swords-4': 'assets/cards/standard/swords-4.jpg',
    'swords-5': 'assets/cards/standard/swords-5.jpg',
    'swords-6': 'assets/cards/standard/swords-6.jpg',
    'swords-7': 'assets/cards/standard/swords-7.jpg',
    'swords-8': 'assets/cards/standard/swords-8.jpg',
    'swords-9': 'assets/cards/standard/swords-9.jpg',
    'pentacles-1': 'assets/cards/standard/pentacles-1.jpg',
};

/* ---------- ไอคอน 4 ธาตุประจำชุดไพ่ (Suit Relics) ---------- */

/** ไม้เท้าแห่งแสงและเปลวเพลิงศักดิ์สิทธิ์ (Wands - Fire) */
function wandIcon(t) {
    const gold = t.suitGold, fire = t.suits.wands;
    return g(
        // ก้านไม้เท้าทองคำพร้อมตาใบผลิ
        line(0, 18, 0, -10, { stroke: gold, 'stroke-width': 4, 'stroke-linecap': 'round' }) +
        circle(0, 18, 2.5, { fill: gold }) +
        path('M 0 5 Q -6 0, -3 -6 Q 0 -1, 0 5 Z', { fill: '#6ab04c' }) +
        path('M 0 -2 Q 6 -7, 3 -13 Q 0 -8, 0 -2 Z', { fill: '#6ab04c' }) +
        // หัวไม้เท้าดอกบัวตูมเปล่งเปลวไฟ
        circle(0, -10, 4.5, { fill: gold }) +
        path('M 0 -25 C 8 -30, 9 -20, 3 -17 C 8 -16, 5 -10, 0 -14 C -5 -10, -8 -16, -3 -17 C -9 -20, -8 -30, 0 -25 Z', { fill: fire }) +
        circle(0, -19, 2.2, { fill: '#ffffff' }) +
        sparkle(0, -28, 5, '#ffffff', 0.95),
        {}
    );
}

/** ถ้วยทองคำศักดิ์สิทธิ์บรรจุน้ำทิพย์ (Cups - Water) */
function cupIcon(t) {
    const gold = t.suitGold, water = t.suits.cups;
    return g(
        // ลำตัวถ้วยทรงบงกช
        path('M -13 -12 L 13 -12 C 13 2, 7 9, 0 10 C -7 9, -13 2, -13 -12 Z', { fill: gold }) +
        ell(0, -12, 13, 3.2, { fill: water }) +
        // หูถ้วยปีกหงส์
        path('M -13 -8 C -18 -4, -18 3, -11 6', { stroke: gold, 'stroke-width': 2.2, fill: 'none' }) +
        path('M 13 -8 C 18 -4, 18 3, 11 6', { stroke: gold, 'stroke-width': 2.2, fill: 'none' }) +
        // ก้านและฐาน
        line(0, 10, 0, 18, { stroke: gold, 'stroke-width': 4.5 }) +
        ell(0, 19, 10, 3.2, { fill: gold }) +
        circle(0, -1, 2.8, { fill: '#ffffff', opacity: 0.8 }) +
        sparkle(0, -16, 3.5, '#ffffff', 0.9),
        {}
    );
}

/** ดาบเหล็กกล้าแห่งปัญญาและความจริง (Swords - Air) */
function swordIcon(t) {
    const steel = t.suits.swords, gold = t.suitGold;
    return g(
        // ใบมีดคมสองด้าน
        poly('0,-28 5,-8 4,11 -4,11 -5,-8', { fill: steel }) +
        line(0, -25, 0, 11, { stroke: '#ffffff', 'stroke-width': 1.2, opacity: 0.9 }) +
        // โกร่งดาบปีกทอง
        path('M -12 11 Q 0 8, 12 11 L 10 14 Q 0 12, -10 14 Z', { fill: gold }) +
        // ด้ามจับและหัวด้าม
        line(0, 12, 0, 22, { stroke: '#4a2810', 'stroke-width': 3.8 }) +
        circle(0, 24, 3.8, { fill: gold }) +
        sparkle(0, -28, 4.5, '#ffffff', 0.95),
        {}
    );
}

/** เหรียญตราทองคำประทับดาวห้าแฉก (Pentacles - Earth) */
function coinIcon(t) {
    const gold = t.suitGold, green = t.suits.pentacles;
    return g(
        circle(0, 0, 15, { fill: gold }) +
        circle(0, 0, 12.2, { fill: 'none', stroke: 'rgba(25,12,35,0.7)', 'stroke-width': 1.4 }) +
        // ดาว 5 แฉกแห่งธาตุทั้ง 5
        star(0, 0, 9.8, 3.8, 5, -90, { fill: 'none', stroke: 'rgba(25,12,35,0.85)', 'stroke-width': 1.6 }) +
        circle(0, 0, 2.6, { fill: green }) +
        sparkle(0, 0, 3, '#ffffff', 0.8),
        {}
    );
}

const SUIT_ICONS = { wands: wandIcon, cups: cupIcon, swords: swordIcon, pentacles: coinIcon };

/* ---------- ผังจัดวางตำแหน่งไพ่แต้ม 1–10 (Pips 1-10) ---------- */
const PIPS = {
    1: [[CX, 175, 1.85, 0]],
    2: [[CX, 130, 1.2, 0], [CX, 220, 1.2, 180]],
    3: [[CX, 120, 1.1, 0], [CX - 40, 215, 1.1, -15], [CX + 40, 215, 1.1, 15]],
    4: [[CX - 42, 130, 1.1, 0], [CX + 42, 130, 1.1, 0], [CX - 42, 220, 1.1, 0], [CX + 42, 220, 1.1, 0]],
    5: [[CX - 42, 120, 1, 0], [CX + 42, 120, 1, 0], [CX, 175, 1.25, 0], [CX - 42, 230, 1, 0], [CX + 42, 230, 1, 0]],
    6: [[CX - 42, 120, 0.95, 0], [CX + 42, 120, 0.95, 0], [CX - 42, 175, 0.95, 0], [CX + 42, 175, 0.95, 0], [CX - 42, 230, 0.95, 0], [CX + 42, 230, 0.95, 0]],
    7: [[CX, 110, 0.95, 0], [CX - 42, 148, 0.9, 0], [CX + 42, 148, 0.9, 0], [CX, 180, 0.95, 0], [CX - 42, 215, 0.9, 0], [CX + 42, 215, 0.9, 0], [CX, 245, 0.9, 0]],
    8: [[CX - 42, 115, 0.88, 0], [CX + 42, 115, 0.88, 0], [CX - 42, 155, 0.88, 0], [CX + 42, 155, 0.88, 0], [CX - 42, 195, 0.88, 0], [CX + 42, 195, 0.88, 0], [CX - 42, 235, 0.88, 0], [CX + 42, 235, 0.88, 0]],
    9: [[CX - 44, 115, 0.85, 0], [CX, 115, 0.85, 0], [CX + 44, 115, 0.85, 0], [CX - 44, 175, 0.85, 0], [CX, 175, 0.95, 0], [CX + 44, 175, 0.85, 0], [CX - 44, 235, 0.85, 0], [CX, 235, 0.85, 0], [CX + 44, 235, 0.85, 0]],
    10: [[CX, 108, 0.8, 0], [CX - 44, 138, 0.8, 0], [CX + 44, 138, 0.8, 0], [CX - 22, 172, 0.8, 0], [CX + 22, 172, 0.8, 0], [CX, 204, 0.8, 0], [CX - 44, 204, 0.8, 0], [CX + 44, 204, 0.8, 0], [CX - 25, 240, 0.8, 0], [CX + 25, 240, 0.8, 0]],
};

/* ---------- ไพ่บุคคล (Court Cards: Page, Knight, Queen, King) ---------- */
function courtArt(kind, suit, t, deckId = 'standard') {
    const gold = t.suitGold;
    const cy = 175;
    const suitCol = t.suits[suit] || gold;

    // ฉากพื้นหลังเฉพาะบุคคล
    let courtBackdrop = '';
    if (kind === 11) {
        // Page: ลานระเบียงชมวิวทิวทัศน์
        courtBackdrop = (
            path('M 32 235 Q 120 220, 208 235 L 208 284 L 32 284 Z', { fill: '#334155', opacity: 0.35 }) +
            line(32, 235, 208, 235, { stroke: gold, 'stroke-width': 1.5 })
        );
    } else if (kind === 12) {
        // Knight: ธงศึกโบกสะบัดและเส้นสปีดเคลื่อนที่รวดเร็ว
        courtBackdrop = (
            path(`M ${CX - 15} 120 L ${CX + 52} 105 L ${CX + 35} 130 L ${CX + 52} 145 L ${CX - 15} 135 Z`, { fill: suitCol, opacity: 0.85 }) +
            line(CX - 15, 95, CX - 15, 210, { stroke: gold, 'stroke-width': 2 }) +
            circle(CX - 15, 95, 3.5, { fill: gold })
        );
    } else if (kind === 13) {
        // Queen: พนักพิงบัลลังก์ศิลาสลักลวดลายวิจิตร
        courtBackdrop = (
            rect(CX - 38, 125, 76, 120, { fill: '#1e293b', stroke: gold, 'stroke-width': 2, rx: 8 }) +
            path(`M ${CX - 38} 125 Q ${CX} 102, ${CX + 38} 125`, { stroke: gold, 'stroke-width': 2.5, fill: 'none' }) +
            circle(CX, 114, 4, { fill: gold }) +
            rect(CX - 45, 240, 90, 15, { fill: '#0f172a', stroke: gold, 'stroke-width': 1.2 })
        );
    } else if (kind === 14) {
        // King: บัลลังก์จักรพรรดิและเสาราชสำนักทองคำคู่
        courtBackdrop = (
            rect(CX - 42, 115, 84, 130, { fill: '#0f172a', stroke: gold, 'stroke-width': 2.2, rx: 6 }) +
            path(`M ${CX - 42} 115 L ${CX} 92 L ${CX + 42} 115 Z`, { fill: suitCol, stroke: gold, 'stroke-width': 1.5 }) +
            star(CX, 102, 5, 2.5, 5, -90, { fill: gold }) +
            rect(CX - 48, 242, 96, 16, { fill: '#334155', stroke: gold, 'stroke-width': 1.5 })
        );
    }

    return g(
        // รัศมีฉากหลัง
        circle(CX, cy, 64, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1 }) +
        courtBackdrop +
        // ซุ้มเสาค้ำราชสำนัก
        line(CX - 58, cy - 50, CX - 58, cy + 65, { stroke: gold, 'stroke-width': 2, opacity: 0.6 }) +
        line(CX + 58, cy - 50, CX + 58, cy + 65, { stroke: gold, 'stroke-width': 2, opacity: 0.6 }) +
        // ตัวละครราชสำนักแท้ตามเทศกาล
        drawCourtFigure(kind, suit, deckId, t) +
        // สัญลักษณ์ธาตุประจำสำรับที่ถือ/สถิต
        g(SUIT_ICONS[suit](t), { transform: `translate(${CX + 38} ${cy + 42}) scale(0.9)` }) +
        sparkle(CX - 40, cy - 40, 4, t.sparkle, 0.8) +
        sparkle(CX + 40, cy - 40, 4, t.sparkle, 0.8),
        {}
    );
}

function lotusRing(cx, cy, r, petalLen, petalW, color, count = 8, opacity = 0.8) {
    let out = '';
    for (let i = 0; i < count; i++) {
        const deg = (i * 360) / count;
        out += g(
            path(
                `M 0 0 C ${-petalW} ${-petalLen * 0.4}, ${-petalW * 0.7} ${-petalLen * 0.85}, 0 ${-petalLen} ` +
                `C ${petalW * 0.7} ${-petalLen * 0.85}, ${petalW} ${-petalLen * 0.4}, 0 0 Z`,
                { fill: color, opacity }
            ),
            { transform: `translate(${cx} ${cy}) rotate(${deg}) translate(0 ${-r})` }
        );
    }
    return out;
}

/* ================================================================
   Major Arcana 22 ใบ (0 ถึง XXI)
   สัญลักษณ์แท้ระดับสากล ไม่ใช้การ์ตูนอีโมจิ
   ================================================================ */
const MAJORS = {
    0: (t, deckId = 'standard') => { // The Fool: หน้าผาสีทอง + ตะวันรุ่งโรจน์ + สุนัขเทพสีขาว + ถุงไม้เท้านักเดินทาง
        return g(
            // ดวงอาทิตย์สีทองมุมบน
            circle(60, 105, 20, { fill: t.suitGold, opacity: 0.9 }) +
            sunburst(60, 105, 36, t.frameSoft, 12, 1.5) +
            // เทือกเขาไกล
            poly('35,210 85,155 135,210', { fill: 'rgba(255,255,255,0.08)' }) +
            poly('105,210 155,165 205,210', { fill: 'rgba(255,255,255,0.05)' }) +
            // หน้าผาสูงชัน
            path('M 125 185 L 205 185 L 205 255 L 95 255 Q 115 220, 125 185 Z', { fill: '#7f5539' }) +
            path('M 125 185 L 205 185 L 205 195 L 118 195 Z', { fill: t.suitGold, opacity: 0.8 }) +
            // นักเดินทางตามเทศกาล
            drawFoolFigure(deckId, t),
            {}
        );
    },

    1: (t, deckId = 'standard') => { // The Magician: อนันต์ (Infinity) + แท่นบูชา 4 ธาตุ + ไม้กายสิทธิ์ชี้ฟ้าดิน
        return g(
            // สัญลักษณ์ Infinity เหนือเศียร
            path('M 100 102 C 100 92, 112 92, 120 102 C 128 92, 140 92, 140 102 C 140 112, 128 112, 120 102 C 112 112, 100 112, 100 102 Z', { fill: 'none', stroke: t.suitGold, 'stroke-width': 2.6 }) +
            sparkle(120, 102, 4, '#ffffff', 0.9) +
            // ผู้วิเศษตามเทศกาล
            drawMagicianFigure(deckId, t) +
            // แท่นบูชาหินศักดิ์สิทธิ์
            rrect(60, 195, 120, 45, 4, { fill: 'rgba(25,12,38,0.85)', stroke: t.frame, 'stroke-width': 1.4 }) +
            line(50, 195, 190, 195, { stroke: t.suitGold, 'stroke-width': 3 }) +
            // 4 ธาตุศักดิ์สิทธิ์บนแท่นบูชา: ไม้เท้า, ถ้วย, ดาบ, เหรียญ
            g(wandIcon(t), { transform: 'translate(78 180) scale(0.6)' }) +
            g(cupIcon(t), { transform: 'translate(106 182) scale(0.65)' }) +
            g(swordIcon(t), { transform: 'translate(134 180) scale(0.6)' }) +
            g(coinIcon(t), { transform: 'translate(162 184) scale(0.65)' }),
            {}
        );
    },

    2: (t, deckId = 'standard') => { // The High Priestess: เสาคู่ B & J + ม่านผลทับทิม + มงกุฎดวงจันทร์ฮาธอร์ + ม้วนคัมภีร์ TORA
        return g(
            // เสาดำ B (Boaz) ด้านซ้าย
            rect(42, 95, 20, 150, { fill: '#1a1a1a', stroke: t.frameSoft, 'stroke-width': 1 }) +
            txt(52, 175, 'B', { fill: '#ffffff', 'font-size': 14, 'font-family': "'Cinzel', serif", 'font-weight': 700 }) +
            // เสาขาว J (Jachin) ด้านขวา
            rect(178, 95, 20, 150, { fill: '#dfe6e9', stroke: t.frame, 'stroke-width': 1 }) +
            txt(188, 175, 'J', { fill: '#2d3436', 'font-size': 14, 'font-family': "'Cinzel', serif", 'font-weight': 700 }) +
            // ม่านประดับทับทิม
            rect(64, 98, 112, 144, { fill: 'rgba(40,15,55,0.75)' }) +
            [115, 140, 165].map(y => sparkle(CX, y, 4, t.sparkle, 0.7)).join('') +
            // พระแม่นักบวชนั่งสง่าตามเทศกาล
            drawPriestessFigure(deckId, t) +
            // มงกุฎเขาควายและดวงจันทร์เต็มดวง (Hathor Horns & Moon)
            circle(CX, 118, 6.5, { fill: '#ffffff' }) +
            path(`M ${CX - 14} 124 Q ${CX} 130, ${CX + 14} 124 Q ${CX} 120, ${CX - 14} 124 Z`, { fill: t.suitGold }) +
            // เข็มกลัดดวงดาราสวรรค์บนพระอุระ (Celestial Diamond Star Brooch)
            sparkle(CX, 160, 4.5, '#ffffff', 0.95) +
            circle(CX, 160, 2, { fill: t.suitGold }) +
            // ดวงจันทร์เสี้ยวเรืองแสงที่พระบาท
            crescent(CX, 232, 15, t.suitGold) +
            // ม้วนคัมภีร์ TORA ในตัก
            rrect(CX - 16, 178, 32, 12, 3, { fill: '#f8f9fa', stroke: t.frame, 'stroke-width': 1 }) +
            txt(CX, 187, 'TORA', { fill: '#2d3436', 'font-size': 6.5, 'font-family': "'Cinzel', serif", 'font-weight': 700 }),
            {}
        );
    },

    3: (t, deckId = 'standard') => { // The Empress: มงกุฎดวงดาว 12 ดวง + โล่ตราสัญลักษณ์วีนัส + รวงข้าวทองคำ + คทาราชินี
        return g(
            // วงรัศมีดวงดาว 12 ดวง
            [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
                const rad = (a * Math.PI) / 180;
                return sparkle(CX + 32 * Math.cos(rad), 132 + 32 * Math.sin(rad), 3, t.suitGold, 0.85);
            }).join('') +
            // จักรพรรดินีประทับบนบัลลังก์ตามเทศกาล
            drawEmpressFigure(deckId, t) +
            // คทาทองคำในพระหัตถ์
            line(CX + 14, 155, CX + 34, 125, { stroke: t.suitGold, 'stroke-width': 2.5 }) +
            circle(CX + 34, 125, 4.5, { fill: t.suitGold }) +
            // โล่รูปหัวใจสลักตราสัญลักษณ์วีนัส (♀)
            path(`M ${CX - 26} 190 A 10 10 0 0 1 ${CX - 6} 190 A 10 10 0 0 1 ${CX + 14} 190 Q ${CX - 6} 222, ${CX - 6} 222 Q ${CX - 26} 190, ${CX - 26} 190 Z`, { fill: '#d63031', transform: `translate(-10 0)` }) +
            circle(CX - 16, 196, 4, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.2 }) +
            line(CX - 16, 200, CX - 16, 206, { stroke: t.suitGold, 'stroke-width': 1.2 }) +
            line(CX - 19, 203, CX - 13, 203, { stroke: t.suitGold, 'stroke-width': 1.2 }) +
            // ทุ่งรวงข้าวทองคำที่พระบาท
            [CX - 50, CX - 30, CX + 30, CX + 50].map(x =>
                path(`M ${x} 245 Q ${x - 5} 225, ${x} 215 Q ${x + 5} 225, ${x} 245 Z`, { fill: '#f1c40f' })
            ).join(''),
            {}
        );
    },

    4: (t, deckId = 'standard') => { // The Emperor: บัลลังก์หินแกะสลักหัวแกะราศีเมษ + คทา Ankh + ลูกโลกจักรพรรดิ + ขุนเขาสีชาด
        return g(
            // เทือกเขาสีชาดคมแกร่ง
            poly('35,210 90,135 145,210', { fill: '#c0392b', opacity: 0.65 }) +
            poly('100,210 155,145 205,210', { fill: '#962d22', opacity: 0.8 }) +
            // บัลลังก์หินทรงลูกบาศก์
            rect(65, 130, 110, 115, { fill: '#4a4a4a', stroke: t.frame, 'stroke-width': 1.5 }) +
            // หัวแกะราศีเมษสีทอง 2 มุมบนของบัลลังก์
            circle(72, 136, 6, { fill: t.suitGold }) + circle(168, 136, 6, { fill: t.suitGold }) +
            // องค์จักรพรรดิตามเทศกาล
            drawEmperorFigure(deckId, t) +
            // คทา Ankh สัญลักษณ์แห่งชีวิตนิรันดร์
            circle(CX + 24, 160, 4.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            line(CX + 24, 165, CX + 24, 185, { stroke: t.suitGold, 'stroke-width': 2 }) +
            line(CX + 19, 172, CX + 29, 172, { stroke: t.suitGold, 'stroke-width': 2 }) +
            // ลูกโลกจักรพรรดิ (Orb of Sovereignty) ในมือซ้าย
            circle(CX - 24, 178, 6.5, { fill: t.suitGold }) +
            line(CX - 24, 168, CX - 24, 172, { stroke: t.suitGold, 'stroke-width': 1.5 }),
            {}
        );
    },

    5: (t, deckId = 'standard') => { // The Hierophant / The Celestial Sage: เสาแห่งสัจธรรม + คทาดาราศาสตร์วงแหวน + ม้วนคัมภีร์ดาราศาสตร์ + กุญแจทองแห่งปัญญา
        return g(
            // เสาหินแห่งสัจธรรมและความรู้คู่
            rect(46, 95, 16, 145, { fill: '#64748B', opacity: 0.85 }) +
            rect(178, 95, 16, 145, { fill: '#64748B', opacity: 0.85 }) +
            line(46, 100, 62, 100, { stroke: t.suitGold, 'stroke-width': 1.5 }) +
            line(178, 100, 194, 100, { stroke: t.suitGold, 'stroke-width': 1.5 }) +
            // คุรุผู้ชี้นำตามเทศกาล
            drawHierophantFigure(deckId, t) +
            // คทาดาราศาสตร์ลูกโลกวงแหวนในมือซ้าย (Armillary Star Scepter)
            line(CX - 26, 140, CX - 26, 220, { stroke: t.suitGold, 'stroke-width': 2.5 }) +
            circle(CX - 26, 138, 9, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.8 }) +
            ell(CX - 26, 138, 9, 3.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.5, transform: `rotate(35 ${CX - 26} 138)` }) +
            sparkle(CX - 26, 138, 4, '#ffffff', 0.95) +
            // ม้วนคัมภีร์ดาราศาสตร์ในมือขวา
            rect(CX + 14, 154, 15, 20, { fill: '#FFFBEB', stroke: t.suitGold, 'stroke-width': 1.2, rx: 2 }) +
            line(CX + 17, 160, CX + 25, 160, { stroke: '#8A5D0B', 'stroke-width': 1 }) +
            line(CX + 17, 164, CX + 25, 164, { stroke: '#8A5D0B', 'stroke-width': 1 }) +
            line(CX + 17, 168, CX + 22, 168, { stroke: '#8A5D0B', 'stroke-width': 1 }) +
            // กุญแจทองคู่แห่งสัจธรรมและปัญญาที่พื้น
            line(CX - 18, 232, CX + 18, 248, { stroke: t.suitGold, 'stroke-width': 2.2 }) +
            circle(CX - 18, 232, 3.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.8 }) +
            line(CX + 18, 232, CX - 18, 248, { stroke: t.suitGold, 'stroke-width': 2.2 }) +
            circle(CX + 18, 232, 3.5, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.8 }),
            {}
        );
    },

    6: (t, deckId = 'standard') => { // The Lovers: อัครเทวทูตราฟาเอลสยายปีก + สุริยันสีทอง + ต้นไม้แห่งชีวิตและต้นไม้แห่งปัญญา
        return g(
            // พระอาทิตย์ดวงใหญ่และเทวทูตราฟาเอล
            circle(CX, 95, 22, { fill: t.suitGold, opacity: 0.85 }) +
            // ปีกเทวทูตสีม่วงทองสยายกว้าง
            path(`M ${CX} 115 C ${CX - 35} 90, ${CX - 75} 105, ${CX - 65} 140 C ${CX - 40} 145, ${CX - 20} 130, ${CX} 135 Z`, { fill: '#8e44ad', opacity: 0.85 }) +
            path(`M ${CX} 115 C ${CX + 35} 90, ${CX + 75} 105, ${CX + 65} 140 C ${CX + 40} 145, ${CX + 20} 130, ${CX} 135 Z`, { fill: '#8e44ad', opacity: 0.85 }) +
            sparkle(CX, 115, 6, '#ffffff', 0.9) +
            // ต้นไม้แห่งชีวิต (ฝั่งชาย) มีผลเพลิง 12 ผล
            path('M 60 235 L 60 175 Q 40 160, 60 150 Q 80 160, 60 175 Z', { fill: '#27ae60' }) +
            [155, 165, 175].map(y => circle(60, y, 3, { fill: '#e74c3c' })).join('') +
            // ต้นไม้แห่งปัญญา (ฝั่งหญิง) มีงูพันรอบ
            path('M 180 235 L 180 175 Q 160 160, 180 150 Q 200 160, 180 175 Z', { fill: '#2ecc71' }) +
            path('M 176 220 Q 186 200, 176 185', { stroke: t.suitGold, 'stroke-width': 2.2, fill: 'none' }) +
            // คู่รักตามเทศกาล
            drawLoversFigures(deckId, t),
            {}
        );
    },

    7: (t, deckId = 'standard') => { // The Chariot: ม่านดวงดาว + ปีกสุริยะ + สฟิงซ์คู่ทวิลักษณ์ (ขาว-ดำ)
        return g(
            // หลังคาม่านประดับดวงดาวสีฟ้าคราม
            path(`M 45 105 L 195 105 L 185 130 L 55 130 Z`, { fill: '#2980b9' }) +
            [70, 95, 120, 145, 170].map(x => sparkle(x, 118, 3.5, '#ffffff', 0.9)).join('') +
            // รถศึกและนักรบมงกุฎดาวตามเทศกาล
            rect(75, 145, 90, 65, { fill: '#7f8c8d', stroke: t.frame, 'stroke-width': 1.5 }) +
            drawChariotFigure(deckId, t) +
            // ตราปีกสุริยะหน้ารถศึก
            circle(CX, 175, 7, { fill: t.suitGold }) +
            path(`M ${CX - 22} 175 Q ${CX - 12} 170, ${CX - 7} 175 Q ${CX - 12} 180, ${CX - 22} 175 Z`, { fill: t.suitGold }) +
            path(`M ${CX + 22} 175 Q ${CX + 12} 170, ${CX + 7} 175 Q ${CX + 12} 180, ${CX + 22} 175 Z`, { fill: t.suitGold }) +
            // สฟิงซ์ดำ (ด้านซ้าย)
            path('M 60 245 C 55 220, 75 210, 85 225 L 95 245 Z', { fill: '#1e1e1e' }) +
            circle(72, 218, 5, { fill: '#1e1e1e' }) +
            // สฟิงซ์ขาว (ด้านขวา)
            path('M 180 245 C 185 220, 165 210, 155 225 L 145 245 Z', { fill: '#ffffff' }) +
            circle(168, 218, 5, { fill: '#ffffff' }),
            {}
        );
    },

    8: (t, deckId = 'standard') => { // Strength: สัญลักษณ์อนันต์ + หญิงสาวอ่อนโยนลูบคมเขี้ยวสิงโตทองคำ + มาลัยกุหลาบ
        return g(
            // Infinity Symbol
            path('M 100 105 C 100 96, 112 96, 120 105 C 128 96, 140 96, 140 105 C 140 114, 128 114, 120 105 C 112 114, 100 114, 100 105 Z', { fill: 'none', stroke: t.suitGold, 'stroke-width': 2.4 }) +
            // หญิงสาวและสิงโตตามเทศกาล
            drawStrengthFigure(deckId, t),
            {}
        );
    },

    9: (t, deckId = 'standard') => { // The Hermit: ยอดเขาโดดเดี่ยวยามราตรี + ตะเกียงส่องสว่างด้วยดาว 6 แฉก + ไม้เท้าแห่งปัญญา
        return g(
            // ยอดเขาหิมะยามค่ำคืน
            poly('35,255 120,185 205,255', { fill: '#34495e' }) +
            poly('90,205 120,185 150,205', { fill: '#ecf0f1' }) + // หิมะบนยอดเขา
            // ฤๅษีและตะเกียงตามเทศกาล
            drawHermitFigure(deckId, t),
            {}
        );
    },

    10: (t, deckId = 'standard') => { // Wheel of Fortune: กงล้อสวรรค์ 3 ชั้น + สฟิงซ์ดาบทอง + สัตว์เทพประจำ 4 ทิศ
        return g(
            // กงล้อแห่งโชคชะตาแกนกลาง
            circle(CX, 175, 42, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1.5 }) +
            circle(CX, 175, 34, { fill: 'none', stroke: t.frame, 'stroke-width': 2 }) +
            circle(CX, 175, 16, { fill: 'rgba(30,15,45,0.9)', stroke: t.frame, 'stroke-width': 1.5 }) +
            // ซี่กงล้อ 8 ทิศ
            [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
                const rad = (a * Math.PI) / 180;
                return line(CX + 16 * Math.cos(rad), 175 + 16 * Math.sin(rad), CX + 34 * Math.cos(rad), 175 + 34 * Math.sin(rad), { stroke: t.suitGold, 'stroke-width': 1.5 });
            }).join('') +
            // ตัวอักษร T-A-R-O บนกงล้อ
            txt(CX, 152, 'T', { fill: t.suitGold, 'font-size': 9, 'font-family': "'Cinzel', serif" }) +
            txt(CX + 24, 178, 'A', { fill: t.suitGold, 'font-size': 9, 'font-family': "'Cinzel', serif" }) +
            txt(CX, 203, 'R', { fill: t.suitGold, 'font-size': 9, 'font-family': "'Cinzel', serif" }) +
            txt(CX - 24, 178, 'O', { fill: t.suitGold, 'font-size': 9, 'font-family': "'Cinzel', serif" }) +
            // สฟิงซ์ทองคำถือดาบบนยอดกงล้อ
            circle(CX, 120, 8, { fill: t.suitGold }) +
            poly(`${CX - 10},132 ${CX + 10},132 ${CX},122`, { fill: t.suitGold }) +
            line(CX + 8, 125, CX + 22, 112, { stroke: t.suitGold, 'stroke-width': 2 }) +
            // สัตว์เทพประจำ 4 ทิศ (นางฟ้า, นกอินทรี, สิงโต, วัว)
            sparkle(52, 115, 6, t.sparkle) + sparkle(188, 115, 6, t.sparkle) +
            sparkle(52, 235, 6, t.sparkle) + sparkle(188, 235, 6, t.sparkle),
            {}
        );
    },

    11: (t, deckId = 'standard') => { // Justice: ดาบแห่งความจริงสองคม + ตราชูตาชั่งทองคำอันเที่ยงตรง + เสาวิหารคู่
        return g(
            // เสาวิหารคู่
            rect(48, 100, 14, 145, { fill: '#7f8c8d' }) +
            rect(178, 100, 14, 145, { fill: '#7f8c8d' }) +
            // เทพีแห่งความยุติธรรมตามเทศกาล
            drawJusticeFigure(deckId, t),
            {}
        );
    },

    12: (t, deckId = 'standard') => { // The Hanged Man: ต้นไม้มีชีวิตรูปตัว T (Living Cross) + รัศมีปัญญารอบศีรษะ + แขวนขาข้างเดียว
        return g(
            // ต้นไม้ตัว T ที่มีใบไม้เขียวงอกผลิ
            rect(CX - 7, 95, 14, 150, { fill: '#795548' }) +
            rect(CX - 60, 95, 120, 14, { fill: '#795548' }) +
            [CX - 40, CX + 30, CX - 15, CX + 45].map((x, i) =>
                path(`M ${x} 95 Q ${x + 5} 85, ${x + 10} 95 Z`, { fill: '#4caf50' })
            ).join('') +
            // เชือกมัดข้อเท้า
            line(CX, 109, CX, 130, { stroke: '#d7ccc8', 'stroke-width': 3 }) +
            // ร่างกายกลับหัว แขนไพล่หลัง ขาขวาพาดเป็นเลข 4
            line(CX, 130, CX, 175, { stroke: '#2980b9', 'stroke-width': 6, 'stroke-linecap': 'round' }) +
            line(CX, 155, CX + 22, 170, { stroke: '#c0392b', 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            line(CX + 22, 170, CX, 170, { stroke: '#c0392b', 'stroke-width': 4, 'stroke-linecap': 'round' }) +
            // ใบหน้าและรัศมีแสงสีทองอันเปล่งประกายรอบศีรษะ
            drawHangedManFigure(deckId, t),
            {}
        );
    },

    13: (t, deckId = 'standard') => { // Death (Transformation): ธงกุหลาบขาว 5 กลีบ + ตะวันรุ่งโรจน์ระหว่างหอคอยคู่ + สายน้ำแห่งวัฏจักร + อัศวินแห่งการเกิดใหม่
        return g(
            // หอคอยคู่ที่เส้นขอบฟ้า
            rect(65, 150, 16, 60, { fill: '#2c3e50' }) +
            poly('60,150 73,135 86,150', { fill: '#e74c3c' }) +
            rect(159, 150, 16, 60, { fill: '#2c3e50' }) +
            poly('154,150 167,135 180,150', { fill: '#e74c3c' }) +
            // ดวงอาทิตย์สีทองขึ้นตรงกลางระหว่างหอคอย (แสงอรุณหลังความมืดมิด)
            circle(CX, 175, 14, { fill: t.suitGold }) +
            sunburst(CX, 175, 28, t.suitGold, 10, 1.5) +
            // แม่น้ำแห่งการเปลี่ยนแปลง
            wave(225, W - 60, '#3498db', 0.6, 5, 40) +
            wave(240, W - 60, '#2980b9', 0.5, 5, 40) +
            // อัศวินผู้สง่างามแห่งการเกิดใหม่ตามเทศกาล ถือธงกุหลาบขาว 5 กลีบ (Mystic Rose)
            drawDeathFigure(deckId, t),
            {}
        );
    },

    14: (t, deckId = 'standard') => { // Temperance: เทวทูตแสงสุริยะสยายปีก + ถ่ายเทน้ำทิพย์สองถ้วยทอง + หนทางสู่มงกุฎแสง
        return g(
            // หนทางสู่เทือกเขาสีทองและมงกุฎแสง
            poly('105,245 120,225 135,245', { fill: t.suitGold, opacity: 0.4 }) +
            sparkle(120, 218, 4.5, t.suitGold) +
            // เทวทูตแห่งการหลอมรวมตามเทศกาล
            drawTemperanceFigure(deckId, t),
            {}
        );
    },

    15: (t, deckId = 'standard') => { // The Devil: ดาว 5 แฉกกลับหัวบนหน้าผาก + บัลลังก์หินทึบ + โซ่ทองหลวมรอบคอ (พันธนาการลวงตา)
        return g(
            // แท่นบูชาหินทึบ
            rect(75, 185, 90, 60, { fill: '#2d3436', stroke: t.frame, 'stroke-width': 1.2 }) +
            circle(CX, 215, 6, { fill: 'none', stroke: t.suitGold, 'stroke-width': 2 }) +
            // ปีกค้างคาว
            path(`M ${CX} 130 C ${CX - 35} 90, ${CX - 75} 115, ${CX - 65} 160 C ${CX - 40} 155, ${CX - 20} 145, ${CX} 150 Z`, { fill: '#341f97', opacity: 0.85 }) +
            path(`M ${CX} 130 C ${CX + 35} 90, ${CX + 75} 115, ${CX + 65} 160 C ${CX + 40} 155, ${CX + 20} 145, ${CX} 150 Z`, { fill: '#341f97', opacity: 0.85 }) +
            // ร่างปีศาจตามเทศกาล
            drawDevilFigure(deckId, t) +
            // โซ่ทองหลวม ๆ ที่คอแสดงถึงพันธนาการที่ถอดออกได้เอง
            path(`M ${CX - 22} 205 Q ${CX} 222, ${CX + 22} 205`, { stroke: t.suitGold, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '3 2' }),
            {}
        );
    },

    16: (t, deckId = 'standard') => { // The Tower: อัสนีบาตสายฟ้าฟาดมงกุฎยอดหอคอย + ผู้ตื่นรู้สู่ความจริง + ประกายไฟทองคำ
        return g(
            // หอคอยหินโบราณบนยอดผาสูง
            poly('82,245 92,125 148,125 158,245', { fill: '#334155', stroke: t.frame, 'stroke-width': 1.5 }) +
            // หน้าต่างหอคอยเปล่งเปลวไฟ
            rect(112, 155, 16, 22, { fill: '#e67e22' }) +
            rect(112, 195, 16, 22, { fill: '#e67e22' }) +
            // สายฟ้าสีทองฟาดทะลวงลงมา
            poly(`${CX - 15},85 ${CX + 8},108 ${CX - 2},112 ${CX + 18},132 ${CX + 4},132 ${CX + 12},148 ${CX - 8},128 ${CX + 2},128`, { fill: '#f1c40f' }) +
            sparkle(CX + 6, 128, 8, '#ffffff', 0.95) +
            // มงกุฎทองคำกระเด็นหลุดจากยอดหอคอย
            poly('145,105 165,95 155,115', { fill: t.suitGold }) +
            // ละอองประกายไฟแห่งการรู้แจ้งร่วงหล่น
            [
                [65, 130], [75, 155], [60, 180], [70, 205],
                [175, 130], [165, 160], [180, 185], [170, 215]
            ].map(p => drop(p[0], p[1], 4.5, { fill: '#f39c12' })).join('') +
            // ผู้ตื่นรู้ทั้งสองทะยานสู่อิสรภาพแห่งสัจธรรม (Awakening Seekers of Truth)
            circle(68, 182, 5.5, { fill: t.suitGold }) +
            path('M 68 188 L 58 214 L 74 214 Z', { fill: '#1E293B' }) +
            line(64, 194, 52, 186, { stroke: t.suitGold, 'stroke-width': 1.8 }) +
            circle(172, 188, 5.5, { fill: t.suitGold }) +
            path('M 172 194 L 162 220 L 178 220 Z', { fill: '#991B1B' }) +
            line(176, 200, 188, 192, { stroke: t.suitGold, 'stroke-width': 1.8 }),
            {}
        );
    },

    17: (t, deckId = 'standard') => { // The Star: ดาวดวงใหญ่ 8 แฉกพร้อมดาวบริวาร 7 ดวง + คนโทเทน้ำทิพย์หล่อเลี้ยงผืนดินและธารน้ำ
        return g(
            // ดาวดวงใหญ่ 8 แฉก ณ กึ่งกลางสรวงสวรรค์
            star(CX, 115, 24, 9, 8, -90, { fill: t.suitGold }) +
            circle(CX, 115, 5, { fill: '#ffffff' }) +
            sparkle(CX, 115, 14, '#ffffff', 0.95) +
            // ดาวบริวาร 7 ดวงล้อมรอบ
            [
                [CX - 50, 105], [CX - 30, 140], [CX - 55, 155],
                [CX + 50, 105], [CX + 30, 140], [CX + 55, 155], [CX, 158]
            ].map(p => star(p[0], p[1], 6, 2.5, 8, -90, { fill: t.sparkle, opacity: 0.85 })).join('') +
            // ธารน้ำแห่งความหวัง
            wave(225, W - 60, '#00d2d3', 0.8, 6, 35) +
            wave(240, W - 60, '#54a0ff', 0.6, 6, 35) +
            // เทพีแห่งดวงดาวตามเทศกาล
            drawStarFigure(deckId, t),
            {}
        );
    },

    18: (t, deckId = 'standard') => { // The Moon: ดวงจันทร์ซ้อนเสี้ยว + หยดน้ำค้างทองคำ + หอคอยคู่ + หมาป่าและสุนัขหอน + ผู้เดินทางใต้แสงจันทร์
        return g(
            // พระจันทร์เต็มดวงซ้อนในพระจันทร์เสี้ยวส่องรัศมี
            circle(CX, 108, 20, { fill: t.suitGold }) +
            crescent(CX, 108, 20, '#fff3cd') +
            sunburst(CX, 108, 32, t.frameSoft, 16, 1.2) +
            // หยดน้ำค้างทองคำ 15 หยดโปรยปราย
            [
                [CX - 25, 134], [CX, 138], [CX + 25, 134],
                [CX - 15, 146], [CX + 15, 146]
            ].map(p => drop(p[0], p[1], 3.5, { fill: t.suitGold })).join('') +
            // หอคอยคู่ซ้ายขวา
            rect(45, 145, 16, 70, { fill: '#1E293B', stroke: t.frame, 'stroke-width': 1 }) +
            rect(179, 145, 16, 70, { fill: '#1E293B', stroke: t.frame, 'stroke-width': 1 }) +
            // ทะเลสาบดึกดำบรรพ์และกุ้งก้ามกรามไต่ขึ้นฝั่ง
            wave(240, W - 60, '#2563EB', 0.8, 5, 30) +
            path(`M ${CX} 248 Q ${CX - 8} 238, ${CX} 232 Q ${CX + 8} 238, ${CX} 248 Z`, { fill: '#EA580C' }) +
            // หมาป่าและสุนัขเห่าหอนมองดวงจันทร์
            path('M 68 232 C 68 212, 82 212, 86 222 L 80 234 Z', { fill: '#64748B' }) +
            path('M 172 232 C 172 212, 158 212, 154 222 L 160 234 Z', { fill: '#94A3B8' }) +
            // เทพีหรือนักเดินทางแห่งรัตติกาลตามเทศกาล ยืนสงบนิ่งมองสายน้ำและดวงจันทร์
            drawMoonFigure(deckId, t),
            {}
        );
    },

    19: (t, deckId = 'standard') => { // The Sun: ดวงอาทิตย์ยิ้มรุ่งโรจน์รัศมีตรงและหยัก + กำแพงดอกทานตะวัน + เด็กน้อยบนม้าขาว
        return g(
            // พระอาทิตย์ดวงโตเต็มฟ้าแผ่รัศมีอบอุ่น
            circle(CX, 115, 26, { fill: t.suitGold }) +
            sunburst(CX, 115, 42, t.suitGold, 16, 2) +
            circle(CX, 115, 20, { fill: '#f39c12' }) +
            sparkle(CX, 115, 6, '#ffffff', 0.9) +
            // กำแพงอิฐสวนสวรรค์
            rect(45, 195, 150, 45, { fill: '#7f5539', stroke: t.frame, 'stroke-width': 1.2 }) +
            // ดอกทานตะวันสีทองเบ่งบาน
            [60, 95, 145, 180].map(x =>
                star(x, 195, 12, 6, 8, -90, { fill: '#f1c40f' }) +
                circle(x, 195, 4, { fill: '#6e2c00' })
            ).join('') +
            // เด็กน้อยผู้บริสุทธิ์ตามเทศกาล
            drawSunFigure(deckId, t) +
            // ธงสีแดงโบกสะบัด
            line(CX + 6, 175, CX + 34, 150, { stroke: t.suitGold, 'stroke-width': 2 }) +
            path(`M ${CX + 24} 155 Q ${CX + 38} 145, ${CX + 44} 160 L ${CX + 24} 168 Z`, { fill: '#e74c3c' }),
            {}
        );
    },

    20: (t, deckId = 'standard') => { // Judgement: อัครเทวทูตเป่าแตรทองคำ + ธงดวงดาราแห่งรุ่งอรุณ + ผู้ตื่นรู้ต้อนรับแสงสว่าง
        return g(
            // เมฆาสวรรค์เปิดออก
            path(`M 45 120 Q 80 95, 120 110 Q 160 95, 195 120`, { stroke: '#ffffff', 'stroke-width': 3, fill: 'none', opacity: 0.6 }) +
            // อัครเทวทูตตามเทศกาล
            drawJudgementFigure(deckId, t) +
            // แตรทองคำพร้อมธงดวงดาราแห่งรุ่งอรุณ (Golden Dawn Starburst Banner)
            line(CX + 6, 118, CX + 42, 138, { stroke: t.suitGold, 'stroke-width': 2.5 }) +
            poly(`${CX + 38},132 ${CX + 48},142 ${CX + 42},146`, { fill: t.suitGold }) +
            rect(CX + 14, 125, 18, 14, { fill: '#ffffff', stroke: t.suitGold, 'stroke-width': 1 }) +
            sparkle(CX + 23, 132, 5, t.suitGold, 0.95) +
            circle(CX + 23, 132, 2, { fill: '#e74c3c' }) +
            // ผู้คนฟื้นตื่นชูแขนรับแสงสวรรค์อย่างปีติ
            [CX - 35, CX, CX + 35].map(x =>
                circle(x, 205, 7.5, { fill: t.suitGold }) +
                path(`M ${x} 212 L ${x - 8} 242 L ${x + 8} 242 Z`, { fill: '#ecf0f1' }) +
                line(x - 6, 218, x - 14, 202, { stroke: t.suitGold, 'stroke-width': 2, 'stroke-linecap': 'round' }) +
                line(x + 6, 218, x + 14, 202, { stroke: t.suitGold, 'stroke-width': 2, 'stroke-linecap': 'round' })
            ).join(''),
            {}
        );
    },

    21: (t, deckId = 'standard') => { // The World: พวงมาลาลอเรลแห่งจักรวาล + นางระบำสวรรค์ถือคทาคู่ + ผู้พิทักษ์ 4 ทิศ
        return g(
            // พวงมาลาลอเรลรูปวงรีสีมรกตและทองคำ
            ell(CX, 175, 52, 68, { fill: 'none', stroke: '#27ae60', 'stroke-width': 8, opacity: 0.85, 'stroke-dasharray': '12 6' }) +
            ell(CX, 175, 52, 68, { fill: 'none', stroke: t.suitGold, 'stroke-width': 1.5 }) +
            // ริบบิ้นสีแดงผูกหัวท้ายของพวงมาลา
            poly(`${CX - 12},105 ${CX + 12},105 ${CX},118`, { fill: '#c0392b' }) +
            poly(`${CX - 12},245 ${CX + 12},245 ${CX},232`, { fill: '#c0392b' }) +
            // นางระบำสวรรค์ตามเทศกาล
            drawWorldFigure(deckId, t) +
            // 4 ผู้พิทักษ์ประจำมุม (คน, อินทรี, สิงโต, วัว)
            sparkle(48, 110, 5, t.sparkle) + sparkle(192, 110, 5, t.sparkle) +
            sparkle(48, 240, 5, t.sparkle) + sparkle(192, 240, 5, t.sparkle),
            {}
        );
    }
};

/* ---------- ลวดลายพื้นหลังจาง ๆ ตามธีม ---------- */
function bgThemeMotif(t) {
    switch (t.pattern) {
        case 'wave':
            return wave(90, W, t.sparkle, 0.12) + wave(290, W, t.sparkle, 0.12);
        case 'ripple':
            return [[CX, 80], [CX, 290]].map(p =>
                circle(p[0], p[1], 35, { fill: 'none', stroke: t.sparkle, 'stroke-width': 0.8, opacity: 0.18 })
            ).join('');
        case 'batfly':
            return bat(38, 75, 6, t.sparkle) + bat(202, 75, 6, t.sparkle) + bat(38, 295, 6, t.sparkle) + bat(202, 295, 6, t.sparkle);
        case 'snow':
            return [[38, 75], [202, 75], [38, 295], [202, 295]].map(p =>
                snowflake(p[0], p[1], 7, t.sparkle)
            ).join('');
        case 'heart':
            return [[38, 75], [202, 75], [38, 295], [202, 295]].map(p =>
                heart(p[0], p[1], 7, { fill: t.sparkle, opacity: 0.25 })
            ).join('');
        default:
            return [[38, 75], [202, 75], [38, 295], [202, 295]].map(p =>
                sparkle(p[0], p[1], 4, t.sparkle, 0.35)
            ).join('');
    }
}

/* ================================================================
   เรนเดอร์หน้าไพ่เต็มผืน (78 ใบ)
   ================================================================ */
let uidCounter = 0;

export function renderFront(card, deckId = 'standard') {
    const t = getTheme(deckId);
    const uid = `ttf_${++uidCounter}`;

    // ตัวเลขโรมัน / ตัวเลขกำกับบนยอดซุ้ม
    let numeralStr = '';
    if (card.arcana === 'major') {
        numeralStr = toRoman(card.number);
    } else if (card.number >= 11) {
        const courtMap = { 11: 'PAGE', 12: 'KNIGHT', 13: 'QUEEN', 14: 'KING' };
        numeralStr = courtMap[card.number] || '✦';
    } else {
        numeralStr = card.number === 1 ? 'ACE' : String(card.number);
    }

    // หากมีภาพ Masterpiece Artwork ของสำรับมาตรฐาน (27 ใบที่ได้รับการอนุมัติ)
    // สวมกรอบและป้ายชื่อด้านล่างที่เหมือนกันกับทุกใบในสำรับ 100%
    const approvedSrc = APPROVED_CARD_ASSETS[card?.id];
    if (approvedSrc && deckId === 'standard') {
        return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.thai_name || card.name_th || card.name} (${card.name})">
<defs>
    <clipPath id="${uid}clip"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${t.bg[0]}"/>
        <stop offset="100%" stop-color="${t.bg[1]}"/>
    </linearGradient>
    <linearGradient id="${uid}gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff5cc"/>
        <stop offset="35%" stop-color="${t.frame}"/>
        <stop offset="70%" stop-color="#b8860b"/>
        <stop offset="100%" stop-color="${t.frame}"/>
    </linearGradient>
</defs>
<image href="${approvedSrc}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${uid}clip)"/>
${renderDeckBorder(deckId, t, uid, false)}
${renderDeckNumeralBadge(card, deckId, t, uid, numeralStr)}
${renderDeckCartouche(card, deckId, t, uid)}
</svg>`;
    }

    // สำหรับใบที่เหลือในสำรับมาตรฐาน และไพ่ทั้ง 78 ใบของทุกเทศกาล (Songkran, Loy Krathong, Christmas, Valentine, Halloween, Minimalist)
    let art;
    if (card.arcana === 'major') {
        const drawMajor = MAJORS[card.number] || MAJORS[0];
        art = drawMajor(t, deckId);
    } else if (card.number >= 11) {
        art = courtArt(card.number, card.suit, t, deckId);
    } else {
        art = renderMinorScene(card.number, card.suit, t, deckId);
    }

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.thai_name || card.name_th || card.name} (${card.name})">
<defs>
    <!-- การไล่เฉดสีพื้นหลังมนตราพรีเมียม -->
    <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${t.bg[0]}"/>
        <stop offset="100%" stop-color="${t.bg[1]}"/>
    </linearGradient>

    <!-- ไล่เฉดสีทองคำบริสุทธิ์สำหรับกรอบ (Pure Gold Foil) -->
    <linearGradient id="${uid}gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff5cc"/>
        <stop offset="35%" stop-color="${t.frame}"/>
        <stop offset="70%" stop-color="#b8860b"/>
        <stop offset="100%" stop-color="${t.frame}"/>
    </linearGradient>

    <!-- ออร่าเรืองแสงภายในซุ้มวิหารสวรรค์ นุ่มนวลสบายตา ไม่สว่างโร่ (Luminous Celestial Arch) -->
    <radialGradient id="${uid}archAura" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="${t.archCenter || '#FFFDF7'}" stop-opacity="0.85"/>
        <stop offset="60%" stop-color="${t.bg[0]}" stop-opacity="0.80"/>
        <stop offset="100%" stop-color="${t.bg[1]}" stop-opacity="0.92"/>
    </radialGradient>
</defs>

<!-- 1. กรอบนอก 3 ชั้นและลวดลายมุมเอกลักษณ์ประจำสำรับ -->
${renderDeckBorder(deckId, t, uid, true)}

<!-- 2. ซุ้มวิหารสวรรค์ / ซุ้มประจำเทศกาล -->
${renderDeckArch(deckId, t, uid)}

<!-- 3. ตรายอดซุ้มและตัวเลขกำกับไพ่ด้านบน -->
${renderDeckNumeralBadge(card, deckId, t, uid, numeralStr)}

<!-- 4. งานศิลป์ภาพไพ่ตรงกลาง -->
<g id="card-symbolic-art">${art}</g>

<!-- 5. ป้ายชื่อไพ่ด้านล่างประจำสำรับ (Mitr + Outfit + Watermark) -->
${renderDeckCartouche(card, deckId, t, uid)}
</svg>`;
}
