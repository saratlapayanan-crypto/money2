const USER_ID_KEY = 'tarot_user_id_v1';
let memoryUserId = null;

/**
 * Retrieves the anonymous user ID from localStorage.
 * If one does not exist, generates a unique ID, saves it, and returns it.
 * Resilient to private browsing mode and environments without crypto.randomUUID.
 * @returns {string} Unique identifier
 */
export function getOrCreateUserId() {
    try {
        const stored = localStorage.getItem(USER_ID_KEY);
        if (stored) return stored;
    } catch (_) {}

    if (memoryUserId) return memoryUserId;

    let newId = '';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        try { newId = crypto.randomUUID(); } catch (_) {}
    }
    if (!newId) {
        let randVal = Math.floor(Math.random() * 0xFFFFFFFF);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            try {
                const arr = new Uint32Array(1);
                crypto.getRandomValues(arr);
                randVal = arr[0];
            } catch (_) {}
        }
        newId = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9) + '-' + randVal.toString(36);
    }

    try {
        localStorage.setItem(USER_ID_KEY, newId);
    } catch (_) {}
    memoryUserId = newId;
    return newId;
}
