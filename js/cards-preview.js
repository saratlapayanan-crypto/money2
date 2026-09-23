import { loadCards } from './data-loader.js';
import { THEMES, getTheme } from './art/themes.js';
import { renderCardFront, renderCardBack } from './art/tarot-art.js';
import { APPROVED_CARD_ASSETS } from './art/fronts.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import {
    renderDeckBorder,
    renderDeckNumeralBadge,
    renderDeckCartouche
} from './art/borders.js';
import { toRoman } from './art/helpers.js';

let allCards = [];
let currentTheme = 'standard';
let activeTab = 'completed'; // 'completed' | 'queued' | 'all'
let promptManifest = {};
let countdownInterval = null;

const THEME_INFO = {
    standard: {
        title: 'สำรับมาตรฐาน: สีน้ำมันเรเนสซองส์อาร์ตนูโว',
        style: 'จิตรกรรมสีน้ำมันสไตล์เรเนสซองส์อาร์ตนูโว (Renaissance Art Nouveau Oil Painting)',
        desc: 'ทุกใบวาดเป็นภาพสีน้ำมันคลาสสิก วิจิตรงดงาม พร้อมกรอบทองคำ 3 ชั้นและซุ้มวิหารสวรรค์เอกลักษณ์เดียวกัน 100% ปราศจากความขัดแย้งทางศาสนา'
    },
    songkran: {
        title: 'สำรับสงกรานต์: จิตรกรรมลายรดน้ำร่วมสมัย',
        style: 'จิตรกรรมไทยประยุกต์ลายรดน้ำปิดทองคำแท้ (Contemporary Thai Gold Lacquer & Temple Mural Art)',
        desc: 'ทองคำเปลวบริสุทธิ์บนพื้นรักสีชาดและครามเข้ม ละอองน้ำอบมะลิมงคลปีใหม่ไทย ปราศจากรูปพระสงฆ์หรือสิ่งเคารพทางศาสนา'
    },
    'loy-krathong': {
        title: 'สำรับลอยกระทง: จิตรกรรมแสงจันทร์เพ็ญและสายน้ำ',
        style: 'จิตรกรรมแสงจันทร์เพ็ญและสายน้ำ (Moonlit Floating Lotus Lanterns)',
        desc: 'กระทงบงกชเรืองแสง ผิวน้ำประกายทองต้องแสงจันทร์เพ็ญ โคมลอยส่องสว่างบนฟ้าราตรีแห่งการขอบคุณสายน้ำ'
    },
    christmas: {
        title: 'สำรับคริสต์มาส / เหมายัน: นิทานวินเทจคลาสสิก',
        style: 'นิทานวินเทจคลาสสิก (Vintage Storybook Illustration)',
        desc: 'ลายเส้นนิทานอบอุ่นสไตล์ Arthur Rackham โทนสนไพน์ หิมะขาว และแสงเทียนอบอุ่นใจกลางฤดูหนาว'
    },
    valentine: {
        title: 'สำรับวาเลนไทน์: โรแมนติกโรโกโกและดอกกุหลาบ',
        style: 'โรแมนติกโรโกโกและดอกกุหลาบ (Romantic Rococo & French Art Nouveau)',
        desc: 'ศิลปะฝรั่งเศสยุคโรโกโก ดอกกุหลาบสีชมพูมาการอง และลวดลายทองคำแห่งรักแท้และความปรารถนาดี'
    },
    halloween: {
        title: 'สำรับฮาโลวีน: ดาร์กโกธิกวิกตอเรียน',
        style: 'ดาร์กโกธิกวิกตอเรียน (Dark Victorian Gothic)',
        desc: 'คฤหาสน์วิกตอเรียน หมอกรัตติกาล แสงจันทราสีเงิน และโคมฟักทองโบราณส่องสว่างในความลึกลับ'
    },
    minimalist: {
        title: 'สำรับมินิมอล: เรขาคณิตโมเดิร์นร่วมสมัย',
        style: 'สถาปัตยกรรมเรขาคณิตโมเดิร์น (Contemporary Architectural Graphic)',
        desc: 'ลายเส้นสีทองและเงินบนกระดาษคราฟต์นอร์ดิก เรียบหรู สะอาดตา ทรงพลังด้วยสัดส่วนทองคำ'
    }
};

// Generated concept art is kept separate from the 78-card registry until each
// card has its own reviewed asset. Showing the reviewed pilot here makes the
// new visual direction visible without pretending that the whole deck is done.
const GENERATED_PREVIEWS = {
    christmas: {
        src: 'output/imagegen/christmas-solstice-style-02-art-nouveau.png',
        alt: 'ตัวอย่างไพ่คริสต์มาสและหลังไพ่ Art Nouveau ที่สร้างใหม่',
        title: 'ตัวอย่างภาพใหม่ · Christmas / Winter Solstice',
        note: 'ภาพตัวอย่าง Art Nouveau ที่สร้างขึ้นใหม่ — ยังไม่ใช่ภาพครบ 78 ใบ'
    }
};

const GENERATED_CARD_ASSETS = {
    christmas: {
        cardId: 'major-0',
        src: 'output/imagegen/christmas-the-fool-art-nouveau.png',
        alt: 'ไพ่ The Fool ธีม Christmas / Winter Solstice วาดใหม่สไตล์ Art Nouveau',
        label: 'The Fool · ไพ่ใบแรกที่สร้างเป็นภาพแยก'
    }
};

async function init() {
    try { await setupGlobalDecks(); } catch (_) { /* optional */ }
    currentTheme = getActiveDeckId();
    allCards = await loadCards();

    await loadManifest();
    buildThemePicker();
    setupTabs();
    setupModal();
    startCountdown();
    updateHeaderStatus();
    renderGrid();
}

async function loadManifest(themeId = currentTheme) {
    try {
        const res = await fetch(`scripts/manifest_${themeId}.json`);
        if (res.ok) {
            const data = await res.json();
            promptManifest = {};
            data.forEach(item => {
                promptManifest[item.id] = item;
            });
            return;
        }
    } catch (_) {}

    try {
        const res = await fetch('scripts/batch_generate_manifest.json');
        if (res.ok) {
            const data = await res.json();
            promptManifest = {};
            data.forEach(item => {
                promptManifest[item.id] = item;
            });
        }
    } catch (_) {}
}

function isApproved(card, themeId) {
    if (themeId === 'standard') {
        return Boolean(APPROVED_CARD_ASSETS[card.id]);
    }
    return false;
}

function buildThemePicker() {
    const picker = document.getElementById('theme-picker');
    if (!picker) return;
    picker.innerHTML = '';
    Object.entries(THEMES).forEach(([id, t]) => {
        const btn = document.createElement('button');
        btn.className = 'chip transition-all' + (id === currentTheme ? ' !bg-gradient-to-r !from-purple-700 !to-amber-600 !text-white !border-amber-400 font-bold shadow-xs' : ' hover:bg-white/80');
        btn.textContent = t.label;
        btn.addEventListener('click', async () => {
            currentTheme = id;
            await loadManifest(currentTheme);
            buildThemePicker();
            updateHeaderStatus();
            renderGrid();
        });
        picker.appendChild(btn);
    });
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.preview-tab');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active', '!bg-gradient-to-r', '!from-purple-600', '!to-amber-600', '!text-white', 'shadow-md');
                b.classList.add('bg-white/90', 'text-[#5C4A6F]');
            });
            btn.classList.add('active', '!bg-gradient-to-r', '!from-purple-600', '!to-amber-600', '!text-white', 'shadow-md');
            btn.classList.remove('bg-white/90', 'text-[#5C4A6F]');
            activeTab = btn.dataset.tab;
            renderGrid();
        });
    });
}

function updateHeaderStatus() {
    const info = THEME_INFO[currentTheme] || THEME_INFO.standard;
    const titleEl = document.getElementById('deck-status-title');
    const descEl = document.getElementById('deck-style-desc');
    const badgeEl = document.getElementById('deck-badge');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const countCompletedEl = document.getElementById('count-completed');
    const countQueuedEl = document.getElementById('count-queued');
    const progressTextLeft = document.getElementById('progress-text-left');
    const progressTextRight = document.getElementById('progress-text-right');

    const completedCount = allCards.filter(c => isApproved(c, currentTheme)).length;
    const queuedCount = allCards.length - completedCount;
    const percentage = ((completedCount / (allCards.length || 78)) * 100).toFixed(1);

    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;
    if (badgeEl) {
        badgeEl.textContent = currentTheme === 'standard'
            ? `✨ Masterpiece ${completedCount} / ${allCards.length || 78} ใบ (${percentage}%)`
            : `⏳ รอคิว AI 0 / 78 ใบ (0%)`;
    }
    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
    }
    if (countCompletedEl) countCompletedEl.textContent = completedCount;
    if (countQueuedEl) countQueuedEl.textContent = queuedCount;
    if (progressTextLeft) {
        progressTextLeft.textContent = currentTheme === 'standard'
            ? `🎨 สร้างเสร็จแล้ว ${completedCount} / 78 ใบ (Major Arcana ครบ 22 ใบ + Wands ครบ 14 ใบ + Cups ครบ 14 ใบ + Swords 9 ใบ + 1 Ace)`
            : `🎨 อยู่ในคิวรอสร้างภาพ AI หลังสำรับมาตรฐานเสร็จสมบูรณ์`;
    }
    if (progressTextRight) {
        progressTextRight.textContent = `รอคิว AI ${queuedCount} ใบ`;
    }
}

/**
 * นาฬิกานับถอยหลังรอบโควตา AI ปลดล็อก (2026-09-28T13:46:13Z หรือ 20:46 น. วันที่ 28 ก.ย.)
 */
function startCountdown() {
    const countdownEl = document.getElementById('quota-countdown');
    if (!countdownEl) return;

    // Reset timestamp: 2026-09-28T13:46:13Z (20:46 Thai time)
    const resetTime = new Date('2026-09-28T13:46:13Z').getTime();

    function update() {
        const now = Date.now();
        const diff = resetTime - now;

        if (diff <= 0) {
            countdownEl.textContent = '00:00:00';
            countdownEl.classList.remove('text-[#B45309]');
            countdownEl.classList.add('text-emerald-600');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = n => String(n).padStart(2, '0');
        countdownEl.textContent = days > 0
            ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
            : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    update();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(update, 1000);
}

/**
 * เรนเดอร์การ์ดในคิว AI สไตล์หรูหรา (Luxury Celestial Queue Card)
 * ใช้กรอบและตรายอดซุ้มเดียวกัน 100% กับไพ่มาสเตอร์พีซ เพื่อรักษาความต่อเนื่อง
 * ไร้ภาพลายเส้นแบนหรือตัวการ์ตูน
 */
function renderQueuedCardSvg(card, themeId) {
    const t = getTheme(themeId);
    const uid = `queue_${card.id}_${Math.random().toString(36).substring(2, 7)}`;
    const W = 240, H = 380, CX = 120;

    let numeralStr = '';
    if (card.arcana === 'major') {
        numeralStr = toRoman(card.number);
    } else {
        const rankNames = { 1: 'ACE', 11: 'PAGE', 12: 'KNIGHT', 13: 'QUEEN', 14: 'KING' };
        numeralStr = rankNames[card.number] || String(card.number);
    }

    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.name_th || card.name} - รอคิว AI">
<defs>
    <clipPath id="${uid}clip"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <linearGradient id="${uid}bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#140b20"/>
        <stop offset="50%" stop-color="#1c102e"/>
        <stop offset="100%" stop-color="#28153f"/>
    </linearGradient>
    <linearGradient id="${uid}gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff5cc"/>
        <stop offset="35%" stop-color="${t.frame}"/>
        <stop offset="70%" stop-color="#b8860b"/>
        <stop offset="100%" stop-color="${t.frame}"/>
    </linearGradient>
    <radialGradient id="${uid}centerGlow" cx="50%" cy="46%" r="55%">
        <stop offset="0%" stop-color="#ffd54f" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#7c3aed" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
</defs>

<!-- พื้นหลังกำมะหยี่ราตรีพร้อมประกายแสง -->
<rect width="${W}" height="${H}" rx="14" fill="url(#${uid}bg)"/>
<circle cx="${CX}" cy="175" r="90" fill="url(#${uid}centerGlow)"/>

<!-- ดวงดาวระยิบระยับในราตรี -->
<g opacity="0.65" fill="#fef08a">
    <circle cx="55" cy="115" r="1.2"/>
    <circle cx="185" cy="125" r="1.4"/>
    <circle cx="65" cy="225" r="1.1"/>
    <circle cx="178" cy="235" r="1.3"/>
    <circle cx="120" cy="100" r="1.5"/>
</g>

<!-- วงแหวนดาราศาสตร์และสัญลักษณ์สัจธรรมจักรวาล (Sacred Celestial Geometry) -->
<g transform="translate(${CX}, 172)">
    <!-- วงแหวนนอก -->
    <circle cx="0" cy="0" r="54" fill="none" stroke="url(#${uid}gold)" stroke-width="1.4" opacity="0.85"/>
    <circle cx="0" cy="0" r="48" fill="none" stroke="${t.frameSoft}" stroke-width="0.8" stroke-dasharray="3, 3" opacity="0.7"/>
    <circle cx="0" cy="0" r="40" fill="none" stroke="url(#${uid}gold)" stroke-width="0.9" opacity="0.6"/>

    <!-- รัศมี 8 ทิศ -->
    <path d="M 0 -58 L 0 -48 M 0 48 L 0 58 M -58 0 L -48 0 M 48 0 L 58 0 M -41 -41 L -34 -34 M 34 34 L 41 41 M -41 41 L -34 34 M 34 -34 L 41 -41" stroke="url(#${uid}gold)" stroke-width="1.2" opacity="0.75"/>

    <!-- ตราสัญลักษณ์นาฬิกาทรายมนตราเรืองแสงแห่งกาลเวลา -->
    <path d="M -14 -20 L 14 -20 L 0 0 L 14 20 L -14 20 L 0 0 Z" fill="rgba(245, 158, 11, 0.15)" stroke="url(#${uid}gold)" stroke-width="1.6"/>
    <!-- ทรายทองคำไหลผ่านใจกลาง -->
    <circle cx="0" cy="0" r="2.2" fill="#fff5cc"/>
    <circle cx="0" cy="10" r="3.2" fill="#fbbf24"/>
    <circle cx="0" cy="14" r="5" fill="#f59e0b" opacity="0.8"/>

    <!-- ประกายแสงกึ่งกลาง -->
    <polygon points="0,-28 2.5,-22 8.5,-20 2.5,-18 0,-12 -2.5,-18 -8.5,-20 -2.5,-22" fill="#ffffff" opacity="0.95"/>
</g>

<!-- ป้ายสถานะคิว AI ระดับพรีเมียม -->
<g transform="translate(${CX}, 245)">
    <rect x="-68" y="-12" width="136" height="24" rx="12" fill="#2d124d" stroke="url(#${uid}gold)" stroke-width="1.1" opacity="0.95"/>
    <text x="0" y="4" fill="#fbbf24" font-size="9.5" font-family="'Outfit', sans-serif" font-weight="700" letter-spacing="1.5" text-anchor="middle">✦ AI IN QUEUE ✦</text>
    <text x="0" y="22" fill="#e9d5ff" font-size="8" font-family="'Mitr', sans-serif" font-weight="400" text-anchor="middle">รอบโควตา 18:52 น.</text>
</g>

<!-- 1. กรอบนอก 3 ชั้นและลวดลายมุมเอกลักษณ์เดียวกัน 100% -->
${renderDeckBorder(themeId, t, uid, false)}

<!-- 2. ตรายอดซุ้มและตัวเลขกำกับไพ่ด้านบน -->
${renderDeckNumeralBadge(card, themeId, t, uid, numeralStr)}

<!-- 3. ป้ายชื่อไพ่ด้านล่างประจำสำรับ (Mitr + Outfit + Watermark) -->
${renderDeckCartouche(card, themeId, t, uid)}
</svg>`;
}

function renderGrid() {
    const grid = document.getElementById('cards-preview');
    if (!grid) return;
    grid.innerHTML = '';

    // แผ่นหลังไพ่ประจำธีม (แสดงในแท็บ completed หรือ all)
    if (activeTab === 'completed' || activeTab === 'all') {
        const backCell = document.createElement('div');
        backCell.className = 'flex flex-col items-center group transition-transform duration-200 hover:-translate-y-1 cursor-pointer';
        backCell.innerHTML = renderCardBack(currentTheme);
        const backItem = backCell.querySelector('svg, img');
        if (backItem) backItem.classList.add('w-full', 'h-auto', 'rounded-xl', 'shadow-md', 'border', 'border-amber-300/60');
        
        const badge = document.createElement('span');
        badge.className = 'text-[10px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200';
        badge.textContent = 'หลังไพ่ประจำสำรับ';
        backCell.appendChild(badge);

        const caption = document.createElement('span');
        caption.className = 'text-[11px] font-semibold text-[#6D28D9] mt-0.5 text-center truncate w-full';
        caption.textContent = 'ลวดลายจักรวาลสยาม';
        backCell.appendChild(caption);

        backCell.addEventListener('click', () => {
            openCardModal({
                name_th: 'หลังไพ่ประจำสำรับ',
                name: 'Theme Card Back',
                description: 'ลวดลายหลังไพ่ที่ออกแบบเฉพาะตัวสำหรับสำรับนี้ ลายเส้นทองคำสอดประสานมนตราสยามและสัญลักษณ์ดวงดาว'
            }, renderCardBack(currentTheme), true);
        });

        grid.appendChild(backCell);
    }

    allCards.forEach(card => {
        const approved = isApproved(card, currentTheme);

        // คัดกรองตามแท็บที่เลือก
        if (activeTab === 'completed' && !approved) return;
        if (activeTab === 'queued' && approved) return;

        const cell = document.createElement('div');
        cell.className = 'flex flex-col items-center group transition-transform duration-200 hover:-translate-y-1 cursor-pointer relative';
        cell.id = `card-${card.id}`;

        let cardSvg = '';
        if (approved) {
            cardSvg = renderCardFront(card, currentTheme);
        } else {
            cardSvg = renderQueuedCardSvg(card, currentTheme);
        }

        cell.innerHTML = cardSvg;
        const item = cell.querySelector('svg, img');
        if (item) {
            item.classList.add('w-full', 'h-auto', 'rounded-xl', 'shadow-md', 'border');
            if (approved) {
                item.classList.add('border-amber-400/70', 'ring-1', 'ring-amber-200/50');
            } else {
                item.classList.add('border-purple-300/40', 'opacity-95');
            }
        }

        // ป้ายสถานะ
        const statusPill = document.createElement('span');
        if (approved) {
            statusPill.className = 'text-[9.5px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1';
            statusPill.innerHTML = '<span>✨</span><span>Masterpiece สำเร็จ</span>';
        } else {
            statusPill.className = 'text-[9.5px] font-semibold px-2 py-0.5 mt-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300/80 flex items-center gap-1';
            statusPill.innerHTML = '<span>⏳</span><span>รอคิว AI 18:52</span>';
        }
        cell.appendChild(statusPill);

        const caption = document.createElement('span');
        caption.className = 'text-[11px] font-semibold text-[#3D2B4E] mt-0.5 text-center truncate w-full';
        caption.textContent = `${card.name_th || card.thai_name || card.name}`;
        cell.appendChild(caption);

        cell.addEventListener('click', () => {
            openCardModal(card, cardSvg, approved);
        });

        grid.appendChild(cell);
    });

    // Scroll to target card if hash is provided in URL
    if (window.location.hash) {
        try {
            const targetEl = document.querySelector(window.location.hash);
            if (targetEl) {
                setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
            }
        } catch (_) {}
    }
}

function setupModal() {
    const modal = document.getElementById('card-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!modal) return;

    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        const content = document.getElementById('card-modal-content');
        if (content) content.classList.add('scale-95');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openCardModal(card, svgHtml, isCompleted) {
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('modal-body');
    const content = document.getElementById('card-modal-content');
    if (!modal || !modalBody) return;

    const manifestEntry = promptManifest[card.id] || null;

    modalBody.innerHTML = `
        <div class="w-48 sm:w-56 rounded-xl overflow-hidden shadow-xl border border-amber-400/80 mb-4 flex-shrink-0">
            ${svgHtml}
        </div>
        <div class="w-full text-center">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'} mb-2">
                <span>${isCompleted ? '✨ Masterpiece สร้างเสร็จสมบูรณ์' : '⏳ รอคิว AI รอบ 18:52 น.'}</span>
            </div>
            <h3 class="text-xl font-bold text-[#231230]">${card.name_th || card.thai_name || card.name}</h3>
            <p class="text-xs text-[#7A6A8D] font-mono tracking-wider uppercase">${card.name_en || card.name || ''}</p>
        </div>

        <div class="w-full mt-4 space-y-3 text-left">
            <div class="bg-purple-50/70 rounded-xl p-3.5 border border-purple-200/60 text-xs">
                <div class="font-bold text-[#6D28D9] mb-1 flex items-center gap-1.5">
                    <span>🔮</span>
                    <span>ความหมายหลัก</span>
                </div>
                <p class="text-[#3F2E52] leading-relaxed">${card.meaning_upright || card.description || 'ก้าวสำคัญแห่งสัจธรรมและการเรียนรู้'}</p>
            </div>

            <div class="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/60 text-xs">
                <div class="font-bold text-[#B45309] mb-1 flex items-center gap-1.5">
                    <span>🎨</span>
                    <span>สไตล์ศิลปะและการควบคุมภาพ (Art Direction)</span>
                </div>
                <p class="text-[#5C4A6F] leading-relaxed">
                    ${isCompleted
                        ? 'วาดด้วยภาพสีน้ำมันสไตล์เรเนสซองส์อาร์ตนูโว องค์ประกอบคลาสสิก ปราศจากความขัดแย้งทางศาสนา 100% พร้อมกรอบทองคำเอกลักษณ์ประจำสำรับ'
                        : (manifestEntry ? manifestEntry.prompt : 'เตรียมคำสั่งสร้างภาพสีน้ำมันคลาสสิกสไตล์เดียวกับ 27 ใบแรก ปราศจากรูปพระหรือศาสนาใดๆ')}
                </p>
            </div>

            <div class="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                <span>กรอบ 3 ชั้น: อัตลักษณ์เดียวกับทั้งสำรับ</span>
                <span class="text-emerald-700 font-semibold">ปราศจากความขัดแย้งทางศาสนา 100%</span>
            </div>
        </div>
    `;

    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (content) content.classList.remove('scale-95');
}

document.addEventListener('DOMContentLoaded', init);
