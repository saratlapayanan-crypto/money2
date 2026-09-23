/**
 * Thai Astrological Daily Lucky Colors & Outfit Styling Algorithm
 * มนตราสีมงคลประจำวันและสูตรสัดส่วนการแต่งกายตามพลังไพ่
 */

export const DAYS_OF_WEEK = Object.freeze([
    { id: 0, name_th: 'วันอาทิตย์', name_en: 'Sunday', planet: 'พระอาทิตย์', base_color: '#E74C3C' },
    { id: 1, name_th: 'วันจันทร์', name_en: 'Monday', planet: 'พระจันทร์', base_color: '#F1C40F' },
    { id: 2, name_th: 'วันอังคาร', name_en: 'Tuesday', planet: 'พระอังคาร', base_color: '#E84393' },
    { id: 3, name_th: 'วันพุธ', name_en: 'Wednesday', planet: 'พระพุธ', base_color: '#27AE60' },
    { id: 4, name_th: 'วันพฤหัสบดี', name_en: 'Thursday', planet: 'พระพฤหัสบดี', base_color: '#E67E22' },
    { id: 5, name_th: 'วันศุกร์', name_en: 'Friday', planet: 'พระศุกร์', base_color: '#3498DB' },
    { id: 6, name_th: 'วันเสาร์', name_en: 'Saturday', planet: 'พระเสาร์', base_color: '#8E44AD' }
]);

export const LUCKY_COLOR_TABLE = Object.freeze({
    // 0: วันอาทิตย์
    0: {
        work: [
            { name: 'สีส้มแสด', hex: '#E67E22', note: 'เสริมอำนาจ ความเป็นผู้นำ และการตัดสินใจ' },
            { name: 'สีเทาควันบุหรี่', hex: '#7F8C8D', note: 'เพิ่มความสุขุมรอบคอบและการเจรจา' }
        ],
        finance: [
            { name: 'สีเขียวมรกต', hex: '#27AE60', note: 'ดึงดูดทรัพย์ โชคลาภ และกระแสเงินคล่องมือ' },
            { name: 'สีม่วงเปลือกมังคุด', hex: '#8E44AD', note: 'เหนี่ยวทรัพย์ก้อนโตและลาภลอย' }
        ],
        love: [
            { name: 'สีชมพูกลีบบัว', hex: '#E84393', note: 'เมตตามหานิยม คนเอ็นดู มีเสน่ห์จับใจ' },
            { name: 'สีดำสนิท', hex: '#2C3E50', note: 'เสน่ห์ลึกลับน่าค้นหา ผู้ใหญ่ให้ความเกรงใจ' }
        ],
        avoid: [
            { name: 'สีฟ้า / น้ำเงิน', hex: '#2980B9', reason: 'สีกาลกิณีประจำวันอาทิตย์ ขัดขวางความราบรื่นและอาจเกิดการเข้าใจผิด' }
        ]
    },
    // 1: วันจันทร์
    1: {
        work: [
            { name: 'สีเขียวใบตอง', hex: '#2ECC71', note: 'ผู้ใหญ่สนับสนุน งานลื่นไหลไร้อุปสรรค' },
            { name: 'สีเทาอ่อน', hex: '#95A5A6', note: 'ช่วยให้มีสมาธิและการประสานงานที่ดี' }
        ],
        finance: [
            { name: 'สีส้มอิฐ', hex: '#D35400', note: 'เปิดทางรับทรัพย์ ค้าขายมีกำไรงอกงาม' },
            { name: 'สีเหลืองทองมัสตาร์ด', hex: '#F39C12', note: 'เสริมดวงการเงิน โบนัส และเงินพิเศษ' }
        ],
        love: [
            { name: 'สีฟ้าพาสเทล', hex: '#5DADE2', note: 'ความรักสดชื่น สบายใจ ไร้ความตึงเครียด' },
            { name: 'สีน้ำเงินสด', hex: '#1F618D', note: 'ความสัมพันธ์มั่นคง เป็นที่รักใคร่ของคนรอบข้าง' }
        ],
        avoid: [
            { name: 'สีแดงชาด', hex: '#C0392B', reason: 'สีกาลกิณีประจำวันจันทร์ อาจนำพาความขัดแย้งและอารมณ์ร้อน' }
        ]
    },
    // 2: วันอังคาร
    2: {
        work: [
            { name: 'สีม่วงไวโอเลต', hex: '#8E44AD', note: 'เสริมบารมี คุมบริวารได้ดี เพื่อนร่วมงานเกรงใจ' },
            { name: 'สีดำชาร์โคล', hex: '#34495E', note: 'เพิ่มความเด็ดขาด มั่นคง แก้ปัญหาเฉพาะหน้าเก่ง' }
        ],
        finance: [
            { name: 'สีส้มเข้ม', hex: '#E67E22', note: 'กระตุ้นยอดขาย เงินเข้าบัญชีไม่ขาดสาย' },
            { name: 'สีน้ำตาลคาราเมล', hex: '#A0522D', note: 'เสริมความมั่นคงทางการเงิน เก็บเงินอยู่' }
        ],
        love: [
            { name: 'สีแดงกุหลาบ', hex: '#E74C3C', note: 'เพิ่มเสน่ห์ร้อนแรง ดึงดูดความสนใจจากคนพิเศษ' }
        ],
        avoid: [
            { name: 'สีขาวงาช้าง / เหลืองอ่อน', hex: '#FAD7A0', reason: 'สีกาลกิณีประจำวันอังคาร อาจทำให้รู้สึกเหนื่อยล้าหรือเสียพลังงานโดยเปล่าประโยชน์' }
        ]
    },
    // 3: วันพุธ
    3: {
        work: [
            { name: 'สีส้มสด', hex: '#E67E22', note: 'เจรจาราบรื่น ปิดดีลง่าย ได้รับความช่วยเหลือ' },
            { name: 'สีทองประกาย', hex: '#F1C40F', note: 'ชื่อเสียงโดดเด่น ผลงานเป็นที่ประจักษ์' }
        ],
        finance: [
            { name: 'สีเทาชาร์โคล', hex: '#7F8C8D', note: 'ดวงการเงินเสถียร จัดการรายรับรายจ่ายได้ยอดเยี่ยม' },
            { name: 'สีดำสนิท', hex: '#2C3E50', note: 'ดึงดูดโอกาสทำเงินใหม่ๆ และการลงทุนที่คุ้มค่า' }
        ],
        love: [
            { name: 'สีขาวบริสุทธิ์', hex: '#FDFEFE', note: 'เสริมความเข้าอกเข้าใจ คำพูดน่าฟัง เป็นมิตร' },
            { name: 'สีครีมละมุน', hex: '#F9E79F', note: 'เพิ่มความอบอุ่น นุ่มนวล ชวนให้อยู่ใกล้' }
        ],
        avoid: [
            { name: 'สีชมพูบานเย็น', hex: '#E84393', reason: 'สีกาลกิณีประจำวันพุธ อาจทำให้สื่อสารคลาดเคลื่อนหรือไม่เข้าใจกัน' }
        ]
    },
    // 4: วันพฤหัสบดี
    4: {
        work: [
            { name: 'สีฟ้าคราม', hex: '#2980B9', note: 'วิสัยทัศน์กว้างไกล งานวางแผนราบรื่นไร้สะดุด' },
            { name: 'สีน้ำเงินเนวี', hex: '#1B4F72', note: 'สร้างความน่าเชื่อถือ ลูกค้าและหัวหน้าไว้วางใจ' }
        ],
        finance: [
            { name: 'สีแดงทับทิม', hex: '#C0392B', note: 'กระตุ้นกระแสเงิน ทรัพย์วิ่งเข้าหาอย่างทรงพลัง' }
        ],
        love: [
            { name: 'สีเขียวหยก', hex: '#27AE60', note: 'ความรักร่มเย็น สงบสุข ผูกพันเหนียวแน่น' }
        ],
        avoid: [
            { name: 'สีดำ / ม่วงเข้ม', hex: '#17202A', reason: 'สีกาลกิณีประจำวันพฤหัสบดี อาจทำให้ติดขัดเรื่องเอกสารหรือความล่าช้า' }
        ]
    },
    // 5: วันศุกร์
    5: {
        work: [
            { name: 'สีขาวมุก', hex: '#F8F9F9', note: 'ความคิดสร้างสรรค์ลื่นไหล ไอเดียแปลกใหม่ได้รับการยอมรับ' },
            { name: 'สีเหลืองพาสเทล', hex: '#F9E79F', note: 'บรรยากาศการทำงานสดใส ไร้แรงกดดัน' }
        ],
        finance: [
            { name: 'สีชมพูสดใส', hex: '#E84393', note: 'มีโชคเรื่องเงินทอง ของกำนัล หรือได้ของถูกใจ' }
        ],
        love: [
            { name: 'สีส้มพีช', hex: '#ED7D31', note: 'เสน่ห์เปล่งประกาย สดใสร่าเริง น่าเข้าหา' },
            { name: 'สีแดงสด', hex: '#E74C3C', note: 'ความรักหวานซึ้ง มีชีวิตชีวา มั่นใจในตัวเอง' }
        ],
        avoid: [
            { name: 'สีเทาเข้ม / บรอนซ์เงินหม่น', hex: '#566573', reason: 'สีกาลกิณีประจำวันศุกร์ อาจบั่นทอนความมั่นใจและความคิดสร้างสรรค์' }
        ]
    },
    // 6: วันเสาร์
    6: {
        work: [
            { name: 'สีเทาควัน', hex: '#7F8C8D', note: 'เพิ่มความอดทน มุ่งมั่น ก้าวข้ามงานยากได้สำเร็จ' },
            { name: 'สีเงินเมทัลลิก', hex: '#BDC3C7', note: 'เสริมความเฉียบขาดในการบริหารจัดการ' }
        ],
        finance: [
            { name: 'สีฟ้าสด', hex: '#3498DB', note: 'เงินทองหมุนเวียนคล่องตัว มีช่องทางทำกินเพิ่ม' },
            { name: 'สีน้ำเงินเข้ม', hex: '#1B4F72', note: 'เก็บทรัพย์สินได้เป็นกอบเป็นกำ ปลอดภัยไร้กังวล' }
        ],
        love: [
            { name: 'สีชมพูหวาน', hex: '#F1948A', note: 'ช่วยผ่อนคลายความตึงเครียด เพิ่มความเข้าใจและความอ่อนโยน' }
        ],
        avoid: [
            { name: 'สีเขียวสด', hex: '#27AE60', reason: 'สีกาลกิณีประจำวันเสาร์ อาจทำให้ต้องแบกรับภาระหนักเกินความจำเป็น' }
        ]
    }
});

/**
 * คำนวณวันในสัปดาห์ (0 = อาทิตย์, 6 = เสาร์) ตามเวลาประเทศไทย
 */
export function getDayOfWeekFromDateString(thaiDateString) {
    // thaiDateString format: YYYY-MM-DD
    if (typeof thaiDateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(thaiDateString)) {
        const [y, m, d] = thaiDateString.split('-').map(Number);
        const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        return date.getUTCDay();
    }
    return new Date().getDay();
}

/**
 * ดึงตารางสีมงคลสำหรับวันนั้นๆ
 */
export function getDailyLuckyColors(dayIndex) {
    const validIndex = Number.isInteger(dayIndex) && dayIndex >= 0 && dayIndex <= 6 ? dayIndex : 0;
    return LUCKY_COLOR_TABLE[validIndex];
}

/**
 * วิเคราะห์และสร้างสูตรผสมสีเสื้อผ้า (Outfit Styling Ratio)
 * โดยดูจากด้านที่มีคะแนนพลังงานต่ำที่สุดในวันนั้น
 *
 * @param {Object} params
 * @param {number} params.dayIndex - 0 (อาทิตย์) ถึง 6 (เสาร์)
 * @param {number} params.loveScore - 1 ถึง 5
 * @param {number} params.financeScore - 1 ถึง 5
 * @param {number} params.workScore - 1 ถึง 5
 * @returns {Object} คำแนะนำสไตล์การแต่งกาย
 */
export function calculateOutfitAdvice({ dayIndex, loveScore = 3, financeScore = 3, workScore = 3 }) {
    const dayData = DAYS_OF_WEEK.find(d => d.id === dayIndex) || DAYS_OF_WEEK[0];
    const palette = getDailyLuckyColors(dayIndex);

    // เรียงลำดับด้านจากคะแนนน้อยไปหามาก
    const scores = [
        { category: 'love', label: 'ความรัก & เสน่ห์', score: loveScore, colors: palette.love },
        { category: 'finance', label: 'การเงิน & โชคลาภ', score: financeScore, colors: palette.finance },
        { category: 'work', label: 'การงาน & อำนาจ', score: workScore, colors: palette.work }
    ].sort((a, b) => a.score - b.score);

    const lowest = scores[0];
    const highest = scores[scores.length - 1];

    let ratioMain = 70;
    let ratioSub = 30;
    let strategyNote = '';
    let mainColor = lowest.colors[0];
    let subColor = highest.colors[0];

    // ป้องกันกรณีสีซ้ำกัน
    if (subColor.hex === mainColor.hex && highest.colors[1]) {
        subColor = highest.colors[1];
    } else if (subColor.hex === mainColor.hex && scores[1].colors[0]) {
        subColor = scores[1].colors[0];
    }

    if (lowest.score <= 2) {
        // คะแนนวิกฤต: ต้องเน้นสีแก้เคล็ดเข้มข้น 70:30
        ratioMain = 70;
        ratioSub = 30;
        strategyNote = `วันนี้พลังด้าน${lowest.label}ค่อนข้างแผ่ว (${lowest.score}/5) น้องกระต่ายจันทราจึงแนะนำสูตร ${ratioMain}:${ratioSub} โดยเน้นใส่เสื้อชิ้นหลักสี ${mainColor.name} เพื่อเติมเต็มพลังที่พร่อง และแซมด้วย ${subColor.name} อีก ${ratioSub}% เพื่อคงโชคด้าน${highest.label}ไว้`;
    } else if (lowest.score === 3) {
        // คะแนนปานกลาง: บาลานซ์พลังงาน 60:40
        ratioMain = 60;
        ratioSub = 40;
        strategyNote = `พลังงานวันนี้อยู่ในเกณฑ์สมดุลปานกลาง น้องกระต่ายจันทราแนะนำสูตร ${ratioMain}:${ratioSub} เพื่อเพิ่มความมั่นใจด้าน${lowest.label}ให้โดดเด่นยิ่งขึ้น ควบคู่กับการเสริมพลัง${highest.label}`;
    } else {
        // ดวงเปิดทุกด้าน (>= 4 ทั้งหมด): สูตร 50:50 หรือ Monotone พลังบวก
        ratioMain = 50;
        ratioSub = 50;
        strategyNote = `ยินดีด้วยครับ! วันนี้ดวงเปิดรอบด้าน น้องกระต่ายจันทราแนะนำสูตรความมั่นใจแบบเท่าเทียม ${ratioMain}:${ratioSub} จับคู่สี ${mainColor.name} และ ${subColor.name} ให้สง่างาม เปล่งประกาย ออร่าจับตลอดทั้งวัน!`;
    }

    const looks = generateFashionLooks({
        dayIndex,
        palette,
        lowest,
        highest,
        avoid: palette.avoid[0]
    });

    return {
        day: dayData,
        weakestCategory: lowest.category,
        weakestScore: lowest.score,
        strongestCategory: highest.category,
        strongestScore: highest.score,
        formula: {
            ratioMain,
            ratioSub,
            mainColor: {
                ...mainColor,
                percentage: ratioMain,
                role: `สีหลัก (${ratioMain}%) เพื่อกู้วิกฤต/เสริมด้าน${lowest.label}`
            },
            subColor: {
                ...subColor,
                percentage: ratioSub,
                role: `สีรอง (${ratioSub}%) กระเป๋า/กางเกง/เครื่องประดับ เสริมด้าน${highest.label}`
            }
        },
        looks,
        strategyNote,
        avoid: palette.avoid[0],
        dailyPalette: palette
    };
}

/**
 * สร้างชุดเสื้อ-กางเกงหลากสไตล์ตามหลัก Color Harmony
 * โดยกระจายสีมงคลแต่ละด้าน (จุดอ่อน, การเงิน, การงาน) และตัดลุคที่สีซ้ำกันออกอัตโนมัติ
 */
export function generateFashionLooks({ dayIndex, palette, lowest, highest, avoid }) {
    // กำหนดสีท่อนล่างที่สุภาพ (Neutral Anchors) โดยกรองสีกาลกิณีออก
    const safeNeutrals = [
        { name: 'สีขาวงาช้าง', hex: '#F8F9FA' },
        { name: 'สีเบจครีมทราย', hex: '#E5D9C5' },
        { name: 'สีกรมท่าเดนิมเข้ม', hex: '#202E39' },
        { name: 'สีเทาชาร์โคลสุภาพ', hex: '#374151' }
    ].filter(n => {
        if (!avoid) return true;
        const avoidName = avoid.name.replace('สี', '').trim();
        return !n.name.includes(avoidName) && n.hex.toUpperCase() !== avoid.hex.toUpperCase();
    });

    const neutralA = safeNeutrals[0] || { name: 'สีเบจครีม', hex: '#E5D9C5' };
    const neutralB = safeNeutrals[1] || { name: 'สีกรมท่าสุภาพ', hex: '#202E39' };
    const neutralC = safeNeutrals[2] || safeNeutrals[0] || { name: 'สีเทาสุภาพ', hex: '#374151' };

    // 1. ลุคแก้จุดอ่อนหลัก (ด้านที่คะแนนต่ำที่สุด)
    const lookWeakestMain = {
        title: `กู้วิกฤตเสริมด้าน${lowest.label}`,
        badge: `เสริมจุดอ่อน • ${lowest.label}`,
        top: {
            item: 'เสื้อเชิ้ต / เสื้อคอเต่า / เบลเซอร์',
            color: lowest.colors[0].name,
            hex: lowest.colors[0].hex
        },
        bottom: {
            item: 'กางเกงสแล็คส์ทรงกระบอก / กระโปรงพลีท',
            color: neutralA.name,
            hex: neutralA.hex
        },
        tip: `สวมเสื้อสี${lowest.colors[0].name} เพื่อเติมเต็มพลังด้าน${lowest.label} จับคู่ท่อนล่างสี${neutralA.name} ช่วยให้ดูสุขุม มีคลาส และไม่ฉูดฉาด`
    };

    // 2. ลุคทางเลือกของจุดอ่อน (เฉดที่ 2 หรือ สลับท่อนล่าง)
    let lookWeakestAlt;
    if (lowest.colors[1]) {
        lookWeakestAlt = {
            title: `เสริมด้าน${lowest.label} (เฉดทางเลือก)`,
            badge: `ทางเลือก • ${lowest.label}`,
            top: {
                item: 'เสื้อยืดพรีเมียม / สเวตเตอร์ไหมพรม',
                color: lowest.colors[1].name,
                hex: lowest.colors[1].hex
            },
            bottom: {
                item: 'กางเกงขายาว / กระโปรงยาว',
                color: neutralB.name,
                hex: neutralB.hex
            },
            tip: `อีกเฉดสีมงคลสำหรับเสริมด้าน${lowest.label}ด้วยสี${lowest.colors[1].name} แมตช์กับกางเกงสี${neutralB.name} เหมาะสำหรับวันที่ต้องการลุคเท่ๆ`
        };
    } else {
        lookWeakestAlt = {
            title: `สลับท่อนล่างมงคลเสริม${lowest.label}`,
            badge: `มินิมอล • ท่อนล่างมงคล`,
            top: {
                item: 'เสื้อเชิ้ตสีสุภาพคุมโทน',
                color: neutralA.name,
                hex: neutralA.hex
            },
            bottom: {
                item: 'กางเกง/กระโปรงสีมงคล',
                color: lowest.colors[0].name,
                hex: lowest.colors[0].hex
            },
            tip: `สำหรับคนชอบเสื้อท่อนบนสีสุภาพ สามารถสลับมาใส่กางเกง/กระโปรงสีมงคล ${lowest.colors[0].name} เพื่อรับพลังได้เต็มที่เช่นกัน`
        };
    }

    // 3. ลุคเน้นรับทรัพย์ & โชคลาภการเงิน (Wealth Focus)
    const financeColor = (lowest.category === 'finance' && palette.finance[1]) 
        ? palette.finance[1] 
        : palette.finance[0];

    const lookFinance = {
        title: 'เปิดทางรับทรัพย์ & เงินทองคล่องมือ',
        badge: 'ดูดทรัพย์ • การเงิน',
        top: {
            item: 'เสื้อโปโล / เสื้อไหมพรม / เดรส',
            color: financeColor.name,
            hex: financeColor.hex
        },
        bottom: {
            item: 'กางเกงยีนส์เดนิม / สแล็คส์คัทติ้งเนี๊ยบ',
            color: neutralB.name,
            hex: neutralB.hex
        },
        tip: `เน้นดึงดูดทรัพย์ด้วยเสื้อสี${financeColor.name} แมตช์กับกางเกงสี${neutralB.name} ${financeColor.note || 'เปิดทางรับทรัพย์เข้ากระเป๋า'}`
    };

    // 4. ลุคเสริมอำนาจบารมี & การงานราบรื่น (Career Focus)
    const workColor = (lowest.category === 'work' && palette.work[1])
        ? palette.work[1]
        : palette.work[0];

    const lookWork = {
        title: 'เสริมอำนาจบารมี & งานราบรื่น',
        badge: 'บารมีก้าวหน้า • การงาน',
        top: {
            item: 'เสื้อเบลเซอร์ / สูทลำลอง / เชิ้ตคัตติ้งเนี้ยบ',
            color: workColor.name,
            hex: workColor.hex
        },
        bottom: {
            item: 'กางเกงทำงานขายาวทรงตรง',
            color: neutralC.name,
            hex: neutralC.hex
        },
        tip: `สวมเสื้อสี${workColor.name} เพื่อเสริมความน่าเชื่อถือและการตัดสินใจ ${workColor.note || 'งานสำเร็จไร้อุปสรรค'}`
    };

    // รวบรวมและคัดกรอง "ตัดลุคที่สีซ้ำกันออก" (Deduplicate looks by top.hex + bottom.hex)
    const allCandidates = [lookWeakestMain, lookWeakestAlt, lookFinance, lookWork];
    const uniqueLooks = [];
    const seenCombos = new Set();

    for (const look of allCandidates) {
        const comboKey = `${look.top.hex.toUpperCase()}_${look.bottom.hex.toUpperCase()}`;
        // ป้องกันสีซ้ำกัน และป้องกันไม่ให้เสื้อกับกางเกงเป็นสีเดียวกันจนดูเสร่อ
        if (!seenCombos.has(comboKey) && look.top.hex.toUpperCase() !== look.bottom.hex.toUpperCase()) {
            seenCombos.add(comboKey);
            uniqueLooks.push(look);
        }
    }

    return uniqueLooks.map((look, index) => ({
        ...look,
        id: `look-${index + 1}`,
        title: `ลุคที่ ${index + 1}: ${look.title}`
    }));
}
