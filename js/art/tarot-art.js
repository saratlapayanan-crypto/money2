/* ================================================================
   Tarot Art API — จุดเชื่อมเดียวสำหรับเรนเดอร์หน้า/หลังไพ่
   ใช้: import { renderCardFront, renderCardBack } from './art/tarot-art.js';
   ================================================================ */
import { renderFront } from './fronts.js';
import { renderBack } from './backs.js';

// re-export สำหรับผู้ใช้ที่ต้องการสร้าง SVG string เอง (เช่น ทำ data-URI)
export { renderFront, renderBack };

/**
 * เรนเดอร์หน้าไพ่เป็น SVG string
 * @param {Object} card  ข้อมูลไพ่จาก cards.json
 * @param {string} deckId รหัสธีม (standard | songkran | loy-krathong | halloween | christmas | valentine | minimalist)
 */
export function renderCardFront(card, deckId = 'standard') {
    return renderFront(card, deckId);
}

/**
 * เรนเดอร์หลังไพ่เป็น SVG string
 * @param {string} deckId รหัสธีม
 */
export function renderCardBack(deckId = 'standard') {
    return renderBack(deckId);
}

/** แทนที่เนื้อหาใน container ด้วย SVG หน้าไพ่ */
export function paintFront(container, card, deckId = 'standard') {
    if (!container) return;
    container.innerHTML = renderFront(card, deckId);
    container.classList.add('has-svg-art');
}

/** แทนที่เนื้อหาใน container ด้วย SVG หลังไพ่ */
export function paintBack(container, deckId = 'standard') {
    if (!container) return;
    container.innerHTML = renderBack(deckId);
    container.classList.add('has-svg-art');
}
