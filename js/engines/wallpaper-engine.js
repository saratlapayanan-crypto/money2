/**
 * Resolves the appropriate wallpaper based on reading context.
 * 
 * @param {Array} wallpapersData - Loaded wallpapers JSON
 * @param {string} cardId - e.g., 'major-19'
 * @param {string} category - e.g., 'love', 'finance', 'work'
 * @param {string} remedyGroupId - mapped from remedy engine
 * @returns {Object} Wallpaper object
 */
export function getWallpaper(wallpapersData, cardId, category, remedyGroupId) {
    if (!wallpapersData || wallpapersData.length === 0) return null;

    // MVP Logic: Match by category first, fallback to protection if caution
    let match = wallpapersData.find(w => w.category === category);
    
    if (remedyGroupId === 'protection' || remedyGroupId === 'healing') {
        const protectionMatch = wallpapersData.find(w => w.category === 'protection');
        if (protectionMatch) match = protectionMatch;
    }

    return match || wallpapersData[0];
}
