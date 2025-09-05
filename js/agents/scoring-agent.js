/**
 * RFFL Scoring Agent - Autonomous Median Calculation & Analysis
 * Handles intelligent median calculations, anomaly detection, and scoring validation
 */

class ScoringAgent {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.subscribedTopics = [
            'data.refreshed',
            'scoring.validation.needed',
            'scoring.anomaly.check',
            'system.learning.update'
        ];
        
        this.state = {
            isActive: true,
            lastActivity: Date.now(),
            healthScore: 1.0,
            calculationAccuracy: 1.0,
            anomalyDetectionRate: 0.95
        };

        this.medianHistory = [];
        this.anomalyDetectors = new Map();
        this.scoringAlgorithms = new Map();
        this.validationRules = new Map();
        this.adaptiveTuning = new Map();
        
        this.setupAnomalyDetectors();
        this.setupScoringAlgorithms();
        this.setupValidationRules();
    }

    async initialize() {
        console.log('🎯 Initializing Scoring Agent...');
        
        // Setup intelligent median calculation
        this.setupIntelligentMedianCalculation();
        
        // Initialize anomaly detection systems
        this.initializeAnomalyDetection();
        
        // Setup adaptive scoring optimization
        this.setupAdaptiveOptimization();
        
        // Start autonomous scoring loop
        this.startScoringLoop();
        
        console.log('✅ Scoring Agent initialized');
    }

    setupAnomalyDetectors() {
        // Statistical anomaly detection
        this.anomalyDetectors.set('statistical', {
            name: 'Statistical Outlier Detection',
            detect: (scores) => this.detectStatisticalAnomalies(scores),
            sensitivity: 0.8,
            confidence: 0.9
        });

        // Historical comparison anomaly detection
        this.anomalyDetectors.set('historical', {
            name: 'Historical Comparison',
            detect: (median, scores) => this.detectHistoricalAnomalies(median, scores),
            sensitivity: 0.7,
            confidence: 0.85
        });

        // Pattern-based anomaly detection
        this.anomalyDetectors.set('pattern', {
            name: 'Pattern Analysis',
            detect: (data) => this.detectPatternAnomalies(data),
            sensitivity: 0.75,
            confidence: 0.8
        });

        // Projection vs actual anomaly detection
        this.anomalyDetectors.set('projection', {
            name: 'Projection Variance Analysis',
            detect: (teams) => this.detectProjectionAnomalies(teams),
            sensitivity: 0.6,
            confidence: 0.75
        });
    }

    setupScoringAlgorithms() {
        // Primary RFFL median algorithm
        this.scoringAlgorithms.set('rffl_standard', {
            name: 'RFFL Standard Median',
            calculate: (scores) => this.calculateRFFLMedian(scores),
            priority: 1.0,
            accuracy: 1.0
        });

        // Alternative median calculation for validation
        this.scoringAlgorithms.set('statistical_median', {
            name: 'Statistical Median',
            calculate: (scores) => this.calculateStatisticalMedian(scores),
            priority: 0.8,
            accuracy: 0.95
        });

        // Weighted median for special cases
        this.scoringAlgorithms.set('weighted_median', {
            name: 'Weighted Median',
            calculate: (scores, weights) => this.calculateWeightedMedian(scores, weights),
            priority: 0.6,
            accuracy: 0.9
        });
    }

    setupValidationRules() {
        // Median value validation
        this.validationRules.set('median_range', {
            validate: (median) => median >= 0 && median <= 300,
            message: 'Median must be between 0 and 300'
        });

        // Team count validation
        this.validationRules.set('team_count', {
            validate: (teams) => teams && teams.length === 12,
            message: 'Must have exactly 12 teams'
        });

        // Score consistency validation
        this.validationRules.set('score_consistency', {
            validate: (teams) => this.validateScoreConsistency(teams),
            message: 'Scores must be consistent and realistic'
        });

        // Median calculation validation
        this.validationRules.set('calculation_accuracy', {
            validate: (result) => this.validateCalculationAccuracy(result),
            message: 'Median calculation must be mathematically accurate'
        });
    }

    setupIntelligentMedianCalculation() {
        this.intelligentCalculator = {
            calculate: async (teamData) => {
                // Pre-calculation validation
                const preValidation = this.preValidateData(teamData);
                if (!preValidation.isValid) {
                    throw new Error(`Pre-validation failed: ${preValidation.errors.join(', ')}`);
                }

                // Calculate using primary algorithm
                const primaryResult = await this.calculateWithAlgorithm('rffl_standard', teamData);
                
                // Validate result
                const validation = this.validateResult(primaryResult);
                if (!validation.isValid) {
                    console.warn('Primary calculation failed validation, trying alternative');
                    return await this.calculateWithFallback(teamData);
                }

                // Anomaly detection
                const anomalyCheck = await this.performAnomalyDetection(primaryResult);
                if (anomalyCheck.hasAnomalies && anomalyCheck.severity > 0.8) {
                    console.warn('Anomalies detected, flagging for review');
                    this.flagForReview(primaryResult, anomalyCheck);
                }

                // Store in history for learning
                this.storeCalculationHistory(primaryResult);

                return primaryResult;
            },

            calculateWithFallback: async (teamData) => {
                const algorithms = ['statistical_median', 'weighted_median'];
                
                for (const algorithmName of algorithms) {
                    try {
                        const result = await this.calculateWithAlgorithm(algorithmName, teamData);
                        const validation = this.validateResult(result);
                        
                        if (validation.isValid) {
                            console.log(`Fallback calculation successful with ${algorithmName}`);
                            return result;
                        }
                    } catch (error) {
                        console.warn(`Fallback algorithm ${algorithmName} failed:`, error);
                    }
                }
                
                throw new Error('All calculation algorithms failed');
            }
        };
    }

    initializeAnomalyDetection() {
        this.anomalySystem = {
            detectAnomalies: async (data) => {
                const results = [];
                
                for (const [name, detector] of this.anomalyDetectors) {
                    try {
                        const detection = await detector.detect(data);
                        results.push({
                            detector: name,
                            ...detection,
                            confidence: detector.confidence
                        });
                    } catch (error) {
                        console.warn(`Anomaly detector ${name} failed:`, error);
                    }
                }
                
                return this.aggregateAnomalyResults(results);
            },

            adaptSensitivity: (detectorName, performance) => {
                const detector = this.anomalyDetectors.get(detectorName);
                if (detector) {
                    // Adjust sensitivity based on historical performance
                    if (performance.falsePositives > 0.2) {
                        detector.sensitivity = Math.max(0.1, detector.sensitivity - 0.05);
                    } else if (performance.missedAnomalies > 0.1) {
                        detector.sensitivity = Math.min(1.0, detector.sensitivity + 0.05);
                    }
                }
            }
        };
    }

    setupAdaptiveOptimization() {
        this.adaptiveOptimizer = {
            optimizeCalculation: () => {
                const recentHistory = this.medianHistory.slice(-20);
                const patterns = this.analyzeCalculationPatterns(recentHistory);
                
                // Adjust algorithm weights based on performance
                this.adjustAlgorithmWeights(patterns);
                
                // Optimize validation thresholds
                this.optimizeValidationThresholds(patterns);
                
                // Update anomaly detection parameters
                this.updateAnomalyParameters(patterns);
            },

            learnFromFeedback: (calculation, feedback) => {
                // Learn from user feedback or external validation
                this.incorporateFeedback(calculation, feedback);
            }
        };
    }

    startScoringLoop() {
        // Main scoring analysis loop
        setInterval(() => {
            this.autonomousScoringAnalysis();
        }, 20000); // Every 20 seconds

        // Optimization loop
        setInterval(() => {
            this.adaptiveOptimizer.optimizeCalculation();
        }, 300000); // Every 5 minutes

        // Anomaly monitoring loop
        setInterval(() => {
            this.monitorScoringHealth();
        }, 30000); // Every 30 seconds
    }

    async autonomousScoringAnalysis() {
        try {
            // Check if we have fresh data to analyze
            const currentData = await this.getCurrentScoringData();
            if (!currentData) return;

            // Perform intelligent median calculation
            const medianResult = await this.intelligentCalculator.calculate(currentData);
            
            // Update system state
            this.updateScoringState(medianResult);
            
            // Notify other agents of new calculation
            this.orchestrator.messageBus.publish('scoring.updated', {
                median: medianResult.median,
                teams: medianResult.teams,
                quality: medianResult.quality,
                confidence: medianResult.confidence
            }, 'ScoringAgent');

        } catch (error) {
            console.error('Scoring analysis error:', error);
            this.handleScoringError(error);
        }
    }

    async getCurrentScoringData() {
        // Get data from cache or request fresh data
        if (window.agentOrchestrator && window.agentOrchestrator.agents.has('DataAgent')) {
            const dataAgent = window.agentOrchestrator.agents.get('DataAgent');
            return dataAgent.intelligentCache.get('current_scores');
        }
        
        // Fallback to global ESPN API
        if (window.espnAPI) {
            return await window.espnAPI.fetchWeek1Scores();
        }
        
        return null;
    }

    async calculateWithAlgorithm(algorithmName, teamData) {
        const algorithm = this.scoringAlgorithms.get(algorithmName);
        if (!algorithm) {
            throw new Error(`Unknown algorithm: ${algorithmName}`);
        }

        const startTime = performance.now();
        const result = await algorithm.calculate(teamData);
        const calculationTime = performance.now() - startTime;

        return {
            ...result,
            algorithm: algorithmName,
            calculationTime,
            confidence: algorithm.accuracy
        };
    }

    calculateRFFLMedian(teamData) {
        // RFFL standard median calculation (matches existing logic)
        const scores = teamData.map(team => team.score).sort((a, b) => b - a);
        
        if (scores.length !== 12) {
            throw new Error('RFFL median requires exactly 12 teams');
        }

        // Median is average of 6th and 7th place scores (indices 5 and 6)
        const median = (scores[5] + scores[6]) / 2;
        
        // Calculate results for each team
        const teams = teamData.map(team => ({
            ...team,
            result: team.score > median ? 'WIN' : team.score < median ? 'LOSS' : 'TIE',
            marginVsMedian: team.score - median
        })).sort((a, b) => b.score - a.score);

        return {
            median: Math.round(median * 100) / 100,
            teams,
            stats: this.calculateStats(teams, median),
            quality: 1.0
        };
    }

    calculateStatisticalMedian(teamData) {
        // Alternative statistical median calculation
        const scores = teamData.map(team => team.score).sort((a, b) => a - b);
        const n = scores.length;
        
        const median = n % 2 === 0 
            ? (scores[n/2 - 1] + scores[n/2]) / 2
            : scores[Math.floor(n/2)];

        const teams = teamData.map(team => ({
            ...team,
            result: team.score > median ? 'WIN' : team.score < median ? 'LOSS' : 'TIE',
            marginVsMedian: team.score - median
        })).sort((a, b) => b.score - a.score);

        return {
            median: Math.round(median * 100) / 100,
            teams,
            stats: this.calculateStats(teams, median),
            quality: 0.95
        };
    }

    calculateWeightedMedian(teamData, weights = null) {
        // Weighted median calculation for special cases
        if (!weights) {
            weights = teamData.map(() => 1); // Equal weights if none provided
        }

        const weightedData = teamData.map((team, index) => ({
            score: team.score,
            weight: weights[index],
            team
        })).sort((a, b) => a.score - b.score);

        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const medianWeight = totalWeight / 2;

        let cumulativeWeight = 0;
        let median = 0;

        for (let i = 0; i < weightedData.length; i++) {
            cumulativeWeight += weightedData[i].weight;
            if (cumulativeWeight >= medianWeight) {
                if (cumulativeWeight === medianWeight && i < weightedData.length - 1) {
                    median = (weightedData[i].score + weightedData[i + 1].score) / 2;
                } else {
                    median = weightedData[i].score;
                }
                break;
            }
        }

        const teams = teamData.map(team => ({
            ...team,
            result: team.score > median ? 'WIN' : team.score < median ? 'LOSS' : 'TIE',
            marginVsMedian: team.score - median
        })).sort((a, b) => b.score - a.score);

        return {
            median: Math.round(median * 100) / 100,
            teams,
            stats: this.calculateStats(teams, median),
            quality: 0.9
        };
    }

    calculateStats(teams, median) {
        const scores = teams.map(t => t.score);
        return {
            median,
            highScore: Math.max(...scores),
            lowScore: Math.min(...scores),
            range: Math.max(...scores) - Math.min(...scores),
            winners: teams.filter(t => t.result === 'WIN').length,
            losers: teams.filter(t => t.result === 'LOSS').length,
            ties: teams.filter(t => t.result === 'TIE').length,
            averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            standardDeviation: this.calculateStandardDeviation(scores)
        };
    }

    calculateStandardDeviation(scores) {
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
        const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
        return Math.sqrt(variance);
    }

    // Anomaly Detection Methods
    detectStatisticalAnomalies(scores) {
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const stdDev = this.calculateStandardDeviation(scores);
        
        const anomalies = [];
        const threshold = 2.5; // 2.5 standard deviations
        
        scores.forEach((score, index) => {
            const zScore = Math.abs((score - mean) / stdDev);
            if (zScore > threshold) {
                anomalies.push({
                    index,
                    score,
                    zScore,
                    severity: Math.min(zScore / 3, 1),
                    type: 'statistical_outlier'
                });
            }
        });

        return {
            hasAnomalies: anomalies.length > 0,
            anomalies,
            severity: anomalies.length > 0 ? Math.max(...anomalies.map(a => a.severity)) : 0
        };
    }

    detectHistoricalAnomalies(median, scores) {
        const historicalMedians = this.medianHistory.map(h => h.median);
        if (historicalMedians.length < 5) {
            return { hasAnomalies: false, anomalies: [], severity: 0 };
        }

        const historicalMean = historicalMedians.reduce((sum, m) => sum + m, 0) / historicalMedians.length;
        const historicalStdDev = this.calculateStandardDeviation(historicalMedians);
        
        const medianZScore = Math.abs((median - historicalMean) / historicalStdDev);
        
        const anomalies = [];
        if (medianZScore > 2.0) {
            anomalies.push({
                type: 'historical_median_anomaly',
                median,
                historicalMean,
                zScore: medianZScore,
                severity: Math.min(medianZScore / 3, 1)
            });
        }

        return {
            hasAnomalies: anomalies.length > 0,
            anomalies,
            severity: anomalies.length > 0 ? Math.max(...anomalies.map(a => a.severity)) : 0
        };
    }

    detectPatternAnomalies(data) {
        // Detect unusual patterns in team performance
        const anomalies = [];
        
        // Check for unusual score clustering
        const scores = data.teams.map(t => t.score).sort((a, b) => a - b);
        const gaps = [];
        
        for (let i = 1; i < scores.length; i++) {
            gaps.push(scores[i] - scores[i-1]);
        }
        
        const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        const largeGaps = gaps.filter(gap => gap > averageGap * 3);
        
        if (largeGaps.length > 0) {
            anomalies.push({
                type: 'score_clustering',
                description: 'Unusual gaps between team scores',
                severity: Math.min(largeGaps.length / 3, 1)
            });
        }

        return {
            hasAnomalies: anomalies.length > 0,
            anomalies,
            severity: anomalies.length > 0 ? Math.max(...anomalies.map(a => a.severity)) : 0
        };
    }

    detectProjectionAnomalies(teams) {
        const anomalies = [];
        
        teams.forEach((team, index) => {
            const projectionVariance = Math.abs(team.score - team.proj) / team.proj;
            
            if (projectionVariance > 0.5) { // More than 50% variance
                anomalies.push({
                    index,
                    team: team.team,
                    projectionVariance,
                    actual: team.score,
                    projected: team.proj,
                    type: 'projection_variance',
                    severity: Math.min(projectionVariance, 1)
                });
            }
        });

        return {
            hasAnomalies: anomalies.length > 0,
            anomalies,
            severity: anomalies.length > 0 ? Math.max(...anomalies.map(a => a.severity)) : 0
        };
    }

    aggregateAnomalyResults(results) {
        const allAnomalies = results.flatMap(r => r.anomalies || []);
        const maxSeverity = Math.max(...results.map(r => r.severity || 0), 0);
        
        return {
            hasAnomalies: allAnomalies.length > 0,
            anomalies: allAnomalies,
            severity: maxSeverity,
            detectorResults: results
        };
    }

    // Validation Methods
    preValidateData(teamData) {
        const errors = [];
        
        if (!Array.isArray(teamData)) {
            errors.push('Team data must be an array');
        } else {
            if (teamData.length !== 12) {
                errors.push('Must have exactly 12 teams');
            }
            
            teamData.forEach((team, index) => {
                if (typeof team.score !== 'number') {
                    errors.push(`Team ${index}: Invalid score`);
                }
                if (team.score < 0 || team.score > 300) {
                    errors.push(`Team ${index}: Score out of range`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateResult(result) {
        const errors = [];
        
        // Apply all validation rules
        this.validationRules.forEach((rule, name) => {
            try {
                if (!rule.validate(result)) {
                    errors.push(`${name}: ${rule.message}`);
                }
            } catch (error) {
                errors.push(`${name}: Validation error - ${error.message}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateScoreConsistency(teams) {
        const scores = teams.map(t => t.score);
        const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const stdDev = this.calculateStandardDeviation(scores);
        
        // Check if standard deviation is reasonable
        return stdDev > 5 && stdDev < 50; // Reasonable spread
    }

    validateCalculationAccuracy(result) {
        if (!result.teams || result.teams.length !== 12) return false;
        
        // Verify median calculation
        const scores = result.teams.map(t => t.score).sort((a, b) => b - a);
        const expectedMedian = (scores[5] + scores[6]) / 2;
        const actualMedian = result.median;
        
        return Math.abs(expectedMedian - actualMedian) < 0.01;
    }

    // Performance and Learning Methods
    storeCalculationHistory(result) {
        this.medianHistory.push({
            timestamp: Date.now(),
            median: result.median,
            algorithm: result.algorithm,
            calculationTime: result.calculationTime,
            confidence: result.confidence,
            quality: result.quality
        });

        // Keep only last 100 calculations
        if (this.medianHistory.length > 100) {
            this.medianHistory.shift();
        }
    }

    analyzeCalculationPatterns(history) {
        if (history.length < 10) return {};

        const algorithms = {};
        const timings = [];
        const accuracies = [];

        history.forEach(calc => {
            if (!algorithms[calc.algorithm]) {
                algorithms[calc.algorithm] = { count: 0, totalTime: 0, accuracies: [] };
            }
            algorithms[calc.algorithm].count++;
            algorithms[calc.algorithm].totalTime += calc.calculationTime;
            algorithms[calc.algorithm].accuracies.push(calc.confidence);
            
            timings.push(calc.calculationTime);
            accuracies.push(calc.confidence);
        });

        return {
            algorithmPerformance: algorithms,
            averageTiming: timings.reduce((sum, t) => sum + t, 0) / timings.length,
            averageAccuracy: accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length,
            trendingSlower: timings.slice(-5).reduce((sum, t) => sum + t, 0) > timings.slice(0, 5).reduce((sum, t) => sum + t, 0)
        };
    }

    adjustAlgorithmWeights(patterns) {
        Object.entries(patterns.algorithmPerformance || {}).forEach(([algorithmName, performance]) => {
            const algorithm = this.scoringAlgorithms.get(algorithmName);
            if (algorithm) {
                const avgAccuracy = performance.accuracies.reduce((sum, a) => sum + a, 0) / performance.accuracies.length;
                const avgTime = performance.totalTime / performance.count;
                
                // Adjust priority based on performance
                algorithm.priority = (avgAccuracy * 0.7) + ((1 - avgTime / 1000) * 0.3);
            }
        });
    }

    optimizeValidationThresholds(patterns) {
        // Adjust validation thresholds based on historical performance
        if (patterns.averageAccuracy > 0.95) {
            // Tighten validation if we're consistently accurate
            this.validationRules.forEach(rule => {
                if (rule.threshold) {
                    rule.threshold *= 0.95;
                }
            });
        }
    }

    updateAnomalyParameters(patterns) {
        // Adjust anomaly detection sensitivity based on false positive rates
        this.anomalyDetectors.forEach(detector => {
            // This would be enhanced with actual false positive tracking
            if (patterns.averageAccuracy > 0.9) {
                detector.sensitivity = Math.min(1.0, detector.sensitivity + 0.02);
            }
        });
    }

    async performAnomalyDetection(result) {
        return await this.anomalySystem.detectAnomalies({
            median: result.median,
            teams: result.teams,
            scores: result.teams.map(t => t.score)
        });
    }

    flagForReview(result, anomalyCheck) {
        this.orchestrator.messageBus.publish('scoring.anomaly.detected', {
            result,
            anomalies: anomalyCheck.anomalies,
            severity: anomalyCheck.severity,
            requiresReview: true
        }, 'ScoringAgent');
    }

    updateScoringState(result) {
        this.state.lastActivity = Date.now();
        this.state.calculationAccuracy = result.confidence;
        
        // Update health score based on calculation quality
        if (result.quality > 0.9) {
            this.state.healthScore = Math.min(1.0, this.state.healthScore + 0.01);
        } else if (result.quality < 0.7) {
            this.state.healthScore = Math.max(0.1, this.state.healthScore - 0.05);
        }
    }

    monitorScoringHealth() {
        const recentCalculations = this.medianHistory.slice(-10);
        if (recentCalculations.length === 0) return;

        const avgQuality = recentCalculations.reduce((sum, calc) => sum + calc.quality, 0) / recentCalculations.length;
        const avgTime = recentCalculations.reduce((sum, calc) => sum + calc.calculationTime, 0) / recentCalculations.length;

        if (avgQuality < 0.8) {
            this.orchestrator.messageBus.publish('scoring.quality.degraded', {
                averageQuality: avgQuality,
                recentCalculations: recentCalculations.length
            }, 'ScoringAgent');
        }

        if (avgTime > 100) { // 100ms threshold
            this.orchestrator.messageBus.publish('scoring.performance.slow', {
                averageTime: avgTime,
                threshold: 100
            }, 'ScoringAgent');
        }
    }

    handleScoringError(error) {
        this.state.healthScore = Math.max(0, this.state.healthScore - 0.1);
        console.error('Scoring Agent error:', error);
        
        this.orchestrator.messageBus.publish('agent.error', {
            agent: 'ScoringAgent',
            error: error.message,
            severity: 'high'
        }, 'ScoringAgent');
    }

    // Message handling
    handleMessage(message) {
        switch (message.topic) {
            case 'data.refreshed':
                // Recalculate median with fresh data
                this.autonomousScoringAnalysis();
                break;
            
            case 'scoring.validation.needed':
                // Perform additional validation
                this.validateCurrentScoring();
                break;
            
            case 'scoring.anomaly.check':
                // Run anomaly detection
                this.runAnomalyCheck();
                break;
            
            case 'system.learning.update':
                // Update algorithms based on learning
                this.incorporateLearning(message.data);
                break;
        }
    }

    // Agent interface methods
    async executeAction(decision) {
        try {
            switch (decision.action) {
                case 'recalculate_median':
                    return await this.executeRecalculation(decision.params);
                
                default:
                    return { success: false, error: 'Unknown action' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeRecalculation(params) {
        try {
            const currentData = await this.getCurrentScoringData();
            if (!currentData) {
                return { success: false, error: 'No data available for recalculation' };
            }

            const algorithm = params.useAlternativeAlgorithm ? 'statistical_median' : 'rffl_standard';
            const result = await this.calculateWithAlgorithm(algorithm, currentData);
            
            if (params.flagForManualReview) {
                this.orchestrator.messageBus.publish('scoring.manual_review_needed', {
                    result,
                    reason: 'High anomaly score detected'
                }, 'ScoringAgent');
            }

            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    validateCurrentScoring() {
        // Implementation for additional validation
        const lastCalculation = this.medianHistory[this.medianHistory.length - 1];
        if (lastCalculation) {
            const validation = this.validateResult(lastCalculation);
            if (!validation.isValid) {
                this.orchestrator.messageBus.publish('scoring.validation.failed', {
                    errors: validation.errors
                }, 'ScoringAgent');
            }
        }
    }

    async runAnomalyCheck() {
        const currentData = await this.getCurrentScoringData();
        if (currentData) {
            const anomalyCheck = await this.performAnomalyDetection({ teams: currentData });
            if (anomalyCheck.hasAnomalies) {
                this.orchestrator.messageBus.publish('scoring.anomaly.found', anomalyCheck, 'ScoringAgent');
            }
        }
    }

    incorporateLearning(learningData) {
        // Incorporate system-wide learning into scoring algorithms
        if (learningData.recommendedAdjustments) {
            learningData.recommendedAdjustments.forEach(adjustment => {
                if (adjustment.type === 'scoring_accuracy') {
                    this.adjustAlgorithmWeights(adjustment.data);
                }
            });
        }
    }

    incorporateFeedback(calculation, feedback) {
        // Learn from external feedback
        if (feedback.accuracy) {
            const algorithm = this.scoringAlgorithms.get(calculation.algorithm);
            if (algorithm) {
                algorithm.accuracy = (algorithm.accuracy * 0.9) + (feedback.accuracy * 0.1);
            }
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
        return true; // Scoring agent is essential
    }

    getHealthMetrics() {
        return {
            score: this.state.healthScore,
            calculationAccuracy: this.state.calculationAccuracy,
            anomalyDetectionRate: this.state.anomalyDetectionRate,
            lastActivity: this.state.lastActivity,
            calculationHistory: this.medianHistory.length
        };
    }

    getLastActivity() {
        return this.state.lastActivity;
    }

    pause() {
        this.state.isActive = false;
        console.log('⏸️ Scoring Agent paused');
    }

    resume() {
        this.state.isActive = true;
        this.state.lastActivity = Date.now();
        console.log('▶️ Scoring Agent resumed');
    }
}

window.ScoringAgent = ScoringAgent;
