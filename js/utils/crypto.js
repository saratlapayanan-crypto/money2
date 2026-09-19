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
    if (crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return new Uint8Array(hashBuffer);
    }
    
    // Fallback: simple deterministic hash for development on http://
    console.warn('[Crypto] crypto.subtle not available (http://). Using fallback hash.');
    const result = new Uint8Array(32);
    for (let i = 0; i < data.length; i++) {
        result[i % 32] = (result[i % 32] ^ data[i]) + ((result[(i + 1) % 32] << 1) | 1);
        result[i % 32] = result[i % 32] & 0xFF;
    }
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
    
    // Combine the first few bytes to create a large integer
    // 4 bytes gives us up to ~4.2 billion, plenty for modulo 78
    let value = 0;
    for (let i = 0; i < 4; i++) {
        value = (value << 8) | hashArray[i];
    }
    
    // Ensure positive value
    value = Math.abs(value);
    
    return value % max;
}

/**
 * Securely generate a random integer between 0 and max-1.
 * MUST NOT use Math.random().
 * @param {number} max 
 * @returns {number}
 */
export function getSecureRandom(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
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
