import { getOrCreateUserId } from './utils/user.js';

function gtag() {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(arguments);
    }
}

if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', {
        user_id: getOrCreateUserId(),
        anonymize_ip: true
    });
}

/**
 * Tracks an event to Google Analytics.
 * @param {string} eventName - The name of the event
 * @param {Object} params - Additional event parameters
 */
export function trackEvent(eventName, params = {}) {
    const eventParams = {
        ...params,
        send_to: 'G-XXXXXXXXXX'
    };

    gtag('event', eventName, eventParams);

    if (typeof localStorage !== 'undefined' && localStorage.getItem('tarot_debug') === 'true') {
        console.log(`[Analytics] Event Tracked: ${eventName}`, eventParams);
    }
}
