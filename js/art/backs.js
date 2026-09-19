/* ================================================================
   หลังไพ่ 6 แบบตามเทศกาล — original cartoon SVG
   ลายหลังไพ่เป็นแพทเทิร์นเรขาคณิต/โมทีฟวาดขึ้นเองทั้งหมด
   - standard     : กนก-ดาวทองบนม่วงคราม (มนตราสยาม)
   - songkran     : หยดน้ำ + คลื่นบนฟ้าสงกรานต์
   - loy-krathong  : กระทง + โคมลอย + คลื่นน้ำยามค่ำ
   - halloween    : ค้างคาว + จันทร์ส้ม + ตาข่ายปริศนา
   - christmas    : เกล็ดหิมะ + ของขวัญผูกริบบิ้น
   - valentine    : หัวใจซ้อนวงรีชมพู
   - minimalist   : เส้นสามเหลี่ยมเรียบ
   ================================================================ */
import { g, circle, ell, rect, rrect, line, path, poly, star, sparkle, heart, flame, crescent, bat, snowflake, wave, drop, corners, sunburst } from './helpers.js';
import { getTheme } from './themes.js';

const W = 240, H = 380;

/** กระทง — กาบกล้วยรูปดอกบัว + เทียน + ธูปสามดอก */
function krathong(cx, cy, s, t) {
    return g(
        // กลีบกาบกล้วยชั้นล่าง
        [0, 60, 120, 180, 240, 300].map(a =>
            g(ell(0, -s * 0.5, s * 0.2, s * 0.55, { fill: '#7aa85a' }), { transform: `rotate(${a})` })
        ).join('') +
        // กลีบชั้นบน
        [30, 90, 150, 210, 270, 330].map(a =>
            g(ell(0, -s * 0.42, s * 0.15, s * 0.4, { fill: '#8fbe6a' }), { transform: `rotate(${a})` })
        ).join('') +
        // ฐาน
        ell(0, 0, s * 0.72, s * 0.3, { fill: '#c9a05a' }) +
        ell(0, -s * 0.05, s * 0.55, s * 0.18, { fill: '#e0bb7d' }) +
        // เทียน
        rrect(-s * 0.06, -s * 0.75, s * 0.12, s * 0.5, s * 0.05, { fill: '#f2ead8' }) +
        path(`M 0 ${-s * 0.85} C ${s * 0.12} ${-s * 1.0}, ${s * 0.1} ${-s * 1.15}, 0 ${-s * 1.22} C ${-s * 0.1} ${-s * 1.15}, ${-s * 0.12} ${-s * 1.0}, 0 ${-s * 0.85} Z`, { fill: '#f6b73c' }) +
        // ธูป 3 ดอก
        line(-s * 0.3, -s * 0.3, -s * 0.42, -s * 0.95, { stroke: '#8a6b4f', 'stroke-width': 2 }) +
        line(0, -s * 0.32, 0, -s * 1.05, { stroke: '#8a6b4f', 'stroke-width': 2 }) +
        line(s * 0.3, -s * 0.3, s * 0.42, -s * 0.95, { stroke: '#8a6b4f', 'stroke-width': 2 }) +
        // จุดไฟธูป
        sparkle(-s * 0.42, -s * 1.0, 3, '#ffb54f', 0.9) + sparkle(0, -s * 1.1, 3.5, '#ffb54f', 0.9) + sparkle(s * 0.42, -s * 1.0, 3, '#ffb54f', 0.9),
        { transform: `translate(${cx} ${cy})` }
    );
}

/** โคมลอย (ยี่เป็ง) */
function skyLantern(cx, cy, s, fill, opacity = 0.9) {
    return g(
        path(`M ${-s * 0.55} ${s * 0.4} C ${-s * 0.62} ${-s * 0.35}, ${-s * 0.3} ${-s * 0.7}, 0 ${-s * 0.7} C ${s * 0.3} ${-s * 0.7}, ${s * 0.62} ${-s * 0.35}, ${s * 0.55} ${s * 0.4} Q 0 ${s * 0.62}, ${-s * 0.55} ${s * 0.4} Z`, { fill, opacity }) +
        line(0, s * 0.5, 0, s * 0.75, { stroke: fill, 'stroke-width': 1.5, opacity: opacity * 0.8 }) +
        circle(0, -s * 0.25, s * 0.16, { fill: '#fff3c4', opacity: opacity * 0.85 }),
        { transform: `translate(${cx} ${cy})` }
    );
}

/** ฟักทองฮาโลวีน */
function jackOLantern(cx, cy, s, t) {
    return g(
        ell(0, 0, s, s * 0.82, { fill: '#e8862e' }) +
        ell(-s * 0.42, 0, s * 0.34, s * 0.74, { fill: '#f2953c' }) +
        ell(s * 0.42, 0, s * 0.34, s * 0.74, { fill: '#f2953c' }) +
        rrect(-s * 0.09, -s * 1.05, s * 0.18, s * 0.3, s * 0.08, { fill: '#5e7c42' }) +
        poly(` ${-s * 0.42},${-s * 0.18} ${-s * 0.18},${-s * 0.18} ${-s * 0.3},${-s * 0.44}`, { fill: '#3b2a20' }) +
        poly(`${s * 0.18},${-s * 0.18} ${s * 0.42},${-s * 0.18} ${s * 0.3},${-s * 0.44}`, { fill: '#3b2a20' }) +
        poly(` ${-s * 0.5},${s * 0.14} ${-s * 0.2},${s * 0.14} ${-s * 0.35},${s * 0.32}`, { fill: '#3b2a20' }) +
        poly(`${s * 0.2},${s * 0.14} ${s * 0.5},${s * 0.14} ${s * 0.35},${s * 0.32}`, { fill: '#3b2a20' }) +
        path(`M ${-s * 0.3} ${s * 0.42} L ${-s * 0.16} ${s * 0.3} L ${-s * 0.06} ${s * 0.42} L ${s * 0.06} ${s * 0.3} L ${s * 0.16} ${s * 0.42} L ${s * 0.3} ${s * 0.3} L ${s * 0.34} ${s * 0.5} L ${-s * 0.34} ${s * 0.5} Z`, { fill: '#3b2a20' }) +
        flame(0, -s * 0.62, s * 0.14, { fill: '#ffd166', opacity: 0.85 }),
        { transform: `translate(${cx} ${cy})` }
    );
}

/** ของขวัญผูกริบบิ้น */
function gift(cx, cy, s, box, ribbon) {
    return g(
        rrect(-s, -s * 0.85, s * 2, s * 1.7, s * 0.18, { fill: box }) +
        rrect(-s, -s * 0.16, s * 2, s * 0.32, 0, { fill: ribbon }) +
        rrect(-s * 0.16, -s * 0.85, s * 0.32, s * 1.7, 0, { fill: ribbon }) +
        path(`M 0 ${-s * 0.85} C ${-s * 0.55} ${-s * 1.45}, ${-s * 0.05} ${-s * 1.5}, 0 ${-s * 1.05} C ${s * 0.05} ${-s * 1.5}, ${s * 0.55} ${-s * 1.45}, 0 ${-s * 0.85} Z`, { fill: ribbon }),
        { transform: `translate(${cx} ${cy})` }
    );
}

/* ---------- ลายกลางหลังไพ่ของแต่ละเทศกาล ---------- */
function centerEmblem(t) {
    switch (t.corner) {
        case 'drop': // สงกรานต์ — หยดน้ำในวงแหวน + ดวงอาทิตย์สงกรานต์
            return g(
                circle(120, 168, 62, { fill: 'rgba(255,255,255,0.12)' }) +
                circle(120, 168, 62, { fill: 'none', stroke: t.frame, 'stroke-width': 2 }) +
                sunburst(120, 168, 76, t.frame, 12, 2) +
                circle(120, 168, 10, { fill: '#f6d98a' }) +
                drop(120, 196, 24, { fill: '#bfeaf7', opacity: 0.95 }) +
                sparkle(120, 190, 7, '#ffffff', 0.9) +
                wave(272, W, '#dff4fc', 0.5) + wave(288, W, '#dff4fc', 0.3),
                {}
            );
        case 'lantern': // ลอยกระทง — กระทงกลางสายน้ำ + โคมลอย
            return g(
                crescent(52, 56, 16, '#f2e9c8') +
                skyLantern(178, 52, 26, '#ffcf7a') + skyLantern(52, 108, 20, '#ffcf7a', 0.75) + skyLantern(192, 118, 16, '#ffcf7a', 0.6) +
                krathong(120, 210, 58, t) +
                ell(120, 282, 82, 16, { fill: '#3f6fb5', opacity: 0.5 }) +
                ell(120, 282, 54, 10, { fill: '#5a8fd0', opacity: 0.5 }) +
                wave(312, W, '#9fc8f0', 0.55) + wave(328, W, '#9fc8f0', 0.35),
                {}
            );
        case 'bat': // ฮาโลวีน — จันทร์ส้ม + ค้างคาว + ฟักทอง
            return g(
                circle(120, 150, 58, { fill: '#f2953c' }) +
                circle(104, 136, 9, { fill: '#5e3a1e', opacity: 0.85 }) + circle(138, 136, 9, { fill: '#5e3a1e', opacity: 0.85 }) +
                path('M 96 168 Q 120 182, 144 168', { stroke: '#5e3a1e', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }) +
                bat(48, 84, 14, '#2a1a3e') + bat(196, 100, 12, '#2a1a3e') + bat(60, 250, 11, '#2a1a3e') + bat(190, 236, 13, '#2a1a3e') +
                jackOLantern(120, 292, 34, t) +
                sparkle(36, 160, 5, t.sparkle, 0.7) + sparkle(206, 170, 5, t.sparkle, 0.7),
                {}
            );
        case 'snow': // คริสต์มาส — พวงมาลัยเกล็ดหิมะ + ของขวัญ + ดาว
            const ribbon = t.ribbon || '#c0392b';
            return g(
                star(120, 74, 26, 10, 5, -90, { fill: '#f1c40f' }) +
                snowflake(120, 170, 44, t.frame) +
                snowflake(48, 110, 20, t.frame) + snowflake(196, 122, 20, t.frame) +
                snowflake(52, 240, 20, t.frame) + snowflake(190, 232, 20, t.frame) +
                gift(120, 300, 40, ribbon, t.frame) +
                sparkle(30, 176, 5, '#ffffff', 0.7) + sparkle(212, 180, 5, '#ffffff', 0.7),
                {}
            );
        case 'heart': // วาเลนไทน์ — หัวใจซ้อน + ลูกศรคิวปิดองค์
            return g(
                ell(120, 168, 84, 62, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 2 }) +
                ell(120, 168, 64, 46, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1.4 }) +
                heart(120, 160, 44, { fill: '#e35d6a' }) +
                heart(120, 158, 30, { fill: '#f28598' }) +
                sparkle(112, 146, 6, '#ffffff', 0.95) +
                line(58, 108, 182, 232, { stroke: t.frame, 'stroke-width': 3.5, 'stroke-linecap': 'round' }) +
                poly('182,232 166,226 174,214', { fill: t.frame }) +
                path('M 52 100 C 66 92, 70 104, 58 112 C 50 116, 46 106, 52 100 Z', { fill: t.frame }) +
                path('M 188 240 C 174 248, 170 236, 182 228 C 190 224, 194 234, 188 240 Z', { fill: t.frame }) +
                [[40, 84], [206, 96], [36, 268], [200, 272], [128, 52]].map(p => heart(p[0], p[1], 9, t.sparkle)).map(s => g(s, { opacity: 0.5 })).join(''),
                {}
            );
        case 'line': // มินิมอล — สามเหลี่ยมซ้อน
            return g(
                poly('120,96 196,232 44,232', { fill: 'none', stroke: t.frame, 'stroke-width': 2 }) +
                poly('120,132 170,220 70,220', { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1.4 }) +
                circle(120, 176, 4, { fill: t.frame }),
                {}
            );
        default: // มนตราสยาม — ดาวแปดแฉกในวงกนก + ประจุดาวเล็ก
            return g(
                circle(120, 168, 64, { fill: 'none', stroke: t.frameSoft, 'stroke-width': 1.6 }) +
                circle(120, 168, 56, { fill: 'none', stroke: t.frame, 'stroke-width': 2, 'stroke-dasharray': '10 5' }) +
                star(120, 168, 40, 17, 8, -90, { fill: t.frame, opacity: 0.95 }) +
                star(120, 168, 22, 9, 8, -90, { fill: t.bg[1], opacity: 0.9 }) +
                circle(120, 168, 6, { fill: t.frame }) +
                sparkle(120, 96, 7, t.frame, 0.9) +
                [[40, 100], [200, 110], [34, 240], [204, 236], [120, 280]].map(p => sparkle(p[0], p[1], 4.5, t.sparkle, 0.6)).join(''),
                {}
            );
    }
}

/** เรนเดอร์หลังไพ่ของธีม */
export function renderBack(deckId = 'standard') {
    const t = getTheme(deckId);
    const uid = `ttb${deckId}`;

    // ลายพื้นเรขาคณิตจาง ๆ ตามธีม
    let field = '';
    const step = 30;
    for (let y = step; y < H; y += step) {
        for (let x = step; x < W; x += step) {
            const off = (Math.round(y / step) % 2) * (step / 2);
            switch (t.corner) {
                case 'drop': field += drop(x + off, y, 5, t.sparkle); break;
                case 'lantern': field += sparkle(x + off, y, 3.5, t.sparkle); break;
                case 'bat': field += sparkle(x + off, y, 4, t.sparkle); break;
                case 'snow': field += sparkle(x + off, y, 3, t.sparkle); break;
                case 'heart': field += heart(x + off, y, 4.5, t.sparkle); break;
                case 'line': field += ''; break;
                default: field += star(x + off, y, 3.4, 1.4, 4, -90, { fill: t.sparkle });
            }
        }
    }

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="หลังไพ่ ${t.label}">
<defs>
<linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/>
</linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#${uid}bg)"/>
<g opacity="0.13">${field}</g>
<rect x="5" y="5" width="${W - 10}" height="${H - 10}" rx="11" fill="none" stroke="${t.frame}" stroke-width="2"/>
<rect x="12" y="12" width="${W - 24}" height="${H - 24}" rx="8" fill="none" stroke="${t.frameSoft}" stroke-width="1"/>
${corners(t.corner, W, H, 17, 26, t.frame)}
${centerEmblem(t)}
</svg>`;
}
