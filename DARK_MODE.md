# Dark Mode Implementation

This document explains the dark mode implementation for the Chess Clock app.

## Overview

The Chess Clock app now supports both light and dark color schemes, automatically adapting to the user's system preferences using CSS custom properties (CSS variables) and the `prefers-color-scheme` media query.

## Implementation Details

### CSS Custom Properties

The following CSS variables were introduced in `src/components/ChessClock.css`:

```css
:root {
  /* Light mode colors (default) */
  --text-primary: #213547;
  --text-secondary: #555;
  --text-tertiary: #666;
  --bg-primary: #ffffff;
  --bg-secondary: rgba(0, 0, 0, 0.03);
  --input-bg: #f9f9f9;
  --input-text: #213547;
  --input-border: #646cff;
  --border-color: rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode colors */
    --text-primary: rgba(255, 255, 255, 0.87);
    --text-secondary: #aaa;
    --text-tertiary: #666;
    --bg-primary: #242424;
    --bg-secondary: rgba(255, 255, 255, 0.03);
    --input-bg: #1a1a1a;
    --input-text: #fff;
    --input-border: #646cff;
    --border-color: rgba(255, 255, 255, 0.1);
  }
}
```

### Color Usage

All theme-aware colors throughout the application now use these CSS variables:

- **Setup screen title**: `var(--text-primary)` - Dark in light mode, light in dark mode
- **Player names and labels**: `var(--text-secondary)` - Gray in both modes, adjusted for contrast
- **Input placeholders**: `var(--text-tertiary)` - Lighter gray for subtle text
- **Main background**: `var(--bg-primary)` - White in light mode, dark gray in dark mode
- **Timer sections**: `var(--bg-secondary)` - Subtle background variations
- **Input fields**: `var(--input-bg)` and `var(--input-text)` - Themed input styling
- **Borders**: `var(--border-color)` - Borders between timer sections

### Preserved Colors

Some colors are intentionally not themed as they serve specific purposes:

- **Primary button color** (`#646cff`): Brand color, consistent across themes
- **Timeout alert** (`#dc2626`): Red alert color, should be consistent for urgency
- **White text on buttons**: Ensures proper contrast against colored backgrounds

## Testing Dark Mode

### On macOS:
1. System Preferences → General → Appearance
2. Select "Dark" to test dark mode
3. Select "Light" to test light mode

### On Windows 10/11:
1. Settings → Personalization → Colors
2. Choose "Dark" under "Choose your color" for dark mode
3. Choose "Light" for light mode

### On Linux (GNOME):
1. Settings → Appearance
2. Select "Dark" or "Light" theme

### In Chrome DevTools:
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
3. Type "Rendering"
4. Select "Emulate CSS media feature prefers-color-scheme"
5. Choose "prefers-color-scheme: dark" or "prefers-color-scheme: light"

## Browser Support

The `prefers-color-scheme` media query is supported in all modern browsers:

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

For older browsers, the app will default to light mode.

## Benefits

1. **Automatic adaptation**: No user setting needed - respects system preferences
2. **Reduced eye strain**: Dark mode is easier on the eyes in low-light environments
3. **Battery saving**: On OLED screens, dark mode can reduce battery consumption
4. **Modern UX**: Matches user expectations for contemporary applications
5. **Minimal implementation**: Pure CSS solution with no JavaScript overhead
