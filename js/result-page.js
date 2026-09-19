import { loadCards, loadInterpretations, loadRemedies, loadColors, loadWallpapers, loadAffiliates } from './data-loader.js';
import { getInterpretation } from './engines/interpretation-engine.js';
import { getSession } from './engines/personal-engine.js';
import { getRemedy, getColorRecommendation } from './engines/remedy-engine.js';
import { getWallpaper } from './engines/wallpaper-engine.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { paintFront } from './art/tarot-art.js';

async function initResultPage() {
    try {
        await setupGlobalDecks();
        
        const session = getSession();
        if (!session || !session.locked || !session.cardId) {
            // Redirect back to home if user hits this page directly without a session
            window.location.href = 'index.html';
            return;
        }

        // Fetch required data
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

        renderResult(session, cards, interpretations, questionsData, remedies, colors, wallpapers);
        renderAffiliates(session.category, affiliates);

    } catch (e) {
        console.error("Error loading result:", e);
        document.getElementById('question-text').textContent = 'เกิดข้อผิดพลาด';
    }
}

function renderResult(session, cards, interpretations, questionsData, remedies, colors, wallpapers) {
    // 1. Render Question Text
    const catList = questionsData[session.category] || [];
    const qObj = catList.find(q => q.slug === session.subtopic);
    document.getElementById('question-text').textContent = qObj ? qObj.label_th : 'คำถามของคุณ';

    // 2. Render Card Artwork (ระบบศิลป์ SVG ตามธีมสำรับ)
    let cardData = cards.find(c => c.id === session.cardId);
    if (!cardData) {
        const [arcanaSuit, num] = session.cardId.split('-');
        cardData = {
            id: session.cardId,
            number: num,
            name: session.cardId.replace('-', ' ').toUpperCase(),
            thai_name: '(รอโหลดข้อมูลไพ่)',
            arcana: arcanaSuit === 'major' ? 'major' : 'minor',
            suit: arcanaSuit === 'major' ? null : arcanaSuit
        };
    }
    if (cardData.arcana === 'minor' && cardData.number) {
        cardData.number = Number(cardData.number);
    }

    const cardContainer = document.getElementById('card-display');
    paintFront(cardContainer, cardData, getActiveDeckId());
    cardContainer.classList.add('has-svg-art');

    // 3. Render Interpretation Contextually
    const interp = getInterpretation(interpretations, session.cardId, session.category, session.subtopic);
    
    document.getElementById('interp-summary').textContent = interp.summary;
    document.getElementById('interp-action').textContent = interp.action;
    
    if (interp.warning) {
        const wCont = document.getElementById('warning-container');
        wCont.classList.remove('hidden');
        document.getElementById('interp-warning').textContent = interp.warning;
    }

    // 4. Remedy & Support (Phase 8)
    const remedy = getRemedy(remedies, session.category, interp.status);
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

    // 5. Color Recommendation (Phase 8)
    const color = getColorRecommendation(colors, session.category, interp.status);
    if (color) {
        const swatch = document.getElementById('color-swatch');
        swatch.style.backgroundColor = color.hex;
        document.getElementById('color-name').textContent = `สี${color.name_th}`;
        document.getElementById('color-meaning').textContent = color.meaning;
    }

    // 6. Wallpaper Mapping (Phase 8)
    const wallpaper = getWallpaper(wallpapers, session.cardId, session.category, remedy ? remedy.group_id : null);
    if (wallpaper) {
        document.getElementById('wallpaper-name').textContent = wallpaper.name_th;
        const btn = document.getElementById('wallpaper-download-btn');
        btn.href = wallpaper.image_url;
        btn.addEventListener('click', () => {
            trackEvent('download_wallpaper', { wallpaper_id: wallpaper.wallpaper_id });
        });
        // In real app, we set preview image. Since we don't have assets, it remains a CSS placeholder
    }
    
    // Analytics
    trackEvent('view_result', { card_id: session.cardId, category: session.category, subtopic: session.subtopic });

    // Share result listener
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            trackEvent('share_result', { card_id: session.cardId, category: session.category });
        });
    }
}

document.addEventListener('DOMContentLoaded', initResultPage);


function renderAffiliates(category, affiliates) {
    if (!affiliates || affiliates.length === 0) return;

    const section = document.getElementById("affiliate-section");
    const container = document.getElementById("affiliate-container");
    
    // Filter matching category or general
    const matches = affiliates.filter(a => a.category === category || a.category === "general");
    if (matches.length === 0) return;
    
    // Take up to 2 items
    const selected = matches.slice(0, 2);
    
    selected.forEach(aff => {
        const itemHtml = `
            <div class="bg-white/10 p-4 rounded border border-white/20 flex flex-col gap-2 hover:bg-white/20 transition-colors">
                <h4 class="text-sm font-bold text-white">${aff.title}</h4>
                <p class="text-xs text-gray-300">${aff.description}</p>
                <a href="${aff.url}" data-aff-id="${aff.id}" target="_blank" rel="nofollow sponsored noopener" class="affiliate-link text-xs text-gold underline mt-1 block">ดูรายละเอียดเพิ่มเติม</a>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", itemHtml);
    });
    
    document.querySelectorAll('.affiliate-link').forEach(link => {
        link.addEventListener('click', (e) => {
            trackEvent('click_affiliate', { affiliate_id: e.currentTarget.dataset.affId });
        });
    });

    section.classList.remove("hidden");
}
