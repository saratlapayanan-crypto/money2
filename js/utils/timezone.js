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

/**
 * Calculates remaining time until next midnight in Asia/Bangkok (UTC+7).
 * @returns {{ hours: number, minutes: number, seconds: number, formatted: string, isNextDay: boolean }}
 */
export function getTimeUntilMidnightBangkok() {
    const now = new Date();
    // Bangkok is strictly UTC+7 all year without DST
    const nowUtcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const bangkokTime = new Date(nowUtcMs + 7 * 3600000);

    const bangkokMidnight = new Date(bangkokTime);
    bangkokMidnight.setHours(24, 0, 0, 0);

    const diffMs = bangkokMidnight.getTime() - bangkokTime.getTime();
    if (diffMs <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00', isNextDay: true };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return {
        hours,
        minutes,
        seconds,
        formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
        isNextDay: false
    };
}
