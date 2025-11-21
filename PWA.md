# PWA Implementation

This Chess Clock application is now a Progressive Web App (PWA) that can be installed and work offline.

## Features

- **Installable**: Users can install the app on desktop and mobile devices
- **Offline Support**: All assets are cached and the app works completely offline
- **Auto-Update**: Service worker automatically updates when a new version is deployed
- **Standalone Mode**: Runs in its own window when installed
- **Native Look**: Integrates with the device's native UI

## Technical Details

### Plugin
- Uses [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for PWA generation
- Service worker is automatically generated and registered
- Workbox powers the caching strategy

### Manifest
The web app manifest includes:
- **Name**: Chess Clock
- **Short Name**: ChessClock
- **Description**: A chess clock application for timing chess games
- **Theme Color**: #242424 (matches the app's dark theme)
- **Display Mode**: standalone
- **Icons**: 192x192 and 512x512 PNG icons

### Caching Strategy
- **Precaching**: All static assets (HTML, CSS, JS, icons, SVG) are precached
- **Runtime Caching**: External resources like Google Fonts are cached on first use
- **Cache-First**: For precached resources
- **Network-First**: For API calls (if added in the future)

## Development

### Building for Production
```bash
npm run build
```

This will generate:
- `dist/sw.js` - Service worker
- `dist/manifest.webmanifest` - Web app manifest
- `dist/registerSW.js` - Service worker registration script
- `dist/workbox-*.js` - Workbox runtime
- `dist/icon-*.png` - App icons

### Testing PWA Locally
```bash
npm run preview
```

Then open the preview URL in a browser to test PWA functionality.

### Updating Icons
Icons are generated from `/public/vite.svg`. To create new icons:
```bash
npm install -D sharp
node --input-type=module -e "
import sharp from 'sharp';
import { readFileSync } from 'fs';
const svg = readFileSync('public/vite.svg');
await sharp(svg).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(svg).resize(512, 512).png().toFile('public/icon-512.png');
"
```

## Deployment Requirements

For PWA to work properly:
1. **HTTPS Required**: The app must be served over HTTPS (or localhost for development)
2. **Valid Manifest**: The manifest file must be accessible
3. **Service Worker**: Must be served with proper MIME type

## Browser Support

PWA features are supported in:
- Chrome/Edge (Desktop & Mobile)
- Safari (iOS 11.3+, macOS 11.3+)
- Firefox (Desktop & Android)
- Samsung Internet

## Resources

- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
