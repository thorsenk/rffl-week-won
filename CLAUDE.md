# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Server
```bash
./serve.sh
```
Starts Python HTTP server on port 8000 with colored output and multiple entry points:
- **LIVE Mobile**: http://localhost:8000/live-mobile.html (recommended - with agentic features)
- **Agentic Demo**: http://localhost:8000/agentic-demo.html (autonomous system dashboard)
- **Mobile UI**: http://localhost:8000/mobile.html  
- **Desktop**: http://localhost:8000
- **Test Page**: http://localhost:8000/test.html

### Testing
- **System Testing**: Visit http://localhost:8000/test.html to verify all systems are working
- **Agentic Testing**: Visit http://localhost:8000/agentic-demo.html to monitor autonomous agents

### Linting/Type Checking
No formal linting setup - this is vanilla JavaScript with no build process.

## Architecture Overview

### Project Purpose
RFFL Week 1 median scoring webapp where 12 fantasy football teams compete against the league median instead of head-to-head. Teams with scores above the median win, below lose, equal tie. Median = average of 6th and 7th place scores when sorted high→low.

**🤖 ENHANCED WITH AGENTIC ARCHITECTURE**: This webapp now features a sophisticated multi-agent system that autonomously manages data, optimizes performance, predicts user behavior, and self-heals from errors.

### Core Components

**Traditional JavaScript Modules (ES6):**
- `js/main.js` - Primary application coordinator, handles UI interactions and data flow
- `js/median-calculator.js` - Core median calculation engine following RFFL rules
- `js/espn-api.js` - ESPN API integration layer with sample data fallback
- `js/rffl-data.js` - RFFL business logic, team mapping, co-ownership handling
- `js/mobile-ui.js` - Mobile-specific touch interactions, animations, haptic feedback

**🤖 Agentic System (NEW):**
- `js/agents/agent-orchestrator.js` - Central autonomous decision-making coordinator
- `js/agents/data-agent.js` - Intelligent data management, caching, and validation
- `js/agents/scoring-agent.js` - Advanced median calculation with anomaly detection
- `js/agents/ui-agent.js` - Adaptive UI optimization and user experience enhancement
- `js/agents/monitoring-agent.js` - System health monitoring and self-healing
- `js/agents/predictive-agent.js` - Machine learning forecasting and trend analysis
- `js/agentic-integration.js` - Seamless integration layer with existing components

**HTML Entry Points:**
- `index.html` - Full desktop experience with Chart.js visualizations
- `live-mobile.html` - **Primary mobile experience** with real-time scoring + agentic features
- `mobile.html` - Mobile demo with sample data + agentic features
- `agentic-demo.html` - **NEW**: Real-time autonomous agent monitoring dashboard
- `test.html` - System validation page

**Data Integration:**
- `data/canonical_teams.csv` - Symlinked from main RFFL CLI project for team identity mapping
- `data/alias_mapping.yaml` - Team name alias resolution across seasons
- `config/espn-config.json` - ESPN API configuration, Gemini API settings

### Data Flow

**Traditional Flow:**
```
ESPN API (sample data) → RFFL enrichment → Median calculation → UI rendering
        ↓
Canonical mapping (symlinked files) → Team identity resolution → Co-ownership display
```

**🤖 Agentic Enhanced Flow:**
```
DataAgent → Intelligent Caching → Quality Validation → ScoringAgent → Anomaly Detection
    ↓                                                       ↓
UIAgent → Adaptive Rendering ← PredictiveAgent ← Trend Analysis ← MonitoringAgent
    ↓                              ↓                                    ↓
User Experience Optimization → Forecasting → Self-Healing ← Health Monitoring
                    ↓                            ↓              ↓
            AgentOrchestrator ← Autonomous Decisions ← System State Analysis
```

### Key Business Logic

**Traditional Median Calculation (js/median-calculator.js):**
- Sorts 12 team scores high→low
- Takes average of 6th and 7th place scores
- Determines win/loss/tie for each team
- Handles edge cases and validation

**🤖 Enhanced Scoring (js/agents/scoring-agent.js):**
- **Multi-algorithm validation** with fallback calculations
- **Anomaly detection** using statistical and pattern analysis
- **Self-tuning accuracy** based on historical performance
- **Confidence scoring** for all median calculations

**Co-ownership Support (js/rffl-data.js):**
- Uses `RFFLUtils.formatOwnership(isCoOwned, owner1, owner2)`
- Displays as "Owner1 & Owner2" for co-owned teams
- Backwards compatible with single `owner` field

**Traditional Mobile Optimizations (js/mobile-ui.js):**
- Touch gesture handlers (tap, long-press, swipe, pull-to-refresh)
- Performance monitoring and animation adaptation
- Haptic feedback simulation
- Auto-refresh with visibility API

**🤖 Autonomous UI Optimization (js/agents/ui-agent.js):**
- **Adaptive rendering** based on device capabilities and performance
- **User behavior tracking** and interface personalization
- **Dynamic resource allocation** (animations, virtualization)
- **Real-time performance monitoring** with automatic adjustments

### Configuration

**ESPN Integration:**
Edit `config/espn-config.json` for live data:
- `leagueId`: ESPN league ID (currently 323196)
- `espnS2` & `swid`: Authentication cookies for private leagues
- `refreshInterval`: Data refresh frequency (300000ms = 5min, **automatically optimized by DataAgent**)

**🤖 Agentic System Configuration:**
The autonomous agents self-configure based on:
- **Context detection** (live game vs pre/post game)
- **Performance monitoring** (automatic refresh rate adjustment)
- **User behavior patterns** (interface personalization)
- **System health metrics** (resource allocation optimization)

**Team Data:**
Team identity managed through symlinked files from main RFFL CLI project. Changes to canonical team data should be made in the CLI project, not here.

### Styling Architecture
- **Tailwind CSS** via CDN for utility-first styling
- **Custom CSS** (`css/custom.css`, `css/mobile.css`) for enhanced animations
- **Dark theme** with RFFL purple branding
- **Mobile-first responsive design** with safe area handling
- **🤖 Dynamic optimization** by UIAgent based on device capabilities

### AI Integration

**Traditional AI:**
- Gemini API integration for narrative recap generation
- Configure API key in `config/espn-config.json` under `geminiApi.apiKey`

**🤖 Autonomous AI (NEW):**
- **Machine Learning Models**: Neural networks, decision trees, clustering
- **Predictive Analytics**: User behavior, system performance, median trends
- **Pattern Recognition**: Anomaly detection, seasonal analysis
- **Adaptive Learning**: Continuous model training and validation

## Development Notes

### File Dependencies

**Traditional Dependencies:**
- All HTML files expect `js/rffl-data.js` to be loaded for `RFFLUtils.formatOwnership()`
- Mobile files depend on `js/mobile-ui.js` for touch interactions
- Canonical team data files must remain symlinked to main RFFL CLI project

**🤖 Agentic Dependencies (NEW):**
- Agent files must be loaded in order: orchestrator → individual agents → integration layer
- `agentic-demo.html` requires all agent files for monitoring dashboard
- Integration layer enhances existing components without breaking compatibility

### Sample vs Live Data
Currently uses realistic sample data matching ESPN's API structure. For live integration:
1. Update `js/espn-api.js` to make actual API calls (**DataAgent handles this intelligently**)
2. Set ESPN credentials in config file  
3. Handle authentication and CORS properly (**with automatic fallback strategies**)

### Mobile-First + Agentic Approach
The mobile versions (`live-mobile.html`, `mobile.html`) are the primary user experience with **autonomous optimization**. Desktop version (`index.html`) is secondary with additional Chart.js visualizations.

### Testing Strategy
- **Traditional**: Use `test.html` to verify all systems before deployment
- **🤖 Agentic**: Use `agentic-demo.html` to monitor autonomous agent behavior and system health
- **Integration**: Both traditional and agentic features work together seamlessly

### Agentic System Behavior
The autonomous agents operate continuously:
- **DataAgent**: Intelligently manages data refresh timing and caching strategies
- **ScoringAgent**: Validates calculations and detects anomalies automatically
- **UIAgent**: Adapts interface based on user behavior and device capabilities
- **MonitoringAgent**: Self-heals system issues and optimizes performance
- **PredictiveAgent**: Forecasts trends and preloads likely-needed data

### Deployment
- **Traditional**: Static files only - deployable to any CDN/hosting service
- **🤖 Enhanced**: Autonomous agents improve performance and user experience automatically
- **Requirements**: Requires HTTPS for ESPN API integration in production
- **Monitoring**: Use `/agentic-demo.html` endpoint to monitor system health in production