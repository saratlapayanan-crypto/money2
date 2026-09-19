/* ================================================================
   SVG Art Helpers — ตัวช่วยวาดภาพไพ่
   ลิขสิทธิ์: ภาพทั้งหมดเป็น original vector art ที่วาดขึ้นเอง
   (อ้างอิงเฉพาะ "สัญลักษณ์ดั้งเดิม" ของไพ่จาก Wikipedia
   ไม่ได้คัดลอกภาพจากสำรับไพ่ใด)
   ================================================================ */

/** สร้าง element SVG จากชื่อ tag + attribute */
export function tag(name, attrs = {}, children = '') {
    const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
    return children ? `<${name} ${a}>${children}</${name}>` : `<${name} ${a}/>`;
}

export const g = (children, attrs = {}) => tag('g', attrs, children);
export const circle = (cx, cy, r, attrs = {}) => tag('circle', { cx, cy, r, ...attrs });
export const ell = (cx, cy, rx, ry, attrs = {}) => tag('ellipse', { cx, cy, rx, ry, ...attrs });
export const rect = (x, y, w, h, attrs = {}) => tag('rect', { x, y, width: w, height: h, ...attrs });
export const rrect = (x, y, w, h, rx, attrs = {}) => tag('rect', { x, y, width: w, height: h, rx, ...attrs });
export const line = (x1, y1, x2, y2, attrs = {}) => tag('line', { x1, y1, x2, y2, ...attrs });
export const path = (d, attrs = {}) => tag('path', { d, ...attrs });
export const poly = (pts, attrs = {}) => tag('polygon', { points: pts, ...attrs });
export const txt = (x, y, str, attrs = {}) =>
    tag('text', { x, y, 'text-anchor': 'middle', ...attrs }, str);

/** ดาว n แฉก จุดเริ่มหมุนจากด้านบน */
export function star(cx, cy, R, r, n = 5, rotDeg = -90, attrs = {}) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
        const rad = ((rotDeg + (i * 180) / n) * Math.PI) / 180;
        const d = i % 2 === 0 ? R : r;
        pts.push(`${(cx + d * Math.cos(rad)).toFixed(2)},${(cy + d * Math.sin(rad)).toFixed(2)}`);
    }
    return poly(pts.join(' '), attrs);
}

/** ประกาย 4 แฉก (sparkle) */
export function sparkle(cx, cy, s, fill, opacity = 1) {
    return star(cx, cy, s, s * 0.28, 4, -90, { fill, opacity });
}

/** หัวใจ */
export function heart(cx, cy, s, attrs = {}) {
    return path(
        `M ${cx} ${cy + 0.78 * s} ` +
        `C ${cx - 1.15 * s} ${cy - 0.28 * s}, ${cx - 0.62 * s} ${cy - 0.95 * s}, ${cx} ${cy - 0.32 * s} ` +
        `C ${cx + 0.62 * s} ${cy - 0.95 * s}, ${cx + 1.15 * s} ${cy - 0.28 * s}, ${cx} ${cy + 0.78 * s} Z`,
        attrs
    );
}

/** ดอกบัวหลายชั้น — กลีบเรียงวงรอบจุดกลาง */
export function lotus(cx, cy, s, petal, center, n = 8) {
    let out = '';
    // ชั้นล่าง (กลีบเอียงสลับ)
    for (let i = 0; i < n / 2; i++) {
        const a = 180 + (i * 360) / (n / 2);
        out += g(ell(0, -s * 0.55, s * 0.26, s * 0.62, { fill: petal, opacity: 0.75 }), {
            transform: `translate(${cx} ${cy}) rotate(${a})`
        });
    }
    // ชั้นบน (กลีบตั้ง)
    for (let i = 0; i < n / 2; i++) {
        const a = (i * 360) / (n / 2) - 90;
        out += g(ell(0, -s * 0.72, s * 0.22, s * 0.5, { fill: petal }), {
            transform: `translate(${cx} ${cy}) rotate(${a})`
        });
    }
    out += circle(cx, cy, s * 0.24, { fill: center });
    return out;
}

/** เปลวเทียน */
export function flame(cx, cy, s, attrs = {}) {
    return path(
        `M ${cx} ${cy - s} C ${cx + s * 0.75} ${cy - s * 0.35}, ${cx + s * 0.55} ${cy + s * 0.6}, ${cx} ${cy + s * 0.75} ` +
        `C ${cx - s * 0.55} ${cy + s * 0.6}, ${cx - s * 0.75} ${cy - s * 0.35}, ${cx} ${cy - s} Z`,
        attrs
    );
}

/** หยดน้ำ */
export function drop(cx, cy, s, attrs = {}) {
    return path(
        `M ${cx} ${cy - s} C ${cx + s * 0.8} ${cy}, ${cx + s * 0.55} ${cy + s * 0.8}, ${cx} ${cy + s * 0.8} ` +
        `C ${cx - s * 0.55} ${cy + s * 0.8}, ${cx - s * 0.8} ${cy}, ${cx} ${cy - s} Z`,
        attrs
    );
}

/** พระจันทร์เสี้ยว */
export function crescent(cx, cy, r, fill) {
    return path(
        `M ${cx} ${cy - r} A ${r} ${r} 0 1 0 ${cx} ${cy + r} A ${r * 0.72} ${r * 0.72} 0 1 1 ${cx} ${cy - r} Z`,
        { fill }
    );
}

/** ค้างคาวการ์ตูน */
export function bat(cx, cy, s, fill) {
    return g(path(
        `M ${cx} ${cy - s * 0.35} C ${cx - s * 0.3} ${cy - s}, ${cx - s * 0.8} ${cy - s * 0.8}, ${cx - s * 1.25} ${cy - s * 0.45} ` +
        `L ${cx - s * 0.85} ${cy - s * 0.1} L ${cx - s * 1.05} ${cy + s * 0.25} L ${cx - s * 0.5} ${cy + s * 0.1} ` +
        `L ${cx} ${cy + s * 0.55} ` +
        `L ${cx + s * 0.5} ${cy + s * 0.1} L ${cx + s * 1.05} ${cy + s * 0.25} L ${cx + s * 0.85} ${cy - s * 0.1} ` +
        `C ${cx + s * 0.8} ${cy - s * 0.8}, ${cx + s * 0.3} ${cy - s}, ${cx} ${cy - s * 0.35} Z`,
        { fill }
    ) + circle(cx, cy - s * 0.42, s * 0.14, { fill }) + circle(cx - s * 0.55, cy - s * 0.5, s * 0.08, { fill }) + circle(cx + s * 0.55, cy - s * 0.5, s * 0.08, { fill }), {});
}

/** เกล็ดหิมะ 6 แฉก */
export function snowflake(cx, cy, s, stroke) {
    let out = '';
    for (let i = 0; i < 6; i++) {
        const a = i * 60;
        out += g(
            line(0, 0, 0, -s, { stroke, 'stroke-width': s * 0.11, 'stroke-linecap': 'round' }) +
            line(0, -s * 0.55, s * 0.26, -s * 0.8, { stroke, 'stroke-width': s * 0.09, 'stroke-linecap': 'round' }) +
            line(0, -s * 0.55, -s * 0.26, -s * 0.8, { stroke, 'stroke-width': s * 0.09, 'stroke-linecap': 'round' }),
            { transform: `translate(${cx} ${cy}) rotate(${a})` }
        );
    }
    return out;
}

/** มุมลายกนก (คล้ายขนนกสามชั้น) — วาดที่มุมบนซ้ายของกรอบ */
export function kanokCorner(size, color) {
    const s = size;
    return path(
        `M 0 ${s * 0.9} C ${s * 0.05} ${s * 0.35}, ${s * 0.35} ${s * 0.08}, ${s * 0.95} 0 ` +
        `C ${s * 0.55} ${s * 0.18}, ${s * 0.42} ${s * 0.3}, ${s * 0.52} ${s * 0.52} ` +
        `C ${s * 0.3} ${s * 0.42}, ${s * 0.18} ${s * 0.55}, 0 ${s * 0.9} Z`,
        { fill: color, opacity: 0.85 }
    );
}

/** วางลายมุมทั้ง 4 มุมของกรอบการ์ด (พื้นที่ w×h) */
export function corners(kind, w, h, margin, size, color) {
    const pos = [
        { t: `translate(${margin} ${margin})`, f: '' },
        { t: `translate(${w - margin} ${margin}) scale(-1 1)`, f: '' },
        { t: `translate(${margin} ${h - margin}) scale(1 -1)`, f: '' },
        { t: `translate(${w - margin} ${h - margin}) scale(-1 -1)`, f: '' },
    ];
    return pos.map(p => {
        let art;
        switch (kind) {
            case 'drop': art = drop(0, size * 0.6, size * 0.5, { fill: color, opacity: 0.8 }); break;
            case 'lantern': art = g(
                rrect(-size * 0.4, -size * 0.5, size * 0.8, size, size * 0.35, { fill: color, opacity: 0.85 }) +
                line(0, -size * 0.5, 0, -size * 0.75, { stroke: color, 'stroke-width': 1.5 }), {});
                break;
            case 'bat': art = bat(0, 0, size * 0.5, color); break;
            case 'snow': art = snowflake(0, 0, size * 0.55, color); break;
            case 'heart': art = heart(0, 0, size * 0.5, { fill: color, opacity: 0.85 }); break;
            case 'line': art = g(
                line(0, size, size, 0, { stroke: color, 'stroke-width': 2 }) +
                line(0, size * 0.55, size * 0.55, 0, { stroke: color, 'stroke-width': 1.2, opacity: 0.6 }), {});
                break;
            default: art = kanokCorner(size, color);
        }
        return g(art, { transform: p.t });
    }).join('');
}

/** แสงรัศมี */
export function sunburst(cx, cy, r, color, n = 12, width = 2) {
    let out = '';
    for (let i = 0; i < n; i++) {
        const a = (i * 360) / n;
        out += g(line(0, -r * 0.6, 0, -r, { stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' }), {
            transform: `translate(${cx} ${cy}) rotate(${a})`
        });
    }
    return out;
}

/** คลื่นน้ำ (แถบลูกคลื่น) */
export function wave(y, w, color, opacity = 0.5, amp = 6, seg = 60) {
    let d = `M 0 ${y}`;
    for (let x = 0; x < w; x += seg) {
        d += ` Q ${x + seg / 2} ${y - amp}, ${x + seg} ${y}`;
    }
    return path(d, { stroke: color, fill: 'none', 'stroke-width': 2, opacity, 'stroke-linecap': 'round' });
}

/** ตัวเลขโรมัน (สำหรับ Major Arcana 0–XXI) */
export function toRoman(n) {
    if (n === 0) return '0';
    const map = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let out = '';
    for (const [v, s] of map) {
        while (n >= v) { out += s; n -= v; }
    }
    return out;
}

/** ใบหน้าการ์ตูนง่าย ๆ (ตาจุด + ยิ้ม) */
export function face(cx, cy, s, skin, opt = {}) {
    const eye = opt.eyeColor || '#3b2a20';
    return g(
        circle(cx, cy, s, { fill: skin }) +
        circle(cx - s * 0.35, cy - s * 0.08, s * 0.07, { fill: eye }) +
        circle(cx + s * 0.35, cy - s * 0.08, s * 0.07, { fill: eye }) +
        (opt.smile === false ? '' : path(`M ${cx - s * 0.28} ${cy + s * 0.3} Q ${cx} ${cy + s * 0.52}, ${cx + s * 0.28} ${cy + s * 0.3}`, { stroke: eye, fill: 'none', 'stroke-width': s * 0.08, 'stroke-linecap': 'round' })) +
        (opt.blush ? circle(cx - s * 0.55, cy + s * 0.22, s * 0.12, { fill: '#f3a3a3', opacity: 0.7 }) + circle(cx + s * 0.55, cy + s * 0.22, s * 0.12, { fill: '#f3a3a3', opacity: 0.7 }) : ''),
        {}
    );
}
