import { loadCards, loadInterpretations, loadRemedies, loadColors, loadWallpapers, loadAffiliates } from './data-loader.js';
import { getInterpretation } from './engines/interpretation-engine.js';
import { getSession, SPREAD_MODES } from './engines/personal-engine.js';
import { getRemedy, getColorRecommendation } from './engines/remedy-engine.js';
import { getWallpaper } from './engines/wallpaper-engine.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { paintFront } from './art/tarot-art.js';
import {
    saveReadingToHistory,
    shareTarotReading,
    generateCardWallpaperDataUrl,
    generateStorySpreadDataUrl,
    getYesNoVerdict,
    showToast
} from './utils/share-and-history.js';
import { initSoundAndPwa, playCardTap } from './utils/sound-effects.js';
import { recordReadingStreak, getCardElementExplanation } from './utils/streak-and-guide.js';
import { renderTipBox } from './ui/monetization-ui.js';
import { buildAffiliateSearchUrl } from './config/monetization-config.js';

async function initResultPage() {
    initSoundAndPwa();
    try {
        await setupGlobalDecks();

        const session = getSession();
        if (!session || !session.locked || !session.cardId) {
            window.location.href = 'index.html';
            return;
        }

        const [cards, interpretations, questionsRes, remedies, colors, wallpapers, affiliates] = await Promise.all([
            loadCards(),
            loadInterpretations(),
            fetch('./data/questions.json'),
            loadRemedies(),
            loadColors(),
            loadWallpapers(),
            loadAffiliates()
        ]);
        const questionsData = await questionsRes.json();

        recordReadingStreak();
        await renderResult(session, cards, interpretations, questionsData, remedies, colors, wallpapers);
        renderAffiliates(session.category, affiliates);
        renderTipBox(document.getElementById('tip-box-section'));
    } catch (e) {
        console.error('Error loading result:', e);
        const qEl = document.getElementById('question-text');
        if (qEl) qEl.textContent = 'เกิดข้อผิดพลาดในการโหลดคำทำนาย';
    }
}

function resolveCardById(cards, cardId) {
    let cardData = cards.find(c => c.id === cardId);
    if (!cardData) {
        const [arcanaSuit, num] = String(cardId || 'major-0').split('-');
        cardData = {
            id: cardId,
            number: num,
            name: String(cardId).replace('-', ' ').toUpperCase(),
            thai_name: '(รอโหลดข้อมูลไพ่)',
            arcana: arcanaSuit === 'major' ? 'major' : 'minor',
            suit: arcanaSuit === 'major' ? null : arcanaSuit
        };
    }
    if (cardData.arcana === 'minor' && cardData.number) {
        cardData.number = Number(cardData.number);
    }
    return cardData;
}

function renderCardDetailInspection(cardData, interp) {
    const cardContainer = document.getElementById('card-display');
    if (cardContainer) {
        paintFront(cardContainer, cardData, getActiveDeckId());
        cardContainer.classList.add('has-svg-art');
    }

    // อธิบายธาตุและหมวดไพ่ด้วยภาษาคนทั่วไปเข้าใจง่าย
    const elemInfo = getCardElementExplanation(cardData);
    const elemBadge = document.getElementById('element-badge');
    const elemSub = document.getElementById('element-sub');
    const elemDesc = document.getElementById('element-desc');
    if (elemBadge) elemBadge.textContent = elemInfo.badge;
    if (elemSub) elemSub.textContent = elemInfo.element;
    if (elemDesc) elemDesc.textContent = elemInfo.simpleMeaning;

    // 1. Mirror of Mind
    const summaryEl = document.getElementById('interp-summary');
    if (summaryEl) summaryEl.textContent = interp.summary;

    const reflectionEl = document.getElementById('interp-reflection');
    const quote = cardData.reflection || cardData.meaning_upright || 'รับรู้และโอบรับทุกความรู้สึก เพื่อให้สัญชาตญาณพาคุณก้าวไปข้างหน้า';
    if (reflectionEl) {
        reflectionEl.textContent = `“${quote}”`;
    }

    // 2. Caution & Blindspot
    const warningEl = document.getElementById('interp-warning');
    const warningContainer = document.getElementById('warning-container');
    if (warningEl && warningContainer) {
        const warningText = interp.warning || cardData.meaning_reversed || 'ระวังความกังวลหรือความเร่งรีบด่วนตัดสินใจ ให้เวลาตนเองได้ไตร่ตรองอย่างรอบคอบ';
        warningEl.textContent = warningText;
        warningContainer.classList.remove('hidden');
    }

    // 3. Actionable Guidance
    const actionEl = document.getElementById('interp-action');
    if (actionEl) actionEl.textContent = interp.action || 'จัดลำดับความสำคัญและลงมือทำทีละก้าวอย่างมั่นใจ';
}

async function renderResult(session, cards, interpretations, questionsData, remedies, colors, wallpapers) {
    // 1. Render Question Text & Spread Mode Badge
    const catList = questionsData[session.category] || [];
    const qObj = catList.find(q => q.slug === session.subtopic);
    const questionLabel = qObj ? qObj.label_th : 'คำถามของคุณ';
    document.getElementById('question-text').textContent = questionLabel;

    const modeObj = SPREAD_MODES[session.spreadMode] || SPREAD_MODES.single;
    const modeBadgeEl = document.getElementById('spread-mode-badge');
    if (modeBadgeEl) {
        modeBadgeEl.textContent = `${modeObj.badge_th} · คำถามของคุณ`;
    }

    // 2. Resolve All Drawn Cards (1 or 3 cards)
    const rawCardIds = Array.isArray(session.cardIds) && session.cardIds.length > 0 ? session.cardIds : [session.cardId];
    const drawnCards = rawCardIds.map(id => resolveCardById(cards, id));
    const drawnInterps = rawCardIds.map(id => getInterpretation(interpretations, id, session.category, session.subtopic));
    const slots = session.slots || modeObj.slots || ['คำตอบฟันธง'];

    // ไพ่ใบสรุปหลัก (กรณี 3 ใบ ใช้ใบสุดท้ายซึ่งเป็นอนาคต/ทางออก หรือใบแรกในกรณี 1 ใบ)
    const headlineIdx = drawnCards.length >= 3 ? drawnCards.length - 1 : 0;
    const primaryCard = drawnCards[headlineIdx];
    const primaryInterp = drawnInterps[headlineIdx];

    // 3. Render Yes/No Verdict Banner
    const verdict = getYesNoVerdict(primaryCard, primaryInterp.status);
    const verdictBadgeEl = document.getElementById('verdict-badge');
    const verdictLabelEl = document.getElementById('verdict-label');
    const verdictAdviceEl = document.getElementById('verdict-advice');
    if (verdictBadgeEl) verdictBadgeEl.textContent = verdict.badge;
    if (verdictLabelEl) verdictLabelEl.textContent = verdict.label;
    if (verdictAdviceEl) verdictAdviceEl.textContent = verdict.advice;

    // 4. Render 3-Card Spread Section if 3 cards were drawn
    const spreadSection = document.getElementById('spread-3cards-section');
    const spreadGrid = document.getElementById('spread-3cards-grid');
    const spreadMeanings = document.getElementById('spread-3cards-meanings');

    if (drawnCards.length > 1 && spreadSection && spreadGrid && spreadMeanings) {
        spreadSection.classList.remove('hidden');
        spreadGrid.innerHTML = '';
        spreadMeanings.innerHTML = '';

        drawnCards.forEach((cData, idx) => {
            const slotLabel = slots[idx] || `ใบที่ ${idx + 1}`;
            const cInterp = drawnInterps[idx];

            // การ์ดย่อในแถว 3 ใบ (คลิกเพื่อดูรายละเอียด)
            const cardBtn = document.createElement('button');
            cardBtn.type = 'button';
            cardBtn.className = `spread-3-item flex flex-col items-center text-center p-2 rounded-xl border transition-all cursor-pointer ${idx === headlineIdx ? 'border-2 border-purple-600 bg-purple-50/80 shadow-xs' : 'border-purple-100 bg-white hover:border-purple-300'}`;
            cardBtn.innerHTML = `
                <span class="text-[9px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full mb-1.5 line-clamp-1">${idx + 1}. ${slotLabel}</span>
                <div class="spread-thumb-art w-full aspect-[2/3] rounded-lg overflow-hidden shadow-xs mb-1.5"></div>
                <p class="text-[11px] font-bold text-[#231230] line-clamp-1">${cData.name_th || cData.thai_name || cData.name}</p>
            `;
            spreadGrid.appendChild(cardBtn);
            paintFront(cardBtn.querySelector('.spread-thumb-art'), cData, getActiveDeckId());

            cardBtn.addEventListener('click', () => {
                playCardTap();
                spreadGrid.querySelectorAll('.spread-3-item').forEach(b => {
                    b.className = 'spread-3-item flex flex-col items-center text-center p-2 rounded-xl border transition-all cursor-pointer border-purple-100 bg-white hover:border-purple-300';
                });
                cardBtn.className = 'spread-3-item flex flex-col items-center text-center p-2 rounded-xl border transition-all cursor-pointer border-2 border-purple-600 bg-purple-50/80 shadow-xs';
                renderCardDetailInspection(cData, cInterp);
            });

            // สรุปคำทำนายรายตำแหน่งให้อ่านเข้าใจง่ายในที่เดียว
            const meaningRow = document.createElement('div');
            meaningRow.className = 'bg-purple-50/60 rounded-xl p-2.5 border border-purple-100 text-left';
            meaningRow.innerHTML = `
                <p class="text-xs font-bold text-purple-900 mb-0.5">${idx + 1}. ${slotLabel} — <span class="text-[#8A5D0B]">${cData.name_th || cData.name}</span></p>
                <p class="text-xs text-[#261633] leading-relaxed">${cInterp.summary}</p>
            `;
            spreadMeanings.appendChild(meaningRow);
        });
    }

    // 5. Render Primary Card Inspection
    renderCardDetailInspection(primaryCard, primaryInterp);

    // 6. Remedy & Support
    const remedy = getRemedy(remedies, session.category, primaryInterp.status);
    const quote = primaryCard.reflection || primaryCard.meaning_upright || 'ทุกก้าวที่เดินด้วยสติ คือจุดเริ่มต้นของโชคชะตาที่ดีกว่า';
    if (remedy) {
        document.getElementById('remedy-title').textContent = `สัญลักษณ์แห่ง${remedy.name_th}`;
        document.getElementById('remedy-desc').textContent = remedy.description;
        document.getElementById('remedy-affirmation').textContent = remedy.affirmation;
        document.getElementById('remedy-meditation').textContent = remedy.meditation;
        document.getElementById('remedy-disclaimer').textContent = remedy.disclaimer;

        const itemsUl = document.getElementById('remedy-items');
        itemsUl.innerHTML = '';
        remedy.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            itemsUl.appendChild(li);
        });
    }

    // 7. Color Recommendation & Shop Lucky Color Button
    const color = getColorRecommendation(colors, session.category, primaryInterp.status);
    if (color) {
        const swatch = document.getElementById('color-swatch');
        swatch.style.backgroundColor = color.hex;
        document.getElementById('color-name').textContent = `สี${color.name_th}`;
        document.getElementById('color-meaning').textContent = color.meaning;

        const shopColorBtn = document.getElementById('btn-shop-lucky-color');
        if (shopColorBtn) {
            shopColorBtn.href = buildAffiliateSearchUrl(`เสื้อสี${color.name_th} มงคล`);
            shopColorBtn.addEventListener('click', () => {
                trackEvent('click_shop_lucky_color', { color_name: color.name_th });
            });
        }
    }

    // 8. Save to Reading History Journal
    const combinedNamesTh = drawnCards.map(c => c.name_th || c.thai_name || c.name).join(' • ');
    const combinedNamesEn = drawnCards.map(c => c.name_en || c.name).join(' / ');
    saveReadingToHistory({
        sessionId: session.sessionId,
        type: 'personal',
        spreadMode: session.spreadMode || 'single',
        category: session.category,
        questionText: questionLabel,
        cardId: primaryCard.id,
        cardIds: rawCardIds,
        cardNameTh: combinedNamesTh,
        cardNameEn: combinedNamesEn,
        summary: primaryInterp.summary
    });

    // 9. Generate Dual 1080x1920 Images: (A) IG Story Summary & (B) Lockscreen Talisman Wallpaper
    const wallpaper = getWallpaper(wallpapers, primaryCard.id, session.category, remedy ? remedy.group_id : null);
    const wpNameText = wallpaper ? `${wallpaper.name_th} · ${combinedNamesTh}` : `วอลเปเปอร์${combinedNamesTh}`;
    const wpNameEl = document.getElementById('wallpaper-name');
    if (wpNameEl) wpNameEl.textContent = wpNameText;

    const luckyColorName = color ? `สี${color.name_th}` : 'สีทองมงคล';
    const luckyColorHex = color ? color.hex : '#D97706';

    // (A) IG Story Summary Image (รองรับทั้ง 3 ใบและ 1 ใบ)
    try {
        const storyUrl = await generateStorySpreadDataUrl({
            cards: drawnCards,
            slots,
            spreadSummaries: drawnInterps.map(it => it.summary),
            spreadTitle: modeObj.title_th,
            questionLabel,
            verdict,
            actionText: primaryInterp.action || verdict.advice,
            luckyColorName,
            luckyColorHex
        });

        const storyPreview = document.getElementById('story-preview-box');
        const storyBtn = document.getElementById('story-download-btn');
        if (storyUrl) {
            if (storyPreview) {
                storyPreview.innerHTML = `<img src="${storyUrl}" alt="สรุปดวง ${combinedNamesTh}" class="w-full h-full object-cover">`;
            }
            if (storyBtn) {
                storyBtn.href = storyUrl;
                storyBtn.download = `money2-story-${primaryCard.id}.png`;
                storyBtn.addEventListener('click', () => {
                    trackEvent('download_story_summary', { spread_mode: session.spreadMode, card_ids: rawCardIds });
                    showToast('บันทึกภาพสรุปดวงสำหรับแชร์ลง IG Story / TikTok แล้ว ✨');
                });
            }
        }
    } catch (storyErr) {
        console.warn('Could not render story summary image:', storyErr);
    }

    // (B) Lockscreen Wallpaper Image
    try {
        const dataUrl = await generateCardWallpaperDataUrl({
            card: primaryCard,
            heading: questionLabel,
            affirmation: (remedy && remedy.affirmation) ? remedy.affirmation : quote,
            luckyColorName,
            luckyColorHex,
            wallpaperTitle: wallpaper ? wallpaper.name_th : 'TAROT TALISMAN'
        });

        const btn = document.getElementById('wallpaper-download-btn');
        const previewBox = document.getElementById('wallpaper-preview-box');
        if (dataUrl) {
            if (previewBox) {
                previewBox.innerHTML = `<img src="${dataUrl}" alt="${wpNameText}" class="w-full h-full object-cover">`;
            }
            if (btn) {
                btn.href = dataUrl;
                btn.download = `money2-wallpaper-${primaryCard.id}.png`;
                btn.addEventListener('click', () => {
                    trackEvent('download_wallpaper', { wallpaper_id: wallpaper?.wallpaper_id || primaryCard.id });
                    showToast('ดาวน์โหลดวอลเปเปอร์หน้าจอล็อกสำเร็จแล้ว ✨');
                });
            }
        }
    } catch (wpErr) {
        console.warn('Could not render dynamic wallpaper:', wpErr);
    }

    trackEvent('view_result', {
        card_id: primaryCard.id,
        card_ids: rawCardIds,
        spread_mode: session.spreadMode,
        category: session.category,
        subtopic: session.subtopic
    });

    // 10. Share result listener
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            trackEvent('share_result', { card_id: primaryCard.id, category: session.category });
            await shareTarotReading({
                title: `🔮 คำทำนายไพ่ทาโรต์: ${combinedNamesTh}`,
                text: `คำถาม: ${questionLabel}\n✦ คำตอบฟันธง: ${verdict.label}\n✨ คำทำนาย: ${primaryInterp.summary}\n🧭 ก้าวต่อไป: ${primaryInterp.action || ''}`,
                url: new URL('reading.html', window.location.href).href
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', initResultPage);

function renderAffiliates(category, affiliates) {
    if (!affiliates || affiliates.length === 0) return;

    const section = document.getElementById('affiliate-section');
    const container = document.getElementById('affiliate-container');
    if (!section || !container) return;

    const matches = affiliates.filter(a => a.category === category || a.category === 'general');
    if (matches.length === 0) return;

    const selected = matches.slice(0, 3);
    container.innerHTML = '';

    selected.forEach(aff => {
        const icon = aff.icon || '✨';
        const badge = aff.badge || 'ไอเทมเสริมดวง';
        const price = aff.price_range || 'ราคาพิเศษ';
        const cta = aff.cta_th || 'ดูรายละเอียดสินค้าบน Shopee';
        const itemHtml = `
            <div class="bg-gradient-to-br from-purple-50/70 via-white to-amber-50/40 p-3.5 rounded-2xl border border-purple-200/90 shadow-xs flex flex-col gap-2 hover:shadow-md hover:border-amber-400 transition-all">
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300/60 flex items-center justify-center text-lg shrink-0">${icon}</span>
                        <div>
                            <span class="inline-block text-[9px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full mb-0.5">${badge}</span>
                            <h4 class="text-xs sm:text-sm font-bold text-[#231230] leading-snug">${aff.title}</h4>
                        </div>
                    </div>
                    <span class="text-[11px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-lg shrink-0">${price}</span>
                </div>
                <p class="text-xs text-[#4A3B55] leading-relaxed">${aff.description}</p>
                <a href="${aff.url}" data-aff-id="${aff.id}" target="_blank" rel="nofollow sponsored noopener" class="affiliate-link mt-0.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs text-center no-underline shadow-xs flex items-center justify-center gap-1.5 transition-all">
                    <span>🛍️ ${cta}</span>
                    <span>→</span>
                </a>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });

    document.querySelectorAll('.affiliate-link').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('click_affiliate', { affiliate_id: e.currentTarget.dataset.affId });
        });
    });

    section.classList.remove('hidden');
}
