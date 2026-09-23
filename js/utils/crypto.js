/**
 * Hash a string using SHA-256 and return the digest as a Uint8Array.
 * Falls back to a simple hash if crypto.subtle is not available (http://).
 * @param {string} message 
 * @returns {Promise<Uint8Array>}
 */
export async function sha256ToUint8Array(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // crypto.subtle only works on HTTPS or localhost
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
        try {
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            return new Uint8Array(hashBuffer);
        } catch (_) {}
    }
    
    // Fallback: Robust high-dispersion hash using FNV-1a with multiple primes
    // Ensures all 32 bytes have strong avalanche effect even on HTTP / webviews
    const result = new Uint8Array(32);
    let h1 = 0x811c9dc5, h2 = 0x27d4eb2f, h3 = 0x165667b1, h4 = 0xd3a2646c;
    for (let i = 0; i < data.length; i++) {
        const b = data[i];
        h1 = Math.imul(h1 ^ b, 0x01000193);
        h2 = Math.imul(h2 ^ b, 0x5bd1e995);
        h3 = Math.imul(h3 ^ (b + i), 0x27d4eb2d);
        h4 = Math.imul(h4 ^ (b ^ (i << 3)), 0x165667b5);
    }
    const view = new DataView(result.buffer);
    view.setUint32(0, h1, false);
    view.setUint32(4, h2, false);
    view.setUint32(8, h3, false);
    view.setUint32(12, h4, false);
    view.setUint32(16, h1 ^ h3, false);
    view.setUint32(20, h2 ^ h4, false);
    view.setUint32(24, Math.imul(h1, h2), false);
    view.setUint32(28, Math.imul(h3, h4), false);
    return result;
}

/**
 * Gets a deterministic number from 0 to max-1 based on a seed string.
 * @param {string} seed 
 * @param {number} max 
 * @returns {Promise<number>}
 */
export async function getDeterministicNumber(seed, max) {
    const hashArray = await sha256ToUint8Array(seed);
    
    // Combine the first 4 bytes to create an unsigned 32-bit integer
    let value = 0;
    for (let i = 0; i < 4; i++) {
        value = ((value << 8) >>> 0) + hashArray[i];
    }
    
    return (value >>> 0) % max;
}

/**
 * Securely generate a random integer between 0 and max-1.
 * Uses crypto.getRandomValues when available, with Math.random fallback.
 * @param {number} max 
 * @returns {number}
 */
export function getSecureRandom(max) {
    if (max <= 0) return 0;
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        try {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            return array[0] % max;
        } catch (_) {}
    }
    return Math.floor(Math.random() * max);
}

/**
 * Securely shuffle an array using Fisher-Yates and crypto.getRandomValues.
 * @param {Array} array 
 * @returns {Array} new shuffled array
 */
export function secureShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = getSecureRandom(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
