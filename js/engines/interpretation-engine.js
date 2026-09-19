/**
 * Retrieves the contextual interpretation for a specific card, category, and subtopic.
 * Falls back to 'overall' subtopic if specific subtopic is not found.
 * Falls back to a generic response if no interpretation exists at all (useful for missing mock data).
 * 
 * @param {Array} interpretationsData - Full JSON data of interpretations
 * @param {string} cardId - e.g., 'major-19'
 * @param {string} category - 'love', 'finance', or 'work'
 * @param {string} subtopic - e.g., 'overall', 'single', 'ex'
 * @returns {Object} Interpretation object containing score, status, summary, action, warning
 */
export function getInterpretation(interpretationsData, cardId, category, subtopic = 'overall') {
    if (!interpretationsData || !Array.isArray(interpretationsData)) {
        console.error("Invalid interpretations data");
        return generateFallbackInterpretation(category);
    }

    // 1. Try exact match (card + category + subtopic)
    let match = interpretationsData.find(
        i => i.card_id === cardId && i.category === category && i.subtopic === subtopic
    );

    // 2. Fallback to 'overall' for this category
    if (!match && subtopic !== 'overall') {
        match = interpretationsData.find(
            i => i.card_id === cardId && i.category === category && i.subtopic === 'overall'
        );
    }

    // 3. Absolute fallback if card data is missing completely (Mock data limits)
    if (!match) {
        return generateFallbackInterpretation(category);
    }

    return match;
}

/**
 * Generates a safe fallback interpretation when data is missing.
 */
function generateFallbackInterpretation(category) {
    const defaultTexts = {
        'love': 'รอการปรับปรุงคำทำนายด้านความรัก',
        'finance': 'รอการปรับปรุงคำทำนายด้านการเงิน',
        'work': 'รอการปรับปรุงคำทำนายด้านการงาน'
    };

    return {
        card_id: 'unknown',
        category: category,
        subtopic: 'unknown',
        score: 3,
        status: 'neutral',
        summary: defaultTexts[category] || 'รอการปรับปรุงคำทำนาย',
        action: 'ขอให้ใช้สติปัญญาและความรอบคอบในการดำเนินชีวิต',
        warning: null
    };
}
