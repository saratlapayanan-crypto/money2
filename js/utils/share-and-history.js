import { APPROVED_CARD_ASSETS } from '../art/fronts.js';
import { formatThaiDateDisplay, getThaiDateString } from './timezone.js';

const HISTORY_STORAGE_KEY = 'tarot_reading_history_v1';
const MAX_HISTORY_ITEMS = 15;

/**
 * คำนวณผลฟันธง Yes / No เชิงจิตวิทยาจากสถานะคำทำนายและพลังงานไพ่
 */
export function getYesNoVerdict(card, interpStatus = 'neutral') {
    const positiveIds = new Set([
        'major-0', 'major-1', 'major-3', 'major-6', 'major-7', 'major-8',
        'major-10', 'major-11', 'major-14', 'major-17', 'major-19', 'major-20', 'major-21',
        'wands-1', 'wands-3', 'wands-4', 'wands-6', 'wands-8', 'wands-11', 'wands-13', 'wands-14',
        'cups-1', 'cups-2', 'cups-3', 'cups-6', 'cups-9', 'cups-10', 'cups-11', 'cups-13', 'cups-14',
        'swords-1', 'swords-6', 'swords-13', 'swords-14',
        'pentacles-1', 'pentacles-3', 'pentacles-6', 'pentacles-8', 'pentacles-9', 'pentacles-10', 'pentacles-13', 'pentacles-14'
    ]);
    const cautionIds = new Set([
        'major-12', 'major-13', 'major-15', 'major-16', 'major-18',
        'wands-5', 'wands-7', 'wands-9', 'wands-10',
        'cups-4', 'cups-5', 'cups-7', 'cups-8',
        'swords-3', 'swords-5', 'swords-7', 'swords-8', 'swords-9', 'swords-10',
        'pentacles-5'
    ]);

    const cardId = card?.id || '';
    if (interpStatus === 'positive' || positiveIds.has(cardId)) {
        return {
            code: 'YES',
            badge: 'YES · พลังบวกหนุนนำ ✨',
            label: 'ใช่ • ลุยได้เลย มีเกณฑ์สำเร็จสูง',
            advice: 'จังหวะและพลังงานเปิดทางให้คุณแล้ว เดินหน้าด้วยความมั่นใจได้เลย',
            hex: '#10B981'
        };
    }
    if (interpStatus === 'caution' || cautionIds.has(cardId)) {
        return {
            code: 'WAIT',
            badge: 'WAIT · ชะลอและทบทวน 🌙',
            label: 'ชะลอก่อน • รอจังหวะที่เหมาะสมกว่านี้',
            advice: 'อย่าเพิ่งรีบตัดสินใจด้วยอารมณ์ ถอยมาตั้งสติและเก็บข้อมูลเพิ่มอีกนิด',
            hex: '#F43F5E'
        };
    }
    return {
        code: 'LIKELY',
        badge: 'LIKELY · สำเร็จได้ด้วยความตั้งใจ 🌟',
        label: 'มีโอกาสเป็นไปได้ • ขึ้นอยู่กับการลงมือทำ',
        advice: 'ผลลัพธ์อยู่ในมือคุณ หากวางแผนให้รัดกุมและค่อยเป็นค่อยไปจะผ่านไปได้ด้วยดี',
        hex: '#F59E0B'
    };
}

/**
 * บันทึกประวัติการเปิดไพ่ (ทั้งไพ่ประจำวันและไพ่ส่วนตัว) ลง localStorage
 */
export function saveReadingToHistory(entry) {
    if (!entry || !entry.cardId) return;
    try {
        const list = getReadingHistory();
        const thaiDate = entry.date || getThaiDateString();
        const displayDate = entry.displayDate || formatThaiDateDisplay();

        // ป้องกันการบันทึกซ้ำสำหรับไพ่ประจำวันในวันเดียวกัน หรือไพ่ส่วนตัวเซสชันเดียวกัน
        const filtered = list.filter(item => {
            if (entry.type === 'daily' && item.type === 'daily' && item.date === thaiDate) {
                return false;
            }
            if (entry.sessionId && item.sessionId === entry.sessionId) {
                return false;
            }
            return true;
        });

        const newRecord = {
            id: entry.sessionId || `${entry.type || 'reading'}-${thaiDate}-${Date.now()}`,
            sessionId: entry.sessionId || null,
            type: entry.type || 'personal', // 'daily' | 'personal'
            spreadMode: entry.spreadMode || 'single',
            category: entry.category || 'daily',
            categoryLabel: entry.categoryLabel || getCategoryLabel(entry.category || 'daily'),
            questionText: entry.questionText || 'ไพ่นำทางประจำวัน',
            cardId: entry.cardId,
            cardIds: Array.isArray(entry.cardIds) ? entry.cardIds : [entry.cardId],
            cardNameTh: entry.cardNameTh || '',
            cardNameEn: entry.cardNameEn || '',
            summary: entry.summary || '',
            date: thaiDate,
            displayDate,
            timestamp: Date.now()
        };

        filtered.unshift(newRecord);
        const trimmed = filtered.slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
        return newRecord;
    } catch (_) {
        return null;
    }
}

/**
 * ดึงรายการประวัติการเปิดไพ่ทั้งหมด
 */
export function getReadingHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
        return [];
    }
}

/**
 * ล้างประวัติการเปิดไพ่ทั้งหมด
 */
export function clearReadingHistory() {
    try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (_) {}
}

export function getCategoryLabel(category) {
    const map = {
        daily: '☀️ ไพ่ประจำวัน',
        work: '💼 การงาน',
        finance: '🪙 การเงิน',
        love: '💖 ความรัก'
    };
    return map[category] || '🔮 ไพ่ทาโรต์';
}

/**
 * แสดง Toast แจ้งเตือนแบบลอยด้านล่างหน้าจอ
 */
export function showToast(message) {
    if (typeof document === 'undefined') return;
    let existing = document.getElementById('tarot-toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'tarot-toast-notification';
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#231230]/95 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-xl border border-amber-300/60 flex items-center gap-2 transition-all duration-300';
    toast.innerHTML = `<span class="text-amber-400">✦</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

/**
 * แชร์ผลคำทำนายผ่าน Web Share API หรือคัดลอกลง Clipboard
 */
export async function shareTarotReading({ title, text, url }) {
    const shareUrl = url || window.location.href;
    const fullText = `${title}\n${text}\n\n✦ ดูไพ่ทาโรต์ของคุณที่: ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            await navigator.share({
                title,
                text: `${title}\n${text}`,
                url: shareUrl
            });
            showToast('แชร์คำทำนายสำเร็จแล้ว ✨');
            return true;
        } catch (err) {
            if (err && err.name === 'AbortError') return false;
        }
    }

    try {
        await navigator.clipboard.writeText(fullText);
        showToast('คัดลอกคำทำนายลงคลิปบอร์ดแล้ว ส่งต่อให้เพื่อนได้เลย ✨');
        return true;
    } catch (_) {
        showToast('พร้อมแชร์คำทำนายของคุณแล้ว ✨');
        return false;
    }
}

/**
 * สร้างภาพวอลเปเปอร์มงคล 1080x1920 (Canvas Data URL) จากไพ่ Masterpiece ที่เปิดได้
 */
export async function generateCardWallpaperDataUrl({
    card,
    heading = 'ไพ่นำทางประจำตัว',
    affirmation = 'ทุกก้าวที่เดินด้วยสติ คือจุดเริ่มต้นของความสำเร็จและโชคชะตาที่ดีกว่า',
    luckyColorName = 'สีทองอร่าม & ม่วงมนตรา',
    luckyColorHex = '#D97706',
    wallpaperTitle = 'วอลเปเปอร์เสริมพลังมงคล'
}) {
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. วาดพื้นหลังไล่เฉดสีราตรีมนตราผสมออร่าสีมงคล
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#170B26');
    bgGrad.addColorStop(0.45, '#26133D');
    bgGrad.addColorStop(1, '#12081C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // รัศมีวงกลมสีมงคลตรงกลาง
    const auraGrad = ctx.createRadialGradient(W / 2, H * 0.44, 60, W / 2, H * 0.44, 580);
    auraGrad.addColorStop(0, `${luckyColorHex}66`);
    auraGrad.addColorStop(0.55, '#F59E0B22');
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. กรอบทองคำ 2 ชั้นรอบวอลเปเปอร์
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(42, 42, W - 84, H - 84);

    ctx.strokeStyle = 'rgba(245, 208, 111, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, W - 116, H - 116);

    // ดวงดาวประดับมุมและฉากหลัง
    ctx.fillStyle = '#FEF08A';
    const starCoords = [
        [120, 160, 3], [960, 175, 2.5], [150, 420, 2], [930, 440, 3],
        [110, 1300, 2.5], [970, 1280, 3], [190, 1680, 2], [890, 1700, 2.5]
    ];
    starCoords.forEach(([sx, sy, sr]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    });

    // 3. ส่วนหัวด้านบน
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 28px "Outfit", "Mitr", sans-serif';
    ctx.fillText(`✦ ${wallpaperTitle.toUpperCase()} ✦`, W / 2, 135);

    ctx.fillStyle = '#E9D5FF';
    ctx.font = '400 24px "Mitr", sans-serif';
    ctx.fillText(heading, W / 2, 180);

    // 4. โหลดและวาดภาพไพ่ Masterpiece ตรงกลาง
    const cardSrc = APPROVED_CARD_ASSETS[card?.id] || 'assets/cards/standard/major-1.jpg';
    const cardW = 580;
    const cardH = 870;
    const cardX = (W - cardW) / 2;
    const cardY = 230;

    // กรอบเรืองแสงหลังไพ่
    ctx.save();
    ctx.shadowColor = luckyColorHex || '#F59E0B';
    ctx.shadowBlur = 45;
    ctx.fillStyle = '#2A1642';
    roundRect(ctx, cardX - 8, cardY - 8, cardW + 16, cardH + 16, 28);
    ctx.fill();
    ctx.restore();

    try {
        const img = await loadImageElement(cardSrc);
        ctx.save();
        roundRect(ctx, cardX, cardY, cardW, cardH, 22);
        ctx.clip();
        ctx.drawImage(img, cardX, cardY, cardW, cardH);
        ctx.restore();
    } catch (_) {
        ctx.fillStyle = '#2D1948';
        roundRect(ctx, cardX, cardY, cardW, cardH, 22);
        ctx.fill();
    }

    // เส้นขอบทองรอบไพ่
    ctx.strokeStyle = '#F6E05E';
    ctx.lineWidth = 5;
    roundRect(ctx, cardX, cardY, cardW, cardH, 22);
    ctx.stroke();

    // 5. ชื่อไพ่ภาษาไทยและอังกฤษใต้ภาพไพ่
    const nameTh = card?.name_th || card?.thai_name || card?.name || 'ไพ่ทาโรต์มงคล';
    const nameEn = (card?.name_en || card?.name || '').toUpperCase();

    ctx.fillStyle = '#FFFBEB';
    ctx.font = '600 46px "Mitr", sans-serif';
    ctx.fillText(nameTh, W / 2, 1185);

    ctx.fillStyle = '#FCD34D';
    ctx.font = '700 26px "Outfit", sans-serif';
    ctx.fillText(nameEn, W / 2, 1230);

    // 6. กล่องข้อความเสริมพลังใจ (Affirmation Box)
    const boxX = 95;
    const boxY = 1285;
    const boxW = W - 190;
    const boxH = 310;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 28);
    ctx.fill();

    ctx.strokeStyle = 'rgba(246, 224, 94, 0.5)';
    ctx.lineWidth = 2;
    roundRect(ctx, boxX, boxY, boxW, boxH, 28);
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = '500 25px "Mitr", sans-serif';
    ctx.fillText('“ ข้อคิดและพลังงานนำทาง ”', W / 2, boxY + 55);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '400 30px "Mitr", sans-serif';
    wrapText(ctx, affirmation, W / 2, boxY + 115, boxW - 90, 46, 3);

    // 7. แถบสีมงคลประจำคำทำนาย
    const pillY = 1650;
    ctx.fillStyle = 'rgba(18, 8, 28, 0.75)';
    roundRect(ctx, W / 2 - 290, pillY, 580, 68, 34);
    ctx.fill();
    ctx.strokeStyle = luckyColorHex || '#F59E0B';
    ctx.lineWidth = 3;
    roundRect(ctx, W / 2 - 290, pillY, 580, 68, 34);
    ctx.stroke();

    // จุดวงกลมสีมงคล
    ctx.beginPath();
    ctx.arc(W / 2 - 220, pillY + 34, 15, 0, Math.PI * 2);
    ctx.fillStyle = luckyColorHex || '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FEF9C3';
    ctx.font = '500 25px "Mitr", sans-serif';
    ctx.fillText(`พลังสีมงคล: ${luckyColorName}`, W / 2 + 20, pillY + 43);

    // 8. ลายน้ำแบรนด์ด้านล่างสุด
    ctx.fillStyle = 'rgba(233, 213, 255, 0.75)';
    ctx.font = '600 22px "Outfit", "Mitr", sans-serif';
    ctx.fillText('✦ MONEY2 · THAI TAROT · MOON RABBIT ✦', W / 2, 1815);

    return canvas.toDataURL('image/png');
}

/**
 * สร้างภาพการ์ดสรุปผลทำนาย (รองรับทั้งโหมดไพ่ 3 ใบเรียงกัน และ 1 ใบฟันธง) ขนาด 1080x1920 สำหรับแชร์ลง IG Story / TikTok
 */
export async function generateStorySpreadDataUrl({
    cards = [],
    slots = ['อดีต / ที่มา', 'ปัจจุบัน / ตอนนี้', 'อนาคต / แนวโน้ม'],
    spreadSummaries = [],
    spreadTitle = 'สรุปผลคำทำนายไพ่ทาโรต์',
    questionLabel = 'คำถามของคุณ',
    verdict = null,
    actionText = 'ตั้งสติและก้าวเดินอย่างมั่นใจ',
    luckyColorName = 'สีทองมงคล',
    luckyColorHex = '#D97706'
}) {
    if (typeof document === 'undefined' || !cards.length) return null;

    const canvas = document.createElement('canvas');
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. พื้นหลัง Cosmic Royal Purple & Gold
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#140824');
    bgGrad.addColorStop(0.5, '#271242');
    bgGrad.addColorStop(1, '#10061B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const aura = ctx.createRadialGradient(W / 2, 560, 50, W / 2, 560, 620);
    aura.addColorStop(0, `${luckyColorHex}55`);
    aura.addColorStop(0.6, '#9333EA22');
    aura.addColorStop(1, 'transparent');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);

    // กรอบทอง 2 ชั้น
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(38, 38, W - 76, H - 76);
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, W - 108, H - 108);

    // 2. ส่วนหัว Story Card
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FDE68A';
    ctx.font = '700 26px "Outfit", "Mitr", sans-serif';
    ctx.fillText(`✦ ${spreadTitle.toUpperCase()} ✦`, W / 2, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 34px "Mitr", sans-serif';
    wrapText(ctx, `“${questionLabel}”`, W / 2, 172, W - 160, 44, 2);

    // 3. วาดไพ่ (กรณี 3 ใบเรียงกัน หรือ 1 ใบตรงกลาง)
    if (cards.length >= 3) {
        const cardW = 284;
        const cardH = 426;
        const gap = 36;
        const startX = (W - (cardW * 3 + gap * 2)) / 2;
        const cardY = 290;

        for (let i = 0; i < 3; i++) {
            const c = cards[i];
            const slotLabel = slots[i] || `ใบที่ ${i + 1}`;
            const x = startX + i * (cardW + gap);
            const centerX = x + cardW / 2;

            // ป้ายตำแหน่งไพ่ด้านบน
            ctx.fillStyle = 'rgba(253, 230, 138, 0.16)';
            roundRect(ctx, x + 22, cardY - 52, cardW - 44, 38, 19);
            ctx.fill();
            ctx.strokeStyle = '#FCD34D';
            ctx.lineWidth = 1.5;
            roundRect(ctx, x + 22, cardY - 52, cardW - 44, 38, 19);
            ctx.stroke();

            ctx.fillStyle = '#FEF08A';
            ctx.font = '600 20px "Mitr", sans-serif';
            ctx.fillText(`${i + 1}. ${slotLabel}`, centerX, cardY - 26);

            // รูปไพ่
            const src = APPROVED_CARD_ASSETS[c?.id] || 'assets/cards/standard/major-1.jpg';
            try {
                const img = await loadImageElement(src);
                ctx.save();
                roundRect(ctx, x, cardY, cardW, cardH, 16);
                ctx.clip();
                ctx.drawImage(img, x, cardY, cardW, cardH);
                ctx.restore();
            } catch (_) {
                ctx.fillStyle = '#2D1948';
                roundRect(ctx, x, cardY, cardW, cardH, 16);
                ctx.fill();
            }

            ctx.strokeStyle = '#F6E05E';
            ctx.lineWidth = 4;
            roundRect(ctx, x, cardY, cardW, cardH, 16);
            ctx.stroke();

            // ชื่อไพ่ใต้แต่ละใบ
            const cNameTh = c?.name_th || c?.thai_name || c?.name || '';
            const cNameEn = (c?.name_en || c?.name || '').toUpperCase();
            ctx.fillStyle = '#FFFBEB';
            ctx.font = '600 24px "Mitr", sans-serif';
            ctx.fillText(cNameTh, centerX, cardY + cardH + 38);

            ctx.fillStyle = '#FCD34D';
            ctx.font = '600 16px "Outfit", sans-serif';
            ctx.fillText(cNameEn, centerX, cardY + cardH + 64);
        }

        // 4. กล่องสรุปคำทำนาย 3 ตำแหน่ง
        let boxY = 815;
        for (let i = 0; i < 3; i++) {
            const c = cards[i];
            const slotLabel = slots[i] || `ใบที่ ${i + 1}`;
            const sumText = spreadSummaries[i] || c?.meaning_upright || '';

            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            roundRect(ctx, 78, boxY, W - 156, 195, 22);
            ctx.fill();
            ctx.strokeStyle = 'rgba(246, 224, 94, 0.4)';
            ctx.lineWidth = 1.5;
            roundRect(ctx, 78, boxY, W - 156, 195, 22);
            ctx.stroke();

            ctx.fillStyle = '#FDE68A';
            ctx.font = '600 23px "Mitr", sans-serif';
            ctx.fillText(`✦ ${slotLabel} — ${c?.name_th || c?.name || ''}`, W / 2, boxY + 42);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '400 23px "Mitr", sans-serif';
            wrapText(ctx, sumText, W / 2, boxY + 86, W - 220, 36, 3);

            boxY += 215;
        }
    } else {
        // กรณี 1 ใบฟันธง
        const c = cards[0];
        const cardW = 420;
        const cardH = 630;
        const cardX = (W - cardW) / 2;
        const cardY = 245;

        const src = APPROVED_CARD_ASSETS[c?.id] || 'assets/cards/standard/major-1.jpg';
        try {
            const img = await loadImageElement(src);
            ctx.save();
            roundRect(ctx, cardX, cardY, cardW, cardH, 20);
            ctx.clip();
            ctx.drawImage(img, cardX, cardY, cardW, cardH);
            ctx.restore();
        } catch (_) {
            ctx.fillStyle = '#2D1948';
            roundRect(ctx, cardX, cardY, cardW, cardH, 20);
            ctx.fill();
        }

        ctx.strokeStyle = '#F6E05E';
        ctx.lineWidth = 4;
        roundRect(ctx, cardX, cardY, cardW, cardH, 20);
        ctx.stroke();

        ctx.fillStyle = '#FFFBEB';
        ctx.font = '600 38px "Mitr", sans-serif';
        ctx.fillText(c?.name_th || c?.name || '', W / 2, 930);

        ctx.fillStyle = '#FCD34D';
        ctx.font = '700 22px "Outfit", sans-serif';
        ctx.fillText((c?.name_en || c?.name || '').toUpperCase(), W / 2, 968);

        // กล่องคำทำนายหลัก
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        roundRect(ctx, 78, 1015, W - 156, 420, 26);
        ctx.fill();
        ctx.strokeStyle = 'rgba(246, 224, 94, 0.45)';
        ctx.lineWidth = 2;
        roundRect(ctx, 78, 1015, W - 156, 420, 26);
        ctx.stroke();

        ctx.fillStyle = '#FDE68A';
        ctx.font = '600 26px "Mitr", sans-serif';
        ctx.fillText(verdict ? verdict.label : '✦ คำทำนายฟันธง ✦', W / 2, 1075);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '400 27px "Mitr", sans-serif';
        wrapText(ctx, spreadSummaries[0] || c?.meaning_upright || '', W / 2, 1140, W - 220, 44, 5);
    }

    // 5. กล่องก้าวต่อไป + แถบสีมงคลด้านล่าง
    const footerBoxY = 1475;
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    roundRect(ctx, 78, footerBoxY, W - 156, 155, 22);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    roundRect(ctx, 78, footerBoxY, W - 156, 155, 22);
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.font = '600 23px "Mitr", sans-serif';
    ctx.fillText('🧭 ก้าวต่อไปที่แนะนำ', W / 2, footerBoxY + 42);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '400 24px "Mitr", sans-serif';
    wrapText(ctx, actionText, W / 2, footerBoxY + 86, W - 210, 36, 2);

    // แถบสีมงคล
    const pillY = 1665;
    ctx.fillStyle = 'rgba(18, 8, 28, 0.85)';
    roundRect(ctx, W / 2 - 290, pillY, 580, 64, 32);
    ctx.fill();
    ctx.strokeStyle = luckyColorHex || '#F59E0B';
    ctx.lineWidth = 3;
    roundRect(ctx, W / 2 - 290, pillY, 580, 64, 32);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2 - 220, pillY + 32, 14, 0, Math.PI * 2);
    ctx.fillStyle = luckyColorHex || '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FEF9C3';
    ctx.font = '500 24px "Mitr", sans-serif';
    ctx.fillText(`พลังสีมงคล: ${luckyColorName}`, W / 2 + 20, pillY + 40);

    ctx.fillStyle = 'rgba(233, 213, 255, 0.8)';
    ctx.font = '600 22px "Outfit", "Mitr", sans-serif';
    ctx.fillText('✦ MONEY2 · THAI TAROT · IG STORY SUMMARY ✦', W / 2, 1815);

    return canvas.toDataURL('image/png');
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function wrapText(ctx, text, x, startY, maxWidth, lineHeight, maxLines = 3) {
    const cleanText = String(text || '').trim();
    const chars = Array.from(cleanText);
    let line = '';
    const lines = [];

    for (let i = 0; i < chars.length; i++) {
        const testLine = line + chars[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
            lines.push(line.trim());
            line = chars[i];
            if (lines.length >= maxLines - 1) {
                const rest = chars.slice(i).join('');
                let finalLine = rest;
                while (ctx.measureText(finalLine + '…').width > maxWidth && finalLine.length > 0) {
                    finalLine = finalLine.slice(0, -1);
                }
                line = finalLine + (finalLine.length < rest.length ? '…' : '');
                break;
            }
        } else {
            line = testLine;
        }
    }
    if (line) lines.push(line.trim());

    lines.forEach((l, idx) => {
        ctx.fillText(l, x, startY + idx * lineHeight);
    });
}
