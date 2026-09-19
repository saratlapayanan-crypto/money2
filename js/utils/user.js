const USER_ID_KEY = 'tarot_user_id_v1';

/**
 * Retrieves the anonymous user ID from localStorage.
 * If one does not exist, generates a new one using crypto.randomUUID(), saves it, and returns it.
 * @returns {string} UUIDv4
 */
export function getOrCreateUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            userId = crypto.randomUUID();
        } else {
            const rand = new Uint32Array(1);
            crypto.getRandomValues(rand);
            userId = 'fallback-' + Date.now().toString() + '-' + rand[0];
        }
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}
