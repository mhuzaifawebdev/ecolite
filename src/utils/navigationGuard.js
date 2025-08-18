// navigationGuard.js
let guardFunction = null;
let pendingNavigation = null;

const navigationGuard = {
    setNavigationGuard: (guard) => {
        guardFunction = guard;
    },

    removeNavigationGuard: () => {
        guardFunction = null;
        pendingNavigation = null;
    },

    shouldPreventNavigation: async () => {
        if (!guardFunction) {
            return false;
        }

        return new Promise((resolve) => {
            // Store the navigation resolve function
            pendingNavigation = resolve;
            
            // Call the guard function and handle the result
            const result = guardFunction();
            
            if (result instanceof Promise) {
                result.then((shouldProceed) => {
                    resolve(!shouldProceed); // Return true to prevent, false to allow
                });
            } else {
                resolve(!result); // Return true to prevent, false to allow
            }
        });
    },

    // Method to resolve pending navigation
    resolvePendingNavigation: (shouldProceed) => {
        if (pendingNavigation) {
            pendingNavigation(!shouldProceed); // Return true to prevent, false to allow
            pendingNavigation = null;
        }
    }
};

export default navigationGuard;