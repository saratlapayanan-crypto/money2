import { createReadingSession, selectPosition, confirmSelection, getSession, SPREAD_MODES } from './engines/personal-engine.js';
import { loadCards } from './data-loader.js';
import { trackEvent } from './analytics.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { paintFront, paintBack, renderBack } from './art/tarot-art.js';
import { initSoundAndPwa, playCardTap, playCrystalChime, playCardFlip } from './utils/sound-effects.js';

let questionsData = {};
let mockCardsData = [];
let selectedSpreadMode = 'single';

// --- Initialization ---
async function init() {
    initSoundAndPwa();
    try {
        try {
            await setupGlobalDecks();
        } catch (deckErr) {
            console.warn('Deck setup failed (non-critical):', deckErr);
        }

        const qRes = await fetch('./data/questions.json');
        questionsData = await qRes.json();
        mockCardsData = await loadCards();

        setupCategoryListeners();
        setupSpreadModeListeners();
        setupConfirmListener();
    } catch (e) {
        console.error('Initialization error', e);
        try { setupCategoryListeners(); } catch (_) {}
        try { setupSpreadModeListeners(); } catch (_) {}
        try { setupConfirmListener(); } catch (_) {}
    }
}

// --- Step 1: Form Selection ---
function setupCategoryListeners() {
    const catBtns = document.querySelectorAll('.cat-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playCardTap();
            catBtns.forEach(b => b.classList.remove('bg-gold'));
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

function setupSpreadModeListeners() {
    const spreadBtns = document.querySelectorAll('.spread-mode-btn');
    spreadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playCardTap();
            selectedSpreadMode = btn.dataset.spread || 'single';
            spreadBtns.forEach(b => {
                const isSelected = b === btn;
                b.className = isSelected
                    ? 'spread-mode-btn flex items-center justify-between p-3 rounded-xl border-2 border-purple-600 bg-purple-50/90 text-left transition-all cursor-pointer'
                    : 'spread-mode-btn flex items-center justify-between p-3 rounded-xl border border-purple-200 bg-white/90 hover:border-purple-400 text-left transition-all cursor-pointer';
                const check = b.querySelector('.spread-check');
                if (check) {
                    check.textContent = isSelected ? '●' : '○';
                    check.className = isSelected
                        ? 'spread-check text-purple-700 font-bold text-sm'
                        : 'spread-check text-purple-300 font-bold text-sm';
                }
            });
        });
    });
}

function populateSubtopics(category) {
    const container = document.getElementById('subtopic-container');
    const spreadContainer = document.getElementById('spread-mode-container');
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

    startBtn.onclick = () => startMeditation(category, select.value, selectedSpreadMode);

    container.classList.remove('hidden');
    if (spreadContainer) spreadContainer.classList.remove('hidden');
    startBtn.classList.remove('hidden');
}

// --- Step 2: Meditation ---
function startMeditation(category, subtopic, spreadMode = 'single') {
    playCrystalChime();
    document.getElementById('step-1-form').classList.add('hidden');
    document.getElementById('step-2-meditation').classList.remove('hidden');

    createReadingSession(category, subtopic, spreadMode);
    trackEvent('start_personal_reading', { category, subtopic, spread_mode: spreadMode });

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

    const session = getSession();
    const requiredCount = session?.cardCount || 1;
    const slots = session?.slots || ['คำตอบฟันธง'];

    const headingEl = document.getElementById('step-3-heading');
    const subtitleEl = document.getElementById('step-3-subtitle');
    if (headingEl) {
        headingEl.textContent = requiredCount === 1
            ? 'ใช้สัญชาตญาณเลือกไพ่ 1 ใบ'
            : `ใช้สัญชาตญาณเลือกไพ่ ${requiredCount} ใบตามลำดับ`;
    }
    if (subtitleEl) {
        subtitleEl.textContent = requiredCount === 1
            ? 'เลื่อนซ้าย-ขวา แล้วแตะใบที่คุณรู้สึกถึงพลังดึงดูดมากที่สุด'
            : `แตะเลือกไพ่ทีละใบให้ครบ ${requiredCount} ตำแหน่ง (${slots.join(' • ')})`;
    }

    renderSpreadSlotTracker(session);

    const ribbon = document.getElementById('cards-spread-ribbon');
    const grid = document.getElementById('cards-grid');
    if (ribbon) ribbon.innerHTML = '';
    if (grid) grid.innerHTML = '';

    const svgStr = renderBack(getActiveDeckId());
    const bgUrl = `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;

    for (let i = 0; i < 78; i++) {
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

function renderSpreadSlotTracker(session) {
    const tracker = document.getElementById('spread-slots-tracker');
    if (!tracker) return;
    const count = session?.cardCount || 1;
    if (count <= 1) {
        tracker.classList.add('hidden');
        return;
    }

    tracker.classList.remove('hidden');
    const slots = session?.slots || ['ใบที่ 1', 'ใบที่ 2', 'ใบที่ 3'];
    const selectedPositions = session?.selectedPositions || [];

    tracker.innerHTML = slots.map((label, idx) => {
        const pos = selectedPositions[idx];
        const picked = pos !== undefined && pos !== null;
        return `
            <div class="rounded-xl px-2.5 py-2 border text-center transition-all ${picked ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs' : 'bg-white/75 border-purple-200/80 text-[#7A6B85]'}">
                <p class="text-[10px] font-bold">${idx + 1}. ${label}</p>
                <p class="text-[11px] font-semibold mt-0.5">${picked ? `ใบที่ ${pos + 1} ✓` : 'รอเลือก...'}</p>
            </div>
        `;
    }).join('');
}

let isGridView = false;
function setupViewToggle() {
    const toggleBtn = document.getElementById('btn-toggle-view');
    const spreadContainer = document.getElementById('cards-spread-container');
    const grid = document.getElementById('cards-grid');
    if (!toggleBtn || !spreadContainer || !grid) return;

    toggleBtn.onclick = () => {
        playCardTap();
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
    if (session.locked) return;
    playCardTap();

    const selectedPositions = session.selectedPositions || [];
    const requiredCount = session.cardCount || 1;

    const allSpreadCards = document.querySelectorAll('.spread-card-item');
    allSpreadCards.forEach(c => {
        const pos = Number(c.dataset.position);
        c.classList.toggle('selected', selectedPositions.includes(pos));
    });

    const allGridCards = document.querySelectorAll('.mini-card-back');
    allGridCards.forEach(c => {
        const pos = Number(c.dataset.position);
        c.classList.toggle('selected', selectedPositions.includes(pos));
    });

    const selectedSpread = document.querySelector(`.spread-card-item[data-position="${position}"]`);
    if (selectedSpread && selectedPositions.includes(position)) {
        try {
            selectedSpread.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (_) {}
    }

    renderSpreadSlotTracker(session);

    const statusEl = document.getElementById('selected-card-status');
    const confirmContainer = document.getElementById('confirm-container');
    const confirmLabel = document.getElementById('btn-confirm-card-label');
    const confirmBtn = document.getElementById('btn-confirm-card');

    if (selectedPositions.length === 0) {
        confirmContainer.classList.add('hidden');
        return;
    }

    confirmContainer.classList.remove('hidden');
    if (requiredCount === 1) {
        if (statusEl) statusEl.textContent = `คุณเลือกไพ่ใบที่ ${selectedPositions[0] + 1} เรียบร้อยแล้ว ✨`;
        if (confirmLabel) confirmLabel.textContent = 'ยืนยันการเลือกไพ่ใบนี้';
        if (confirmBtn) confirmBtn.disabled = false;
    } else {
        const pickedList = selectedPositions.map(p => `#${p + 1}`).join(', ');
        if (selectedPositions.length < requiredCount) {
            if (statusEl) {
                statusEl.textContent = `เลือกแล้ว ${selectedPositions.length}/${requiredCount} ใบ (${pickedList}) — เลือกเพิ่มอีก ${requiredCount - selectedPositions.length} ใบ`;
            }
            if (confirmLabel) confirmLabel.textContent = `กรุณาเลือกให้ครบ ${requiredCount} ใบ (${selectedPositions.length}/${requiredCount})`;
            if (confirmBtn) confirmBtn.disabled = true;
        } else {
            if (statusEl) {
                statusEl.textContent = `เลือกครบทั้ง ${requiredCount} ใบแล้ว (${pickedList}) ✨`;
            }
            if (confirmLabel) confirmLabel.textContent = `ยืนยันเปิดไพ่ทั้ง ${requiredCount} ใบ`;
            if (confirmBtn) confirmBtn.disabled = false;
        }
    }
}

// --- Step 4: Confirm and Flip ---
function setupConfirmListener() {
    document.getElementById('btn-confirm-card').addEventListener('click', () => {
        try {
            const session = confirmSelection();
            playCardFlip();
            trackEvent('complete_personal_reading', {
                card_id: session.cardId,
                card_ids: session.cardIds,
                spread_mode: session.spreadMode,
                category: session.category
            });
            revealSessionCards(session);
        } catch (e) {
            alert(e.message);
        }
    });
}

function getCardObjectById(cardId) {
    let cardData = mockCardsData.find(c => c.id === cardId);
    if (!cardData) {
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
    return cardData;
}

function revealSessionCards(session) {
    document.getElementById('step-3-selection').classList.add('hidden');
    document.getElementById('step-4-reveal').classList.remove('hidden');

    const flipContainer = document.getElementById('flip-container');
    const multiContainer = document.getElementById('multi-reveal-container');
    const revealHeading = document.getElementById('reveal-heading');
    const deckId = getActiveDeckId();
    const cardIds = Array.isArray(session.cardIds) && session.cardIds.length > 0 ? session.cardIds : [session.cardId];
    const slots = session.slots || ['คำตอบฟันธง'];

    if (cardIds.length > 1 && multiContainer) {
        if (flipContainer) flipContainer.classList.add('hidden');
        multiContainer.classList.remove('hidden');
        if (revealHeading) revealHeading.textContent = `ไพ่ทั้ง ${cardIds.length} ใบของคุณปรากฏแล้ว...`;

        multiContainer.innerHTML = '';
        cardIds.forEach((cId, idx) => {
            const cardData = getCardObjectById(cId);
            const slotLabel = slots[idx] || `ใบที่ ${idx + 1}`;
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col items-center text-center bg-white/85 rounded-2xl p-2 border border-purple-200/80 shadow-sm';
            wrapper.innerHTML = `
                <span class="text-[10px] font-bold text-purple-800 bg-purple-100/90 px-2 py-0.5 rounded-full mb-1.5">${idx + 1}. ${slotLabel}</span>
                <div class="multi-card-art w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-1.5"></div>
                <p class="text-[11px] font-bold text-[#231230] line-clamp-1">${cardData.name_th || cardData.thai_name || cardData.name}</p>
                <p class="text-[9px] text-[#7A6B85] uppercase line-clamp-1">${cardData.name_en || cardData.name}</p>
            `;
            multiContainer.appendChild(wrapper);
            const artEl = wrapper.querySelector('.multi-card-art');
            paintFront(artEl, cardData, deckId);
        });
        return;
    }

    // กรณี 1 ใบมาตรฐาน
    if (multiContainer) multiContainer.classList.add('hidden');
    if (flipContainer) flipContainer.classList.remove('hidden');

    const frontEl = document.getElementById('revealed-card-front');
    const cardData = getCardObjectById(session.cardId);

    const backEl = flipContainer?.querySelector('.card-placeholder-back');
    paintBack(backEl, deckId);
    paintFront(frontEl, cardData, deckId);
    frontEl.classList.add('has-svg-art');

    setTimeout(() => {
        flipContainer.classList.add('flipped');
    }, 100);
}

document.addEventListener('DOMContentLoaded', init);
