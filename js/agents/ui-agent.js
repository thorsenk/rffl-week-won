/**
 * RFFL UI Agent - Autonomous User Interface Optimization
 * Handles adaptive UI optimization, user experience enhancement, and interface intelligence
 */

class UIAgent {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.subscribedTopics = [
            'ui.performance.check',
            'user.behavior.changed',
            'data.refreshed',
            'scoring.updated',
            'system.optimization.needed'
        ];
        
        this.state = {
            isActive: true,
            lastActivity: Date.now(),
            healthScore: 1.0,
            renderPerformance: 1.0,
            userSatisfaction: 0.8
        };

        this.performanceMetrics = new Map();
        this.userBehaviorPatterns = new Map();
        this.adaptiveSettings = new Map();
        this.optimizationStrategies = new Map();
        this.interactionHistory = [];
        
        this.setupPerformanceMonitoring();
        this.setupUserBehaviorTracking();
        this.setupAdaptiveOptimization();
    }

    async initialize() {
        console.log('🎨 Initializing UI Agent...');
        
        // Setup intelligent UI monitoring
        this.setupIntelligentUIMonitoring();
        
        // Initialize adaptive rendering
        this.initializeAdaptiveRendering();
        
        // Setup user experience optimization
        this.setupUXOptimization();
        
        // Start autonomous UI management loop
        this.startUIManagementLoop();
        
        console.log('✅ UI Agent initialized');
    }

    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            metrics: {
                fps: 60,
                renderTime: 0,
                memoryUsage: 0,
                domComplexity: 0,
                interactionLatency: 0
            },
            
            measureFPS: () => {
                let lastTime = performance.now();
                let frameCount = 0;
                
                const measureFrame = (currentTime) => {
                    frameCount++;
                    if (currentTime - lastTime >= 1000) {
                        this.performanceMonitor.metrics.fps = frameCount;
                        frameCount = 0;
                        lastTime = currentTime;
                    }
                    requestAnimationFrame(measureFrame);
                };
                
                requestAnimationFrame(measureFrame);
            },
            
            measureRenderTime: (operation, callback) => {
                const startTime = performance.now();
                const result = callback();
                const endTime = performance.now();
                
                this.performanceMonitor.metrics.renderTime = endTime - startTime;
                this.performanceMetrics.set(operation, {
                    duration: endTime - startTime,
                    timestamp: Date.now()
                });
                
                return result;
            },
            
            measureMemoryUsage: () => {
                if (performance.memory) {
                    this.performanceMonitor.metrics.memoryUsage = 
                        performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
                }
            },
            
            measureDOMComplexity: () => {
                this.performanceMonitor.metrics.domComplexity = document.querySelectorAll('*').length;
            }
        };
    }

    setupUserBehaviorTracking() {
        this.behaviorTracker = {
            trackInteraction: (type, element, context) => {
                const interaction = {
                    type,
                    element: element.tagName + (element.id ? `#${element.id}` : ''),
                    timestamp: Date.now(),
                    context,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                };
                
                this.interactionHistory.push(interaction);
                this.analyzeInteractionPattern(interaction);
                
                // Keep only last 1000 interactions
                if (this.interactionHistory.length > 1000) {
                    this.interactionHistory.shift();
                }
            },
            
            trackScrollBehavior: () => {
                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.behaviorTracker.trackInteraction('scroll', document.body, {
                            scrollY: window.scrollY,
                            scrollHeight: document.body.scrollHeight
                        });
                    }, 150);
                });
            },
            
            trackResizeBehavior: () => {
                window.addEventListener('resize', () => {
                    this.behaviorTracker.trackInteraction('resize', window, {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        devicePixelRatio: window.devicePixelRatio
                    });
                    
                    // Trigger responsive optimization
                    this.optimizeForViewport();
                });
            },
            
            trackClickPatterns: () => {
                document.addEventListener('click', (event) => {
                    this.behaviorTracker.trackInteraction('click', event.target, {
                        x: event.clientX,
                        y: event.clientY,
                        button: event.button
                    });
                });
            }
        };
    }

    setupAdaptiveOptimization() {
        this.optimizationStrategies.set('performance', {
            name: 'Performance Optimization',
            triggers: ['fps_low', 'render_slow', 'memory_high'],
            actions: [
                'reduceAnimations',
                'simplifyCharts',
                'enableVirtualization',
                'optimizeImages'
            ]
        });

        this.optimizationStrategies.set('accessibility', {
            name: 'Accessibility Enhancement',
            triggers: ['keyboard_navigation', 'screen_reader_detected'],
            actions: [
                'enhanceKeyboardNavigation',
                'improveARIALabels',
                'increaseContrastRatio',
                'addSkipLinks'
            ]
        });

        this.optimizationStrategies.set('mobile', {
            name: 'Mobile Optimization',
            triggers: ['small_viewport', 'touch_interaction'],
            actions: [
                'enlargeTouchTargets',
                'simplifyNavigation',
                'optimizeScrolling',
                'enablePullToRefresh'
            ]
        });

        this.optimizationStrategies.set('user_preference', {
            name: 'User Preference Adaptation',
            triggers: ['interaction_pattern', 'usage_frequency'],
            actions: [
                'personalizeInterface',
                'adjustUpdateFrequency',
                'customizeLayout',
                'enableAdvancedFeatures'
            ]
        });
    }

    setupIntelligentUIMonitoring() {
        this.intelligentMonitor = {
            observeElements: () => {
                // Setup Intersection Observer for viewport optimization
                this.setupIntersectionObserver();
                
                // Setup Mutation Observer for DOM change monitoring
                this.setupMutationObserver();
                
                // Setup Resize Observer for responsive optimization
                this.setupResizeObserver();
            },
            
            monitorInteractionLatency: () => {
                const interactionTypes = ['click', 'touchstart', 'keydown'];
                
                interactionTypes.forEach(type => {
                    document.addEventListener(type, (event) => {
                        const startTime = performance.now();
                        
                        requestAnimationFrame(() => {
                            const latency = performance.now() - startTime;
                            this.performanceMonitor.metrics.interactionLatency = latency;
                            
                            if (latency > 100) { // 100ms threshold
                                this.orchestrator.messageBus.publish('ui.interaction.slow', {
                                    type,
                                    latency,
                                    element: event.target.tagName
                                }, 'UIAgent');
                            }
                        });
                    });
                });
            }
        };
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is visible - optimize for display
                    this.optimizeVisibleElement(entry.target);
                } else {
                    // Element is not visible - defer updates
                    this.deferElementUpdates(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: [0, 0.1, 0.5, 1.0]
        });

        // Observe key elements
        setTimeout(() => {
            document.querySelectorAll('.median-matchup-box, .standings-row, canvas').forEach(el => {
                this.intersectionObserver.observe(el);
            });
        }, 1000);
    }

    setupMutationObserver() {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // DOM structure changed
                    this.handleDOMChange(mutation);
                } else if (mutation.type === 'attributes') {
                    // Attributes changed
                    this.handleAttributeChange(mutation);
                }
            });
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    setupResizeObserver() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    this.handleElementResize(entry.target, entry.contentRect);
                });
            });

            // Observe key containers
            setTimeout(() => {
                document.querySelectorAll('.chart-container, .teams-grid, .standings-table').forEach(el => {
                    this.resizeObserver.observe(el);
                });
            }, 1000);
        }
    }

    initializeAdaptiveRendering() {
        this.adaptiveRenderer = {
            renderWithOptimization: (renderFunction, context) => {
                const shouldOptimize = this.shouldOptimizeRendering();
                
                if (shouldOptimize) {
                    return this.optimizedRender(renderFunction, context);
                } else {
                    return this.performanceMonitor.measureRenderTime(context, renderFunction);
                }
            },
            
            batchUpdates: (() => {
                const updateQueue = [];
                let batchTimeout = null;
                
                return (updateFunction) => {
                    updateQueue.push(updateFunction);
                    
                    if (batchTimeout) clearTimeout(batchTimeout);
                    
                    batchTimeout = setTimeout(() => {
                        const startTime = performance.now();
                        
                        updateQueue.forEach(update => {
                            try {
                                update();
                            } catch (error) {
                                console.warn('Batched update failed:', error);
                            }
                        });
                        
                        updateQueue.length = 0;
                        
                        const batchTime = performance.now() - startTime;
                        this.performanceMetrics.set('batch_update', {
                            duration: batchTime,
                            updateCount: updateQueue.length,
                            timestamp: Date.now()
                        });
                    }, 16); // Next frame
                };
            })(),
            
            virtualizeList: (container, items, renderItem) => {
                // Simple virtualization for large lists
                const containerHeight = container.clientHeight;
                const itemHeight = 50; // Estimated item height
                const visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
                
                const scrollTop = container.scrollTop;
                const startIndex = Math.floor(scrollTop / itemHeight);
                const endIndex = Math.min(startIndex + visibleItems, items.length);
                
                const visibleData = items.slice(startIndex, endIndex);
                
                container.innerHTML = '';
                container.style.height = `${items.length * itemHeight}px`;
                container.style.paddingTop = `${startIndex * itemHeight}px`;
                
                visibleData.forEach(item => {
                    const element = renderItem(item);
                    container.appendChild(element);
                });
            }
        };
    }

    setupUXOptimization() {
        this.uxOptimizer = {
            optimizeForUser: (userProfile) => {
                // Personalize interface based on user behavior
                if (userProfile.isExpertUser) {
                    this.enableAdvancedFeatures();
                }
                
                if (userProfile.prefersFastUpdates) {
                    this.increaseUpdateFrequency();
                }
                
                if (userProfile.usesMobile) {
                    this.optimizeForMobile();
                }
            },
            
            adaptToContext: (context) => {
                switch (context) {
                    case 'live_game':
                        this.optimizeForLiveUpdates();
                        break;
                    case 'data_loading':
                        this.showIntelligentLoading();
                        break;
                    case 'error_state':
                        this.showGracefulError();
                        break;
                }
            },
            
            improveAccessibility: () => {
                // Dynamic accessibility improvements
                this.enhanceKeyboardNavigation();
                this.improveScreenReaderSupport();
                this.adjustColorContrast();
            }
        };
    }

    startUIManagementLoop() {
        // Main UI optimization loop
        setInterval(() => {
            this.autonomousUIOptimization();
        }, 5000); // Every 5 seconds

        // Performance monitoring loop
        setInterval(() => {
            this.monitorUIPerformance();
        }, 1000); // Every second

        // User behavior analysis loop
        setInterval(() => {
            this.analyzeUserBehavior();
        }, 30000); // Every 30 seconds

        // Start performance monitoring
        this.performanceMonitor.measureFPS();
        this.behaviorTracker.trackScrollBehavior();
        this.behaviorTracker.trackResizeBehavior();
        this.behaviorTracker.trackClickPatterns();
        this.intelligentMonitor.observeElements();
        this.intelligentMonitor.monitorInteractionLatency();
    }

    async autonomousUIOptimization() {
        try {
            // Analyze current UI state
            const uiState = this.analyzeUIState();
            
            // Determine optimization needs
            const optimizations = this.determineOptimizations(uiState);
            
            // Apply optimizations
            for (const optimization of optimizations) {
                await this.applyOptimization(optimization);
            }
            
            // Update state
            this.updateUIState();
            
        } catch (error) {
            console.error('UI optimization error:', error);
            this.handleUIError(error);
        }
    }

    analyzeUIState() {
        return {
            performance: {
                fps: this.performanceMonitor.metrics.fps,
                renderTime: this.performanceMonitor.metrics.renderTime,
                memoryUsage: this.performanceMonitor.metrics.memoryUsage,
                domComplexity: this.performanceMonitor.metrics.domComplexity,
                interactionLatency: this.performanceMonitor.metrics.interactionLatency
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
                isMobile: window.innerWidth < 768
            },
            userBehavior: this.getUserBehaviorSummary(),
            context: this.determineCurrentContext()
        };
    }

    determineOptimizations(uiState) {
        const optimizations = [];
        
        // Performance-based optimizations
        if (uiState.performance.fps < 30) {
            optimizations.push({ type: 'performance', action: 'reduce_animations' });
        }
        
        if (uiState.performance.renderTime > 50) {
            optimizations.push({ type: 'performance', action: 'optimize_rendering' });
        }
        
        if (uiState.performance.memoryUsage > 0.8) {
            optimizations.push({ type: 'performance', action: 'cleanup_memory' });
        }
        
        // Viewport-based optimizations
        if (uiState.viewport.isMobile && !this.adaptiveSettings.get('mobile_optimized')) {
            optimizations.push({ type: 'mobile', action: 'optimize_mobile' });
        }
        
        // User behavior-based optimizations
        if (uiState.userBehavior.scrollFrequency > 0.8) {
            optimizations.push({ type: 'ux', action: 'improve_scrolling' });
        }
        
        if (uiState.userBehavior.clickAccuracy < 0.7) {
            optimizations.push({ type: 'ux', action: 'enlarge_targets' });
        }
        
        return optimizations;
    }

    async applyOptimization(optimization) {
        try {
            switch (optimization.action) {
                case 'reduce_animations':
                    await this.reduceAnimations();
                    break;
                case 'optimize_rendering':
                    await this.optimizeRendering();
                    break;
                case 'cleanup_memory':
                    await this.cleanupMemory();
                    break;
                case 'optimize_mobile':
                    await this.optimizeForMobile();
                    break;
                case 'improve_scrolling':
                    await this.improveScrolling();
                    break;
                case 'enlarge_targets':
                    await this.enlargeTouchTargets();
                    break;
            }
            
            console.log(`✅ Applied optimization: ${optimization.action}`);
        } catch (error) {
            console.error(`Failed to apply optimization ${optimization.action}:`, error);
        }
    }

    // Optimization Implementation Methods
    async reduceAnimations() {
        const animatedElements = document.querySelectorAll('.animate-pulse, .animate-bounce, .animate-spin');
        animatedElements.forEach(el => {
            el.classList.add('reduce-motion');
        });
        
        // Add CSS for reduced motion
        if (!document.getElementById('reduced-motion-styles')) {
            const style = document.createElement('style');
            style.id = 'reduced-motion-styles';
            style.textContent = `
                .reduce-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.adaptiveSettings.set('animations_reduced', true);
    }

    async optimizeRendering() {
        // Enable GPU acceleration for key elements
        const keyElements = document.querySelectorAll('.median-matchup-box, .standings-row');
        keyElements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform';
        });
        
        // Implement render batching
        if (window.rfflApp && window.rfflApp.renderTeamsGrid) {
            const originalRender = window.rfflApp.renderTeamsGrid;
            window.rfflApp.renderTeamsGrid = () => {
                this.adaptiveRenderer.batchUpdates(originalRender.bind(window.rfflApp));
            };
        }
    }

    async cleanupMemory() {
        // Clean up unused chart instances
        if (window.rfflApp && window.rfflApp.charts) {
            Object.values(window.rfflApp.charts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    const canvas = chart.canvas;
                    if (canvas && !canvas.isConnected) {
                        chart.destroy();
                    }
                }
            });
        }
        
        // Clear old performance metrics
        const oldMetrics = [];
        this.performanceMetrics.forEach((value, key) => {
            if (Date.now() - value.timestamp > 300000) { // 5 minutes old
                oldMetrics.push(key);
            }
        });
        oldMetrics.forEach(key => this.performanceMetrics.delete(key));
        
        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    async optimizeForMobile() {
        // Enlarge touch targets
        const interactiveElements = document.querySelectorAll('button, .cursor-pointer, .hover\\:scale-105');
        interactiveElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
            el.style.padding = '12px';
        });
        
        // Optimize scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.overflowScrolling = 'touch';
        
        // Enable pull-to-refresh if available
        if ('serviceWorker' in navigator) {
            this.enablePullToRefresh();
        }
        
        this.adaptiveSettings.set('mobile_optimized', true);
    }

    async improveScrolling() {
        // Add smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Implement virtual scrolling for large lists
        const longLists = document.querySelectorAll('[data-long-list]');
        longLists.forEach(list => {
            this.implementVirtualScrolling(list);
        });
    }

    async enlargeTouchTargets() {
        const smallTargets = document.querySelectorAll('button, a, .cursor-pointer');
        smallTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
                target.style.padding = '8px';
            }
        });
    }

    // User Behavior Analysis
    getUserBehaviorSummary() {
        const recentInteractions = this.interactionHistory.slice(-100);
        if (recentInteractions.length === 0) {
            return { scrollFrequency: 0, clickAccuracy: 1, interactionRate: 0 };
        }

        const scrolls = recentInteractions.filter(i => i.type === 'scroll').length;
        const clicks = recentInteractions.filter(i => i.type === 'click').length;
        const totalTime = recentInteractions[recentInteractions.length - 1].timestamp - recentInteractions[0].timestamp;

        return {
            scrollFrequency: scrolls / recentInteractions.length,
            clickAccuracy: this.calculateClickAccuracy(recentInteractions),
            interactionRate: recentInteractions.length / (totalTime / 1000 / 60), // interactions per minute
            isActiveUser: recentInteractions.length > 20
        };
    }

    calculateClickAccuracy(interactions) {
        const clicks = interactions.filter(i => i.type === 'click');
        if (clicks.length === 0) return 1;

        // Simple heuristic: clicks on interactive elements are "accurate"
        const accurateClicks = clicks.filter(click => {
            const element = document.querySelector(click.element);
            return element && (
                element.tagName === 'BUTTON' ||
                element.classList.contains('cursor-pointer') ||
                element.closest('button, .cursor-pointer')
            );
        });

        return accurateClicks.length / clicks.length;
    }

    analyzeInteractionPattern(interaction) {
        // Real-time pattern analysis
        const patternKey = `${interaction.type}_${interaction.context?.viewport?.width < 768 ? 'mobile' : 'desktop'}`;
        
        if (!this.userBehaviorPatterns.has(patternKey)) {
            this.userBehaviorPatterns.set(patternKey, { count: 0, lastSeen: 0 });
        }
        
        const pattern = this.userBehaviorPatterns.get(patternKey);
        pattern.count++;
        pattern.lastSeen = Date.now();
        
        // Trigger adaptations based on patterns
        if (pattern.count > 10 && interaction.type === 'scroll') {
            this.optimizeScrolling();
        }
    }

    determineCurrentContext() {
        // Determine current application context
        if (window.espnAPI && window.espnAPI.isWeek1Live()) {
            return 'live_game';
        }
        
        if (document.querySelector('.loading, .spinner')) {
            return 'data_loading';
        }
        
        if (document.querySelector('.error, .alert-error')) {
            return 'error_state';
        }
        
        return 'normal';
    }

    // Performance Monitoring
    monitorUIPerformance() {
        this.performanceMonitor.measureMemoryUsage();
        this.performanceMonitor.measureDOMComplexity();
        
        const metrics = this.performanceMonitor.metrics;
        
        // Check for performance issues
        if (metrics.fps < 30) {
            this.orchestrator.messageBus.publish('ui.performance.slow', {
                metric: 'fps',
                value: metrics.fps,
                threshold: 30
            }, 'UIAgent');
        }
        
        if (metrics.renderTime > 100) {
            this.orchestrator.messageBus.publish('ui.performance.slow', {
                metric: 'renderTime',
                value: metrics.renderTime,
                threshold: 100
            }, 'UIAgent');
        }
        
        if (metrics.memoryUsage > 0.8) {
            this.orchestrator.messageBus.publish('ui.memory.high', {
                usage: metrics.memoryUsage,
                threshold: 0.8
            }, 'UIAgent');
        }
    }

    analyzeUserBehavior() {
        const behaviorSummary = this.getUserBehaviorSummary();
        
        // Detect user preference changes
        if (behaviorSummary.isActiveUser && behaviorSummary.interactionRate > 5) {
            this.orchestrator.messageBus.publish('user.behavior.changed', {
                type: 'high_engagement',
                data: behaviorSummary
            }, 'UIAgent');
        }
        
        // Detect mobile usage patterns
        const recentInteractions = this.interactionHistory.slice(-20);
        const mobileInteractions = recentInteractions.filter(i => i.viewport && i.viewport.width < 768);
        
        if (mobileInteractions.length / recentInteractions.length > 0.8) {
            this.orchestrator.messageBus.publish('user.behavior.changed', {
                type: 'mobile_focused',
                data: { mobileRatio: mobileInteractions.length / recentInteractions.length }
            }, 'UIAgent');
        }
    }

    // Event Handlers
    optimizeVisibleElement(element) {
        // Optimize elements that are visible
        element.style.willChange = 'transform, opacity';
        
        // Prioritize updates for visible elements
        if (element.classList.contains('median-matchup-box')) {
            element.setAttribute('data-priority', 'high');
        }
    }

    deferElementUpdates(element) {
        // Defer updates for non-visible elements
        element.style.willChange = 'auto';
        element.removeAttribute('data-priority');
    }

    handleDOMChange(mutation) {
        // React to DOM structure changes
        if (mutation.addedNodes.length > 10) {
            // Large DOM change - might affect performance
            setTimeout(() => this.monitorUIPerformance(), 100);
        }
    }

    handleAttributeChange(mutation) {
        // React to attribute changes
        if (mutation.attributeName === 'class' && mutation.target.classList.contains('animate-pulse')) {
            // Animation added - monitor performance impact
            this.trackAnimationPerformance(mutation.target);
        }
    }

    handleElementResize(element, rect) {
        // React to element size changes
        if (element.tagName === 'CANVAS') {
            // Chart resized - might need re-rendering optimization
            this.optimizeChartRendering(element);
        }
    }

    optimizeForViewport() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        if (isMobile && !this.adaptiveSettings.get('mobile_optimized')) {
            this.optimizeForMobile();
        } else if (!isMobile && this.adaptiveSettings.get('mobile_optimized')) {
            this.optimizeForDesktop();
        }
    }

    async optimizeForDesktop() {
        // Remove mobile-specific optimizations
        const elements = document.querySelectorAll('[style*="min-height: 44px"]');
        elements.forEach(el => {
            el.style.minHeight = '';
            el.style.minWidth = '';
        });
        
        this.adaptiveSettings.set('mobile_optimized', false);
    }

    // Advanced Features
    enableAdvancedFeatures() {
        // Enable features for expert users
        const advancedElements = document.querySelectorAll('[data-advanced]');
        advancedElements.forEach(el => {
            el.style.display = 'block';
        });
    }

    increaseUpdateFrequency() {
        // Increase update frequency for engaged users
        if (window.rfflApp && window.rfflApp.updateInterval) {
            clearInterval(window.rfflApp.updateInterval);
            window.rfflApp.updateInterval = setInterval(() => {
                window.rfflApp.refreshData();
            }, 2 * 60 * 1000); // 2 minutes instead of 5
        }
    }

    enablePullToRefresh() {
        // Implement pull-to-refresh for mobile
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;
                
                if (pullDistance > 0 && pullDistance < 100) {
                    // Visual feedback for pull-to-refresh
                    document.body.style.transform = `translateY(${pullDistance / 3}px)`;
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 60) {
                // Trigger refresh
                if (window.rfflApp && window.rfflApp.refreshData) {
                    window.rfflApp.refreshData();
                }
            }
            
            // Reset
            document.body.style.transform = '';
            startY = 0;
            pullDistance = 0;
        });
    }

    // Accessibility Improvements
    enhanceKeyboardNavigation() {
        // Add keyboard navigation support
        const interactiveElements = document.querySelectorAll('button, .cursor-pointer, [tabindex]');
        
        interactiveElements.forEach((el, index) => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', index + 1);
            }
            
            // Add keyboard event handlers
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    improveScreenReaderSupport() {
        // Add ARIA labels and descriptions
        const teamBoxes = document.querySelectorAll('.median-matchup-box');
        teamBoxes.forEach(box => {
            const teamCode = box.querySelector('.text-lg')?.textContent;
            const score = box.querySelector('.text-2xl')?.textContent;
            
            if (teamCode && score) {
                box.setAttribute('aria-label', `Team ${teamCode}, Score ${score}`);
                box.setAttribute('role', 'button');
            }
        });
    }

    adjustColorContrast() {
        // Improve color contrast for accessibility
        const lowContrastElements = document.querySelectorAll('.text-gray-400, .text-gray-500');
        lowContrastElements.forEach(el => {
            el.classList.remove('text-gray-400', 'text-gray-500');
            el.classList.add('text-gray-300');
        });
    }

    // Utility Methods
    shouldOptimizeRendering() {
        return this.performanceMonitor.metrics.fps < 45 || 
               this.performanceMonitor.metrics.renderTime > 50 ||
               this.performanceMonitor.metrics.memoryUsage > 0.7;
    }

    optimizedRender(renderFunction, context) {
        return new Promise((resolve) => {
            requestIdleCallback(() => {
                const result = this.performanceMonitor.measureRenderTime(context, renderFunction);
                resolve(result);
            }, { timeout: 100 });
        });
    }

    trackAnimationPerformance(element) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 16) { // Longer than one frame
                    console.warn('Slow animation detected:', entry);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }

    optimizeChartRendering(canvas) {
        // Optimize chart rendering based on size
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Adjust canvas resolution based on size and device
        if (rect.width < 400) {
            canvas.style.imageRendering = 'pixelated';
        } else {
            canvas.style.imageRendering = 'auto';
        }
    }

    implementVirtualScrolling(container) {
        // Simple virtual scrolling implementation
        const items = Array.from(container.children);
        const itemHeight = items[0]?.offsetHeight || 50;
        
        container.addEventListener('scroll', () => {
            this.adaptiveRenderer.virtualizeList(container, items, (item) => item);
        });
    }

    updateUIState() {
        this.state.lastActivity = Date.now();
        this.state.renderPerformance = Math.min(1.0, 60 / Math.max(this.performanceMonitor.metrics.fps, 1));
        
        // Update health score based on performance
        if (this.performanceMonitor.metrics.fps > 45) {
            this.state.healthScore = Math.min(1.0, this.state.healthScore + 0.01);
        } else {
            this.state.healthScore = Math.max(0.1, this.state.healthScore - 0.05);
        }
    }

    handleUIError(error) {
        this.state.healthScore = Math.max(0, this.state.healthScore - 0.1);
        console.error('UI Agent error:', error);
        
        this.orchestrator.messageBus.publish('agent.error', {
            agent: 'UIAgent',
            error: error.message,
            severity: 'medium'
        }, 'UIAgent');
    }

    // Message handling
    handleMessage(message) {
        switch (message.topic) {
            case 'data.refreshed':
                // Update UI with fresh data
                this.handleDataRefresh(message.data);
                break;
            
            case 'scoring.updated':
                // Update median display
                this.handleScoringUpdate(message.data);
                break;
            
            case 'ui.performance.check':
                // Run performance check
                this.monitorUIPerformance();
                break;
            
            case 'user.behavior.changed':
                // Adapt to user behavior changes
                this.adaptToUserBehavior(message.data);
                break;
            
            case 'system.optimization.needed':
                // Apply system-wide optimizations
                this.applySystemOptimizations(message.data);
                break;
        }
    }

    handleDataRefresh(data) {
        // Intelligently update UI with new data
        this.adaptiveRenderer.batchUpdates(() => {
            // Update would happen here
            console.log('UI updated with fresh data');
        });
    }

    handleScoringUpdate(data) {
        // Update median-related UI elements
        const medianElement = document.getElementById('current-median');
        if (medianElement && data.median) {
            this.adaptiveRenderer.renderWithOptimization(() => {
                medianElement.textContent = data.median.toFixed(2);
                medianElement.classList.add('animate-pulse');
                setTimeout(() => medianElement.classList.remove('animate-pulse'), 1000);
            }, 'median_update');
        }
    }

    adaptToUserBehavior(behaviorData) {
        if (behaviorData.type === 'high_engagement') {
            this.increaseUpdateFrequency();
            this.enableAdvancedFeatures();
        } else if (behaviorData.type === 'mobile_focused') {
            this.optimizeForMobile();
        }
    }

    applySystemOptimizations(optimizationData) {
        if (optimizationData.type === 'performance') {
            this.reduceAnimations();
            this.optimizeRendering();
        }
    }

    // Agent interface methods
    async executeAction(decision) {
        try {
            switch (decision.action) {
                case 'reduce_animations':
                    return await this.executeAnimationReduction(decision.params);
                
                case 'adjust_interface':
                    return await this.executeInterfaceAdjustment(decision.params);
                
                default:
                    return { success: false, error: 'Unknown action' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeAnimationReduction(params) {
        if (params.disableNonEssentialAnimations) {
            await this.reduceAnimations();
        }
        
        if (params.simplifyCharts) {
            // Simplify chart rendering
            const charts = document.querySelectorAll('canvas');
            charts.forEach(canvas => {
                canvas.style.imageRendering = 'pixelated';
            });
        }
        
        if (params.enableVirtualization) {
            const longLists = document.querySelectorAll('[data-long-list]');
            longLists.forEach(list => this.implementVirtualScrolling(list));
        }
        
        return { success: true, optimizations: Object.keys(params).filter(key => params[key]) };
    }

    async executeInterfaceAdjustment(params) {
        if (params.increaseUpdateFrequency) {
            this.increaseUpdateFrequency();
        }
        
        if (params.showMoreDetails) {
            this.enableAdvancedFeatures();
        }
        
        if (params.enableAdvancedFeatures) {
            this.enableAdvancedFeatures();
        }
        
        return { success: true, adjustments: Object.keys(params).filter(key => params[key]) };
    }

    isActive() {
        return this.state.isActive;
    }

    isResponsive() {
        const timeSinceActivity = Date.now() - this.state.lastActivity;
        return timeSinceActivity < 120000; // 2 minutes
    }

    isEssential() {
        return true; // UI agent is essential
    }

    getHealthMetrics() {
        return {
            score: this.state.healthScore,
            renderPerformance: this.state.renderPerformance,
            userSatisfaction: this.state.userSatisfaction,
            fps: this.performanceMonitor.metrics.fps,
            renderTime: this.performanceMonitor.metrics.renderTime,
            memoryUsage: this.performanceMonitor.metrics.memoryUsage,
            lastActivity: this.state.lastActivity
        };
    }

    getLastActivity() {
        return this.state.lastActivity;
    }

    pause() {
        this.state.isActive = false;
        console.log('⏸️ UI Agent paused');
    }

    resume() {
        this.state.isActive = true;
        this.state.lastActivity = Date.now();
        console.log('▶️ UI Agent resumed');
    }
}

window.UIAgent = UIAgent;
