import { getOrCreateUserId } from './utils/user.js';

// GA4 Placeholder Initialization (Standard snippet format)
window.dataLayer = window.dataLayer || [];
function gtag(){ window.dataLayer.push(arguments); }
window.gtag = gtag;

gtag('js', new Date());

// Initialize config with Placeholder Measurement ID and Anonymous User ID
// No PII (Personally Identifiable Information) is sent
gtag('config', 'G-XXXXXXXXXX', {
    'user_id': getOrCreateUserId(),
    'anonymize_ip': true 
});

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
    
    // Debug mode visualizer
    if (localStorage.getItem('tarot_debug') === 'true') {
        console.log(`[Analytics] Event Tracked: ${eventName}`, eventParams);
    }
}
