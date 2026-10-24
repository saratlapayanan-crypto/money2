/**
 * ============================================================================
 * 💰 ตั้งค่าระบบสร้างรายได้ (Monetization Configuration) — แก้ไขได้ในจุดเดียว
 * ============================================================================
 * คุณสามารถเปลี่ยนเบอร์พร้อมเพย์, ลิงก์ Affiliate Shopee/Lazada/TikTok,
 * หรือลิงก์ LINE Official Account ของคุณได้ที่ไฟล์นี้ไฟล์เดียว ระบบจะอัปเดตทั้งเว็บทันที
 */
export const MONETIZATION_CONFIG = {
    // 1. ตั้งค่ารับ "ค่าครู / สนับสนุนเว็บไซต์ตามศรัทธา" (PromptPay / QR / ลิงก์รับโดเนท)
    tipping: {
        enabled: true,
        promptPayId: '08X-XXX-XXXX', // <-- ใส่เบอร์พร้อมเพย์ 10 หลัก หรือเลขบัตรประชาชน 13 หลักของคุณที่นี่
        accountName: 'กองทุนพัฒนาเว็บไพ่ทาโรต์ money2 (Thai Tarot)',
        amounts: [
            { amount: 9, label: '9 ฿', title: 'ค่าธูปเทียนมงคล 🙏', blessing: 'ขอให้วันนี้ราบรื่น พบเจอแต่กัลยาณมิตรและข่าวดี' },
            { amount: 19, label: '19 ฿', title: 'ค่าครูเปิดดวงสว่าง ✨', blessing: 'ขอให้การเงินคล่องตัว งานสำเร็จก้าวหน้า สมหวังดั่งใจ' },
            { amount: 29, label: '29 ฿', title: 'เสริมบารมีดวงเศรษฐี 👑', blessing: 'ขอให้โชคลาภหลั่งไหล ความรักอบอุ่น มั่งคั่งร่ำรวยตลอดปี' }
        ],
        // หากมีรูป QR Code รับเงินของธนาคาร สามารถใส่พาธรูป เช่น 'assets/qr-promptpay.png' ได้เลย
        customQrImageUrl: ''
    },

    // 2. ตั้งค่า Affiliate พาร์ทเนอร์ (Shopee / Lazada / TikTok Shop)
    affiliate: {
        // ใส่โค้ดต่อท้ายลิงก์ Affiliate ของคุณ (เช่น '?uls_trackid=...' หรือปล่อยว่างเพื่อให้เปิดหน้าค้นหาสินค้าจริงบน Shopee)
        shopeeAffiliateSuffix: '',
        shopeeSearchBaseUrl: 'https://shopee.co.th/search?keyword='
    },

    // 3. ช่องทางติดต่อดูดวงส่วนตัว / LINE Official Account (ถ้ามี)
    social: {
        lineOfficialUrl: 'https://line.me/R/',
        instagramHandle: '@money2.thaitarot'
    }
};

/**
 * สร้างลิงก์ช้อปสินค้ามงคลหรือเสื้อผ้าสีมงคลจากคีย์เวิร์ดโดยอัตโนมัติ
 */
export function buildAffiliateSearchUrl(keyword) {
    const cleanKeyword = encodeURIComponent(String(keyword || 'กำไลหินมงคล').trim());
    return `${MONETIZATION_CONFIG.affiliate.shopeeSearchBaseUrl}${cleanKeyword}${MONETIZATION_CONFIG.affiliate.shopeeAffiliateSuffix || ''}`;
}
