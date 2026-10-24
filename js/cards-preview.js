import { loadCards } from './data-loader.js';
import { THEMES } from './art/themes.js';
import { renderCardFront, renderCardBack } from './art/tarot-art.js';
import { APPROVED_CARD_ASSETS } from './art/fronts.js';
import { setupGlobalDecks, getActiveDeckId } from './engines/deck-engine.js';
import { generateCardWallpaperDataUrl, showToast } from './utils/share-and-history.js';
import { initSoundAndPwa, playCardTap } from './utils/sound-effects.js';

let allCards = [];
let currentTheme = 'standard';
let activeTab = 'all'; // 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
let searchQuery = '';
let promptManifest = {};

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

async function init() {
    initSoundAndPwa();
    try { await setupGlobalDecks(); } catch (_) { /* optional */ }
    currentTheme = getActiveDeckId() || 'standard';
    allCards = await loadCards();

    buildThemePicker();
    setupTabs();
    setupSearch();
    setupModal();
    updateHeaderStatus();
    renderGrid();
}

function isApprovedMasterpiece(card) {
    return Boolean(APPROVED_CARD_ASSETS[card?.id]);
}

function buildThemePicker() {
    const picker = document.getElementById('theme-picker');
    if (!picker) return;
    picker.innerHTML = '';
    Object.entries(THEMES).forEach(([id, t]) => {
        const btn = document.createElement('button');
        btn.className = 'chip transition-all cursor-pointer' + (id === currentTheme ? ' !bg-gradient-to-r !from-purple-700 !to-amber-600 !text-white !border-amber-400 font-bold shadow-xs' : ' hover:bg-white/80');
        btn.textContent = t.label;
        btn.addEventListener('click', () => {
            playCardTap();
            currentTheme = id;
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
            activeTab = btn.dataset.tab || 'all';
            renderGrid();
        });
    });
}

function setupSearch() {
    const input = document.getElementById('preview-search-input');
    const clearBtn = document.getElementById('preview-search-clear');
    if (!input) return;

    input.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !searchQuery);
        }
        renderGrid();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            searchQuery = '';
            clearBtn.classList.add('hidden');
            renderGrid();
        });
    }
}

function updateHeaderStatus() {
    const info = THEME_INFO[currentTheme] || THEME_INFO.standard;
    const titleEl = document.getElementById('deck-status-title');
    const descEl = document.getElementById('deck-style-desc');
    const badgeEl = document.getElementById('deck-badge');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressTextLeft = document.getElementById('progress-text-left');
    const progressTextRight = document.getElementById('progress-text-right');
    const quotaCountdownEl = document.getElementById('quota-countdown');
    const pillSubEl = document.getElementById('deck-pill-sub');

    const total = allCards.length || 78;
    const isStandard = currentTheme === 'standard';
    const masterpieceCount = allCards.filter(c => isApprovedMasterpiece(c, currentTheme)).length;

    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;

    if (isStandard) {
        const percentage = ((masterpieceCount / total) * 100).toFixed(0);
        if (badgeEl) {
            badgeEl.textContent = `✨ Masterpiece ${masterpieceCount} / ${total} ใบ (${percentage}%)`;
        }
        if (progressBarFill) {
            progressBarFill.style.width = `${percentage}%`;
        }
        if (progressTextLeft) {
            progressTextLeft.textContent = `🎨 สร้างเสร็จสมบูรณ์ ${masterpieceCount} / ${total} ใบ (Major Arcana ครบ 22 ใบ + Wands ครบ 14 ใบ + Cups ครบ 14 ใบ + Swords ครบ 14 ใบ + Pentacles ครบ 14 ใบ)`;
        }
        if (progressTextRight) {
            progressTextRight.textContent = `✨ ครบทุกใบ 100%`;
        }
        if (quotaCountdownEl) {
            quotaCountdownEl.textContent = 'ครบสมบูรณ์ 100%';
        }
        if (pillSubEl) {
            pillSubEl.textContent = 'ภาพสีน้ำมันเรเนสซองส์ครบ 78 ใบ';
        }
    } else {
        if (badgeEl) {
            badgeEl.textContent = `🎨 สำรับเทศกาล 78 / 78 ใบ (100%)`;
        }
        if (progressBarFill) {
            progressBarFill.style.width = `100%`;
        }
        if (progressTextLeft) {
            progressTextLeft.textContent = `🎨 งานศิลป์เวกเตอร์มนตราประจำเทศกาลครบ 78 ใบ (Major 22 + Wands 14 + Cups 14 + Swords 14 + Pentacles 14)`;
        }
        if (progressTextRight) {
            progressTextRight.textContent = `✨ พร้อมใช้งานครบ 78 ใบ`;
        }
        if (quotaCountdownEl) {
            quotaCountdownEl.textContent = 'พร้อมใช้งาน 78 ใบ';
        }
        if (pillSubEl) {
            pillSubEl.textContent = 'กรอบและลวดลายเฉพาะเทศกาล';
        }
    }
}

function matchesSuitFilter(card) {
    if (activeTab === 'all' || activeTab === 'completed') return true;
    if (activeTab === 'major') return card.arcana === 'major';
    return card.suit === activeTab;
}

function matchesSearch(card) {
    if (!searchQuery) return true;
    const nameEn = (card.name_en || card.name || '').toLowerCase();
    const nameTh = (card.name_th || card.thai_name || '').toLowerCase();
    const meaning = (card.meaning_upright || '').toLowerCase();
    const keywords = Array.isArray(card.keywords_upright) ? card.keywords_upright.join(' ').toLowerCase() : '';
    const numStr = String(card.number ?? '');
    return (
        nameEn.includes(searchQuery) ||
        nameTh.includes(searchQuery) ||
        meaning.includes(searchQuery) ||
        keywords.includes(searchQuery) ||
        numStr === searchQuery
    );
}

function renderGrid() {
    const grid = document.getElementById('cards-preview');
    if (!grid) return;
    grid.innerHTML = '';

    // แผ่นหลังไพ่ประจำธีม (แสดงเมื่อดูทั้งสำรับและไม่ได้พิมพ์ค้นหา)
    if ((activeTab === 'all' || activeTab === 'completed') && !searchQuery) {
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
                id: 'major-1',
                name_th: 'หลังไพ่ประจำสำรับ',
                name_en: 'Theme Card Back',
                name: 'Theme Card Back',
                meaning_upright: 'ลวดลายหลังไพ่ที่ออกแบบเฉพาะตัวสำหรับสำรับนี้ ลายเส้นทองคำสอดประสานมนตราสยามและสัญลักษณ์ดวงดาวอย่างสมมาตร',
                reflection: 'ทุกด้านที่ซ่อนอยู่ คือคำตอบที่รอเวลาเปิดเผยเมื่อใจสงบ'
            }, renderCardBack(currentTheme), true, true);
        });

        grid.appendChild(backCell);
    }

    const filteredCards = allCards.filter(card => matchesSuitFilter(card) && matchesSearch(card));

    if (filteredCards.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center bg-white/70 rounded-2xl border border-purple-100 p-6">
                <div class="text-2xl mb-2">🔍</div>
                <p class="text-sm font-bold text-[#231230]">ไม่พบไพ่ที่ตรงกับคำค้นหา "${searchQuery}"</p>
                <p class="text-xs text-[#7A6B85] mt-1">ลองค้นหาด้วยชื่อไพ่ภาษาไทย ภาษาอังกฤษ หรือเลือกหมวดไพ่ด้านบน</p>
            </div>
        `;
        return;
    }

    filteredCards.forEach(card => {
        const isMasterpiece = isApprovedMasterpiece(card, currentTheme);

        const cell = document.createElement('div');
        cell.className = 'flex flex-col items-center group transition-transform duration-200 hover:-translate-y-1 cursor-pointer relative';
        cell.id = `card-${card.id}`;

        const cardSvg = renderCardFront(card, currentTheme);
        cell.innerHTML = cardSvg;

        const item = cell.querySelector('svg, img');
        if (item) {
            item.classList.add('w-full', 'h-auto', 'rounded-xl', 'shadow-md', 'border', 'border-amber-400/70', 'ring-1', 'ring-amber-200/50');
        }

        // ป้ายสถานะและหมวดไพ่
        const statusPill = document.createElement('span');
        statusPill.className = 'text-[9.5px] font-bold px-2 py-0.5 mt-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1';
        statusPill.innerHTML = isMasterpiece
            ? '<span>✨</span><span>Masterpiece</span>'
            : '<span>🎨</span><span>Seasonal Art</span>';
        cell.appendChild(statusPill);

        const caption = document.createElement('span');
        caption.className = 'text-[11px] font-semibold text-[#3D2B4E] mt-0.5 text-center truncate w-full';
        caption.textContent = `${card.name_th || card.thai_name || card.name}`;
        cell.appendChild(caption);

        cell.addEventListener('click', () => {
            openCardModal(card, cardSvg, isMasterpiece, false);
        });

        grid.appendChild(cell);
    });

    // Scroll to target card if hash is provided in URL
    if (window.location.hash && window.location.hash.startsWith('#card-')) {
        try {
            const targetEl = document.querySelector(window.location.hash);
            if (targetEl) {
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('ring-4', 'ring-purple-400', 'rounded-2xl');
                }, 150);
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

function openCardModal(card, svgHtml, isMasterpiece, isBackCard = false) {
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('modal-body');
    const content = document.getElementById('card-modal-content');
    if (!modal || !modalBody) return;

    const keywordsHtml = Array.isArray(card.keywords_upright) && card.keywords_upright.length
        ? `<div class="bg-amber-50/70 rounded-xl p-3 border border-amber-200/70 text-xs">
                <div class="font-bold text-[#8A5D0B] mb-1.5 flex items-center gap-1.5">
                    <span>🌟</span>
                    <span>พลังงานสำคัญของไพ่ใบนี้</span>
                </div>
                <ul class="list-disc list-inside space-y-1 text-[#4A3B55] leading-relaxed">
                    ${card.keywords_upright.map(kw => `<li>${kw}</li>`).join('')}
                </ul>
           </div>`
        : '';

    const reflectionHtml = card.reflection
        ? `<div class="bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/70 text-xs">
                <div class="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                    <span>🪞</span>
                    <span>ข้อคิดสะท้อนใจ (Mindful Reflection)</span>
                </div>
                <p class="text-emerald-900 italic leading-relaxed">“${card.reflection}”</p>
           </div>`
        : '';

    const cautionHtml = card.meaning_reversed
        ? `<div class="bg-rose-50/70 rounded-xl p-3 border border-rose-200/70 text-xs">
                <div class="font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>จุดเตือนสติที่ควรระวัง</span>
                </div>
                <p class="text-rose-900 leading-relaxed">${card.meaning_reversed}</p>
           </div>`
        : '';

    modalBody.innerHTML = `
        <div class="w-48 sm:w-56 rounded-xl overflow-hidden shadow-xl border border-amber-400/80 mb-4 flex-shrink-0">
            ${svgHtml}
        </div>
        <div class="w-full text-center">
            <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                <span>${isMasterpiece ? '✨ Masterpiece Oil Painting' : '🎨 Seasonal Art Nouveau'}</span>
            </div>
            <h3 class="text-xl font-bold text-[#231230]">${card.name_th || card.thai_name || card.name}</h3>
            <p class="text-xs text-[#7A6A8D] font-mono tracking-wider uppercase">${card.name_en || card.name || ''}</p>
        </div>

        <div class="w-full mt-4 space-y-2.5 text-left">
            <div class="bg-purple-50/70 rounded-xl p-3.5 border border-purple-200/60 text-xs">
                <div class="font-bold text-[#6D28D9] mb-1 flex items-center gap-1.5">
                    <span>🔮</span>
                    <span>ความหมายหลัก (Upright Meaning)</span>
                </div>
                <p class="text-[#3F2E52] leading-relaxed font-medium">${card.meaning_upright || card.description || 'ก้าวสำคัญแห่งสัจธรรมและการเรียนรู้'}</p>
            </div>

            ${keywordsHtml}
            ${reflectionHtml}
            ${cautionHtml}

            ${!isBackCard ? `
            <div class="pt-2 flex flex-col sm:flex-row gap-2">
                <button id="modal-download-wp-btn" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>📱</span>
                    <span>ดาวน์โหลดวอลเปเปอร์ไพ่ใบนี้</span>
                </button>
                <a href="reading.html" class="flex-1 py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 no-underline text-center">
                    <span>🔮</span>
                    <span>เปิดไพ่ถามเรื่องของคุณ</span>
                </a>
            </div>
            ` : ''}

            <div class="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                <span>กรอบ 3 ชั้น: อัตลักษณ์เดียวกับทั้งสำรับ</span>
                <span class="text-emerald-700 font-semibold">ปราศจากความขัดแย้งทางศาสนา 100%</span>
            </div>
        </div>
    `;

    const dlBtn = document.getElementById('modal-download-wp-btn');
    if (dlBtn && !isBackCard) {
        dlBtn.addEventListener('click', async () => {
            dlBtn.disabled = true;
            dlBtn.innerHTML = '<span>⏳</span><span>กำลังสร้างวอลเปเปอร์...</span>';
            try {
                const dataUrl = await generateCardWallpaperDataUrl({
                    card,
                    heading: `${card.name_th || card.name} · ${card.name_en || card.name}`,
                    affirmation: card.reflection || card.meaning_upright || 'ขอให้พลังแห่งไพ่นำทางสู่ความสำเร็จและความสุข',
                    luckyColorName: 'ทองอร่าม & ม่วงมนตรา',
                    luckyColorHex: '#D97706',
                    wallpaperTitle: 'TAROT MASTERPIECE WALLPAPER'
                });
                if (dataUrl) {
                    const link = document.createElement('a');
                    link.download = `money2-tarot-${card.id}.png`;
                    link.href = dataUrl;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    showToast('ดาวน์โหลดวอลเปเปอร์ไพ่สำเร็จแล้ว ✨');
                }
            } catch (err) {
                console.warn('Wallpaper generation error:', err);
                showToast('ไม่สามารถสร้างวอลเปเปอร์ได้ในขณะนี้');
            } finally {
                dlBtn.disabled = false;
                dlBtn.innerHTML = '<span>📱</span><span>ดาวน์โหลดวอลเปเปอร์ไพ่ใบนี้</span>';
            }
        });
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    if (content) content.classList.remove('scale-95');
}

document.addEventListener('DOMContentLoaded', init);
