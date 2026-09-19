/* ================================================================
   ธีมสำรับไพ่ตามเทศกาล (ไทย + ฝรั่ง)
   - standard      : มนตราสยาม (ทองไทยคลาสสิก)
   - songkran      : สงกรานต์ (13–15 เม.ย. — สาดน้ำ สรงน้ำพระ)
   - loy-krathong  : ลอยกระทง (วันเพ็ญ เดือน 12 ไทย ~ พ.ย.)
   - halloween     : ฮาโลวีน (31 ต.ค.)
   - christmas     : คริสต์มาส (25 ธ.ค.)
   - valentine     : วาเลนไทน์ (14 ก.พ.)
   - minimalist    : มินิมอล (ลายเส้น)
   อ้างอิงวันเทศกาล: Wikipedia (Songkran, Loy Krathong)
   ================================================================ */

export const THEMES = {
    standard: {
        label: 'มนตราสยาม',
        bg: ['#2a1e4d', '#16102b'],
        frame: '#e0b64f',
        frameSoft: 'rgba(224,182,79,0.38)',
        numeral: '#f2d48a',
        title: '#f7efdd',
        subtitle: 'rgba(247,239,221,0.72)',
        corner: 'kanok',
        sparkle: '#f2d48a',
        pattern: 'star',
        suits: { wands: '#e08a4f', cups: '#6fb3d8', swords: '#c9d1e0', pentacles: '#69b98f' },
        suitGold: '#e0b64f',
    },
    songkran: {
        label: 'สงกรานต์',
        bg: ['#2a9fc4', '#0e4a63'],
        frame: '#ffd98a',
        frameSoft: 'rgba(255,217,138,0.42)',
        numeral: '#ffffff',
        title: '#ffffff',
        subtitle: 'rgba(255,255,255,0.75)',
        corner: 'drop',
        sparkle: '#bff0ff',
        pattern: 'wave',
        suits: { wands: '#ffb066', cups: '#a8e6f5', swords: '#e6f7ff', pentacles: '#ffd98a' },
        suitGold: '#ffd98a',
    },
    'loy-krathong': {
        label: 'ลอยกระทง',
        bg: ['#233a75', '#0d1638'],
        frame: '#f5c86a',
        frameSoft: 'rgba(245,200,106,0.4)',
        numeral: '#ffe3a3',
        title: '#fff6e6',
        subtitle: 'rgba(255,246,230,0.7)',
        corner: 'lantern',
        sparkle: '#9fe8ff',
        pattern: 'ripple',
        suits: { wands: '#ff9d6b', cups: '#7fd4e8', swords: '#cdd8f5', pentacles: '#8fe0b8' },
        suitGold: '#f5c86a',
    },
    halloween: {
        label: 'ฮาโลวีน',
        bg: ['#43215e', '#1c0f2e'],
        frame: '#f59b3c',
        frameSoft: 'rgba(245,155,60,0.42)',
        numeral: '#ffd9a8',
        title: '#fff2e0',
        subtitle: 'rgba(255,242,224,0.72)',
        corner: 'bat',
        sparkle: '#c9a7ff',
        pattern: 'batfly',
        suits: { wands: '#ff8a5c', cups: '#b794f6', swords: '#d8d3e8', pentacles: '#8fd694' },
        suitGold: '#f59b3c',
    },
    christmas: {
        label: 'คริสต์มาส',
        bg: ['#1d4436', '#0d2a20'],
        frame: '#e8e3d5',
        frameSoft: 'rgba(232,227,213,0.4)',
        numeral: '#ffffff',
        title: '#ffffff',
        subtitle: 'rgba(255,255,255,0.75)',
        corner: 'snow',
        sparkle: '#ffffff',
        pattern: 'snow',
        ribbon: '#c0392b',
        suits: { wands: '#e74c3c', cups: '#8fd0e8', swords: '#e8e3d5', pentacles: '#f1c40f' },
        suitGold: '#f1c40f',
    },
    valentine: {
        label: 'วาเลนไทน์',
        bg: ['#8c2a4a', '#43102a'],
        frame: '#f2a7b8',
        frameSoft: 'rgba(242,167,184,0.45)',
        numeral: '#ffe1ea',
        title: '#fff0f4',
        subtitle: 'rgba(255,240,244,0.75)',
        corner: 'heart',
        sparkle: '#ffc2d4',
        pattern: 'heart',
        suits: { wands: '#ff8f6b', cups: '#ffb3c6', swords: '#f5dce3', pentacles: '#f0c987' },
        suitGold: '#f0c987',
    },
    minimalist: {
        label: 'มินิมอล',
        bg: ['#2d3748', '#1a202c'],
        frame: '#a0aec0',
        frameSoft: 'rgba(160,174,192,0.35)',
        numeral: '#e2e8f0',
        title: '#e2e8f0',
        subtitle: 'rgba(226,232,240,0.6)',
        corner: 'line',
        sparkle: '#a0aec0',
        pattern: 'none',
        suits: { wands: '#f6ad55', cups: '#63b3ed', swords: '#e2e8f0', pentacles: '#68d391' },
        suitGold: '#e2e8f0',
    },
};

/** เลือกธีมจาก deck id (fallback: standard) */
export function getTheme(deckId) {
    return THEMES[deckId] || THEMES.standard;
}
