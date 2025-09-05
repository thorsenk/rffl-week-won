/**
 * RFFL Data Integration Layer
 * Handles RFFL-specific business logic and data processing
 * Integrates canonical team mappings and historical context
 */

class RFFLDataService {
    constructor() {
        this.lineupRequirements = {
            'QB': 1,
            'RB': 2, 
            'WR': 2,
            'TE': 1,
            'FLEX': 1, // Must be RB/WR/TE
            'D/ST': 1,
            'K': 1
        };
        
        this.flexEligiblePositions = new Set(['RB', 'WR', 'TE']);
        this.starterSlots = new Set(['QB', 'RB', 'WR', 'TE', 'D/ST', 'K', 'FLEX']);
        this.benchSlots = new Set(['Bench', 'IR']);
        
        this.canonicalTeams = new Map();
        this.aliasMapping = new Map();
        this.historicalData = new Map();
        
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadCanonicalTeams(),
                this.loadAliasMapping(),
                this.loadHistoricalContext()
            ]);
            console.log('RFFL data service initialized successfully');
        } catch (error) {
            console.warn('RFFL data service initialization incomplete:', error.message);
        }
    }

    /**
     * Load canonical team data from symlinked CSV
     */
    async loadCanonicalTeams() {
        try {
            const response = await fetch('./data/canonical_teams.csv');
            const csvText = await response.text();
            
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            lines.slice(1).forEach(line => {
                if (!line.trim()) return;
                
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                // Store by team_code for easy lookup
                if (row.team_code && row.season_year) {
                    const key = `${row.season_year}-${row.team_code}`;
                    this.canonicalTeams.set(key, row);
                }
            });
            
            console.log(`Loaded ${this.canonicalTeams.size} canonical team records`);
        } catch (error) {
            throw new Error(`Failed to load canonical teams: ${error.message}`);
        }
    }

    /**
     * Load alias mapping from symlinked YAML file
     */
    async loadAliasMapping() {
        try {
            const response = await fetch('./data/alias_mapping.yaml');
            const yamlText = await response.text();
            
            // Parse YAML aliases structure
            const lines = yamlText.split('\n');
            let currentAlias = null;
            let currentCanonical = null;
            let startYear = null;
            let endYear = null;
            
            lines.forEach(line => {
                const trimmed = line.trim();
                
                if (trimmed.startsWith('- alias:')) {
                    // Save previous mapping if exists
                    if (currentAlias && currentCanonical) {
                        this.aliasMapping.set(currentAlias, {
                            canonical: currentCanonical,
                            startYear,
                            endYear
                        });
                    }
                    
                    currentAlias = trimmed.replace('- alias:', '').trim().replace(/['"]/g, '');
                    currentCanonical = null;
                    startYear = null;
                    endYear = null;
                } else if (trimmed.startsWith('canonical:') && currentAlias) {
                    currentCanonical = trimmed.replace('canonical:', '').trim().replace(/['"]/g, '');
                } else if (trimmed.startsWith('start_year:') && currentAlias) {
                    startYear = parseInt(trimmed.replace('start_year:', '').trim());
                } else if (trimmed.startsWith('end_year:') && currentAlias) {
                    endYear = parseInt(trimmed.replace('end_year:', '').trim());
                }
            });
            
            // Save final mapping
            if (currentAlias && currentCanonical) {
                this.aliasMapping.set(currentAlias, {
                    canonical: currentCanonical,
                    startYear,
                    endYear
                });
            }
            
            console.log(`Loaded ${this.aliasMapping.size} alias mappings`);
        } catch (error) {
            throw new Error(`Failed to load alias mapping: ${error.message}`);
        }
    }

    /**
     * Load historical RFFL context (placeholder for future expansion)
     */
    async loadHistoricalContext() {
        // Placeholder for loading historical Week 1 median data
        // This could include past years' median values, trends, etc.
        this.historicalData.set('week1_averages', {
            'overall': 97.41, // RFFL Week 1 historical average
            'median_range': { min: 85.2, max: 108.7 },
            'years_tracked': 14
        });
    }

    /**
     * Resolve canonical team code using alias mapping with year scope
     */
    resolveCanonicalTeamCode(espnTeamCode, year = 2025) {
        const mapping = this.aliasMapping.get(espnTeamCode);
        
        if (!mapping) {
            return espnTeamCode; // No mapping found, return original
        }
        
        // Check year bounds if specified
        if (mapping.startYear && year < mapping.startYear) {
            return espnTeamCode;
        }
        if (mapping.endYear && year > mapping.endYear) {
            return espnTeamCode;
        }
        
        return mapping.canonical;
    }

    /**
     * Get canonical team information for a given year and team code
     */
    getCanonicalTeamInfo(teamCode, year = 2025) {
        const key = `${year}-${teamCode}`;
        const info = this.canonicalTeams.get(key);
        
        if (!info) {
            return {
                teamCode,
                teamFullName: teamCode,
                isCoOwned: false,
                ownerCode1: '',
                ownerCode2: ''
            };
        }
        
        return {
            teamCode: info.team_code,
            teamFullName: info.team_full_name || teamCode,
            isCoOwned: info.is_co_owned === 'Yes',
            ownerCode1: info.owner_code_1 || '',
            ownerCode2: info.owner_code_2 || ''
        };
    }

    /**
     * Normalize slot position according to RFFL rules
     */
    normalizeSlot(slotPosition, position) {
        const slot = (slotPosition || '').toUpperCase();
        const pos = (position || '').toUpperCase();
        
        // Handle flex variations
        if (slot === 'RB/WR/TE' || slot === 'FLEX') {
            return 'FLEX';
        }
        
        // Handle defense variations
        if (slot === 'DST' || slot === 'D/ST' || slot === 'DEFENSE' || pos === 'DST') {
            return 'D/ST';
        }
        
        // Handle bench variations
        if (slot === 'BE' || slot === 'BENCH') {
            return 'Bench';
        }
        
        if (slot === 'IR') {
            return 'IR';
        }
        
        // Standard positions
        if (['QB', 'RB', 'WR', 'TE', 'K'].includes(slot)) {
            return slot;
        }
        
        // Fallback to position
        if (['QB', 'RB', 'WR', 'TE', 'K'].includes(pos)) {
            return pos;
        }
        
        if (pos === 'D/ST' || pos === 'DST') {
            return 'D/ST';
        }
        
        return slot || pos || 'Bench';
    }

    /**
     * Validate RFFL lineup compliance
     */
    validateLineup(players) {
        const issues = [];
        const starters = players.filter(p => this.starterSlots.has(p.slot));
        
        // Count starters by slot
        const slotCounts = {};
        starters.forEach(player => {
            slotCounts[player.slot] = (slotCounts[player.slot] || 0) + 1;
        });
        
        // Check required counts
        Object.entries(this.lineupRequirements).forEach(([slot, required]) => {
            const actual = slotCounts[slot] || 0;
            if (actual !== required) {
                issues.push({
                    type: 'count_mismatch',
                    slot,
                    required,
                    actual,
                    description: `Expected ${required} ${slot}, found ${actual}`
                });
            }
        });
        
        // Check FLEX eligibility
        const flexPlayers = starters.filter(p => p.slot === 'FLEX');
        flexPlayers.forEach(player => {
            if (!this.flexEligiblePositions.has(player.position)) {
                issues.push({
                    type: 'invalid_flex',
                    player: player.name,
                    position: player.position,
                    description: `FLEX player ${player.name} (${player.position}) must be RB/WR/TE`
                });
            }
        });
        
        // Check for duplicates
        const playerNames = starters.map(p => p.name);
        const duplicates = playerNames.filter((name, index) => playerNames.indexOf(name) !== index);
        duplicates.forEach(name => {
            issues.push({
                type: 'duplicate_player',
                player: name,
                description: `Player ${name} appears multiple times in starters`
            });
        });
        
        return {
            isValid: issues.length === 0,
            issues,
            starterCount: starters.length,
            expectedStarters: Object.values(this.lineupRequirements).reduce((sum, count) => sum + count, 0)
        };
    }

    /**
     * Apply RFFL rounding rules (matches CLI project)
     */
    applyRFFLRounding(score) {
        return Math.round(score * 100) / 100;
    }

    /**
     * Calculate optimal lineup from available players
     */
    calculateOptimalLineup(allPlayers) {
        if (!allPlayers || allPlayers.length === 0) {
            return { players: [], totalScore: 0 };
        }
        
        const playersByPosition = {};
        allPlayers.forEach(player => {
            const pos = player.position;
            if (!playersByPosition[pos]) {
                playersByPosition[pos] = [];
            }
            playersByPosition[pos].push(player);
        });
        
        // Sort players by score within each position
        Object.values(playersByPosition).forEach(players => {
            players.sort((a, b) => b.score - a.score);
        });
        
        const optimalLineup = [];
        const usedPlayers = new Set();
        
        // Fill required positions first
        ['QB', 'TE', 'D/ST', 'K'].forEach(pos => {
            if (playersByPosition[pos] && playersByPosition[pos].length > 0) {
                const player = playersByPosition[pos][0];
                optimalLineup.push({...player, optimalSlot: pos});
                usedPlayers.add(player.name);
            }
        });
        
        // Fill RB positions (need 2)
        const availableRBs = (playersByPosition['RB'] || []).filter(p => !usedPlayers.has(p.name));
        for (let i = 0; i < Math.min(2, availableRBs.length); i++) {
            optimalLineup.push({...availableRBs[i], optimalSlot: 'RB'});
            usedPlayers.add(availableRBs[i].name);
        }
        
        // Fill WR positions (need 2)
        const availableWRs = (playersByPosition['WR'] || []).filter(p => !usedPlayers.has(p.name));
        for (let i = 0; i < Math.min(2, availableWRs.length); i++) {
            optimalLineup.push({...availableWRs[i], optimalSlot: 'WR'});
            usedPlayers.add(availableWRs[i].name);
        }
        
        // Fill FLEX with best remaining RB/WR/TE
        const flexCandidates = [
            ...availableRBs.filter(p => !usedPlayers.has(p.name)),
            ...availableWRs.filter(p => !usedPlayers.has(p.name)),
            ...(playersByPosition['TE'] || []).filter(p => !usedPlayers.has(p.name))
        ].sort((a, b) => b.score - a.score);
        
        if (flexCandidates.length > 0) {
            optimalLineup.push({...flexCandidates[0], optimalSlot: 'FLEX'});
        }
        
        const totalScore = optimalLineup.reduce((sum, player) => sum + player.score, 0);
        
        return {
            players: optimalLineup,
            totalScore: this.applyRFFLRounding(totalScore)
        };
    }

    /**
     * Get historical context for Week 1 performance
     */
    getHistoricalContext(currentScore) {
        const historical = this.historicalData.get('week1_averages');
        if (!historical) return null;
        
        const percentileRank = currentScore > historical.overall ? 'above' : 'below';
        const marginFromAverage = Math.abs(currentScore - historical.overall);
        
        return {
            averageWeek1Score: historical.overall,
            percentileRank,
            marginFromAverage: this.applyRFFLRounding(marginFromAverage),
            isAboveAverage: currentScore > historical.overall,
            yearsTracked: historical.years_tracked,
            range: historical.median_range
        };
    }

    /**
     * Format team display information
     */
    formatTeamDisplay(teamData) {
        const canonical = this.getCanonicalTeamInfo(teamData.canonicalCode || teamData.team);
        
        return {
            code: canonical.teamCode,
            displayName: canonical.teamFullName || canonical.teamCode,
            shortName: canonical.teamCode,
            isCoOwned: canonical.isCoOwned,
            primaryOwner: canonical.ownerCode1,
            secondaryOwner: canonical.ownerCode2,
            ownerDisplay: canonical.isCoOwned 
                ? `${canonical.ownerCode1} & ${canonical.ownerCode2}`
                : canonical.ownerCode1
        };
    }

    /**
     * Enrich team data with RFFL context
     */
    enrichTeamData(rawTeamData, year = 2025) {
        return rawTeamData.map(team => {
            const canonicalCode = this.resolveCanonicalTeamCode(team.team, year);
            const canonicalInfo = this.getCanonicalTeamInfo(canonicalCode, year);
            const displayInfo = this.formatTeamDisplay({ canonicalCode });
            const historicalContext = this.getHistoricalContext(team.score);
            
            return {
                ...team,
                canonicalCode,
                ...canonicalInfo,
                ...displayInfo,
                historicalContext,
                roundedScore: this.applyRFFLRounding(team.score),
                roundedProjection: this.applyRFFLRounding(team.proj || 0)
            };
        });
    }
}

// Global instance
window.rfflData = new RFFLDataService();

/**
 * RFFL Utility Functions
 */
const RFFLUtils = {
    /**
     * Generate co-ownership display
     */
    formatOwnership(isCoOwned, owner1, owner2) {
        if (!isCoOwned || !owner2) {
            return owner1 || 'Unknown Owner';
        }
        return `${owner1} & ${owner2}`;
    },

    /**
     * Get team color scheme for UI
     */
    getTeamColors(teamCode) {
        // Could be expanded with actual team color schemes
        const colorMap = {
            'WZRD': { primary: '#8b5cf6', secondary: '#a78bfa' },
            'CHLK': { primary: '#06b6d4', secondary: '#67e8f9' },
            'MRYJ': { primary: '#10b981', secondary: '#6ee7b7' },
            'TACT': { primary: '#f59e0b', secondary: '#fbbf24' },
            // ... could add more team-specific colors
        };
        
        return colorMap[teamCode] || { primary: '#6b7280', secondary: '#9ca3af' };
    },

    /**
     * Format score for display with proper precision
     */
    formatScore(score, showPrecision = true) {
        if (typeof score !== 'number' || isNaN(score)) {
            return '0.00';
        }
        return showPrecision ? score.toFixed(2) : Math.round(score).toString();
    },

    /**
     * Generate lineup summary
     */
    summarizeLineup(players) {
        const starters = players.filter(p => window.rfflData.starterSlots.has(p.slot));
        const bench = players.filter(p => window.rfflData.benchSlots.has(p.slot));
        
        const starterScore = starters.reduce((sum, p) => sum + p.score, 0);
        const benchScore = bench.reduce((sum, p) => sum + p.score, 0);
        
        return {
            starterCount: starters.length,
            benchCount: bench.length,
            starterScore: window.rfflData.applyRFFLRounding(starterScore),
            benchScore: window.rfflData.applyRFFLRounding(benchScore),
            totalScore: window.rfflData.applyRFFLRounding(starterScore + benchScore)
        };
    }
};

window.RFFLUtils = RFFLUtils;