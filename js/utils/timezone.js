/**
 * Get the current date in YYYY-MM-DD format for the Asia/Bangkok timezone.
 * Used for deterministic daily card generation.
 * @returns {string} e.g. "2026-09-15"
 */
export function getThaiDateString() {
    const date = new Date();
    // 'en-CA' gives YYYY-MM-DD format natively
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
}

/**
 * Get a nicely formatted Thai date string for UI display.
 * @returns {string} e.g. "วันอังคารที่ 15 ก.ย. 2569"
 */
export function formatThaiDateDisplay() {
    const date = new Date();
    return date.toLocaleDateString('th-TH', {
        timeZone: 'Asia/Bangkok',
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export const getBangkokDateString = getThaiDateString;
