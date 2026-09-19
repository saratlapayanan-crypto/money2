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
        btn.addEventListener('click', (e) => {
            // Update active state
            catBtns.forEach(b => {
                b.classList.remove('bg-gold', 'text-mystic');
                b.classList.add('bg-white/10', 'text-white');
            });
            e.target.classList.remove('bg-white/10', 'text-white');
            e.target.classList.add('bg-gold', 'text-mystic');

            const category = e.target.dataset.category;
            populateSubtopics(category);
        });
    });
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

    const grid = document.getElementById('cards-grid');
    grid.innerHTML = ''; // Clear previous if any

    // หลังไพ่ลายเทศกาล: ใช้ data-URI เดียวเป็น background ทั้ง 78 ใบ (DOM เบา)
    const svgStr = renderBack(getActiveDeckId());
    const bgUrl = `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;

    for (let i = 0; i < 78; i++) {
        const cardBack = document.createElement('div');
        cardBack.className = 'mini-card-back';
        cardBack.dataset.position = i;
        cardBack.style.backgroundImage = bgUrl;
        cardBack.style.backgroundSize = 'cover';

        cardBack.addEventListener('click', () => handleCardClick(i));
        grid.appendChild(cardBack);
    }
}

function handleCardClick(position) {
    const session = selectPosition(position);
    if (session.locked) return; // Prevent changing if somehow locked
    
    // Update UI highlights
    const allCards = document.querySelectorAll('.mini-card-back');
    allCards.forEach(c => c.classList.remove('selected'));
    
    const selectedEl = document.querySelector(`.mini-card-back[data-position="${position}"]`);
    if (selectedEl) selectedEl.classList.add('selected');

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
