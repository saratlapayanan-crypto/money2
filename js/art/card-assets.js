import { renderBackPlaceholder, renderFrontPlaceholder } from './art-nouveau-placeholder.js';

const DECK_LABELS = Object.freeze({
    christmas: 'Christmas / Winter Solstice',
    valentine: 'Valentine',
    songkran: 'Songkran',
    'loy-krathong': 'Loy Krathong',
    halloween: 'Halloween',
    standard: 'Classic'
});

export function resolveCardAsset(deck, card) {
    const record = deck?.cards?.[card?.id];
    if (record?.status === 'approved' && typeof record.asset === 'string' && record.asset.trim()) {
        return { kind: 'image', src: record.asset, status: 'approved' };
    }
    return {
        kind: 'placeholder',
        src: null,
        status: record?.status ?? 'placeholder'
    };
}

export function resolveBackAsset(deck) {
    const record = deck?.back;
    if (record?.status === 'approved' && typeof record.asset === 'string' && record.asset.trim()) {
        return { kind: 'image', src: record.asset, status: 'approved' };
    }
    return {
        kind: 'placeholder',
        src: null,
        status: record?.status ?? 'placeholder'
    };
}

function showPlaceholder(container, card, deckId, reversed) {
    container.innerHTML = renderFrontPlaceholder(card, deckId);
    container.classList.add('has-svg-art');
    container.classList.toggle('is-reversed', Boolean(reversed));
}

export function renderCardFace(container, { deck, card, reversed = false }) {
    if (!container || !card) return;
    const resolved = resolveCardAsset(deck, card);
    if (resolved.kind === 'placeholder') {
        showPlaceholder(container, card, deck?.id ?? 'standard', reversed);
        return;
    }

    const image = container.ownerDocument.createElement('img');
    image.src = resolved.src;
    image.alt = card.alt_text;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.className = 'card-art-image';
    image.classList.toggle('is-reversed', Boolean(reversed));
    image.addEventListener('error', () => {
        showPlaceholder(container, card, deck?.id ?? 'standard', reversed);
    }, { once: true });
    container.replaceChildren(image);
    container.classList.remove('has-svg-art');
}

export function renderCardBack(container, deck) {
    if (!container) return;
    const deckId = deck?.id ?? 'standard';
    const showBackPlaceholder = () => {
        container.innerHTML = renderBackPlaceholder(deckId);
        container.classList.add('has-svg-art');
    };
    const resolved = resolveBackAsset(deck);
    if (resolved.kind === 'placeholder') {
        showBackPlaceholder();
        return;
    }

    const image = container.ownerDocument.createElement('img');
    image.src = resolved.src;
    image.alt = `${deck?.name_en ?? DECK_LABELS[deckId] ?? 'Tarot'} card back`;
    image.loading = 'eager';
    image.decoding = 'async';
    image.className = 'card-art-image';
    image.addEventListener('error', showBackPlaceholder, { once: true });
    container.replaceChildren(image);
    container.classList.remove('has-svg-art');
}
