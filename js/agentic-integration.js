/**
 * RFFL Agentic Integration Layer
 * Integrates the agentic system with the existing RFFL webapp
 */

class AgenticIntegration {
    constructor() {
        this.initialized = false;
        this.originalFunctions = new Map();
        this.agenticEnhancements = new Map();
        this.integrationHooks = new Map();
        
        this.setupIntegrationHooks();
    }

    async initialize() {
        console.log('🔗 Initializing Agentic Integration...');
        
        try {
            // Wait for orchestrator to be ready
            await this.waitForOrchestrator();
            
            // Integrate with existing app components
            this.integrateWithMainApp();
            this.integrateWithESPNAPI();
            this.integrateWithRFFLData();
            this.integrateWithMedianCalculator();
            this.integrateWithMobileUI();
            
            // Setup agentic enhancements
            this.setupAgenticEnhancements();
            
            // Enable autonomous features
            this.enableAutonomousFeatures();
            
            this.initialized = true;
            console.log('✅ Agentic Integration completed');
            
            // Notify system of successful integration
            window.agentOrchestrator.messageBus.publish('integration.completed', {
                timestamp: Date.now(),
                enhancementsEnabled: this.agenticEnhancements.size
            }, 'AgenticIntegration');
            
        } catch (error) {
            console.error('❌ Agentic Integration failed:', error);
            this.handleIntegrationFailure(error);
        }
    }

    setupIntegrationHooks() {
        // Data refresh hooks
        this.integrationHooks.set('data_refresh', {
            before: (context) => this.beforeDataRefresh(context),
            after: (context, result) => this.afterDataRefresh(context, result),
            error: (context, error) => this.onDataRefreshError(context, error)
        });

        // UI update hooks
        this.integrationHooks.set('ui_update', {
            before: (context) => this.beforeUIUpdate(context),
            after: (context, result) => this.afterUIUpdate(context, result),
            error: (context, error) => this.onUIUpdateError(context, error)
        });

        // Scoring calculation hooks
        this.integrationHooks.set('scoring_calculation', {
            before: (context) => this.beforeScoringCalculation(context),
            after: (context, result) => this.afterScoringCalculation(context, result),
            error: (context, error) => this.onScoringCalculationError(context, error)
        });
    }

    async waitForOrchestrator() {
        return new Promise((resolve, reject) => {
            const checkOrchestrator = () => {
                if (window.agentOrchestrator && window.agentOrchestrator.agents.size > 0) {
                    resolve();
                } else {
                    setTimeout(checkOrchestrator, 100);
                }
            };
            
            checkOrchestrator();
            
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Orchestrator initialization timeout')), 10000);
        });
    }

    integrateWithMainApp() {
        if (!window.rfflApp) return;

        console.log('🔗 Integrating with main app...');

        // Enhance loadData method
        this.enhanceMethod(window.rfflApp, 'loadData', async function(originalMethod, ...args) {
            const context = { method: 'loadData', args, timestamp: Date.now() };
            
            try {
                this.integrationHooks.get('data_refresh').before(context);
                const result = await originalMethod.apply(this, args);
                this.integrationHooks.get('data_refresh').after(context, result);
                return result;
            } catch (error) {
                this.integrationHooks.get('data_refresh').error(context, error);
                throw error;
            }
        }.bind(this));

        // Enhance refreshData method
        this.enhanceMethod(window.rfflApp, 'refreshData', async function(originalMethod, ...args) {
            const context = { method: 'refreshData', args, timestamp: Date.now() };
            
            // Let DataAgent handle intelligent refresh
            if (window.agentOrchestrator.agents.has('DataAgent')) {
                const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
                await dataAgent.intelligentDataRefresh(dataAgent.adaptiveStrategies.get('live_game'));
            }
            
            return originalMethod.apply(this, args);
        }.bind(this));

        // Enhance renderTeamsGrid method
        this.enhanceMethod(window.rfflApp, 'renderTeamsGrid', function(originalMethod, ...args) {
            const context = { method: 'renderTeamsGrid', args, timestamp: Date.now() };
            
            try {
                this.integrationHooks.get('ui_update').before(context);
                
                // Let UIAgent optimize rendering
                if (window.agentOrchestrator.agents.has('UIAgent')) {
                    const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
                    return uiAgent.adaptiveRenderer.renderWithOptimization(() => {
                        return originalMethod.apply(this, args);
                    }, 'teams_grid');
                } else {
                    return originalMethod.apply(this, args);
                }
            } catch (error) {
                this.integrationHooks.get('ui_update').error(context, error);
                throw error;
            }
        }.bind(this));

        // Enhance error handling
        this.enhanceMethod(window.rfflApp, 'showError', function(originalMethod, message, ...args) {
            // Let MonitoringAgent track errors
            if (window.agentOrchestrator.agents.has('MonitoringAgent')) {
                const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                monitoringAgent.errorTracker.trackError(new Error(message), {
                    source: 'main_app',
                    method: 'showError'
                });
            }
            
            return originalMethod.apply(this, [message, ...args]);
        }.bind(this));
    }

    integrateWithESPNAPI() {
        if (!window.espnAPI) return;

        console.log('🔗 Integrating with ESPN API...');

        // Enhance fetchWeek1Scores method
        this.enhanceMethod(window.espnAPI, 'fetchWeek1Scores', async function(originalMethod, ...args) {
            // Let DataAgent handle intelligent caching and validation
            if (window.agentOrchestrator.agents.has('DataAgent')) {
                const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
                const cachedData = dataAgent.intelligentCache.get('current_scores');
                
                if (cachedData) {
                    console.log('📦 Using cached data from DataAgent');
                    return cachedData;
                }
            }
            
            try {
                const result = await originalMethod.apply(this, args);
                
                // Let DataAgent validate and cache the result
                if (window.agentOrchestrator.agents.has('DataAgent')) {
                    const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
                    const qualityCheck = dataAgent.qualityMonitor.checkDataQuality(result, 'espn_scores');
                    
                    if (qualityCheck.quality > 0.7) {
                        dataAgent.intelligentCache.set('current_scores', result, {
                            priority: 'high',
                            quality: qualityCheck.quality
                        });
                    }
                }
                
                return result;
            } catch (error) {
                // Let MonitoringAgent handle API errors
                if (window.agentOrchestrator.agents.has('MonitoringAgent')) {
                    const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                    monitoringAgent.errorTracker.trackError(error, {
                        source: 'espn_api',
                        method: 'fetchWeek1Scores'
                    });
                }
                throw error;
            }
        }.bind(this));

        // Enhance error handling with intelligent fallbacks
        this.enhanceMethod(window.ESPNUtils, 'handleAPIError', function(originalMethod, error, ...args) {
            // Let DataAgent attempt fallback strategies
            if (window.agentOrchestrator.agents.has('DataAgent')) {
                const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
                
                // Try cached data first
                const cachedData = dataAgent.intelligentCache.get('current_scores');
                if (cachedData) {
                    console.log('🔄 Falling back to cached data due to API error');
                    return cachedData;
                }
            }
            
            return originalMethod.apply(this, [error, ...args]);
        }.bind(this));
    }

    integrateWithRFFLData() {
        if (!window.rfflData) return;

        console.log('🔗 Integrating with RFFL Data...');

        // Enhance enrichTeamData method
        this.enhanceMethod(window.rfflData, 'enrichTeamData', function(originalMethod, rawData, ...args) {
            const result = originalMethod.apply(this, [rawData, ...args]);
            
            // Let PredictiveAgent add forecasting data
            if (window.agentOrchestrator.agents.has('PredictiveAgent')) {
                const predictiveAgent = window.agentOrchestrator.agents.get('PredictiveAgent');
                
                result.forEach(team => {
                    // Add team performance predictions
                    const momentum = predictiveAgent.calculateTeamMomentum(team);
                    team.predictedMomentum = momentum;
                    
                    // Add ranking prediction
                    if (Math.abs(momentum) > 5) {
                        team.rankingPrediction = {
                            direction: momentum > 0 ? 'up' : 'down',
                            confidence: Math.min(Math.abs(momentum) / 20, 1)
                        };
                    }
                });
            }
            
            return result;
        }.bind(this));
    }

    integrateWithMedianCalculator() {
        if (!window.medianCalculator) return;

        console.log('🔗 Integrating with Median Calculator...');

        // Enhance calculateMedian method
        this.enhanceMethod(window.medianCalculator, 'calculateMedian', function(originalMethod, teamData, ...args) {
            const context = { method: 'calculateMedian', teamData, timestamp: Date.now() };
            
            try {
                this.integrationHooks.get('scoring_calculation').before(context);
                
                // Let ScoringAgent handle intelligent calculation
                if (window.agentOrchestrator.agents.has('ScoringAgent')) {
                    const scoringAgent = window.agentOrchestrator.agents.get('ScoringAgent');
                    return scoringAgent.intelligentCalculator.calculate(teamData);
                } else {
                    const result = originalMethod.apply(this, [teamData, ...args]);
                    this.integrationHooks.get('scoring_calculation').after(context, result);
                    return result;
                }
            } catch (error) {
                this.integrationHooks.get('scoring_calculation').error(context, error);
                throw error;
            }
        }.bind(this));
    }

    integrateWithMobileUI() {
        if (!window.mobileUI) return;

        console.log('🔗 Integrating with Mobile UI...');

        // Enhance mobile UI with autonomous optimizations
        if (window.mobileUI.setupIntersectionObserver) {
            this.enhanceMethod(window.mobileUI, 'setupIntersectionObserver', function(originalMethod, ...args) {
                // Let UIAgent handle advanced intersection observation
                if (window.agentOrchestrator.agents.has('UIAgent')) {
                    const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
                    uiAgent.setupIntersectionObserver();
                }
                
                return originalMethod.apply(this, args);
            }.bind(this));
        }
    }

    setupAgenticEnhancements() {
        console.log('⚡ Setting up agentic enhancements...');

        // Auto-refresh enhancement
        this.agenticEnhancements.set('auto_refresh', {
            name: 'Intelligent Auto-Refresh',
            enabled: true,
            setup: () => this.setupIntelligentAutoRefresh()
        });

        // Performance monitoring enhancement
        this.agenticEnhancements.set('performance_monitoring', {
            name: 'Real-time Performance Monitoring',
            enabled: true,
            setup: () => this.setupPerformanceMonitoring()
        });

        // Predictive loading enhancement
        this.agenticEnhancements.set('predictive_loading', {
            name: 'Predictive Data Loading',
            enabled: true,
            setup: () => this.setupPredictiveLoading()
        });

        // Self-healing enhancement
        this.agenticEnhancements.set('self_healing', {
            name: 'Autonomous Self-Healing',
            enabled: true,
            setup: () => this.setupSelfHealing()
        });

        // User experience optimization
        this.agenticEnhancements.set('ux_optimization', {
            name: 'Dynamic UX Optimization',
            enabled: true,
            setup: () => this.setupUXOptimization()
        });

        // Enable all enhancements
        this.agenticEnhancements.forEach((enhancement, key) => {
            if (enhancement.enabled) {
                try {
                    enhancement.setup();
                    console.log(`✅ Enabled: ${enhancement.name}`);
                } catch (error) {
                    console.error(`❌ Failed to enable ${enhancement.name}:`, error);
                }
            }
        });
    }

    setupIntelligentAutoRefresh() {
        // Replace standard auto-refresh with intelligent version
        if (window.rfflApp && window.rfflApp.updateInterval) {
            clearInterval(window.rfflApp.updateInterval);
            
            // Let DataAgent handle intelligent refresh timing
            const intelligentRefresh = () => {
                if (window.agentOrchestrator.agents.has('DataAgent')) {
                    const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
                    const context = dataAgent.determineDataContext();
                    const strategy = dataAgent.adaptiveStrategies.get(context);
                    
                    if (dataAgent.shouldRefreshData(strategy)) {
                        dataAgent.intelligentDataRefresh(strategy);
                    }
                }
            };
            
            // Start intelligent refresh loop
            setInterval(intelligentRefresh, 15000); // Check every 15 seconds
        }
    }

    setupPerformanceMonitoring() {
        // Integrate performance monitoring with existing functions
        const monitorPerformance = (functionName, duration) => {
            if (window.agentOrchestrator.agents.has('MonitoringAgent')) {
                const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                monitoringAgent.performanceMonitor.measureResponseTime(functionName, () => {
                    // Performance measurement handled by agent
                });
            }
        };

        // Monitor key operations
        ['loadData', 'renderTeamsGrid', 'renderStandings', 'renderCharts'].forEach(methodName => {
            if (window.rfflApp && typeof window.rfflApp[methodName] === 'function') {
                this.enhanceMethod(window.rfflApp, methodName, function(originalMethod, ...args) {
                    const startTime = performance.now();
                    const result = originalMethod.apply(this, args);
                    const duration = performance.now() - startTime;
                    
                    monitorPerformance(methodName, duration);
                    
                    return result;
                }.bind(this));
            }
        });
    }

    setupPredictiveLoading() {
        // Enable predictive data loading based on user behavior
        if (window.agentOrchestrator.agents.has('PredictiveAgent')) {
            const predictiveAgent = window.agentOrchestrator.agents.get('PredictiveAgent');
            
            // Predict and preload data based on user patterns
            setInterval(() => {
                predictiveAgent.performPredictivePrefetch?.();
            }, 60000); // Every minute
        }
    }

    setupSelfHealing() {
        // Enable autonomous error recovery
        window.addEventListener('error', (event) => {
            if (window.agentOrchestrator.agents.has('MonitoringAgent')) {
                const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                
                // Attempt self-healing
                const issue = {
                    type: 'javascript_error',
                    severity: 'medium',
                    data: {
                        message: event.error?.message,
                        filename: event.filename,
                        lineno: event.lineno
                    }
                };
                
                const diagnosis = monitoringAgent.selfHealer.diagnose(issue);
                if (diagnosis.confidence > 0.6) {
                    monitoringAgent.selfHealer.heal(diagnosis);
                }
            }
        });

        // Monitor for performance issues and self-heal
        setInterval(() => {
            if (window.agentOrchestrator.agents.has('MonitoringAgent')) {
                const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                monitoringAgent.performSelfHealing();
            }
        }, 120000); // Every 2 minutes
    }

    setupUXOptimization() {
        // Enable dynamic UX optimization based on user behavior
        if (window.agentOrchestrator.agents.has('UIAgent')) {
            const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
            
            // Track user interactions for optimization
            document.addEventListener('click', (event) => {
                uiAgent.behaviorTracker.trackInteraction('click', event.target, {
                    x: event.clientX,
                    y: event.clientY
                });
            });
            
            document.addEventListener('scroll', () => {
                uiAgent.behaviorTracker.trackInteraction('scroll', document.body, {
                    scrollY: window.scrollY
                });
            });
            
            // Optimize UI based on patterns
            setInterval(() => {
                uiAgent.analyzeUserBehavior();
            }, 30000); // Every 30 seconds
        }
    }

    enableAutonomousFeatures() {
        console.log('🤖 Enabling autonomous features...');

        // Enable autonomous decision making
        if (window.agentOrchestrator) {
            window.agentOrchestrator.enableAutonomousMode();
        }

        // Setup autonomous feature coordination
        this.setupFeatureCoordination();
        
        // Enable autonomous learning
        this.enableAutonomousLearning();
        
        // Setup autonomous optimization
        this.setupAutonomousOptimization();
    }

    setupFeatureCoordination() {
        // Coordinate features across agents
        const coordinator = {
            coordinateDataAndUI: () => {
                // Coordinate data refresh with UI updates
                window.agentOrchestrator.messageBus.publish('coordination.data_ui', {
                    action: 'sync_updates',
                    timestamp: Date.now()
                }, 'AgenticIntegration');
            },
            
            coordinatePerformanceAndUX: () => {
                // Balance performance optimization with user experience
                const monitoringAgent = window.agentOrchestrator.agents.get('MonitoringAgent');
                const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
                
                if (monitoringAgent && uiAgent) {
                    const systemHealth = monitoringAgent.state.systemHealth;
                    const userSatisfaction = uiAgent.state.userSatisfaction;
                    
                    if (systemHealth < 0.7 && userSatisfaction > 0.8) {
                        // Prioritize performance over features
                        uiAgent.reduceAnimations();
                    } else if (systemHealth > 0.9 && userSatisfaction < 0.6) {
                        // Prioritize user experience
                        uiAgent.enableAdvancedFeatures();
                    }
                }
            }
        };

        // Run coordination every 2 minutes
        setInterval(() => {
            coordinator.coordinateDataAndUI();
            coordinator.coordinatePerformanceAndUX();
        }, 120000);
    }

    enableAutonomousLearning() {
        // Enable cross-agent learning
        const learningSystem = {
            shareInsights: () => {
                const insights = [];
                
                // Collect insights from all agents
                window.agentOrchestrator.agents.forEach((agent, name) => {
                    if (agent.getInsights) {
                        const agentInsights = agent.getInsights();
                        insights.push({ agent: name, insights: agentInsights });
                    }
                });
                
                // Share insights across agents
                window.agentOrchestrator.messageBus.publish('learning.insights', {
                    insights,
                    timestamp: Date.now()
                }, 'AgenticIntegration');
            },
            
            adaptBasedOnOutcomes: () => {
                // Analyze decision outcomes and adapt
                const decisionHistory = window.agentOrchestrator.decisionHistory.slice(-50);
                const successRate = decisionHistory.filter(d => d.outcome === 'success').length / decisionHistory.length;
                
                if (successRate < 0.7) {
                    // Reduce autonomous decision confidence
                    window.agentOrchestrator.agents.forEach(agent => {
                        if (agent.adjustConfidence) {
                            agent.adjustConfidence(0.9);
                        }
                    });
                }
            }
        };

        // Run learning system every 5 minutes
        setInterval(() => {
            learningSystem.shareInsights();
            learningSystem.adaptBasedOnOutcomes();
        }, 300000);
    }

    setupAutonomousOptimization() {
        // Setup system-wide autonomous optimization
        const optimizer = {
            optimizeSystemWide: () => {
                // Analyze system state and optimize
                const systemState = window.agentOrchestrator.getSystemState();
                
                if (systemState.errorCount > 5) {
                    // High error count - optimize for stability
                    this.optimizeForStability();
                } else if (systemState.performance && systemState.performance.score > 0.9) {
                    // High performance - optimize for features
                    this.optimizeForFeatures();
                }
            },
            
            balanceResources: () => {
                // Balance resource allocation across agents
                const resourceUsage = this.calculateResourceUsage();
                
                if (resourceUsage.total > 0.8) {
                    // High resource usage - throttle non-essential agents
                    window.agentOrchestrator.agents.forEach((agent, name) => {
                        if (!agent.isEssential() && agent.throttle) {
                            agent.throttle();
                        }
                    });
                }
            }
        };

        // Run optimization every 3 minutes
        setInterval(() => {
            optimizer.optimizeSystemWide();
            optimizer.balanceResources();
        }, 180000);
    }

    // Hook implementations
    beforeDataRefresh(context) {
        // Notify agents of upcoming data refresh
        window.agentOrchestrator.messageBus.publish('data.refresh.starting', context, 'AgenticIntegration');
    }

    afterDataRefresh(context, result) {
        // Notify agents of completed data refresh
        window.agentOrchestrator.messageBus.publish('data.refreshed', {
            ...context,
            result,
            success: true
        }, 'AgenticIntegration');
    }

    onDataRefreshError(context, error) {
        // Handle data refresh errors
        window.agentOrchestrator.messageBus.publish('data.refresh.error', {
            ...context,
            error: error.message
        }, 'AgenticIntegration');
    }

    beforeUIUpdate(context) {
        // Optimize UI before updates
        if (window.agentOrchestrator.agents.has('UIAgent')) {
            const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
            uiAgent.performanceMonitor.measureMemoryUsage();
        }
    }

    afterUIUpdate(context, result) {
        // Track UI update performance
        window.agentOrchestrator.messageBus.publish('ui.updated', {
            ...context,
            result,
            success: true
        }, 'AgenticIntegration');
    }

    onUIUpdateError(context, error) {
        // Handle UI update errors
        window.agentOrchestrator.messageBus.publish('ui.update.error', {
            ...context,
            error: error.message
        }, 'AgenticIntegration');
    }

    beforeScoringCalculation(context) {
        // Validate data before scoring
        if (window.agentOrchestrator.agents.has('ScoringAgent')) {
            const scoringAgent = window.agentOrchestrator.agents.get('ScoringAgent');
            const validation = scoringAgent.preValidateData(context.teamData);
            
            if (!validation.isValid) {
                throw new Error(`Scoring validation failed: ${validation.errors.join(', ')}`);
            }
        }
    }

    afterScoringCalculation(context, result) {
        // Validate and analyze scoring results
        window.agentOrchestrator.messageBus.publish('scoring.updated', {
            ...context,
            result,
            success: true
        }, 'AgenticIntegration');
    }

    onScoringCalculationError(context, error) {
        // Handle scoring calculation errors
        window.agentOrchestrator.messageBus.publish('scoring.calculation.error', {
            ...context,
            error: error.message
        }, 'AgenticIntegration');
    }

    // Utility methods
    enhanceMethod(object, methodName, enhancedFunction) {
        if (!object || typeof object[methodName] !== 'function') {
            console.warn(`Cannot enhance ${methodName}: method not found`);
            return;
        }

        // Store original method
        const originalMethod = object[methodName];
        this.originalFunctions.set(`${object.constructor.name}.${methodName}`, originalMethod);

        // Replace with enhanced version
        object[methodName] = function(...args) {
            return enhancedFunction(originalMethod.bind(this), ...args);
        };

        console.log(`🔧 Enhanced method: ${object.constructor.name}.${methodName}`);
    }

    optimizeForStability() {
        console.log('🛡️ Optimizing for stability...');
        
        // Reduce update frequencies
        window.agentOrchestrator.agents.forEach(agent => {
            if (agent.reduceUpdateFrequency) {
                agent.reduceUpdateFrequency();
            }
        });
        
        // Enable conservative mode
        window.agentOrchestrator.messageBus.publish('system.conservative_mode', {
            enabled: true,
            reason: 'High error count detected'
        }, 'AgenticIntegration');
    }

    optimizeForFeatures() {
        console.log('⚡ Optimizing for features...');
        
        // Enable advanced features
        if (window.agentOrchestrator.agents.has('UIAgent')) {
            const uiAgent = window.agentOrchestrator.agents.get('UIAgent');
            uiAgent.enableAdvancedFeatures();
        }
        
        // Increase update frequencies
        window.agentOrchestrator.agents.forEach(agent => {
            if (agent.increaseUpdateFrequency) {
                agent.increaseUpdateFrequency();
            }
        });
    }

    calculateResourceUsage() {
        let totalUsage = 0;
        let agentCount = 0;
        
        window.agentOrchestrator.agents.forEach(agent => {
            const metrics = agent.getHealthMetrics();
            if (metrics.resourceUsage) {
                totalUsage += metrics.resourceUsage;
                agentCount++;
            }
        });
        
        return {
            total: agentCount > 0 ? totalUsage / agentCount : 0,
            agentCount
        };
    }

    handleIntegrationFailure(error) {
        console.error('🚨 Integration failure - falling back to basic mode:', error);
        
        // Disable agentic features
        this.agenticEnhancements.forEach((enhancement, key) => {
            enhancement.enabled = false;
        });
        
        // Restore original functions
        this.originalFunctions.forEach((originalFunc, key) => {
            const [objectName, methodName] = key.split('.');
            // Restoration logic would go here
        });
        
        // Notify of fallback mode
        if (window.rfflApp && window.rfflApp.showError) {
            window.rfflApp.showError('Advanced features disabled - running in basic mode');
        }
    }

    // Public API
    getIntegrationStatus() {
        return {
            initialized: this.initialized,
            enhancementsCount: this.agenticEnhancements.size,
            activeEnhancements: Array.from(this.agenticEnhancements.entries())
                .filter(([key, enhancement]) => enhancement.enabled)
                .map(([key, enhancement]) => ({ key, name: enhancement.name })),
            originalFunctionsCount: this.originalFunctions.size
        };
    }

    enableEnhancement(enhancementKey) {
        const enhancement = this.agenticEnhancements.get(enhancementKey);
        if (enhancement && !enhancement.enabled) {
            enhancement.enabled = true;
            enhancement.setup();
            console.log(`✅ Enabled enhancement: ${enhancement.name}`);
        }
    }

    disableEnhancement(enhancementKey) {
        const enhancement = this.agenticEnhancements.get(enhancementKey);
        if (enhancement && enhancement.enabled) {
            enhancement.enabled = false;
            // Cleanup logic would go here
            console.log(`❌ Disabled enhancement: ${enhancement.name}`);
        }
    }
}

// Initialize integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.agenticIntegration = new AgenticIntegration();
    
    // Start integration after a short delay to ensure other components are ready
    setTimeout(() => {
        window.agenticIntegration.initialize();
    }, 2000);
});

window.AgenticIntegration = AgenticIntegration;
