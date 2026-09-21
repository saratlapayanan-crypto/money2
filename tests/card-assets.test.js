import test from 'node:test';
import assert from 'node:assert/strict';

import { renderCardBack, resolveBackAsset, resolveCardAsset } from '../js/art/card-assets.js';

const card = { id: 'major-0', name_en: 'The Fool', name_th: 'คนโง่', alt_text: 'ภาพไพ่คนโง่' };

function deck(status, asset) {
    return { id: 'christmas', cards: { 'major-0': { status, asset } } };
}

test('resolves only approved artwork with a non-empty asset path', () => {
    assert.deepEqual(resolveCardAsset(deck('approved', 'assets/cards/christmas/major-0.webp'), card), {
        kind: 'image',
        src: 'assets/cards/christmas/major-0.webp',
        status: 'approved'
    });
});

test('resolves draft, placeholder, missing, and malformed artwork to a placeholder', () => {
    for (const candidate of [deck('draft', 'draft.webp'), deck('placeholder', null), deck('approved', ''), { id: 'christmas', cards: {} }]) {
        const result = resolveCardAsset(candidate, card);
        assert.equal(result.kind, 'placeholder');
        assert.equal(result.src, null);
    }
});

function fakeContainer() {
    const classes = new Set();
    return {
        innerHTML: '',
        child: null,
        ownerDocument: {
            createElement(tagName) {
                const listeners = {};
                return {
                    tagName: tagName.toUpperCase(),
                    className: '',
                    classList: { toggle() {} },
                    listeners,
                    addEventListener(type, handler, options) {
                        listeners[type] = { handler, options };
                    }
                };
            }
        },
        classList: {
            add(value) { classes.add(value); },
            remove(value) { classes.delete(value); },
            contains(value) { return classes.has(value); }
        },
        replaceChildren(child) {
            this.child = child;
            this.innerHTML = '';
        }
    };
}

test('renders an approved back asset as an image', () => {
    const approved = {
        id: 'christmas',
        back: { status: 'approved', asset: 'assets/cards/christmas/back.webp' }
    };
    const container = fakeContainer();

    assert.deepEqual(resolveBackAsset(approved), {
        kind: 'image',
        src: 'assets/cards/christmas/back.webp',
        status: 'approved'
    });
    renderCardBack(container, approved);

    assert.equal(container.child.tagName, 'IMG');
    assert.equal(container.child.src, 'assets/cards/christmas/back.webp');
    assert.equal(container.child.alt, 'Christmas / Winter Solstice card back');
    assert.equal(container.child.className, 'card-art-image');
    assert.equal(container.classList.contains('has-svg-art'), false);
});

test('renders the SVG back placeholder for missing and unapproved assets', () => {
    for (const deck of [
        { id: 'christmas', back: { status: 'draft', asset: 'draft.webp' } },
        { id: 'christmas', back: { status: 'approved', asset: '' } },
        { id: 'christmas' }
    ]) {
        const container = fakeContainer();
        const result = resolveBackAsset(deck);

        assert.equal(result.kind, 'placeholder');
        assert.equal(result.src, null);
        renderCardBack(container, deck);
        assert.match(container.innerHTML, /^<svg /);
        assert.equal(container.classList.contains('has-svg-art'), true);
    }
});

test('restores the SVG back placeholder when an approved image fails to load', () => {
    const approved = {
        id: 'christmas',
        back: { status: 'approved', asset: 'assets/cards/christmas/back.webp' }
    };
    const container = fakeContainer();

    renderCardBack(container, approved);
    assert.equal(typeof container.child.listeners?.error?.handler, 'function');
    container.child.listeners.error.handler();

    assert.match(container.innerHTML, /^<svg /);
    assert.equal(container.classList.contains('has-svg-art'), true);
});
