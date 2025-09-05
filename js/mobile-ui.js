/**
 * Mobile UI Controller for RFFL Week 1 Median Webapp
 * Handles touch interactions, animations, and mobile-specific features
 */

class MobileUIController {
    constructor() {
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.refreshThreshold = 60;
        this.isRefreshing = false;
        this.hapticEnabled = this.checkHapticSupport();
        this.lastScoreUpdate = new Map();
        
        this.init();
    }

    init() {
        this.setupTouchHandlers();
        this.setupVisibilityHandlers();
        this.setupMedianTracker();
        this.enableHapticFeedback();
        
        console.log('📱 Mobile UI Controller initialized');
    }

    // Touch interaction handlers
    setupTouchHandlers() {
        // Pull to refresh
        this.setupPullToRefresh();
        
        // Score card interactions
        this.setupCardInteractions();
        
        // Swipe gestures for navigation
        this.setupSwipeGestures();
        
        // Long press for additional actions
        this.setupLongPressHandlers();
    }

    setupPullToRefresh() {
        let startY = 0;
        let startTime = 0;
        let isPulling = false;
        
        const pullIndicator = this.createPullIndicator();
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY <= 0) {
                startY = e.touches[0].clientY;
                startTime = Date.now();
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY <= 0 && !this.isRefreshing) {
                const currentY = e.touches[0].clientY;
                const pullDistance = Math.max(0, currentY - startY);
                
                if (pullDistance > 10) {
                    isPulling = true;
                    this.updatePullIndicator(pullIndicator, pullDistance);
                    
                    // Prevent default scrolling during pull
                    if (pullDistance > 30) {
                        e.preventDefault();
                    }
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isPulling) {
                const pullDistance = Math.max(0, document.body.getBoundingClientRect().top);
                
                if (pullDistance >= this.refreshThreshold && !this.isRefreshing) {
                    this.triggerRefresh();
                } else {
                    this.resetPullIndicator(pullIndicator);
                }
                
                isPulling = false;
            }
        }, { passive: true });
    }

    createPullIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pull-refresh-indicator';
        indicator.innerHTML = `
            <div class="flex flex-col items-center">
                <svg class="w-6 h-6 mb-2 transition-transform duration-300" id="pull-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <span class="text-sm font-medium" id="pull-text">Pull to refresh</span>
            </div>
        `;
        
        document.body.insertBefore(indicator, document.body.firstChild);
        return indicator;
    }

    updatePullIndicator(indicator, distance) {
        const icon = indicator.querySelector('#pull-icon');
        const text = indicator.querySelector('#pull-text');
        
        const progress = Math.min(distance / this.refreshThreshold, 1);
        const rotation = progress * 180;
        
        icon.style.transform = `rotate(${rotation}deg)`;
        
        if (distance >= this.refreshThreshold) {
            indicator.classList.add('visible');
            text.textContent = 'Release to refresh';
            icon.style.color = '#10b981';
        } else {
            text.textContent = 'Pull to refresh';
            icon.style.color = '#8b5cf6';
        }
        
        indicator.style.transform = `translateY(${Math.min(distance - 60, 0)}px)`;
    }

    resetPullIndicator(indicator) {
        indicator.classList.remove('visible');
        indicator.style.transform = 'translateY(-100%)';
        
        const icon = indicator.querySelector('#pull-icon');
        icon.style.transform = 'rotate(0deg)';
        icon.style.color = '#8b5cf6';
    }

    // Card interaction handlers
    setupCardInteractions() {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.live-score-card');
            if (card) {
                this.handleCardTap(card);
            }
        });
    }

    handleCardTap(card) {
        // Haptic feedback
        this.triggerHaptic('light');
        
        // Visual feedback
        card.classList.add('haptic-feedback');
        setTimeout(() => card.classList.remove('haptic-feedback'), 150);
        
        // Get team data
        const teamCode = card.dataset.team;
        if (teamCode) {
            this.showTeamQuickView(teamCode);
        }
    }

    // Swipe gestures
    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Only process quick swipes
            if (deltaTime > 300) return;
            
            // Horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
            
            // Vertical swipes
            if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    this.handleSwipeDown();
                } else {
                    this.handleSwipeUp();
                }
            }
        }, { passive: true });
    }

    handleSwipeRight() {
        // Could implement navigation to previous view
        this.triggerHaptic('light');
    }

    handleSwipeLeft() {
        // Could implement navigation to next view
        this.triggerHaptic('light');
    }

    handleSwipeDown() {
        // Could implement quick refresh
        if (window.scrollY <= 0) {
            this.triggerRefresh();
        }
    }

    handleSwipeUp() {
        // Could scroll to bottom or show more info
        this.triggerHaptic('light');
    }

    // Long press handlers
    setupLongPressHandlers() {
        let longPressTimer;
        let startPos = { x: 0, y: 0 };
        
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.live-score-card');
            if (target) {
                startPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                
                longPressTimer = setTimeout(() => {
                    this.handleLongPress(target);
                }, 500);
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const moveDistance = Math.sqrt(
                Math.pow(e.touches[0].clientX - startPos.x, 2) + 
                Math.pow(e.touches[0].clientY - startPos.y, 2)
            );
            
            if (moveDistance > 10) {
                clearTimeout(longPressTimer);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
    }

    handleLongPress(card) {
        this.triggerHaptic('medium');
        
        // Show context menu or detailed options
        const teamCode = card.dataset.team;
        this.showTeamContextMenu(card, teamCode);
    }

    // Median tracker setup
    setupMedianTracker() {
        this.createFloatingMedianIndicator();
        this.updateMedianVisualization();
    }

    createFloatingMedianIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'floating-median';
        indicator.innerHTML = `
            <div class="text-xs">MEDIAN</div>
            <div class="text-lg font-bold" id="floating-median-value">101.13</div>
        `;
        
        // Only show on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                indicator.style.opacity = '0.9';
            } else {
                indicator.style.opacity = '0';
            }
        });
        
        document.body.appendChild(indicator);
    }

    updateMedianVisualization() {
        // Update median progress bar positions
        const medianTracker = document.querySelector('.median-tracker');
        if (medianTracker) {
            // Calculate median position relative to score range
            this.positionMedianMarkers();
        }
    }

    positionMedianMarkers() {
        // This would be called when scores update to reposition median indicators
        const median = 101.13; // Current median
        const lowScore = 94.20;
        const highScore = 105.33;
        const range = highScore - lowScore;
        
        const medianPosition = ((median - lowScore) / range) * 100;
        
        const medianLine = document.querySelector('.median-line');
        if (medianLine) {
            medianLine.style.left = `${medianPosition}%`;
        }
    }

    // Haptic feedback
    checkHapticSupport() {
        return 'vibrate' in navigator || 'hapticFeedback' in navigator;
    }

    triggerHaptic(intensity = 'light') {
        if (!this.hapticEnabled) return;
        
        const patterns = {
            light: [10],
            medium: [15],
            strong: [25],
            double: [10, 100, 10],
            success: [10, 50, 10, 50, 10]
        };
        
        if (navigator.vibrate) {
            navigator.vibrate(patterns[intensity] || patterns.light);
        }
    }

    enableHapticFeedback() {
        // Add haptic class to interactive elements
        document.querySelectorAll('.live-score-card, .touch-button, .fab').forEach(el => {
            el.classList.add('haptic-feedback');
        });
    }

    // Score animations
    animateScoreUpdate(teamCode, newScore, oldScore) {
        const scoreElement = document.querySelector(`[data-team="${teamCode}"] .score-value`);
        if (scoreElement) {
            // Determine animation based on score change
            if (newScore > oldScore) {
                scoreElement.classList.add('score-animate');
                this.triggerHaptic('light');
                
                setTimeout(() => {
                    scoreElement.classList.remove('score-animate');
                }, 600);
            }
            
            // Update the displayed score with animation
            this.animateNumberChange(scoreElement, oldScore, newScore);
        }
    }

    animateNumberChange(element, from, to) {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * easeOut;
            
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // UI state management
    showTeamQuickView(teamCode) {
        // Create and show a quick overlay with team details
        const quickView = this.createQuickView(teamCode);
        document.body.appendChild(quickView);
        
        // Animate in
        requestAnimationFrame(() => {
            quickView.classList.add('show');
        });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideQuickView(quickView);
        }, 3000);
    }

    createQuickView(teamCode) {
        const view = document.createElement('div');
        view.className = 'fixed inset-x-4 top-20 bg-gray-800 rounded-xl p-4 shadow-lg transform translate-y-8 opacity-0 transition-all duration-300 z-50';
        view.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="font-bold text-white">Team ${teamCode} Details</h3>
                <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="mt-2 text-sm text-gray-300">
                Quick stats and info would go here...
            </div>
        `;
        
        // Add show class for animation
        view.addEventListener('animationend', () => {
            view.classList.add('show');
        });
        
        return view;
    }

    hideQuickView(view) {
        view.style.transform = 'translateY(-20px)';
        view.style.opacity = '0';
        
        setTimeout(() => {
            if (view.parentNode) {
                view.parentNode.removeChild(view);
            }
        }, 300);
    }

    showTeamContextMenu(card, teamCode) {
        // Implementation for context menu
        console.log('Show context menu for:', teamCode);
    }

    // Refresh functionality
    async triggerRefresh() {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        this.triggerHaptic('medium');
        
        // Show loading state
        this.showRefreshLoader();
        
        try {
            // Simulate API call or trigger actual refresh
            await this.performDataRefresh();
            
            // Success feedback
            this.triggerHaptic('success');
            this.showRefreshSuccess();
            
        } catch (error) {
            // Error feedback
            this.triggerHaptic('strong');
            this.showRefreshError(error);
            
        } finally {
            this.isRefreshing = false;
            this.hideRefreshLoader();
        }
    }

    showRefreshLoader() {
        // Implementation for refresh loading state
        console.log('Showing refresh loader...');
    }

    hideRefreshLoader() {
        // Implementation for hiding refresh loader
        console.log('Hiding refresh loader...');
    }

    async performDataRefresh() {
        // This would trigger the actual data refresh
        // For now, simulate with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Trigger score updates in the main app
        if (window.rfflApp && typeof window.rfflApp.refreshData === 'function') {
            await window.rfflApp.refreshData();
        }
    }

    showRefreshSuccess() {
        // Brief success indicator
        this.showToast('Updated!', 'success');
    }

    showRefreshError(error) {
        this.showToast('Update failed', 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-gray-700 text-gray-200'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 0)';
        });
        
        // Auto-remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -10px)';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    // Visibility handlers
    setupVisibilityHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // App became visible, refresh data
                this.triggerRefresh();
            }
        });
        
        // Handle page focus
        window.addEventListener('focus', () => {
            this.triggerRefresh();
        });
    }
}

// Initialize mobile UI when DOM is ready
let mobileUI;
document.addEventListener('DOMContentLoaded', () => {
    mobileUI = new MobileUIController();
    window.mobileUI = mobileUI; // Make available globally
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileUIController;
}