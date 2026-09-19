/**
 * Provides a symbolic remedy recommendation based on reading context.
 * Focuses on mindfulness and psychological support (no fear-based language).
 * 
 * @param {Array} remediesData - Loaded remedies JSON
 * @param {string} category - e.g., 'love', 'finance', 'work'
 * @param {string} status - e.g., 'positive', 'neutral', 'caution'
 * @returns {Object} Remedy object
 */
export function getRemedy(remediesData, category, status) {
    if (!remediesData || remediesData.length === 0) return null;

    let groupId = 'wisdom'; // default fallback

    if (status === 'caution') {
        // If there's a caution, focus on protection, healing, or focus
        const cautionMap = {
            'love': 'healing',
            'finance': 'stability',
            'work': 'protection'
        };
        groupId = cautionMap[category] || 'protection';
    } else {
        // For positive/neutral, map to aligned goals
        const positiveMap = {
            'love': 'love',
            'finance': 'prosperity',
            'work': 'confidence'
        };
        groupId = positiveMap[category] || 'wisdom';
    }

    return remediesData.find(r => r.group_id === groupId) || remediesData[0];
}

/**
 * Provides a color recommendation based on the reading context.
 * 
 * @param {Array} colorsData - Loaded colors JSON
 * @param {string} category - e.g., 'love', 'finance', 'work'
 * @param {string} status - e.g., 'positive', 'neutral', 'caution'
 * @returns {Object} Color object with hex and meaning
 */
export function getColorRecommendation(colorsData, category, status) {
    if (!colorsData || colorsData.length === 0) return null;

    let colorId = 'white'; // default

    if (status === 'caution') {
        const cautionMap = {
            'love': 'pink',      // gentle healing
            'finance': 'blue',   // calm planning
            'work': 'black'      // protection/boundary
        };
        colorId = cautionMap[category] || 'white';
    } else {
        const positiveMap = {
            'love': 'red',
            'finance': 'gold',
            'work': 'green'
        };
        colorId = positiveMap[category] || 'orange';
    }

    return colorsData.find(c => c.color_id === colorId) || colorsData[0];
}
