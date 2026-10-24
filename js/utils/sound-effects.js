import { openTarotGuideModal } from './streak-and-guide.js';
import { enhanceAdSlots } from '../ui/monetization-ui.js';

const SOUND_MUTE_KEY = 'tarot_sound_muted';

let audioCtx = null;

function getAudioContext() {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
        try {
            audioCtx = new AudioContextClass();
        } catch (_) {
            return null;
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

export function isSoundMuted() {
    try {
        return localStorage.getItem(SOUND_MUTE_KEY) === 'true';
    } catch (_) {
        return false;
    }
}

export function setSoundMuted(muted) {
    try {
        localStorage.setItem(SOUND_MUTE_KEY, muted ? 'true' : 'false');
    } catch (_) {}
    updateSoundButtonsUI();
}

export function toggleSoundMuted() {
    const next = !isSoundMuted();
    setSoundMuted(next);
    if (!next) {
        playCardTap();
    }
    return next;
}

/**
 * เสียงแตะเลือกไพ่ (Soft Mystical Tap)
 */
export function playCardTap() {
    if (isSoundMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.065);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    } catch (_) {}
}

/**
 * เสียงกระดิ่งคริสตัล / ขันทิเบต (Crystal Singing Bowl Chime) ตอนเริ่มทำสมาธิ
 */
export function playCrystalChime() {
    if (isSoundMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const freqs = [528, 792, 1056]; // Solfeggio 528Hz harmonic triad
        freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            const peak = 0.07 / (idx + 1);
            gain.gain.setValueAtTime(0.001, now + idx * 0.06);
            gain.gain.linearRampToValueAtTime(peak, now + idx * 0.06 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.4 + idx * 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.06);
            osc.stop(now + 1.6 + idx * 0.15);
        });
    } catch (_) {}
}

/**
 * เสียงพลิกเปิดไพ่แห่งโชคชะตา (Mystical Reveal Arpeggio)
 */
export function playCardFlip() {
    if (isSoundMuted()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // A4 major celestial shimmer
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            const start = now + idx * 0.055;
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(0.065, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.6);
        });
    } catch (_) {}
}

function updateSoundButtonsUI() {
    if (typeof document === 'undefined') return;
    const muted = isSoundMuted();
    document.querySelectorAll('.tarot-sound-toggle-btn').forEach(btn => {
        btn.setAttribute('aria-pressed', muted ? 'false' : 'true');
        btn.title = muted ? 'เปิดเสียงเอฟเฟกต์ไพ่' : 'ปิดเสียงเอฟเฟกต์ไพ่';
        btn.innerHTML = muted
            ? '<span class="text-xs leading-none" aria-hidden="true">🔇</span>'
            : '<span class="text-xs leading-none" aria-hidden="true">🔊</span>';
    });
}

/**
 * สร้างปุ่มเปิด/ปิดเสียงเอฟเฟกต์ + ปุ่มคู่มือดูไพ่ 30 วิ ในแถบ Header ของทุกหน้า + แปลงแบนเนอร์โปรโมต + ลงทะเบียน PWA
 */
export function initSoundAndPwa() {
    if (typeof document === 'undefined') return;

    // หาแถวปุ่มด้านขวาใน Header (รองรับทั้ง index.html และหน้าย่อย)
    const headerRight =
        document.querySelector('header .flex.items-center.gap-1\\.5') ||
        document.querySelector('header > div:last-child');

    if (headerRight) {
        // 1. ปุ่มเปิดคู่มือดูไพ่ฉบับเข้าใจง่ายใน 30 วินาที
        if (!headerRight.querySelector('.tarot-guide-toggle-btn')) {
            const guideBtn = document.createElement('button');
            guideBtn.type = 'button';
            guideBtn.className = 'icon-btn-frosted tarot-guide-toggle-btn cursor-pointer';
            guideBtn.title = 'คู่มืออ่านไพ่เข้าใจง่ายใน 30 วินาที';
            guideBtn.setAttribute('aria-label', 'คู่มืออ่านไพ่เข้าใจง่าย');
            guideBtn.innerHTML = '<span class="text-xs leading-none" aria-hidden="true">📖</span>';
            guideBtn.addEventListener('click', () => {
                openTarotGuideModal();
            });
            headerRight.insertBefore(guideBtn, headerRight.firstChild);
        }

        // 2. ปุ่มเปิด/ปิดเสียงเอฟเฟกต์
        if (!headerRight.querySelector('.tarot-sound-toggle-btn')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'icon-btn-frosted tarot-sound-toggle-btn cursor-pointer';
            btn.setAttribute('aria-label', 'เปิดหรือปิดเสียงเอฟเฟกต์');
            btn.addEventListener('click', () => {
                toggleSoundMuted();
            });
            headerRight.insertBefore(btn, headerRight.firstChild);
        }
    }
    updateSoundButtonsUI();

    // 3. แปลงกล่อง AdSense สีเทาให้เป็นแบนเนอร์โปรโมตที่ทำรายได้จริง
    try {
        enhanceAdSlots();
    } catch (_) {}

    // 4. Register PWA Service Worker
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }
}
