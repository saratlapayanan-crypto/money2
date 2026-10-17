import { setupGlobalDecks } from './engines/deck-engine.js';
import { loadCards } from './data-loader.js';
import { getStoredDailyRecord } from './engines/daily-engine.js';
import { APPROVED_CARD_ASSETS } from './art/fronts.js';
import { toRoman } from './art/helpers.js';
import { getReadingHistory, clearReadingHistory, showToast } from './utils/share-and-history.js';

const THAI_MONTHS = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const DEFAULT_DAILY_QUOTES = [
    {
        title: "วันนี้แสงสว่างกำลังนำทางคุณ<br>โอกาสใหม่กำลังเข้ามา<br>จงเปิดใจรับสิ่งดี ๆ",
        cardId: "major-1",
        cardName: "I · THE MAGICIAN"
    },
    {
        title: "สัญชาตญาณของคุณเฉียบคม<br>ฟังเสียงกระซิบจากหัวใจ<br>คำตอบซ่อนอยู่ในความสงบ",
        cardId: "major-2",
        cardName: "II · HIGH PRIESTESS"
    },
    {
        title: "ความอุดมสมบูรณ์และความรัก<br>กำลังเบ่งบานรอบตัวคุณ<br>ดูแลและให้เกียรติใจตนเอง",
        cardId: "major-3",
        cardName: "III · THE EMPRESS"
    },
    {
        title: "การเริ่มต้นใหม่อย่างกล้าหาญ<br>ทุกก้าวที่ก้าวไปด้วยใจบริสุทธิ์<br>คือพลังสร้างสรรค์อันยิ่งใหญ่",
        cardId: "major-0",
        cardName: "0 · THE FOOL"
    }
];

let allCardsCache = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Global Decks
    try {
        await setupGlobalDecks();
    } catch (e) {
        console.warn("Global decks setup warning:", e);
    }

    // 2. Preload Cards Data
    try {
        allCardsCache = await loadCards();
    } catch (e) {
        console.warn("Could not preload cards:", e);
    }

    // 3. Set Current Thai Date
    updateThaiDate();

    // 4. Populate Expanded Homepage 78-Card Showcase Gallery
    populateHomeGallery();

    // 5. Carousel Logic for Hero (synced with today's drawn card if available)
    setupCarousel();

    // 6. Setup Modals, Search & Profile Journal
    setupModals();
    setupSearchInput();
});

function updateThaiDate() {
    const dateEl = document.getElementById('hero-daily-date');
    if (!dateEl) return;

    const now = new Date();
    const day = now.getDate();
    const month = THAI_MONTHS[now.getMonth()];
    const year = now.getFullYear() + 543;
    dateEl.textContent = `${day} ${month} ${year}`;
}

function formatCardBadgeLabel(card) {
    if (!card) return 'TAROT MASTERPIECE';
    if (card.arcana === 'major') {
        const rom = card.number === 0 ? '0' : toRoman(card.number);
        return `${rom} · ${(card.name_en || card.name || '').toUpperCase()}`;
    }
    return (card.name_en || card.name || '').toUpperCase();
}

function populateHomeGallery() {
    const gallery = document.getElementById('home-cards-gallery');
    if (!gallery || !allCardsCache.length) return;

    // Show all 22 Major Arcana + 4 Suit Aces (26 iconic cards) in the horizontal scroll
    const featuredIds = [
        ...Array.from({ length: 22 }, (_, i) => `major-${i}`),
        'wands-1', 'cups-1', 'swords-1', 'pentacles-1'
    ];

    const itemsHtml = featuredIds.map(id => {
        const card = allCardsCache.find(c => c.id === id);
        if (!card) return '';
        const imgSrc = APPROVED_CARD_ASSETS[card.id] || `assets/cards/standard/${card.id}.jpg`;
        const shortLabel = card.arcana === 'major'
            ? `${card.number === 0 ? '0' : toRoman(card.number)} ${(card.name_en || card.name).replace(/^The\s+/i, '').toUpperCase()}`
            : (card.name_en || card.name).toUpperCase();
        return `
            <a href="cards-preview.html#card-${card.id}" class="gallery-card-item" title="${card.name_th} (${card.name_en})">
                <div class="gallery-card-img-wrap">
                    <img src="${imgSrc}" alt="${card.name_th} (${card.name_en})" loading="lazy">
                </div>
                <span class="text-[10px] font-semibold text-[#4A3B5C] mt-1.5 text-center truncate w-full">${shortLabel}</span>
            </a>
        `;
    }).join('');

    if (itemsHtml) {
        gallery.innerHTML = itemsHtml;
    }
}

function setupCarousel() {
    const quoteEl = document.getElementById('hero-quote-text');
    const cardImgEl = document.getElementById('hero-card-img');
    const cardBadgeEl = document.getElementById('hero-card-badge');
    const headingEl = document.getElementById('hero-daily-heading');
    const ctaTextEl = document.getElementById('hero-daily-cta-text');
    const dots = document.querySelectorAll('#hero-carousel-dots .carousel-dot');
    if (!dots.length || !quoteEl) return;

    const slides = [...DEFAULT_DAILY_QUOTES];
    const dailyRecord = getStoredDailyRecord();

    if (dailyRecord && dailyRecord.cardId) {
        const drawnCard = allCardsCache.find(c => c.id === dailyRecord.cardId);
        if (drawnCard) {
            slides[0] = {
                title: `<span class="font-semibold text-purple-800">ไพ่วันนี้ของคุณ: ${drawnCard.name_th}</span><br>“${drawnCard.reflection || drawnCard.meaning_upright}”`,
                cardId: drawnCard.id,
                cardName: formatCardBadgeLabel(drawnCard)
            };
            if (headingEl) headingEl.textContent = 'ไพ่ประจำวัน (เปิดแล้ว)';
            if (ctaTextEl) ctaTextEl.textContent = 'ดูคำทำนายวันนี้ของคุณ';
        }
    }

    let currentIndex = 0;
    let timer = null;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        const q = slides[currentIndex];
        quoteEl.innerHTML = q.title;

        if (cardImgEl && q.cardId) {
            const src = APPROVED_CARD_ASSETS[q.cardId] || `assets/cards/standard/${q.cardId}.jpg`;
            cardImgEl.src = src;
            cardImgEl.alt = `Featured Tarot Card - ${q.cardName}`;
        }
        if (cardBadgeEl && q.cardName) {
            cardBadgeEl.textContent = q.cardName;
        }

        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetTimer();
        });
    });

    function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5500);
    }

    showSlide(0);
    resetTimer();
}

function updateProfileModalContent() {
    const dailyStatusEl = document.getElementById('profile-daily-status');
    const historyListEl = document.getElementById('profile-history-list');
    const clearBtn = document.getElementById('btn-clear-history');

    // 1. Update Daily Tarot status
    const dailyRecord = getStoredDailyRecord();
    if (dailyStatusEl) {
        if (dailyRecord && dailyRecord.cardId) {
            const card = allCardsCache.find(c => c.id === dailyRecord.cardId);
            const cardTitle = card ? card.name_th : dailyRecord.cardId;
            dailyStatusEl.textContent = `เปิดแล้ว (${cardTitle}) ›`;
            dailyStatusEl.className = 'text-emerald-600 font-bold';
        } else {
            dailyStatusEl.textContent = 'ยังไม่ได้เปิดวันนี้ · เปิดเลย ›';
            dailyStatusEl.className = 'text-amber-600 font-bold';
        }
    }

    // 2. Render Reading History Journal
    if (!historyListEl) return;
    const history = getReadingHistory();

    if (clearBtn) {
        clearBtn.classList.toggle('hidden', history.length === 0);
        clearBtn.onclick = () => {
            clearReadingHistory();
            updateProfileModalContent();
            showToast('ล้างสมุดบันทึกประวัติเรียบร้อยแล้ว ✨');
        };
    }

    if (history.length === 0) {
        historyListEl.innerHTML = `
            <div class="text-[11px] text-gray-400 text-center py-3 bg-purple-50/40 rounded-xl border border-purple-100/60">
                ยังไม่มีประวัติการเปิดไพ่ ลองเปิดไพ่ประจำวันหรือไพ่ส่วนตัวดูสิ ✨
            </div>
        `;
        return;
    }

    historyListEl.innerHTML = history.map(item => {
        const card = allCardsCache.find(c => c.id === item.cardId);
        const cardTh = item.cardNameTh || card?.name_th || item.cardId;
        const cardEn = item.cardNameEn || card?.name_en || '';
        const imgSrc = APPROVED_CARD_ASSETS[item.cardId] || `assets/cards/standard/${item.cardId}.jpg`;
        const targetLink = item.type === 'daily'
            ? 'daily.html'
            : `cards-preview.html#card-${item.cardId}`;

        return `
            <a href="${targetLink}" class="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-purple-50/80 border border-purple-100 transition-colors no-underline">
                <img src="${imgSrc}" alt="${cardTh}" class="w-9 h-14 object-cover rounded-md border border-amber-300/70 shrink-0">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-[10px] font-bold text-purple-700 truncate">${item.categoryLabel || '🔮 ไพ่ทาโรต์'}</span>
                        <span class="text-[9px] text-gray-400 shrink-0">${item.displayDate || item.date || ''}</span>
                    </div>
                    <div class="text-xs font-bold text-[#231230] truncate">${cardTh} <span class="text-[10px] font-normal text-[#7A6A8D]">(${cardEn})</span></div>
                    <div class="text-[10px] text-[#5C4A6F] truncate">${item.questionText || item.summary || ''}</div>
                </div>
            </a>
        `;
    }).join('');
}

function setupModals() {
    const searchModal = document.getElementById('search-modal');
    const notifModal = document.getElementById('notification-modal');
    const profileModal = document.getElementById('profile-modal');

    const btnSearch = document.getElementById('btn-search');
    const btnNotif = document.getElementById('btn-notification');
    const btnProfile = document.getElementById('btn-profile-nav');

    function openModal(modal) {
        if (!modal) return;
        if (modal === profileModal) {
            updateProfileModalContent();
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (window.location.hash === '#profile') {
            history.replaceState(null, '', window.location.pathname);
        }
    }

    if (btnSearch) btnSearch.addEventListener('click', () => openModal(searchModal));
    if (btnNotif) btnNotif.addEventListener('click', () => openModal(notifModal));
    if (btnProfile) btnProfile.addEventListener('click', () => openModal(profileModal));

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const overlay = e.target.closest('.app-modal-overlay');
            closeModal(overlay);
        });
    });

    // Close on overlay backdrop click
    document.querySelectorAll('.app-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.app-modal-overlay.open').forEach(m => closeModal(m));
        }
    });

    // Open profile modal automatically if navigated with #profile
    if (window.location.hash === '#profile') {
        openModal(profileModal);
    }
}

function setupSearchInput() {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            resultsContainer.innerHTML = '<div class="p-2 text-gray-400 text-center">พิมพ์เพื่อค้นหาไพ่ทั้ง 78 ใบ หรือหมวดการงาน การเงิน ความรัก</div>';
            return;
        }

        // Search in cards and categories
        const matchedCards = allCardsCache.filter(c => {
            const en = (c.name_en || c.name || '').toLowerCase();
            const th = (c.name_th || c.thai_name || '').toLowerCase();
            const meaning = (c.meaning_upright || '').toLowerCase();
            return en.includes(query) || th.includes(query) || meaning.includes(query);
        }).slice(0, 10);

        let html = '';

        // Category direct shortcuts
        if ('การงาน'.includes(query) || 'work'.includes(query) || 'งาน'.includes(query)) {
            html += `
                <a href="reading.html?category=work" class="block p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4A3B5C] font-medium transition-colors">
                    💼 ดูดวงด้านการงาน (เส้นทางอาชีพ และความก้าวหน้า) →
                </a>
            `;
        }
        if ('การเงิน'.includes(query) || 'finance'.includes(query) || 'เงิน'.includes(query) || 'โชค'.includes(query)) {
            html += `
                <a href="reading.html?category=finance" class="block p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8A5D0B] font-medium transition-colors">
                    🪙 ดูดวงด้านการเงิน (รายได้ โอกาส และความมั่งคั่ง) →
                </a>
            `;
        }
        if ('ความรัก'.includes(query) || 'love'.includes(query) || 'รัก'.includes(query) || 'แฟน'.includes(query)) {
            html += `
                <a href="reading.html?category=love" class="block p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium transition-colors">
                    💖 ดูดวงด้านความรัก (คนโสด คนมีคู่ ความสัมพันธ์) →
                </a>
            `;
        }
        if ('ใจ'.includes(query) || 'จิต'.includes(query) || 'mind'.includes(query) || 'สุขภาพ'.includes(query)) {
            html += `
                <a href="daily.html" class="block p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors">
                    🌿 ใจของเรา & ไพ่ประจำวัน (สุขภาพจิต และพลังบวก) →
                </a>
            `;
        }

        matchedCards.forEach(c => {
            const cardTitle = `${c.number !== null ? c.number + ' · ' : ''}${c.name_en || c.name} (${c.name_th || c.thai_name})`;
            html += `
                <a href="cards-preview.html#card-${c.id}" class="flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 text-[#3B2550] border border-transparent hover:border-purple-100 transition-colors">
                    <span class="font-medium">${cardTitle}</span>
                    <span class="text-purple-600 font-bold">ชมไพ่ ›</span>
                </a>
            `;
        });

        if (!html) {
            html = '<div class="p-3 text-gray-400 text-center">ไม่พบไพ่ที่ตรงกับคำค้นหา ลองค้นหาด้วยชื่อภาษาอังกฤษหรือภาษาไทย</div>';
        }

        resultsContainer.innerHTML = html;
    });
}
