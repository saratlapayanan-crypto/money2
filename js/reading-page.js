import { createReadingSession, selectPosition, confirmSelection, getSession } from './engines/personal-engine.js';
import { loadCards } from './data-loader.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { paintFront, paintBack, renderBack } from './art/tarot-art.js';

let questionsData = {};
let mockCardsData = []; // Phase 1 mock cards loaded here

// --- Initialization ---
async function init() {
    try {
        // Deck setup is optional - don't block if it fails
        try {
            await setupGlobalDecks();
        } catch (deckErr) {
            console.warn("Deck setup failed (non-critical):", deckErr);
        }

        // Load questions & cards
        const qRes = await fetch('./data/questions.json');
        questionsData = await qRes.json();
        mockCardsData = await loadCards();

        setupCategoryListeners();
        setupConfirmListener();
    } catch (e) {
        console.error("Initialization error", e);
        try { setupCategoryListeners(); } catch(_) {}
        try { setupConfirmListener(); } catch(_) {}
    }
}

// --- Step 1: Form Selection ---
function setupCategoryListeners() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            catBtns.forEach(b => {
                b.classList.remove('bg-gold');
            });
            btn.classList.add('bg-gold');

            const category = btn.dataset.category;
            populateSubtopics(category);
        });
    });

    // Auto-select category if passed in URL query param (?category=work|finance|love)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('category');
        if (catParam) {
            const matchingBtn = document.querySelector(`.cat-btn[data-category="${catParam}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            }
        }
    } catch (_) {}
}

function populateSubtopics(category) {
    const container = document.getElementById('subtopic-container');
    const select = document.getElementById('subtopic-select');
    const startBtn = document.getElementById('btn-start-meditation');

    select.innerHTML = '';
    const topics = questionsData[category] || [];
    
    topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.slug;
        opt.textContent = t.label_th;
        opt.className = 'text-black';
        select.appendChild(opt);
    });

    // Save choice on start
    startBtn.onclick = () => startMeditation(category, select.value);

    container.classList.remove('hidden');
    startBtn.classList.remove('hidden');
}

// --- Step 2: Meditation ---
function startMeditation(category, subtopic) {
    document.getElementById('step-1-form').classList.add('hidden');
    document.getElementById('step-2-meditation').classList.remove('hidden');
    
    // Create the secure backend session mapping immediately
    createReadingSession(category, subtopic);
    
    // Analytics
    trackEvent('start_personal_reading', { category, subtopic });

    let count = 5;
    const countdownEl = document.getElementById('countdown');
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(interval);
            showCardSelection();
        }
    }, 1000);
}

// --- Step 3: Card Selection ---
function showCardSelection() {
    document.getElementById('step-2-meditation').classList.add('hidden');
    document.getElementById('step-3-selection').classList.remove('hidden');

    const ribbon = document.getElementById('cards-spread-ribbon');
    const grid = document.getElementById('cards-grid');
    if (ribbon) ribbon.innerHTML = '';
    if (grid) grid.innerHTML = '';

    // หลังไพ่ลายเทศกาล: ใช้ data-URI เดียวเป็น background ทั้ง 78 ใบ (DOM เบา)
    const svgStr = renderBack(getActiveDeckId());
    const bgUrl = `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;

    for (let i = 0; i < 78; i++) {
        // 1. ไพ่ในแถวคลี่ริบบิ้น (Spread Ribbon)
        if (ribbon) {
            const spreadCard = document.createElement('div');
            spreadCard.className = 'spread-card-item';
            spreadCard.dataset.position = i;
            spreadCard.style.backgroundImage = bgUrl;
            spreadCard.style.zIndex = i + 1;
            spreadCard.title = `ไพ่ใบที่ ${i + 1}`;
            spreadCard.addEventListener('click', () => handleCardClick(i));
            ribbon.appendChild(spreadCard);
        }

        // 2. ไพ่ในตาราง (Grid)
        if (grid) {
            const cardBack = document.createElement('div');
            cardBack.className = 'mini-card-back';
            cardBack.dataset.position = i;
            cardBack.style.backgroundImage = bgUrl;
            cardBack.style.backgroundSize = 'cover';
            cardBack.title = `ไพ่ใบที่ ${i + 1}`;
            cardBack.addEventListener('click', () => handleCardClick(i));
            grid.appendChild(cardBack);
        }
    }

    setupViewToggle();
}

let isGridView = false;
function setupViewToggle() {
    const toggleBtn = document.getElementById('btn-toggle-view');
    const spreadContainer = document.getElementById('cards-spread-container');
    const grid = document.getElementById('cards-grid');
    if (!toggleBtn || !spreadContainer || !grid) return;

    toggleBtn.onclick = () => {
        isGridView = !isGridView;
        if (isGridView) {
            spreadContainer.classList.add('hidden');
            grid.classList.remove('hidden');
            toggleBtn.innerHTML = '<span>🎴 สลับเป็นแบบคลี่ไพ่</span>';
        } else {
            spreadContainer.classList.remove('hidden');
            grid.classList.add('hidden');
            toggleBtn.innerHTML = '<span>⊞ สลับเป็นมุมมองตาราง</span>';
        }
    };
}

function handleCardClick(position) {
    const session = selectPosition(position);
    if (session.locked) return; // Prevent changing if somehow locked
    
    // Update UI highlights across both ribbon and grid
    const allSpreadCards = document.querySelectorAll('.spread-card-item');
    allSpreadCards.forEach(c => c.classList.remove('selected'));

    const allGridCards = document.querySelectorAll('.mini-card-back');
    allGridCards.forEach(c => c.classList.remove('selected'));
    
    const selectedSpread = document.querySelector(`.spread-card-item[data-position="${position}"]`);
    if (selectedSpread) {
        selectedSpread.classList.add('selected');
        try {
            selectedSpread.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (_) {}
    }

    const selectedGrid = document.querySelector(`.mini-card-back[data-position="${position}"]`);
    if (selectedGrid) selectedGrid.classList.add('selected');

    // Update status badge
    const statusEl = document.getElementById('selected-card-status');
    if (statusEl) {
        statusEl.textContent = `คุณเลือกไพ่ใบที่ ${position + 1} เรียบร้อยแล้ว ✨`;
    }

    document.getElementById('confirm-container').classList.remove('hidden');
}

// --- Step 4: Confirm and Flip ---
function setupConfirmListener() {
    document.getElementById('btn-confirm-card').addEventListener('click', () => {
        try {
            const session = confirmSelection();
            trackEvent('complete_personal_reading', { card_id: session.cardId, category: session.category });
            revealCard(session.cardId);
        } catch (e) {
            alert(e.message);
        }
    });
}

function revealCard(cardId) {
    document.getElementById('step-3-selection').classList.add('hidden');
    document.getElementById('step-4-reveal').classList.remove('hidden');

    const flipContainer = document.getElementById('flip-container');
    const frontEl = document.getElementById('revealed-card-front');
    const deckId = getActiveDeckId();

    // Try to find the real card data from our mock JSON, otherwise use a placeholder fallback
    let cardData = mockCardsData.find(c => c.id === cardId);
    if (!cardData) {
        // Fallback for missing 78 cards in Phase 1 mock
        const [arcanaSuit, num] = cardId.split('-');
        cardData = {
            id: cardId,
            number: num,
            name: cardId.replace('-', ' ').toUpperCase(),
            thai_name: '(ข้อมูลยังไม่โหลด)',
            arcana: arcanaSuit === 'major' ? 'major' : 'minor',
            suit: arcanaSuit === 'major' ? null : arcanaSuit
        };
    }
    if (cardData.arcana === 'minor' && cardData.number) {
        cardData.number = Number(cardData.number);
    }

    // วาดหลังไพ่/หน้าไพ่ด้วยระบบศิลป์ SVG
    const backEl = flipContainer?.querySelector('.card-placeholder-back');
    paintBack(backEl, deckId);
    paintFront(frontEl, cardData, deckId);
    frontEl.classList.add('has-svg-art');

    // Trigger Flip Animation slightly after render for smooth transition
    setTimeout(() => {
        flipContainer.classList.add('flipped');
    }, 100);
}

document.addEventListener('DOMContentLoaded', init);
