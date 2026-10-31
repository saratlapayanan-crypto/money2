/* ================================================================
   Mystic Extras — เลขมงคลประจำไพ่, ทิศและช่วงเวลานำโชค, บทอธิษฐานเสริมดวง
   และระบบเสียงอ่านคำทำนายภาษาไทย (Web Speech API Text-to-Speech)
   ================================================================ */

const SUIT_SEED = {
    major: 9,
    wands: 1,
    cups: 2,
    swords: 7,
    pentacles: 8
};

const SUIT_TIMING = {
    major: {
        direction_th: 'ทิศเหนือ หรือ ทิศตะวันออกเฉียงเหนือ',
        powerHour_th: '09:09 – 11:11 น. และ 19:19 – 21:00 น.',
        activity_th: 'เหมาะสำหรับการตัดสินใจครั้งสำคัญ เริ่มต้นโปรเจกต์ใหม่ หรือขอพรเรื่องใหญ่'
    },
    wands: {
        direction_th: 'ทิศใต้ หรือ ทิศตะวันออก',
        powerHour_th: '08:30 – 10:30 น. และ 13:00 – 15:00 น.',
        activity_th: 'เหมาะกับการเสนองาน สมัครงาน ลุยเจรจาธุรกิจ และเริ่มต้นลงมือทำทันที'
    },
    cups: {
        direction_th: 'ทิศตะวันตก หรือ ทิศเหนือ',
        powerHour_th: '10:00 – 12:00 น. และ 20:00 – 22:00 น.',
        activity_th: 'เหมาะกับการทักแชทหาคนที่ชอบ ปรับความเข้าใจ ขอความช่วยเหลือ หรือสร้างมิตรภาพ'
    },
    swords: {
        direction_th: 'ทิศตะวันตกเฉียงเหนือ หรือ ทิศตะวันออก',
        powerHour_th: '07:30 – 09:30 น. และ 14:00 – 16:00 น.',
        activity_th: 'เหมาะกับการวางแผนกลยุทธ์ เคลียร์ปัญหาค้างคา ตรวจสอบสัญญา และตัดสินใจด้วยเหตุผล'
    },
    pentacles: {
        direction_th: 'ทิศตะวันออกเฉียงใต้ หรือ ทิศใต้',
        powerHour_th: '09:19 – 11:45 น. และ 15:30 – 17:30 น.',
        activity_th: 'เหมาะกับการเจรจาเรื่องเงิน ปิดการขาย โอนเงินออม วางแผนลงทุน และเปิดรับโชคลาภ'
    }
};

const NUMBER_MEANINGS = [
    'พลังแห่งอิสระ การเริ่มต้นใหม่ และโอกาสที่คาดไม่ถึง',
    'พลังแห่งความเป็นผู้นำ ความคิดสร้างสรรค์ และความสำเร็จก้าวแรก',
    'พลังแห่งความอ่อนโยน เสน่ห์เมตตามหานิยม และคนรักเกื้อหนุน',
    'พลังแห่งความกระตือรือร้น ชัยชนะ และการเติบโตอย่างก้าวกระโดด',
    'พลังแห่งการเจรจาค้าขาย ความมั่นคง และการจัดการที่เฉียบคม',
    'พลังแห่งปัญญา ความยุติธรรม และผู้ใหญ่เมตตาอุปถัมภ์',
    'พลังแห่งความรัก ความสุขสมหวัง และศิลปะแห่งการดึงดูดสิ่งดีงาม',
    'พลังแห่งความมุ่งมั่น อดทน และการพลิกฟื้นสถานการณ์สู่ความสำเร็จ',
    'พลังแห่งความมั่งคั่ง โชคลาภก้อนใหญ่ และการหมุนเวียนทางการเงิน',
    'พลังแห่งสิ่งศักดิ์สิทธิ์คุ้มครอง ความก้าวหน้ารุ่งเรือง และความสำเร็จสมบูรณ์'
];

/**
 * คำนวณเลขมงคลประจำหน้าไพ่ (Deterministic จากรหัสไพ่และวันที่)
 */
export function calculateLuckyNumbers(card, dateStr = '') {
    const num = Number(card?.number ?? 0);
    const key = card?.arcana === 'major' ? 'major' : (card?.suit || 'major');
    const suitDigit = SUIT_SEED[key] || 9;

    let dateSeed = 0;
    if (dateStr) {
        for (let i = 0; i < dateStr.length; i++) {
            dateSeed = (dateSeed + dateStr.charCodeAt(i)) % 9;
        }
    }

    const d1 = (num + suitDigit) % 10;
    const d2 = (num * 3 + suitDigit + dateSeed + 5) % 10;
    const d3 = (num + suitDigit * 2 + dateSeed + 8) % 10 === d1
        ? (d1 + 4) % 10
        : (num + suitDigit * 2 + dateSeed + 8) % 10;

    const pair1 = `${d1}${d2}`;
    const pair2 = `${d2}${d3}`;
    const pair3 = `${d3}${d1 === d3 ? (d1 + 5) % 10 : d1}`;
    const triple1 = `${d1}${d2}${d3}`;
    const triple2 = `${suitDigit}${d1}${d3}`;

    return {
        primaryDigit: d1,
        twoDigits: [pair1, pair2, pair3],
        threeDigits: [triple1, triple2],
        meaning_th: NUMBER_MEANINGS[d1] || NUMBER_MEANINGS[9]
    };
}

/**
 * คำนวณทิศมงคลและช่วงเวลานำโชคประจำหน้าไพ่
 */
export function calculateAuspiciousTiming(card) {
    const key = card?.arcana === 'major' ? 'major' : (card?.suit || 'major');
    return SUIT_TIMING[key] || SUIT_TIMING.major;
}

/**
 * บทอธิษฐานตั้งจิตเสริมพลังบวก (Mindful Affirmation Mantra) ตามหมวดคำถาม
 */
export function getMindfulMantra(category = 'daily', card = null) {
    const cardName = card?.name_th || card?.thai_name || card?.name || 'ไพ่ทาโรต์';
    const mantras = {
        love: {
            title_th: '💖 บทอธิษฐานเปิดรับความรักและเมตตามหานิยม',
            chant_th: `“ด้วยพลังบวกแห่งไพ่${cardName} ขอให้หัวใจของฉันเปี่ยมด้วยคุณค่า ดึงดูดความรักที่จริงใจ ซื่อสัตย์ และเกื้อกูลกัน ให้ทุกความสัมพันธ์เต็มไปด้วยความเข้าใจและความสุข”`,
            tip_th: 'แนะนำให้อ่านออกเสียงเบาๆ หรือท่องในใจ 1 จบก่อนทักแชทหรือพบเจอคนสำคัญ'
        },
        finance: {
            title_th: '💰 บทอธิษฐานเปิดทางทรัพย์และโชคลาภการเงิน',
            chant_th: `“ด้วยพลังนำทางแห่งไพ่${cardName} ขอให้ประตูแห่งโอกาสและทรัพย์สินเปิดกว้าง เงินทองไหลมาเทมาจากการลงมือทำและสติปัญญา มีกินมีใช้มั่งคั่งและมั่นคง”`,
            tip_th: 'แนะนำให้ตั้งจิตอธิษฐานก่อนเปิดกระเป๋าสตางค์ โอนเงิน หรือเริ่มเจรจาเรื่องผลประโยชน์'
        },
        work: {
            title_th: '💼 บทอธิษฐานเสริมความก้าวหน้าและผู้ใหญ่อุปถัมภ์',
            chant_th: `“ด้วยพลังสร้างสรรค์แห่งไพ่${cardName} ขอให้สติปัญญาของฉันปลอดโปร่ง แก้ไขทุกอุปสรรคได้อย่างราบรื่น มีกัลยาณมิตรและผู้ใหญ่เมตตาสนับสนุนสู่ความสำเร็จ”`,
            tip_th: 'แนะนำให้สูดหายใจลึกๆ และตั้งจิตก่อนเริ่มงาน ประชุม หรือส่งใบสมัครงาน'
        },
        daily: {
            title_th: '☀️ บทอธิษฐานรับพลังมงคลประจำวัน',
            chant_th: `“วันนี้ฉันพร้อมเปิดรับพลังงานดีๆ จากไพ่${cardName} ขอให้ทุกก้าวที่เดินเต็มไปด้วยสติ ความสบายใจ โชคดี และรอยยิ้มตลอดทั้งวัน”`,
            tip_th: 'ท่องในใจพร้อมรอยยิ้มก่อนก้าวออกจากบ้านเพื่อรีเซ็ตพลังงานให้สดใส'
        }
    };

    return mantras[category] || mantras.daily;
}

let activeUtterance = null;

/**
 * อ่านออกเสียงคำทำนายภาษาไทยด้วย Web Speech API (รองรับปุ่มกดเล่น/หยุด)
 */
export function toggleSpeakThaiReading(text, onStateChange) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onStateChange) onStateChange(false, 'unsupported');
        return false;
    }

    try {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            activeUtterance = null;
            if (onStateChange) onStateChange(false, 'stopped');
            return false;
        }

        const cleanText = String(text || '')
            .replace(/[✦✨🔮🪞⚠️🧭🌟💖💰💼☀️🔥]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanText) return false;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'th-TH';
        utterance.rate = 0.98;
        utterance.pitch = 1.02;

        const voices = window.speechSynthesis.getVoices?.() || [];
        const thaiVoice = voices.find(v => v.lang && v.lang.toLowerCase().includes('th'));
        if (thaiVoice) {
            utterance.voice = thaiVoice;
        }

        utterance.onstart = () => {
            if (onStateChange) onStateChange(true, 'speaking');
        };
        utterance.onend = () => {
            activeUtterance = null;
            if (onStateChange) onStateChange(false, 'ended');
        };
        utterance.onerror = () => {
            activeUtterance = null;
            if (onStateChange) onStateChange(false, 'error');
        };

        activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        if (onStateChange) onStateChange(true, 'speaking');
        return true;
    } catch (_) {
        if (onStateChange) onStateChange(false, 'error');
        return false;
    }
}
