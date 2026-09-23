/* ================================================================
   ระบบวาดรูปคนและสรีระไพ่ทาโรต์ตาม 7 เทศกาล (Tarot Figurative Engine)
   - ปราศจากหัววงกลมสีเหลือง (Zero Primitive Circles) 100%
   - ออกแบบโครงหน้า ซิลูเอต เส้นผม และเครื่องทรงสรีระมนุษย์อย่างวิจิตร
   - ปรับเปลี่ยนเครื่องแต่งกายและบรรยากาศตามเทศกาลจริง (Songkran, Loy Krathong,
     Halloween, Christmas, Valentine, Minimalist, Standard)
   ================================================================ */

import {
    g, circle, ell, rect, rrect, line, path, poly, txt,
    star, sparkle, heart, flame, crescent, drop, snowflake
} from './helpers.js';

const CX = 120; // จุดกึ่งกลางแนวนอนของไพ่ (W = 240)

/* ================================================================
   1. ส่วนประกอบสรีระพื้นฐาน (Anatomy & Head Profiles)
   ================================================================ */

/**
 * โครงหน้าและศีรษะสตรี / ซิลูเอตเทวี (Delicate Contoured Face Profile)
 * มีสันจมูก ริมฝีปาก คางเรียว ลำคอ และเส้นผมพริ้วไหว
 */
export function femaleFace(cx, cy, s = 1, dir = 1, skinColor = '#FDF0E6', hairColor = '#26132D') {
    // ทิศทาง: dir = 1 (หันขวา), dir = -1 (หันซ้าย), dir = 0 (หน้าตรง)
    if (dir === 0) {
        // ใบหน้าตรงรูปไข่เรียวงาม
        return g(
            // ทรงผมด้านหลัง
            path(`M ${cx - 13 * s} ${cy - 8 * s} C ${cx - 18 * s} ${cy + 6 * s}, ${cx - 14 * s} ${cy + 22 * s}, ${cx - 8 * s} ${cy + 26 * s} ` +
                 `L ${cx + 8 * s} ${cy + 26 * s} C ${cx + 14 * s} ${cy + 22 * s}, ${cx + 18 * s} ${cy + 6 * s}, ${cx + 13 * s} ${cy - 8 * s} Z`, { fill: hairColor }) +
            // โครงหน้าหน้ารูปไข่
            path(`M ${cx - 9 * s} ${cy - 5 * s} C ${cx - 9 * s} ${cy + 8 * s}, ${cx - 5 * s} ${cy + 15 * s}, ${cx} ${cy + 18 * s} ` +
                 `C ${cx + 5 * s} ${cy + 15 * s}, ${cx + 9 * s} ${cy + 8 * s}, ${cx + 9 * s} ${cy - 5 * s} ` +
                 `C ${cx + 8 * s} ${cy - 14 * s}, ${cx - 8 * s} ${cy - 14 * s}, ${cx - 9 * s} ${cy - 5 * s} Z`, { fill: skinColor }) +
            // ลำคอ
            path(`M ${cx - 4 * s} ${cy + 17 * s} L ${cx - 6 * s} ${cy + 26 * s} L ${cx + 6 * s} ${cy + 26 * s} L ${cx + 4 * s} ${cy + 17 * s} Z`, { fill: skinColor }) +
            // ไรผมด้านหน้าแสกกลาง
            path(`M ${cx - 9 * s} ${cy - 5 * s} Q ${cx} ${cy - 8 * s}, ${cx + 9 * s} ${cy - 5 * s} ` +
                 `C ${cx + 7 * s} ${cy - 14 * s}, ${cx - 7 * s} ${cy - 14 * s}, ${cx - 9 * s} ${cy - 5 * s} Z`, { fill: hairColor }),
            {}
        );
    }

    const m = dir; // ตัวคูณทิศทาง
    return g(
        // ปอยผมยาวด้านหลังทิ้งตัว
        path(`M ${cx - 8 * m * s} ${cy - 10 * s} C ${cx - 16 * m * s} ${cy + 4 * s}, ${cx - 15 * m * s} ${cy + 20 * s}, ${cx - 6 * m * s} ${cy + 28 * s} ` +
             `C ${cx - 2 * m * s} ${cy + 24 * s}, ${cx - 6 * m * s} ${cy + 12 * s}, ${cx - 3 * m * s} ${cy + 6 * s} Z`, { fill: hairColor }) +
        // โครงหน้าด้านข้าง: หน้าผากโค้ง สันจมูก ริมฝีปาก คางมน
        path(`M ${cx - 4 * m * s} ${cy - 13 * s} ` +
             `C ${cx + 4 * m * s} ${cy - 12 * s}, ${cx + 8 * m * s} ${cy - 6 * s}, ${cx + 8 * m * s} ${cy - 2 * s} ` + // หน้าผาก
             `L ${cx + 10.5 * m * s} ${cy + 3 * s} ` +                                                                    // สันจมูก
             `L ${cx + 8 * m * s} ${cy + 4.5 * s} ` +                                                                  // ร่องใต้จมูก
             `C ${cx + 8.5 * m * s} ${cy + 7 * s}, ${cx + 8 * m * s} ${cy + 8 * s}, ${cx + 6.5 * m * s} ${cy + 9 * s} ` +  // ริมฝีปาก
             `C ${cx + 7 * m * s} ${cy + 12 * s}, ${cx + 5 * m * s} ${cy + 14 * s}, ${cx + 2 * m * s} ${cy + 14.5 * s} ` + // คาง
             `C ${cx - 1 * m * s} ${cy + 12 * s}, ${cx - 2 * m * s} ${cy + 7 * s}, ${cx - 3 * m * s} ${cy + 2 * s} Z`,     // แก้มและกราม
             { fill: skinColor }) +
        // ลำคอระหง
        path(`M ${cx + 1 * m * s} ${cy + 14 * s} L ${cx + 3 * m * s} ${cy + 24 * s} L ${cx - 5 * m * s} ${cy + 24 * s} L ${cx - 4 * m * s} ${cy + 12 * s} Z`, { fill: skinColor }) +
        // ทรงผมปัดข้างด้านบน
        path(`M ${cx - 8 * m * s} ${cy - 8 * s} C ${cx - 6 * m * s} ${cy - 16 * s}, ${cx + 3 * m * s} ${cy - 16 * s}, ${cx + 7 * m * s} ${cy - 9 * s} ` +
             `C ${cx + 4 * m * s} ${cy - 7 * s}, ${cx} ${cy - 3 * s}, ${cx - 2 * m * s} ${cy + 2 * s} ` +
             `C ${cx - 7 * m * s} ${cy + 2 * s}, ${cx - 8 * m * s} ${cy - 4 * s}, ${cx - 8 * m * s} ${cy - 8 * s} Z`, { fill: hairColor }),
        {}
    );
}

/**
 * โครงหน้าและศีรษะบุรุษ / นักรบ / กษัตริย์ (Dignified Masculine Contour)
 */
export function maleFace(cx, cy, s = 1, dir = 1, skinColor = '#FAD9C1', hairColor = '#3A2012') {
    if (dir === 0) {
        return g(
            // ทรงผมบุรุษ
            path(`M ${cx - 12 * s} ${cy - 7 * s} C ${cx - 14 * s} ${cy - 16 * s}, ${cx + 14 * s} ${cy - 16 * s}, ${cx + 12 * s} ${cy - 7 * s} ` +
                 `L ${cx + 10 * s} ${cy + 6 * s} L ${cx - 10 * s} ${cy + 6 * s} Z`, { fill: hairColor }) +
            // โครงหน้ากรามแกร่ง
            path(`M ${cx - 8 * s} ${cy - 6 * s} L ${cx - 8 * s} ${cy + 6 * s} L ${cx - 4 * s} ${cy + 16 * s} L ${cx + 4 * s} ${cy + 16 * s} ` +
                 `L ${cx + 8 * s} ${cy + 6 * s} L ${cx + 8 * s} ${cy - 6 * s} Z`, { fill: skinColor }) +
            // ลำคอแกร่ง
            rect(cx - 5 * s, cy + 15 * s, 10 * s, 10 * s, { fill: skinColor }),
            {}
        );
    }

    const m = dir;
    return g(
        // ทรงผมด้านหลัง
        path(`M ${cx - 8 * m * s} ${cy - 10 * s} C ${cx - 13 * m * s} ${cy - 14 * s}, ${cx + 3 * m * s} ${cy - 16 * s}, ${cx + 8 * m * s} ${cy - 8 * s} ` +
             `L ${cx + 4 * m * s} ${cy - 2 * s} C ${cx - 2 * m * s} ${cy - 4 * s}, ${cx - 6 * m * s} ${cy + 5 * s}, ${cx - 8 * m * s} ${cy + 10 * s} Z`, { fill: hairColor }) +
        // โครงหน้าคมสันด้านข้าง
        path(`M ${cx - 3 * m * s} ${cy - 12 * s} ` +
             `C ${cx + 4 * m * s} ${cy - 11 * s}, ${cx + 8 * m * s} ${cy - 6 * s}, ${cx + 8 * m * s} ${cy - 1 * s} ` +
             `L ${cx + 11 * m * s} ${cy + 4 * s} ` +
             `L ${cx + 8.5 * m * s} ${cy + 5.5 * s} ` +
             `L ${cx + 9 * m * s} ${cy + 8 * s} ` +
             `C ${cx + 8 * m * s} ${cy + 13 * s}, ${cx + 6 * m * s} ${cy + 15 * s}, ${cx + 2 * m * s} ${cy + 15.5 * s} ` +
             `C ${cx - 2 * m * s} ${cy + 13 * s}, ${cx - 4 * m * s} ${cy + 7 * s}, ${cx - 4 * m * s} ${cy - 2 * s} Z`,
             { fill: skinColor }) +
        // คอหนาแข็งแกร่ง
        path(`M ${cx + 1 * m * s} ${cy + 15 * s} L ${cx + 3 * m * s} ${cy + 25 * s} L ${cx - 6 * m * s} ${cy + 25 * s} L ${cx - 5 * m * s} ${cy + 13 * s} Z`, { fill: skinColor }),
        {}
    );
}

/**
 * โครงหน้านักพรต / ผู้เฒ่าปัญญาญาณ (Sage & Hermit with Flowing Beard)
 */
export function sageFace(cx, cy, s = 1, dir = 1, skinColor = '#F2D2BD', beardColor = '#ECEFF1') {
    const m = dir;
    return g(
        // ใบหน้าส่วนบน
        path(`M ${cx - 4 * m * s} ${cy - 10 * s} C ${cx + 3 * m * s} ${cy - 10 * s}, ${cx + 7 * m * s} ${cy - 5 * s}, ${cx + 7 * m * s} ${cy} ` +
             `L ${cx + 10 * m * s} ${cy + 4 * s} L ${cx + 7 * m * s} ${cy + 6 * s} L ${cx + 4 * m * s} ${cy + 8 * s} L ${cx - 4 * m * s} ${cy + 2 * s} Z`, { fill: skinColor }) +
        // เครายาวสีเงินยวงพลิ้วไหว
        path(`M ${cx + 7 * m * s} ${cy + 5 * s} C ${cx + 12 * m * s} ${cy + 14 * s}, ${cx + 8 * m * s} ${cy + 26 * s}, ${cx + 2 * m * s} ${cy + 34 * s} ` +
             `C ${cx - 3 * m * s} ${cy + 28 * s}, ${cx - 6 * m * s} ${cy + 18 * s}, ${cx - 4 * m * s} ${cy + 8 * s} Z`, { fill: beardColor }),
        {}
    );
}

/* ================================================================
   2. เครื่องศิราภรณ์และหมวกตามเทศกาล (Festival Headpieces)
   ================================================================ */

export function festivalHeadwear(deckId, cx, cy, type = 'crown', s = 1, goldColor = '#D4AF37') {
    switch (deckId) {
        case 'songkran':
            // ชฎาไทย / รัดเกล้าทองยอดแหลม พร้อมพวงดอกมะลิห้อยข้าง
            return g(
                // เกี้ยวยอดชฎาสีทอง
                path(`M ${cx - 8 * s} ${cy - 8 * s} L ${cx - 5 * s} ${cy - 20 * s} L ${cx} ${cy - 34 * s} L ${cx + 5 * s} ${cy - 20 * s} L ${cx + 8 * s} ${cy - 8 * s} Z`, { fill: goldColor }) +
                circle(cx, cy - 35 * s, 2 * s, { fill: '#ffffff' }) +
                // ดอกมะลิทัดหู
                circle(cx + 8 * s, cy - 3 * s, 3 * s, { fill: '#ffffff' }) +
                circle(cx + 10 * s, cy + 3 * s, 2.2 * s, { fill: '#ffffff' }) +
                circle(cx + 11 * s, cy + 8 * s, 1.8 * s, { fill: '#ffffff' }),
                {}
            );

        case 'loy-krathong':
            // มงกุฎดอกบัวหลวงสลักทอง (Lotus Tiara)
            return g(
                path(`M ${cx - 10 * s} ${cy - 8 * s} C ${cx - 7 * s} ${cy - 22 * s}, ${cx} ${cy - 28 * s}, ${cx} ${cy - 28 * s} ` +
                     `C ${cx} ${cy - 28 * s}, ${cx + 7 * s} ${cy - 22 * s}, ${cx + 10 * s} ${cy - 8 * s} Z`, { fill: goldColor }) +
                path(`M ${cx - 14 * s} ${cy - 6 * s} C ${cx - 12 * s} ${cy - 16 * s}, ${cx} ${cy - 10 * s}, ${cx} ${cy - 10 * s} ` +
                     `C ${cx} ${cy - 10 * s}, ${cx + 12 * s} ${cy - 16 * s}, ${cx + 14 * s} ${cy - 6 * s} Z`, { fill: '#FBCFE8', opacity: 0.9 }) +
                sparkle(cx, cy - 30 * s, 3 * s, '#ffffff', 0.95),
                {}
            );

        case 'halloween':
            // หมวกพ่อมด / แม่มดปีกกว้างยอดแหลมโค้งมน (Witch/Wizard Hat)
            return g(
                // ปีกหมวก
                ell(cx, cy - 7 * s, 18 * s, 4 * s, { fill: '#1E102F', stroke: goldColor, 'stroke-width': 1 }),
                // ยอดหมวกทรงกรวยปลายโค้ง
                path(`M ${cx - 10 * s} ${cy - 7 * s} C ${cx - 6 * s} ${cy - 20 * s}, ${cx + 2 * s} ${cy - 28 * s}, ${cx + 14 * s} ${cy - 34 * s} ` +
                     `C ${cx + 7 * s} ${cy - 24 * s}, ${cx + 5 * s} ${cy - 16 * s}, ${cx + 10 * s} ${cy - 7 * s} Z`, { fill: '#2A1640' }) +
                // สายคาดหมวกสีส้มทอง
                rect(cx - 7 * s, cy - 10 * s, 14 * s, 3 * s, { fill: '#EA580C' }),
                {}
            );

        case 'christmas':
            // มงกุฎกิ่งฮอลลี่และผลเบอร์รี่แดง (Holly Wreath Crown)
            return g(
                path(`M ${cx - 12 * s} ${cy - 8 * s} Q ${cx} ${cy - 14 * s}, ${cx + 12 * s} ${cy - 8 * s} ` +
                     `Q ${cx} ${cy - 10 * s}, ${cx - 12 * s} ${cy - 8 * s} Z`, { fill: '#15803D', stroke: '#14532D', 'stroke-width': 1.5 }) +
                // ผลเบอร์รี่สีแดง 3 เม็ด
                circle(cx - 3 * s, cy - 10 * s, 2.2 * s, { fill: '#DC2626' }) +
                circle(cx + 3 * s, cy - 10 * s, 2.2 * s, { fill: '#DC2626' }) +
                circle(cx, cy - 12 * s, 2.2 * s, { fill: '#DC2626' }) +
                sparkle(cx, cy - 16 * s, 3.5 * s, goldColor, 0.9),
                {}
            );

        case 'valentine':
            // มงกุฎดอกกุหลาบตูมสีชมพูแดง (Rose Garland Tiara)
            return g(
                path(`M ${cx - 12 * s} ${cy - 7 * s} Q ${cx} ${cy - 12 * s}, ${cx + 12 * s} ${cy - 7 * s}`, { stroke: '#E11D48', 'stroke-width': 2, fill: 'none' }) +
                circle(cx - 7 * s, cy - 9 * s, 3 * s, { fill: '#F43F5E' }) +
                circle(cx, cy - 11 * s, 3.5 * s, { fill: '#E11D48' }) +
                circle(cx + 7 * s, cy - 9 * s, 3 * s, { fill: '#F43F5E' }),
                {}
            );

        case 'minimalist':
            // วงแหวนทองมินิมอลเส้นเดี่ยว
            return g(
                path(`M ${cx - 12 * s} ${cy - 8 * s} Q ${cx} ${cy - 16 * s}, ${cx + 12 * s} ${cy - 8 * s}`, { stroke: goldColor, 'stroke-width': 1.5, fill: 'none' }) +
                circle(cx, cy - 16 * s, 1.8 * s, { fill: goldColor }),
                {}
            );

        default: // standard (มนตราสยามสากล)
            // รัดเกล้าดวงดาวศักดิ์สิทธิ์ (Celestial Star Tiara)
            return g(
                path(`M ${cx - 12 * s} ${cy - 7 * s} L ${cx - 8 * s} ${cy - 18 * s} L ${cx} ${cy - 12 * s} L ${cx + 8 * s} ${cy - 18 * s} L ${cx + 12 * s} ${cy - 7 * s} Z`, { fill: goldColor }) +
                sparkle(cx, cy - 20 * s, 4 * s, '#ffffff', 0.95),
                {}
            );
    }
}

/* ================================================================
   3. วาดการ์ดบุคคลหลัก (Major Arcana Figure Drawings)
   ================================================================ */

/**
 * 0. THE FOOL (นักเดินทาง / ผู้เริ่มต้นชีวิต)
 */
export function drawFoolFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = 152, py = 138; // พิกัดศีรษะ

    let attire = '';
    let accessories = '';

    if (deckId === 'songkran') {
        // หนุ่มนักเดินทางสงกรานต์: สะพายย่ามผ้าขาวม้า ถือขันเงินสลักลายน้ำอบ
        attire = g(
            // สไบผ้าพาดบ่าเฉียง
            path(`M ${px - 14} ${py + 24} C ${px - 22} ${py + 44}, ${px - 18} ${py + 62}, ${px - 10} ${py + 74} L ${px + 14} ${py + 74} L ${px + 12} ${py + 24} Z`, { fill: '#0284C7' }) +
            // ผ้าคาดเอวสีส้มทอง
            rect(px - 14, py + 52, 28, 6, { fill: '#F59E0B' }),
            {}
        );
        accessories = g(
            // ขันเงินใส่น้ำอบในมือ
            path(`M ${px + 18} ${py + 32} C ${px + 28} ${py + 32}, ${px + 26} ${py + 44}, ${px + 22} ${py + 46} L ${px + 14} ${py + 46} Z`, { fill: '#E2E8F0', stroke: '#94A3B8' }) +
            drop(px + 24, py + 26, 3.5, { fill: '#38BDF8' }) +
            drop(px + 28, py + 34, 2.5, { fill: '#38BDF8' }),
            {}
        );
    } else if (deckId === 'loy-krathong') {
        attire = g(
            // เสื้อไทยคอกลมผ้าไหมสีม่วงคราม ผ้านุ่งโจงกระเบน
            path(`M ${px - 14} ${py + 24} L ${px - 18} ${py + 74} L ${px + 16} ${py + 74} L ${px + 12} ${py + 24} Z`, { fill: '#6D28D9' }) +
            line(px, py + 24, px, py + 74, { stroke: gold, 'stroke-width': 1.2 }),
            {}
        );
        accessories = g(
            // ประคองกระทงจิ๋วในมือ
            ell(px + 18, py + 40, 9, 3.5, { fill: '#059669' }) +
            flame(px + 18, py + 34, 4, { fill: '#F59E0B' }),
            {}
        );
    } else if (deckId === 'halloween') {
        attire = g(
            // ผ้าคลุมนักเดินทางฮาโลวีนสีดำม่วง
            path(`M ${px - 16} ${py + 24} C ${px - 26} ${py + 48}, ${px - 22} ${py + 78}, ${px - 8} ${py + 78} L ${px + 18} ${py + 78} L ${px + 12} ${py + 24} Z`, { fill: '#3B0764' }),
            {}
        );
        accessories = g(
            // ตะเกียงฟักทองจิ๋วผูกปลายไม้เท้า
            circle(px - 34, py + 12, 8, { fill: '#EA580C' }) +
            line(px - 34, py + 4, px - 34, py + 8, { stroke: '#15803D', 'stroke-width': 2 }),
            {}
        );
    } else if (deckId === 'christmas') {
        attire = g(
            // เสื้อโค้ตกันหนาวสีแดงขลิบขนแกะขาว
            path(`M ${px - 16} ${py + 24} L ${px - 20} ${py + 74} L ${px + 18} ${py + 74} L ${px + 14} ${py + 24} Z`, { fill: '#DC2626' }) +
            rect(px - 18, py + 70, 36, 6, { fill: '#FFFFFF' }) +
            rect(px - 2, py + 24, 4, 46, { fill: '#FFFFFF' }),
            {}
        );
        accessories = g(
            // กล่องของขวัญผูกโบว์ที่ปลายไม้เท้า
            rect(px - 38, py + 6, 12, 12, { fill: '#15803D' }) +
            line(px - 32, py + 6, px - 32, py + 18, { stroke: '#F59E0B', 'stroke-width': 2 }) +
            line(px - 38, py + 12, px - 26, py + 12, { stroke: '#F59E0B', 'stroke-width': 2 }),
            {}
        );
    } else if (deckId === 'valentine') {
        attire = g(
            // เสื้อทูนิกสีชมพูอ่อน พร้อมปีกนางฟ้า
            path(`M ${px - 14} ${py + 24} L ${px - 16} ${py + 74} L ${px + 16} ${py + 74} L ${px + 12} ${py + 24} Z`, { fill: '#FB7185' }) +
            // ปีกเทวทูตสีขาวชมพู
            path(`M ${px - 14} ${py + 32} C ${px - 32} ${py + 18}, ${px - 36} ${py + 44}, ${px - 20} ${py + 48} Z`, { fill: '#FFFFFF', stroke: '#FDA4AF' }),
            {}
        );
        accessories = g(
            // ดอกกุหลาบแดงในมือ
            circle(px + 18, py + 34, 4, { fill: '#E11D48' }) +
            line(px + 18, py + 38, px + 18, py + 46, { stroke: '#15803D', 'stroke-width': 1.5 }),
            {}
        );
    } else {
        // standard / minimalist
        attire = g(
            path(`M ${px - 14} ${py + 24} C ${px - 22} ${py + 44}, ${px - 18} ${py + 62}, ${px - 12} ${py + 74} L ${px + 16} ${py + 74} L ${px + 12} ${py + 24} Z`, { fill: '#D97706' }) +
            rect(px - 14, py + 48, 28, 5, { fill: gold }),
            {}
        );
        accessories = g(
            // ดอกกุหลาบขาวแห่งความบริสุทธิ์
            circle(px + 18, py + 36, 4, { fill: '#FFFFFF' }) +
            sparkle(px + 18, py + 36, 3, gold, 0.9),
            {}
        );
    }

    return g(
        // ไม้เท้าสะพายย่ามนักเดินทาง
        line(px + 14, py + 14, px - 36, py + 8, { stroke: '#78350F', 'stroke-width': 3 }) +
        // ตัวนักเดินทาง
        attire +
        maleFace(px, py, s, 1, '#FCEADE', '#26132D') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        accessories +
        // สุนัขสหายร่วมทางสีขาว
        path(`M ${px + 30} ${py + 68} C ${px + 28} ${py + 52}, ${px + 44} ${py + 50}, ${px + 48} ${py + 62} C ${px + 44} ${py + 72}, ${px + 38} ${py + 72}, ${px + 30} ${py + 68} Z`, { fill: '#FFFFFF', stroke: '#CBD5E1', 'stroke-width': 1 }) +
        circle(px + 46, py + 58, 2, { fill: '#334155' }), // ตาหมา
        {}
    );
}

/**
 * 1. THE MAGICIAN (ผู้วิเศษ / สรรพสิ่งเป็นจริงได้ด้วยเจตจำนง)
 */
export function drawMagicianFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 126;

    let cloak = '';
    let wand = '';

    if (deckId === 'songkran') {
        cloak = g(
            // ชุดโจงกระเบนไหมทอง และสไบเฉียงพาดบ่าสีน้ำทะเล
            path(`M ${px - 18} ${py + 24} L ${px - 22} ${py + 76} L ${px + 22} ${py + 76} L ${px + 18} ${py + 24} Z`, { fill: '#0369A1' }) +
            path(`M ${px - 14} ${py + 24} L ${px + 14} ${py + 56} L ${px + 6} ${py + 76} L ${px - 18} ${py + 24} Z`, { fill: '#F59E0B' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: gold, 'stroke-width': 3 }) +
            drop(px + 36, py - 14, 5, { fill: '#38BDF8' }),
            {}
        );
    } else if (deckId === 'loy-krathong') {
        cloak = g(
            path(`M ${px - 18} ${py + 24} L ${px - 22} ${py + 76} L ${px + 22} ${py + 76} L ${px + 18} ${py + 24} Z`, { fill: '#4C1D95' }) +
            path(`M ${px - 18} ${py + 24} Q ${px} ${py + 40}, ${px + 18} ${py + 24} L ${px + 12} ${py + 76} L ${px - 12} ${py + 76} Z`, { fill: '#7C3AED' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: gold, 'stroke-width': 2.5 }) +
            flame(px + 36, py - 14, 5, { fill: '#F59E0B' }),
            {}
        );
    } else if (deckId === 'halloween') {
        cloak = g(
            path(`M ${px - 22} ${py + 22} C ${px - 34} ${py + 48}, ${px - 30} ${py + 76}, ${px - 24} ${py + 76} ` +
                 `L ${px + 24} ${py + 76} C ${px + 30} ${py + 76}, ${px + 34} ${py + 48}, ${px + 22} ${py + 22} Z`, { fill: '#1E102F', stroke: '#9333EA', 'stroke-width': 1.2 }) +
            path(`M ${px - 12} ${py + 24} L ${px + 12} ${py + 24} L ${px} ${py + 76} Z`, { fill: '#EA580C' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: '#7C3AED', 'stroke-width': 2.8 }) +
            sparkle(px + 36, py - 12, 6, '#C084FC', 0.95),
            {}
        );
    } else if (deckId === 'christmas') {
        cloak = g(
            path(`M ${px - 20} ${py + 24} L ${px - 24} ${py + 76} L ${px + 24} ${py + 76} L ${px + 20} ${py + 24} Z`, { fill: '#DC2626' }) +
            rect(px - 4, py + 24, 8, 52, { fill: '#FFFFFF' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: gold, 'stroke-width': 2.5 }) +
            star(px + 36, py - 12, 6, 2.5, 8, 0, { fill: gold }),
            {}
        );
    } else if (deckId === 'valentine') {
        cloak = g(
            path(`M ${px - 18} ${py + 24} L ${px - 22} ${py + 76} L ${px + 22} ${py + 76} L ${px + 18} ${py + 24} Z`, { fill: '#E11D48' }) +
            path(`M ${px - 12} ${py + 24} Q ${px} ${py + 36}, ${px + 12} ${py + 24} L ${px + 8} ${py + 76} L ${px - 8} ${py + 76} Z`, { fill: '#FDA4AF' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: gold, 'stroke-width': 2.5 }) +
            heart(px + 36, py - 12, 5, { fill: '#E11D48' }),
            {}
        );
    } else {
        cloak = g(
            path(`M ${px - 18} ${py + 24} L ${px - 22} ${py + 76} L ${px + 22} ${py + 76} L ${px + 18} ${py + 24} Z`, { fill: '#B91C1C' }) +
            path(`M ${px - 12} ${py + 24} L ${px + 12} ${py + 24} L ${px + 8} ${py + 76} L ${px - 8} ${py + 76} Z`, { fill: '#FFFFFF' }),
            {}
        );
        wand = g(
            line(px + 14, py + 22, px + 36, py - 10, { stroke: gold, 'stroke-width': 2.5 }) +
            sparkle(px + 36, py - 10, 5, '#FFFFFF', 0.95),
            {}
        );
    }

    return g(
        cloak +
        maleFace(px, py, s, 0, '#FDF0E6', '#26132D') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        // แขนขวาชูคฑาขึ้นฟ้า
        wand +
        // แขนซ้ายชี้ลงดิน
        line(px - 14, py + 28, px - 32, py + 62, { stroke: gold, 'stroke-width': 2 }) +
        sparkle(px - 32, py + 62, 3, gold, 0.9),
        {}
    );
}

/**
 * 2. THE HIGH PRIESTESS (พระแม่นักบวช / ปรีชาญาณลี้ลับ)
 */
export function drawPriestessFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 135;

    let robe = '';
    let veil = '';

    if (deckId === 'songkran') {
        // นางสงกรานต์ประทับแท่น: สไบทองกรองน้ำเงิน มงกุฎชฎาดอกมะลิ
        robe = g(
            path(`M ${px - 20} ${py + 20} L ${px - 26} ${py + 80} L ${px + 26} ${py + 80} L ${px + 20} ${py + 20} Z`, { fill: '#0C4A6E' }) +
            path(`M ${px - 16} ${py + 20} L ${px + 18} ${py + 50} L ${px + 10} ${py + 80} L ${px - 20} ${py + 20} Z`, { fill: '#BAE6FD' }),
            {}
        );
    } else if (deckId === 'loy-krathong') {
        // นางนพมาศ: สไบกรองจีบสีชมพูดอกบัวผสานม่วง
        robe = g(
            path(`M ${px - 20} ${py + 20} L ${px - 26} ${py + 80} L ${px + 26} ${py + 80} L ${px + 20} ${py + 20} Z`, { fill: '#581C87' }) +
            path(`M ${px - 16} ${py + 20} L ${px + 16} ${py + 20} L ${px + 10} ${py + 80} L ${px - 10} ${py + 80} Z`, { fill: '#FBCFE8' }),
            {}
        );
    } else if (deckId === 'halloween') {
        // แม่มดสาวแห่งรัตติกาล: ผ้าคลุมลูกไม้สีรัตติกาล
        robe = g(
            path(`M ${px - 22} ${py + 20} L ${px - 28} ${py + 80} L ${px + 28} ${py + 80} L ${px + 22} ${py + 20} Z`, { fill: '#2E1065' }),
            {}
        );
        veil = path(`M ${px - 16} ${py - 6} C ${px - 26} ${py + 18}, ${px - 24} ${py + 64}, ${px - 20} ${py + 76} L ${px + 20} ${py + 76} ` +
                    `C ${px + 24} ${py + 64}, ${px + 26} ${py + 18}, ${px + 16} ${py - 6} Z`, { fill: '#581C87', opacity: 0.65 });
    } else if (deckId === 'christmas') {
        robe = g(
            path(`M ${px - 20} ${py + 20} L ${px - 26} ${py + 80} L ${px + 26} ${py + 80} L ${px + 20} ${py + 20} Z`, { fill: '#14532D' }) +
            path(`M ${px - 12} ${py + 20} L ${px + 12} ${py + 20} L ${px + 8} ${py + 80} L ${px - 8} ${py + 80} Z`, { fill: '#DCFCE7' }),
            {}
        );
    } else if (deckId === 'valentine') {
        robe = g(
            path(`M ${px - 20} ${py + 20} L ${px - 26} ${py + 80} L ${px + 26} ${py + 80} L ${px + 20} ${py + 20} Z`, { fill: '#9F1239' }) +
            path(`M ${px - 14} ${py + 20} L ${px + 14} ${py + 20} L ${px + 10} ${py + 80} L ${px - 10} ${py + 80} Z`, { fill: '#FFE4E6' }),
            {}
        );
    } else {
        robe = g(
            path(`M ${px - 20} ${py + 20} L ${px - 26} ${py + 80} L ${px + 26} ${py + 80} L ${px + 20} ${py + 20} Z`, { fill: '#1E293B' }) +
            path(`M ${px - 14} ${py + 20} L ${px + 14} ${py + 20} L ${px + 8} ${py + 80} L ${px - 8} ${py + 80} Z`, { fill: '#F1F5F9' }),
            {}
        );
    }

    return g(
        veil +
        robe +
        femaleFace(px, py, s, 0, '#FFF5ED', '#1E102F') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold),
        {}
    );
}

/**
 * 3. THE EMPRESS (จักรพรรดินี / เทวีแห่งความอุดมสมบูรณ์)
 */
export function drawEmpressFigure(deckId, t) {
    const s = 1.15;
    const gold = t.suitGold;
    const px = CX, py = 132;

    let gown = '';
    let auraDecor = '';

    if (deckId === 'songkran') {
        // พระแม่โพสพ / เทพีสงกรานต์: ผ้ายกทองสไบแพร รวงข้าวทองคำ
        gown = path(`M ${px - 22} ${py + 22} C ${px - 34} ${py + 54}, ${px - 38} ${py + 86}, ${px - 34} ${py + 95} ` +
                    `L ${px + 34} ${py + 95} C ${px + 38} ${py + 86}, ${px + 34} ${py + 54}, ${px + 22} ${py + 22} Z`, { fill: '#0284C7' });
        auraDecor = g(
            circle(px + 32, py + 48, 4, { fill: '#F59E0B' }),
            {}
        );
    } else if (deckId === 'loy-krathong') {
        gown = path(`M ${px - 22} ${py + 22} C ${px - 34} ${py + 54}, ${px - 38} ${py + 86}, ${px - 34} ${py + 95} ` +
                    `L ${px + 34} ${py + 95} C ${px + 38} ${py + 86}, ${px + 34} ${py + 54}, ${px + 22} ${py + 22} Z`, { fill: '#7C3AED' });
    } else if (deckId === 'halloween') {
        gown = path(`M ${px - 24} ${py + 22} C ${px - 36} ${py + 54}, ${px - 40} ${py + 86}, ${px - 36} ${py + 95} ` +
                    `L ${px + 36} ${py + 95} C ${px + 40} ${py + 86}, ${px + 36} ${py + 54}, ${px + 24} ${py + 22} Z`, { fill: '#C2410C' });
    } else if (deckId === 'christmas') {
        gown = path(`M ${px - 24} ${py + 22} C ${px - 36} ${py + 54}, ${px - 40} ${py + 86}, ${px - 36} ${py + 95} ` +
                    `L ${px + 36} ${py + 95} C ${px + 40} ${py + 86}, ${px + 36} ${py + 54}, ${px + 24} ${py + 22} Z`, { fill: '#15803D' });
    } else if (deckId === 'valentine') {
        gown = path(`M ${px - 22} ${py + 22} C ${px - 34} ${py + 54}, ${px - 38} ${py + 86}, ${px - 34} ${py + 95} ` +
                    `L ${px + 34} ${py + 95} C ${px + 38} ${py + 86}, ${px + 34} ${py + 54}, ${px + 22} ${py + 22} Z`, { fill: '#BE123C' });
    } else {
        gown = path(`M ${px - 22} ${py + 22} C ${px - 34} ${py + 54}, ${px - 38} ${py + 86}, ${px - 34} ${py + 95} ` +
                    `L ${px + 34} ${py + 95} C ${px + 38} ${py + 86}, ${px + 34} ${py + 54}, ${px + 22} ${py + 22} Z`, { fill: '#F8FAFC', stroke: gold, 'stroke-width': 1.2 });
    }

    return g(
        gown +
        femaleFace(px, py, s, 0, '#FFF5ED', '#331B2A') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        auraDecor,
        {}
    );
}

/**
 * 4. THE EMPEROR (องค์จักรพรรดิ / อำนาจและโครงสร้างอันมั่นคง)
 */
export function drawEmperorFigure(deckId, t) {
    const s = 1.2;
    const gold = t.suitGold;
    const px = CX, py = 138;

    let robeColor = '#7F1D1D';
    if (deckId === 'songkran') robeColor = '#0369A1';
    else if (deckId === 'loy-krathong') robeColor = '#4C1D95';
    else if (deckId === 'halloween') robeColor = '#431407';
    else if (deckId === 'christmas') robeColor = '#14532D';
    else if (deckId === 'valentine') robeColor = '#881337';

    return g(
        // ฉลองพระองค์คลุมบัลลังก์
        path(`M ${px - 26} ${py + 22} C ${px - 36} ${py + 52}, ${px - 42} ${py + 88}, ${px - 38} ${py + 102} ` +
             `L ${px + 38} ${py + 102} C ${px + 42} ${py + 88}, ${px + 36} ${py + 52}, ${px + 26} ${py + 22} Z`, { fill: robeColor }) +
        // เกราะทองคำ
        path(`M ${px - 16} ${py + 24} L ${px + 16} ${py + 24} L ${px + 12} ${py + 58} L ${px - 12} ${py + 58} Z`, { fill: gold }) +
        maleFace(px, py, s, 0, '#FAD9C1', '#241410') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold),
        {}
    );
}

/**
 * 5. THE HIEROPHANT / THE CELESTIAL SAGE (คุรุผู้ชี้นำ / ปราชญ์ดาราศาสตร์แห่งดวงดาว)
 * ปราศจากจีวรหรือเครื่องแต่งกายทางศาสนาใดๆ ออกแบบเป็นนักปราชญ์ดาราศาสตร์ผู้ทรงภูมิ
 */
export function drawHierophantFigure(deckId, t) {
    const s = 1.15;
    const gold = t.suitGold;
    const px = CX, py = 136;

    // สีชุดคลุมปราชญ์ดาราศาสตร์ตามเทศกาล (หลีกเลี่ยงสีจีวรพระสงฆ์โดยสิ้นเชิง)
    let robeColor = '#1E1B4B'; // midnight navy sapphire
    let sashColor = '#4338CA';
    if (deckId === 'songkran') {
        robeColor = '#0369A1'; // azure ocean blue
        sashColor = '#38BDF8';
    } else if (deckId === 'loy-krathong') {
        robeColor = '#312E81'; // nocturnal indigo
        sashColor = '#D946EF';
    } else if (deckId === 'halloween') {
        robeColor = '#2E1065'; // dark plum velvet
        sashColor = '#EA580C';
    } else if (deckId === 'christmas') {
        robeColor = '#14532D'; // emerald pine velvet
        sashColor = '#15803D';
    } else if (deckId === 'valentine') {
        robeColor = '#4C0519'; // deep velvet wine
        sashColor = '#FB7185';
    }

    return g(
        // เสื้อคลุมปราชญ์ดาราศาสตร์ทรงยาว
        path(`M ${px - 26} ${py + 22} L ${px - 34} ${py + 96} L ${px + 34} ${py + 96} L ${px + 26} ${py + 22} Z`, { fill: robeColor }) +
        // สายสะพายแถบลายดวงดาว / แผนที่จักรวาล
        path(`M ${px - 14} ${py + 22} L ${px + 14} ${py + 22} L ${px + 9} ${py + 96} L ${px - 9} ${py + 96} Z`, { fill: sashColor, opacity: 0.85 }) +
        // ดาวประกายทองบนชุดคลุม
        sparkle(px, py + 48, 4, gold, 0.9) +
        sparkle(px - 18, py + 72, 3, gold, 0.75) +
        sparkle(px + 18, py + 72, 3, gold, 0.75) +
        // ใบหน้าปราชญ์ผู้เฒ่าเคราเงิน
        sageFace(px, py, s, 0, '#F5DEB3', '#F1F5F9') +
        // รัดเกล้าปราชญ์ดาราศาสตร์
        path(`M ${px - 14 * s} ${py - 12 * s} Q ${px} ${py - 18 * s}, ${px + 14 * s} ${py - 12 * s} L ${px + 12 * s} ${py - 8 * s} Q ${px} ${py - 14 * s}, ${px - 12 * s} ${py - 8 * s} Z`, { fill: gold }) +
        circle(px, py - 18 * s, 3.5, { fill: gold }),
        {}
    );
}

/**
 * 6. THE LOVERS (คู่แท้แห่งจิตวิญญาณ / พรหมลิขิต)
 */
export function drawLoversFigures(deckId, t) {
    const gold = t.suitGold;
    const p1x = CX - 32, p1y = 175; // ฝ่ายหญิง
    const p2x = CX + 32, p2y = 175; // ฝ่ายชาย

    let angel = '';
    let attire1 = '', attire2 = '';

    if (deckId === 'songkran') {
        attire1 = path(`M ${p1x - 12} ${p1y + 20} L ${p1x - 16} ${p1y + 60} L ${p1x + 14} ${p1y + 60} L ${p1x + 10} ${p1y + 20} Z`, { fill: '#0284C7' });
        attire2 = path(`M ${p2x - 10} ${p2y + 20} L ${p2x - 14} ${p2y + 60} L ${p2x + 16} ${p2y + 60} L ${p2x + 12} ${p2y + 20} Z`, { fill: '#F59E0B' });
        // ขันสรงน้ำแห่งความรัก
        angel = g(
            drop(CX, 168, 4, { fill: '#38BDF8' }),
            {}
        );
    } else if (deckId === 'loy-krathong') {
        attire1 = path(`M ${p1x - 12} ${p1y + 20} L ${p1x - 16} ${p1y + 60} L ${p1x + 14} ${p1y + 60} L ${p1x + 10} ${p1y + 20} Z`, { fill: '#7C3AED' });
        attire2 = path(`M ${p2x - 10} ${p2y + 20} L ${p2x - 14} ${p2y + 60} L ${p2x + 16} ${p2y + 60} L ${p2x + 12} ${p2y + 20} Z`, { fill: '#D97706' });
        // กระทงลอยเคียงกัน
        angel = g(
            ell(CX, 195, 12, 4, { fill: '#059669' }) +
            flame(CX, 190, 4, { fill: '#F59E0B' }),
            {}
        );
    } else if (deckId === 'valentine') {
        attire1 = path(`M ${p1x - 12} ${p1y + 20} L ${p1x - 16} ${p1y + 60} L ${p1x + 14} ${p1y + 60} L ${p1x + 10} ${p1y + 20} Z`, { fill: '#F43F5E' });
        attire2 = path(`M ${p2x - 10} ${p2y + 20} L ${p2x - 14} ${p2y + 60} L ${p2x + 16} ${p2y + 60} L ${p2x + 12} ${p2y + 20} Z`, { fill: '#9F1239' });
        // คิวปิดแผลงศรความรักด้านบน
        angel = g(
            heart(CX, 138, 8, { fill: '#E11D48' }) +
            path(`M ${CX - 18} 136 C ${CX - 32} 124, ${CX - 28} 146, ${CX - 12} 144 Z`, { fill: '#FFFFFF' }) +
            path(`M ${CX + 18} 136 C ${CX + 32} 124, ${CX + 28} 146, ${CX + 12} 144 Z`, { fill: '#FFFFFF' }),
            {}
        );
    } else {
        attire1 = path(`M ${p1x - 12} ${p1y + 20} L ${p1x - 16} ${p1y + 60} L ${p1x + 14} ${p1y + 60} L ${p1x + 10} ${p1y + 20} Z`, { fill: '#FFFFFF', stroke: gold, 'stroke-width': 1 });
        attire2 = path(`M ${p2x - 10} ${p2y + 20} L ${p2x - 14} ${p2y + 60} L ${p2x + 16} ${p2y + 60} L ${p2x + 12} ${p2y + 20} Z`, { fill: '#1E293B' });
    }

    return g(
        angel +
        // ฝ่ายหญิง (หันหน้าเข้าหาคู่)
        attire1 +
        femaleFace(p1x, p1y, 0.95, 1, '#FFF5ED', '#24142D') +
        festivalHeadwear(deckId, p1x, p1y, 'tiara', 0.9, gold) +
        // ฝ่ายชาย (หันหน้าเข้าหาคู่)
        attire2 +
        maleFace(p2x, p2y, 0.95, -1, '#FAD9C1', '#331B15') +
        festivalHeadwear(deckId, p2x, p2y, 'circlet', 0.9, gold) +
        // มือสองฝ่ายประสานกันตรงกลาง
        line(p1x + 10, p1y + 35, CX, p1y + 38, { stroke: gold, 'stroke-width': 2 }) +
        line(p2x - 10, p2y + 35, CX, p1y + 38, { stroke: gold, 'stroke-width': 2 }) +
        circle(CX, p1y + 38, 2.5, { fill: gold }),
        {}
    );
}

/**
 * 8. STRENGTH (ความกล้าหาญและความอ่อนโยนสยบพญาราชสีห์)
 */
export function drawStrengthFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = 100, py = 145; // สตรีผู้เมตตา
    const lx = 148, ly = 195; // ราชสีห์

    return g(
        // สตรีผู้เมตตาโน้มตัวลูบหัวสิงโต
        path(`M ${px - 14} ${py + 22} C ${px - 22} ${py + 52}, ${px - 18} ${py + 76}, ${px - 12} ${py + 84} ` +
             `L ${px + 22} ${py + 84} C ${px + 24} ${py + 58}, ${px + 20} ${py + 42}, ${px + 12} ${py + 22} Z`, { fill: deckId === 'songkran' ? '#E0F2FE' : '#FFFDF9', stroke: gold, 'stroke-width': 1 }) +
        femaleFace(px, py, s, 1, '#FFF5ED', '#26132D') +
        festivalHeadwear(deckId, px, py, 'tiara', s, gold) +
        // แขนเอื้อมไปลูบหัวสิงโตอย่างอ่อนโยน
        line(px + 10, py + 34, lx - 18, ly - 8, { stroke: gold, 'stroke-width': 2.2 }) +
        circle(lx - 18, ly - 8, 3, { fill: '#FDF0E6' }) +
        // หัวพญาราชสีห์สีทองสง่างาม
        path(`M ${lx - 22} ${ly - 18} C ${lx - 12} ${ly - 32}, ${lx + 16} ${ly - 32}, ${lx + 24} ${ly - 16} ` +
             `C ${lx + 32} ${ly}, ${lx + 18} ${ly + 22}, ${lx} ${ly + 22} ` +
             `C ${lx - 16} ${ly + 22}, ${lx - 28} ${ly + 6}, ${lx - 22} ${ly - 18} Z`, { fill: '#D97706' }) + // แผงคอ
        circle(lx - 4, ly, 10, { fill: '#F59E0B' }) + // หน้าสิงโต
        circle(lx + 1, ly - 2, 2, { fill: '#1E293B' }), // ตาสิงโต
        {}
    );
}

/**
 * 9. THE HERMIT (ฤๅษี / ผู้ส่องประทีปนำทางในความมืด)
 */
export function drawHermitFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 135;

    let lantern = '';
    if (deckId === 'songkran') {
        lantern = g(
            rect(px + 26, py + 20, 14, 18, { fill: '#E2E8F0', stroke: gold, 'stroke-width': 1.5 }) +
            flame(px + 33, py + 29, 5, { fill: '#F59E0B' }),
            {}
        );
    } else if (deckId === 'halloween') {
        // ตะเกียงฟักทองเรืองแสง
        lantern = g(
            circle(px + 33, py + 29, 10, { fill: '#EA580C' }) +
            flame(px + 33, py + 29, 4, { fill: '#FEF08A' }),
            {}
        );
    } else {
        lantern = g(
            rect(px + 26, py + 18, 14, 20, 2, { fill: 'none', stroke: gold, 'stroke-width': 1.8 }) +
            star(px + 33, py + 28, 6, 2.5, 6, 0, { fill: '#FBBF24' }),
            {}
        );
    }

    return g(
        // เสื้อคลุมนักพรตยาวคลุมเท้า
        path(`M ${px - 22} ${py + 20} C ${px - 32} ${py + 54}, ${px - 30} ${py + 90}, ${px - 22} ${py + 104} ` +
             `L ${px + 22} ${py + 104} C ${px + 28} ${py + 90}, ${px + 26} ${py + 54}, ${px + 18} ${py + 20} Z`, { fill: '#334155' }) +
        sageFace(px, py, s, 1, '#F5DEB3', '#ECEFF1') +
        // ไม้เท้าค้ำยัน
        line(px - 24, py + 24, px - 24, py + 104, { stroke: '#78350F', 'stroke-width': 3 }) +
        // แขนขวาชูตะเกียงส่องสว่าง
        line(px + 12, py + 28, px + 33, py + 18, { stroke: gold, 'stroke-width': 2.2 }) +
        lantern,
        {}
    );
}

/**
 * 11. JUSTICE (ความยุติธรรม / ดาบและตราชั่ง)
 */
export function drawJusticeFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 135;

    return g(
        // ฉลองพระองค์เทพีแห่งความยุติธรรม
        path(`M ${px - 22} ${py + 22} L ${px - 28} ${py + 92} L ${px + 28} ${py + 92} L ${px + 22} ${py + 22} Z`, { fill: '#991B1B' }) +
        femaleFace(px, py, s, 0, '#FFF5ED', '#1E102F') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        // มือขวาถือดาบตั้งตรง
        line(px + 26, py + 52, px + 26, py - 4, { stroke: '#E2E8F0', 'stroke-width': 2.5 }) +
        line(px + 20, py + 40, px + 32, py + 40, { stroke: gold, 'stroke-width': 2 }) +
        // มือซ้ายถือตราชั่งสมดุล
        line(px - 14, py + 34, px - 34, py + 28, { stroke: gold, 'stroke-width': 1.8 }) +
        line(px - 44, py + 28, px - 24, py + 28, { stroke: gold, 'stroke-width': 2 }) +
        line(px - 40, py + 28, px - 42, py + 42, { stroke: gold, 'stroke-width': 1 }) +
        line(px - 28, py + 28, px - 26, py + 42, { stroke: gold, 'stroke-width': 1 }) +
        ell(px - 42, py + 42, 6, 2.5, { fill: gold }) +
        ell(px - 26, py + 42, 6, 2.5, { fill: gold }),
        {}
    );
}

/**
 * 14. TEMPERANCE (เทวทูตแห่งการหลอมรวม / สาดเทน้ำอมฤต)
 */
export function drawTemperanceFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 132;

    return g(
        // ปีกเทวทูตสยายกว้าง
        path(`M ${px - 18} ${py + 28} C ${px - 58} ${py - 12}, ${px - 54} ${py + 54}, ${px - 24} ${py + 62} Z`, { fill: '#FEF08A', stroke: gold, 'stroke-width': 1 }) +
        path(`M ${px + 18} ${py + 28} C ${px + 58} ${py - 12}, ${px + 54} ${py + 54}, ${px + 24} ${py + 62} Z`, { fill: '#FEF08A', stroke: gold, 'stroke-width': 1 }) +
        // อาภรณ์สีขาวสะอาด
        path(`M ${px - 18} ${py + 22} L ${px - 24} ${py + 95} L ${px + 24} ${py + 95} L ${px + 18} ${py + 22} Z`, { fill: '#F8FAFC', stroke: gold, 'stroke-width': 1 }) +
        femaleFace(px, py, s, 0, '#FFF5ED', '#D97706') +
        festivalHeadwear(deckId, px, py, 'tiara', s, gold) +
        // ถ้วยบนและถ้วยล่าง พร้อมสายน้ำทิพย์ไหลเชื่อม
        ell(px + 14, py + 38, 7, 3.5, { fill: gold }) +
        ell(px - 14, py + 68, 7, 3.5, { fill: gold }) +
        path(`M ${px + 14} ${py + 38} Q ${px} ${py + 52}, ${px - 14} ${py + 68}`, { stroke: '#38BDF8', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }),
        {}
    );
}

/**
 * 17. THE STAR (ดวงดารา / เทพีรินน้ำแห่งความหวัง)
 */
export function drawStarFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = 100, py = 158;

    return g(
        // เทพีคุกเข่าริมสระน้ำ รินคนโทคู่
        path(`M ${px - 14} ${py + 18} C ${px - 20} ${py + 44}, ${px - 14} ${py + 68}, ${px - 6} ${py + 74} ` +
             `L ${px + 26} ${py + 74} C ${px + 24} ${py + 52}, ${px + 18} ${py + 36}, ${px + 12} ${py + 18} Z`, { fill: '#F1F5F9', stroke: gold, 'stroke-width': 1 }) +
        femaleFace(px, py, s, 1, '#FFF5ED', '#D97706') +
        festivalHeadwear(deckId, px, py, 'tiara', s, gold) +
        // คนโทน้ำในมือทั้งสองข้าง
        ell(px + 18, py + 38, 6, 4, { fill: gold }) +
        path(`M ${px + 18} ${py + 42} Q ${px + 28} ${py + 58}, ${px + 38} ${py + 72}`, { stroke: '#38BDF8', 'stroke-width': 2.5, fill: 'none' }) +
        ell(px - 14, py + 42, 6, 4, { fill: gold }) +
        path(`M ${px - 14} ${py + 46} Q ${px - 20} ${py + 58}, ${px - 24} ${py + 72}`, { stroke: '#38BDF8', 'stroke-width': 2.5, fill: 'none' }),
        {}
    );
}

/**
 * 21. THE WORLD (โลก / ผู้เริงระบำในวงล้อมกิ่งชัยพฤกษ์)
 */
export function drawWorldFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = CX, py = 145;

    return g(
        // ผ้าคลุมสีม่วงพริ้วสะบัดเป็นเลข 8 / รัศมี
        path(`M ${px - 16} ${py + 18} C ${px - 34} ${py + 38}, ${px - 28} ${py + 72}, ${px - 12} ${py + 84} ` +
             `L ${px + 14} ${py + 84} C ${px + 30} ${py + 72}, ${px + 32} ${py + 38}, ${px + 14} ${py + 18} Z`, { fill: '#7C3AED', opacity: 0.85 }) +
        femaleFace(px, py, s, 0, '#FFF5ED', '#1E102F') +
        festivalHeadwear(deckId, px, py, 'tiara', s, gold) +
        // ไม้กายสิทธิ์คู่ในมือทั้งสอง
        line(px - 24, py + 18, px - 24, py + 62, { stroke: gold, 'stroke-width': 2.5 }) +
        line(px + 24, py + 18, px + 24, py + 62, { stroke: gold, 'stroke-width': 2.5 }),
        {}
    );
}

/* ================================================================
   4. ไพ่บุคคล (Court Cards: Page, Knight, Queen, King)
   ================================================================ */

export function drawCourtFigure(kind, suit, deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 142;
    const suitColor = t.suits[suit] || gold;

    if (kind === 11) { // PAGE (มหาดเล็ก / ผู้เริ่มต้น)
        return g(
            // เสื้อทูนิกของมหาดเล็ก
            path(`M ${px - 16} ${py + 20} L ${px - 20} ${py + 72} L ${px + 20} ${py + 72} L ${px + 16} ${py + 20} Z`, { fill: suitColor }) +
            rect(px - 14, py + 46, 28, 5, { fill: gold }) +
            maleFace(px, py, s, 0, '#FDF0E6', '#3E2723') +
            festivalHeadwear(deckId, px, py, 'circlet', s, gold),
            {}
        );
    } else if (kind === 12) { // KNIGHT (อัศวินผู้กล้า)
        return g(
            // เกราะหน้าอกอัศวิน
            path(`M ${px - 18} ${py + 20} L ${px - 22} ${py + 72} L ${px + 22} ${py + 72} L ${px + 18} ${py + 20} Z`, { fill: '#475569', stroke: gold, 'stroke-width': 1.5 }) +
            // หมวกเกราะยอดขนนก
            rrect(px - 12, py - 6, 24, 18, 4, { fill: '#64748B', stroke: gold, 'stroke-width': 1.5 }) +
            line(px - 8, py + 2, px + 8, py + 2, { stroke: '#0F172A', 'stroke-width': 2.5 }) +
            path(`M ${px} ${py - 6} C ${px + 8} ${py - 22}, ${px + 22} ${py - 18}, ${px + 24} ${py - 8} Z`, { fill: suitColor }),
            {}
        );
    } else if (kind === 13) { // QUEEN (ราชินีแห่งบัลลังก์)
        return g(
            // ฉลองพระองค์พระราชินี
            path(`M ${px - 22} ${py + 20} C ${px - 32} ${py + 52}, ${px - 36} ${py + 84}, ${px - 32} ${py + 95} ` +
                 `L ${px + 32} ${py + 95} C ${px + 36} ${py + 84}, ${px + 32} ${py + 52}, ${px + 22} ${py + 20} Z`, { fill: suitColor }) +
            femaleFace(px, py, s, 0, '#FFF5ED', '#1E102F') +
            festivalHeadwear(deckId, px, py, 'crown', s, gold),
            {}
        );
    } else { // KING (กษัตริย์ผู้ทรงอำนาจ)
        return g(
            // ฉลองพระองค์กษัตริย์
            path(`M ${px - 24} ${py + 20} L ${px - 30} ${py + 95} L ${px + 30} ${py + 95} L ${px + 24} ${py + 20} Z`, { fill: '#1E293B', stroke: suitColor, 'stroke-width': 2 }) +
            path(`M ${px - 14} ${py + 20} L ${px + 14} ${py + 20} L ${px + 10} ${py + 75} L ${px - 10} ${py + 75} Z`, { fill: suitColor }) +
            maleFace(px, py, s, 0, '#FAD9C1', '#2A1608') +
            festivalHeadwear(deckId, px, py, 'crown', s, gold),
            {}
        );
    }
}

/**
 * 7. THE CHARIOT (รถศึก / ชัยชนะและการควบคุมพลังขัดแย้ง)
 */
export function drawChariotFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = CX, py = 138;
    return g(
        // เกราะหน้านักรบ
        path(`M ${px - 18} ${py + 20} L ${px - 22} ${py + 62} L ${px + 22} ${py + 62} L ${px + 18} ${py + 20} Z`, { fill: '#475569', stroke: gold, 'stroke-width': 1.5 }) +
        maleFace(px, py, s, 0, '#FAD9C1', '#1E293B') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        star(px, py - 20, 6, 2.5, 8, -90, { fill: gold }),
        {}
    );
}

/**
 * 12. THE HANGED MAN (คนห้อยหัว / การมองโลกมุมใหม่และการตื่นรู้)
 */
export function drawHangedManFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = CX, py = 210;
    return g(
        circle(px, py, 22, { fill: 'none', stroke: gold, 'stroke-width': 1.5 }) +
        star(px, py, 26, 18, 16, 0, { fill: 'none', stroke: gold, 'stroke-width': 0.8 }) +
        maleFace(px, py, s, 0, '#FCEADE', '#3E2723'),
        {}
    );
}

/**
 * 15. THE DEVIL (ปีศาจ / พันธนาการลวงตา)
 */
export function drawDevilFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 132;
    return g(
        path(`M ${px - 8} ${py - 6} Q ${px - 26} ${py - 30}, ${px - 18} ${py - 12}`, { stroke: gold, 'stroke-width': 3, fill: 'none' }) +
        path(`M ${px + 8} ${py - 6} Q ${px + 26} ${py - 30}, ${px + 18} ${py - 12}`, { stroke: gold, 'stroke-width': 3, fill: 'none' }) +
        star(px, py - 18, 8, 3.2, 5, 90, { fill: '#EF4444' }) +
        maleFace(px, py, s, 0, '#64748B', '#0F172A'),
        {}
    );
}

/**
 * 19. THE SUN (ดวงอาทิตย์ / ความบริสุทธิ์และรุ่งโรจน์)
 */
export function drawSunFigure(deckId, t) {
    const s = 1.0;
    const gold = t.suitGold;
    const px = CX, py = 172;
    return g(
        path(`M ${px - 12} ${py + 18} L ${px - 16} ${py + 48} L ${px + 16} ${py + 48} L ${px + 12} ${py + 18} Z`, { fill: '#FEF08A' }) +
        femaleFace(px, py, s, 0, '#FDF0E6', '#F59E0B') +
        festivalHeadwear(deckId, px, py, 'circlet', s, gold) +
        path(`M ${px} ${py - 8} Q ${px + 8} ${py - 24}, ${px + 12} ${py - 20} Q ${px + 4} ${py - 16}, ${px} ${py - 8}`, { fill: '#EF4444' }),
        {}
    );
}

/**
 * 20. JUDGEMENT (การพิพากษา / แตรสวรรค์ตื่นรู้)
 */
export function drawJudgementFigure(deckId, t) {
    const s = 1.1;
    const gold = t.suitGold;
    const px = CX, py = 120;
    return g(
        path(`M ${px - 16} ${py + 18} C ${px - 55} ${py - 20}, ${px - 50} ${py + 45}, ${px - 20} ${py + 55} Z`, { fill: '#FFFFFF', stroke: gold, 'stroke-width': 1 }) +
        path(`M ${px + 16} ${py + 18} C ${px + 55} ${py - 20}, ${px + 50} ${py + 45}, ${px + 20} ${py + 55} Z`, { fill: '#FFFFFF', stroke: gold, 'stroke-width': 1 }) +
        femaleFace(px, py, s, 1, '#FFF5ED', '#D97706') +
        festivalHeadwear(deckId, px, py, 'tiara', s, gold),
        {}
    );
}

/**
 * 13. DEATH (การเปลี่ยนแปลง / อัศวินแห่งการเกิดใหม่และเริ่มต้นสู่วิถีใหม่)
 * ปราศจากโครงกระดูกหรือสัญลักษณ์ทางศาสนา วาดเป็นอัศวินแห่งการตื่นรู้ผู้ถือธงกุหลาบขาว 5 กลีบ
 */
export function drawDeathFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = CX - 6, py = 142;

    let armorColor = '#1E1B4B';
    let capeColor = '#312E81';
    let bannerBg = '#0F0B21';

    if (deckId === 'songkran') {
        armorColor = '#0369A1';
        capeColor = '#0284C7';
        bannerBg = '#0C4A6E';
    } else if (deckId === 'loy-krathong') {
        armorColor = '#4C1D95';
        capeColor = '#6D28D9';
        bannerBg = '#1E1B4B';
    } else if (deckId === 'halloween') {
        armorColor = '#431407';
        capeColor = '#9A3412';
        bannerBg = '#1C0A2A';
    } else if (deckId === 'christmas') {
        armorColor = '#14532D';
        capeColor = '#15803D';
        bannerBg = '#052E16';
    } else if (deckId === 'valentine') {
        armorColor = '#4C0519';
        capeColor = '#9F1239';
        bannerBg = '#881337';
    } else if (deckId === 'minimalist') {
        armorColor = '#334155';
        capeColor = '#475569';
        bannerBg = '#1E293B';
    }

    return g(
        // ผ้าคลุมไหล่อัศวินพริ้วไปข้างหลัง
        path(`M ${px - 14} ${py + 22} C ${px - 34} ${py + 44}, ${px - 36} ${py + 72}, ${px - 24} ${py + 84} ` +
             `L ${px + 20} ${py + 84} C ${px + 30} ${py + 72}, ${px + 28} ${py + 44}, ${px + 14} ${py + 22} Z`, { fill: capeColor, opacity: 0.9 }) +
        // ชุดเกราะหน้าอกสง่างาม
        path(`M ${px - 16} ${py + 20} L ${px - 22} ${py + 78} L ${px + 22} ${py + 78} L ${px + 16} ${py + 20} Z`, { fill: armorColor, stroke: gold, 'stroke-width': 1.5 }) +
        // หัวไหล่เกราะทองคำ
        circle(px - 16, py + 24, 5, { fill: gold }) +
        circle(px + 16, py + 24, 5, { fill: gold }) +
        // ใบหน้าบุรุษนักรบ
        maleFace(px, py, s, 0, '#FAD9C1', '#2A1608') +
        festivalHeadwear(deckId, px, py, 'crown', s, gold) +
        // เสาธงทองคำในมือขวา
        line(px + 24, py - 28, px + 24, py + 84, { stroke: gold, 'stroke-width': 2.5 }) +
        circle(px + 24, py - 28, 3.5, { fill: gold }) +
        sparkle(px + 24, py - 28, 4, '#ffffff', 0.95) +
        // ธงโบกสะบัดประดับดอกกุหลาบขาว 5 กลีบแห่งการเกิดใหม่ (Mystic Rose)
        path(`M ${px + 24} ${py - 24} L ${px + 58} ${py - 24} L ${px + 48} ${py - 8} L ${px + 58} ${py + 8} L ${px + 24} ${py + 8} Z`, { fill: bannerBg, stroke: gold, 'stroke-width': 1.2 }) +
        star(px + 40, py - 8, 8.5, 4.2, 5, -90, { fill: '#ffffff' }) +
        circle(px + 40, py - 8, 2.5, { fill: gold }),
        {}
    );
}

/**
 * 18. THE MOON (ดวงจันทร์ / การเดินทางแห่งจิตวิญญาณใต้แสงจันทร์)
 * เทพีหรือนักเดินทางแห่งรัตติกาลริมผืนน้ำศักดิ์สิทธิ์ ยืนสงบนิ่งมองสายน้ำและดวงจันทร์
 */
export function drawMoonFigure(deckId, t) {
    const s = 1.05;
    const gold = t.suitGold;
    const px = CX, py = 168;

    let gownColor = '#1E1B4B';
    let veilColor = '#818CF8';

    if (deckId === 'songkran') {
        gownColor = '#0369A1';
        veilColor = '#38BDF8';
    } else if (deckId === 'loy-krathong') {
        gownColor = '#4C1D95';
        veilColor = '#C084FC';
    } else if (deckId === 'halloween') {
        gownColor = '#3B0764';
        veilColor = '#FB923C';
    } else if (deckId === 'christmas') {
        gownColor = '#064E3B';
        veilColor = '#86EFAC';
    } else if (deckId === 'valentine') {
        gownColor = '#881337';
        veilColor = '#FDA4AF';
    } else if (deckId === 'minimalist') {
        gownColor = '#334155';
        veilColor = '#94A3B8';
    }

    return g(
        // ชุดคลุมยาวแห่งรัตติกาล
        path(`M ${px - 14} ${py + 18} C ${px - 24} ${py + 40}, ${px - 26} ${py + 64}, ${px - 16} ${py + 74} ` +
             `L ${px + 16} ${py + 74} C ${px + 26} ${py + 64}, ${px + 24} ${py + 40}, ${px + 14} ${py + 18} Z`, { fill: gownColor }) +
        // ผ้าคลุมไหล่พริ้วไหว
        path(`M ${px - 12} ${py + 18} Q ${px - 24} ${py + 36}, ${px - 16} ${py + 60}`, { stroke: veilColor, 'stroke-width': 2.2, fill: 'none', opacity: 0.85 }) +
        path(`M ${px + 12} ${py + 18} Q ${px + 24} ${py + 36}, ${px + 16} ${py + 60}`, { stroke: veilColor, 'stroke-width': 2.2, fill: 'none', opacity: 0.85 }) +
        // สตรีผู้พิทักษ์แห่งรัตติกาล
        femaleFace(px, py, s, 0, '#FFF5ED', '#1E102F') +
        festivalHeadwear(deckId, px, py, 'circlet', s, gold) +
        // เข็มกลัดดวงจันทร์เสี้ยวบนพระอุระ
        crescent(px, py + 26, 4, gold) +
        sparkle(px, py + 26, 3, '#ffffff', 0.9),
        {}
    );
}
