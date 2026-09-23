import test from 'node:test';
import assert from 'node:assert/strict';
import {
    DAYS_OF_WEEK,
    LUCKY_COLOR_TABLE,
    getDayOfWeekFromDateString,
    getDailyLuckyColors,
    calculateOutfitAdvice
} from '../js/domain/lucky-colors.js';

test('LUCKY_COLOR_TABLE defines valid colors for all 7 days without self-contradiction', () => {
    assert.equal(DAYS_OF_WEEK.length, 7);

    for (let day = 0; day <= 6; day++) {
        const palette = getDailyLuckyColors(day);
        assert.ok(Array.isArray(palette.work) && palette.work.length > 0, `Day ${day} missing work colors`);
        assert.ok(Array.isArray(palette.finance) && palette.finance.length > 0, `Day ${day} missing finance colors`);
        assert.ok(Array.isArray(palette.love) && palette.love.length > 0, `Day ${day} missing love colors`);
        assert.ok(Array.isArray(palette.avoid) && palette.avoid.length > 0, `Day ${day} missing avoid colors`);

        // Check HEX code formats
        const hexRegex = /^#[0-9A-Fa-f]{6}$/;
        palette.work.forEach(c => assert.match(c.hex, hexRegex));
        palette.finance.forEach(c => assert.match(c.hex, hexRegex));
        palette.love.forEach(c => assert.match(c.hex, hexRegex));
        palette.avoid.forEach(c => assert.match(c.hex, hexRegex));

        // Ensure avoid colors do not directly collide with positive colors of the same day
        const avoidHexes = new Set(palette.avoid.map(c => c.hex.toUpperCase()));
        palette.work.forEach(c => assert.ok(!avoidHexes.has(c.hex.toUpperCase()), `Day ${day} work color collides with avoid color`));
        palette.finance.forEach(c => assert.ok(!avoidHexes.has(c.hex.toUpperCase()), `Day ${day} finance color collides with avoid color`));
        palette.love.forEach(c => assert.ok(!avoidHexes.has(c.hex.toUpperCase()), `Day ${day} love color collides with avoid color`));
    }
});

test('getDayOfWeekFromDateString parses YYYY-MM-DD correctly in UTC', () => {
    // 2026-09-21 is Monday (1)
    assert.equal(getDayOfWeekFromDateString('2026-09-21'), 1);
    // 2026-09-20 is Sunday (0)
    assert.equal(getDayOfWeekFromDateString('2026-09-20'), 0);
    // 2026-09-26 is Saturday (6)
    assert.equal(getDayOfWeekFromDateString('2026-09-26'), 6);
});

test('calculateOutfitAdvice recommends 70:30 ratio when weakest score <= 2', () => {
    const advice = calculateOutfitAdvice({
        dayIndex: 1, // Monday
        loveScore: 1, // Weakest
        financeScore: 4,
        workScore: 3
    });

    assert.equal(advice.weakestCategory, 'love');
    assert.equal(advice.formula.ratioMain, 70);
    assert.equal(advice.formula.ratioSub, 30);
    assert.ok(advice.strategyNote.includes('70:30'));
    assert.ok(advice.formula.mainColor.name);
    assert.ok(advice.formula.subColor.name);
    assert.ok(advice.avoid.name);
});

test('calculateOutfitAdvice recommends 60:40 ratio when weakest score == 3', () => {
    const advice = calculateOutfitAdvice({
        dayIndex: 3, // Wednesday
        loveScore: 4,
        financeScore: 3, // Weakest
        workScore: 5
    });

    assert.equal(advice.weakestCategory, 'finance');
    assert.equal(advice.formula.ratioMain, 60);
    assert.equal(advice.formula.ratioSub, 40);
    assert.ok(advice.strategyNote.includes('60:40'));
});

test('calculateOutfitAdvice recommends 50:50 ratio when all scores >= 4', () => {
    const advice = calculateOutfitAdvice({
        dayIndex: 5, // Friday
        loveScore: 5,
        financeScore: 4,
        workScore: 5
    });

    assert.equal(advice.formula.ratioMain, 50);
    assert.equal(advice.formula.ratioSub, 50);
    assert.ok(advice.strategyNote.includes('50:50'));
});

test('calculateOutfitAdvice generates distinct non-duplicate looks across all 7 days', () => {
    for (let day = 0; day <= 6; day++) {
        const advice = calculateOutfitAdvice({
            dayIndex: day,
            loveScore: 2,
            financeScore: 3,
            workScore: 4
        });

        assert.ok(Array.isArray(advice.looks) && advice.looks.length >= 3, `Day ${day} should have at least 3 looks`);
        
        // Ensure every look has a unique (top.hex + bottom.hex) combination
        const combos = advice.looks.map(l => `${l.top.hex.toUpperCase()}_${l.bottom.hex.toUpperCase()}`);
        const uniqueCombos = new Set(combos);
        assert.equal(uniqueCombos.size, combos.length, `Day ${day} has duplicate outfit combinations!`);

        // Ensure bottom does not pick day's avoid color
        const avoidHex = advice.avoid.hex.toUpperCase();
        advice.looks.forEach(look => {
            assert.notEqual(look.bottom.hex.toUpperCase(), avoidHex, `Day ${day} bottom used avoid color`);
            assert.notEqual(look.top.hex.toUpperCase(), avoidHex, `Day ${day} top used avoid color`);
            assert.notEqual(look.top.hex.toUpperCase(), look.bottom.hex.toUpperCase(), `Day ${day} top and bottom should not be identical color`);
        });
    }
});
