# Stock Tab Opener

A Chrome extension that opens multiple Japanese stock information websites in new tabs with a single stock code input.

## Features

- **One-click access** to multiple stock information websites
- **Simple interface** with just a stock code input field
- **Keyboard support** - press Enter to execute
- **TypeScript** implementation for better code quality
- **Auto-close popup** after opening tabs

## Supported Websites

When you enter a stock code (e.g., 7203), the extension opens the following websites in new tabs:

1. **Yahoo Finance Japan** - `https://finance.yahoo.co.jp/quote/{CODE}.T`
2. **Kabutan** - `https://kabutan.jp/stock/?code={CODE}`
3. **Shikiho Online** - `https://shikiho.toyokeizai.net/stocks/{CODE}`

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/stock-tab-opener.git
   cd stock-tab-opener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

### Development

For development with auto-rebuild:

```bash
npm run build:watch
```

## Usage

1. Click the extension icon in your Chrome toolbar
2. Enter a Japanese stock code (e.g., 7203 for Toyota)
3. Click "開く" (Open) or press Enter
4. Three new tabs will open with the stock information from different websites
5. The popup will automatically close

## Project Structure

```
stock-tab-opener/
├── src/                    # Source files
│   ├── manifest.json      # Extension manifest
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   ├── popup.ts           # Main logic (TypeScript)
│   └── icons/             # Extension icons
├── dist/                  # Built files (generated)
├── docs/                  # Documentation
├── package.json           # Node.js dependencies
└── tsconfig.json          # TypeScript configuration
```

## Development Scripts

- `npm run build` - Build the extension
- `npm run build:watch` - Build with file watching
- `npm run copy-assets` - Copy static assets to dist
- `npm run clean` - Clean dist folder
- `npm run dev` - Clean and build
- `npm run package` - Create distribution zip

## Requirements

- Node.js >= 16.0.0
- Chrome browser
- TypeScript (installed as dev dependency)

## Permissions

This extension requires the following permissions:
- `tabs` - To open new tabs with stock information

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension
5. Submit a pull request

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.