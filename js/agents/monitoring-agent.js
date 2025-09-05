/**
 * RFFL Monitoring Agent - Autonomous System Health & Performance Monitoring
 * Handles system monitoring, error detection, performance tracking, and self-healing
 */

class MonitoringAgent {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.subscribedTopics = [
            'agent.error',
            'system.health.check',
            'resource.optimization.needed',
            'system.failure',
            'performance.degraded'
        ];
        
        this.state = {
            isActive: true,
            lastActivity: Date.now(),
            healthScore: 1.0,
            systemHealth: 1.0,
            alertLevel: 'normal'
        };

        this.healthMetrics = new Map();
        this.performanceHistory = [];
        this.errorHistory = [];
        this.alertThresholds = new Map();
        this.healingStrategies = new Map();
        this.monitoringRules = new Map();
        
        this.setupMonitoringRules();
        this.setupAlertThresholds();
        this.setupHealingStrategies();
    }

    async initialize() {
        console.log('🔍 Initializing Monitoring Agent...');
        
        // Setup comprehensive system monitoring
        this.setupSystemMonitoring();
        
        // Initialize error tracking and analysis
        this.initializeErrorTracking();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Initialize self-healing capabilities
        this.initializeSelfHealing();
        
        // Start autonomous monitoring loop
        this.startMonitoringLoop();
        
        console.log('✅ Monitoring Agent initialized');
    }

    setupMonitoringRules() {
        // System health monitoring rules
        this.monitoringRules.set('memory_usage', {
            metric: 'memory',
            threshold: 0.85,
            severity: 'high',
            action: 'cleanup_memory'
        });

        this.monitoringRules.set('cpu_usage', {
            metric: 'cpu',
            threshold: 0.80,
            severity: 'high',
            action: 'throttle_operations'
        });

        this.monitoringRules.set('error_rate', {
            metric: 'errors',
            threshold: 0.05, // 5% error rate
            severity: 'critical',
            action: 'activate_safe_mode'
        });

        this.monitoringRules.set('response_time', {
            metric: 'response_time',
            threshold: 5000, // 5 seconds
            severity: 'medium',
            action: 'optimize_performance'
        });

        this.monitoringRules.set('agent_health', {
            metric: 'agent_health',
            threshold: 0.7,
            severity: 'high',
            action: 'restart_agent'
        });
    }

    setupAlertThresholds() {
        this.alertThresholds.set('critical', {
            level: 'critical',
            conditions: ['system_failure', 'data_corruption', 'security_breach'],
            autoResponse: true,
            escalation: true
        });

        this.alertThresholds.set('high', {
            level: 'high',
            conditions: ['performance_degraded', 'agent_failure', 'memory_leak'],
            autoResponse: true,
            escalation: false
        });

        this.alertThresholds.set('medium', {
            level: 'medium',
            conditions: ['slow_response', 'cache_miss', 'validation_warning'],
            autoResponse: false,
            escalation: false
        });

        this.alertThresholds.set('low', {
            level: 'low',
            conditions: ['info_message', 'optimization_opportunity'],
            autoResponse: false,
            escalation: false
        });
    }

    setupHealingStrategies() {
        // Self-healing strategies for common issues
        this.healingStrategies.set('memory_leak', {
            name: 'Memory Leak Recovery',
            steps: [
                'identify_memory_consumers',
                'cleanup_unused_objects',
                'force_garbage_collection',
                'restart_heavy_components'
            ],
            priority: 'high',
            autoExecute: true
        });

        this.healingStrategies.set('performance_degradation', {
            name: 'Performance Recovery',
            steps: [
                'identify_bottlenecks',
                'optimize_critical_paths',
                'reduce_background_tasks',
                'enable_performance_mode'
            ],
            priority: 'medium',
            autoExecute: true
        });

        this.healingStrategies.set('agent_failure', {
            name: 'Agent Recovery',
            steps: [
                'diagnose_agent_state',
                'clear_agent_errors',
                'restart_agent',
                'verify_agent_health'
            ],
            priority: 'high',
            autoExecute: true
        });

        this.healingStrategies.set('data_inconsistency', {
            name: 'Data Consistency Recovery',
            steps: [
                'validate_data_integrity',
                'restore_from_backup',
                'recalculate_derived_data',
                'verify_consistency'
            ],
            priority: 'critical',
            autoExecute: false // Requires manual approval
        });
    }

    setupSystemMonitoring() {
        this.systemMonitor = {
            // Browser performance monitoring
            monitorBrowserPerformance: () => {
                const metrics = {
                    memory: this.getMemoryUsage(),
                    timing: this.getPerformanceTiming(),
                    navigation: this.getNavigationTiming(),
                    resources: this.getResourceTiming()
                };
                
                this.healthMetrics.set('browser_performance', {
                    ...metrics,
                    timestamp: Date.now()
                });
                
                return metrics;
            },
            
            // Network monitoring
            monitorNetwork: () => {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                const metrics = {
                    online: navigator.onLine,
                    effectiveType: connection?.effectiveType || 'unknown',
                    downlink: connection?.downlink || 0,
                    rtt: connection?.rtt || 0,
                    saveData: connection?.saveData || false
                };
                
                this.healthMetrics.set('network', {
                    ...metrics,
                    timestamp: Date.now()
                });
                
                return metrics;
            },
            
            // Application state monitoring
            monitorApplicationState: () => {
                const metrics = {
                    agentCount: this.orchestrator.agents.size,
                    activeAgents: Array.from(this.orchestrator.agents.values()).filter(a => a.isActive()).length,
                    messageQueueSize: this.orchestrator.messageQueue.length,
                    errorCount: this.errorHistory.length,
                    lastUpdate: this.orchestrator.systemState.lastUpdate
                };
                
                this.healthMetrics.set('application_state', {
                    ...metrics,
                    timestamp: Date.now()
                });
                
                return metrics;
            }
        };
    }

    initializeErrorTracking() {
        this.errorTracker = {
            trackError: (error, context) => {
                const errorRecord = {
                    id: this.generateErrorId(),
                    message: error.message,
                    stack: error.stack,
                    context,
                    timestamp: Date.now(),
                    severity: this.categorizeError(error),
                    resolved: false
                };
                
                this.errorHistory.push(errorRecord);
                this.analyzeErrorPattern(errorRecord);
                
                // Keep only last 1000 errors
                if (this.errorHistory.length > 1000) {
                    this.errorHistory.shift();
                }
                
                return errorRecord;
            },
            
            analyzeErrorTrends: () => {
                const recentErrors = this.errorHistory.slice(-100);
                const errorTypes = {};
                const timeWindows = {};
                
                recentErrors.forEach(error => {
                    // Group by error type
                    const type = this.getErrorType(error);
                    errorTypes[type] = (errorTypes[type] || 0) + 1;
                    
                    // Group by time window (hourly)
                    const hour = new Date(error.timestamp).getHours();
                    timeWindows[hour] = (timeWindows[hour] || 0) + 1;
                });
                
                return {
                    totalErrors: recentErrors.length,
                    errorRate: recentErrors.length / 100,
                    commonTypes: Object.entries(errorTypes).sort(([,a], [,b]) => b - a).slice(0, 5),
                    peakHours: Object.entries(timeWindows).sort(([,a], [,b]) => b - a).slice(0, 3)
                };
            },
            
            suggestFixes: (error) => {
                const errorType = this.getErrorType(error);
                const suggestions = this.getErrorSuggestions(errorType);
                
                return suggestions;
            }
        };

        // Global error handler
        window.addEventListener('error', (event) => {
            this.errorTracker.trackError(event.error, {
                type: 'javascript_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.errorTracker.trackError(new Error(event.reason), {
                type: 'unhandled_promise_rejection',
                reason: event.reason
            });
        });
    }

    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            metrics: {
                responseTime: 0,
                throughput: 0,
                errorRate: 0,
                resourceUtilization: 0,
                userExperience: 0
            },
            
            measureResponseTime: async (operation, func) => {
                const startTime = performance.now();
                try {
                    const result = await func();
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    
                    this.recordPerformanceMetric('response_time', responseTime, operation);
                    return { result, responseTime };
                } catch (error) {
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    
                    this.recordPerformanceMetric('response_time', responseTime, operation);
                    this.recordPerformanceMetric('error_rate', 1, operation);
                    throw error;
                }
            },
            
            measureThroughput: (operation, count, duration) => {
                const throughput = count / (duration / 1000); // operations per second
                this.recordPerformanceMetric('throughput', throughput, operation);
                return throughput;
            },
            
            measureResourceUtilization: () => {
                const memory = this.getMemoryUsage();
                const cpu = this.estimateCPUUsage();
                const network = this.getNetworkUtilization();
                
                const utilization = {
                    memory: memory.percentage,
                    cpu: cpu,
                    network: network,
                    overall: (memory.percentage + cpu + network) / 3
                };
                
                this.recordPerformanceMetric('resource_utilization', utilization.overall, 'system');
                return utilization;
            }
        };
    }

    initializeSelfHealing() {
        this.selfHealer = {
            diagnose: (issue) => {
                const diagnosis = {
                    issue,
                    symptoms: this.identifySymptoms(issue),
                    possibleCauses: this.identifyPossibleCauses(issue),
                    recommendedActions: this.getRecommendedActions(issue),
                    confidence: this.calculateDiagnosticConfidence(issue)
                };
                
                return diagnosis;
            },
            
            heal: async (diagnosis) => {
                const strategy = this.healingStrategies.get(diagnosis.issue.type);
                if (!strategy) {
                    console.warn('No healing strategy found for:', diagnosis.issue.type);
                    return { success: false, reason: 'No strategy available' };
                }
                
                console.log(`🔧 Initiating self-healing for: ${strategy.name}`);
                
                const results = [];
                for (const step of strategy.steps) {
                    try {
                        const result = await this.executeHealingStep(step, diagnosis);
                        results.push({ step, success: true, result });
                        
                        if (result.shouldStop) {
                            break;
                        }
                    } catch (error) {
                        results.push({ step, success: false, error: error.message });
                        
                        if (strategy.priority === 'critical') {
                            // Critical healing failure - escalate
                            this.escalateHealingFailure(diagnosis, error);
                            break;
                        }
                    }
                }
                
                const success = results.every(r => r.success);
                console.log(`${success ? '✅' : '❌'} Self-healing ${success ? 'completed' : 'failed'}: ${strategy.name}`);
                
                return { success, results, strategy: strategy.name };
            },
            
            verify: async (healingResult) => {
                // Verify that the healing was successful
                const verification = {
                    originalIssue: healingResult.originalIssue,
                    healingSuccess: healingResult.success,
                    currentState: await this.getCurrentSystemState(),
                    issueResolved: false,
                    confidence: 0
                };
                
                // Check if the original issue is resolved
                verification.issueResolved = await this.verifyIssueResolution(healingResult.originalIssue);
                verification.confidence = this.calculateVerificationConfidence(verification);
                
                return verification;
            }
        };
    }

    startMonitoringLoop() {
        // Main monitoring loop
        setInterval(() => {
            this.autonomousSystemMonitoring();
        }, 10000); // Every 10 seconds

        // Performance monitoring loop
        setInterval(() => {
            this.monitorSystemPerformance();
        }, 5000); // Every 5 seconds

        // Health check loop
        setInterval(() => {
            this.performHealthCheck();
        }, 30000); // Every 30 seconds

        // Self-healing loop
        setInterval(() => {
            this.performSelfHealing();
        }, 60000); // Every minute
    }

    async autonomousSystemMonitoring() {
        try {
            // Monitor all system aspects
            const browserMetrics = this.systemMonitor.monitorBrowserPerformance();
            const networkMetrics = this.systemMonitor.monitorNetwork();
            const appMetrics = this.systemMonitor.monitorApplicationState();
            
            // Analyze metrics against thresholds
            const issues = this.analyzeMetrics({
                browser: browserMetrics,
                network: networkMetrics,
                application: appMetrics
            });
            
            // Handle identified issues
            for (const issue of issues) {
                await this.handleSystemIssue(issue);
            }
            
            // Update system health score
            this.updateSystemHealthScore();
            
        } catch (error) {
            console.error('System monitoring error:', error);
            this.errorTracker.trackError(error, { type: 'monitoring_error' });
        }
    }

    monitorSystemPerformance() {
        // Measure current performance metrics
        const resourceUtilization = this.performanceMonitor.measureResourceUtilization();
        const errorTrends = this.errorTracker.analyzeErrorTrends();
        
        // Store performance history
        this.performanceHistory.push({
            timestamp: Date.now(),
            resourceUtilization,
            errorRate: errorTrends.errorRate,
            responseTime: this.performanceMonitor.metrics.responseTime
        });
        
        // Keep only last 1000 measurements
        if (this.performanceHistory.length > 1000) {
            this.performanceHistory.shift();
        }
        
        // Check for performance degradation
        if (this.detectPerformanceDegradation()) {
            this.orchestrator.messageBus.publish('performance.degraded', {
                metrics: resourceUtilization,
                trends: this.analyzePerformanceTrends()
            }, 'MonitoringAgent');
        }
    }

    performHealthCheck() {
        // Check health of all agents
        const agentHealth = {};
        this.orchestrator.agents.forEach((agent, name) => {
            agentHealth[name] = {
                isActive: agent.isActive(),
                isResponsive: agent.isResponsive(),
                healthMetrics: agent.getHealthMetrics(),
                lastActivity: agent.getLastActivity()
            };
        });
        
        // Identify unhealthy agents
        const unhealthyAgents = Object.entries(agentHealth)
            .filter(([name, health]) => !health.isResponsive || health.healthMetrics.score < 0.7)
            .map(([name, health]) => ({ name, health }));
        
        if (unhealthyAgents.length > 0) {
            this.orchestrator.messageBus.publish('agents.unhealthy', {
                unhealthyAgents,
                totalAgents: this.orchestrator.agents.size
            }, 'MonitoringAgent');
        }
        
        // Update overall system health
        const overallHealth = this.calculateOverallHealth(agentHealth);
        this.state.systemHealth = overallHealth;
        
        if (overallHealth < 0.7) {
            this.orchestrator.messageBus.publish('system.health.critical', {
                health: overallHealth,
                agentHealth
            }, 'MonitoringAgent');
        }
    }

    async performSelfHealing() {
        // Identify issues that can be self-healed
        const healableIssues = this.identifyHealableIssues();
        
        for (const issue of healableIssues) {
            const diagnosis = this.selfHealer.diagnose(issue);
            
            if (diagnosis.confidence > 0.7) {
                const strategy = this.healingStrategies.get(issue.type);
                
                if (strategy && strategy.autoExecute) {
                    try {
                        const healingResult = await this.selfHealer.heal(diagnosis);
                        const verification = await this.selfHealer.verify(healingResult);
                        
                        this.orchestrator.messageBus.publish('self_healing.completed', {
                            issue: issue.type,
                            success: healingResult.success,
                            verified: verification.issueResolved
                        }, 'MonitoringAgent');
                        
                    } catch (error) {
                        console.error('Self-healing failed:', error);
                        this.escalateHealingFailure(diagnosis, error);
                    }
                }
            }
        }
    }

    // Analysis Methods
    analyzeMetrics(metrics) {
        const issues = [];
        
        // Check browser performance
        if (metrics.browser.memory.percentage > 0.85) {
            issues.push({
                type: 'memory_usage',
                severity: 'high',
                value: metrics.browser.memory.percentage,
                threshold: 0.85
            });
        }
        
        // Check network connectivity
        if (!metrics.network.online) {
            issues.push({
                type: 'network_offline',
                severity: 'critical',
                value: false,
                threshold: true
            });
        }
        
        // Check application state
        if (metrics.application.errorCount > 10) {
            issues.push({
                type: 'high_error_count',
                severity: 'medium',
                value: metrics.application.errorCount,
                threshold: 10
            });
        }
        
        return issues;
    }

    detectPerformanceDegradation() {
        if (this.performanceHistory.length < 10) return false;
        
        const recent = this.performanceHistory.slice(-5);
        const older = this.performanceHistory.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, p) => sum + p.resourceUtilization, 0) / recent.length;
        const olderAvg = older.reduce((sum, p) => sum + p.resourceUtilization, 0) / older.length;
        
        return recentAvg > olderAvg * 1.2; // 20% degradation
    }

    analyzePerformanceTrends() {
        if (this.performanceHistory.length < 20) return {};
        
        const recent = this.performanceHistory.slice(-20);
        
        return {
            memoryTrend: this.calculateTrend(recent.map(p => p.resourceUtilization)),
            errorTrend: this.calculateTrend(recent.map(p => p.errorRate)),
            responseTrend: this.calculateTrend(recent.map(p => p.responseTime))
        };
    }

    calculateTrend(values) {
        const n = values.length;
        const sumX = (n * (n + 1)) / 2;
        const sumY = values.reduce((sum, val) => sum + val, 0);
        const sumXY = values.reduce((sum, val, i) => sum + (i + 1) * val, 0);
        const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        
        return {
            direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
            rate: Math.abs(slope),
            confidence: Math.min(n / 20, 1) // More data = higher confidence
        };
    }

    // Issue Handling
    async handleSystemIssue(issue) {
        console.log(`🚨 System issue detected: ${issue.type} (${issue.severity})`);
        
        // Apply monitoring rule if exists
        const rule = this.monitoringRules.get(issue.type);
        if (rule) {
            await this.applyMonitoringRule(rule, issue);
        }
        
        // Check alert thresholds
        const alertLevel = this.determineAlertLevel(issue);
        if (alertLevel !== 'low') {
            this.triggerAlert(issue, alertLevel);
        }
        
        // Auto-healing if applicable
        if (this.canAutoHeal(issue)) {
            const diagnosis = this.selfHealer.diagnose(issue);
            if (diagnosis.confidence > 0.6) {
                await this.selfHealer.heal(diagnosis);
            }
        }
    }

    async applyMonitoringRule(rule, issue) {
        try {
            switch (rule.action) {
                case 'cleanup_memory':
                    await this.cleanupMemory();
                    break;
                case 'throttle_operations':
                    await this.throttleOperations();
                    break;
                case 'activate_safe_mode':
                    await this.activateSafeMode();
                    break;
                case 'optimize_performance':
                    await this.optimizePerformance();
                    break;
                case 'restart_agent':
                    await this.restartAgent(issue.agent);
                    break;
            }
        } catch (error) {
            console.error(`Failed to apply monitoring rule ${rule.action}:`, error);
        }
    }

    determineAlertLevel(issue) {
        for (const [level, threshold] of this.alertThresholds) {
            if (threshold.conditions.includes(issue.type) || 
                threshold.level === issue.severity) {
                return level;
            }
        }
        return 'low';
    }

    triggerAlert(issue, level) {
        const alert = {
            id: this.generateAlertId(),
            issue,
            level,
            timestamp: Date.now(),
            acknowledged: false
        };
        
        console.log(`🚨 Alert triggered: ${level.toUpperCase()} - ${issue.type}`);
        
        this.orchestrator.messageBus.publish('system.alert', alert, 'MonitoringAgent');
        
        const threshold = this.alertThresholds.get(level);
        if (threshold.autoResponse) {
            this.executeAutoResponse(alert);
        }
        
        if (threshold.escalation) {
            this.escalateAlert(alert);
        }
    }

    // Self-Healing Implementation
    identifyHealableIssues() {
        const issues = [];
        
        // Memory issues
        const memoryMetrics = this.healthMetrics.get('browser_performance');
        if (memoryMetrics && memoryMetrics.memory.percentage > 0.8) {
            issues.push({ type: 'memory_leak', severity: 'high', data: memoryMetrics });
        }
        
        // Performance issues
        if (this.detectPerformanceDegradation()) {
            issues.push({ type: 'performance_degradation', severity: 'medium', data: this.performanceHistory });
        }
        
        // Agent issues
        this.orchestrator.agents.forEach((agent, name) => {
            if (!agent.isResponsive()) {
                issues.push({ type: 'agent_failure', severity: 'high', data: { agentName: name } });
            }
        });
        
        return issues;
    }

    async executeHealingStep(step, diagnosis) {
        switch (step) {
            case 'identify_memory_consumers':
                return this.identifyMemoryConsumers();
            
            case 'cleanup_unused_objects':
                return this.cleanupUnusedObjects();
            
            case 'force_garbage_collection':
                return this.forceGarbageCollection();
            
            case 'restart_heavy_components':
                return this.restartHeavyComponents();
            
            case 'identify_bottlenecks':
                return this.identifyBottlenecks();
            
            case 'optimize_critical_paths':
                return this.optimizeCriticalPaths();
            
            case 'reduce_background_tasks':
                return this.reduceBackgroundTasks();
            
            case 'enable_performance_mode':
                return this.enablePerformanceMode();
            
            case 'diagnose_agent_state':
                return this.diagnoseAgentState(diagnosis.issue.data.agentName);
            
            case 'clear_agent_errors':
                return this.clearAgentErrors(diagnosis.issue.data.agentName);
            
            case 'restart_agent':
                return this.restartAgent(diagnosis.issue.data.agentName);
            
            case 'verify_agent_health':
                return this.verifyAgentHealth(diagnosis.issue.data.agentName);
            
            default:
                throw new Error(`Unknown healing step: ${step}`);
        }
    }

    // Healing Step Implementations
    async identifyMemoryConsumers() {
        const memory = this.getMemoryUsage();
        const consumers = [];
        
        // Check for large objects in agents
        this.orchestrator.agents.forEach((agent, name) => {
            const metrics = agent.getHealthMetrics();
            if (metrics.memoryUsage && metrics.memoryUsage > 0.1) {
                consumers.push({ type: 'agent', name, usage: metrics.memoryUsage });
            }
        });
        
        // Check for large DOM elements
        const largeElements = document.querySelectorAll('*').length;
        if (largeElements > 1000) {
            consumers.push({ type: 'dom', count: largeElements });
        }
        
        return { consumers, totalMemory: memory };
    }

    async cleanupUnusedObjects() {
        let cleaned = 0;
        
        // Clear old performance metrics
        this.performanceHistory = this.performanceHistory.slice(-100);
        cleaned++;
        
        // Clear old error history
        this.errorHistory = this.errorHistory.slice(-100);
        cleaned++;
        
        // Clear old health metrics
        const cutoff = Date.now() - 3600000; // 1 hour ago
        this.healthMetrics.forEach((value, key) => {
            if (value.timestamp < cutoff) {
                this.healthMetrics.delete(key);
                cleaned++;
            }
        });
        
        return { objectsCleaned: cleaned };
    }

    async forceGarbageCollection() {
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
            return { forced: true };
        }
        
        // Simulate GC pressure
        const temp = new Array(1000000).fill(0);
        temp.length = 0;
        
        return { forced: false, simulated: true };
    }

    async restartHeavyComponents() {
        const restarted = [];
        
        // Restart charts if they exist
        if (window.rfflApp && window.rfflApp.charts) {
            Object.entries(window.rfflApp.charts).forEach(([name, chart]) => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                    restarted.push(`chart_${name}`);
                }
            });
        }
        
        return { componentsRestarted: restarted };
    }

    async identifyBottlenecks() {
        const bottlenecks = [];
        
        // Check render performance
        const renderMetrics = this.performanceHistory.slice(-10);
        const avgRenderTime = renderMetrics.reduce((sum, m) => sum + m.responseTime, 0) / renderMetrics.length;
        
        if (avgRenderTime > 100) {
            bottlenecks.push({ type: 'render', avgTime: avgRenderTime });
        }
        
        // Check agent response times
        this.orchestrator.agents.forEach((agent, name) => {
            const metrics = agent.getHealthMetrics();
            if (metrics.responseTime && metrics.responseTime > 50) {
                bottlenecks.push({ type: 'agent', name, responseTime: metrics.responseTime });
            }
        });
        
        return { bottlenecks };
    }

    async optimizeCriticalPaths() {
        const optimizations = [];
        
        // Optimize data flow
        if (this.orchestrator.agents.has('DataAgent')) {
            const dataAgent = this.orchestrator.agents.get('DataAgent');
            if (dataAgent.optimizeCache) {
                dataAgent.optimizeCache();
                optimizations.push('data_cache');
            }
        }
        
        // Optimize UI rendering
        if (this.orchestrator.agents.has('UIAgent')) {
            const uiAgent = this.orchestrator.agents.get('UIAgent');
            if (uiAgent.optimizeRendering) {
                await uiAgent.optimizeRendering();
                optimizations.push('ui_rendering');
            }
        }
        
        return { optimizations };
    }

    async reduceBackgroundTasks() {
        const reduced = [];
        
        // Reduce update frequencies
        this.orchestrator.agents.forEach((agent, name) => {
            if (agent.reduceBackgroundActivity) {
                agent.reduceBackgroundActivity();
                reduced.push(name);
            }
        });
        
        return { reducedTasks: reduced };
    }

    async enablePerformanceMode() {
        // Enable performance mode across the system
        this.orchestrator.messageBus.publish('system.performance_mode', {
            enabled: true,
            timestamp: Date.now()
        }, 'MonitoringAgent');
        
        return { enabled: true };
    }

    async diagnoseAgentState(agentName) {
        const agent = this.orchestrator.agents.get(agentName);
        if (!agent) {
            throw new Error(`Agent ${agentName} not found`);
        }
        
        const diagnosis = {
            isActive: agent.isActive(),
            isResponsive: agent.isResponsive(),
            healthMetrics: agent.getHealthMetrics(),
            lastActivity: agent.getLastActivity(),
            timeSinceActivity: Date.now() - agent.getLastActivity()
        };
        
        return diagnosis;
    }

    async clearAgentErrors(agentName) {
        // Clear agent-specific errors from history
        const agentErrors = this.errorHistory.filter(e => 
            e.context && e.context.agent === agentName
        );
        
        agentErrors.forEach(error => {
            error.resolved = true;
        });
        
        return { errorsCleared: agentErrors.length };
    }

    async restartAgent(agentName) {
        const agent = this.orchestrator.agents.get(agentName);
        if (!agent) {
            throw new Error(`Agent ${agentName} not found`);
        }
        
        try {
            // Pause agent
            agent.pause();
            
            // Wait a moment
            await this.sleep(1000);
            
            // Resume agent
            agent.resume();
            
            // Verify restart
            const isHealthy = agent.isActive() && agent.isResponsive();
            
            return { restarted: true, healthy: isHealthy };
        } catch (error) {
            return { restarted: false, error: error.message };
        }
    }

    async verifyAgentHealth(agentName) {
        const agent = this.orchestrator.agents.get(agentName);
        if (!agent) {
            throw new Error(`Agent ${agentName} not found`);
        }
        
        const health = {
            isActive: agent.isActive(),
            isResponsive: agent.isResponsive(),
            healthScore: agent.getHealthMetrics().score,
            verified: false
        };
        
        health.verified = health.isActive && health.isResponsive && health.healthScore > 0.7;
        
        return health;
    }

    // Utility Methods
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                percentage: performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize
            };
        }
        
        return { used: 0, total: 0, limit: 0, percentage: 0 };
    }

    getPerformanceTiming() {
        if (performance.timing) {
            const timing = performance.timing;
            return {
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                loadComplete: timing.loadEventEnd - timing.navigationStart,
                responseTime: timing.responseEnd - timing.requestStart,
                renderTime: timing.loadEventEnd - timing.responseEnd
            };
        }
        
        return {};
    }

    getNavigationTiming() {
        if (performance.getEntriesByType) {
            const entries = performance.getEntriesByType('navigation');
            return entries[0] || {};
        }
        
        return {};
    }

    getResourceTiming() {
        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            return {
                count: resources.length,
                totalDuration: resources.reduce((sum, r) => sum + r.duration, 0),
                averageDuration: resources.length > 0 ? resources.reduce((sum, r) => sum + r.duration, 0) / resources.length : 0
            };
        }
        
        return { count: 0, totalDuration: 0, averageDuration: 0 };
    }

    estimateCPUUsage() {
        // Simple CPU usage estimation
        const start = performance.now();
        let iterations = 0;
        const duration = 10; // 10ms test
        
        while (performance.now() - start < duration) {
            iterations++;
        }
        
        // Normalize based on expected iterations (rough estimate)
        const expectedIterations = 100000;
        return Math.max(0, Math.min(1, 1 - (iterations / expectedIterations)));
    }

    getNetworkUtilization() {
        // Estimate network utilization based on recent requests
        const recentRequests = this.performanceHistory.slice(-10);
        const avgResponseTime = recentRequests.reduce((sum, r) => sum + r.responseTime, 0) / recentRequests.length;
        
        // Simple heuristic: longer response times suggest higher network utilization
        return Math.min(avgResponseTime / 1000, 1);
    }

    recordPerformanceMetric(type, value, operation) {
        const key = `${type}_${operation}`;
        const existing = this.performanceMonitor.metrics[key] || [];
        existing.push({ value, timestamp: Date.now() });
        
        // Keep only last 100 measurements per metric
        if (existing.length > 100) {
            existing.shift();
        }
        
        this.performanceMonitor.metrics[key] = existing;
    }

    categorizeError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('network') || message.includes('fetch')) {
            return 'network';
        } else if (message.includes('memory') || message.includes('heap')) {
            return 'memory';
        } else if (message.includes('timeout') || message.includes('slow')) {
            return 'performance';
        } else if (message.includes('permission') || message.includes('security')) {
            return 'security';
        } else {
            return 'application';
        }
    }

    getErrorType(error) {
        return error.context?.type || this.categorizeError({ message: error.message });
    }

    getErrorSuggestions(errorType) {
        const suggestions = {
            network: ['Check internet connection', 'Verify API endpoints', 'Enable offline mode'],
            memory: ['Clear cache', 'Reduce data retention', 'Restart application'],
            performance: ['Reduce update frequency', 'Optimize rendering', 'Enable performance mode'],
            security: ['Check permissions', 'Verify credentials', 'Review security settings'],
            application: ['Check console logs', 'Verify data integrity', 'Restart affected components']
        };
        
        return suggestions[errorType] || ['Review error details', 'Check system logs'];
    }

    identifySymptoms(issue) {
        const symptoms = [];
        
        switch (issue.type) {
            case 'memory_leak':
                symptoms.push('High memory usage', 'Slow performance', 'Browser warnings');
                break;
            case 'performance_degradation':
                symptoms.push('Slow response times', 'Low FPS', 'UI lag');
                break;
            case 'agent_failure':
                symptoms.push('Agent unresponsive', 'Missing functionality', 'Error messages');
                break;
        }
        
        return symptoms;
    }

    identifyPossibleCauses(issue) {
        const causes = [];
        
        switch (issue.type) {
            case 'memory_leak':
                causes.push('Unreleased objects', 'Event listener leaks', 'Large data structures');
                break;
            case 'performance_degradation':
                causes.push('Resource contention', 'Inefficient algorithms', 'Network issues');
                break;
            case 'agent_failure':
                causes.push('Unhandled exceptions', 'Resource exhaustion', 'Communication failure');
                break;
        }
        
        return causes;
    }

    getRecommendedActions(issue) {
        const actions = [];
        
        const strategy = this.healingStrategies.get(issue.type);
        if (strategy) {
            actions.push(...strategy.steps);
        }
        
        return actions;
    }

    calculateDiagnosticConfidence(issue) {
        let confidence = 0.5; // Base confidence
        
        // Increase confidence based on available data
        if (issue.data) confidence += 0.2;
        if (this.healingStrategies.has(issue.type)) confidence += 0.2;
        if (issue.severity === 'high') confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    async getCurrentSystemState() {
        return {
            timestamp: Date.now(),
            agents: Array.from(this.orchestrator.agents.keys()),
            health: this.state.systemHealth,
            performance: this.performanceHistory.slice(-1)[0],
            errors: this.errorHistory.slice(-10)
        };
    }

    async verifyIssueResolution(issue) {
        // Check if the specific issue has been resolved
        switch (issue.type) {
            case 'memory_leak':
                const memory = this.getMemoryUsage();
                return memory.percentage < 0.8;
            
            case 'performance_degradation':
                return !this.detectPerformanceDegradation();
            
            case 'agent_failure':
                const agent = this.orchestrator.agents.get(issue.data.agentName);
                return agent && agent.isResponsive();
            
            default:
                return false;
        }
    }

    calculateVerificationConfidence(verification) {
        let confidence = 0.5;
        
        if (verification.issueResolved) confidence += 0.3;
        if (verification.healingSuccess) confidence += 0.2;
        
        return Math.min(confidence, 1.0);
    }

    calculateOverallHealth(agentHealth) {
        const healthScores = Object.values(agentHealth).map(h => h.healthMetrics.score || 0);
        const responsiveAgents = Object.values(agentHealth).filter(h => h.isResponsive).length;
        
        const avgHealthScore = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
        const responsiveRatio = responsiveAgents / Object.keys(agentHealth).length;
        
        return (avgHealthScore * 0.7) + (responsiveRatio * 0.3);
    }

    updateSystemHealthScore() {
        const recentMetrics = Array.from(this.healthMetrics.values()).slice(-10);
        if (recentMetrics.length === 0) return;
        
        // Calculate health based on various factors
        let healthScore = 1.0;
        
        // Memory health
        const memoryMetrics = this.healthMetrics.get('browser_performance');
        if (memoryMetrics && memoryMetrics.memory.percentage > 0.8) {
            healthScore -= 0.2;
        }
        
        // Error rate health
        const errorTrends = this.errorTracker.analyzeErrorTrends();
        if (errorTrends.errorRate > 0.05) {
            healthScore -= 0.3;
        }
        
        // Performance health
        if (this.detectPerformanceDegradation()) {
            healthScore -= 0.2;
        }
        
        this.state.systemHealth = Math.max(0, healthScore);
        this.state.lastActivity = Date.now();
    }

    canAutoHeal(issue) {
        const strategy = this.healingStrategies.get(issue.type);
        return strategy && strategy.autoExecute;
    }

    async executeAutoResponse(alert) {
        console.log(`🤖 Executing auto-response for alert: ${alert.issue.type}`);
        
        // Implementation would depend on alert type
        switch (alert.issue.type) {
            case 'memory_usage':
                await this.cleanupMemory();
                break;
            case 'performance_degraded':
                await this.optimizePerformance();
                break;
            case 'agent_failure':
                await this.restartAgent(alert.issue.agent);
                break;
        }
    }

    escalateAlert(alert) {
        console.log(`🚨 Escalating alert: ${alert.issue.type}`);
        
        this.orchestrator.messageBus.publish('alert.escalated', {
            alert,
            escalatedAt: Date.now(),
            reason: 'Automatic escalation due to severity'
        }, 'MonitoringAgent');
    }

    escalateHealingFailure(diagnosis, error) {
        console.error(`🚨 Self-healing failed for ${diagnosis.issue.type}:`, error);
        
        this.orchestrator.messageBus.publish('self_healing.failed', {
            issue: diagnosis.issue,
            error: error.message,
            requiresManualIntervention: true
        }, 'MonitoringAgent');
    }

    // Action Methods
    async cleanupMemory() {
        console.log('🧹 Cleaning up memory...');
        await this.cleanupUnusedObjects();
        await this.forceGarbageCollection();
    }

    async throttleOperations() {
        console.log('⏳ Throttling operations...');
        
        // Reduce update frequencies across agents
        this.orchestrator.agents.forEach(agent => {
            if (agent.throttle) {
                agent.throttle();
            }
        });
    }

    async activateSafeMode() {
        console.log('🛡️ Activating safe mode...');
        this.orchestrator.enableSafeMode();
    }

    async optimizePerformance() {
        console.log('⚡ Optimizing performance...');
        
        this.orchestrator.messageBus.publish('system.optimize', {
            type: 'performance',
            timestamp: Date.now()
        }, 'MonitoringAgent');
    }

    // Utility methods
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateAlertId() {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Message handling
    handleMessage(message) {
        switch (message.topic) {
            case 'agent.error':
                this.errorTracker.trackError(new Error(message.data.error), {
                    agent: message.data.agent,
                    severity: message.data.severity
                });
                break;
            
            case 'system.health.check':
                this.performHealthCheck();
                break;
            
            case 'resource.optimization.needed':
                this.optimizePerformance();
                break;
            
            case 'system.failure':
                this.handleSystemFailure(message.data);
                break;
            
            case 'performance.degraded':
                this.handlePerformanceDegradation(message.data);
                break;
        }
    }

    handleSystemFailure(data) {
        this.state.alertLevel = 'critical';
        this.triggerAlert({
            type: 'system_failure',
            severity: 'critical',
            data
        }, 'critical');
    }

    handlePerformanceDegradation(data) {
        this.state.alertLevel = 'high';
        this.optimizePerformance();
    }

    // Agent interface methods
    async executeAction(decision) {
        try {
            switch (decision.action) {
                case 'throttle_operations':
                    return await this.executeThrottling(decision.params);
                
                default:
                    return { success: false, error: 'Unknown action' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeThrottling(params) {
        const actions = [];
        
        if (params.reduceUpdateFrequency) {
            this.throttleOperations();
            actions.push('reduced_update_frequency');
        }
        
        if (params.pauseNonCriticalTasks) {
            this.orchestrator.agents.forEach(agent => {
                if (!agent.isEssential()) {
                    agent.pause();
                    actions.push(`paused_${agent.constructor.name}`);
                }
            });
        }
        
        if (params.enableBatching) {
            // Enable request batching
            actions.push('enabled_batching');
        }
        
        return { success: true, actions };
    }

    isActive() {
        return this.state.isActive;
    }

    isResponsive() {
        const timeSinceActivity = Date.now() - this.state.lastActivity;
        return timeSinceActivity < 120000; // 2 minutes
    }

    isEssential() {
        return true; // Monitoring agent is essential
    }

    getHealthMetrics() {
        return {
            score: this.state.healthScore,
            systemHealth: this.state.systemHealth,
            alertLevel: this.state.alertLevel,
            errorCount: this.errorHistory.length,
            performanceHistory: this.performanceHistory.length,
            lastActivity: this.state.lastActivity
        };
    }

    getLastActivity() {
        return this.state.lastActivity;
    }

    pause() {
        this.state.isActive = false;
        console.log('⏸️ Monitoring Agent paused');
    }

    resume() {
        this.state.isActive = true;
        this.state.lastActivity = Date.now();
        console.log('▶️ Monitoring Agent resumed');
    }
}

window.MonitoringAgent = MonitoringAgent;
