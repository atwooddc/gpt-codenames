export const RESET_ALL_CLUSTERS = 'RESET_ALL_CLUSTERS';

export const triggerReset = () => {
    // Create and dispatch a custom event that bubbles up through the DOM
    const resetEvent = new CustomEvent(RESET_ALL_CLUSTERS, {
        bubbles: true    // This allows the event to propagate up through parent elements
    });
    document.dispatchEvent(resetEvent);
};