// Simple event system for navigation guard
const navigationGuard = {
    callback: null,
    
    // Set the callback function that will be called before navigation
    setNavigationGuard(callback) {
        this.callback = callback;
    },

    // Remove the navigation guard
    removeNavigationGuard() {
        this.callback = null;
    },

    // Check if navigation should be prevented
    async shouldPreventNavigation() {
        if (!this.callback) return false;
        return await this.callback();
    }
};

export default navigationGuard;
