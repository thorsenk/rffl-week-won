/**
 * RFFL Data Agent - Autonomous Data Management
 * Handles intelligent data fetching, caching, validation, and optimization
 */

class DataAgent {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.subscribedTopics = [
            'data.quality.check',
            'data.refresh.needed',
            'system.optimization.needed',
            'agent.unresponsive'
        ];
        
        this.state = {
            isActive: true,
            lastActivity: Date.now(),
            healthScore: 1.0,
            dataQuality: 1.0,
            cacheHitRate: 0.8,
            apiResponseTime: 0
        };

        this.cache = new Map();
        this.dataValidationRules = new Map();
        this.adaptiveStrategies = new Map();
        this.qualityMetrics = new Map();
        
        this.setupValidationRules();
        this.setupAdaptiveStrategies();
    }

    async initialize() {
        console.log('🔄 Initializing Data Agent...');
        
        // Setup intelligent caching
        this.setupIntelligentCaching();
        
        // Initialize data quality monitoring
        this.setupQualityMonitoring();
        
        // Setup predictive prefetching
        this.setupPredictivePrefetching();
        
        // Start autonomous data management loop
        this.startDataManagementLoop();
        
        console.log('✅ Data Agent initialized');
    }

    setupValidationRules() {
        // ESPN API data validation rules
        this.dataValidationRules.set('espn_scores', {
            required: ['team', 'score', 'proj'],
            scoreRange: { min: 0, max: 300 },
            projectionRange: { min: 0, max: 200 },
            teamCodePattern: /^[A-Z]{2,5}$/,
            validate: (data) => this.validateESPNScores(data)
        });

        // Canonical team data validation
        this.dataValidationRules.set('canonical_teams', {
            required: ['team_code', 'team_full_name', 'owner_code_1'],
            teamCodePattern: /^[A-Z]{2,5}$/,
            validate: (data) => this.validateCanonicalTeams(data)
        });

        // Median calculation validation
        this.dataValidationRules.set('median_results', {
            required: ['median', 'teams'],
            medianRange: { min: 0, max: 200 },
            teamCount: 12,
            validate: (data) => this.validateMedianResults(data)
        });
    }

    setupAdaptiveStrategies() {
        // Data fetching strategies based on context
        this.adaptiveStrategies.set('live_game', {
            refreshInterval: 30000, // 30 seconds during live games
            cacheTimeout: 60000, // 1 minute cache
            retryAttempts: 5,
            prioritizeRealtime: true
        });

        this.adaptiveStrategies.set('pre_game', {
            refreshInterval: 300000, // 5 minutes pre-game
            cacheTimeout: 600000, // 10 minute cache
            retryAttempts: 3,
            prioritizeRealtime: false
        });

        this.adaptiveStrategies.set('post_game', {
            refreshInterval: 3600000, // 1 hour post-game
            cacheTimeout: 7200000, // 2 hour cache
            retryAttempts: 2,
            prioritizeRealtime: false
        });
    }

    setupIntelligentCaching() {
        this.intelligentCache = {
            data: new Map(),
            metadata: new Map(),
            
            set: (key, value, options = {}) => {
                const metadata = {
                    timestamp: Date.now(),
                    accessCount: 0,
                    lastAccessed: Date.now(),
                    priority: options.priority || 'normal',
                    ttl: options.ttl || 300000, // 5 minutes default
                    quality: options.quality || 1.0
                };
                
                this.intelligentCache.data.set(key, value);
                this.intelligentCache.metadata.set(key, metadata);
                
                // Trigger cache optimization if needed
                if (this.intelligentCache.data.size > 100) {
                    this.optimizeCache();
                }
            },
            
            get: (key) => {
                const value = this.intelligentCache.data.get(key);
                const metadata = this.intelligentCache.metadata.get(key);
                
                if (!value || !metadata) return null;
                
                // Check TTL
                if (Date.now() - metadata.timestamp > metadata.ttl) {
                    this.intelligentCache.data.delete(key);
                    this.intelligentCache.metadata.delete(key);
                    return null;
                }
                
                // Update access metrics
                metadata.accessCount++;
                metadata.lastAccessed = Date.now();
                
                return value;
            },
            
            invalidate: (pattern) => {
                const keysToDelete = [];
                this.intelligentCache.data.forEach((_, key) => {
                    if (key.match(pattern)) {
                        keysToDelete.push(key);
                    }
                });
                
                keysToDelete.forEach(key => {
                    this.intelligentCache.data.delete(key);
                    this.intelligentCache.metadata.delete(key);
                });
            }
        };
    }

    setupQualityMonitoring() {
        this.qualityMonitor = {
            checkDataQuality: (data, type) => {
                const rule = this.dataValidationRules.get(type);
                if (!rule) return { quality: 0.5, issues: ['No validation rule found'] };
                
                return rule.validate(data);
            },
            
            trackQualityTrend: (quality, type) => {
                if (!this.qualityMetrics.has(type)) {
                    this.qualityMetrics.set(type, []);
                }
                
                const history = this.qualityMetrics.get(type);
                history.push({ quality, timestamp: Date.now() });
                
                // Keep only last 100 measurements
                if (history.length > 100) {
                    history.shift();
                }
                
                return this.analyzeQualityTrend(history);
            }
        };
    }

    setupPredictivePrefetching() {
        this.prefetchPredictor = {
            userPatterns: new Map(),
            
            recordUserAction: (action, context) => {
                const pattern = `${action}_${context}`;
                if (!this.prefetchPredictor.userPatterns.has(pattern)) {
                    this.prefetchPredictor.userPatterns.set(pattern, { count: 0, lastSeen: 0 });
                }
                
                const data = this.prefetchPredictor.userPatterns.get(pattern);
                data.count++;
                data.lastSeen = Date.now();
            },
            
            predictNextAction: (currentContext) => {
                let bestPrediction = null;
                let highestScore = 0;
                
                this.prefetchPredictor.userPatterns.forEach((data, pattern) => {
                    if (pattern.includes(currentContext)) {
                        const recency = 1 - (Date.now() - data.lastSeen) / (24 * 60 * 60 * 1000);
                        const frequency = Math.min(data.count / 10, 1);
                        const score = recency * 0.6 + frequency * 0.4;
                        
                        if (score > highestScore) {
                            highestScore = score;
                            bestPrediction = pattern;
                        }
                    }
                });
                
                return bestPrediction;
            }
        };
    }

    startDataManagementLoop() {
        // Main data management loop
        setInterval(() => {
            this.autonomousDataManagement();
        }, 15000); // Every 15 seconds

        // Cache optimization loop
        setInterval(() => {
            this.optimizeCache();
        }, 60000); // Every minute

        // Data quality assessment loop
        setInterval(() => {
            this.assessDataQuality();
        }, 30000); // Every 30 seconds
    }

    async autonomousDataManagement() {
        try {
            // Determine current context
            const context = this.determineDataContext();
            
            // Apply adaptive strategy
            const strategy = this.adaptiveStrategies.get(context) || this.adaptiveStrategies.get('pre_game');
            
            // Check if refresh is needed
            if (this.shouldRefreshData(strategy)) {
                await this.intelligentDataRefresh(strategy);
            }
            
            // Predictive prefetching
            await this.performPredictivePrefetch();
            
            // Update health metrics
            this.updateHealthMetrics();
            
        } catch (error) {
            console.error('Data management loop error:', error);
            this.handleDataError(error);
        }
    }

    determineDataContext() {
        const now = new Date();
        const gameTime = this.isGameTime(now);
        
        if (gameTime.isLive) return 'live_game';
        if (gameTime.isPreGame) return 'pre_game';
        return 'post_game';
    }

    isGameTime(now) {
        // Simplified game time detection - in production this would use real schedule data
        const dayOfWeek = now.getDay(); // 0 = Sunday
        const hour = now.getHours();
        
        const isGameDay = dayOfWeek === 0 || dayOfWeek === 1; // Sunday or Monday
        const isGameHours = hour >= 10 && hour <= 23; // 10 AM to 11 PM
        
        return {
            isLive: isGameDay && isGameHours && hour >= 13 && hour <= 20, // 1 PM to 8 PM
            isPreGame: isGameDay && isGameHours && hour < 13,
            isPostGame: isGameDay && isGameHours && hour > 20
        };
    }

    shouldRefreshData(strategy) {
        const lastRefresh = this.state.lastDataRefresh || 0;
        const timeSinceRefresh = Date.now() - lastRefresh;
        
        return timeSinceRefresh >= strategy.refreshInterval;
    }

    async intelligentDataRefresh(strategy) {
        console.log('🔄 Intelligent data refresh initiated');
        
        try {
            // Fetch data with adaptive retry logic
            const data = await this.fetchWithRetry(strategy);
            
            // Validate data quality
            const qualityCheck = this.qualityMonitor.checkDataQuality(data, 'espn_scores');
            
            if (qualityCheck.quality < 0.7) {
                console.warn('⚠️ Data quality below threshold:', qualityCheck);
                this.orchestrator.messageBus.publish('data.quality.degraded', qualityCheck, 'DataAgent');
                return;
            }
            
            // Cache with intelligent metadata
            this.intelligentCache.set('current_scores', data, {
                priority: strategy.prioritizeRealtime ? 'high' : 'normal',
                ttl: strategy.cacheTimeout,
                quality: qualityCheck.quality
            });
            
            this.state.lastDataRefresh = Date.now();
            this.state.dataQuality = qualityCheck.quality;
            
            // Notify other agents of fresh data
            this.orchestrator.messageBus.publish('data.refreshed', { data, quality: qualityCheck.quality }, 'DataAgent');
            
        } catch (error) {
            console.error('Data refresh failed:', error);
            await this.handleDataRefreshFailure(error, strategy);
        }
    }

    async fetchWithRetry(strategy) {
        let lastError;
        
        for (let attempt = 1; attempt <= strategy.retryAttempts; attempt++) {
            try {
                const startTime = Date.now();
                const data = await this.fetchCurrentData();
                this.state.apiResponseTime = Date.now() - startTime;
                
                return data;
                
            } catch (error) {
                lastError = error;
                console.warn(`Data fetch attempt ${attempt} failed:`, error.message);
                
                if (attempt < strategy.retryAttempts) {
                    // Exponential backoff
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    async fetchCurrentData() {
        // Use existing ESPN API service
        if (window.espnAPI) {
            return await window.espnAPI.fetchWeek1Scores();
        }
        
        throw new Error('ESPN API service not available');
    }

    async handleDataRefreshFailure(error, strategy) {
        // Try fallback to cached data
        const cachedData = this.intelligentCache.get('current_scores');
        
        if (cachedData) {
            console.log('📦 Using cached data as fallback');
            this.orchestrator.messageBus.publish('data.fallback.activated', { reason: error.message }, 'DataAgent');
            return cachedData;
        }
        
        // Try sample data as last resort
        if (window.espnAPI && typeof window.espnAPI.fetchSampleData === 'function') {
            console.log('🎭 Using sample data as fallback');
            const sampleData = await window.espnAPI.fetchSampleData();
            this.orchestrator.messageBus.publish('data.sample.activated', { reason: error.message }, 'DataAgent');
            return sampleData;
        }
        
        // Complete failure
        this.orchestrator.messageBus.publish('data.failure.complete', { error: error.message }, 'DataAgent');
        throw error;
    }

    async performPredictivePrefetch() {
        const context = this.determineDataContext();
        const prediction = this.prefetchPredictor.predictNextAction(context);
        
        if (prediction && prediction.includes('team_details')) {
            // Prefetch team details that are likely to be requested
            await this.prefetchLikelyTeamData();
        }
        
        if (prediction && prediction.includes('historical')) {
            // Prefetch historical data
            await this.prefetchHistoricalData();
        }
    }

    async prefetchLikelyTeamData() {
        // Prefetch data for teams with high user interest
        const popularTeams = this.identifyPopularTeams();
        
        for (const teamCode of popularTeams) {
            const cacheKey = `team_details_${teamCode}`;
            if (!this.intelligentCache.get(cacheKey)) {
                try {
                    const teamData = await this.fetchTeamDetails(teamCode);
                    this.intelligentCache.set(cacheKey, teamData, { priority: 'low', ttl: 600000 });
                } catch (error) {
                    // Prefetch failures are non-critical
                    console.debug('Prefetch failed for team:', teamCode);
                }
            }
        }
    }

    async prefetchHistoricalData() {
        // Prefetch historical context data
        const cacheKey = 'historical_context';
        if (!this.intelligentCache.get(cacheKey)) {
            try {
                const historicalData = await this.fetchHistoricalContext();
                this.intelligentCache.set(cacheKey, historicalData, { priority: 'low', ttl: 3600000 });
            } catch (error) {
                console.debug('Historical data prefetch failed');
            }
        }
    }

    optimizeCache() {
        const maxCacheSize = 50;
        const currentSize = this.intelligentCache.data.size;
        
        if (currentSize <= maxCacheSize) return;
        
        console.log('🧹 Optimizing cache...');
        
        // Score each cache entry
        const entries = [];
        this.intelligentCache.metadata.forEach((metadata, key) => {
            const age = Date.now() - metadata.timestamp;
            const recency = 1 - (age / (24 * 60 * 60 * 1000)); // 24 hour max
            const frequency = Math.min(metadata.accessCount / 10, 1);
            const priority = metadata.priority === 'high' ? 1.5 : metadata.priority === 'low' ? 0.5 : 1.0;
            
            const score = (recency * 0.4 + frequency * 0.4 + metadata.quality * 0.2) * priority;
            entries.push({ key, score, metadata });
        });
        
        // Sort by score and remove lowest scoring entries
        entries.sort((a, b) => a.score - b.score);
        const toRemove = entries.slice(0, currentSize - maxCacheSize);
        
        toRemove.forEach(({ key }) => {
            this.intelligentCache.data.delete(key);
            this.intelligentCache.metadata.delete(key);
        });
        
        console.log(`🧹 Removed ${toRemove.length} cache entries`);
    }

    assessDataQuality() {
        const currentData = this.intelligentCache.get('current_scores');
        if (!currentData) return;
        
        const qualityCheck = this.qualityMonitor.checkDataQuality(currentData, 'espn_scores');
        const trend = this.qualityMonitor.trackQualityTrend(qualityCheck.quality, 'espn_scores');
        
        this.state.dataQuality = qualityCheck.quality;
        
        if (qualityCheck.quality < 0.6) {
            this.orchestrator.messageBus.publish('data.quality.critical', {
                quality: qualityCheck.quality,
                issues: qualityCheck.issues,
                trend
            }, 'DataAgent');
        } else if (trend.declining && trend.rate > 0.1) {
            this.orchestrator.messageBus.publish('data.quality.declining', {
                quality: qualityCheck.quality,
                trend
            }, 'DataAgent');
        }
    }

    // Validation methods
    validateESPNScores(data) {
        const issues = [];
        let validCount = 0;
        
        if (!Array.isArray(data)) {
            return { quality: 0, issues: ['Data is not an array'] };
        }
        
        data.forEach((team, index) => {
            const teamIssues = [];
            
            // Required fields
            if (!team.team) teamIssues.push('Missing team code');
            if (typeof team.score !== 'number') teamIssues.push('Invalid score');
            if (typeof team.proj !== 'number') teamIssues.push('Invalid projection');
            
            // Range validation
            if (team.score < 0 || team.score > 300) teamIssues.push('Score out of range');
            if (team.proj < 0 || team.proj > 200) teamIssues.push('Projection out of range');
            
            // Pattern validation
            if (team.team && !team.team.match(/^[A-Z]{2,5}$/)) teamIssues.push('Invalid team code format');
            
            if (teamIssues.length === 0) {
                validCount++;
            } else {
                issues.push(`Team ${index}: ${teamIssues.join(', ')}`);
            }
        });
        
        const quality = validCount / data.length;
        return { quality, issues };
    }

    validateCanonicalTeams(data) {
        // Similar validation for canonical team data
        const issues = [];
        let validCount = 0;
        
        if (!Array.isArray(data)) {
            return { quality: 0, issues: ['Data is not an array'] };
        }
        
        data.forEach((team, index) => {
            const teamIssues = [];
            
            if (!team.team_code) teamIssues.push('Missing team code');
            if (!team.team_full_name) teamIssues.push('Missing team name');
            if (!team.owner_code_1) teamIssues.push('Missing primary owner');
            
            if (teamIssues.length === 0) {
                validCount++;
            } else {
                issues.push(`Team ${index}: ${teamIssues.join(', ')}`);
            }
        });
        
        const quality = validCount / data.length;
        return { quality, issues };
    }

    validateMedianResults(data) {
        const issues = [];
        
        if (typeof data.median !== 'number') issues.push('Invalid median value');
        if (!Array.isArray(data.teams)) issues.push('Invalid teams array');
        if (data.teams && data.teams.length !== 12) issues.push('Expected 12 teams');
        
        const quality = issues.length === 0 ? 1.0 : 0.5;
        return { quality, issues };
    }

    analyzeQualityTrend(history) {
        if (history.length < 5) return { trend: 'stable', rate: 0 };
        
        const recent = history.slice(-5);
        const older = history.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, item) => sum + item.quality, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.quality, 0) / older.length;
        
        const rate = recentAvg - olderAvg;
        
        return {
            trend: rate > 0.05 ? 'improving' : rate < -0.05 ? 'declining' : 'stable',
            rate: Math.abs(rate),
            recentAverage: recentAvg,
            olderAverage: olderAvg
        };
    }

    identifyPopularTeams() {
        // Analyze user interaction patterns to identify popular teams
        // This would be enhanced with real user analytics
        return ['WZRD', 'CHLK', 'MRYJ', 'PCX']; // Top 4 most likely to be viewed
    }

    async fetchTeamDetails(teamCode) {
        if (window.espnAPI && typeof window.espnAPI.fetchTeamRoster === 'function') {
            return await window.espnAPI.fetchTeamRoster(teamCode);
        }
        return null;
    }

    async fetchHistoricalContext() {
        if (window.rfflData && typeof window.rfflData.getHistoricalContext === 'function') {
            return window.rfflData.getHistoricalContext(100); // Sample score
        }
        return null;
    }

    handleDataError(error) {
        this.state.healthScore = Math.max(0, this.state.healthScore - 0.1);
        console.error('Data Agent error:', error);
        
        this.orchestrator.messageBus.publish('agent.error', {
            agent: 'DataAgent',
            error: error.message,
            severity: 'medium'
        }, 'DataAgent');
    }

    updateHealthMetrics() {
        const now = Date.now();
        const timeSinceLastActivity = now - this.state.lastActivity;
        
        // Decay health score if inactive
        if (timeSinceLastActivity > 60000) { // 1 minute
            this.state.healthScore = Math.max(0.1, this.state.healthScore - 0.05);
        } else {
            // Recover health score
            this.state.healthScore = Math.min(1.0, this.state.healthScore + 0.02);
        }
        
        this.state.lastActivity = now;
    }

    // Message handling
    handleMessage(message) {
        switch (message.topic) {
            case 'data.quality.check':
                this.assessDataQuality();
                break;
            
            case 'data.refresh.needed':
                this.intelligentDataRefresh(this.adaptiveStrategies.get('live_game'));
                break;
            
            case 'system.optimization.needed':
                this.optimizeCache();
                break;
        }
    }

    // Agent interface methods
    async executeAction(decision) {
        try {
            switch (decision.action) {
                case 'fallback_to_cache':
                    return await this.executeDataFallback(decision.params);
                
                case 'activate_sample_data':
                    return await this.activateSampleData(decision.params);
                
                default:
                    return { success: false, error: 'Unknown action' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeDataFallback(params) {
        const cachedData = this.intelligentCache.get('current_scores');
        
        if (cachedData) {
            if (params.notifyUser) {
                this.orchestrator.messageBus.publish('ui.notification', {
                    type: 'info',
                    message: 'Using cached data due to API issues'
                }, 'DataAgent');
            }
            
            return { success: true, data: cachedData };
        }
        
        return { success: false, error: 'No cached data available' };
    }

    async activateSampleData(params) {
        try {
            const sampleData = await this.fetchCurrentData();
            
            if (params.showMaintenanceMode) {
                this.orchestrator.messageBus.publish('ui.maintenance_mode', {
                    enabled: true,
                    message: 'Using sample data - ESPN API temporarily unavailable'
                }, 'DataAgent');
            }
            
            return { success: true, data: sampleData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    isActive() {
        return this.state.isActive;
    }

    isResponsive() {
        const timeSinceActivity = Date.now() - this.state.lastActivity;
        return timeSinceActivity < 120000; // 2 minutes
    }

    isEssential() {
        return true; // Data agent is essential
    }

    getHealthMetrics() {
        return {
            score: this.state.healthScore,
            dataQuality: this.state.dataQuality,
            cacheHitRate: this.state.cacheHitRate,
            apiResponseTime: this.state.apiResponseTime,
            lastActivity: this.state.lastActivity
        };
    }

    getLastActivity() {
        return this.state.lastActivity;
    }

    pause() {
        this.state.isActive = false;
        console.log('⏸️ Data Agent paused');
    }

    resume() {
        this.state.isActive = true;
        this.state.lastActivity = Date.now();
        console.log('▶️ Data Agent resumed');
    }

    // Utility methods
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.DataAgent = DataAgent;
