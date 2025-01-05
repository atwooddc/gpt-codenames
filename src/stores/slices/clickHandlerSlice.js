export const createClickHandlerSlice = (set, get) => ({
    // State
    waitingFor: null,         // describes what we're waiting for
    clickCallback: null,      // function to call on valid click
    showClickToAdvance: false, // whether to show the UI prompt

    // Core click handling
    handleGlobalClick: (event) => {
        const state = get();
        
        // If we're not waiting for anything, ignore clicks
        if (!state.waitingFor || !state.clickCallback) return;

        // Check if click is valid (not on an interactive element)
        if (state.isValidClick(event)) {
            const callback = state.clickCallback;
            
            // Clear the handler before executing callback
            // (callback might set up a new click handler)
            state.clearClickHandler();
            
            // Execute the callback
            callback();
        }
    },

    isValidClick: (event) => {
        // Check if click was on an interactive element
        const isActionElement = event.target.closest('.action');
        const isButton = event.target.tagName.toLowerCase() === 'button';
        const isInput = event.target.tagName.toLowerCase() === 'input';
        const isLink = event.target.tagName.toLowerCase() === 'a';

        // Consider click valid only if it's not on an interactive element
        return !isActionElement && !isButton && !isInput && !isLink;
    },

    // Methods for other slices to use
    setClickHandler: (waitingFor, callback) => {
        console.log(`Setting click handler for: ${waitingFor}`); // helpful for debugging
        
        set({
            waitingFor,
            clickCallback: callback,
            showClickToAdvance: true
        });

        // Make sure we have a global click listener
        get().ensureGlobalListener();
    },

    clearClickHandler: () => {
        set({
            waitingFor: null,
            clickCallback: null,
            showClickToAdvance: false
        });
    },

    // Lifecycle management
    ensureGlobalListener: () => {
        // This should be called when the app initializes
        if (!get().listenerInitialized) {
            document.addEventListener('click', get().handleGlobalClick);
            set({ listenerInitialized: true });
        }
    },

    removeGlobalListener: () => {
        // This should be called when the app unmounts
        document.removeEventListener('click', get().handleGlobalClick);
        set({ listenerInitialized: false });
    }
});