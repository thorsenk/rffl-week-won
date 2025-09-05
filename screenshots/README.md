# RFFL Webapp Screenshots & UI Testing

## 📁 Folder Structure

```
screenshots/
├── ui-testing/
│   ├── mobile/          # iPhone, Android phone screenshots
│   ├── desktop/         # Desktop browser screenshots  
│   ├── tablet/          # iPad, tablet screenshots
│   └── issues/          # Screenshots showing UI problems
├── before-after/        # Comparison shots for improvements
└── user-flows/          # Screenshots documenting user journeys
```

## 📱 Screenshot Guidelines

### **Mobile Screenshots** (`ui-testing/mobile/`)
- iPhone (Safari): 390x844, 428x926
- Android (Chrome): 360x800, 412x915
- Focus areas: Touch targets, scrolling, pull-to-refresh

### **Desktop Screenshots** (`ui-testing/desktop/`)
- Chrome: 1920x1080, 1440x900
- Safari: 1680x1050
- Focus areas: Layout, typography, hover states

### **Tablet Screenshots** (`ui-testing/tablet/`)
- iPad: 768x1024, 834x1194
- Android tablet: 800x1280
- Focus areas: Responsive breakpoints, landscape mode

## 🎯 Testing Scenarios

### **Game Day Usage**
1. **Quick Score Check**: Homepage load → immediate score visibility
2. **Median Tracking**: Scroll to median section → readability test
3. **Pull-to-Refresh**: Gesture test → feedback quality
4. **Touch Interactions**: Tap accuracy → haptic response

### **Accessibility Testing**
1. **High Contrast Mode**: System setting enabled
2. **Large Text**: iOS/Android accessibility text size
3. **Landscape Orientation**: Rotation behavior
4. **One-Handed Use**: Thumb reach zones

## 📸 Naming Convention

Use descriptive filenames:
- `mobile-iphone-homepage-light.png`
- `desktop-chrome-median-section.png`  
- `tablet-ipad-landscape-scores.png`
- `issue-mobile-touch-target-too-small.png`

## 🔄 AI Analysis Workflow

1. **Take screenshots** → Save in appropriate folder
2. **Upload to Claude Code** → Get AI recommendations  
3. **Implement changes** → Commit to git
4. **Take new screenshots** → Compare improvements
5. **Document in before-after/** → Track progress