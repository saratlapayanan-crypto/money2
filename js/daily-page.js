import { loadCards, loadInterpretations } from './data-loader.js';
import { getDailyCard } from './engines/daily-engine.js';
import { getInterpretation } from './engines/interpretation-engine.js';
import { formatThaiDateDisplay } from './utils/timezone.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks } from './engines/deck-engine.js';

async function initDailyPage() {
    try {
        try {
            await setupGlobalDecks();
        } catch (deckErr) {
            console.warn("Deck setup failed (non-critical):", deckErr);
        }
        const dateElement = document.getElementById('daily-date');
        if (dateElement) dateElement.textContent = formatThaiDateDisplay();

        const [cards, interpretations] = await Promise.all([
            loadCards(),
            loadInterpretations()
        ]);

        const { card, debugInfo } = await getDailyCard(cards);

        renderCard(card);
        renderEnergies(card.id, interpretations);
        renderDebugInfo(debugInfo);

        // Track daily card view
        trackEvent('view_daily_card', { card_id: card.id, card_name: card.name });

    } catch (error) {
        console.error("Failed to initialize daily page:", error);
        document.getElementById('daily-message').textContent = "เกิดข้อผิดพลาดในการแปลผลไพ่";
    }
}

function renderCard(card) {
    const cardContainer = document.getElementById('card-display');
    const numberEl = document.getElementById('card-number');
    const titleEl = document.getElementById('card-title');
    const symbolEl = document.getElementById('card-symbol');

    if (!cardContainer || !titleEl) return;

    const themeClass = card.suit || card.arcana; 
    cardContainer.className = `card-placeholder mb-6 shadow-lg ${themeClass}`;

    numberEl.textContent = card.number;
    titleEl.innerHTML = `${card.name}<br><span class="text-sm font-normal">${card.thai_name}</span>`;

    const symbolMap = { 'wands': '♦', 'cups': '♥', 'swords': '⚔', 'pentacles': '⬟', 'major': '✦' };
    symbolEl.textContent = symbolMap[themeClass] || '✦';
}

function renderEnergies(cardId, interpretations) {
    // Generate interpretations for all 3 categories
    const loveData = getInterpretation(interpretations, cardId, 'love');
    const financeData = getInterpretation(interpretations, cardId, 'finance');
    const workData = getInterpretation(interpretations, cardId, 'work');
    
    // Attempt to get daily message
    const dailyData = getInterpretation(interpretations, cardId, 'daily', 'message');
    
    const dailyMsg = document.getElementById('daily-message');
    if (dailyMsg) {
        if (dailyData && dailyData.summary && dailyData.summary !== 'รอการปรับปรุงคำทำนายด้านdaily') {
            dailyMsg.textContent = dailyData.summary;
        } else {
            dailyMsg.textContent = `คำแนะนำหลัก: ${workData.action}`;
        }
    }

    const container = document.getElementById('energy-container');
    if (!container) return;
    
    container.innerHTML = `
        ${createEnergyHTML('💕 ความรัก', 'text-pink-400', loveData)}
        ${createEnergyHTML('💰 การเงิน', 'text-gold', financeData)}
        ${createEnergyHTML('💼 การงาน', 'text-blue-400', workData)}
    `;
}

function createEnergyHTML(title, titleClass, data) {
    const statusColorMap = {
        'positive': 'text-green-400',
        'neutral': 'text-yellow-400',
        'caution': 'text-red-400'
    };
    const barColorMap = {
        'positive': 'bg-green-400',
        'neutral': 'bg-yellow-400',
        'caution': 'bg-red-400'
    };
    
    const statusColor = statusColorMap[data.status] || 'text-gray-400';
    const barColor = barColorMap[data.status] || 'bg-gray-400';
    const percentage = (data.score / 5) * 100;

    return `
    <div class="bg-white/5 p-4 rounded-lg border border-white/10">
        <h4 class="${titleClass} font-bold mb-1">${title}</h4>
        <div class="flex justify-between text-sm mb-2">
            <span class="${statusColor} capitalize">${data.status}</span>
            <span>${data.score}/5</span>
        </div>
        <div class="w-full bg-gray-700 h-2 rounded-full mb-2">
            <div class="${barColor} h-2 rounded-full" style="width: ${percentage}%"></div>
        </div>
        <p class="text-sm text-gray-300 mb-2">${data.summary}</p>
        ${data.warning ? `<p class="text-xs text-red-400 mb-1">⚠️ ${data.warning}</p>` : ''}
    </div>`;
}

function renderDebugInfo(debugInfo) {
    if (!debugInfo) return;
    const debugSection = document.getElementById('debug-section');
    if (debugSection) {
        debugSection.classList.remove('hidden');
        debugSection.innerHTML = `<h3 class="text-red-500 font-bold mb-2">🛠️ DEBUG MODE (tarot_debug=true)</h3><pre class="whitespace-pre-wrap">${JSON.stringify(debugInfo, null, 2)}</pre>`;
    }
}

document.addEventListener('DOMContentLoaded', initDailyPage);
