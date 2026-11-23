/*
 * PAPAFIT measurement setup, leave values empty until IDs have been verified.
 * Enter either GTM_ID and configure both Google Analytics / Meta inside GTM,
 * OR supply GA4_ID and META_PIXEL_ID for the direct integration.
 * Do not fill both GTM_ID and GA4_ID to avoid duplicate counting.
 */
window.PAPAFIT_TRACKING_CONFIG = Object.freeze({
  GTM_ID: 'GTM-MM6R74CT',          // example: GTM-XXXXXXX
  GA4_ID: '',          // example: G-XXXXXXXXXX (used only when GTM_ID empty)
  META_PIXEL_ID: ''    // example: 123456789012345 (used only when GTM_ID empty)
});
