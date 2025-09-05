/**
 * RFFL Week 1 Median Calculation Engine
 * Handles all median-related calculations and logic
 * Follows RFFL rules: median = average of 6th & 7th scores when sorted high→low
 */

class MedianCalculator {
    constructor() {
        this.teamCount = 12; // RFFL has 12 teams
        this.week = 1;
        this.medianPositions = [5, 6]; // 6th and 7th in 0-indexed array (positions 5 and 6)
        this.precision = 2; // Round to 2 decimal places
    }

    /**
     * Calculate median from team scores
     * @param {Array} teamScores - Array of team score objects with 'score' property
     * @returns {Object} - Median calculation results
     */
    calculateMedian(teamScores) {
        if (!teamScores || teamScores.length !== this.teamCount) {
            throw new Error(`Expected exactly ${this.teamCount} teams, got ${teamScores?.length || 0}`);
        }

        // Sort teams by score (high to low)
        const sortedTeams = [...teamScores].sort((a, b) => b.score - a.score);
        
        // Get 6th and 7th place scores (indices 5 and 6)
        const sixthPlace = sortedTeams[this.medianPositions[0]];
        const seventhPlace = sortedTeams[this.medianPositions[1]];
        
        // Calculate median as average of 6th and 7th
        const median = this.roundScore((sixthPlace.score + seventhPlace.score) / 2);
        
        // Calculate results for each team
        const results = sortedTeams.map((team, index) => {
            const marginVsMedian = this.roundScore(team.score - median);
            let result;
            
            if (marginVsMedian > 0) {
                result = 'WIN';
            } else if (marginVsMedian < 0) {
                result = 'LOSS';
            } else {
                result = 'TIE'; // Exactly at median (rare)
            }

            return {
                ...team,
                rank: index + 1,
                marginVsMedian,
                result,
                isAboveMedian: marginVsMedian > 0,
                isBelowMedian: marginVsMedian < 0,
                isAtMedian: marginVsMedian === 0
            };
        });

        // Calculate additional statistics
        const stats = this.calculateMedianStats(results, median);

        return {
            median,
            sixthPlaceScore: sixthPlace.score,
            seventhPlaceScore: seventhPlace.score,
            teams: results,
            stats,
            calculatedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate median-related statistics
     */
    calculateMedianStats(results, median) {
        const wins = results.filter(t => t.result === 'WIN').length;
        const losses = results.filter(t => t.result === 'LOSS').length;
        const ties = results.filter(t => t.result === 'TIE').length;
        
        const scores = results.map(t => t.score);
        const highScore = Math.max(...scores);
        const lowScore = Math.min(...scores);
        const averageScore = this.roundScore(scores.reduce((sum, s) => sum + s, 0) / scores.length);
        
        const marginsVsMedian = results.map(t => Math.abs(t.marginVsMedian));
        const avgMarginVsMedian = this.roundScore(marginsVsMedian.reduce((sum, m) => sum + m, 0) / marginsVsMedian.length);
        
        return {
            wins,
            losses,
            ties,
            highScore,
            lowScore,
            averageScore,
            avgMarginVsMedian,
            medianAsPercentOfAverage: this.roundScore((median / averageScore) * 100),
            scoreRange: this.roundScore(highScore - lowScore)
        };
    }

    /**
     * Determine if a score change would affect the median
     */
    wouldScoreChangeAffectMedian(currentResults, teamCode, newScore) {
        const currentMedian = currentResults.median;
        
        // Create updated team scores
        const updatedScores = currentResults.teams.map(team => ({
            ...team,
            score: team.canonicalCode === teamCode ? newScore : team.score
        }));

        try {
            const newResults = this.calculateMedian(updatedScores);
            return {
                wouldChange: newResults.median !== currentMedian,
                oldMedian: currentMedian,
                newMedian: newResults.median,
                medianDelta: this.roundScore(newResults.median - currentMedian)
            };
        } catch (error) {
            return {
                wouldChange: false,
                error: error.message
            };
        }
    }

    /**
     * Get teams that are close to the median (within a threshold)
     */
    getCloseToMedianTeams(results, threshold = 5.0) {
        return results.teams.filter(team => 
            Math.abs(team.marginVsMedian) <= threshold
        ).sort((a, b) => Math.abs(a.marginVsMedian) - Math.abs(b.marginVsMedian));
    }

    /**
     * Calculate probability of tie (exactly at median)
     * Based on historical data analysis
     */
    calculateTieProbability() {
        // Based on RFFL documentation: ~1 in 196 ≈ 0.51%
        return 0.0051;
    }

    /**
     * Generate median comparison data for charts
     */
    generateChartData(results) {
        const teams = results.teams;
        const median = results.median;

        return {
            // Score distribution chart data
            scoreDistribution: {
                labels: teams.map(t => t.canonicalCode || t.team),
                datasets: [{
                    label: 'Team Scores',
                    data: teams.map(t => t.score),
                    backgroundColor: teams.map(t => 
                        t.isAboveMedian ? 'rgba(16, 185, 129, 0.7)' :  // green
                        t.isBelowMedian ? 'rgba(239, 68, 68, 0.7)' :   // red
                        'rgba(245, 158, 11, 0.7)'                      // yellow (tie)
                    ),
                    borderColor: teams.map(t => 
                        t.isAboveMedian ? 'rgb(16, 185, 129)' :
                        t.isBelowMedian ? 'rgb(239, 68, 68)' :
                        'rgb(245, 158, 11)'
                    ),
                    borderWidth: 2
                }]
            },
            
            // Median line reference
            medianLine: {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: median,
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 3,
                borderDash: [5, 5],
                label: {
                    enabled: true,
                    content: `Median: ${median}`,
                    position: 'end'
                }
            },

            // Margin vs median chart
            marginChart: {
                labels: teams.map(t => t.canonicalCode || t.team),
                datasets: [{
                    label: 'Margin vs Median',
                    data: teams.map(t => t.marginVsMedian),
                    backgroundColor: teams.map(t => 
                        t.marginVsMedian > 0 ? 'rgba(16, 185, 129, 0.7)' :
                        t.marginVsMedian < 0 ? 'rgba(239, 68, 68, 0.7)' :
                        'rgba(245, 158, 11, 0.7)'
                    ),
                    borderColor: teams.map(t => 
                        t.marginVsMedian > 0 ? 'rgb(16, 185, 129)' :
                        t.marginVsMedian < 0 ? 'rgb(239, 68, 68)' :
                        'rgb(245, 158, 11)'
                    ),
                    borderWidth: 2
                }]
            }
        };
    }

    /**
     * Round score to specified precision
     */
    roundScore(score) {
        return Math.round(score * Math.pow(10, this.precision)) / Math.pow(10, this.precision);
    }

    /**
     * Validate team data structure
     */
    validateTeamData(teamData) {
        if (!Array.isArray(teamData)) {
            throw new Error('Team data must be an array');
        }

        if (teamData.length !== this.teamCount) {
            throw new Error(`Expected ${this.teamCount} teams, got ${teamData.length}`);
        }

        teamData.forEach((team, index) => {
            if (typeof team.score !== 'number' || isNaN(team.score)) {
                throw new Error(`Invalid score for team at index ${index}: ${team.score}`);
            }
            
            if (!team.team && !team.canonicalCode) {
                throw new Error(`Missing team identifier at index ${index}`);
            }
        });

        return true;
    }

    /**
     * Format median results for display
     */
    formatResults(results) {
        return {
            summary: {
                median: results.median,
                wins: results.stats.wins,
                losses: results.stats.losses,
                ties: results.stats.ties,
                highScore: results.stats.highScore,
                lowScore: results.stats.lowScore,
                scoreRange: results.stats.scoreRange
            },
            
            standings: results.teams.map(team => ({
                rank: team.rank,
                team: team.canonicalCode || team.team,
                teamName: team.teamName,
                score: team.score,
                marginVsMedian: team.marginVsMedian,
                result: team.result,
                owner: team.owner1
            })),

            medianCalculation: {
                sixthPlace: `${results.teams[5].canonicalCode || results.teams[5].team}: ${results.sixthPlaceScore}`,
                seventhPlace: `${results.teams[6].canonicalCode || results.teams[6].team}: ${results.seventhPlaceScore}`,
                median: results.median,
                formula: `(${results.sixthPlaceScore} + ${results.seventhPlaceScore}) ÷ 2 = ${results.median}`
            }
        };
    }
}

// Create global instance
window.medianCalculator = new MedianCalculator();

/**
 * Utility functions for median-related operations
 */
const MedianUtils = {
    /**
     * Generate result badge HTML
     */
    getResultBadge(result) {
        const badges = {
            'WIN': '<span class="px-2 py-1 bg-green-900/50 text-green-400 text-xs font-semibold rounded-full">W</span>',
            'LOSS': '<span class="px-2 py-1 bg-red-900/50 text-red-400 text-xs font-semibold rounded-full">L</span>',
            'TIE': '<span class="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs font-semibold rounded-full">T</span>'
        };
        return badges[result] || '';
    },

    /**
     * Get CSS class for margin vs median display
     */
    getMarginClass(marginVsMedian) {
        if (marginVsMedian > 0) return 'text-green-400';
        if (marginVsMedian < 0) return 'text-red-400';
        return 'text-yellow-400';
    },

    /**
     * Format margin for display
     */
    formatMargin(margin) {
        const sign = margin >= 0 ? '+' : '';
        return `${sign}${margin.toFixed(2)}`;
    },

    /**
     * Get status icon for team vs median
     */
    getStatusIcon(result) {
        const icons = {
            'WIN': '✅',
            'LOSS': '❌', 
            'TIE': '🟡'
        };
        return icons[result] || '⚪';
    }
};

window.MedianUtils = MedianUtils;