import { setupGlobalDecks } from './engines/deck-engine.js';
import { loadCards } from './data-loader.js';

const THAI_MONTHS = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const DAILY_QUOTES = [
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

    // 2. Set Current Thai Date
    updateThaiDate();

    // 3. Carousel Logic for Hero
    setupCarousel();

    // 4. Setup Modals & Search
    setupModals();
    loadCardsForSearch();
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

function setupCarousel() {
    const quoteEl = document.getElementById('hero-quote-text');
    const dots = document.querySelectorAll('#hero-carousel-dots .carousel-dot');
    if (!dots.length || !quoteEl) return;

    let currentIndex = 0;
    let timer = null;

    function showSlide(index) {
        currentIndex = (index + DAILY_QUOTES.length) % DAILY_QUOTES.length;
        const q = DAILY_QUOTES[currentIndex];
        quoteEl.innerHTML = q.title;

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
        }, 5000);
    }

    resetTimer();
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
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
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
}

async function loadCardsForSearch() {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;

    try {
        allCardsCache = await loadCards();
    } catch (e) {
        console.warn("Could not preload cards for search:", e);
    }

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
            return en.includes(query) || th.includes(query);
        }).slice(0, 8);

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
