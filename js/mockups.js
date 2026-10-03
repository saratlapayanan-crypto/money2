/* ================================================================
   Mockup 20 แนวสไตล์ไพ่ — เพื่อให้ทีมเลือกทิศทางศิลป์
   ทุกภาพเป็น original SVG วาดด้วยโค้ด (ปลอดลิขสิทธิ์)
   องค์ประกอบร่วม: หญิงสาวนั่งสงบ + วัตถุสัญลักษณ์ + จันทร์/วัด
   (ใกล้เคียงภาพอ้างอิง storybook ไทย-แฟนตาซีที่ให้มา)
   ================================================================ */
import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, lotus, flame, drop, crescent,
    snowflake, wave, sunburst, kanokCorner, face
} from './art/helpers.js';

const W = 200, H = 320;

/* ---------- องค์ประกอบร่วม ---------- */

/** หญิงสาวนั่งสงบ (มี/ไม่มีเส้นขอบ ปรับได้) */
function maiden(cx, cy, s, o) {
    const skin = o.skin || '#ffd9b3';
    const hair = o.hair || '#20304a';
    const robe = o.robe || '#7a4a9e';
    const st = o.stroke ? { stroke: o.stroke, 'stroke-width': o.sw || 2.5 } : {};
    const stT = o.stroke ? { stroke: o.stroke, 'stroke-width': o.sw || 2.5, fill: 'none' } : { fill: 'none' };
    return g(
        // ผ้าคลุม/ชุดนั่ง
        path(`M ${cx} ${cy - s * 0.1} C ${cx - s * 0.95} ${cy + s * 0.1}, ${cx - s * 1.05} ${cy + s * 0.85}, ${cx - s * 0.85} ${cy + s} L ${cx + s * 0.85} ${cy + s} C ${cx + s * 1.05} ${cy + s * 0.85}, ${cx + s * 0.95} ${cy + s * 0.1}, ${cx} ${cy - s * 0.1} Z`, { fill: robe, ...st }) +
        // หน้า
        circle(cx, cy - s * 0.38, s * 0.3, { fill: skin, ...st }) +
        // ผมยาว
        path(`M ${cx - s * 0.32} ${cy - s * 0.42} C ${cx - s * 0.5} ${cy - s * 0.85}, ${cx + s * 0.5} ${cy - s * 0.85}, ${cx + s * 0.32} ${cy - s * 0.42} C ${cx + s * 0.4} ${cy - s * 0.05}, ${cx + s * 0.3} ${cy + s * 0.1}, ${cx + s * 0.25} ${cy + s * 0.12} L ${cx - s * 0.25} ${cy + s * 0.12} C ${cx - s * 0.3} ${cy + s * 0.1}, ${cx - s * 0.4} ${cy - s * 0.05}, ${cx - s * 0.32} ${cy - s * 0.42} Z`, { fill: hair, ...st }) +
        // ตาปิดสงบ (เส้นโค้ง)
        path(`M ${cx - s * 0.18} ${cy - s * 0.36} Q ${cx - s * 0.1} ${cy - s * 0.3}, ${cx - s * 0.02} ${cy - s * 0.36}`, stT) +
        path(`M ${cx + s * 0.02} ${cy - s * 0.36} Q ${cx + s * 0.1} ${cy - s * 0.3}, ${cx + s * 0.18} ${cy - s * 0.36}`, stT) +
        // ริมฝีปากนิ่ง ๆ
        line(cx - s * 0.04, cy - s * 0.24, cx + s * 0.04, cy - s * 0.24, { stroke: o.stroke || hair, 'stroke-width': 1.5 }) +
        // มือประนม
        circle(cx, cy + s * 0.05, s * 0.14, { fill: skin, ...st }),
        {}
    );
}

/** ถ้วยน้ำ (สายน้ำใสวิเศษ) */
function silverBowl(cx, cy, s, o = {}) {
    const st = o.stroke ? { stroke: o.stroke, 'stroke-width': 2 } : {};
    return g(
        path(`M ${cx - s} ${cy} Q ${cx} ${cy + s * 0.9}, ${cx + s} ${cy} L ${cx + s * 0.8} ${cy - s * 0.15} L ${cx - s * 0.8} ${cy - s * 0.15} Z`, { fill: o.metal || '#cfd8e6', ...st }) +
        ell(cx, cy - s * 0.1, s * 0.8, s * 0.18, { fill: o.water || '#8fd0e8', ...st }) +
        sparkle(cx - s * 0.3, cy - s * 0.35, s * 0.2, '#ffffff'),
        {}
    );
}

/** กระทงดอกบัว */
function lanternLotus(cx, cy, s, o = {}) {
    const st = o.stroke ? { stroke: o.stroke, 'stroke-width': 2 } : {};
    return g(
        lotus(cx, cy, s, o.petal || '#7aa85a', o.center || '#f5c86a', 8) +
        flame(cx, cy - s * 0.55, s * 0.3, { fill: o.fire || '#f6b73c', ...st }),
        {}
    );
}

/** แมวดำนั่ง */
function blackCat(cx, cy, s, o = {}) {
    const fur = o.fur || '#1e1b26';
    const st = o.stroke ? { stroke: o.stroke, 'stroke-width': 2 } : {};
    return g(
        path(`M ${cx - s * 0.6} ${cy} Q ${cx - s * 0.7} ${cy - s * 0.9}, ${cx} ${cy - s * 0.85} Q ${cx + s * 0.7} ${cy - s * 0.9}, ${cx + s * 0.6} ${cy} Z`, { fill: fur, ...st }) +
        circle(cx, cy - s * 0.95, s * 0.34, { fill: fur, ...st }) +
        poly(`${cx - s * 0.3},${cy - s * 1.2} ${cx - s * 0.1},${cy - s * 1.42} ${cx - s * 0.05},${cy - s * 1.12}`, { fill: fur, ...st }) +
        poly(`${cx + s * 0.3},${cy - s * 1.2} ${cx + s * 0.1},${cy - s * 1.42} ${cx + s * 0.05},${cy - s * 1.12}`, { fill: fur, ...st }) +
        circle(cx - s * 0.12, cy - s, s * 0.05, { fill: o.eye || '#f6d98a' }) +
        circle(cx + s * 0.12, cy - s, s * 0.05, { fill: o.eye || '#f6d98a' }) +
        path(`M ${cx - s * 0.3} ${cy + s * 0.05} Q ${cx - s * 0.55} ${cy - s * 0.35}, ${cx - s * 0.5} ${cy - s * 0.7}`, { fill: 'none', stroke: fur, 'stroke-width': s * 0.16, 'stroke-linecap': 'round' }),
        {}
    );
}

/** ดาววิเศษเรืองแสง */
function glowStar(cx, cy, s, o = {}) {
    return g(
        circle(cx, cy, s * 1.5, { fill: o.halo || '#f6d98a', opacity: 0.22 }) +
        circle(cx, cy, s * 0.95, { fill: o.halo || '#f6d98a', opacity: 0.25 }) +
        star(cx, cy, s, s * 0.4, 8, -90, { fill: o.fill || '#f2d48a' }),
        {}
    );
}

/** เส้นขอบฟ้าวัด/เจดีย์ */
function skyline(cx, baseY, w, color, opacity = 1) {
    const l = cx - w / 2, r = cx + w / 2;
    return g(
        rect(l, baseY - 10, w, 10, { fill: color, opacity }) +
        // เจดีย์กลาง
        poly(`${cx - 8},${baseY - 10} ${cx},${baseY - 40} ${cx + 8},${baseY - 10}`, { fill: color, opacity }) +
        circle(cx, baseY - 42, 3, { fill: color, opacity }) +
        // ปราสาทข้าง ๆ
        poly(`${l + 14},${baseY - 10} ${l + 19},${baseY - 28} ${l + 24},${baseY - 10}`, { fill: color, opacity }) +
        poly(`${r - 24},${baseY - 10} ${r - 19},${baseY - 28} ${r - 14},${baseY - 10}`, { fill: color, opacity }),
        {}
    );
}

/** ท้องฟ้าดาวกระจาย */
function starsBG(color, n = 14, seed = 7) {
    let out = '';
    let x = seed * 13 % W, y = seed * 29 % H;
    for (let i = 0; i < n; i++) {
        x = (x * 37 + 11) % (W - 20); y = (y * 53 + 29) % (H - 40);
        out += sparkle(10 + x, 14 + y, 2 + ((i * seed) % 3), color, 0.5 + ((i % 3) * 0.15));
    }
    return out;
}

/** กรอบไพ่พื้นฐาน (มุมมน) */
function baseFrame(stroke, fill = 'none', rx = 10, inset = 6, sw = 2.5) {
    return rrect(inset, inset, W - inset * 2, H - inset * 2, rx, { fill, stroke, 'stroke-width': sw });
}

/** ซุ้มโค้งแหลมปลายบุปผา (arch + lotus finial) สไตล์ภาพอ้างอิง */
function pointedArch(color, sw = 3) {
    const cx = W / 2;
    return g(
        // เสาซ้าย-ขวา
        line(34, 300, 34, 150, { stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }) +
        line(W - 34, 300, W - 34, 150, { stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round' }) +
        // โค้งโดม
        path(`M 34 150 Q 34 74, ${cx} 66 Q ${W - 34} 74, ${W - 34} 150`, { fill: 'none', stroke: color, 'stroke-width': sw }) +
        // ยอดปลายดอกบัว
        poly(`${cx - 7},68 ${cx},44 ${cx + 7},68`, { fill: color }) +
        circle(cx, 40, 4, { fill: color }) +
        // จุดประดับเสา
        circle(34, 160, 4, { fill: color }) + circle(W - 34, 160, 4, { fill: color }),
        {}
    );
}

/** เส้นแรเงาเอียง 45° ในกรอบสี่เหลี่ยม (clip) */
function hatch(x, y, w, h, gap, stroke, sw = 1) {
    const uid = 'h' + Math.random().toString(36).slice(2, 8);
    let d = '';
    for (let k = -h; k < w; k += gap) {
        d += `M ${x + k} ${y + h} L ${x + k + h} ${y} `;
    }
    return `<clipPath id="${uid}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>` +
        g(path(d, { stroke, 'stroke-width': sw, fill: 'none' }), { 'clip-path': `url(#${uid})` });
}

/* ================================================================
   20 แนวสไตล์ — แต่ละแนวคืน SVG string เต็มการ์ด
   ================================================================ */

const STYLES = [

    // 1 — จันทราทอง (ใกล้ภาพอ้างอิงมากที่สุด: storybook กรมท่า-ทอง)
    {
        id: 'golden-moon', name: 'จันทราทอง (Storybook ไทย)',
        desc: 'ใกล้ภาพอ้างอิง — กรมท่าลึก ทองเรืองแสงนุ่ม ซุ้มโค้งปลายดอกบัว หญิงสาวถือถ้วยน้ำ',
        draw: () => card('golden-moon', g(
            `<defs>
               <radialGradient id="gm-glow" cx="0.5" cy="0.42" r="0.6">
                 <stop offset="0" stop-color="#3d2f66"/><stop offset="1" stop-color="#191233"/>
               </radialGradient>
               <filter id="gm-soft"><feGaussianBlur stdDeviation="2.2"/></filter>
             </defs>` +
            rect(0, 0, W, H, { fill: 'url(#gm-glow)' }) +
            starsBG('#d8ccf0', 16, 5) +
            crescent(100, 88, 17, '#c9b8ea') +
            g(skyline(100, 250, 150, '#0e0a1e', 0.9), { filter: 'url(#gm-soft)' }) +
            pointedArch('#e0b64f', 3.5) +
            maiden(100, 205, 46, { robe: '#8a5fc0', hair: '#181028' }) +
            silverBowl(100, 218, 17, {}) +
            baseFrame('#e0b64f'),
            {}))
    },

    // 2 — มนตราสยาม (สไตล์ปัจจุบันของเว็บ)
    {
        id: 'siam-mystic', name: 'มนตราสยาม (แนวปัจจุบัน)',
        desc: 'การ์ตูนแบน + กรอบทองลายกนก ตัวหนังสือบนไพ่ — สไตล์ที่ใช้อยู่ในเว็บตอนนี้',
        draw: () => card('siam-mystic', g(
            rect(0, 0, W, H, { fill: '#241a3f' }) +
            rrect(0, 0, W, H, 12, { fill: '#16102b' }) +
            star(100, 60, 12, 5, 8, -90, { fill: '#e0b64f' }) +
            sparkle(40, 100, 5, '#f2d48a', 0.7) + sparkle(160, 130, 5, '#f2d48a', 0.6) +
            maiden(100, 190, 44, { robe: '#6fb3d8', hair: '#20304a' }) +
            lanternLotus(100, 236, 20, {}) +
            skyline(100, 268, 130, '#0f0a20', 0.9) +
            rrect(6, 6, W - 12, H - 12, 9, { fill: 'none', stroke: '#e0b64f', 'stroke-width': 2 }) +
            g(kanokCorner(22, '#e0b64f'), { transform: 'translate(12 12)' }) +
            g(kanokCorner(22, '#e0b64f'), { transform: `translate(${W - 12} ${H - 12}) rotate(180)` }) +
            txt(100, 300, 'มนตราสยาม', { fill: '#f7efdd', 'font-size': 20, 'font-family': "'Charm', serif", 'font-weight': 700 }),
            {}))
    },

    // 3 — ลายคราม (สินไหห่ว porcelain)
    {
        id: 'porcelain', name: 'ลายครามสินไห',
        desc: 'เส้นขาวบนครามน้ำเงิน แบบเครื่องถ้วยลายครามจีน-สยาม สงยงาม เรียบหรู',
        draw: () => card('porcelain', g(
            rect(0, 0, W, H, { fill: '#1d4e89' }) +
            rrect(0, 0, W, H, 12, { fill: '#2a6bb0' }) +
            starsBG('#cfe4f7', 10, 3) +
            crescent(100, 78, 16, '#cfe4f7') +
            // กลุ่มเมฆจีน
            path('M 40 118 q 8 -14 22 -8 q 4 -12 18 -8 q 12 -6 18 6 q 12 2 8 12 z', { fill: 'none', stroke: '#cfe4f7', 'stroke-width': 2 }) +
            maiden(100, 196, 44, { robe: '#cfe4f7', hair: '#0f2d4f', skin: '#eaf4fd' }) +
            // ถ้วย
            path('M 86 212 Q 100 226 114 212 L 111 206 L 89 206 Z', { fill: 'none', stroke: '#cfe4f7', 'stroke-width': 2.5 }) +
            skyline(100, 264, 120, '#cfe4f7', 0.85) +
            baseFrame('#cfe4f7', 'none', 10, 8, 2.5) +
            baseFrame('#cfe4f7', 'none', 7, 15, 1),
            {}))
    },

    // 4 — จิตรกรรมไทยดั้งเดิม (ฝาผนัง)
    {
        id: 'thai-mural', name: 'จิตรกรรมไทยดั้งเดิม',
        desc: 'แนวจิตรกรรมฝาผนังวัด — พื้นแดงชาด ลายดอกพิกุล ตัวละครเงิน-ทอง ขอบสี่เหลี่ยมพื้นบ้าน',
        draw: () => card('thai-mural', g(
            rect(0, 0, W, H, { fill: '#8c2f2f' }) +
            // ลายดอกพิกุลกระจาย
            [[30, 50], [170, 60], [40, 250], [165, 240], [100, 40]].map(p => star(p[0], p[1], 7, 3, 8, -90, { fill: '#e8c07a', opacity: 0.6 })).join('') +
            // ตัวละครเงิน
            maiden(100, 200, 46, { robe: '#e8c07a', hair: '#141414', skin: '#f5e6c8' }) +
            // ยืนบนขาช้าง (กนก)
            path('M 60 262 Q 100 244 140 262 L 140 270 L 60 270 Z', { fill: '#d9a53f' }) +
            // ซุ้มนาค 2 ตัวข้าง
            path('M 24 120 q 6 20 -4 36 q 14 -6 12 -34 z', { fill: '#3f7d4e' }) +
            path(`M ${W - 24} 120 q -6 20 4 36 q -14 -6 -12 -34 z`, { fill: '#3f7d4e' }) +
            baseFrame('#e8c07a', 'none', 4, 6, 3) +
            baseFrame('#5e1f1f', 'none', 2, 13, 5),
            {}))
    },

    // 5 — สติกเกอร์หนึบ (LINE sticker)
    {
        id: 'sticker', name: 'สติกเกอร์หนึบ ๆ',
        desc: 'ขอบขาวหนา สีจัดจ้าน ตัวการ์ตูนกลม ๆ น่าเลียนแบบสติกเกอร์แชท — เข้าถึงง่ายสุด',
        draw: () => card('sticker', g(
            rect(0, 0, W, H, { rx: 14, fill: '#ffd93d' }) +
            circle(100, 96, 30, { fill: '#fff3b0' }) +
            // แมวจ้อง
            blackCat(100, 210, 44, { fur: '#2d2a32', eye: '#ffffff', stroke: '#1f1d24' }) +
            // หัวใจลอย
            heart(52, 86, 12, { fill: '#ff6b81' }) + heart(150, 120, 9, { fill: '#ff6b81' }) +
            sparkle(40, 160, 8, '#ff9f43') + sparkle(162, 190, 8, '#ff9f43') +
            baseFrame('#1f1d24', 'none', 14, 8, 3) +
            txt(100, 298, 'เมี้ยว~', { fill: '#1f1d24', 'font-size': 22, 'font-family': "'Charm', serif", 'font-weight': 700 }),
            {}))
    },

    // 6 — พาสเทลคาวาอี้
    {
        id: 'kawaii', name: 'พาสเทลคาวาอี้',
        desc: 'โทนหวานละมุน ชมพู-มินต์-ลาเวนเดอร์ ดอกไม้เล็ก ๆ กระจาย — ผู้ฟังหญิงเป็นหลัก',
        draw: () => card('kawaii', g(
            rrect(0, 0, W, H, 14, { fill: '#fdf0f5' }) +
            // วงกลมพาสเทล
            circle(100, 150, 82, { fill: '#fcd7e4' }) +
            circle(100, 150, 62, { fill: '#fae3ec' }) +
            maiden(100, 170, 40, { robe: '#b8e0d2', hair: '#8d6e9e', skin: '#ffe3d0' }) +
            // ดอกไม้เล็ก
            [[36, 60], [164, 84], [44, 240], [160, 226], [100, 52]].map(p => lotus(p[0], p[1], 9, '#f9c9d8', '#fff0b3', 6)).join('') +
            crescent(100, 88, 13, '#e3c7f0') +
            baseFrame('#e8a9c0', 'none', 14, 8, 2.5) +
            txt(100, 296, 'ดวงใจหวาน', { fill: '#c96f9b', 'font-size': 19, 'font-family': "'Charm', serif", 'font-weight': 700 }),
            {}))
    },

    // 7 — นีออนไซเบอร์ (Cyber Thai)
    {
        id: 'neon', name: 'นีออนมนตรา',
        desc: 'เส้นนีออนเรืองแสง ม่วง-ฟ้า-ชมพู บนดำสนิท ผสมลายไทย — สายมูยุคใหม่',
        draw: () => card('neon', g(
            `<defs>
               <filter id="ne-glow"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
             </defs>` +
            rect(0, 0, W, H, { fill: '#0b0b16' }) +
            g(
                starsBG('#5a4a8a', 10, 9) +
                // วงกลมพลังงาน
                circle(100, 158, 66, { fill: 'none', stroke: '#ff3d9a', 'stroke-width': 2 }) +
                circle(100, 158, 56, { fill: 'none', stroke: '#00e5ff', 'stroke-width': 1.5, 'stroke-dasharray': '6 5' }) +
                maiden(100, 178, 40, { robe: '#1f2a50', hair: '#00e5ff', skin: '#e8d5ff' }) +
                glowStar(100, 74, 13, { fill: '#00e5ff', halo: '#00e5ff' }) +
                baseFrame('#ff3d9a', 'none', 10, 8, 2.5),
                { filter: 'url(#ne-glow)' }
            ),
            {}))
    },

    // 8 — สีน้ำฝันกลางคืน (watercolor)
    {
        id: 'watercolor', name: 'สีน้ำฝันกลางคืน',
        desc: 'อารมณ์ภาพสีน้ำ รอยเบลอชื้น ๆ ไม่มีเส้นขอบแข็ง — ไพเราะเหมือนวาดมือ',
        draw: () => card('watercolor', g(
            `<defs>
               <filter id="wc-blur"><feGaussianBlur stdDeviation="6"/></filter>
               <linearGradient id="wc-bg" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0" stop-color="#31406b"/><stop offset="1" stop-color="#1a2545"/>
               </linearGradient>
             </defs>` +
            rect(0, 0, W, H, { fill: 'url(#wc-bg)' }) +
            g(
                circle(64, 90, 34, { fill: '#4a5f9e', opacity: 0.55 }) +
                circle(132, 200, 44, { fill: '#35507c', opacity: 0.5 }) +
                circle(100, 270, 50, { fill: '#26375e', opacity: 0.6 }),
                { filter: 'url(#wc-blur)' }
            ) +
            crescent(104, 84, 15, '#d8e2f5') +
            g(maiden(100, 190, 44, { robe: '#6a7fb5', hair: '#12172b', skin: '#e9e0d2' }), { opacity: 0.95 }) +
            silverBowl(100, 214, 15, { metal: '#aebadb', water: '#7fa8d8' }) +
            g(skyline(100, 256, 140, '#0e1526', 0.85), { filter: 'url(#wc-blur)' }) +
            baseFrame('#aebadb', 'none', 10, 8, 1.8),
            {}))
    },

    // 9 — ป๊อปอาร์ตแนวร็อก
    {
        id: 'popart', name: 'ป๊อปอาร์ตจัดเต็ม',
        desc: 'สีคู่ตรงข้ามตัดกัน เส้นขอบหนา พื้นลายจุด halftone — โดดเด่นแบบโปสเตอร์',
        draw: () => card('popart', g(
            `<defs><pattern id="pa-dot" width="9" height="9" patternUnits="userSpaceOnUse">
               <circle cx="4.5" cy="4.5" r="1.7" fill="#ff7a59"/></pattern></defs>` +
            rect(0, 0, W, H, { fill: '#14213d' }) +
            rect(0, 0, W, 150, { fill: 'url(#pa-dot)' }) +
            // ดวงอาทิตย์เรเดียล
            sunburst(100, 150, 96, '#fca311', 16, 7) +
            circle(100, 150, 40, { fill: '#fca311' }) +
            maiden(100, 216, 42, { robe: '#e5e5e5', hair: '#14213d', skin: '#ffd9b3', stroke: '#14213d', sw: 3 }) +
            heart(100, 108, 15, { fill: '#e63946', stroke: '#14213d', 'stroke-width': 3 }) +
            baseFrame('#e5e5e5', 'none', 4, 8, 4),
            {}))
    },

    // 10 — พิกเซลวิเศษ 8-bit
    {
        id: 'pixel', name: 'พิกเซลวิเศษ 8-bit',
        desc: 'อาร์ตพิกเซลแบบเกมยุค 90 — เท้าความคิดถึง กราฟิกเบามาก',
        draw: () => {
            const s = 10; // ขนาดพิกเซล
            const put = (x, y, c) => rect(x * s, y * s, s, s, { fill: c });
            let px = '';
            // จันทร์เสี้ยวพิกเซล (มุมบนขวา)
            [[11, 2], [12, 2], [10, 3], [13, 3], [13, 4], [10, 4], [11, 5], [12, 5]].forEach(([x, y]) => { px += put(x, y, '#f6d98a'); });
            // แมวม่วงตัวใหญ่กลางการ์ด
            const cat = '#8a7bb5';
            [[4, 12], [5, 12], [9, 12], [10, 12],
             [4, 13], [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13],
             [3, 14], [4, 14], [5, 14], [6, 14], [7, 14], [8, 14], [9, 14], [10, 14], [11, 14],
             [3, 15], [4, 15], [5, 15], [6, 15], [7, 15], [8, 15], [9, 15], [10, 15], [11, 15],
             [3, 16], [4, 16], [11, 16], [12, 16],
             [4, 17], [5, 17], [6, 17], [7, 17], [8, 17], [9, 17], [10, 17]].forEach(([x, y]) => { px += put(x, y, cat); });
            // ตาเหลืองสองข้าง
            px += put(5, 15, '#f6d98a') + put(9, 15, '#f6d98a');
            // ดาวพิกเซลกระจาย
            [[2, 3], [13, 8], [2, 10], [14, 20], [3, 24], [13, 26]].forEach(([x, y]) => { px += put(x, y, '#f2d48a'); });
            // พื้นล่าง
            px += rect(0, H - 44, W, 44, { fill: '#191228' });
            [[3, 27], [4, 27], [11, 27], [12, 27]].forEach(([x, y]) => { px += put(x, y, '#4a3f8c'); });
            return card('pixel', g(
                rect(0, 0, W, H, { fill: '#221a38' }) +
                px +
                rrect(6, 6, W - 12, H - 12, 4, { fill: 'none', stroke: '#f2d48a', 'stroke-width': 3 }),
                {})
            );
        }
    },

    // 11 — เส้นเดียวมินิมอล
    {
        id: 'oneline', name: 'เส้นเดียวสงบ ๆ',
        desc: 'เส้นบางเส้นเดียวสีทองบนพื้นเข้ม มีจุดสีเดียว — เท่ สงบ ดูแพง',
        draw: () => card('oneline', g(
            rect(0, 0, W, H, { fill: '#1c1a26' }) +
            g(
                // โค้งเส้นเดียว: จันทร์ → หญิงสาว → ถ้วย
                path('M 60 84 A 22 22 0 1 0 104 70', { fill: 'none', stroke: '#e0b64f', 'stroke-width': 2 }) +
                path('M 100 116 C 78 124, 72 160, 76 196 C 66 210, 78 232, 100 232 C 122 232, 134 210, 124 196 C 128 160, 122 124, 100 116', { fill: 'none', stroke: '#e0b64f', 'stroke-width': 2 }) +
                circle(100, 142, 9, { fill: 'none', stroke: '#e0b64f', 'stroke-width': 2 }) +
                path('M 88 152 Q 100 158 112 152', { fill: 'none', stroke: '#e0b64f', 'stroke-width': 1.5 }) +
                path('M 88 210 Q 100 220 112 210', { fill: 'none', stroke: '#e0b64f', 'stroke-width': 1.5 }) +
                // จุดสีเดียว: หยดน้ำในถ้วย
                drop(100, 218, 6, { fill: '#e0b64f' }),
                {}
            ) +
            baseFrame('#4a4658', 'none', 10, 8, 1.2),
            {}))
    },

    // 12 — บาวฮาสเรขาคณิต
    {
        id: 'bauhaus', name: 'บาวฮาสเรขาคณิต',
        desc: 'วงกลม-สามเหลี่ยม-สี่เหลี่ยม สีขัดแย้งแบบตัวอักษร Bauhaus — เท่ทันสมัย',
        draw: () => card('bauhaus', g(
            rect(0, 0, W, H, { fill: '#efe9dc' }) +
            circle(100, 128, 54, { fill: '#e4572e' }) +
            circle(76, 108, 22, { fill: '#29335c' }) +
            poly('40,232 160,232 100,150', { fill: '#f3a712' }) +
            rect(34, 232, 132, 26, { fill: '#29335c' }) +
            line(100, 30, 100, 74, { stroke: '#29335c', 'stroke-width': 5 }) +
            circle(100, 26, 9, { fill: '#e4572e' }) +
            baseFrame('#29335c', 'none', 0, 8, 3),
            {}))
    },

    // 13 — ไม้แกะสลัก (woodcut)
    {
        id: 'woodcut', name: 'ไม้แกะสลัก',
        desc: 'เส้นแรงหยาบแบบพิมพ์ไม้ พื้นกระดาษครีม หมึกน้ำตาลเข้ม — โบราณมีเสน่ห์',
        draw: () => card('woodcut', g(
            rect(0, 0, W, H, { fill: '#e9dcc3' }) +
            hatch(14, 100, 172, 130, 9, '#4a3421', 1.4, 45) +
            g(
                crescent(100, 78, 17, '#4a3421') +
                // แมวนั่งเงา
                blackCat(100, 208, 46, { fur: '#4a3421', eye: '#e9dcc3' }) +
                skyline(100, 258, 140, '#4a3421'),
                {}
            ) +
            baseFrame('#4a3421', 'none', 6, 8, 3.5) +
            baseFrame('#4a3421', 'none', 3, 16, 1.5),
            {}))
    },

    // 14 — อาร์ตเดโคทองคำ
    {
        id: 'artdeco', name: 'อาร์ตเดโคทองคำ',
        desc: 'สมมาตรพร่าเพรา พัด-รัศมีทองบนดำเข้ม สไตล์โรงแรมยุค 1920',
        draw: () => card('artdeco', g(
            rect(0, 0, W, H, { fill: '#101014' }) +
            // พัดขนนกใหญ่
            sunburst(100, 150, 84, '#c9a227', 20, 2) +
            [0, 60, 120, 180, 240, 300].map(a => g(
                path('M 0 -30 C 14 -44, 14 -66, 0 -80 C -14 -66, -14 -44, 0 -30 Z', { fill: 'none', stroke: '#c9a227', 'stroke-width': 2 }),
                { transform: `translate(100 150) rotate(${a})` }
            )).join('') +
            circle(100, 150, 26, { fill: '#101014', stroke: '#c9a227', 'stroke-width': 2.5 }) +
            crescent(100, 150, 13, '#e6c86e') +
            // ฐานสามชั้น
            rect(64, 252, 72, 8, { fill: '#c9a227' }) +
            rect(74, 262, 52, 6, { fill: '#c9a227' }) +
            rect(84, 270, 32, 4, { fill: '#c9a227' }) +
            baseFrame('#c9a227', 'none', 6, 8, 3) +
            baseFrame('#c9a227', 'none', 3, 16, 1.2),
            {}))
    },

    // 15 — ผ้าทอไทย
    {
        id: 'textile', name: 'ผ้าทอไทย',
        desc: 'แถบสีผ้าไหมมัดหมี่ + ลายขาวสี่เหลี่ยมหมุน — อบอุ่นเป็นของไทยแท้',
        draw: () => card('textile', g(
            rect(0, 0, W, H, { fill: '#5b2333' }) +
            rect(0, 30, W, 26, { fill: '#c46a4a' }) +
            rect(0, 264, W, 26, { fill: '#c46a4a' }) +
            // ลายสะบ้า (ขาวสี่เหลี่ยมหมุน) เรียงแถว
            [26, 62, 98, 134, 170].map(x => g(poly(`${x - 8},43 ${x},35 ${x + 8},43 ${x},51`, { fill: '#f0e2c8' }), {})).join('') +
            [26, 62, 98, 134, 170].map(x => g(poly(`${x - 8},277 ${x},269 ${x + 8},277 ${x},285`, { fill: '#f0e2c8' }), {})).join('') +
            // หญิงสาวผูกผ้าโจงกระเบน
            maiden(100, 190, 44, { robe: '#e0a458', hair: '#20304a', skin: '#ffd9b3' }) +
            lotus(100, 250, 18, '#8a3542', '#f0e2c8', 8) +
            // ลายขอบข้าง
            rect(0, 0, 12, H, { fill: '#8a3542' }) + rect(W - 12, 0, 12, H, { fill: '#8a3542' }),
            {}))
    },

    // 16 — ตำนานเงาเขียว (Dark Botanical)
    {
        id: 'botanical', name: 'ตำนานเงาเขียว',
        desc: 'พฤกษศาสตร์ยามค่ำ — เขียวเข้มดำ ผีเสื้อกลางคืน เส้นเงินจาง — ลึกลับแบบมีคลาส',
        draw: () => card('botanical', g(
            rect(0, 0, W, H, { fill: '#0f1f18' }) +
            // ก้านใบไม้โค้งสองข้าง
            path('M 30 250 C 30 170, 60 130, 88 116', { fill: 'none', stroke: '#3f6b52', 'stroke-width': 2.5 }) +
            path(`M ${W - 30} 250 C ${W - 30} 170, ${W - 60} 130, ${W - 88} 116`, { fill: 'none', stroke: '#3f6b52', 'stroke-width': 2.5 }) +
            [[52, 180], [70, 150], [148, 180], [130, 150]].map(p =>
                path(`M ${p[0]} ${p[1]} q 14 -8 22 4 q -14 10 -22 -4 z`, { fill: '#274a37' })
            ).join('') +
            // ผีเสื้อกลางคืนกลางการ์ด
            g(
                ell(100, 160, 10, 22, { fill: '#1a2e23' }) +
                path('M 100 148 C 82 118, 56 122, 62 146 C 66 162, 86 160, 100 150', { fill: '#2f5844' }) +
                path(`M 100 148 C 118 118, 144 122, 138 146 C 134 162, 114 160, 100 150`, { fill: '#2f5844' }) +
                path('M 100 168 C 88 186, 70 188, 74 172', { fill: '#24463a' }) +
                path(`M 100 168 C 112 186, 130 188, 126 172`, { fill: '#24463a' }),
                {}
            ) +
            // จันทร์เสี้ยวเงินจาง
            crescent(100, 80, 15, '#9fb8a8') +
            circle(100, 244, 4, { fill: '#9fb8a8' }) +
            baseFrame('#3f6b52', 'none', 10, 8, 1.8),
            {}))
    },

    // 17 — สเก็ตช์ดินสอ
    {
        id: 'sketch', name: 'สเก็ตช์ดินสอสร้างสรรค์',
        desc: 'เส้นดินสอร่าน ๆ พื้นกระดาษ — เหมือนหมอดวงวาดเองในสมุด',
        draw: () => card('sketch', g(
            rect(0, 0, W, H, { fill: '#f7f3ea' }) +
            hatch(20, 40, 160, 240, 12, '#d9d2c2', 1, 45) +
            crescentStroke(100, 76, 16, '#3a3a3a') +
            blackCat(100, 200, 46, { fur: '#f7f3ea', eye: '#3a3a3a', stroke: '#3a3a3a' }) +
            skyline(100, 254, 140, 'none') +
            line(30, 262, 170, 262, { stroke: '#3a3a3a', 'stroke-width': 2, 'stroke-linecap': 'round' }) +
            path('M 88 228 L 112 228 L 108 248 L 92 248 Z', { fill: 'none', stroke: '#3a3a3a', 'stroke-width': 2 }) +
            baseFrame('#3a3a3a', 'none', 6, 8, 1.8),
            {}))
    },

    // 18 — สีเทียนเด็กหัดเรียน (crayon)
    {
        id: 'crayon', name: 'สีเทียนเด็กหัดเรียน',
        desc: 'เส้นสั่น ๆ สีทึบสดใส เหมือนภาพวาดเด็ก — น่ารักจุดประกายความสุกเชิง',
        draw: () => card('crayon', g(
            rrect(0, 0, W, H, 12, { fill: '#fffbe8' }) +
            circle(100, 88, 26, { fill: '#ffd23f', stroke: '#e8961e', 'stroke-width': 4 }) +
            sunburst(100, 88, 40, '#ffb703', 9, 4) +
            maiden(100, 196, 44, { robe: '#06d6a0', hair: '#8a5a2e', skin: '#ffd9b3', stroke: '#3a3a3a', sw: 3 }) +
            heart(52, 90, 11, { fill: '#ef476f', stroke: '#3a3a3a', 'stroke-width': 3 }) +
            heart(150, 128, 9, { fill: '#ef476f', stroke: '#3a3a3a', 'stroke-width': 3 }) +
            // หญ้าเส้นสั่น
            [40, 60, 140, 160].map(x => path(`M ${x} 268 q 3 -10 0 -16`, { stroke: '#06d6a0', 'stroke-width': 3, fill: 'none' })).join('') +
            baseFrame('#118ab2', 'none', 12, 8, 4),
            {}))
    },

    // 19 — โมเสกกระจก
    {
        id: 'mosaic', name: 'โมเสกกระจกวิทราน',
        desc: 'เศษกระจกสีประกอบภาพ รอยต่อเส้นทึบ — ระยับงามแบบวิทรานโบราณ',
        draw: () => {
            const tiles = [];
            const cell = 14;
            for (let ry = 0; ry < H / cell; ry++) {
                for (let rx = 0; rx < W / cell; rx++) {
                    const cx = rx * cell + cell / 2 + ((ry % 2) * 3), cy = ry * cell + cell / 2;
                    const d = Math.hypot(cx - 100, cy - 160);
                    // วงแหวนสีรอบแมว: ใกล้ = ม่วง, ไกล = น้ำเงินเข้ม
                    let color = d < 46 ? '#7a4a9e' : d < 70 ? '#4a3f8c' : '#232048';
                    if (d < 24) color = '#f2d48a'; // ตัวแมวทอง
                    tiles.push(poly(
                        `${cx - 5},${cy - 5} ${cx + 5},${cy - 6} ${cx + 6},${cy + 5} ${cx - 4},${cy + 6}`,
                        { fill: color, stroke: '#12101f', 'stroke-width': 1 }
                    ));
                }
            }
            return card('mosaic', g(
                rect(0, 0, W, H, { fill: '#12101f' }) +
                tiles.join('') +
                // ตาแมว
                circle(93, 158, 2.5, { fill: '#fff6e6' }) + circle(107, 158, 2.5, { fill: '#fff6e6' }) +
                baseFrame('#f2d48a', 'none', 8, 6, 3),
                {})
            );
        }
    },

    // 20 — อวกาศสายมู (Galaxy)
    {
        id: 'galaxy', name: 'อวกาศสายมู',
        desc: 'เนบิวลาม่วง-ชมพู ดาวพร่างพราย — สายมูยุค Gen Z',
        draw: () => card('galaxy', g(
            `<defs>
               <radialGradient id="gx-n1" cx="0.35" cy="0.3" r="0.5">
                 <stop offset="0" stop-color="#b06ab3" stop-opacity="0.85"/><stop offset="1" stop-color="#b06ab3" stop-opacity="0"/>
               </radialGradient>
               <radialGradient id="gx-n2" cx="0.7" cy="0.65" r="0.55">
                 <stop offset="0" stop-color="#5b6ee1" stop-opacity="0.8"/><stop offset="1" stop-color="#5b6ee1" stop-opacity="0"/>
               </radialGradient>
             </defs>` +
            rect(0, 0, W, H, { fill: '#120e26' }) +
            ell(70, 96, 70, 46, { fill: 'url(#gx-n1)' }) +
            ell(134, 208, 78, 52, { fill: 'url(#gx-n2)' }) +
            starsBG('#e8dcff', 18, 4) +
            sparkle(150, 70, 9, '#ffd6f5', 0.9) + sparkle(48, 210, 8, '#c9f0ff', 0.9) +
            // หญิงสาวเทพธิดาดาว
            maiden(100, 186, 44, { robe: '#38276b', hair: '#1a1233', skin: '#f0e4ff' }) +
            glowStar(100, 92, 14, {}) +
            // ธงตายาว
            path('M 116 130 C 138 150, 136 190, 120 214', { fill: 'none', stroke: '#ff9de2', 'stroke-width': 3 }) +
            baseFrame('#c9b8f0', 'none', 12, 8, 1.8),
            {}))
    },
];

/** จันทร์เสี้ยวแบบเส้น (สำหรับ sketch) */
function crescentStroke(cx, cy, r, stroke) {
    return path(
        `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r * 0.72} ${r * 0.72} 0 1 1 ${cx} ${cy - r} Z`,
        { fill: 'none', stroke, 'stroke-width': 2.5 }
    );
}

/** ครอบ SVG เต็มการ์ด */
function card(id, content) {
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto rounded-xl shadow-lg" role="img" aria-label="mockup ${id}">${content}</svg>`;
}

/** เรนเดอร์ลงหน้า gallery */
export function renderMockupGallery(container) {
    if (!container) return;
    container.innerHTML = STYLES.map((s, i) => `
        <figure class="mockup-cell panel p-4 flex flex-col items-center text-center">
            ${s.draw()}
            <figcaption class="mt-3">
                <p class="text-sm font-bold text-gold">${i + 1}. ${s.name}</p>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">${s.desc}</p>
            </figcaption>
        </figure>
    `).join('');
}
