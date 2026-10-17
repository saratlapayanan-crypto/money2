import { APPROVED_CARD_ASSETS } from '../art/fronts.js';
import { formatThaiDateDisplay, getThaiDateString } from './timezone.js';

const HISTORY_STORAGE_KEY = 'tarot_reading_history_v1';
const MAX_HISTORY_ITEMS = 15;

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
            category: entry.category || 'daily',
            categoryLabel: entry.categoryLabel || getCategoryLabel(entry.category || 'daily'),
            questionText: entry.questionText || 'ไพ่นำทางประจำวัน',
            cardId: entry.cardId,
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
        // Fallback art box if image cannot be drawn
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
    // ตัดคำภาษาไทยแบบอิงความกว้างตัวอักษร
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
                // บรรทัดสุดท้าย
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
