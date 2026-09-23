/* ================================================================
   ธีมสำรับไพ่ตามเทศกาล (ไทย + ฝรั่ง)
   - standard      : มนตราสยาม (Modern Celestial & Champagne Gold)
   - songkran      : สงกรานต์ (13–15 เม.ย. — ประเพณีรื่นเริงแห่งสายน้ำ ดอกมะลิ และขันเงิน)
   - loy-krathong  : ลอยกระทง (วันเพ็ญ เดือน 12 ไทย — สายน้ำแห่งชีวิตและดวงจันทร์เต็มดวง)
   - halloween     : ฮาโลวีน (31 ต.ค. — มนต์เสน่ห์ค่ำคืนใบไม้ร่วงและเงามายา)
   - christmas     : คริสต์มาส (25 ธ.ค. — เหมายัน แสงเทียนแห่งความหวังและกิ่งสน)
   - valentine     : วาเลนไทน์ (14 ก.พ. — ดอกกุหลาบแย้มบานและรักแท้)
   - minimalist    : มินิมอล (ลายเส้นร่วมสมัย คลีน สบายตา)
   อ้างอิงวันเทศกาล: Wikipedia (Songkran, Loy Krathong)
   ================================================================ */

export const THEMES = {
    standard: {
        label: 'มนตราสยาม',
        bg: ['#120B22', '#1E1235'],
        frame: '#D4AF37',
        frameSoft: 'rgba(212,175,55,0.45)',
        numeral: '#FDE68A',
        title: '#FAF5FF',
        subtitle: '#D8B4FE',
        corner: 'kanok',
        sparkle: '#FBBF24',
        pattern: 'star',
        archCenter: '#3B1F5E',
        suits: { wands: '#F97316', cups: '#38BDF8', swords: '#94A3B8', pentacles: '#10B981' },
        suitGold: '#FBBF24',
    },
    songkran: {
        label: 'สงกรานต์',
        bg: ['#E0F2FE', '#BAE6FD'],
        frame: '#D97706',
        frameSoft: 'rgba(217,119,6,0.35)',
        numeral: '#0369A1',
        title: '#0C4A6E',
        subtitle: '#0284C7',
        corner: 'drop',
        sparkle: '#38BDF8',
        pattern: 'wave',
        suits: { wands: '#EA580C', cups: '#0284C7', swords: '#475569', pentacles: '#D97706' },
        suitGold: '#D97706',
    },
    'loy-krathong': {
        label: 'ลอยกระทง',
        bg: ['#F3E8FF', '#DDD6FE'],
        frame: '#D97706',
        frameSoft: 'rgba(217,119,6,0.35)',
        numeral: '#6D28D9',
        title: '#4C1D95',
        subtitle: '#7C3AED',
        corner: 'lantern',
        sparkle: '#A855F7',
        pattern: 'ripple',
        suits: { wands: '#F97316', cups: '#7C3AED', swords: '#64748B', pentacles: '#059669' },
        suitGold: '#D97706',
    },
    halloween: {
        label: 'ฮาโลวีน',
        bg: ['#FED7AA', '#FDBA74'],
        frame: '#C2410C',
        frameSoft: 'rgba(194,65,12,0.35)',
        numeral: '#9A3412',
        title: '#431407',
        subtitle: '#C2410C',
        corner: 'bat',
        sparkle: '#EA580C',
        pattern: 'batfly',
        suits: { wands: '#EA580C', cups: '#9333EA', swords: '#334155', pentacles: '#15803D' },
        suitGold: '#C2410C',
    },
    christmas: {
        label: 'คริสต์มาส',
        bg: ['#DCFCE7', '#BBF7D0'],
        frame: '#15803D',
        frameSoft: 'rgba(21,128,61,0.35)',
        numeral: '#B91C1C',
        title: '#14532D',
        subtitle: '#15803D',
        corner: 'snow',
        sparkle: '#16A34A',
        pattern: 'snow',
        ribbon: '#DC2626',
        suits: { wands: '#DC2626', cups: '#0284C7', swords: '#475569', pentacles: '#D97706' },
        suitGold: '#D97706',
    },
    valentine: {
        label: 'วาเลนไทน์',
        bg: ['#FFE4E6', '#FECDD3'],
        frame: '#BE123C',
        frameSoft: 'rgba(190,18,60,0.35)',
        numeral: '#9F1239',
        title: '#4C0519',
        subtitle: '#E11D48',
        corner: 'heart',
        sparkle: '#FB7185',
        pattern: 'heart',
        suits: { wands: '#F43F5E', cups: '#EC4899', swords: '#64748B', pentacles: '#D97706' },
        suitGold: '#D97706',
    },
    minimalist: {
        label: 'มินิมอล',
        bg: ['#F1F5F9', '#E2E8F0'],
        frame: '#475569',
        frameSoft: 'rgba(71,85,105,0.35)',
        numeral: '#334155',
        title: '#0F172A',
        subtitle: '#64748B',
        corner: 'line',
        sparkle: '#64748B',
        pattern: 'none',
        suits: { wands: '#EA580C', cups: '#2563EB', swords: '#334155', pentacles: '#16A34A' },
        suitGold: '#D97706',
    },
};

/** เลือกธีมจาก deck id (fallback: standard) */
export function getTheme(deckId) {
    return THEMES[deckId] || THEMES.standard;
}
