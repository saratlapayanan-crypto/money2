import { loadCards, loadInterpretations } from './data-loader.js';
import { getDailyCard } from './engines/daily-engine.js';
import { getInterpretation } from './engines/interpretation-engine.js';
import { formatThaiDateDisplay, getThaiDateString } from './utils/timezone.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { paintFront } from './art/tarot-art.js';
import { getDayOfWeekFromDateString, calculateOutfitAdvice } from './domain/lucky-colors.js';
import { renderMoonRabbitSvg } from './art/moon-rabbit.js';
import { renderOutfitMannequinSvg, renderShirtIconSvg, renderPantsIconSvg } from './art/outfit-icons.js';

async function initDailyPage() {
    try {
        try {
            await setupGlobalDecks();
        } catch (deckErr) {
            console.warn("Deck setup failed (non-critical):", deckErr);
        }
        const dateElement = document.getElementById('daily-date');
        if (dateElement) dateElement.textContent = formatThaiDateDisplay();

        let [cards, interpretations] = await Promise.all([
            loadCards(),
            loadInterpretations()
        ]);

        await displayDailyCard(cards, interpretations, false);

        const redrawBtn = document.getElementById('btn-redraw-card');
        if (redrawBtn) {
            redrawBtn.addEventListener('click', async () => {
                redrawBtn.disabled = true;
                redrawBtn.classList.add('opacity-50');
                await displayDailyCard(cards, interpretations, true);
                redrawBtn.disabled = false;
                redrawBtn.classList.remove('opacity-50');
            });
        }

    } catch (error) {
        console.error("Failed to initialize daily page:", error);
        document.getElementById('daily-message').textContent = "เกิดข้อผิดพลาดในการแปลผลไพ่";
    }
}

async function displayDailyCard(cards, interpretations, forceNew = false) {
    const { card, debugInfo } = await getDailyCard(cards, forceNew);

    renderCard(card);
    const energies = renderEnergies(card.id, interpretations);
    
    // วิเคราะห์สไตล์การแต่งกายและสีมงคลประจำวันตามพลังงานไพ่
    if (energies) {
        const thaiDate = getThaiDateString();
        const dayIndex = getDayOfWeekFromDateString(thaiDate);
        const advice = calculateOutfitAdvice({
            dayIndex,
            loveScore: energies.loveData.score,
            financeScore: energies.financeData.score,
            workScore: energies.workData.score
        });
        renderOutfitAdvice(advice);
    }

    renderDebugInfo(debugInfo);

    // Track daily card view
    trackEvent('view_daily_card', { card_id: card.id, card_name: card.name });
}

function renderCard(card) {
    const cardContainer = document.getElementById('card-display');
    if (!cardContainer) return;

    // วาดภาพไพ่ด้วยระบบศิลป์ SVG (ตามธีมสำรับที่ใช้งาน)
    paintFront(cardContainer, card, getActiveDeckId());
    cardContainer.classList.add('has-svg-art');
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
        if (dailyData && dailyData.summary && !dailyData.summary.startsWith('รอการปรับปรุง')) {
            dailyMsg.textContent = dailyData.summary;
        } else {
            dailyMsg.textContent = `คำแนะนำหลักของวันนี้: ${workData.action}`;
        }
    }

    const container = document.getElementById('energy-container');
    if (!container) return;
    
    container.innerHTML = `
        ${createEnergyHTML('✦ ความรัก', 'text-pink-600', loveData)}
        ${createEnergyHTML('✦ การเงิน', 'text-[#B45309]', financeData)}
        ${createEnergyHTML('✦ การงาน', 'text-indigo-600', workData)}
    `;

    return { loveData, financeData, workData };
}

function renderOutfitAdvice(advice) {
    const container = document.getElementById('outfit-advice-container');
    if (!container || !advice) return;

    container.innerHTML = `
    <div class="panel p-5 border border-amber-300/40 relative overflow-hidden bg-gradient-to-br from-white via-[#FAF7FD] to-[#FDF8EE] shadow-lg">
        <!-- Mascot & Header -->
        <div class="flex items-center gap-3.5 border-b border-amber-200/50 pb-4 mb-4">
            <div class="shrink-0 p-1.5 rounded-full bg-white border border-amber-300/60 shadow-md shadow-purple-500/10">
                ${renderMoonRabbitSvg({ size: 62 })}
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2.5 py-0.5 rounded-full border border-amber-400/50 text-[#8A5D0B] bg-amber-50 font-medium">✦ น้องกระต่ายจันทราแนะแนว</span>
                    <span class="text-xs text-[#7A6B85]">ประจำ${advice.day.name_th}</span>
                </div>
                <h3 class="text-lg font-bold text-[#261633] mt-1">สูตรแต่งกาย & สีมงคลวันนี้</h3>
            </div>
        </div>

        <!-- Strategy Note -->
        <div class="bg-white/90 rounded-xl p-3.5 border border-purple-100/80 mb-4 text-xs sm:text-sm text-[#4A3B55] leading-relaxed shadow-xs">
            <p class="italic">"${advice.strategyNote}"</p>
        </div>

        <!-- Visual Ratio Bar (แถบสัดส่วนสี) -->
        <div class="mb-4">
            <div class="flex justify-between items-center text-xs mb-1.5 font-semibold">
                <span class="flex items-center gap-1.5" style="color: ${advice.formula.mainColor.hex}">
                    <span class="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" style="background: ${advice.formula.mainColor.hex}"></span>
                    สีหลัก: ${advice.formula.mainColor.name} (${advice.formula.ratioMain}%)
                </span>
                <span class="flex items-center gap-1.5" style="color: ${advice.formula.subColor.hex}">
                    <span class="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" style="background: ${advice.formula.subColor.hex}"></span>
                    สีรอง: ${advice.formula.subColor.name} (${advice.formula.ratioSub}%)
                </span>
            </div>
            
            <div class="w-full h-5 rounded-full overflow-hidden flex border border-purple-200/60 shadow-inner bg-[#F5EFFB]">
                <div class="h-full flex items-center justify-center text-[10px] font-bold text-white shadow transition-all duration-500" 
                     style="width: ${advice.formula.ratioMain}%; background: ${advice.formula.mainColor.hex}; text-shadow: 0 1px 2px rgba(0,0,0,0.65);">
                    ${advice.formula.ratioMain}%
                </div>
                <div class="h-full flex items-center justify-center text-[10px] font-bold text-white shadow transition-all duration-500" 
                     style="width: ${advice.formula.ratioSub}%; background: ${advice.formula.subColor.hex}; text-shadow: 0 1px 2px rgba(0,0,0,0.65);">
                    ${advice.formula.ratioSub}%
                </div>
            </div>
        </div>

        <!-- 3 Styled Fashion Looks (แมตช์คู่สีเสื้อ-กางเกงจริง ไม่เสร่อ) -->
        <div class="mb-4 space-y-3">
            <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-[#8A5D0B] uppercase tracking-wider">✦ ไอเดียแมตช์ 3 ลุค (เสื้อ + กางเกง)</h4>
                <span class="text-[10px] text-[#7A6B85]">Color Harmony</span>
            </div>
            
            <div class="space-y-3">
                ${advice.looks.map(look => `
                    <div class="bg-white/95 rounded-xl p-3.5 border border-purple-100/80 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-xs sm:text-sm text-[#261633]">${look.title}</span>
                            <span class="text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/50 text-[#8A5D0B] bg-amber-50 font-semibold">${look.badge}</span>
                        </div>
                        
                        <!-- Main Outfit Layout: Mannequin Frame on left, Details on right -->
                        <div class="flex items-center gap-3.5">
                            <div class="shrink-0 p-1.5 rounded-xl bg-gradient-to-b from-white to-[#F9F6FC] border border-purple-100 shadow-sm">
                                ${renderOutfitMannequinSvg({
                                    topHex: look.top.hex,
                                    bottomHex: look.bottom.hex,
                                    width: 76,
                                    height: 104
                                })}
                            </div>

                            <div class="flex-grow space-y-2 text-xs">
                                <div class="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8FC] border border-purple-100/60">
                                    <span class="shrink-0">${renderShirtIconSvg({ hex: look.top.hex, size: 24 })}</span>
                                    <div class="min-w-0 flex-grow">
                                        <div class="text-[10px] text-[#7A6B85]">เสื้อท่อนบน: <span class="text-[#261633] font-medium">${look.top.item}</span></div>
                                        <div class="font-semibold text-[#261633] flex items-center gap-1.5 mt-0.5">
                                            <span class="inline-block w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background: ${look.top.hex}"></span>
                                            <span>${look.top.color}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8FC] border border-purple-100/60">
                                    <span class="shrink-0">${renderPantsIconSvg({ hex: look.bottom.hex, size: 24 })}</span>
                                    <div class="min-w-0 flex-grow">
                                        <div class="text-[10px] text-[#7A6B85]">กางเกง/กระโปรง: <span class="text-[#261633] font-medium">${look.bottom.item}</span></div>
                                        <div class="font-semibold text-[#261633] flex items-center gap-1.5 mt-0.5">
                                            <span class="inline-block w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style="background: ${look.bottom.hex}"></span>
                                            <span>${look.bottom.color}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p class="text-[11px] text-[#5A4866] leading-relaxed bg-[#FFFDF5] p-2.5 rounded-lg border border-amber-200/60">
                            ✦ <strong class="text-[#8A5D0B]">ทริคแต่งกาย:</strong> ${look.tip}
                        </p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Avoid Color Warning -->
        <div class="rounded-xl p-3.5 border border-rose-200 bg-rose-50/80 flex items-start gap-2.5 text-xs text-rose-900 shadow-sm">
            <span class="text-base shrink-0 text-rose-500 font-bold">✦</span>
            <div>
                <strong class="text-rose-800">สีกาลกิณีที่ควรเลี่ยงวันนี้: ${advice.avoid.name}</strong>
                <p class="text-rose-700 mt-0.5 leading-relaxed">${advice.avoid.reason}</p>
            </div>
        </div>

        <!-- Daily Lucky Palette Grid -->
        <div class="mt-5 pt-4 border-t border-purple-100/80">
            <div class="flex justify-between items-center mb-2.5">
                <h4 class="text-xs font-bold text-[#8A5D0B] uppercase tracking-wider">✦ ตารางสีมงคลประจำ${advice.day.name_th}</h4>
                <span class="text-[10px] text-[#7A6B85]">ตามหลักทักษาปกรณ์</span>
            </div>
            <div class="grid grid-cols-1 gap-2 text-xs">
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-purple-100/60 shadow-xs">
                    <span class="text-indigo-700 flex items-center gap-1 font-medium">✦ การงาน</span>
                    <div class="flex gap-1.5 flex-wrap justify-end">
                        ${advice.dailyPalette.work.map(c => `
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium border border-purple-100/80 flex items-center gap-1 shadow-xs" style="background: ${c.hex}18; color: #261633">
                                <span class="w-2 h-2 rounded-full" style="background: ${c.hex}"></span>${c.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-purple-100/60 shadow-xs">
                    <span class="text-amber-800 flex items-center gap-1 font-medium">✦ การเงิน</span>
                    <div class="flex gap-1.5 flex-wrap justify-end">
                        ${advice.dailyPalette.finance.map(c => `
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium border border-purple-100/80 flex items-center gap-1 shadow-xs" style="background: ${c.hex}18; color: #261633">
                                <span class="w-2 h-2 rounded-full" style="background: ${c.hex}"></span>${c.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-purple-100/60 shadow-xs">
                    <span class="text-pink-700 flex items-center gap-1 font-medium">✦ ความรัก</span>
                    <div class="flex gap-1.5 flex-wrap justify-end">
                        ${advice.dailyPalette.love.map(c => `
                            <span class="px-2 py-0.5 rounded text-[11px] font-medium border border-purple-100/80 flex items-center gap-1 shadow-xs" style="background: ${c.hex}18; color: #261633">
                                <span class="w-2 h-2 rounded-full" style="background: ${c.hex}"></span>${c.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ป้ายสถานะแบบไทย ใช้สำนวนแบบหมอดูไทย ๆ
const STATUS_LABELS = {
    'positive': { th: 'ดวงเปิด', icon: '✦', badge: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
    'neutral':  { th: 'รอจังหวะ', icon: '✦', badge: 'border-amber-300 text-amber-800 bg-amber-50' },
    'caution':  { th: 'เดินระวัง', icon: '✦', badge: 'border-rose-300 text-rose-800 bg-rose-50' }
};

function createEnergyHTML(title, titleClass, data) {
    const statusColorMap = {
        'positive': 'text-emerald-500',
        'neutral': 'text-amber-500',
        'caution': 'text-rose-500'
    };

    const label = STATUS_LABELS[data.status] || { th: data.status, icon: '✦', badge: 'border-purple-200 text-[#4A3B55] bg-purple-50' };
    const starColor = statusColorMap[data.status] || 'text-[#7A6B85]';
    const stars = '★'.repeat(data.score) + '☆'.repeat(5 - data.score);

    return `
    <div class="panel p-4">
        <div class="flex items-center justify-between mb-2 gap-2">
            <h4 class="${titleClass} font-bold">${title}</h4>
            <span class="text-xs px-2.5 py-0.5 rounded-full border shrink-0 ${label.badge}">${label.icon} ${label.th}</span>
        </div>
        <div class="flex justify-between items-center mb-2">
            <span class="tracking-[0.25em] ${starColor}" aria-label="พลังงาน ${data.score} จาก 5">${stars}</span>
            <span class="text-xs text-[#7A6B85]">${data.score}/5</span>
        </div>
        <p class="text-sm text-[#4A3B55] leading-relaxed mb-2">${data.summary}</p>
        ${data.warning ? `<p class="text-xs text-rose-700 font-medium leading-relaxed">⚠️ ${data.warning}</p>` : ''}
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
