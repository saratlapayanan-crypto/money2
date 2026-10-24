import { MONETIZATION_CONFIG, buildAffiliateSearchUrl } from '../config/monetization-config.js';
import { trackEvent } from '../analytics.js';
import { showToast } from '../utils/share-and-history.js';
import { playCrystalChime, playCardTap } from '../utils/sound-effects.js';

/**
 * แสดงกล่อง "สนับสนุนค่าครูตามศรัทธา (9฿ / 19฿ / 29฿)" ในหน้าที่ต้องการ (เช่น result.html, daily.html)
 */
export function renderTipBox(containerEl) {
    if (!containerEl || !MONETIZATION_CONFIG.tipping?.enabled) return;

    const amounts = MONETIZATION_CONFIG.tipping.amounts || [];
    containerEl.innerHTML = `
        <div class="bg-gradient-to-br from-[#231230] via-[#311847] to-[#1D0E29] text-white rounded-2xl p-4 sm:p-5 border border-amber-400/50 shadow-lg relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex items-center justify-between gap-2 mb-2">
                <div class="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-200">
                    <span>🙏</span>
                    <span>ร่วมทำบุญค่าครูตามศรัทธา</span>
                </div>
                <span class="text-[10px] text-purple-200">เสริมสิริมงคล & สนับสนุนเว็บไซต์</span>
            </div>

            <h3 class="text-sm sm:text-base font-bold text-amber-100 mb-1">ร่วมสมทบค่าครูเพื่อเปิดทางพลังงานดีๆ</h3>
            <p class="text-xs text-purple-200 leading-relaxed mb-3.5">
                การดูดวงบนเว็บนี้ฟรีทั้งหมด หากคำทำนายช่วยชี้ทางสว่างให้คุณ สามารถร่วมสนับสนุนค่าครูตามกำลังศรัทธาเพื่อรับพรเสริมดวงได้ครับ
            </p>

            <div class="grid grid-cols-3 gap-2 mb-3">
                ${amounts.map((item, idx) => `
                    <button type="button" class="tip-amount-btn rounded-xl p-2.5 border transition-all text-center cursor-pointer ${idx === 1 ? 'bg-amber-400 text-[#231230] border-amber-200 font-bold shadow-md scale-[1.02]' : 'bg-white/10 hover:bg-white/20 text-white border-purple-300/30'}" data-amount="${item.amount}">
                        <span class="block text-sm sm:text-base font-extrabold">${item.label}</span>
                        <span class="block text-[10px] ${idx === 1 ? 'text-[#3B1D54]' : 'text-amber-200'} line-clamp-1 mt-0.5">${item.title}</span>
                    </button>
                `).join('')}
            </div>

            <button type="button" id="btn-open-tip-modal" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#231230] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <span>✨ ร่วมสนับสนุนค่าครู & รับคำอวยพรเสริมดวง</span>
            </button>
        </div>
    `;

    let selectedAmount = amounts[1]?.amount || 19;
    const btns = containerEl.querySelectorAll('.tip-amount-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            playCardTap();
            selectedAmount = Number(btn.dataset.amount);
            btns.forEach(b => {
                const active = b === btn;
                b.className = active
                    ? 'tip-amount-btn rounded-xl p-2.5 border transition-all text-center cursor-pointer bg-amber-400 text-[#231230] border-amber-200 font-bold shadow-md scale-[1.02]'
                    : 'tip-amount-btn rounded-xl p-2.5 border transition-all text-center cursor-pointer bg-white/10 hover:bg-white/20 text-white border-purple-300/30';
            });
            openTipModal(selectedAmount);
        });
    });

    containerEl.querySelector('#btn-open-tip-modal')?.addEventListener('click', () => {
        openTipModal(selectedAmount);
    });
}

/**
 * เปิดหน้าต่าง QR พร้อมเพย์ & คำอวยพรค่าครู
 */
export function openTipModal(amount = 19) {
    if (typeof document === 'undefined') return;
    playCrystalChime();
    trackEvent('open_tip_modal', { amount });

    const existing = document.getElementById('tarot-tip-modal');
    if (existing) existing.remove();

    const amounts = MONETIZATION_CONFIG.tipping.amounts || [];
    const tier = amounts.find(a => a.amount === Number(amount)) || amounts[1] || {
        amount: 19,
        label: '19 ฿',
        title: 'ค่าครูเปิดดวงสว่าง ✨',
        blessing: 'ขอให้การเงินคล่องตัว งานสำเร็จก้าวหน้า สมหวังดั่งใจ'
    };

    const promptPayId = MONETIZATION_CONFIG.tipping.promptPayId || '08X-XXX-XXXX';
    const accountName = MONETIZATION_CONFIG.tipping.accountName || 'money2 · Thai Tarot';
    const customQr = MONETIZATION_CONFIG.tipping.customQrImageUrl;

    const modal = document.createElement('div');
    modal.id = 'tarot-tip-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs';
    modal.innerHTML = `
        <div class="bg-[#FAF5FF] border-2 border-amber-300 rounded-3xl max-w-sm w-full p-5 shadow-2xl text-[#231230] relative text-center">
            <button type="button" id="btn-close-tip-modal" class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-purple-200 flex items-center justify-center text-sm font-bold text-[#4A3B55] hover:bg-purple-50 cursor-pointer" aria-label="ปิดหน้าต่าง">✕</button>

            <div class="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold mb-2">
                <span>🙏</span>
                <span>${tier.title} (${tier.label})</span>
            </div>

            <h3 class="text-base font-bold text-[#231230] mb-1">ร่วมทำบุญสนับสนุนค่าครู</h3>
            <p class="text-xs text-[#6B5B7E] mb-3">${accountName}</p>

            <!-- กล่อง QR PromptPay -->
            <div class="bg-white rounded-2xl p-4 border-2 border-purple-200 shadow-xs mb-3 mx-auto max-w-[230px]">
                <div class="bg-[#113566] text-white text-[11px] font-bold py-1 px-3 rounded-lg mb-2.5 tracking-wide">
                    THAI QR PROMPTPAY
                </div>
                ${customQr
                    ? `<img src="${customQr}" alt="PromptPay QR" class="w-40 h-40 mx-auto object-contain rounded-lg mb-2">`
                    : `<div class="w-36 h-36 mx-auto rounded-xl bg-gradient-to-br from-purple-50 to-amber-50 border border-dashed border-purple-300 flex flex-col items-center justify-center p-3 mb-2">
                        <span class="text-3xl mb-1">📲</span>
                        <span class="text-[11px] font-bold text-purple-900">โอนผ่านพร้อมเพย์</span>
                        <span class="text-xs font-extrabold text-amber-700 mt-0.5">${promptPayId}</span>
                        <span class="text-[10px] text-[#6B5B7E] mt-1">ยอดแนะนำ: <b>${tier.amount}.00 บาท</b></span>
                    </div>`
                }
                <p class="text-[11px] font-bold text-[#231230]">พร้อมเพย์: <span class="text-purple-700">${promptPayId}</span></p>
            </div>

            <!-- คำอวยพรประจำระดับค่าครู -->
            <div class="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3 mb-4 text-xs text-amber-950">
                <p class="font-bold mb-0.5">✨ คำอวยพรส่งพลังมงคลถึงคุณ</p>
                <p class="italic leading-relaxed">“${tier.blessing}”</p>
            </div>

            <div class="flex flex-col gap-2">
                <button type="button" id="btn-copy-promptpay" class="hero-pill-btn w-full py-2.5 text-center cursor-pointer">
                    <span>📋 คัดลอกเลขพร้อมเพย์ & รับพรเสริมดวง</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#btn-close-tip-modal')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    modal.querySelector('#btn-copy-promptpay')?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(promptPayId);
        } catch (_) {}
        trackEvent('copy_promptpay_id', { amount: tier.amount });
        playCrystalChime();
        showToast(`คัดลอกพร้อมเพย์แล้ว ✨ ${tier.blessing}`);
        close();
    });
}

/**
 * แปลงกล่อง AdSense สีเทาที่ยังไม่ได้ใส่โค้ดโฆษณาจริง ให้เป็นแบนเนอร์โปรโมตไอเทมสายมูและฟีเจอร์ทำเงินที่สวยงาม
 */
export function enhanceAdSlots() {
    if (typeof document === 'undefined') return;
    const slots = document.querySelectorAll('.ad-slot');
    if (!slots.length) return;

    const shopCrystalUrl = buildAffiliateSearchUrl('กำไลหินมงคลเสริมดวง');
    const shopTarotUrl = buildAffiliateSearchUrl('ไพ่ทาโรต์ของแท้');

    slots.forEach((slot, idx) => {
        // หากมีแท็กโฆษณาจริง (ins.adsbygoogle หรือ iframe) ไม่ต้องทับ
        if (slot.querySelector('ins, iframe')) return;

        slot.className = 'w-full my-5 rounded-2xl border border-amber-300/70 bg-gradient-to-r from-purple-950 via-[#2B1541] to-purple-900 p-3.5 text-white shadow-md';
        if (idx % 2 === 0) {
            slot.innerHTML = `
                <div class="flex items-center justify-between gap-3">
                    <div class="text-left">
                        <span class="inline-block text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/40 px-2 py-0.5 rounded-full mb-1">✦ ไอเทมสายมูแนะนำประจำวัน</span>
                        <h4 class="text-xs sm:text-sm font-bold text-white leading-snug">เสริมพลังดวงชะตาด้วยหินมงคล & กำไลสายมูแท้</h4>
                        <p class="text-[11px] text-purple-200 mt-0.5">คัดสรรหินแท้ตามธาตุไพ่ เสริมความรัก การเงิน และการงาน</p>
                    </div>
                    <a href="${shopCrystalUrl}" target="_blank" rel="nofollow sponsored noopener" class="shrink-0 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#231230] font-extrabold text-[11px] px-3.5 py-2 rounded-full no-underline shadow-sm">
                        ช้อปเลย 🛍️
                    </a>
                </div>
            `;
        } else {
            slot.innerHTML = `
                <div class="flex items-center justify-between gap-3">
                    <div class="text-left">
                        <span class="inline-block text-[9px] font-bold uppercase tracking-wider bg-pink-400/20 text-pink-200 border border-pink-300/40 px-2 py-0.5 rounded-full mb-1">🙏 สนับสนุนค่าครูตามศรัทธา</span>
                        <h4 class="text-xs sm:text-sm font-bold text-white leading-snug">ร่วมทำบุญค่าครูเริ่มต้นเพียง 9 บาท</h4>
                        <p class="text-[11px] text-purple-200 mt-0.5">รับคำอวยพรเสริมสิริมงคล และร่วมพัฒนาเว็บดูดวงฟรีเพื่อทุกคน</p>
                    </div>
                    <button type="button" class="ad-slot-tip-btn shrink-0 bg-white hover:bg-amber-50 text-purple-900 font-extrabold text-[11px] px-3.5 py-2 rounded-full shadow-sm cursor-pointer">
                        ร่วมบุญ 🙏
                    </button>
                </div>
            `;
            slot.querySelector('.ad-slot-tip-btn')?.addEventListener('click', () => openTipModal(19));
        }
    });
}
