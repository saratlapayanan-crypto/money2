import { renderFront } from './fronts.js';
import { renderBack } from './backs.js';

export function renderFrontPlaceholder(card, deckId) {
    return renderFront(card, deckId);
}

export function renderBackPlaceholder(deckId) {
    return renderBack(deckId);
}
