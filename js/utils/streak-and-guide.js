import { getThaiDateString } from './timezone.js';
import { playCardTap } from './sound-effects.js';

const STREAK_STORAGE_KEY = 'tarot_daily_streak_v1';

/**
 * คำนวณยศสายมูตามจำนวนวันที่เปิดไพ่ต่อเนื่องหรือจำนวนครั้งสะสม
 */
export function getMysticRank(streakDays = 1, totalReadings = 1) {
    const score = streakDays * 2 + totalReadings;
    if (score >= 30) {
        return { title: 'จอมเวทย์แห่งดวงดาว', icon: '👑', nextAt: 50, color: 'text-amber-600 bg-amber-50 border-amber-300' };
    }
    if (score >= 14) {
        return { title: 'ผู้หยั่งรู้จันทรา', icon: '🌙', nextAt: 30, color: 'text-purple-700 bg-purple-50 border-purple-300' };
    }
    if (score >= 6) {
        return { title: 'นักอ่านไพ่สายมู', icon: '✨', nextAt: 14, color: 'text-pink-700 bg-pink-50 border-pink-300' };
    }
    return { title: 'ผู้เริ่มต้นเปิดดวง', icon: '🌱', nextAt: 6, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
}

/**
 * ดึงข้อมูลสถิติการเปิดไพ่ต่อเนื่อง (Daily Streak)
 */
export function getStreakInfo() {
    try {
        const raw = localStorage.getItem(STREAK_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        const streakDays = parsed?.streakDays || 0;
        const totalReadings = parsed?.totalReadings || 0;
        const lastDate = parsed?.lastDate || null;
        const rank = getMysticRank(streakDays, totalReadings);
        return {
            streakDays,
            totalReadings,
            lastDate,
            rank
        };
    } catch (_) {
        const rank = getMysticRank(0, 0);
        return { streakDays: 0, totalReadings: 0, lastDate: null, rank };
    }
}

/**
 * บันทึกสถิติการเปิดไพ่วันนี้ (เรียกใช้เมื่อเปิดไพ่ประจำวันหรือเปิดไพ่ส่วนตัวสำเร็จ)
 */
export function recordReadingStreak() {
    try {
        const todayStr = getThaiDateString();
        const current = getStreakInfo();
        let { streakDays, totalReadings, lastDate } = current;

        totalReadings += 1;

        if (!lastDate) {
            streakDays = 1;
        } else if (lastDate !== todayStr) {
            // ตรวจว่าเมื่อวานหรือไม่
            const last = new Date(lastDate + 'T00:00:00Z');
            const today = new Date(todayStr + 'T00:00:00Z');
            const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streakDays += 1;
            } else {
                streakDays = 1;
            }
        }

        const updated = {
            streakDays: Math.max(1, streakDays),
            totalReadings,
            lastDate: todayStr
        };
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
        return {
            ...updated,
            rank: getMysticRank(updated.streakDays, updated.totalReadings)
        };
    } catch (_) {
        return getStreakInfo();
    }
}

/**
 * อธิบายธาตุและหมวดไพ่ด้วยภาษาที่คนทั่วไปอ่านเข้าใจได้ในประโยคเดียว
 */
export function getCardElementExplanation(card) {
    if (!card) {
        return {
            badge: '🔮 ไพ่ทาโรต์นำทาง',
            element: 'พลังงานจักรวาล',
            simpleMeaning: 'สะท้อนสภาวะจิตใจและจังหวะชีวิตของคุณในขณะนี้'
        };
    }

    const id = String(card.id || '');
    if (card.arcana === 'major' || id.startsWith('major-')) {
        return {
            badge: '🌟 ไพ่ชุดใหญ่ (Major Arcana)',
            element: 'พลังแห่งโชคชะตา & จุดเปลี่ยนสำคัญ',
            simpleMeaning: 'ไพ่ใบนี้คือ "เรื่องใหญ่" ที่มีอิทธิพลต่อชีวิตคุณโดยตรง ไม่ใช่เรื่องบังเอิญ แต่เป็นบทเรียนหรือจังหวะสำคัญที่กำลังเปลี่ยนผ่าน'
        };
    }
    if (card.suit === 'wands' || id.startsWith('wands-')) {
        return {
            badge: '🔥 ไพ่ชุดไม้เท้า (Wands · ธาตุไฟ)',
            element: 'พลังงานการงาน • การลงมือทำ • แรงบันดาลใจ',
            simpleMeaning: 'ไพ่ชุดไม้เท้าพูดถึง "ไฟในการทำสิ่งต่างๆ" การงาน โปรเจกต์ ความกระตือรือร้น และการก้าวไปข้างหน้าอย่างมุ่งมั่น'
        };
    }
    if (card.suit === 'cups' || id.startsWith('cups-')) {
        return {
            badge: '💧 ไพ่ชุดถ้วย (Cups · ธาตุน้ำ)',
            element: 'พลังงานความรัก • ความรู้สึก • ความสัมพันธ์',
            simpleMeaning: 'ไพ่ชุดถ้วยสะท้อน "เรื่องของหัวใจและอารมณ์" ความรัก มิตรภาพ ความผูกพัน และความสุขทางใจของคุณกับคนรอบข้าง'
        };
    }
    if (card.suit === 'swords' || id.startsWith('swords-')) {
        return {
            badge: '⚔️ ไพ่ชุดดาบ (Swords · ธาตุลม)',
            element: 'พลังงานความคิด • การตัดสินใจ • การแก้ปัญหา',
            simpleMeaning: 'ไพ่ชุดดาบเตือนให้ใช้ "สติและเหตุผลเหนืออารมณ์" การตัดความกังวล การเผชิญหน้าความจริง และการตัดสินใจที่เด็ดขาดชัดเจน'
        };
    }
    return {
        badge: '🪙 ไพ่ชุดเหรียญ (Pentacles · ธาตุดิน)',
        element: 'พลังงานการเงิน • โชคลาภ • ความมั่นคงจริง',
        simpleMeaning: 'ไพ่ชุดเหรียญหมายถึง "ผลลัพธ์ที่จับต้องได้จริง" รายได้ เงินทอง ทรัพย์สิน สุขภาพ และความมั่นคงในระยะยาว'
    };
}

/**
 * เปิดหน้าต่างคู่มืออ่านไพ่ทาโรต์ฉบับเข้าใจง่ายใน 30 วินาที
 */
export function openTarotGuideModal() {
    if (typeof document === 'undefined') return;
    playCardTap();

    let modal = document.getElementById('tarot-quick-guide-modal');
    if (!modal) {
        const streak = getStreakInfo();
        modal = document.createElement('div');
        modal.id = 'tarot-quick-guide-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs';
        modal.innerHTML = `
            <div class="bg-[#FAF5FF] border-2 border-purple-200 rounded-3xl max-w-md w-full max-h-[88vh] overflow-y-auto p-5 shadow-2xl text-[#231230] relative">
                <button type="button" id="btn-close-guide-modal" class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white border border-purple-200 flex items-center justify-center text-sm font-bold text-[#4A3B55] hover:bg-purple-50 cursor-pointer" aria-label="ปิดหน้าต่างคู่มือ">✕</button>

                <div class="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[11px] font-bold mb-2">
                    <span>📖</span>
                    <span>คู่มือเข้าใจไพ่ทาโรต์ใน 30 วินาที</span>
                </div>
                <h3 class="text-lg font-bold text-[#231230] mb-1">อ่านไพ่ยังไงให้เข้าใจง่าย & แม่นที่สุด?</h3>
                <p class="text-xs text-[#6B5B7E] mb-4">ไม่ต้องจำความหมายไพ่ทั้ง 78 ใบ แค่เข้าใจหลักการ 3 ข้อนี้ก็ดูดวงตัวเองได้เหมือนมืออาชีพ</p>

                <!-- สถิติสายมูของคุณ -->
                <div class="bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-300/80 rounded-2xl p-3 mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl">${streak.rank.icon}</span>
                        <div>
                            <p class="text-[10px] font-bold text-amber-800 uppercase">ระดับพลังงานของคุณ</p>
                            <p class="text-xs font-bold text-[#231230]">${streak.rank.title}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-extrabold text-purple-700">🔥 ต่อเนื่อง ${streak.streakDays} วัน</p>
                        <p class="text-[10px] text-[#6B5B7E]">เปิดไพ่สะสม ${streak.totalReadings} ครั้ง</p>
                    </div>
                </div>

                <!-- 1. ความหมาย 5 หมวดไพ่ -->
                <div class="space-y-2 mb-4">
                    <h4 class="text-xs font-bold text-purple-900">1. ไพ่ 78 ใบ แบ่งเป็น 5 พลังงานหลัก</h4>
                    <div class="bg-white rounded-xl p-2.5 border border-purple-100 text-xs space-y-1.5">
                        <p>🌟 <b>ไพ่ชุดใหญ่ (Major Arcana 22 ใบ):</b> เรื่องสำคัญระดับจุดเปลี่ยนชีวิต บทเรียนใหญ่ หรือโชคชะตาที่กำลังทำงาน</p>
                        <p>🔥 <b>ไม้เท้า (Wands 14 ใบ):</b> ธาตุไฟ — เรื่องงาน โปรเจกต์ แรงบันดาลใจ และการลงมือทำ</p>
                        <p>💧 <b>ถ้วย (Cups 14 ใบ):</b> ธาตุน้ำ — เรื่องความรัก ความรู้สึก มิตรภาพ และความสุขทางใจ</p>
                        <p>⚔️ <b>ดาบ (Swords 14 ใบ):</b> ธาตุลม — เรื่องความคิด การตัดสินใจ อุปสรรค และการใช้เหตุผล</p>
                        <p>🪙 <b>เหรียญ (Pentacles 14 ใบ):</b> ธาตุดิน — เรื่องเงินทอง รายได้ โชคลาภ และความมั่นคง</p>
                    </div>
                </div>

                <!-- 2. เลือกโหมดเปิดไพ่แบบไหนดี -->
                <div class="space-y-2 mb-4">
                    <h4 class="text-xs font-bold text-purple-900">2. เลือกรูปแบบการเปิดไพ่ให้ตรงคำถาม</h4>
                    <div class="bg-white rounded-xl p-2.5 border border-purple-100 text-xs space-y-1.5">
                        <p>⚡ <b>เปิด 1 ใบฟันธง (Yes / No):</b> เหมาะกับคำถามที่ต้องการคำตอบชัดเจนว่า "ใช่ไหม / ควรลุยหรือชะลอ"</p>
                        <p>⏳ <b>เปิด 3 ใบ (อดีต • ปัจจุบัน • อนาคต):</b> เหมาะกับดูภาพรวมว่าเรื่องนี้มีที่มาอย่างไร และแนวโน้มข้างหน้าจะเป็นอย่างไร</p>
                        <p>💖 <b>เปิด 3 ใบเจาะลึก (ตัวเรา • ใจเขา/อุปสรรค • ทางออก):</b> เหมาะมากสำหรับถามเรื่องความรักหรือหาทางแก้ปัญหา</p>
                    </div>
                </div>

                <!-- 3. เคล็ดลับตั้งจิต -->
                <div class="bg-purple-900 text-white rounded-2xl p-3.5 text-xs mb-4">
                    <p class="font-bold text-amber-300 mb-1">✨ เคล็ดลับให้ไพ่สื่อสารได้แม่นยำที่สุด</p>
                    <p class="leading-relaxed text-purple-100">สูดหายใจลึกๆ ระบุชื่อตัวเองและเรื่องที่อยากรู้ให้ชัดเจนในใจ (เช่น "ภายใน 3 เดือนนี้ การงานของฉันจะเป็นอย่างไร?") แล้วใช้ความรู้สึกแรกแตะใบที่ดึงดูดสายตาที่สุด</p>
                </div>

                <button type="button" id="btn-got-it-guide" class="hero-pill-btn w-full py-2.5 text-center cursor-pointer">
                    <span>เข้าใจแล้ว เริ่มเปิดไพ่กันเลย ✨</span>
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        modal.querySelector('#btn-close-guide-modal')?.addEventListener('click', close);
        modal.querySelector('#btn-got-it-guide')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    }
}
