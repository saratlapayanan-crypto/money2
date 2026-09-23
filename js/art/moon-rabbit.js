/**
 * Mascot: น้องกระต่ายจันทรา (Moon Rabbit)
 * ออกแบบสไตล์ Siamese Mystic & Art Nouveau ผสานความน่ารักมินิมอล
 */

export function renderMoonRabbitSvg({ size = 72, className = '' } = {}) {
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 120 120" class="${className}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="มาสคอตน้องกระต่ายจันทรา">
        <defs>
            <!-- ไล่เฉดสีดวงจันทร์เสี้ยวสีทองอร่าม -->
            <linearGradient id="moonGold" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#F9E79F" />
                <stop offset="50%" stop-color="#D69E2E" />
                <stop offset="100%" stop-color="#B7791F" />
            </linearGradient>
            <!-- แสงออร่าสีม่วงพลัมมนตรา -->
            <radialGradient id="auraGlow" cx="60" cy="60" r="50" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#9F7AEA" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#3B1F5F" stop-opacity="0" />
            </radialGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
        </defs>

        <!-- รัศมีเวทมนตร์ด้านหลัง -->
        <circle cx="60" cy="60" r="48" fill="url(#auraGlow)" />

        <!-- ดวงจันทร์เสี้ยวสไตล์ Art Nouveau -->
        <path d="M72 16 C95 30, 98 75, 74 98 C64 108, 48 112, 34 107 C56 102, 70 82, 68 60 C66 42, 54 28, 40 22 C50 17, 61 15, 72 16 Z" 
              fill="url(#moonGold)" filter="url(#softGlow)" />

        <!-- ประกายดวงดาวนำทาง (Stars & Sparkles) -->
        <path d="M96 24 L98 30 L104 32 L98 34 L96 40 L94 34 L88 32 L94 30 Z" fill="#FDFEFE" opacity="0.9" />
        <circle cx="28" cy="38" r="2.2" fill="#D69E2E" opacity="0.8" />
        <circle cx="92" cy="78" r="2.5" fill="#FAD7A0" opacity="0.85" />
        <circle cx="36" cy="92" r="1.8" fill="#FDFEFE" opacity="0.7" />

        <!-- ตัวน้องกระต่ายจันทรา (Chibi Moon Rabbit) -->
        <!-- หูซ้าย & ขวา -->
        <path d="M44 48 C36 28, 42 12, 50 18 C56 24, 52 40, 48 48 Z" fill="#F8F9FA" />
        <path d="M44 44 C39 30, 43 18, 48 22 C52 26, 49 38, 46 44 Z" fill="#FADBD8" /> <!-- หูด้านในชมพูอ่อน -->

        <path d="M56 46 C56 24, 66 8, 74 15 C80 22, 72 38, 64 47 Z" fill="#F8F9FA" />
        <path d="M57 43 C58 26, 65 14, 70 19 C74 24, 68 36, 62 43 Z" fill="#FADBD8" />

        <!-- ลำตัวและใบหน้ากลมป้อม -->
        <ellipse cx="56" cy="74" rx="22" ry="20" fill="#F8F9FA" />
        <circle cx="56" cy="56" r="18" fill="#F8F9FA" />

        <!-- แก้มชมพูระเรื่อ -->
        <ellipse cx="44" cy="61" rx="3.5" ry="2.2" fill="#F5B7B1" opacity="0.7" />
        <ellipse cx="68" cy="61" rx="3.5" ry="2.2" fill="#F5B7B1" opacity="0.7" />

        <!-- ตาโตกลมใสประกายดาวสีน้ำตาลทอง -->
        <circle cx="48" cy="54" r="3.2" fill="#2C1A3D" />
        <circle cx="47" cy="53" r="1.2" fill="#FFFFFF" />
        <circle cx="64" cy="54" r="3.2" fill="#2C1A3D" />
        <circle cx="63" cy="53" r="1.2" fill="#FFFFFF" />

        <!-- จมูกและปากจิ๋ว -->
        <path d="M55 58 L57 58 L56 60 Z" fill="#E59866" />
        <path d="M53 62 Q56 64 56 61 Q56 64 59 62" stroke="#B03A2E" stroke-width="1.2" stroke-linecap="round" fill="none" />

        <!-- อุ้งเท้าหน้าถือไพ่ทาโรต์จิ๋วสีทอง -->
        <ellipse cx="45" cy="75" rx="4" ry="4" fill="#FFFFFF" />
        <ellipse cx="67" cy="75" rx="4" ry="4" fill="#FFFFFF" />
        
        <!-- ไพ่จิ๋วสีทองประดับกลางอก -->
        <rect x="50" y="65" width="12" height="18" rx="2" fill="#1A1025" stroke="#D69E2E" stroke-width="1.2" />
        <polygon points="56,70 59,74 56,78 53,74" fill="#D69E2E" />
    </svg>
    `.trim();
}
