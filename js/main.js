/**
 * RFFL Week 1 Median Webapp - Main Application
 * Coordinates all components and handles UI interactions
 */

class RFFLWeek1App {
    constructor() {
        this.currentMedianResults = null;
        this.selectedTeam = null;
        this.charts = {};
        this.updateInterval = null;
        this.isLiveMode = false;
        
        this.init();
    }

    async init() {
        console.log('🏈 RFFL Week 1 Median App initializing...');
        
        try {
            // Wait for all data services to initialize
            await Promise.all([
                window.espnAPI?.init?.() || Promise.resolve(),
                window.rfflData?.init?.() || Promise.resolve()
            ]);
            
            // Load initial data and render
            await this.loadData();
            this.setupEventListeners();
            this.setupAutoRefresh();
            
            console.log('✅ RFFL Week 1 Median App ready!');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showError('Failed to initialize app. Please refresh to try again.');
        }
    }

    async loadData() {
        try {
            // Fetch Week 1 scores from ESPN API
            const teamScores = await window.espnAPI.fetchWeek1Scores();
            
            // Enrich with RFFL data
            const enrichedTeams = window.rfflData.enrichTeamData(teamScores);
            
            // Calculate median results
            this.currentMedianResults = window.medianCalculator.calculateMedian(enrichedTeams);
            
            // Render all UI components
            this.renderMedianDisplay();
            this.renderTeamsGrid();
            this.renderStandings();
            this.renderCharts();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Unable to load data. Please check your connection and try again.');
        }
    }

    renderMedianDisplay() {
        const medianElement = document.getElementById('current-median');
        if (medianElement && this.currentMedianResults) {
            const median = this.currentMedianResults.median;
            medianElement.textContent = median.toFixed(2);
            medianElement.classList.add('animate-pulse');
            
            // Remove animation after a short delay
            setTimeout(() => medianElement.classList.remove('animate-pulse'), 1000);
        }
    }

    renderTeamsGrid() {
        const gridContainer = document.getElementById('median-teams-grid');
        if (!gridContainer || !this.currentMedianResults) return;

        gridContainer.innerHTML = '';
        
        this.currentMedianResults.teams.forEach(team => {
            const teamBox = this.createTeamBox(team);
            gridContainer.appendChild(teamBox);
        });
    }

    createTeamBox(team) {
        const box = document.createElement('div');
        const statusClass = team.result === 'WIN' ? 'above-median' : 
                           team.result === 'LOSS' ? 'below-median' : 'at-median';
        
        box.className = `median-matchup-box ${statusClass} p-3 rounded-lg cursor-pointer transition-all hover:scale-105`;
        
        const statusIcon = MedianUtils.getStatusIcon(team.result);
        const marginClass = MedianUtils.getMarginClass(team.marginVsMedian);
        const marginText = MedianUtils.formatMargin(team.marginVsMedian);
        
        box.innerHTML = `
            <div class="text-center">
                <div class="text-lg font-bold mb-1">
                    ${statusIcon} ${team.canonicalCode || team.team}
                </div>
                <div class="text-2xl font-bold text-white mb-1">
                    ${team.score.toFixed(2)}
                </div>
                <div class="text-xs text-gray-400 mb-1">
                    vs. ${this.currentMedianResults.median.toFixed(2)}
                </div>
                <div class="text-sm font-semibold ${marginClass}">
                    ${marginText}
                </div>
                <div class="text-xs mt-1">
                    ${MedianUtils.getResultBadge(team.result)}
                </div>
            </div>
        `;
        
        box.addEventListener('click', () => this.selectTeam(team));
        
        return box;
    }

    selectTeam(team) {
        this.selectedTeam = team;
        this.renderTeamDetails();
        
        // Update visual selection
        document.querySelectorAll('.median-matchup-box').forEach(box => {
            box.classList.remove('active');
        });
        event.target.closest('.median-matchup-box').classList.add('active');
        
        // Show detailed view
        const detailView = document.getElementById('detailed-team-view');
        if (detailView) {
            detailView.style.display = 'block';
            detailView.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async renderTeamDetails() {
        if (!this.selectedTeam) return;
        
        const teamInfoContainer = document.getElementById('selected-team-info');
        const playerBreakdownContainer = document.getElementById('team-player-breakdown');
        
        if (teamInfoContainer) {
            const displayInfo = window.rfflData.formatTeamDisplay(this.selectedTeam);
            const historical = this.selectedTeam.historicalContext;
            
            teamInfoContainer.innerHTML = `
                <h3 class="text-2xl font-bold text-white mb-2">
                    ${displayInfo.displayName}
                </h3>
                <p class="text-gray-400 mb-2">
                    ${displayInfo.ownerDisplay}
                </p>
                <div class="bg-gray-700 rounded-lg p-4 mb-4">
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p class="text-gray-400 text-sm">Final Score</p>
                            <p class="text-3xl font-bold text-white">${this.selectedTeam.score.toFixed(2)}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm">vs. Median</p>
                            <p class="text-2xl font-bold ${MedianUtils.getMarginClass(this.selectedTeam.marginVsMedian)}">
                                ${MedianUtils.formatMargin(this.selectedTeam.marginVsMedian)}
                            </p>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <span class="text-lg">Result: </span>
                        <span class="text-xl font-bold ${this.selectedTeam.result === 'WIN' ? 'text-green-400' : 
                                                        this.selectedTeam.result === 'LOSS' ? 'text-red-400' : 'text-yellow-400'}">
                            ${this.selectedTeam.result}
                        </span>
                    </div>
                </div>
                ${historical ? `
                    <div class="text-sm text-gray-400">
                        <p>vs. Historical Week 1 Average (${historical.averageWeek1Score}): 
                           <span class="${historical.isAboveAverage ? 'text-green-400' : 'text-red-400'}">
                               ${historical.isAboveAverage ? '+' : '-'}${historical.marginFromAverage}
                           </span>
                        </p>
                    </div>
                ` : ''}
            `;
        }
        
        // Load and display player breakdown
        if (playerBreakdownContainer) {
            try {
                const roster = await window.espnAPI.fetchTeamRoster(this.selectedTeam.canonicalCode || this.selectedTeam.team);
                this.renderPlayerBreakdown(roster, playerBreakdownContainer);
            } catch (error) {
                playerBreakdownContainer.innerHTML = `
                    <p class="text-gray-400 text-center py-4">
                        Player details unavailable
                    </p>
                `;
            }
        }
        
        // Update median comparison chart
        this.renderMedianComparisonChart();
    }

    renderPlayerBreakdown(players, container) {
        if (!players || players.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center">No player data available</p>';
            return;
        }
        
        const starters = players.filter(p => window.rfflData.starterSlots.has(p.slot));
        const bench = players.filter(p => window.rfflData.benchSlots.has(p.slot));
        
        container.innerHTML = `
            <h4 class="text-lg font-semibold mb-4 text-white">Player Breakdown</h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h5 class="text-md font-semibold mb-3 text-gray-300">Starters</h5>
                    <div class="space-y-2">
                        ${starters.map(player => this.createPlayerRow(player)).join('')}
                    </div>
                </div>
                ${bench.length > 0 ? `
                    <div>
                        <h5 class="text-md font-semibold mb-3 text-gray-300">Bench</h5>
                        <div class="space-y-2">
                            ${bench.map(player => this.createPlayerRow(player)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createPlayerRow(player) {
        const scoreColor = player.score > player.proj ? 'text-green-400' : 
                          player.score < player.proj * 0.7 ? 'text-red-400' : 'text-white';
        
        let performanceIcon = '';
        if (player.score >= player.proj * 1.5 && player.proj > 5) {
            performanceIcon = ' 🔥';
        } else if (player.score <= player.proj * 0.5 && player.proj > 5) {
            performanceIcon = ' ❄️';
        }
        
        return `
            <div class="flex justify-between items-center py-2 px-3 bg-gray-700 rounded">
                <div>
                    <p class="font-semibold text-sm text-white">
                        ${player.name}${performanceIcon}
                    </p>
                    <p class="text-xs text-gray-400">
                        ${player.team} ${player.pos} ${player.slot} | Proj: ${player.proj.toFixed(1)}
                    </p>
                </div>
                <div class="text-right">
                    <p class="font-bold ${scoreColor}">
                        ${player.score.toFixed(1)}
                    </p>
                </div>
            </div>
        `;
    }

    renderStandings() {
        const standingsBody = document.getElementById('median-standings-body');
        if (!standingsBody || !this.currentMedianResults) return;

        standingsBody.innerHTML = '';
        
        this.currentMedianResults.teams.forEach((team, index) => {
            const row = document.createElement('tr');
            row.className = 'standings-row hover:bg-gray-700 cursor-pointer';
            row.style.animationDelay = `${index * 50}ms`;
            
            const marginClass = MedianUtils.getMarginClass(team.marginVsMedian);
            const marginText = MedianUtils.formatMargin(team.marginVsMedian);
            
            row.innerHTML = `
                <td class="p-3 text-gray-300">${index + 1}</td>
                <td class="p-3 font-bold text-white">${team.canonicalCode || team.team}</td>
                <td class="p-3 text-right text-white">${team.score.toFixed(2)}</td>
                <td class="p-3 text-right font-semibold ${marginClass}">${marginText}</td>
                <td class="p-3 text-center">${MedianUtils.getResultBadge(team.result)}</td>
            `;
            
            row.addEventListener('click', () => this.selectTeam(team));
            standingsBody.appendChild(row);
        });
    }

    renderCharts() {
        if (!this.currentMedianResults) return;
        
        const chartData = window.medianCalculator.generateChartData(this.currentMedianResults);
        
        // Score Distribution Chart
        this.renderScoreDistributionChart(chartData);
        
        // Median Performance Chart  
        this.renderMedianPerformanceChart(chartData);
    }

    renderScoreDistributionChart(chartData) {
        const ctx = document.getElementById('score-distribution-chart');
        if (!ctx) return;
        
        if (this.charts.scoreDistribution) {
            this.charts.scoreDistribution.destroy();
        }
        
        this.charts.scoreDistribution = new Chart(ctx, {
            type: 'bar',
            data: chartData.scoreDistribution,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    annotation: {
                        annotations: {
                            medianLine: {
                                type: 'line',
                                mode: 'horizontal',
                                scaleID: 'y',
                                value: this.currentMedianResults.median,
                                borderColor: '#8b5cf6',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    enabled: true,
                                    content: `Median: ${this.currentMedianResults.median.toFixed(2)}`,
                                    position: 'end',
                                    backgroundColor: '#8b5cf6',
                                    color: 'white'
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#d1d5db', maxRotation: 45 },
                        grid: { color: '#4b5563' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#d1d5db' },
                        grid: { color: '#4b5563' }
                    }
                }
            }
        });
    }

    renderMedianPerformanceChart(chartData) {
        const ctx = document.getElementById('median-performance-chart');
        if (!ctx) return;
        
        if (this.charts.medianPerformance) {
            this.charts.medianPerformance.destroy();
        }
        
        this.charts.medianPerformance = new Chart(ctx, {
            type: 'bar',
            data: chartData.marginChart,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#d1d5db', maxRotation: 45 },
                        grid: { color: '#4b5563' }
                    },
                    y: {
                        ticks: { color: '#d1d5db' },
                        grid: { color: '#4b5563' }
                    }
                }
            }
        });
    }

    renderMedianComparisonChart() {
        const ctx = document.getElementById('median-comparison-chart');
        if (!ctx || !this.selectedTeam) return;
        
        if (this.charts.medianComparison) {
            this.charts.medianComparison.destroy();
        }
        
        this.charts.medianComparison = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Team Score', 'Remaining to Median'],
                datasets: [{
                    data: [
                        this.selectedTeam.score,
                        Math.max(0, this.currentMedianResults.median - this.selectedTeam.score)
                    ],
                    backgroundColor: [
                        this.selectedTeam.result === 'WIN' ? '#10b981' : '#ef4444',
                        '#374151'
                    ],
                    borderColor: ['#1f2937', '#1f2937'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#d1d5db' }
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Generate AI Recap button
        const recapBtn = document.getElementById('generate-recap-btn');
        const recapContent = document.getElementById('recap-content');
        
        if (recapBtn && recapContent) {
            recapBtn.addEventListener('click', () => this.generateAIRecap());
        }
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.refreshData();
            }
        });
        
        // Handle window resize for charts
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });
    }

    setupAutoRefresh() {
        // Check if Week 1 is live and setup auto-refresh
        if (window.espnAPI.isWeek1Live()) {
            this.isLiveMode = true;
            this.updateInterval = setInterval(() => {
                this.refreshData();
            }, 5 * 60 * 1000); // Refresh every 5 minutes during live games
            
            console.log('🔴 Live mode enabled - auto-refreshing every 5 minutes');
        }
    }

    async refreshData() {
        try {
            console.log('🔄 Refreshing data...');
            await this.loadData();
            console.log('✅ Data refreshed successfully');
        } catch (error) {
            console.error('❌ Failed to refresh data:', error);
        }
    }

    async generateAIRecap() {
        if (!this.currentMedianResults) {
            this.showError('No data available for recap generation');
            return;
        }
        
        const recapBtn = document.getElementById('generate-recap-btn');
        const recapContent = document.getElementById('recap-content');
        
        if (!recapBtn || !recapContent) return;
        
        // Show loading state
        recapBtn.disabled = true;
        recapBtn.innerHTML = '<div class="loader"></div> Generating...';
        
        try {
            const prompt = this.buildRecapPrompt();
            const recap = await this.callGeminiAPI(prompt);
            
            recapContent.innerHTML = recap.replace(/\n/g, '<br>');
        } catch (error) {
            console.error('Failed to generate recap:', error);
            recapContent.innerHTML = 'Unable to generate recap at this time. Please try again later.';
        } finally {
            recapBtn.disabled = false;
            recapBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.9l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.9A1.73 1.73 0 0 0 2.31 4.807l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
                Generate Recap
            `;
        }
    }

    buildRecapPrompt() {
        const results = this.currentMedianResults;
        const median = results.median.toFixed(2);
        const winners = results.teams.filter(t => t.result === 'WIN');
        const losers = results.teams.filter(t => t.result === 'LOSS');
        const ties = results.teams.filter(t => t.result === 'TIE');
        
        const topScore = results.teams[0];
        const bottomScore = results.teams[results.teams.length - 1];
        
        return `
            You are a witty fantasy football analyst covering the RFFL's unique Week 1 median format. 
            
            Week 1 Median Results:
            - League Median: ${median} (average of 6th & 7th place scores)
            - Winners (above median): ${winners.length} teams
            - Losers (below median): ${losers.length} teams
            ${ties.length > 0 ? `- Ties (exactly at median): ${ties.length} teams` : ''}
            
            Top Performer: ${topScore.canonicalCode} with ${topScore.score.toFixed(2)} points (+${topScore.marginVsMedian.toFixed(2)} vs median)
            Bottom Performer: ${bottomScore.canonicalCode} with ${bottomScore.score.toFixed(2)} points (${bottomScore.marginVsMedian.toFixed(2)} vs median)
            
            Score Range: ${results.stats.highScore.toFixed(2)} - ${results.stats.lowScore.toFixed(2)}
            
            Context: In RFFL's Week 1 median format, teams compete against the league median instead of head-to-head opponents. This creates a fair, division-neutral start to the season. ESPN shows placeholder matchups, but this webapp provides the official results.
            
            Write a 2-3 sentence engaging recap that captures the essence of Week 1's median results. Be creative, mention the format briefly, and highlight key performances. Keep it concise but entertaining.
        `;
    }

    async callGeminiAPI(prompt) {
        const apiKey = ""; // This would need to be configured
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Gemini API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || 'No recap generated';
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center gap-2">
                <span>⚠️</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">✕</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    destroy() {
        // Cleanup method
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rfflApp = new RFFLWeek1App();
});

// Handle page unload cleanup
window.addEventListener('beforeunload', () => {
    if (window.rfflApp && typeof window.rfflApp.destroy === 'function') {
        window.rfflApp.destroy();
    }
});