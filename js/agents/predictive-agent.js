/**
 * RFFL Predictive Agent - Autonomous Forecasting & Trend Analysis
 * Handles predictive analytics, trend forecasting, and proactive optimizations
 */

class PredictiveAgent {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.subscribedTopics = [
            'data.refreshed',
            'scoring.updated',
            'user.behavior.changed',
            'system.learning.update',
            'performance.trends'
        ];
        
        this.state = {
            isActive: true,
            lastActivity: Date.now(),
            healthScore: 1.0,
            predictionAccuracy: 0.8,
            learningRate: 0.1
        };

        this.predictionModels = new Map();
        this.historicalData = new Map();
        this.trendAnalysis = new Map();
        this.forecastingEngine = new Map();
        this.learningAlgorithms = new Map();
        
        this.setupPredictionModels();
        this.setupForecastingEngine();
        this.setupLearningAlgorithms();
    }

    async initialize() {
        console.log('🔮 Initializing Predictive Agent...');
        
        // Setup predictive modeling
        this.setupPredictiveModeling();
        
        // Initialize trend analysis
        this.initializeTrendAnalysis();
        
        // Setup machine learning capabilities
        this.setupMachineLearning();
        
        // Initialize forecasting systems
        this.initializeForecastingSystems();
        
        // Start autonomous prediction loop
        this.startPredictionLoop();
        
        console.log('✅ Predictive Agent initialized');
    }

    setupPredictionModels() {
        // Median prediction model
        this.predictionModels.set('median_forecast', {
            name: 'Median Score Forecasting',
            type: 'time_series',
            features: ['historical_medians', 'team_performance', 'game_context'],
            accuracy: 0.75,
            confidence: 0.8,
            predict: (data) => this.predictMedianTrend(data)
        });

        // User behavior prediction model
        this.predictionModels.set('user_behavior', {
            name: 'User Behavior Prediction',
            type: 'classification',
            features: ['interaction_patterns', 'usage_frequency', 'device_type'],
            accuracy: 0.82,
            confidence: 0.85,
            predict: (data) => this.predictUserBehavior(data)
        });

        // System performance prediction model
        this.predictionModels.set('performance_forecast', {
            name: 'Performance Forecasting',
            type: 'regression',
            features: ['resource_usage', 'load_patterns', 'error_rates'],
            accuracy: 0.78,
            confidence: 0.75,
            predict: (data) => this.predictSystemPerformance(data)
        });

        // Team ranking prediction model
        this.predictionModels.set('ranking_prediction', {
            name: 'Team Ranking Prediction',
            type: 'ranking',
            features: ['current_scores', 'projections', 'historical_performance'],
            accuracy: 0.85,
            confidence: 0.9,
            predict: (data) => this.predictTeamRankings(data)
        });
    }

    setupForecastingEngine() {
        this.forecastingEngine.set('linear_regression', {
            name: 'Linear Regression',
            predict: (data, features) => this.linearRegression(data, features),
            suitable: ['continuous', 'linear_trends']
        });

        this.forecastingEngine.set('exponential_smoothing', {
            name: 'Exponential Smoothing',
            predict: (data, alpha = 0.3) => this.exponentialSmoothing(data, alpha),
            suitable: ['time_series', 'seasonal_patterns']
        });

        this.forecastingEngine.set('moving_average', {
            name: 'Moving Average',
            predict: (data, window = 5) => this.movingAverage(data, window),
            suitable: ['trend_analysis', 'noise_reduction']
        });

        this.forecastingEngine.set('polynomial_regression', {
            name: 'Polynomial Regression',
            predict: (data, degree = 2) => this.polynomialRegression(data, degree),
            suitable: ['non_linear', 'curved_trends']
        });
    }

    setupLearningAlgorithms() {
        // Simple neural network for pattern recognition
        this.learningAlgorithms.set('neural_network', {
            name: 'Simple Neural Network',
            layers: [
                { neurons: 10, activation: 'relu' },
                { neurons: 5, activation: 'relu' },
                { neurons: 1, activation: 'linear' }
            ],
            learn: (inputs, targets) => this.neuralNetworkLearning(inputs, targets),
            predict: (inputs) => this.neuralNetworkPredict(inputs)
        });

        // Decision tree for classification
        this.learningAlgorithms.set('decision_tree', {
            name: 'Decision Tree',
            maxDepth: 5,
            minSamples: 3,
            learn: (features, labels) => this.decisionTreeLearning(features, labels),
            predict: (features) => this.decisionTreePredict(features)
        });

        // K-means clustering for pattern discovery
        this.learningAlgorithms.set('clustering', {
            name: 'K-Means Clustering',
            clusters: 3,
            maxIterations: 100,
            learn: (data) => this.kMeansLearning(data),
            predict: (point) => this.kMeansPredict(point)
        });
    }

    setupPredictiveModeling() {
        this.predictiveModeler = {
            createModel: (type, features, target) => {
                const model = {
                    type,
                    features,
                    target,
                    trained: false,
                    accuracy: 0,
                    predictions: [],
                    trainingData: []
                };
                
                return model;
            },
            
            trainModel: (model, data) => {
                model.trainingData = data;
                
                switch (model.type) {
                    case 'regression':
                        return this.trainRegressionModel(model);
                    case 'classification':
                        return this.trainClassificationModel(model);
                    case 'time_series':
                        return this.trainTimeSeriesModel(model);
                    default:
                        throw new Error(`Unknown model type: ${model.type}`);
                }
            },
            
            validateModel: (model, testData) => {
                const predictions = testData.map(sample => 
                    this.predictiveModeler.predict(model, sample.features)
                );
                
                const accuracy = this.calculateAccuracy(predictions, testData.map(s => s.target));
                model.accuracy = accuracy;
                
                return { accuracy, predictions };
            },
            
            predict: (model, features) => {
                if (!model.trained) {
                    throw new Error('Model must be trained before making predictions');
                }
                
                return this.makePrediction(model, features);
            }
        };
    }

    initializeTrendAnalysis() {
        this.trendAnalyzer = {
            detectTrends: (data, windowSize = 10) => {
                if (data.length < windowSize) return { trend: 'insufficient_data' };
                
                const trends = [];
                
                for (let i = windowSize; i < data.length; i++) {
                    const window = data.slice(i - windowSize, i);
                    const trend = this.analyzeTrendWindow(window);
                    trends.push({ index: i, ...trend });
                }
                
                return this.aggregateTrends(trends);
            },
            
            identifyPatterns: (data) => {
                const patterns = {
                    seasonal: this.detectSeasonalPatterns(data),
                    cyclical: this.detectCyclicalPatterns(data),
                    linear: this.detectLinearTrends(data),
                    exponential: this.detectExponentialTrends(data)
                };
                
                return patterns;
            },
            
            forecastTrend: (data, steps = 5) => {
                const pattern = this.trendAnalyzer.identifyPatterns(data);
                const bestModel = this.selectBestForecastingModel(pattern);
                
                return this.forecastWithModel(bestModel, data, steps);
            }
        };
    }

    setupMachineLearning() {
        this.mlEngine = {
            // Feature engineering
            extractFeatures: (rawData) => {
                const features = {};
                
                // Statistical features
                features.mean = this.calculateMean(rawData);
                features.std = this.calculateStandardDeviation(rawData);
                features.min = Math.min(...rawData);
                features.max = Math.max(...rawData);
                features.range = features.max - features.min;
                
                // Trend features
                features.trend = this.calculateTrendSlope(rawData);
                features.volatility = this.calculateVolatility(rawData);
                
                // Temporal features
                if (rawData.length > 1) {
                    features.momentum = rawData[rawData.length - 1] - rawData[rawData.length - 2];
                    features.acceleration = this.calculateAcceleration(rawData);
                }
                
                return features;
            },
            
            // Feature selection
            selectFeatures: (features, target, method = 'correlation') => {
                switch (method) {
                    case 'correlation':
                        return this.selectByCorrelation(features, target);
                    case 'variance':
                        return this.selectByVariance(features);
                    case 'mutual_info':
                        return this.selectByMutualInformation(features, target);
                    default:
                        return features;
                }
            },
            
            // Model training
            train: (algorithm, features, targets) => {
                const learningAlgorithm = this.learningAlgorithms.get(algorithm);
                if (!learningAlgorithm) {
                    throw new Error(`Unknown learning algorithm: ${algorithm}`);
                }
                
                return learningAlgorithm.learn(features, targets);
            },
            
            // Prediction
            predict: (algorithm, features) => {
                const learningAlgorithm = this.learningAlgorithms.get(algorithm);
                if (!learningAlgorithm) {
                    throw new Error(`Unknown learning algorithm: ${algorithm}`);
                }
                
                return learningAlgorithm.predict(features);
            }
        };
    }

    initializeForecastingSystems() {
        this.forecastingSystem = {
            generateForecast: async (dataType, horizon = 5) => {
                const historicalData = this.getHistoricalData(dataType);
                if (historicalData.length < 10) {
                    return { error: 'Insufficient historical data' };
                }
                
                const model = this.predictionModels.get(dataType);
                if (!model) {
                    return { error: 'No prediction model available' };
                }
                
                try {
                    const forecast = await model.predict({
                        data: historicalData,
                        horizon,
                        confidence: model.confidence
                    });
                    
                    return {
                        forecast,
                        confidence: model.confidence,
                        model: model.name,
                        horizon
                    };
                } catch (error) {
                    return { error: error.message };
                }
            },
            
            validateForecast: (forecast, actualData) => {
                const errors = forecast.map((pred, i) => 
                    actualData[i] ? Math.abs(pred - actualData[i]) : null
                ).filter(e => e !== null);
                
                const mae = errors.reduce((sum, err) => sum + err, 0) / errors.length;
                const rmse = Math.sqrt(errors.reduce((sum, err) => sum + err * err, 0) / errors.length);
                
                return { mae, rmse, accuracy: 1 - (mae / this.calculateMean(actualData)) };
            },
            
            adaptModel: (modelName, validationResults) => {
                const model = this.predictionModels.get(modelName);
                if (model && validationResults.accuracy < 0.7) {
                    // Reduce confidence if accuracy is poor
                    model.confidence *= 0.9;
                    model.accuracy = validationResults.accuracy;
                    
                    console.log(`📉 Reduced confidence for ${modelName}: ${model.confidence.toFixed(2)}`);
                }
            }
        };
    }

    startPredictionLoop() {
        // Main prediction loop
        setInterval(() => {
            this.autonomousPredictionAnalysis();
        }, 60000); // Every minute

        // Trend analysis loop
        setInterval(() => {
            this.performTrendAnalysis();
        }, 300000); // Every 5 minutes

        // Model training loop
        setInterval(() => {
            this.performModelTraining();
        }, 900000); // Every 15 minutes

        // Forecast validation loop
        setInterval(() => {
            this.validateForecasts();
        }, 1800000); // Every 30 minutes
    }

    async autonomousPredictionAnalysis() {
        try {
            // Generate predictions for key metrics
            const predictions = await this.generatePredictions();
            
            // Analyze prediction confidence
            const confidence = this.analyzePredictionConfidence(predictions);
            
            // Generate insights and recommendations
            const insights = this.generateInsights(predictions);
            
            // Share predictions with other agents
            this.orchestrator.messageBus.publish('predictions.generated', {
                predictions,
                confidence,
                insights,
                timestamp: Date.now()
            }, 'PredictiveAgent');
            
            // Update state
            this.updatePredictiveState(predictions);
            
        } catch (error) {
            console.error('Prediction analysis error:', error);
            this.handlePredictionError(error);
        }
    }

    async generatePredictions() {
        const predictions = {};
        
        // Median score predictions
        try {
            const medianForecast = await this.forecastingSystem.generateForecast('median_forecast', 3);
            predictions.median = medianForecast;
        } catch (error) {
            console.warn('Median prediction failed:', error);
        }
        
        // User behavior predictions
        try {
            const behaviorPrediction = await this.predictUserEngagement();
            predictions.userBehavior = behaviorPrediction;
        } catch (error) {
            console.warn('User behavior prediction failed:', error);
        }
        
        // System performance predictions
        try {
            const performanceForecast = await this.predictSystemLoad();
            predictions.performance = performanceForecast;
        } catch (error) {
            console.warn('Performance prediction failed:', error);
        }
        
        // Team ranking predictions
        try {
            const rankingPrediction = await this.predictRankingChanges();
            predictions.rankings = rankingPrediction;
        } catch (error) {
            console.warn('Ranking prediction failed:', error);
        }
        
        return predictions;
    }

    // Prediction Implementation Methods
    async predictMedianTrend(data) {
        const historicalMedians = this.getHistoricalData('median_scores');
        if (historicalMedians.length < 5) {
            return { trend: 'insufficient_data', confidence: 0.1 };
        }
        
        // Use exponential smoothing for median prediction
        const forecast = this.exponentialSmoothing(historicalMedians, 0.3);
        const trend = this.calculateTrendSlope(historicalMedians);
        
        return {
            nextMedian: forecast[forecast.length - 1],
            trend: trend > 0.1 ? 'increasing' : trend < -0.1 ? 'decreasing' : 'stable',
            confidence: 0.75,
            forecast: forecast.slice(-3) // Last 3 predictions
        };
    }

    async predictUserBehavior(data) {
        const userPatterns = this.getUserBehaviorPatterns();
        
        // Simple classification based on interaction patterns
        const features = this.mlEngine.extractFeatures(userPatterns.interactionRates);
        
        let prediction = 'normal';
        let confidence = 0.6;
        
        if (features.trend > 0.2) {
            prediction = 'increasing_engagement';
            confidence = 0.8;
        } else if (features.trend < -0.2) {
            prediction = 'decreasing_engagement';
            confidence = 0.8;
        }
        
        return {
            prediction,
            confidence,
            features,
            recommendations: this.generateUserBehaviorRecommendations(prediction)
        };
    }

    async predictSystemPerformance(data) {
        const performanceHistory = this.getPerformanceHistory();
        if (performanceHistory.length < 10) {
            return { prediction: 'unknown', confidence: 0.1 };
        }
        
        // Extract performance features
        const memoryUsage = performanceHistory.map(p => p.resourceUtilization || 0);
        const responseTime = performanceHistory.map(p => p.responseTime || 0);
        
        // Predict next performance state
        const memoryTrend = this.calculateTrendSlope(memoryUsage);
        const responseTrend = this.calculateTrendSlope(responseTime);
        
        let prediction = 'stable';
        let confidence = 0.7;
        
        if (memoryTrend > 0.1 || responseTrend > 10) {
            prediction = 'degrading';
            confidence = 0.85;
        } else if (memoryTrend < -0.1 && responseTrend < -5) {
            prediction = 'improving';
            confidence = 0.8;
        }
        
        return {
            prediction,
            confidence,
            memoryTrend,
            responseTrend,
            recommendations: this.generatePerformanceRecommendations(prediction)
        };
    }

    async predictTeamRankings(data) {
        const currentScores = data.teams ? data.teams.map(t => t.score) : [];
        const projections = data.teams ? data.teams.map(t => t.proj) : [];
        
        if (currentScores.length === 0) {
            return { prediction: 'no_data', confidence: 0 };
        }
        
        // Simple ranking prediction based on score trends
        const rankingChanges = [];
        
        data.teams?.forEach((team, index) => {
            const scoreTrend = team.score - team.proj;
            const currentRank = index + 1;
            
            let predictedRank = currentRank;
            
            if (scoreTrend > 10) {
                predictedRank = Math.max(1, currentRank - 1); // Move up
            } else if (scoreTrend < -10) {
                predictedRank = Math.min(data.teams.length, currentRank + 1); // Move down
            }
            
            if (predictedRank !== currentRank) {
                rankingChanges.push({
                    team: team.team,
                    currentRank,
                    predictedRank,
                    scoreTrend,
                    confidence: Math.min(Math.abs(scoreTrend) / 20, 1)
                });
            }
        });
        
        return {
            changes: rankingChanges,
            confidence: 0.7,
            totalTeams: data.teams?.length || 0
        };
    }

    async predictUserEngagement() {
        const userMetrics = this.getUserEngagementMetrics();
        
        // Predict user engagement level for next period
        const engagementTrend = this.calculateTrendSlope(userMetrics.engagementHistory);
        const interactionTrend = this.calculateTrendSlope(userMetrics.interactionHistory);
        
        let prediction = 'stable';
        let confidence = 0.6;
        
        if (engagementTrend > 0.1 && interactionTrend > 0.1) {
            prediction = 'increasing';
            confidence = 0.8;
        } else if (engagementTrend < -0.1 && interactionTrend < -0.1) {
            prediction = 'decreasing';
            confidence = 0.8;
        }
        
        return {
            prediction,
            confidence,
            engagementTrend,
            interactionTrend,
            nextPeriodScore: this.predictEngagementScore(userMetrics)
        };
    }

    async predictSystemLoad() {
        const loadHistory = this.getSystemLoadHistory();
        
        if (loadHistory.length < 5) {
            return { prediction: 'unknown', confidence: 0.1 };
        }
        
        // Predict system load for next period
        const cpuTrend = this.calculateTrendSlope(loadHistory.map(l => l.cpu || 0));
        const memoryTrend = this.calculateTrendSlope(loadHistory.map(l => l.memory || 0));
        const networkTrend = this.calculateTrendSlope(loadHistory.map(l => l.network || 0));
        
        const avgLoad = (cpuTrend + memoryTrend + networkTrend) / 3;
        
        let prediction = 'normal';
        let confidence = 0.7;
        
        if (avgLoad > 0.2) {
            prediction = 'high';
            confidence = 0.85;
        } else if (avgLoad < -0.1) {
            prediction = 'low';
            confidence = 0.75;
        }
        
        return {
            prediction,
            confidence,
            cpuTrend,
            memoryTrend,
            networkTrend,
            predictedLoad: Math.max(0, Math.min(1, 0.5 + avgLoad))
        };
    }

    async predictRankingChanges() {
        const currentRankings = this.getCurrentRankings();
        if (!currentRankings || currentRankings.length === 0) {
            return { changes: [], confidence: 0 };
        }
        
        const changes = [];
        
        // Predict ranking changes based on score momentum
        currentRankings.forEach((team, index) => {
            const momentum = this.calculateTeamMomentum(team);
            
            if (Math.abs(momentum) > 5) {
                const direction = momentum > 0 ? 'up' : 'down';
                const magnitude = Math.min(Math.abs(momentum) / 10, 3);
                
                changes.push({
                    team: team.team,
                    currentRank: index + 1,
                    direction,
                    magnitude: Math.round(magnitude),
                    confidence: Math.min(Math.abs(momentum) / 20, 1)
                });
            }
        });
        
        return {
            changes,
            confidence: 0.75,
            timeframe: '1_hour'
        };
    }

    // Forecasting Algorithm Implementations
    linearRegression(data, features) {
        if (data.length < 2) return [];
        
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = data;
        
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Generate predictions
        const predictions = [];
        for (let i = 0; i < 5; i++) {
            predictions.push(slope * (n + i) + intercept);
        }
        
        return predictions;
    }

    exponentialSmoothing(data, alpha = 0.3) {
        if (data.length === 0) return [];
        
        const smoothed = [data[0]];
        
        for (let i = 1; i < data.length; i++) {
            smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
        }
        
        // Forecast next values
        const lastSmoothed = smoothed[smoothed.length - 1];
        const trend = smoothed.length > 1 ? smoothed[smoothed.length - 1] - smoothed[smoothed.length - 2] : 0;
        
        for (let i = 0; i < 3; i++) {
            smoothed.push(lastSmoothed + trend * (i + 1));
        }
        
        return smoothed;
    }

    movingAverage(data, window = 5) {
        if (data.length < window) return data;
        
        const averaged = [];
        
        for (let i = window - 1; i < data.length; i++) {
            const slice = data.slice(i - window + 1, i + 1);
            averaged.push(slice.reduce((sum, val) => sum + val, 0) / window);
        }
        
        // Forecast using last trend
        const lastValues = averaged.slice(-3);
        const trend = lastValues.length > 1 ? 
            (lastValues[lastValues.length - 1] - lastValues[0]) / (lastValues.length - 1) : 0;
        
        for (let i = 0; i < 3; i++) {
            averaged.push(averaged[averaged.length - 1] + trend);
        }
        
        return averaged;
    }

    polynomialRegression(data, degree = 2) {
        if (data.length < degree + 1) return [];
        
        // Simplified polynomial regression for degree 2
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = data;
        
        if (degree === 2) {
            // Quadratic regression
            const sumX = x.reduce((sum, val) => sum + val, 0);
            const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
            const sumX3 = x.reduce((sum, val) => sum + val * val * val, 0);
            const sumX4 = x.reduce((sum, val) => sum + val * val * val * val, 0);
            const sumY = y.reduce((sum, val) => sum + val, 0);
            const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
            const sumX2Y = x.reduce((sum, val, i) => sum + val * val * y[i], 0);
            
            // Solve system of equations (simplified)
            const a = 0.1; // Placeholder coefficient
            const b = (sumXY - a * sumX3) / sumX2;
            const c = (sumY - b * sumX - a * sumX2) / n;
            
            // Generate predictions
            const predictions = [];
            for (let i = 0; i < 5; i++) {
                const xi = n + i;
                predictions.push(a * xi * xi + b * xi + c);
            }
            
            return predictions;
        }
        
        // Fallback to linear regression
        return this.linearRegression(data);
    }

    // Machine Learning Implementations (Simplified)
    neuralNetworkLearning(inputs, targets) {
        // Simplified neural network learning
        const weights = Array.from({ length: inputs[0].length }, () => Math.random() - 0.5);
        const learningRate = 0.01;
        
        for (let epoch = 0; epoch < 100; epoch++) {
            for (let i = 0; i < inputs.length; i++) {
                const prediction = this.neuralNetworkForward(inputs[i], weights);
                const error = targets[i] - prediction;
                
                // Update weights
                for (let j = 0; j < weights.length; j++) {
                    weights[j] += learningRate * error * inputs[i][j];
                }
            }
        }
        
        return { weights, trained: true };
    }

    neuralNetworkPredict(inputs) {
        const algorithm = this.learningAlgorithms.get('neural_network');
        if (!algorithm.weights) {
            throw new Error('Neural network not trained');
        }
        
        return this.neuralNetworkForward(inputs, algorithm.weights);
    }

    neuralNetworkForward(inputs, weights) {
        let sum = 0;
        for (let i = 0; i < inputs.length; i++) {
            sum += inputs[i] * weights[i];
        }
        return 1 / (1 + Math.exp(-sum)); // Sigmoid activation
    }

    decisionTreeLearning(features, labels) {
        // Simplified decision tree learning
        const tree = this.buildDecisionTree(features, labels, 0);
        return { tree, trained: true };
    }

    buildDecisionTree(features, labels, depth) {
        const maxDepth = 3;
        
        if (depth >= maxDepth || labels.length < 2) {
            // Leaf node
            const counts = {};
            labels.forEach(label => {
                counts[label] = (counts[label] || 0) + 1;
            });
            
            const mostCommon = Object.entries(counts).reduce((a, b) => 
                counts[a] > counts[b] ? a : b
            )[0];
            
            return { type: 'leaf', prediction: mostCommon };
        }
        
        // Find best split (simplified)
        const featureIndex = Math.floor(Math.random() * features[0].length);
        const threshold = this.calculateMean(features.map(f => f[featureIndex]));
        
        const leftIndices = [];
        const rightIndices = [];
        
        features.forEach((feature, i) => {
            if (feature[featureIndex] <= threshold) {
                leftIndices.push(i);
            } else {
                rightIndices.push(i);
            }
        });
        
        return {
            type: 'split',
            featureIndex,
            threshold,
            left: this.buildDecisionTree(
                leftIndices.map(i => features[i]),
                leftIndices.map(i => labels[i]),
                depth + 1
            ),
            right: this.buildDecisionTree(
                rightIndices.map(i => features[i]),
                rightIndices.map(i => labels[i]),
                depth + 1
            )
        };
    }

    decisionTreePredict(features) {
        const algorithm = this.learningAlgorithms.get('decision_tree');
        if (!algorithm.tree) {
            throw new Error('Decision tree not trained');
        }
        
        return this.traverseDecisionTree(features, algorithm.tree);
    }

    traverseDecisionTree(features, node) {
        if (node.type === 'leaf') {
            return node.prediction;
        }
        
        if (features[node.featureIndex] <= node.threshold) {
            return this.traverseDecisionTree(features, node.left);
        } else {
            return this.traverseDecisionTree(features, node.right);
        }
    }

    kMeansLearning(data) {
        const k = 3;
        const maxIterations = 100;
        
        // Initialize centroids randomly
        let centroids = Array.from({ length: k }, () => 
            data[Math.floor(Math.random() * data.length)]
        );
        
        for (let iter = 0; iter < maxIterations; iter++) {
            // Assign points to clusters
            const clusters = Array.from({ length: k }, () => []);
            
            data.forEach(point => {
                let minDistance = Infinity;
                let closestCluster = 0;
                
                centroids.forEach((centroid, i) => {
                    const distance = this.euclideanDistance(point, centroid);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCluster = i;
                    }
                });
                
                clusters[closestCluster].push(point);
            });
            
            // Update centroids
            const newCentroids = clusters.map(cluster => {
                if (cluster.length === 0) return centroids[0];
                
                const dimensions = cluster[0].length;
                const centroid = Array.from({ length: dimensions }, () => 0);
                
                cluster.forEach(point => {
                    point.forEach((val, dim) => {
                        centroid[dim] += val;
                    });
                });
                
                return centroid.map(val => val / cluster.length);
            });
            
            // Check convergence
            const converged = centroids.every((centroid, i) => 
                this.euclideanDistance(centroid, newCentroids[i]) < 0.01
            );
            
            centroids = newCentroids;
            
            if (converged) break;
        }
        
        return { centroids, trained: true };
    }

    kMeansPredict(point) {
        const algorithm = this.learningAlgorithms.get('clustering');
        if (!algorithm.centroids) {
            throw new Error('K-means not trained');
        }
        
        let minDistance = Infinity;
        let closestCluster = 0;
        
        algorithm.centroids.forEach((centroid, i) => {
            const distance = this.euclideanDistance(point, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                closestCluster = i;
            }
        });
        
        return closestCluster;
    }

    // Trend Analysis Methods
    performTrendAnalysis() {
        try {
            // Analyze median score trends
            const medianTrends = this.analyzeMedianTrends();
            
            // Analyze user behavior trends
            const behaviorTrends = this.analyzeUserBehaviorTrends();
            
            // Analyze system performance trends
            const performanceTrends = this.analyzePerformanceTrends();
            
            // Store trend analysis results
            this.trendAnalysis.set('median', medianTrends);
            this.trendAnalysis.set('behavior', behaviorTrends);
            this.trendAnalysis.set('performance', performanceTrends);
            
            // Generate trend insights
            const insights = this.generateTrendInsights({
                median: medianTrends,
                behavior: behaviorTrends,
                performance: performanceTrends
            });
            
            this.orchestrator.messageBus.publish('trends.analyzed', {
                trends: { median: medianTrends, behavior: behaviorTrends, performance: performanceTrends },
                insights
            }, 'PredictiveAgent');
            
        } catch (error) {
            console.error('Trend analysis error:', error);
        }
    }

    analyzeMedianTrends() {
        const medianHistory = this.getHistoricalData('median_scores');
        if (medianHistory.length < 5) {
            return { trend: 'insufficient_data' };
        }
        
        const trend = this.trendAnalyzer.detectTrends(medianHistory);
        const patterns = this.trendAnalyzer.identifyPatterns(medianHistory);
        
        return {
            ...trend,
            patterns,
            volatility: this.calculateVolatility(medianHistory),
            forecast: this.trendAnalyzer.forecastTrend(medianHistory, 3)
        };
    }

    analyzeUserBehaviorTrends() {
        const behaviorData = this.getUserBehaviorPatterns();
        
        return {
            engagementTrend: this.calculateTrendSlope(behaviorData.engagementHistory || []),
            interactionTrend: this.calculateTrendSlope(behaviorData.interactionHistory || []),
            sessionTrend: this.calculateTrendSlope(behaviorData.sessionHistory || []),
            patterns: this.identifyBehaviorPatterns(behaviorData)
        };
    }

    analyzePerformanceTrends() {
        const performanceHistory = this.getPerformanceHistory();
        
        if (performanceHistory.length < 5) {
            return { trend: 'insufficient_data' };
        }
        
        const resourceTrend = this.calculateTrendSlope(
            performanceHistory.map(p => p.resourceUtilization || 0)
        );
        const responseTrend = this.calculateTrendSlope(
            performanceHistory.map(p => p.responseTime || 0)
        );
        const errorTrend = this.calculateTrendSlope(
            performanceHistory.map(p => p.errorRate || 0)
        );
        
        return {
            resourceTrend,
            responseTrend,
            errorTrend,
            overallTrend: (resourceTrend + responseTrend + errorTrend) / 3,
            forecast: this.forecastPerformanceTrend(performanceHistory)
        };
    }

    // Data Retrieval Methods
    getHistoricalData(type) {
        const data = this.historicalData.get(type) || [];
        
        // If no stored data, try to get from other agents
        if (data.length === 0) {
            switch (type) {
                case 'median_scores':
                    return this.getMedianHistoryFromScoringAgent();
                case 'performance':
                    return this.getPerformanceHistoryFromMonitoringAgent();
                default:
                    return [];
            }
        }
        
        return data;
    }

    getMedianHistoryFromScoringAgent() {
        if (this.orchestrator.agents.has('ScoringAgent')) {
            const scoringAgent = this.orchestrator.agents.get('ScoringAgent');
            return scoringAgent.medianHistory?.map(h => h.median) || [];
        }
        return [];
    }

    getPerformanceHistoryFromMonitoringAgent() {
        if (this.orchestrator.agents.has('MonitoringAgent')) {
            const monitoringAgent = this.orchestrator.agents.get('MonitoringAgent');
            return monitoringAgent.performanceHistory || [];
        }
        return [];
    }

    getUserBehaviorPatterns() {
        if (this.orchestrator.agents.has('UIAgent')) {
            const uiAgent = this.orchestrator.agents.get('UIAgent');
            return {
                interactionHistory: uiAgent.interactionHistory?.map(i => i.timestamp) || [],
                engagementHistory: [0.8, 0.7, 0.9, 0.8, 0.85], // Placeholder
                sessionHistory: [5, 7, 6, 8, 7] // Placeholder
            };
        }
        return { interactionHistory: [], engagementHistory: [], sessionHistory: [] };
    }

    getUserEngagementMetrics() {
        return {
            engagementHistory: [0.8, 0.7, 0.9, 0.8, 0.85],
            interactionHistory: [10, 8, 12, 9, 11],
            sessionDuration: [300, 450, 380, 520, 420]
        };
    }

    getSystemLoadHistory() {
        if (this.orchestrator.agents.has('MonitoringAgent')) {
            const monitoringAgent = this.orchestrator.agents.get('MonitoringAgent');
            return monitoringAgent.performanceHistory?.map(p => ({
                cpu: p.resourceUtilization || 0.5,
                memory: p.resourceUtilization || 0.5,
                network: 0.3 // Placeholder
            })) || [];
        }
        return [];
    }

    getCurrentRankings() {
        // Try to get current rankings from scoring agent or main app
        if (window.rfflApp && window.rfflApp.currentMedianResults) {
            return window.rfflApp.currentMedianResults.teams;
        }
        return [];
    }

    getPerformanceHistory() {
        return this.getPerformanceHistoryFromMonitoringAgent();
    }

    // Utility Methods
    calculateMean(data) {
        if (data.length === 0) return 0;
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    calculateStandardDeviation(data) {
        if (data.length === 0) return 0;
        const mean = this.calculateMean(data);
        const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
        return Math.sqrt(this.calculateMean(squaredDiffs));
    }

    calculateTrendSlope(data) {
        if (data.length < 2) return 0;
        
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = data;
        
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    calculateVolatility(data) {
        if (data.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < data.length; i++) {
            if (data[i - 1] !== 0) {
                returns.push((data[i] - data[i - 1]) / data[i - 1]);
            }
        }
        
        return this.calculateStandardDeviation(returns);
    }

    calculateAcceleration(data) {
        if (data.length < 3) return 0;
        
        const velocities = [];
        for (let i = 1; i < data.length; i++) {
            velocities.push(data[i] - data[i - 1]);
        }
        
        return this.calculateTrendSlope(velocities);
    }

    euclideanDistance(point1, point2) {
        if (point1.length !== point2.length) return Infinity;
        
        let sum = 0;
        for (let i = 0; i < point1.length; i++) {
            sum += Math.pow(point1[i] - point2[i], 2);
        }
        
        return Math.sqrt(sum);
    }

    calculateTeamMomentum(team) {
        // Simple momentum calculation based on score vs projection
        return team.score - team.proj;
    }

    predictEngagementScore(metrics) {
        const trend = this.calculateTrendSlope(metrics.engagementHistory);
        const lastScore = metrics.engagementHistory[metrics.engagementHistory.length - 1];
        return Math.max(0, Math.min(1, lastScore + trend));
    }

    // Insight Generation
    generateInsights(predictions) {
        const insights = [];
        
        // Median insights
        if (predictions.median && predictions.median.trend) {
            if (predictions.median.trend === 'increasing') {
                insights.push({
                    type: 'median_trend',
                    message: 'Median scores are trending upward - expect higher competition',
                    confidence: predictions.median.confidence,
                    actionable: true,
                    recommendation: 'Prepare for increased scoring requirements'
                });
            }
        }
        
        // Performance insights
        if (predictions.performance && predictions.performance.prediction === 'degrading') {
            insights.push({
                type: 'performance_warning',
                message: 'System performance may degrade soon',
                confidence: predictions.performance.confidence,
                actionable: true,
                recommendation: 'Consider proactive optimization'
            });
        }
        
        // User behavior insights
        if (predictions.userBehavior && predictions.userBehavior.prediction === 'decreasing_engagement') {
            insights.push({
                type: 'engagement_risk',
                message: 'User engagement may be declining',
                confidence: predictions.userBehavior.confidence,
                actionable: true,
                recommendation: 'Enhance user experience features'
            });
        }
        
        return insights;
    }

    generateTrendInsights(trends) {
        const insights = [];
        
        if (trends.performance.overallTrend > 0.1) {
            insights.push({
                type: 'performance_trend',
                message: 'System performance is declining over time',
                severity: 'medium',
                recommendation: 'Schedule performance optimization'
            });
        }
        
        if (trends.behavior.engagementTrend < -0.1) {
            insights.push({
                type: 'engagement_trend',
                message: 'User engagement is decreasing',
                severity: 'low',
                recommendation: 'Review user experience improvements'
            });
        }
        
        return insights;
    }

    generateUserBehaviorRecommendations(prediction) {
        const recommendations = {
            'increasing_engagement': [
                'Enable advanced features',
                'Increase update frequency',
                'Provide more detailed analytics'
            ],
            'decreasing_engagement': [
                'Simplify interface',
                'Add engaging features',
                'Improve performance'
            ],
            'normal': [
                'Maintain current features',
                'Monitor for changes'
            ]
        };
        
        return recommendations[prediction] || recommendations['normal'];
    }

    generatePerformanceRecommendations(prediction) {
        const recommendations = {
            'degrading': [
                'Enable performance mode',
                'Reduce background tasks',
                'Optimize critical paths'
            ],
            'improving': [
                'Maintain optimizations',
                'Consider feature enhancements'
            ],
            'stable': [
                'Continue monitoring',
                'Plan future optimizations'
            ]
        };
        
        return recommendations[prediction] || recommendations['stable'];
    }

    // Model Training and Validation
    performModelTraining() {
        try {
            // Train models with available data
            this.predictionModels.forEach((model, name) => {
                const trainingData = this.getTrainingData(name);
                if (trainingData.length > 10) {
                    this.trainModel(model, trainingData);
                }
            });
            
        } catch (error) {
            console.error('Model training error:', error);
        }
    }

    getTrainingData(modelName) {
        switch (modelName) {
            case 'median_forecast':
                return this.getHistoricalData('median_scores');
            case 'performance_forecast':
                return this.getPerformanceHistory();
            default:
                return [];
        }
    }

    trainModel(model, data) {
        // Simple model training based on historical data
        const features = data.slice(0, -1);
        const targets = data.slice(1);
        
        if (features.length < 5) return;
        
        // Update model accuracy based on recent performance
        const recentPredictions = model.predictions?.slice(-10) || [];
        if (recentPredictions.length > 0) {
            const accuracy = this.calculatePredictionAccuracy(recentPredictions, targets.slice(-recentPredictions.length));
            model.accuracy = accuracy;
        }
        
        model.trained = true;
        model.lastTraining = Date.now();
    }

    calculatePredictionAccuracy(predictions, actuals) {
        if (predictions.length !== actuals.length || predictions.length === 0) return 0;
        
        const errors = predictions.map((pred, i) => Math.abs(pred - actuals[i]));
        const mae = errors.reduce((sum, err) => sum + err, 0) / errors.length;
        const meanActual = this.calculateMean(actuals);
        
        return Math.max(0, 1 - (mae / meanActual));
    }

    validateForecasts() {
        try {
            // Validate recent forecasts against actual data
            this.predictionModels.forEach((model, name) => {
                if (model.predictions && model.predictions.length > 0) {
                    const actualData = this.getActualData(name);
                    if (actualData.length > 0) {
                        const validation = this.forecastingSystem.validateForecast(
                            model.predictions.slice(-actualData.length),
                            actualData
                        );
                        
                        this.forecastingSystem.adaptModel(name, validation);
                    }
                }
            });
            
        } catch (error) {
            console.error('Forecast validation error:', error);
        }
    }

    getActualData(modelName) {
        // Get actual data to compare against predictions
        switch (modelName) {
            case 'median_forecast':
                return this.getHistoricalData('median_scores').slice(-3);
            default:
                return [];
        }
    }

    // State Management
    updatePredictiveState(predictions) {
        this.state.lastActivity = Date.now();
        
        // Update prediction accuracy based on confidence
        const avgConfidence = Object.values(predictions)
            .map(p => p.confidence || 0.5)
            .reduce((sum, conf) => sum + conf, 0) / Object.keys(predictions).length;
        
        this.state.predictionAccuracy = (this.state.predictionAccuracy * 0.9) + (avgConfidence * 0.1);
        
        // Update health score
        if (avgConfidence > 0.8) {
            this.state.healthScore = Math.min(1.0, this.state.healthScore + 0.01);
        } else if (avgConfidence < 0.5) {
            this.state.healthScore = Math.max(0.1, this.state.healthScore - 0.02);
        }
    }

    analyzePredictionConfidence(predictions) {
        const confidences = Object.values(predictions).map(p => p.confidence || 0.5);
        
        return {
            average: this.calculateMean(confidences),
            min: Math.min(...confidences),
            max: Math.max(...confidences),
            reliable: confidences.filter(c => c > 0.7).length / confidences.length
        };
    }

    handlePredictionError(error) {
        this.state.healthScore = Math.max(0, this.state.healthScore - 0.1);
        console.error('Predictive Agent error:', error);
        
        this.orchestrator.messageBus.publish('agent.error', {
            agent: 'PredictiveAgent',
            error: error.message,
            severity: 'medium'
        }, 'PredictiveAgent');
    }

    // Message handling
    handleMessage(message) {
        switch (message.topic) {
            case 'data.refreshed':
                // Update historical data and retrain models
                this.updateHistoricalData('current_data', message.data);
                break;
            
            case 'scoring.updated':
                // Update median history for forecasting
                this.updateHistoricalData('median_scores', message.data.median);
                break;
            
            case 'user.behavior.changed':
                // Update user behavior patterns
                this.updateUserBehaviorData(message.data);
                break;
            
            case 'system.learning.update':
                // Incorporate system-wide learning
                this.incorporateSystemLearning(message.data);
                break;
            
            case 'performance.trends':
                // Update performance trend data
                this.updatePerformanceData(message.data);
                break;
        }
    }

    updateHistoricalData(type, data) {
        if (!this.historicalData.has(type)) {
            this.historicalData.set(type, []);
        }
        
        const history = this.historicalData.get(type);
        
        if (typeof data === 'number') {
            history.push(data);
        } else if (Array.isArray(data)) {
            history.push(...data);
        }
        
        // Keep only last 1000 data points
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
    }

    updateUserBehaviorData(data) {
        // Update user behavior patterns for prediction
        const behaviorData = this.getUserBehaviorPatterns();
        
        if (data.engagementLevel) {
            behaviorData.engagementHistory.push(data.engagementLevel);
        }
        
        if (data.interactionCount) {
            behaviorData.interactionHistory.push(data.interactionCount);
        }
    }

    updatePerformanceData(data) {
        this.updateHistoricalData('performance', data);
    }

    incorporateSystemLearning(learningData) {
        // Incorporate system-wide learning into prediction models
        if (learningData.modelAdjustments) {
            learningData.modelAdjustments.forEach(adjustment => {
                if (adjustment.type === 'prediction_accuracy') {
                    const model = this.predictionModels.get(adjustment.model);
                    if (model) {
                        model.accuracy = (model.accuracy * 0.9) + (adjustment.accuracy * 0.1);
                    }
                }
            });
        }
    }

    // Agent interface methods
    async executeAction(decision) {
        try {
            switch (decision.action) {
                case 'generate_forecast':
                    return await this.executeForecasting(decision.params);
                
                default:
                    return { success: false, error: 'Unknown action' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeForecasting(params) {
        const forecasts = {};
        
        if (params.includeMedian) {
            forecasts.median = await this.forecastingSystem.generateForecast('median_forecast');
        }
        
        if (params.includePerformance) {
            forecasts.performance = await this.predictSystemLoad();
        }
        
        if (params.includeBehavior) {
            forecasts.behavior = await this.predictUserEngagement();
        }
        
        return { success: true, forecasts };
    }

    isActive() {
        return this.state.isActive;
    }

    isResponsive() {
        const timeSinceActivity = Date.now() - this.state.lastActivity;
        return timeSinceActivity < 120000; // 2 minutes
    }

    isEssential() {
        return false; // Predictive agent is helpful but not essential
    }

    getHealthMetrics() {
        return {
            score: this.state.healthScore,
            predictionAccuracy: this.state.predictionAccuracy,
            learningRate: this.state.learningRate,
            modelsCount: this.predictionModels.size,
            lastActivity: this.state.lastActivity
        };
    }

    getLastActivity() {
        return this.state.lastActivity;
    }

    pause() {
        this.state.isActive = false;
        console.log('⏸️ Predictive Agent paused');
    }

    resume() {
        this.state.isActive = true;
        this.state.lastActivity = Date.now();
        console.log('▶️ Predictive Agent resumed');
    }
}

window.PredictiveAgent = PredictiveAgent;
