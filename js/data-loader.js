import { validateCards } from './domain/cards.js';

export async function loadCards() {
    try {
        const response = await fetch('./data/cards.json');
        if (!response.ok) throw new Error(`Failed to load cards.json`);
        const cards = await response.json();
        
        if (!Array.isArray(cards)) throw new Error("cards.json must return an array");
        return validateCards(cards);
    } catch (error) {
        console.error("DataLoader Error (Cards):", error);
        throw error;
    }
}

export async function loadInterpretations() {
    try {
        const response = await fetch('./data/interpretations.json');
        if (!response.ok) throw new Error(`Failed to load interpretations.json`);
        const interpretations = await response.json();
        
        if (!Array.isArray(interpretations)) throw new Error("interpretations.json must return an array");
        return interpretations;
    } catch (error) {
        console.error("DataLoader Error (Interpretations):", error);
        throw error; // Let UI handle it
    }
}

export async function loadRemedies() {
    try {
        const res = await fetch('./data/remedies.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Remedies):", e);
        return [];
    }
}

export async function loadColors() {
    try {
        const res = await fetch('./data/colors.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Colors):", e);
        return [];
    }
}

export async function loadWallpapers() {
    try {
        const res = await fetch('./data/wallpapers.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Wallpapers):", e);
        return [];
    }
}

export async function loadAffiliates() {
    try {
        const res = await fetch('./data/affiliates.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Affiliates):", e);
        return [];
    }
}

export async function loadDecks() {
    try {
        const res = await fetch('./data/decks.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Decks):", e);
        return [];
    }
}

export async function loadSeasons() {
    try {
        const res = await fetch('./data/seasons.json');
        return await res.json();
    } catch (e) {
        console.error("DataLoader Error (Seasons):", e);
        return [];
    }
}
