/* ================================================================
   Minor Arcana Scenic Vector Engine (ไพ่ชุดย่อย 56 ใบ)
   ออกแบบฉากหลังและสัญลักษณ์ตามจารีตสากล Rider-Waite-Smith 100%
   ผสมผสานสไตล์เรเนซองส์และอาร์ตนูโว ซุ้มวิหารสวรรค์ งดงาม ปราศจากความขัดแย้งทางศาสนา
   ================================================================ */

import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, flame, crescent, drop
} from './helpers.js';
import { femaleFace, maleFace } from './figures.js';

const CX = 120; // ศูนย์กลางแนวนอนของไพ่ (W=240, H=380)

/* ---------- ตัวช่วยสร้างองค์ประกอบพื้นฐานฉาก (Landscape & Props) ---------- */

/** ภูเขาและเนินเขาด้านหลัง */
function drawHills(t, y1 = 220, y2 = 250) {
    const hillCol1 = t.frameSoft || 'rgba(180,140,40,0.25)';
    const hillCol2 = t.suits?.pentacles || '#15803d';
    return (
        path(`M 28 ${y1} Q 80 ${y1 - 35}, 140 ${y1 - 10} Q 185 ${y1 - 25}, 212 ${y1} L 212 284 L 28 284 Z`, { fill: hillCol1, opacity: 0.35 }) +
        path(`M 28 ${y2} Q 95 ${y2 - 20}, 160 ${y2} Q 190 ${y2 - 12}, 212 ${y2} L 212 284 L 28 284 Z`, { fill: hillCol2, opacity: 0.25 })
    );
}

/** ผืนน้ำและเกลียวคลื่น */
function drawWater(t, y = 230) {
    const c1 = t.suits?.cups || '#0284c7';
    return (
        path(`M 28 ${y} Q 70 ${y - 8}, 120 ${y} Q 170 ${y + 8}, 212 ${y} L 212 284 L 28 284 Z`, { fill: c1, opacity: 0.35 }) +
        path(`M 28 ${y + 16} Q 60 ${y + 24}, 120 ${y + 16} Q 180 ${y + 8}, 212 ${y + 16} L 212 284 L 28 284 Z`, { fill: c1, opacity: 0.5 }) +
        line(35, y + 8, 85, y + 8, { stroke: '#ffffff', 'stroke-width': 0.8, opacity: 0.6 }) +
        line(135, y + 18, 195, y + 18, { stroke: '#ffffff', 'stroke-width': 0.8, opacity: 0.6 })
    );
}

/** ปราสาทหรือป้อมปราการในระยะไกล */
function drawCastle(x, y, scale = 1, col = '#e2e8f0') {
    const s = scale;
    return g(
        rect(x - 18 * s, y - 25 * s, 10 * s, 25 * s, { fill: col }) +
        rect(x + 8 * s, y - 25 * s, 10 * s, 25 * s, { fill: col }) +
        rect(x - 12 * s, y - 18 * s, 24 * s, 18 * s, { fill: col }) +
        poly(`${x - 18 * s},${y - 25 * s} ${x - 13 * s},${y - 36 * s} ${x - 8 * s},${y - 25 * s}`, { fill: '#b91c1c' }) +
        poly(`${x + 8 * s},${y - 25 * s} ${x + 13 * s},${y - 36 * s} ${x + 18 * s},${y - 25 * s}`, { fill: '#b91c1c' }) +
        line(x - 13 * s, y - 36 * s, x - 13 * s, y - 42 * s, { stroke: '#b91c1c', 'stroke-width': 1 }) +
        rect(x - 13 * s, y - 42 * s, 5 * s, 3 * s, { fill: '#fbbf24' }),
        { opacity: 0.75 }
    );
}

/** เรือสำเภาแล่นในทะเล */
function drawShip(x, y, scale = 0.8, col = '#ffffff') {
    const s = scale;
    return g(
        path(`M ${x - 12 * s} ${y} Q ${x} ${y + 6 * s}, ${x + 14 * s} ${y} L ${x + 11 * s} ${y - 4 * s} L ${x - 9 * s} ${y - 4 * s} Z`, { fill: '#78350f' }) +
        line(x, y - 4 * s, x, y - 22 * s, { stroke: '#78350f', 'stroke-width': 1.5 }) +
        path(`M ${x} ${y - 20 * s} Q ${x + 10 * s} ${y - 12 * s}, ${x} ${y - 5 * s} Z`, { fill: col, opacity: 0.9 }) +
        path(`M ${x} ${y - 18 * s} Q ${x - 8 * s} ${y - 11 * s}, ${x} ${y - 6 * s} Z`, { fill: col, opacity: 0.75 }),
        {}
    );
}

/** ก้านไม้เท้าวิจิตร (Ornate Wand Staff) */
function wandStaff(x, y, height = 75, angle = 0, t) {
    const gold = t.suitGold;
    return g(
        line(0, height / 2, 0, -height / 2, { stroke: gold, 'stroke-width': 3, 'stroke-linecap': 'round' }) +
        circle(0, -height / 2, 4.5, { fill: gold }) +
        path('M 0 -8 Q -6 -13, -3 -19 Q 0 -14, 0 -8 Z', { fill: '#4ade80' }) +
        path('M 0 12 Q 6 7, 3 1 Q 0 6, 0 12 Z', { fill: '#4ade80' }) +
        path('M 0 -height/2 C 6 -height/2-10, -6 -height/2-10, 0 -height/2 Z', { fill: t.suits.wands }) +
        sparkle(0, -height / 2, 4, '#ffffff', 0.9),
        { transform: `translate(${x} ${y}) rotate(${angle})` }
    );
}

/** จอกทองคำโอ่อ่า (Ornate Golden Chalice) */
function chaliceCup(x, y, s = 1, t, glowing = true) {
    const gold = t.suitGold;
    return g(
        (glowing ? ell(0, -10 * s, 14 * s, 18 * s, { fill: t.suits.cups, opacity: 0.25 }) : '') +
        // ฐานจอก
        ell(0, 16 * s, 11 * s, 4 * s, { fill: gold }) +
        line(0, 16 * s, 0, 5 * s, { stroke: gold, 'stroke-width': 3.5 * s }) +
        circle(0, 6 * s, 3.5 * s, { fill: gold }) +
        // ลำตัวจอกทรงบงกช
        path(`M ${-13 * s} ${-9 * s} C ${-14 * s} ${7 * s}, ${14 * s} ${7 * s}, ${13 * s} ${-9 * s} Z`, { fill: gold }) +
        ell(0, -9 * s, 13 * s, 4 * s, { fill: '#fff5cc', stroke: gold, 'stroke-width': 1.2 }) +
        // น้ำทิพย์หรือแสงประกายในถ้วย
        ell(0, -9 * s, 10 * s, 2.5 * s, { fill: t.suits.cups }) +
        sparkle(0, -14 * s, 4 * s, '#ffffff', 0.95),
        { transform: `translate(${x} ${y})` }
    );
}

/** ดาบเหล็กกล้าแห่งสัจจะ (Steel Broadsword) */
function steelSword(x, y, length = 75, angle = 0, t) {
    const gold = t.suitGold;
    return g(
        // ใบดาบ
        line(0, length / 2 - 12, 0, -length / 2 + 5, { stroke: '#e2e8f0', 'stroke-width': 3.2, 'stroke-linecap': 'round' }) +
        line(0, length / 2 - 12, 0, -length / 2 + 5, { stroke: '#94a3b8', 'stroke-width': 1.2 }) +
        poly(`-3.2,${-length / 2 + 6} 3.2,${-length / 2 + 6} 0,${-length / 2 - 2}`, { fill: '#f8fafc' }) +
        // ด้ามและโกร่งดาบทองคำ
        line(-10, length / 2 - 12, 10, length / 2 - 12, { stroke: gold, 'stroke-width': 2.6, 'stroke-linecap': 'round' }) +
        circle(0, length / 2 - 12, 2.8, { fill: gold }) +
        line(0, length / 2 - 12, 0, length / 2, { stroke: '#78350f', 'stroke-width': 3.5 }) +
        circle(0, length / 2 + 2, 3.5, { fill: gold }) +
        sparkle(0, -length / 2 - 1, 3.5, '#ffffff', 0.95),
        { transform: `translate(${x} ${y}) rotate(${angle})` }
    );
}

/** เหรียญตราดาราทองคำ (Star Pentacle Coin) */
function coinPentacle(x, y, r = 16, t) {
    const gold = t.suitGold;
    return g(
        circle(0, 0, r, { fill: gold }) +
        circle(0, 0, r - 2.5, { fill: '#fef08a', stroke: gold, 'stroke-width': 1.2 }) +
        circle(0, 0, r - 5, { fill: 'none', stroke: t.suits.pentacles, 'stroke-width': 0.8, 'stroke-dasharray': '2 1.5' }) +
        star(0, 0, r * 0.65, r * 0.28, 5, -90, { fill: 'none', stroke: '#1e293b', 'stroke-width': 1.8 }) +
        circle(0, 0, 2.2, { fill: gold }) +
        sparkle(0, 0, 3, '#ffffff', 0.85),
        { transform: `translate(${x} ${y})` }
    );
}

/* ================================================================
   2. เรนเดอร์ฉากเฉพาะสำหรับไพ่แต้มแต่ละใบ (2 to 10)
   ================================================================ */

export function renderMinorScene(number, suit, t, deckId = 'standard') {
    const gold = t.suitGold;
    const cy = 175;

    // ---------------------- SUIT OF WANDS (ไม้เท้า) ----------------------
    if (suit === 'wands') {
        if (number === 1) {
            // Ace of Wands: หัตถ์สวรรค์ถือคทาผลิใบไม้และเปลวเพลิงศักดิ์สิทธิ์เหนือปราสาท
            return g(
                drawHills(t, 215, 240) +
                drawCastle(170, 165, 0.85) +
                path('M 35 185 Q 70 160, 95 185 Q 115 170, 105 200 Z', { fill: '#ffffff', opacity: 0.85 }) +
                wandStaff(CX, 165, 110, 0, t) +
                circle(CX, 110, 16, { fill: t.suits.wands, opacity: 0.35 }) +
                sparkle(CX, 105, 6, '#ffffff', 1) +
                sparkle(CX - 24, 140, 4, gold, 0.9) +
                sparkle(CX + 24, 140, 4, gold, 0.9),
                {}
            );
        }
        if (number === 2) {
            // Two of Wands: นักปกครองยืนบนเชิงเทินมองทะเลกว้าง ถือลูกโลกและไม้เท้า 2 เสา
            return g(
                drawHills(t, 210, 235) +
                drawWater(t, 240) +
                drawShip(75, 245, 0.7) +
                // กำแพงเชิงเทินหิน
                rect(32, 245, 176, 40, { fill: '#334155', stroke: gold, 'stroke-width': 1.2 }) +
                line(32, 245, 208, 245, { stroke: gold, 'stroke-width': 1.5 }) +
                // 2 เสาไม้เท้าตั้งตระหง่าน
                wandStaff(60, 185, 95, 0, t) +
                wandStaff(180, 185, 95, 0, t) +
                // บุรุษผู้มองสู่อนาคต
                maleFace(120, 155, 0.95, 1, '#FAD9C1', '#1e293b') +
                path('M 108 175 L 102 245 L 138 245 L 132 175 Z', { fill: '#b91c1c' }) +
                circle(136, 195, 7, { fill: '#38bdf8', stroke: gold, 'stroke-width': 1.2 }) + // ลูกโลก
                sparkle(136, 195, 3, '#ffffff', 0.9),
                {}
            );
        }
        if (number === 3) {
            // Three of Wands: ผู้เดินทางบนชะง่อนผามองเรือสำเภา 3 ลำสู่แสงตะวันรุ่ง
            return g(
                drawHills(t, 190, 215) +
                drawWater(t, 220) +
                drawShip(65, 230, 0.7) +
                drawShip(135, 225, 0.85) +
                drawShip(185, 235, 0.6) +
                // แสงตะวันส่องสะท้อนผืนน้ำ
                circle(140, 160, 22, { fill: '#fde047', opacity: 0.25 }) +
                // หน้าผาหินสูง
                path('M 28 230 Q 90 220, 110 240 L 110 284 L 28 284 Z', { fill: '#1e293b' }) +
                // ผู้ยืนหันหลังมองอนาคต
                path('M 65 180 L 58 245 L 85 245 L 78 180 Z', { fill: '#ea580c' }) +
                maleFace(72, 165, 0.85, 1, '#FAD9C1', '#334155') +
                wandStaff(52, 175, 90, 0, t) +
                wandStaff(92, 175, 90, 0, t) +
                wandStaff(76, 185, 80, -8, t),
                {}
            );
        }
        if (number === 4) {
            // Four of Wands: ซุ้มดอกไม้และแพรพรรณเฉลิมฉลองหน้าปราสาท
            return g(
                drawCastle(120, 155, 1) +
                drawHills(t, 230, 255) +
                // พวงมาลัยดอกไม้และผลไม้งดงามห้อยระหว่างเสา
                path('M 60 135 Q 120 165, 180 135', { stroke: '#15803d', 'stroke-width': 4.5, fill: 'none' }) +
                path('M 60 135 Q 120 165, 180 135', { stroke: '#fbbf24', 'stroke-width': 1.8, 'stroke-dasharray': '3 3', fill: 'none' }) +
                circle(90, 148, 3.5, { fill: '#ef4444' }) +
                circle(120, 152, 4, { fill: '#fbbf24' }) +
                circle(150, 148, 3.5, { fill: '#ec4899' }) +
                // 4 เสาไม้เท้าดอกไม้
                wandStaff(55, 185, 95, 0, t) +
                wandStaff(78, 185, 95, 0, t) +
                wandStaff(162, 185, 95, 0, t) +
                wandStaff(185, 185, 95, 0, t) +
                // คู่เต้นรำเฉลิมฉลอง
                femaleFace(110, 210, 0.75, 1, '#FFF5ED', '#831843') +
                path('M 104 220 L 98 255 L 122 255 L 116 220 Z', { fill: '#f43f5e' }) +
                maleFace(130, 208, 0.75, -1, '#FAD9C1', '#1e3a8a') +
                path('M 124 218 L 118 255 L 142 255 L 136 218 Z', { fill: '#3b82f6' }),
                {}
            );
        }
        if (number === 5) {
            // Five of Wands: การประลองเชิงยุทธ์ 5 ไม้เท้า พลังสร้างสรรค์
            return g(
                drawHills(t, 230, 255) +
                circle(CX, cy, 45, { fill: '#ea580c', opacity: 0.15 }) +
                wandStaff(85, 170, 95, 30, t) +
                wandStaff(155, 170, 95, -30, t) +
                wandStaff(CX, 165, 100, 0, t) +
                wandStaff(95, 185, 90, -18, t) +
                wandStaff(145, 185, 90, 18, t) +
                sparkle(CX, cy - 10, 6, '#ffffff', 0.95) +
                sparkle(CX - 25, cy + 15, 4, gold, 0.9) +
                sparkle(CX + 25, cy + 15, 4, gold, 0.9),
                {}
            );
        }
        if (number === 6) {
            // Six of Wands: ชัยชนะ มงกุฎช่อมะกอกทองคำบนยอดไม้เท้า
            return g(
                drawCastle(170, 150, 0.85) +
                drawHills(t, 220, 245) +
                // 5 ไม้เท้าของผู้ร่วมยินดี
                wandStaff(45, 205, 80, 0, t) +
                wandStaff(65, 200, 80, 0, t) +
                wandStaff(85, 195, 80, 0, t) +
                wandStaff(155, 200, 80, 0, t) +
                wandStaff(175, 205, 80, 0, t) +
                // ไม้เท้าแห่งชัยชนะประดับพวงมาลัยลอเรล
                wandStaff(115, 160, 105, 0, t) +
                circle(115, 115, 14, { fill: 'none', stroke: '#15803d', 'stroke-width': 3.5 }) +
                circle(115, 115, 11, { fill: 'none', stroke: gold, 'stroke-width': 1.5 }) +
                // แพรสะบัดชัยชนะ
                path('M 115 125 Q 140 135, 130 150 Q 115 140, 115 130 Z', { fill: '#ef4444' }) +
                sparkle(115, 100, 5, '#ffffff', 1),
                {}
            );
        }
        if (number === 7) {
            // Seven of Wands: ผู้กล้าบนยอดเขาสูง ยืนหยัดต้าน 6 ไม้เท้าเบื้องล่าง
            return g(
                // หน้าผาหินเด่นสง่า
                path('M 28 200 Q 120 180, 212 215 L 212 284 L 28 284 Z', { fill: '#334155' }) +
                // ไม้เท้าของผู้ยืนหยัด
                wandStaff(130, 145, 95, -25, t) +
                maleFace(115, 130, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 108 140 L 98 195 L 126 195 L 120 140 Z', { fill: '#16a34a' }) +
                // 6 ไม้เท้าที่พุ่งขึ้นมาจากเบื้องล่าง
                wandStaff(50, 235, 75, 15, t) +
                wandStaff(75, 240, 75, 10, t) +
                wandStaff(100, 245, 75, 5, t) +
                wandStaff(145, 245, 75, -5, t) +
                wandStaff(170, 240, 75, -10, t) +
                wandStaff(190, 235, 75, -15, t),
                {}
            );
        }
        if (number === 8) {
            // Eight of Wands: 8 ไม้เท้าเหินเวหาด้วยความเร็วสูงผ่านหุบเขาและสายน้ำ
            return g(
                drawHills(t, 225, 250) +
                drawWater(t, 250) +
                // เส้นแสงความเร็วในอากาศ
                line(40, 110, 180, 190, { stroke: gold, 'stroke-width': 0.8, opacity: 0.5, 'stroke-dasharray': '5 3' }) +
                line(60, 95, 200, 175, { stroke: gold, 'stroke-width': 0.8, opacity: 0.5, 'stroke-dasharray': '5 3' }) +
                wandStaff(65, 110, 70, 52, t) +
                wandStaff(100, 125, 70, 52, t) +
                wandStaff(135, 140, 70, 52, t) +
                wandStaff(170, 155, 70, 52, t) +
                wandStaff(50, 150, 70, 52, t) +
                wandStaff(85, 165, 70, 52, t) +
                wandStaff(120, 180, 70, 52, t) +
                wandStaff(155, 195, 70, 52, t),
                {}
            );
        }
        if (number === 9) {
            // Nine of Wands: ป้อมค่าย 8 ไม้เท้า พร้อมผู้พิทักษ์ถือไม้เท้าเฝ้าระวัง
            return g(
                drawHills(t, 220, 245) +
                // แถวกำแพงไม้พิทักษ์ 8 เสา
                wandStaff(45, 180, 90, 0, t) +
                wandStaff(62, 180, 90, 0, t) +
                wandStaff(79, 180, 90, 0, t) +
                wandStaff(96, 180, 90, 0, t) +
                wandStaff(113, 180, 90, 0, t) +
                wandStaff(130, 180, 90, 0, t) +
                wandStaff(147, 180, 90, 0, t) +
                wandStaff(164, 180, 90, 0, t) +
                // ผู้พิทักษ์ทรงพลังถือไม้เท้าที่ 9
                wandStaff(182, 175, 95, 0, t) +
                maleFace(170, 150, 0.8, -1, '#FAD9C1', '#334155') +
                path('M 164 160 L 158 225 L 180 225 L 176 160 Z', { fill: '#d97706' }),
                {}
            );
        }
        if (number === 10) {
            // Ten of Wands: มุ่งมั่นแบกรับภาระ 10 ไม้เท้ามุ่งสู่คฤหาสน์อันอบอุ่น
            return g(
                drawHills(t, 210, 235) +
                drawCastle(175, 190, 0.75) + // จุดหมายปลายทาง
                // กิ่งไม้เท้า 10 เล่มมัดรวมกัน
                wandStaff(95, 170, 90, -35, t) +
                wandStaff(100, 168, 90, -28, t) +
                wandStaff(105, 166, 90, -20, t) +
                wandStaff(110, 164, 90, -12, t) +
                wandStaff(115, 164, 90, -4, t) +
                wandStaff(120, 164, 90, 4, t) +
                wandStaff(125, 166, 90, 12, t) +
                wandStaff(130, 168, 90, 20, t) +
                wandStaff(135, 170, 90, 28, t) +
                wandStaff(140, 172, 90, 35, t) +
                // ผู้ก้าวเดินมุ่งมั่น
                maleFace(85, 180, 0.8, 1, '#FAD9C1', '#1e293b') +
                path('M 80 190 L 72 250 L 105 250 L 98 190 Z', { fill: '#b45309' }),
                {}
            );
        }
    }

    // ---------------------- SUIT OF CUPS (ถ้วย) ----------------------
    if (suit === 'cups') {
        if (number === 1) {
            // Ace of Cups: หัตถ์สวรรค์ถือจอกทองคำน้ำทิพย์ล้นเอ่อสู่สระบัวหลวง
            return g(
                drawWater(t, 230) +
                circle(75, 255, 12, { fill: '#15803d', opacity: 0.8 }) +
                circle(165, 258, 14, { fill: '#15803d', opacity: 0.8 }) +
                circle(75, 255, 5, { fill: '#ec4899' }) +
                circle(165, 258, 6, { fill: '#ffffff' }) +
                path('M 40 185 Q 75 160, 100 185 Q 120 170, 110 200 Z', { fill: '#ffffff', opacity: 0.85 }) +
                chaliceCup(CX, 165, 1.35, t, true) +
                path(`M ${CX - 12} 175 Q ${CX - 25} 210, 80 250`, { stroke: '#38bdf8', 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }) +
                path(`M ${CX + 12} 175 Q ${CX + 25} 210, 160 250`, { stroke: '#38bdf8', 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }) +
                path(`M ${CX} 118 Q ${CX - 12} 105, ${CX - 18} 115 Q ${CX} 125, ${CX + 18} 115 Q ${CX + 12} 105, ${CX} 118 Z`, { fill: '#ffffff' }) +
                circle(CX, 128, 4, { fill: gold }),
                {}
            );
        }
        if (number === 2) {
            // Two of Cups: สองจอกเชื่อมพันธสัญญาแห่งรักใต้ตราสัญลักษณ์แห่งดุลยภาพ
            return g(
                drawHills(t, 220, 245) +
                // คทาปีกแคดูเซียส (สัญลักษณ์แห่งการหลอมรวมดุลยภาพ)
                line(CX, 105, CX, 165, { stroke: gold, 'stroke-width': 2.5 }) +
                circle(CX, 102, 4.5, { fill: '#ef4444' }) +
                path(`M ${CX} 108 C ${CX + 22} 92, ${CX + 28} 115, ${CX} 125 C ${CX - 28} 115, ${CX - 22} 92, ${CX} 108 Z`, { fill: gold, opacity: 0.85 }) +
                // จอกทองคำ 2 ใบยกขึ้นฉลอง
                chaliceCup(75, 180, 1.15, t) +
                chaliceCup(165, 180, 1.15, t) +
                // สองบุคคลหันหน้าเข้าหากัน
                femaleFace(62, 160, 0.85, 1, '#FFF5ED', '#831843') +
                path('M 55 170 L 48 235 L 75 235 L 70 170 Z', { fill: '#f43f5e' }) +
                maleFace(178, 158, 0.85, -1, '#FAD9C1', '#1e3a8a') +
                path('M 170 168 L 165 235 L 192 235 L 185 168 Z', { fill: '#3b82f6' }),
                {}
            );
        }
        if (number === 3) {
            // Three of Cups: สามดรุณีเต้นรำชูจอกเฉลิมฉลองมิตรภาพและฤดูกาลเก็บเกี่ยว
            return g(
                drawHills(t, 230, 255) +
                // พวงองุ่นและดอกไม้บนพื้น
                circle(CX - 35, 255, 4, { fill: '#7e22ce' }) +
                circle(CX - 30, 252, 4, { fill: '#7e22ce' }) +
                circle(CX + 32, 254, 4.5, { fill: '#ea580c' }) +
                // 3 จอกทองคำชูประสานกันบนฟ้า
                chaliceCup(85, 130, 1, t) +
                chaliceCup(CX, 115, 1.1, t) +
                chaliceCup(155, 130, 1, t) +
                // สามดรุณีเริงระบำ
                femaleFace(75, 165, 0.75, 1, '#FFF5ED', '#9d174d') +
                path('M 70 175 L 62 245 L 88 245 L 82 175 Z', { fill: '#ec4899' }) +
                femaleFace(CX, 155, 0.78, 0, '#FFF5ED', '#065f46') +
                path('M 112 165 L 105 245 L 135 245 L 128 165 Z', { fill: '#10b981' }) +
                femaleFace(165, 165, 0.75, -1, '#FFF5ED', '#92400e') +
                path('M 158 175 L 152 245 L 178 245 L 170 175 Z', { fill: '#f59e0b' }),
                {}
            );
        }
        if (number === 4) {
            // Four of Cups: นั่งสงบใต้ร่มไม้ มี 3 จอกเบื้องหน้า และเมฆายื่นจอกที่ 4 มอบให้
            return g(
                // ร่มเงาต้นไม้ศักดิ์สิทธิ์
                path('M 45 250 L 52 145 Q 35 120, 65 95 Q 110 90, 120 115 Q 120 145, 58 155 L 55 250 Z', { fill: '#15803d', opacity: 0.85 }) +
                line(48, 250, 52, 145, { stroke: '#78350f', 'stroke-width': 7 }) +
                // ผู้เจริญสมาธินั่งกอดอก
                maleFace(85, 175, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 78 185 L 65 245 L 105 245 L 95 185 Z', { fill: '#0369a1' }) +
                // 3 จอกวางเรียงบนพื้นหญ้า
                chaliceCup(60, 245, 0.85, t, false) +
                chaliceCup(85, 245, 0.85, t, false) +
                chaliceCup(110, 245, 0.85, t, false) +
                // เมฆาสวรรค์และจอกที่ 4 เรืองรอง
                path('M 155 145 Q 140 135, 155 120 Q 175 110, 195 125 Q 210 140, 185 155 Z', { fill: '#ffffff', opacity: 0.9 }) +
                chaliceCup(168, 140, 1.1, t, true),
                {}
            );
        }
        if (number === 5) {
            // Five of Cups: ผู้สวมชุดคลุมมอง 3 จอกคว่ำ โดยมี 2 จอกตั้งมั่นหลังสะพาน
            return g(
                drawWater(t, 225) +
                drawCastle(175, 150, 0.8) +
                // สะพานหินข้ามลำน้ำ
                path('M 125 225 Q 155 210, 185 225 L 185 240 Q 155 225, 125 240 Z', { fill: '#64748b' }) +
                // ผู้คลุมกายด้วยความอาลัย
                path('M 75 160 C 65 175, 60 215, 68 250 L 98 250 C 105 215, 100 175, 90 160 Z', { fill: '#0f172a' }) +
                circle(83, 155, 8, { fill: '#0f172a' }) +
                // 3 จอกคว่ำหกน้ำสีแดง
                g(chaliceCup(0, 0, 0.85, t, false), { transform: 'translate(108 245) rotate(90)' }) +
                path('M 112 245 Q 120 248, 128 246', { stroke: '#dc2626', 'stroke-width': 2.5 }) +
                g(chaliceCup(0, 0, 0.85, t, false), { transform: 'translate(95 255) rotate(105)' }) +
                g(chaliceCup(0, 0, 0.85, t, false), { transform: 'translate(118 260) rotate(80)' }) +
                // 2 จอกทองคำเต็มเปี่ยมที่ยังคงตั้งอยู่ข้างหลัง
                chaliceCup(55, 230, 0.9, t) +
                chaliceCup(70, 230, 0.9, t),
                {}
            );
        }
        if (number === 6) {
            // Six of Cups: ความทรงจำอันงดงาม เด็กน้อยมอบจอกดอกไม้ขาวบริสุทธิ์
            return g(
                drawCastle(70, 155, 0.8) +
                drawHills(t, 220, 245) +
                // 4 จอกบรรจุดอกไม้ประดับด้านหน้า
                chaliceCup(45, 245, 0.8, t, false) +
                chaliceCup(70, 245, 0.8, t, false) +
                chaliceCup(165, 245, 0.8, t, false) +
                chaliceCup(190, 245, 0.8, t, false) +
                // เด็กโตมอบจอกดอกไม้ให้เด็กเล็ก
                maleFace(105, 180, 0.75, 1, '#FAD9C1', '#78350f') +
                path('M 100 190 L 92 245 L 118 245 L 112 190 Z', { fill: '#2563eb' }) +
                chaliceCup(128, 195, 0.95, t, true) + // จอกดอกไม้ตรงกลาง
                star(128, 182, 5, 2, 5, -90, { fill: '#ffffff' }) +
                femaleFace(145, 195, 0.65, -1, '#FFF5ED', '#b45309') +
                path('M 140 205 L 135 245 L 155 245 L 150 205 Z', { fill: '#e11d48' }) +
                chaliceCup(120, 135, 0.85, t, false), // จอกที่ 6 บนกำแพง
                {}
            );
        }
        if (number === 7) {
            // Seven of Cups: ภาพมายา 7 จอกลอยเหนือเมฆาหมอกมนตรา
            return g(
                // เมฆาเวทมนตร์
                path('M 35 200 Q 80 170, 120 190 Q 165 165, 205 200 L 205 284 L 35 284 Z', { fill: '#475569', opacity: 0.35 }) +
                // เงาผู้ค้นหาเบื้องหลัง
                path('M 110 245 C 105 255, 100 275, 102 284 L 138 284 C 140 275, 135 255, 130 245 Z', { fill: '#0f172a' }) +
                circle(CX, 238, 9, { fill: '#0f172a' }) +
                // 7 จอกลอยในเมฆพร้อมสมบัติและมายา
                chaliceCup(60, 125, 0.85, t) + // ปราสาท
                drawCastle(60, 108, 0.35) +
                chaliceCup(100, 115, 0.85, t) + // มงกุฎ
                circle(100, 100, 4.5, { fill: gold }) +
                chaliceCup(140, 115, 0.85, t) + // อัญมณี
                sparkle(140, 100, 5, '#38bdf8', 1) +
                chaliceCup(180, 125, 0.85, t) + // ช่อมะกอก
                circle(180, 105, 5, { fill: 'none', stroke: '#22c55e', 'stroke-width': 2 }) +
                chaliceCup(75, 165, 0.85, t) + // มังกร
                path('M 70 152 Q 78 145, 82 152', { stroke: '#ef4444', 'stroke-width': 2, fill: 'none' }) +
                chaliceCup(120, 155, 0.95, t) + // แสงสัจจะ
                sparkle(120, 138, 6, '#ffffff', 1) +
                chaliceCup(165, 165, 0.85, t), // หน้ากาก
                {}
            );
        }
        if (number === 8) {
            // Eight of Cups: ผู้ละทิ้ง 8 จอกก้าวสู่ภูผาใต้แสงจันทร์
            return g(
                drawHills(t, 180, 210) +
                drawWater(t, 220) +
                crescent(60, 110, 12, gold) + // จันทร์เสี้ยวเคียงจันทร์เพ็ญ
                circle(65, 110, 8, { fill: '#fff5cc', opacity: 0.6 }) +
                // 8 จอกวางซ้อนเป็นระเบียบเรียบร้อยริมหาด
                chaliceCup(50, 235, 0.85, t, false) +
                chaliceCup(70, 235, 0.85, t, false) +
                chaliceCup(90, 235, 0.85, t, false) +
                chaliceCup(60, 215, 0.85, t, false) +
                chaliceCup(80, 215, 0.85, t, false) +
                chaliceCup(160, 235, 0.85, t, false) +
                chaliceCup(180, 235, 0.85, t, false) +
                chaliceCup(170, 215, 0.85, t, false) +
                // นักแสวงหาพร้อมไม้เท้าก้าวขึ้นสู่ภูผา
                path('M 125 180 C 120 190, 118 220, 122 235 L 138 235 C 142 220, 140 190, 135 180 Z', { fill: '#dc2626' }) +
                circle(130, 172, 6.5, { fill: '#7f1d1d' }) +
                line(140, 170, 142, 238, { stroke: gold, 'stroke-width': 2 }),
                {}
            );
        }
        if (number === 9) {
            // Nine of Cups: ไพ่แห่งความสมปรารถนา (Wish Card) เศรษฐีนั่งหน้าโต๊ะ 9 จอกทอง
            return g(
                // ม่านกำมะหยี่สีน้ำเงินหรูหรา
                path('M 32 95 Q 120 125, 208 95 L 208 284 L 32 284 Z', { fill: '#1e1b4b', opacity: 0.35 }) +
                // โต๊ะโค้งจัดแสดง 9 จอกทองคำเรียงแถวงดงาม
                path('M 40 175 Q 120 150, 200 175', { stroke: gold, 'stroke-width': 2.5, fill: 'none' }) +
                chaliceCup(45, 172, 0.75, t) +
                chaliceCup(64, 166, 0.75, t) +
                chaliceCup(83, 162, 0.75, t) +
                chaliceCup(102, 159, 0.75, t) +
                chaliceCup(CX, 158, 0.8, t) +
                chaliceCup(138, 159, 0.75, t) +
                chaliceCup(157, 162, 0.75, t) +
                chaliceCup(176, 166, 0.75, t) +
                chaliceCup(195, 172, 0.75, t) +
                // คหบดีผู้มีความสุขและพึงพอใจ
                maleFace(CX, 192, 0.95, 0, '#FAD9C1', '#78350f') +
                path('M 98 205 C 88 225, 85 255, 95 265 L 145 265 C 155 255, 152 225, 142 205 Z', { fill: '#b91c1c' }) +
                rect(106, 218, 28, 6, { fill: gold }),
                {}
            );
        }
        if (number === 10) {
            // Ten of Cups: ครอบครัวสุขสันต์ใต้สายรุ้ง 10 จอกทองคำเหนือบ้านริมน้ำ
            return g(
                drawHills(t, 220, 245) +
                drawWater(t, 248) +
                // บ้านชนบทอันแสนสุขริมแม่น้ำ
                drawCastle(65, 235, 0.6) +
                // รุ้งเรืองรอง 10 จอกทองคำโค้งข้ามฟากฟ้า
                path('M 38 170 Q 120 90, 202 170', { stroke: '#fbbf24', 'stroke-width': 16, opacity: 0.2, fill: 'none' }) +
                path('M 38 170 Q 120 90, 202 170', { stroke: '#38bdf8', 'stroke-width': 6, opacity: 0.35, fill: 'none' }) +
                chaliceCup(45, 165, 0.7, t) +
                chaliceCup(60, 145, 0.7, t) +
                chaliceCup(78, 130, 0.7, t) +
                chaliceCup(98, 118, 0.7, t) +
                chaliceCup(112, 112, 0.75, t) +
                chaliceCup(128, 112, 0.75, t) +
                chaliceCup(142, 118, 0.7, t) +
                chaliceCup(162, 130, 0.7, t) +
                chaliceCup(180, 145, 0.7, t) +
                chaliceCup(195, 165, 0.7, t) +
                // คู่รักโอบกอดชูแขนสู่รุ้ง
                maleFace(145, 215, 0.75, -1, '#FAD9C1', '#1e293b') +
                path('M 140 225 L 132 265 L 155 265 L 150 225 Z', { fill: '#2563eb' }) +
                femaleFace(160, 217, 0.75, -1, '#FFF5ED', '#991b1b') +
                path('M 155 227 L 148 265 L 172 265 L 165 227 Z', { fill: '#ef4444' }),
                {}
            );
        }
    }

    // ---------------------- SUIT OF SWORDS (ดาบ) ----------------------
    if (suit === 'swords') {
        if (number === 1) {
            // Ace of Swords: หัตถ์สวรรค์ถือดาบเหล็กกล้าสวมมงกุฎแห่งชัยชนะเหนือทิวเขา
            return g(
                poly('35,260 85,185 135,260', { fill: '#475569', opacity: 0.5 }) +
                poly('105,260 160,175 210,260', { fill: '#334155', opacity: 0.6 }) +
                poly('70,210 85,185 100,210', { fill: '#f8fafc' }) +
                poly('145,200 160,175 175,200', { fill: '#f8fafc' }) +
                path('M 40 195 Q 75 170, 100 195 Q 120 180, 110 210 Z', { fill: '#ffffff', opacity: 0.85 }) +
                steelSword(CX, 165, 115, 0, t) +
                circle(CX, 108, 14, { fill: 'none', stroke: gold, 'stroke-width': 2.5 }) +
                circle(CX, 108, 11, { fill: 'none', stroke: '#15803d', 'stroke-width': 2 }) +
                sparkle(CX, 95, 6, '#ffffff', 1) +
                sparkle(CX - 18, 115, 4, gold, 0.9) +
                sparkle(CX + 18, 115, 4, gold, 0.9),
                {}
            );
        }
        if (number === 2) {
            // Two of Swords: สตรีนั่งถือดาบไขว้ในสมดุล สงบนิ่งริมทะเลใต้แสงจันทร์
            return g(
                drawWater(t, 225) +
                crescent(CX, 105, 13, '#ffffff') +
                // ม้านั่งหิน
                rect(85, 235, 70, 25, { fill: '#64748b', stroke: gold, 'stroke-width': 1.2 }) +
                // 2 ดาบยาวไขว้สมดุล
                steelSword(102, 175, 80, -32, t) +
                steelSword(138, 175, 80, 32, t) +
                // สตรีในชุดคลุมขาวบริสุทธิ์
                femaleFace(CX, 160, 0.9, 0, '#FFF5ED', '#475569') +
                rect(CX - 8, 160, 16, 4, { fill: '#ffffff' }) + // ผ้าปิดตาแห่งความเป็นกลาง
                path(`M ${CX - 16} 175 L ${CX - 22} 245 L ${CX + 22} 245 L ${CX + 16} 175 Z`, { fill: '#f8fafc', stroke: '#cbd5e1', 'stroke-width': 1 }),
                {}
            );
        }
        if (number === 3) {
            // Three of Swords: หัวใจเรืองแสงแทงทะลุด้วย 3 ดาบ เมฆฝนและแสงสว่างหลังพายุ
            return g(
                // เมฆพายุฝน
                path('M 40 120 Q 75 95, 120 110 Q 165 95, 200 120 L 200 155 L 40 155 Z', { fill: '#334155', opacity: 0.6 }) +
                line(65, 140, 55, 170, { stroke: '#94a3b8', 'stroke-width': 1, 'stroke-dasharray': '4 4' }) +
                line(175, 140, 165, 170, { stroke: '#94a3b8', 'stroke-width': 1, 'stroke-dasharray': '4 4' }) +
                // รัศมีแสงสีทองเบื้องหลังหัวใจ
                circle(CX, cy, 42, { fill: '#fef08a', opacity: 0.3 }) +
                // ดวงใจสีชาด
                heart(CX, cy, 32, { fill: '#dc2626', stroke: gold, 'stroke-width': 1.5 }) +
                // 3 ดาบแห่งสัจจะ
                steelSword(CX, cy - 8, 90, 0, t) +
                steelSword(CX - 16, cy - 8, 85, 28, t) +
                steelSword(CX + 16, cy - 8, 85, -28, t) +
                sparkle(CX, cy - 20, 5, '#ffffff', 1),
                {}
            );
        }
        if (number === 4) {
            // Four of Swords: อัศวินนอนสงบในวิหารพักฟื้น 3 ดาบแขวนบนผนัง 1 ดาบเคียงกาย
            return g(
                // หน้าต่างกระจกสีโกธิก
                path('M 95 145 C 95 105, 145 105, 145 145 Z', { fill: '#fef08a', stroke: gold, 'stroke-width': 1.5, opacity: 0.75 }) +
                line(120, 110, 120, 145, { stroke: gold, 'stroke-width': 1.2 }) +
                // แท่นหินประดิษฐานรูปปั้นอัศวิน
                rect(50, 220, 140, 35, { fill: '#475569', stroke: gold, 'stroke-width': 1.5 }) +
                // รูปปั้นอัศวินนอนพนมมือสงบนิ่ง
                maleFace(85, 215, 0.8, 1, '#cbd5e1', '#64748b') +
                rect(95, 215, 75, 14, { fill: '#94a3b8' }) +
                // 3 ดาบบนผนัง
                steelSword(80, 135, 65, 0, t) +
                steelSword(120, 130, 70, 0, t) +
                steelSword(160, 135, 65, 0, t) +
                // 1 ดาบเคียงข้างแท่นหิน
                steelSword(120, 242, 85, 90, t),
                {}
            );
        }
        if (number === 5) {
            // Five of Swords: ผู้ครอบครอง 3 ดาบมองคู่ต่อสู้ที่เดินจากไปในลมแรง
            return g(
                drawWater(t, 230) +
                // เมฆพัดปลิวในสายลม
                path('M 45 115 Q 90 100, 150 120', { stroke: '#94a3b8', 'stroke-width': 2, fill: 'none', opacity: 0.5 }) +
                // ผู้ถือดาบด้วยรอยยิ้ม
                maleFace(95, 160, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 88 170 L 80 235 L 108 235 L 102 170 Z', { fill: '#b45309' }) +
                steelSword(110, 175, 75, -15, t) +
                steelSword(90, 185, 75, 25, t) +
                steelSword(120, 195, 70, -45, t) +
                // 2 ดาบตกอยู่บนพื้น
                steelSword(60, 248, 65, 80, t) +
                steelSword(78, 252, 65, 95, t) +
                // คู่ต่อสู้ที่พ่ายแพ้เดินหันหลังจากไป
                path('M 165 210 L 160 240 L 175 240 L 170 210 Z', { fill: '#475569' }) +
                circle(168, 205, 5, { fill: '#475569' }),
                {}
            );
        }
        if (number === 6) {
            // Six of Swords: เรือแจวข้ามสายน้ำพาดาบ 6 เล่มมุ่งสู่ฝั่งทองคำอันสงบ
            return g(
                drawHills(t, 210, 230) +
                drawWater(t, 235) +
                // แสงทองอร่ามที่ฝั่งตรงข้าม
                path('M 155 210 Q 185 200, 212 215 L 212 284 L 155 284 Z', { fill: gold, opacity: 0.35 }) +
                // เรือแจวไม้
                path('M 50 245 Q 115 260, 180 245 L 165 235 L 65 235 Z', { fill: '#78350f' }) +
                // คนพายเรือ
                line(75, 205, 60, 260, { stroke: '#d97706', 'stroke-width': 2.5 }) +
                maleFace(78, 195, 0.75, 1, '#FAD9C1', '#1e293b') +
                // แม่และเด็กคลุมผ้า
                path('M 100 215 C 95 225, 95 240, 102 245 L 125 245 C 130 240, 128 225, 120 215 Z', { fill: '#475569' }) +
                // 6 ดาบปักตั้งในลำเรือ
                steelSword(135, 215, 60, 0, t) +
                steelSword(145, 215, 60, 0, t) +
                steelSword(155, 215, 60, 0, t) +
                steelSword(138, 222, 55, 0, t) +
                steelSword(148, 222, 55, 0, t) +
                steelSword(158, 222, 55, 0, t),
                {}
            );
        }
        if (number === 7) {
            // Seven of Swords: จารชนย่องเบาถือ 5 ดาบ เหลือ 2 ดาบปักไว้
            return g(
                drawCastle(175, 155, 0.8) +
                drawHills(t, 225, 250) +
                // จารชนย่องมองย้อนหลัง
                maleFace(95, 165, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 90 175 L 82 245 L 112 245 L 105 175 Z', { fill: '#ea580c' }) +
                // 5 ดาบที่กอบโกยมาในอ้อมอก
                steelSword(110, 175, 75, -25, t) +
                steelSword(118, 178, 75, -20, t) +
                steelSword(126, 180, 75, -15, t) +
                steelSword(104, 185, 70, -30, t) +
                steelSword(98, 190, 70, -35, t) +
                // 2 ดาบปักทิ้งไว้ในค่าย
                steelSword(165, 225, 75, 0, t) +
                steelSword(180, 225, 75, 0, t),
                {}
            );
        }
        if (number === 8) {
            // Eight of Swords: สตรีในพันธนาการผ่อนคลาย ล้อมด้วย 8 ดาบ พร้อมก้าวสู่ปราสาท
            return g(
                drawCastle(65, 140, 0.75) +
                drawWater(t, 235) +
                // 8 ดาบปักรอบตัว
                steelSword(45, 195, 80, 0, t) +
                steelSword(65, 195, 80, 0, t) +
                steelSword(85, 195, 80, 0, t) +
                steelSword(155, 195, 80, 0, t) +
                steelSword(175, 195, 80, 0, t) +
                steelSword(195, 195, 80, 0, t) +
                steelSword(55, 210, 70, 0, t) +
                steelSword(185, 210, 70, 0, t) +
                // สตรีผ้าปิดตาและริบบิ้นแดงที่สามารถหลุดพ้นได้
                femaleFace(120, 165, 0.85, 0, '#FFF5ED', '#78350f') +
                rect(112, 165, 16, 4, { fill: '#ffffff' }) +
                path('M 112 175 L 105 245 L 135 245 L 128 175 Z', { fill: '#f8fafc', stroke: '#ef4444', 'stroke-width': 1.5 }),
                {}
            );
        }
        if (number === 9) {
            // Nine of Swords: ลุกขึ้นนั่งกุมขมับยามค่ำคืน 9 ดาบแขวนเรียง มีแสงดาวส่องผ่าน
            return g(
                // หน้าต่างมีดาวรุ่งประกาย
                path('M 175 140 C 175 115, 205 115, 205 140 Z', { fill: '#0f172a', stroke: gold, 'stroke-width': 1.2 }) +
                sparkle(190, 130, 4.5, '#fef08a', 1) +
                // 9 ดาบแขวนเรียงตามแนวนอนบนผนัง
                steelSword(110, 105, 65, 90, t) +
                steelSword(110, 115, 65, 90, t) +
                steelSword(110, 125, 65, 90, t) +
                steelSword(110, 135, 65, 90, t) +
                steelSword(110, 145, 65, 90, t) +
                steelSword(110, 155, 65, 90, t) +
                steelSword(110, 165, 65, 90, t) +
                steelSword(110, 175, 65, 90, t) +
                steelSword(110, 185, 65, 90, t) +
                // เตียงและผู้กุมขมับ
                rect(45, 220, 135, 35, { fill: '#334155', stroke: gold, 'stroke-width': 1.2 }) +
                maleFace(75, 195, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 70 205 L 60 235 L 95 235 L 90 205 Z', { fill: '#f8fafc' }),
                {}
            );
        }
        if (number === 10) {
            // Ten of Swords: สิ้นสุดความเจ็บปวด แสงทองอรุโณทัยวันใหม่ส่องสว่างเหนือทะเล
            return g(
                // ทะเลสงบและแสงอรุณวันใหม่
                drawWater(t, 220) +
                path('M 28 205 Q 120 185, 212 205 L 212 230 L 28 230 Z', { fill: '#fef08a', opacity: 0.85 }) +
                circle(CX, 185, 18, { fill: '#fde047', opacity: 0.5 }) +
                // บุคคลนอนสงบยามรุ่งอรุณ
                path('M 55 240 L 175 240 L 170 250 L 50 250 Z', { fill: '#dc2626' }) +
                maleFace(60, 235, 0.75, 1, '#FAD9C1', '#1e293b') +
                // 10 ดาบปักเรียงแถวบ่งบอกว่าพายุผ่านพ้นไปแล้ว
                steelSword(70, 195, 65, 0, t) +
                steelSword(80, 195, 65, 0, t) +
                steelSword(90, 195, 65, 0, t) +
                steelSword(100, 195, 65, 0, t) +
                steelSword(110, 195, 65, 0, t) +
                steelSword(120, 195, 65, 0, t) +
                steelSword(130, 195, 65, 0, t) +
                steelSword(140, 195, 65, 0, t) +
                steelSword(150, 195, 65, 0, t) +
                steelSword(160, 195, 65, 0, t),
                {}
            );
        }
    }

    // ---------------------- SUIT OF PENTACLES (เหรียญ) ----------------------
    if (suit === 'pentacles') {
        if (number === 1) {
            // Ace of Pentacles: หัตถ์สวรรค์ประคองเหรียญทองคำเหนือซุ้มประตูดอกกุหลาบ
            return g(
                drawHills(t, 220, 245) +
                path('M 55 260 L 55 210 Q 120 165, 185 210 L 185 260', { stroke: '#15803d', 'stroke-width': 6, fill: 'none' }) +
                circle(75, 205, 4.5, { fill: '#e11d48' }) +
                circle(120, 185, 4.5, { fill: '#e11d48' }) +
                circle(165, 205, 4.5, { fill: '#e11d48' }) +
                path('M 40 185 Q 75 160, 100 185 Q 120 170, 110 200 Z', { fill: '#ffffff', opacity: 0.85 }) +
                circle(CX, 145, 26, { fill: gold, opacity: 0.25 }) +
                coinPentacle(CX, 145, 20, t) +
                sparkle(CX, 118, 6, '#ffffff', 1),
                {}
            );
        }
        if (number === 2) {
            // Two of Pentacles: นักเต้นรำหมุนวงวน 2 เหรียญในสัญลักษณ์อินฟินิตี้เหนือคลื่นทะเล
            return g(
                drawWater(t, 225) +
                drawShip(55, 235, 0.6) +
                drawShip(180, 230, 0.65) +
                // วงวนอินฟินิตี้สีเขียวมรกต (Lemniscate)
                path(`M ${CX} 165 C ${CX - 40} 135, ${CX - 50} 195, ${CX} 165 C ${CX + 40} 135, ${CX + 50} 195, ${CX} 165 Z`,
                    { stroke: '#10b981', 'stroke-width': 4.5, fill: 'none' }) +
                // 2 เหรียญทองคำในวงวน
                coinPentacle(CX - 32, 165, 14, t) +
                coinPentacle(CX + 32, 165, 14, t) +
                // นักเต้นรำผู้คล่องแคล่ว
                maleFace(CX, 145, 0.85, 0, '#FAD9C1', '#78350f') +
                path(`M ${CX - 15} 158 L ${CX - 20} 225 L ${CX + 20} 225 L ${CX + 15} 158 Z`, { fill: '#ea580c' }),
                {}
            );
        }
        if (number === 3) {
            // Three of Pentacles: ประติมากรช่างสลักหินและสถาปนิกหารือใต้ 3 เหรียญทองซุ้มวิหาร
            return g(
                // เสาและซุ้มหินสลักโกธิก
                line(45, 120, 45, 260, { stroke: '#64748b', 'stroke-width': 5 }) +
                line(195, 120, 195, 260, { stroke: '#64748b', 'stroke-width': 5 }) +
                path('M 45 120 Q 120 75, 195 120', { stroke: '#64748b', 'stroke-width': 5, fill: 'none' }) +
                // 3 เหรียญตราดอกไม้สลักบนยอดซุ้ม
                coinPentacle(CX, 105, 13, t) +
                coinPentacle(CX - 22, 125, 12, t) +
                coinPentacle(CX + 22, 125, 12, t) +
                // ประติมากรช่างหินถือค้อนสิ่ว
                maleFace(80, 185, 0.8, 1, '#FAD9C1', '#334155') +
                path('M 75 195 L 68 255 L 95 255 L 90 195 Z', { fill: '#b45309' }) +
                // สถาปนิกถือม้วนแบบแปลน
                maleFace(155, 182, 0.8, -1, '#FAD9C1', '#1e293b') +
                path('M 150 192 L 142 255 L 170 255 L 165 192 Z', { fill: '#1e3a8a' }),
                {}
            );
        }
        if (number === 4) {
            // Four of Pentacles: คหบดียึดมั่น 4 เหรียญทองคำไว้แน่น หน้าเมืองอันรุ่งเรือง
            return g(
                drawCastle(120, 140, 1.1) +
                // ม้านั่งหิน
                rect(80, 220, 80, 30, { fill: '#334155', stroke: gold, 'stroke-width': 1.2 }) +
                // คหบดีสวมมงกุฎ
                maleFace(CX, 168, 0.9, 0, '#FAD9C1', '#1e293b') +
                path(`M ${CX - 22} 180 L ${CX - 28} 250 L ${CX + 28} 250 L ${CX + 22} 180 Z`, { fill: '#7f1d1d' }) +
                // 4 เหรียญทองคำ (บนศีรษะ, ในอ้อมอก, ใต้เท้า 2 ข้าง)
                coinPentacle(CX, 150, 12, t) +
                coinPentacle(CX, 195, 15, t) +
                coinPentacle(CX - 25, 252, 12, t) +
                coinPentacle(CX + 25, 252, 12, t),
                {}
            );
        }
        if (number === 5) {
            // Five of Pentacles: สองนักแสวงหาฝ่าพายุหิมะ หน้าหน้าต่าง 5 เหรียญทองสว่างอบอุ่น
            return g(
                // หน้าต่างกระจกสีเรืองแสงอบอุ่น
                path('M 85 155 C 85 110, 155 110, 155 155 Z', { fill: '#fef08a', stroke: gold, 'stroke-width': 2, opacity: 0.9 }) +
                // 5 เหรียญทองคำในกระจกสี
                coinPentacle(CX, 122, 10, t) +
                coinPentacle(CX - 18, 138, 9, t) +
                coinPentacle(CX + 18, 138, 9, t) +
                coinPentacle(CX - 12, 152, 9, t) +
                coinPentacle(CX + 12, 152, 9, t) +
                // เกล็ดหิมะโปรยปราย
                circle(60, 175, 2, { fill: '#ffffff' }) +
                circle(180, 185, 2, { fill: '#ffffff' }) +
                circle(95, 210, 2, { fill: '#ffffff' }) +
                circle(150, 225, 2, { fill: '#ffffff' }) +
                // สองผู้เดินทางในชุดคลุมฝ่าหิมะ
                path('M 75 195 C 65 210, 60 235, 68 250 L 98 250 C 105 235, 100 210, 90 195 Z', { fill: '#475569' }) +
                path('M 125 185 C 115 200, 110 235, 118 250 L 148 250 C 155 235, 150 200, 140 185 Z', { fill: '#1e293b' }),
                {}
            );
        }
        if (number === 6) {
            // Six of Pentacles: วาณิชผู้ใจบุญถือตราชู มอบเหรียญทานแก่ผู้แสวงหา
            return g(
                // วาณิชชุดแดงใจบุญ
                maleFace(CX, 155, 0.9, 0, '#FAD9C1', '#78350f') +
                path(`M ${CX - 22} 168 L ${CX - 28} 245 L ${CX + 28} 245 L ${CX + 22} 168 Z`, { fill: '#991b1b' }) +
                // ตราชูความเที่ยงธรรมในมือซ้าย
                line(CX + 35, 175, CX + 35, 205, { stroke: gold, 'stroke-width': 1.8 }) +
                line(CX + 20, 185, CX + 50, 185, { stroke: gold, 'stroke-width': 1.5 }) +
                path(`M ${CX + 15} 195 Q ${CX + 20} 200, ${CX + 25} 195 Z`, { fill: gold }) +
                path(`M ${CX + 45} 195 Q ${CX + 50} 200, ${CX + 55} 195 Z`, { fill: gold }) +
                // 6 เหรียญทองคำแห่งการเกื้อกูล
                coinPentacle(55, 130, 11, t) +
                coinPentacle(80, 120, 11, t) +
                coinPentacle(CX, 115, 12, t) +
                coinPentacle(160, 120, 11, t) +
                coinPentacle(185, 130, 11, t) +
                coinPentacle(CX - 35, 195, 11, t) + // กำลังหยิบยื่น
                // สองผู้รับความเมตตา
                maleFace(60, 215, 0.7, 1, '#FAD9C1', '#334155') +
                maleFace(175, 215, 0.7, -1, '#FAD9C1', '#334155'),
                {}
            );
        }
        if (number === 7) {
            // Seven of Pentacles: ชาวสวนพิงจอบชื่นชม 7 ผลเหรียญทองคำงอกงามบนพุ่มไม้
            return g(
                drawHills(t, 225, 250) +
                // เครือเถาพุ่มไม้เขียวขจี
                path('M 120 250 Q 150 200, 185 180 Q 200 130, 160 140 Q 130 150, 130 200 Z', { fill: '#15803d', opacity: 0.85 }) +
                // 7 เหรียญทองคำดั่งผลไม้สุกงอมบนกิ่ง
                coinPentacle(140, 150, 11, t) +
                coinPentacle(175, 150, 11, t) +
                coinPentacle(155, 175, 11, t) +
                coinPentacle(185, 185, 11, t) +
                coinPentacle(145, 205, 11, t) +
                coinPentacle(175, 215, 11, t) +
                coinPentacle(135, 245, 12, t) + // เหรียญที่เก็บเกี่ยววางที่พื้น
                // ชาวสวนพิงด้ามจอบสงบนิ่ง
                line(82, 170, 78, 255, { stroke: '#78350f', 'stroke-width': 3 }) +
                maleFace(95, 165, 0.85, 1, '#FAD9C1', '#1e293b') +
                path('M 88 175 L 80 245 L 110 245 L 105 175 Z', { fill: '#0284c7' }),
                {}
            );
        }
        if (number === 8) {
            // Eight of Pentacles: ช่างฝีมือผู้ขยันขันแข็ง สลักลวดลายลงบน 8 เหรียญทองคำ
            return g(
                // 7 เหรียญที่สลักเสร็จแล้วแขวนเรียงบนเสาไม้วิจิตร
                coinPentacle(55, 115, 11, t) +
                coinPentacle(55, 142, 11, t) +
                coinPentacle(55, 169, 11, t) +
                coinPentacle(55, 196, 11, t) +
                coinPentacle(55, 223, 11, t) +
                coinPentacle(78, 128, 11, t) +
                coinPentacle(78, 155, 11, t) +
                // โต๊ะทำงานไม้ของช่างฝีมือ
                rect(110, 215, 85, 40, { fill: '#78350f', stroke: gold, 'stroke-width': 1.2 }) +
                // ช่างแกะสลักเหรียญที่ 8 ด้วยความตั้งใจ
                maleFace(145, 165, 0.85, -1, '#FAD9C1', '#1e293b') +
                path('M 138 175 L 128 235 L 165 235 L 158 175 Z', { fill: '#b45309' }) +
                coinPentacle(135, 205, 12, t) + // เหรียญที่ 8 กำลังสลัก
                line(145, 195, 138, 202, { stroke: gold, 'stroke-width': 2 }), // สิ่วสลัก
                {}
            );
        }
        if (number === 9) {
            // Nine of Pentacles: สตรีสูงศักดิ์ในไร่องุ่นอุดมสมบูรณ์ เหยี่ยวนกเขาบนข้อมือ 9 เหรียญทอง
            return g(
                drawCastle(65, 140, 0.75) +
                drawHills(t, 225, 250) +
                // พุ่มองุ่นและเถาไม้เลื้อยงดงาม
                path('M 130 250 Q 185 200, 200 135 L 208 284 L 130 284 Z', { fill: '#15803d', opacity: 0.75 }) +
                // 9 เหรียญทองคำเรียงบนเถาองุ่น
                coinPentacle(50, 175, 10, t) +
                coinPentacle(50, 205, 10, t) +
                coinPentacle(50, 235, 10, t) +
                coinPentacle(155, 155, 10, t) +
                coinPentacle(180, 160, 10, t) +
                coinPentacle(165, 185, 10, t) +
                coinPentacle(190, 190, 10, t) +
                coinPentacle(160, 215, 10, t) +
                coinPentacle(185, 220, 10, t) +
                // สตรีสูงศักดิ์ในชุดแพรไหมทองคำ
                femaleFace(105, 155, 0.9, 1, '#FFF5ED', '#9a3412') +
                path('M 98 168 C 88 195, 82 235, 95 255 L 135 255 C 145 235, 140 195, 125 168 Z', { fill: '#fbbf24', stroke: gold, 'stroke-width': 1.2 }) +
                // เหยี่ยวล่าสัตว์ตัวเล็กเกาะบนถุงมือ
                circle(135, 175, 4.5, { fill: '#78350f' }),
                {}
            );
        }
        if (number === 10) {
            // Ten of Pentacles: ครอบครัวสุขสันต์ในคฤหาสน์ 10 เหรียญทองคำเรียงดั่งต้นไม้แห่งชีวิต
            return g(
                // ซุ้มประตูหินคฤหาสน์ตระกูลใหญ่
                path('M 40 105 Q 120 75, 200 105 L 200 284 L 40 284 Z', { fill: '#334155', opacity: 0.35 }) +
                line(48, 115, 48, 284, { stroke: gold, 'stroke-width': 2.5 }) +
                line(192, 115, 192, 284, { stroke: gold, 'stroke-width': 2.5 }) +
                // 10 เหรียญทองคำเรียงผังดวงดาวแห่งความมั่งคั่งบริบูรณ์
                coinPentacle(CX, 100, 11, t) +
                coinPentacle(CX - 28, 120, 10, t) +
                coinPentacle(CX + 28, 120, 10, t) +
                coinPentacle(CX, 138, 11, t) +
                coinPentacle(CX - 35, 155, 10, t) +
                coinPentacle(CX + 35, 155, 10, t) +
                coinPentacle(CX, 172, 11, t) +
                coinPentacle(CX - 28, 190, 10, t) +
                coinPentacle(CX + 28, 190, 10, t) +
                coinPentacle(CX, 210, 12, t) +
                // ครอบครัวและสุนัขผู้ภักดี
                maleFace(85, 205, 0.8, 1, '#FAD9C1', '#78350f') +
                femaleFace(155, 205, 0.8, -1, '#FFF5ED', '#991b1b') +
                // สุนัขคู่ใจ
                path('M 115 250 Q 125 242, 135 250 L 130 260 L 112 260 Z', { fill: '#e2e8f0' }),
                {}
            );
        }
    }

    // กรณีสำรอง: เรนเดอร์สัญลักษณ์ตามจำนวน
    return g(
        circle(CX, cy, 35, { fill: gold, opacity: 0.15 }) +
        sparkle(CX, cy, 6, gold, 0.9),
        {}
    );
}
