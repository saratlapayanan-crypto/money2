/**
 * SVG Silhouettes for Fashion Outfits (เสื้อ + กางเกง)
 * สร้างภาพจำลองเสื้อผ้าที่ลงสีจริงตามเฉดที่แนะนำ
 */

export function renderOutfitMannequinSvg({ topHex, bottomHex, width = 64, height = 90, className = '' }) {
    return `
    <svg width="${width}" height="${height}" viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}" aria-label="ภาพจำลองชุดเสื้อและกางเกง">
        <!-- ไม้แขวนเสื้อ / ตะขอสีทอง -->
        <path d="M40 7 C37 3, 33 8, 36 10 C38 11, 40 10, 40 14" stroke="#D69E2E" stroke-width="2" stroke-linecap="round" fill="none" />
        
        <!-- เสื้อท่อนบน (Top Silhouette) -->
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
            <path d="M26 14 C33 19, 47 19, 54 14 L70 23 L63 35 L55 31 L54 57 L26 57 L25 31 L17 35 L10 23 Z" 
                  fill="${topHex}" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linejoin="round" />
            <!-- เส้นขอบคอเสื้อเพื่อมิติ -->
            <path d="M33 15 C37 20, 43 20, 47 15" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" fill="none" />
        </g>
        
        <!-- กางเกงท่อนล่าง (Bottom Silhouette) -->
        <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
            <path d="M26 55 L54 55 L57 102 L44 102 L40 70 L36 102 L23 102 Z" 
                  fill="${bottomHex}" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linejoin="round" />
            <!-- รอยพับ/กระเป๋ากางเกง -->
            <line x1="40" y1="55" x2="40" y2="67" stroke="rgba(0,0,0,0.25)" stroke-width="1.2" />
        </g>
    </svg>
    `.trim();
}

export function renderShirtIconSvg({ hex, size = 32 }) {
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0 drop-shadow">
        <path d="M12 6 C16 9, 24 9, 28 6 L36 12 L32 19 L28 17 L28 34 L12 34 L12 17 L8 19 L4 12 Z" 
              fill="${hex}" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linejoin="round" />
        <path d="M16 7 C18 10, 22 10, 24 7" stroke="rgba(0,0,0,0.3)" stroke-width="1.2" fill="none" />
    </svg>
    `.trim();
}

export function renderPantsIconSvg({ hex, size = 32 }) {
    return `
    <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0 drop-shadow">
        <path d="M10 6 L30 6 L32 35 L24 35 L20 18 L16 35 L8 35 Z" 
              fill="${hex}" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linejoin="round" />
        <line x1="20" y1="6" x2="20" y2="15" stroke="rgba(0,0,0,0.3)" stroke-width="1.2" />
    </svg>
    `.trim();
}
