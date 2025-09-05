# RFFL Week 1 vs. Median Webapp

The official RFFL webapp for the Week 1 median scoring system. Teams compete against the league median instead of head-to-head opponents, providing a fair and division-neutral start to the season.

## Overview

### What is Week 1 Median?

In 2025, RFFL introduced a new Week 1 format where teams compete against the league median score rather than traditional head-to-head matchups. Here's how it works:

- **Median Calculation**: Sort all 12 team scores high→low, then take the average of the 6th and 7th place scores
- **Results**: 
  - Score > median = **Win**
  - Score < median = **Loss** 
  - Score = median = **Tie** (rare, ~0.51% probability)
- **Division Neutral**: Week 1 results don't count as division games
- **Tiebreaker Exclusion**: Week 1 is excluded from H2H tiebreakers

### Why This System?

- **Fair Start**: Everyone gets an equal shot regardless of opponent strength
- **No Early Duplicates**: Avoids immediate rematches that the 17-game schedule created
- **Clean Statistics**: Eliminates early tiebreaker artifacts from schedule imbalances

## Features

### 📊 Real-Time Median Tracking
- Live median calculation as games progress
- Color-coded team status (above/below/at median)
- Margin vs median for all teams

### 📱 Mobile-First Design
- Responsive layout optimized for phone viewing
- Touch-friendly interfaces
- Pull-to-refresh functionality (when implemented)

### 🤖 AI-Generated Recaps
- Gemini API integration for narrative summaries
- Context-aware descriptions of median performance
- Highlights key performances and upsets

### 📈 Advanced Visualizations
- Score distribution charts with median line overlay
- Individual team performance breakdowns
- Historical context vs RFFL Week 1 averages

### 🎯 RFFL Integration
- Canonical team mapping from CLI project
- Co-ownership display and calculations
- Lineup validation and optimal scoring

## Technical Architecture

### Frontend Stack
- **Vanilla HTML/CSS/JavaScript** - No framework dependencies
- **Tailwind CSS** - Utility-first styling via CDN
- **Chart.js** - Data visualization library
- **Gemini API** - AI-powered narrative generation

### Data Integration
- **ESPN API** - Live scoring data (with fallback to sample data)
- **RFFL Canonical System** - Team identity management via symlinked files
- **Median Calculator** - Real-time median calculations following RFFL rules

### Project Structure
```
rffl-week1-webapp/
├── index.html              # Main application page
├── js/
│   ├── main.js             # Primary application logic
│   ├── median-calculator.js # Median calculation engine
│   ├── espn-api.js         # ESPN API integration
│   └── rffl-data.js        # RFFL business logic
├── css/
│   └── custom.css          # Additional styling
├── data/                   # Symlinked from CLI project
│   ├── canonical_teams.csv # Team identity mapping
│   └── alias_mapping.yaml  # Team alias resolution
├── config/
│   └── espn-config.json    # ESPN API configuration
└── README.md
```

## Setup & Configuration

### 1. ESPN API Configuration

Edit `config/espn-config.json`:
```json
{
  "leagueId": 323196,
  "year": 2025,
  "espnS2": "your_espn_s2_cookie",
  "swid": "your_swid_cookie"
}
```

For private leagues, you'll need ESPN cookies:
- `ESPN_S2`: Authentication cookie from ESPN
- `SWID`: Session identifier cookie

### 2. Gemini API Setup

Add your Gemini API key to the config file:
```json
{
  "geminiApi": {
    "apiKey": "your_gemini_api_key"
  }
}
```

### 3. Serving the Application

Since this uses modules and fetch(), you need to serve it from a web server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Data Sources

### RFFL Canonical Data
The webapp uses symlinked files from the main RFFL boxscores CLI project:
- `data/canonical_teams.csv` - Official team identity mapping
- `data/alias_mapping.yaml` - Team name alias resolution

### ESPN Integration
Currently uses sample data that matches ESPN's structure. For production:
1. Implement actual ESPN API calls in `js/espn-api.js`
2. Handle authentication for private leagues
3. Add error handling for API failures

## Development Notes

### Real-Time Updates
The app includes infrastructure for live updates:
- Auto-refresh every 5 minutes during game days
- Cache management to reduce API calls
- Visual indicators for live vs final games

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion preferences respected

### Browser Support
- Modern browsers with ES6+ support
- Mobile Safari, Chrome, Firefox
- No IE support (uses modern JavaScript features)

## Median Calculation Rules

The median calculation follows RFFL specifications:

```javascript
// 1. Sort all 12 team scores high to low
const sorted = teams.sort((a, b) => b.score - a.score);

// 2. Take 6th and 7th place scores (indices 5 and 6)
const sixth = sorted[5].score;
const seventh = sorted[6].score;

// 3. Calculate median as average
const median = (sixth + seventh) / 2;

// 4. Determine results
teams.forEach(team => {
  if (team.score > median) return 'WIN';
  if (team.score < median) return 'LOSS';
  return 'TIE'; // Exactly at median
});
```

## Deployment

### Static Hosting Options
- **Netlify**: Automatic deploys from Git
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free hosting for public repos
- **AWS S3 + CloudFront**: Scalable static hosting

### Configuration for Production
1. Set real ESPN API credentials
2. Configure Gemini API key
3. Update CORS settings if needed
4. Enable HTTPS (required for ESPN API)

## Contributing

This webapp integrates with the main RFFL boxscores CLI project. When making changes:

1. **Team Data**: Modify the canonical files in the CLI project, not the symlinks
2. **Business Logic**: Keep RFFL rules consistent between projects
3. **Testing**: Verify median calculations match CLI output

## License

MIT License - matches the main RFFL boxscores project.

## Support

For issues or questions:
- Check the main RFFL boxscores project documentation
- Review ESPN API status if data loading fails
- Verify Gemini API quota for recap generation

---

**Note**: This webapp serves as the official source for Week 1 results. ESPN will show placeholder opponents due to platform limitations, but this application provides the authoritative median-based standings.