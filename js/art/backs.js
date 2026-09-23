/* ================================================================
   หลังไพ่ 6 ธีมเทศกาล — Modern Celestial Tarot with Moon Rabbit
   ดีไซน์แบบ Sacred Geometry ลายสมมาตร 180° หมุนกลับหัวแล้วลายไม่เปลี่ยน
   พร้อมตราสัญลักษณ์มาสคอต "น้องกระต่ายจันทรา" บนพระจันทร์เสี้ยวสีทอง
   - standard     : มนตราสยาม (Royal Plum & Radiant Gold Mandala)
   - songkran     : สงกรานต์ (Aqua Lotus & Sacred Water Droplets)
   - loy-krathong : ลอยกระทง (Midnight Indigo & Yi Peng Lanterns / Floating Lotus)
   - halloween    : ฮาโลวีน (Gothic Amethyst & Celestial Bats / Web Arches)
   - christmas    : คริสต์มาส (Emerald Pine & Solstice Snow Crystals)
   - valentine    : วาเลนไทน์ (Velvet Rose & Celestial Lovers' Knot)
   - minimalist   : มินิมอล (Obsidian & Sacred Geometry Gold Line)
   ================================================================ */

import {
    g, circle, ell, rect, rrect, line, path, poly,
    star, sparkle, heart, flame, crescent, bat, snowflake,
    drop, corners, sunburst, wave
} from './helpers.js';
import { getTheme } from './themes.js';

const W = 240, H = 380;
const CX = W / 2, CY = H / 2;

/**
 * ตราสัญลักษณ์น้องกระต่ายจันทรา (Moon Rabbit Emblem)
 * เงาสีทองอร่ามบนดวงจันทร์เสี้ยว ล้อมด้วยดาวบริวาร
 */
function moonRabbitEmblem(cx, cy, s, color, glowColor = '#ffeaa7') {
    return g(
        // รัศมีเรืองแสงจาง ๆ
        circle(cx, cy, s * 1.35, { fill: glowColor, opacity: 0.15 }) +
        // วงกลมรองหลังสีขาวบริสุทธิ์ขอบทอง
        circle(cx, cy, s * 0.95, { fill: '#FFFFFF', stroke: color, 'stroke-width': 1.4 }) +
        // พระจันทร์เสี้ยวสีทอง
        path(
            `M ${cx - s * 0.1} ${cy - s * 0.7} ` +
            `A ${s * 0.65} ${s * 0.65} 0 1 0 ${cx + s * 0.55} ${cy + s * 0.45} ` +
            `A ${s * 0.52} ${s * 0.52} 0 1 1 ${cx - s * 0.1} ${cy - s * 0.7} Z`,
            { fill: color }
        ) +
        // น้องกระต่ายจันทรา นั่งหันข้างบนส่วนโค้งของจันทร์
        // ลำตัว
        ell(cx + s * 0.08, cy + s * 0.12, s * 0.28, s * 0.32, { fill: color }) +
        // หัวกลม
        circle(cx + s * 0.18, cy - s * 0.12, s * 0.18, { fill: color }) +
        // หูยาว 2 ข้าง ลู่ไปด้านหลังเล็กน้อย
        path(
            `M ${cx + s * 0.14} ${cy - s * 0.24} ` +
            `C ${cx + s * 0.08} ${cy - s * 0.6}, ${cx + s * 0.2} ${cy - s * 0.68}, ${cx + s * 0.26} ${cy - s * 0.48} ` +
            `C ${cx + s * 0.26} ${cy - s * 0.35}, ${cx + s * 0.22} ${cy - s * 0.26}, ${cx + s * 0.18} ${cy - s * 0.24} Z`,
            { fill: color }
        ) +
        path(
            `M ${cx + s * 0.24} ${cy - s * 0.22} ` +
            `C ${cx + s * 0.24} ${cy - s * 0.56}, ${cx + s * 0.38} ${cy - s * 0.62}, ${cx + s * 0.38} ${cy - s * 0.44} ` +
            `C ${cx + s * 0.36} ${cy - s * 0.34}, ${cx + s * 0.3} ${cy - s * 0.24}, ${cx + s * 0.26} ${cy - s * 0.22} Z`,
            { fill: color }
        ) +
        // หางฟูปุ๊กปิ๊ก
        circle(cx - s * 0.18, cy + s * 0.26, s * 0.09, { fill: color }) +
        // ดวงดาวประกายส่องสว่างเบื้องหน้าน้องกระต่าย
        sparkle(cx + s * 0.55, cy - s * 0.25, s * 0.22, glowColor, 0.95) +
        circle(cx - s * 0.45, cy - s * 0.35, s * 0.05, { fill: color, opacity: 0.8 }) +
        circle(cx + s * 0.42, cy + s * 0.52, s * 0.05, { fill: color, opacity: 0.8 }),
        {}
    );
}

/**
 * ลายดอกบัวกนก (Lotus Kanok Petals) เรียงเป็นวงกลม
 */
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

/**
 * ลวดลาย Sacred Mandala แกนกลาง สำหรับหลังไพ่
 */
function sacredMandala(cx, cy, radius, t) {
    const gold = t.frame;
    const goldSoft = t.frameSoft;
    const sparkleColor = t.sparkle;

    return g(
        // วงแหวนเรขาคณิตชั้นนอกสุด
        circle(cx, cy, radius, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
        circle(cx, cy, radius - 6, { fill: 'none', stroke: gold, 'stroke-width': 1.8, 'stroke-dasharray': '3 3' }) +
        circle(cx, cy, radius - 14, { fill: 'none', stroke: goldSoft, 'stroke-width': 1 }) +

        // ดาว 16 แฉกรอบนอก
        star(cx, cy, radius - 2, radius - 12, 16, 0, { fill: 'none', stroke: gold, 'stroke-width': 0.8, opacity: 0.7 }) +

        // กลีบกนกดอกบัว 12 กลีบ
        lotusRing(cx, cy, radius - 26, 12, 5, gold, 12, 0.75) +

        // วงแหวนชั้นในสีขาวนวล
        circle(cx, cy, radius - 28, { fill: '#FFFFFF', stroke: gold, 'stroke-width': 1.5 }) +
        circle(cx, cy, radius - 33, { fill: 'none', stroke: goldSoft, 'stroke-width': 1 }) +

        // ดาว 8 แฉกหลัก (Octagram of Celestial Guidance)
        star(cx, cy, radius - 32, (radius - 32) * 0.42, 8, -90, { fill: 'none', stroke: gold, 'stroke-width': 1.4 }) +
        star(cx, cy, radius - 32, (radius - 32) * 0.42, 8, -67.5, { fill: 'none', stroke: goldSoft, 'stroke-width': 0.8, opacity: 0.6 }) +

        // ตราสัญลักษณ์กระต่ายจันทรา ณ ศูนย์กลางมันดาลา
        moonRabbitEmblem(cx, cy, radius * 0.38, gold, sparkleColor) +

        // ดวงดาวประกายประดับ 8 ทิศ
        [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = (a * Math.PI) / 180;
            const dist = radius - 8;
            return sparkle(cx + dist * Math.cos(rad), cy + dist * Math.sin(rad), 3.5, sparkleColor, 0.85);
        }).join(''),
        {}
    );
}

/**
 * ลายเทศกาลสมมาตรบน-ล่าง (Top & Bottom Celestial Shrines)
 */
function festivalFlourishes(t) {
    const gold = t.frame;
    const goldSoft = t.frameSoft;
    const topY = 82;
    const botY = H - 82;

    switch (t.corner) {
        case 'drop': // สงกรานต์: ดอกบัววารี + หยดน้ำมนตรา
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 24, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
                    lotusRing(CX, cy, 14, 9, 4, gold, 8, 0.85) +
                    drop(CX, cy, 12, { fill: t.sparkle, opacity: 0.9 }) +
                    sparkle(CX - 38, cy, 4, t.sparkle) +
                    sparkle(CX + 38, cy, 4, t.sparkle) +
                    wave(cy + (rot ? -18 : 18), W - 70, t.sparkle, 0.4, 4, 30),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        case 'lantern': // ลอยกระทง: โคมลอยยี่เป็ง + กระทงบงกชสวรรค์
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 22, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
                    // โคมลอยทองอร่าม
                    path(`M ${CX - 12} ${cy + 8} C ${CX - 14} ${cy - 10}, ${CX - 7} ${cy - 18}, ${CX} ${cy - 18} C ${CX + 7} ${cy - 18}, ${CX + 14} ${cy - 10}, ${CX + 12} ${cy + 8} Z`, { fill: gold, opacity: 0.9 }) +
                    circle(CX, cy - 4, 4, { fill: '#fff3c4' }) +
                    sparkle(CX - 40, cy - 6, 4.5, t.sparkle) +
                    sparkle(CX + 40, cy - 6, 4.5, t.sparkle) +
                    sparkle(CX, cy + 18, 3, t.sparkle, 0.7),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        case 'bat': // ฮาโลวีน: ซุ้มตาข่ายเรขาคณิตโกธิค + ค้างคาวทอง
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 24, { fill: 'none', stroke: goldSoft, 'stroke-width': 1 }) +
                    star(CX, cy, 20, 8, 8, 0, { fill: 'none', stroke: gold, 'stroke-width': 1 }) +
                    bat(CX, cy, 14, gold) +
                    sparkle(CX - 42, cy, 4, t.sparkle, 0.8) +
                    sparkle(CX + 42, cy, 4, t.sparkle, 0.8),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        case 'snow': // คริสต์มาส: เกล็ดหิมะเรขาคณิต 6 แฉก + ดาวประกาย
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 26, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
                    snowflake(CX, cy, 20, gold) +
                    sparkle(CX - 44, cy, 5, '#ffffff', 0.9) +
                    sparkle(CX + 44, cy, 5, '#ffffff', 0.9) +
                    circle(CX, cy, 3, { fill: t.suitGold }),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        case 'heart': // วาเลนไทน์: เงื่อนรักศักดิ์สิทธิ์ (Sacred Lovers' Knot) + กุหลาบ
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 26, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
                    heart(CX, cy - 3, 16, { fill: 'none', stroke: gold, 'stroke-width': 1.6 }) +
                    heart(CX, cy + 3, 16, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2, transform: `rotate(180 ${CX} ${cy})` }) +
                    circle(CX, cy, 3.5, { fill: gold }) +
                    sparkle(CX - 40, cy, 4.5, t.sparkle) +
                    sparkle(CX + 40, cy, 4.5, t.sparkle),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        case 'line': // มินิมอล: เรขาคณิตเส้นสายบริสุทธิ์
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 20, { fill: 'none', stroke: gold, 'stroke-width': 1.2 }) +
                    poly(`${CX},${cy - 16} ${CX + 14},${cy + 10} ${CX - 14},${cy + 10}`, { fill: 'none', stroke: goldSoft, 'stroke-width': 1 }) +
                    circle(CX, cy, 3, { fill: gold }),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');

        default: // สยามคลาสสิก: ดาวประกาย 8 แฉก + ดอกพุดตานกนก
            return [topY, botY].map((cy, idx) => {
                const rot = idx === 1 ? 180 : 0;
                return g(
                    circle(CX, cy, 26, { fill: 'none', stroke: goldSoft, 'stroke-width': 1.2 }) +
                    circle(CX, cy, 22, { fill: 'none', stroke: gold, 'stroke-width': 1.5, 'stroke-dasharray': '2 2' }) +
                    star(CX, cy, 18, 7, 8, -90, { fill: gold, opacity: 0.9 }) +
                    circle(CX, cy, 4, { fill: t.bg[0] }) +
                    sparkle(CX - 42, cy, 4.5, t.sparkle) +
                    sparkle(CX + 42, cy, 4.5, t.sparkle) +
                    path(`M ${CX - 28} ${cy + 16} Q ${CX} ${cy + 24}, ${CX + 28} ${cy + 16}`, { stroke: goldSoft, 'stroke-width': 1, fill: 'none' }),
                    { transform: `rotate(${rot} ${CX} ${cy})` }
                );
            }).join('');
    }
}

/**
 * พื้นหลังลายตารางดาวระยิบระยับ (Constellation Field)
 */
function starGridField(t) {
    let out = '';
    const stepX = 26;
    const stepY = 26;
    for (let y = 30; y <= H - 30; y += stepY) {
        for (let x = 30; x <= W - 30; x += stepX) {
            // เว้นพื้นที่ตรงกลางสำหรับมันดาลา
            const dx = x - CX;
            const dy = y - CY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 64) continue;
            // เว้นพื้นที่ด้านบนและล่างสำหรับยอดซุ้ม
            if (Math.abs(x - CX) < 40 && (Math.abs(y - 82) < 32 || Math.abs(y - (H - 82)) < 32)) continue;

            const isMajor = (x + y) % 52 === 0;
            if (isMajor) {
                out += sparkle(x, y, 2.5, t.sparkle, 0.45);
            } else {
                out += circle(x, y, 0.9, { fill: t.sparkle, opacity: 0.3 });
            }
        }
    }
    return out;
}

/**
 * เรนเดอร์หลังไพ่เต็มรูปแบบ
 */
export function renderBack(deckId = 'standard') {
    const t = getTheme(deckId);
    const uid = `ttb_${deckId}`;

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="หลังไพ่ทาโรต์ ${t.label}">
<defs>
    <!-- การไล่เฉดสีพื้นหลังมนตราพรีเมียม -->
    <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${t.bg[0]}"/>
        <stop offset="50%" stop-color="${t.bg[1]}"/>
        <stop offset="100%" stop-color="${t.bg[0]}"/>
    </linearGradient>
    <radialGradient id="${uid}coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${t.frame}" stop-opacity="0.28"/>
        <stop offset="60%" stop-color="${t.frame}" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="${t.frame}" stop-opacity="0"/>
    </radialGradient>
</defs>

<!-- พื้นหลัง -->
<rect width="${W}" height="${H}" rx="14" fill="url(#${uid}bg)"/>

<!-- ออร่าเรืองแสงตรงกลาง -->
<circle cx="${CX}" cy="${CY}" r="90" fill="url(#${uid}coreGlow)"/>

<!-- ละอองดวงดาวกลุ่มดาว -->
<g>${starGridField(t)}</g>

<!-- กรอบนอกสองชั้นสไตล์อาร์ตนูโว -->
<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="10" fill="none" stroke="${t.frame}" stroke-width="1.8"/>
<rect x="11" y="11" width="${W - 22}" height="${H - 22}" rx="7" fill="none" stroke="${t.frameSoft}" stroke-width="1"/>
<rect x="15" y="15" width="${W - 30}" height="${H - 30}" rx="5" fill="none" stroke="${t.frameSoft}" stroke-width="0.75" stroke-dasharray="4 2"/>

<!-- ลวดลายกนกประจำ 4 มุม -->
${corners(t.corner, W, H, 17, 24, t.frame)}

<!-- ลวดลายซุ้มบนและล่างตามเทศกาล -->
${festivalFlourishes(t)}

<!-- เส้นแกนเชื่อมจักรวาล (Celestial Axis Lines) -->
<line x1="${CX}" y1="36" x2="${CX}" y2="115" stroke="${t.frameSoft}" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="${CX}" y1="265" x2="${CX}" y2="${H - 36}" stroke="${t.frameSoft}" stroke-width="1" stroke-dasharray="3 3"/>
<line x1="28" y1="${CY}" x2="52" y2="${CY}" stroke="${t.frameSoft}" stroke-width="1"/>
<line x1="${W - 52}" y1="${CY}" x2="${W - 28}" y2="${CY}" stroke="${t.frameSoft}" stroke-width="1"/>

<!-- มันดาลาศักดิ์สิทธิ์พร้อมน้องกระต่ายจันทรา -->
${sacredMandala(CX, CY, 60, t)}

</svg>`;
}
