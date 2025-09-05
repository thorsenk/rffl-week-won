/**
 * ESPN API Integration Layer for RFFL Week 1 Median System
 * Handles data fetching from ESPN Fantasy Football API
 * Integrates with RFFL canonical team mapping system
 */

class ESPNDataService {
    constructor() {
        this.leagueId = null;
        this.year = 2025;
        this.espnS2 = null;
        this.swid = null;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        // Initialize from environment/config
        this.init();
    }

    async init() {
        // Load configuration (could be from environment variables or config file)
        try {
            const response = await fetch('./config/espn-config.json');
            if (response.ok) {
                const config = await response.json();
                this.leagueId = config.leagueId;
                this.year = config.year || 2025;
                this.espnS2 = config.espnS2;
                this.swid = config.swid;
            }
        } catch (error) {
            console.log('Config file not found, using defaults');
            // Fallback to hardcoded values for development
            this.leagueId = 323196; // RFFL League ID
            this.year = 2025;
        }
    }

    /**
     * Fetch Week 1 scores from ESPN API
     * Returns normalized team data with canonical mapping applied
     */
    async fetchWeek1Scores() {
        const cacheKey = `week1-scores-${this.year}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                return cachedData.data;
            }
        }

        try {
            // For now, use sample data structure that matches ESPN format
            // TODO: Replace with actual ESPN API calls
            const rawTeamData = await this.fetchSampleData();
            
            // Apply RFFL canonical team mapping
            const canonicalData = await this.applyCanonicalMapping(rawTeamData);
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: canonicalData,
                timestamp: Date.now()
            });

            return canonicalData;
        } catch (error) {
            console.error('Error fetching Week 1 scores:', error);
            throw new Error(`Failed to fetch ESPN data: ${error.message}`);
        }
    }

    /**
     * Sample data for development/testing
     * TODO: Replace with actual ESPN API integration
     */
    async fetchSampleData() {
        return [
            { team: 'WZRD', score: 124.20, proj: 100.5, owner: 'White Wizards' },
            { team: 'CHLK', score: 117.50, proj: 98.0, owner: 'Alpha Chalkers' },
            { team: 'MRYJ', score: 111.50, proj: 102.9, owner: 'Mary Jane' },
            { team: 'LNO', score: 107.30, proj: 93.4, owner: 'Team LNO' },
            { team: 'GFM', score: 101.50, proj: 97.2, owner: 'Team GFM' },
            { team: 'MXLB', score: 97.40, proj: 104.1, owner: 'Team MXLB' },
            { team: 'PKMC', score: 94.30, proj: 101.0, owner: 'Team PKMC' },
            { team: 'TNT', score: 91.60, proj: 97.2, owner: 'Team TNT' },
            { team: 'PCX', score: 87.20, proj: 104.9, owner: 'Team PCX' },
            { team: 'BRIM', score: 83.30, proj: 100.8, owner: 'Team BRIM' },
            { team: 'TACT', score: 78.70, proj: 96.0, owner: 'Tactical Tacticians' },
            { team: 'JAGB', score: 74.42, proj: 99.6, owner: 'Team JAGB' }
        ];
    }

    /**
     * Apply RFFL canonical team mapping to raw ESPN data
     * Uses the alias mapping system from the CLI project
     */
    async applyCanonicalMapping(rawData) {
        try {
            // Load canonical team mappings
            const aliasMapping = await this.loadAliasMapping();
            const canonicalTeams = await this.loadCanonicalTeams();
            
            return rawData.map(team => {
                const canonicalCode = this.resolveCanonicalTeamCode(team.team, aliasMapping);
                const canonicalInfo = canonicalTeams.find(ct => ct.team_code === canonicalCode);
                
                return {
                    ...team,
                    canonicalCode,
                    teamName: canonicalInfo?.team_full_name || team.owner,
                    isCoOwned: canonicalInfo?.is_co_owned === 'Yes',
                    owner1: canonicalInfo?.owner_code_1 || team.owner,
                    owner2: canonicalInfo?.owner_code_2 || null
                };
            });
        } catch (error) {
            console.warn('Could not apply canonical mapping:', error);
            // Return original data if mapping fails
            return rawData.map(team => ({
                ...team,
                canonicalCode: team.team,
                teamName: team.owner,
                isCoOwned: false,
                owner1: team.owner,
                owner2: null
            }));
        }
    }

    /**
     * Load alias mapping from symlinked file
     */
    async loadAliasMapping() {
        try {
            const response = await fetch('./data/alias_mapping.yaml');
            const yamlText = await response.text();
            
            // Simple YAML parser for alias mapping
            // TODO: Consider using a proper YAML library for production
            return this.parseAliasYaml(yamlText);
        } catch (error) {
            console.warn('Could not load alias mapping:', error);
            return {};
        }
    }

    /**
     * Load canonical teams from symlinked CSV file
     */
    async loadCanonicalTeams() {
        try {
            const response = await fetch('./data/canonical_teams.csv');
            const csvText = await response.text();
            return this.parseCanonicalCsv(csvText);
        } catch (error) {
            console.warn('Could not load canonical teams:', error);
            return [];
        }
    }

    /**
     * Simple YAML parser for alias mapping structure
     */
    parseAliasYaml(yamlText) {
        const aliases = {};
        const lines = yamlText.split('\n');
        let currentAlias = null;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- alias:')) {
                currentAlias = trimmed.replace('- alias:', '').trim().replace(/['"]/g, '');
            } else if (trimmed.startsWith('canonical:') && currentAlias) {
                const canonical = trimmed.replace('canonical:', '').trim().replace(/['"]/g, '');
                aliases[currentAlias] = canonical;
                currentAlias = null;
            }
        });
        
        return aliases;
    }

    /**
     * Parse canonical teams CSV
     */
    parseCanonicalCsv(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        return lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
                const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                return obj;
            })
            .filter(obj => obj.season_year === this.year.toString());
    }

    /**
     * Resolve canonical team code using alias mapping
     */
    resolveCanonicalTeamCode(espnTeamCode, aliasMapping) {
        return aliasMapping[espnTeamCode] || espnTeamCode;
    }

    /**
     * Fetch detailed player data for a specific team
     * TODO: Integrate with actual ESPN roster API
     */
    async fetchTeamRoster(teamCode) {
        // Sample player data structure
        const sampleRosters = {
            'WZRD': [
                {name: 'Lamar Jackson', team: 'BAL', pos: 'QB', opp: 'BUF', proj: 22.9, score: 28.5, slot: 'QB'},
                {name: 'Bijan Robinson', team: 'ATL', pos: 'RB', opp: 'TB', proj: 16.8, score: 19.2, slot: 'RB'},
                {name: "D'Andre Swift", team: 'CHI', pos: 'RB', opp: 'MIN', proj: 11.0, score: 8.7, slot: 'RB'},
                {name: 'Ladd McConkey', team: 'LAC', pos: 'WR', opp: 'KC', proj: 10.1, score: 12.4, slot: 'WR'},
                {name: 'Calvin Ridley', team: 'TEN', pos: 'WR', opp: 'DEN', proj: 9.5, score: 15.8, slot: 'WR'},
                {name: 'Colston Loveland', team: 'CHI', pos: 'TE', opp: 'MIN', proj: 5.4, score: 6.2, slot: 'TE'},
                {name: 'Matthew Golden', team: 'GB', pos: 'WR', opp: 'DET', proj: 8.7, score: 11.3, slot: 'FLEX'},
                {name: 'Patriots D/ST', team: 'NE', pos: 'D/ST', opp: 'LV', proj: 7.5, score: 9.0, slot: 'D/ST'},
                {name: 'Chase McLaughlin', team: 'TB', pos: 'K', opp: 'ATL', proj: 8.7, score: 13.1, slot: 'K'}
            ]
        };
        
        return sampleRosters[teamCode] || [];
    }

    /**
     * Real-time score updates (simulated for now)
     * TODO: Implement actual real-time ESPN data fetching
     */
    async getLatestScores() {
        // Simulate small score changes to show real-time updates
        const baseData = await this.fetchWeek1Scores();
        return baseData.map(team => ({
            ...team,
            score: team.score + (Math.random() - 0.5) * 2, // +/- 1 point variation
            lastUpdated: new Date().toISOString()
        }));
    }

    /**
     * Check if games are currently live
     */
    isWeek1Live() {
        // Simple check - in production this would use actual game status
        const now = new Date();
        const gameDay = new Date('2025-09-07'); // Week 1 Sunday
        const timeDiff = Math.abs(now - gameDay);
        return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours of game day
    }
}

// Global instance
window.espnAPI = new ESPNDataService();

/**
 * Utility functions for ESPN data handling
 */
const ESPNUtils = {
    /**
     * Safely parse numeric values from ESPN API responses
     */
    parseScore(value) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    },

    /**
     * Format team names for display
     */
    formatTeamName(canonicalCode, teamName) {
        return teamName || canonicalCode;
    },

    /**
     * Handle ESPN API errors gracefully
     */
    handleAPIError(error) {
        console.error('ESPN API Error:', error);
        
        // Return user-friendly error messages
        if (error.message.includes('network')) {
            return 'Unable to connect to ESPN. Please check your internet connection.';
        } else if (error.message.includes('403') || error.message.includes('401')) {
            return 'ESPN access denied. Please check league privacy settings.';
        } else {
            return 'Error loading ESPN data. Please try again later.';
        }
    }
};

window.ESPNUtils = ESPNUtils;