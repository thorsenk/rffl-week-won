# RFFL Week 1 Median System - Agent Context

## Project Overview
This is the official RFFL (Reddit Fantasy Football League) Week 1 webapp that implements median-based scoring instead of traditional head-to-head matchups. Teams compete against the league median score (average of 6th and 7th place).

## Architecture
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Data Source**: ESPN Fantasy Football API with fallback simulation
- **Deployment**: GitHub Pages at https://thorsenk.github.io/rffl-week-won/
- **Mobile-First**: Optimized for mobile game-day experience

## Key Components

### Core Files
- `live-mobile.html` - Main live scoring interface
- `index.html` - Desktop results view
- `js/espn-api.js` - ESPN API integration
- `js/median-calculator.js` - Median scoring logic
- `js/rffl-data.js` - Team mapping and data processing

### Data Flow
1. ESPN API fetch (with authentication via espnS2/SWID)
2. Fallback to simulated data if API unavailable
3. Median calculation (6th + 7th place scores / 2)
4. Team vs median comparison
5. Live UI updates every 30 seconds

## RFFL-Specific Business Logic

### Team Structure
- 12 teams total
- Some teams are co-owned (owner1 + owner2)
- Team codes: MXLB, PCX, MRYJ, PKMC, LNO, BRIM, WZRD, JAGB, TNT, CHLK, GFM, TACT
- Canonical team mapping in `data/canonical_teams.csv`

### Scoring System
- **Median**: Average of 6th and 7th ranked team scores
- **WIN**: Team score > median
- **LOSS**: Team score < median
- **Live Updates**: Real-time during game windows
- **Projected**: Pre-game estimates, replaced by actual during games

### Configuration
- League ID: 323196
- Year: 2025
- Refresh: 30s during live games, 5min pre/post game
- Cache: 5-minute timeout for API calls

## Recent Fixes Applied
- Resolved data loading failures in live-mobile.html
- Added robust fallback data system
- Fixed error handling to prevent blocking UI
- Added formatOwnership() for co-owned teams
- Streamlined initialization logic

## Development Patterns
- Mobile-first responsive design
- Progressive enhancement (works without JS)
- Graceful degradation (API failures → fallback data)
- Touch-optimized interactions
- Real-time updates with visual feedback

## Testing Approach
- Local server: `python3 -m http.server 8000`
- Debug mode: Add `?debug` parameter
- Fallback testing: API failures automatically trigger simulation
- Mobile testing: Chrome DevTools device emulation

## Deployment
- GitHub Pages auto-deploys from main branch
- Production URL: https://thorsenk.github.io/rffl-week-won/
- Mobile URL: https://thorsenk.github.io/rffl-week-won/live-mobile.html

## Agent Guidelines
- Maintain mobile-first approach
- Preserve RFFL median scoring logic
- Keep fallback data system intact
- Test on both desktop and mobile viewports
- Follow existing code patterns and naming conventions
- Ensure accessibility (screen readers, keyboard navigation)
- Optimize for game-day performance (fast loading, efficient updates)
