# Jobcan Extension

A browser extension that automates time entry for the Jobcan time tracking system. Supports Chrome, Brave, and Firefox. This extension helps streamline your daily time logging by automatically filling in start times, end times, and break durations with either preset values or randomized realistic times.

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Technical Details](#-technical-details)
- [Customization](#-customization)
- [Notes](#-notes)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

- **Automatic Time Entry**: Fills in empty time fields on Jobcan automatically
- **Fixed Time Mode**: Set specific start/end times and break duration
- **Random Time Mode**: Generates realistic random times within configured ranges
  - Start time: 08:30 - 09:00 (30-minute range)
  - End time: 18:00 - 18:30 (60-minute range)
- **Auto-Submit**: Optionally auto-click the submit button after filling times
- **Visual Feedback**: Highlights filled fields with aqua background color
- **Weekend Skip**: Automatically skips Saturday (T7) and Sunday (CN) entries
- **Multi-language Support**: English and Vietnamese interface
- **Dark Mode**: Supports dark and light themes

## 📦 Installation

### From GitHub Release (Recommended)

1. Go to the [Releases](../../releases/latest) page
2. Download the zip file for your browser:
   - **Chrome/Brave**: `jobcan-chrome-vX.X.X.zip`
   - **Firefox**: `jobcan-firefox-vX.X.X.zip`
3. Extract the zip file
4. Load the extension:
   - **Chrome/Brave**: Go to `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select extracted folder
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select any file in extracted folder

### From Source

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd jobcan-extension
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the extension:

   ```bash
   bun run dev:chrome    # For Chrome/Brave
   bun run dev:firefox   # For Firefox
   ```

4. Load the extension:
   - **Chrome/Brave**: Go to `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select `dist/chrome/`
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select any file in `dist/firefox/`

## 🎯 Usage

1. **Open the Extension**: Click the extension icon in your browser toolbar

2. **Configure Settings**:

   - **Start Time**: Set your preferred start time (disabled in random mode)
   - **End Time**: Set your preferred end time (disabled in random mode)
   - **Break Time**: Set your break duration
   - **Auto click send request**: Enable to automatically submit entries
   - **Random time**: Enable for randomized time generation

3. **Navigate to Jobcan**: Go to your Jobcan time entry page

4. **Apply Settings**: Click the "Triển" button in the extension popup

5. **Results**: The extension will:
   - Fill empty time fields with your configured or random times
   - Highlight filled fields in aqua color
   - Optionally submit the entries if auto-submit is enabled

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Chrome or Firefox browser for testing

### Project Structure

```
jobcan-extension/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: tests on PRs and pushes
│       └── release.yml         # Release: build + zip on tags
├── src/
│   ├── contentscript.ts        # Main logic for filling time entries
│   └── popup-page/
│       ├── popup.html          # Extension popup HTML
│       └── popup.tsx           # React popup component
├── public/
│   ├── manifest.json           # Chrome extension manifest
│   └── manifest.firefox.json   # Firefox extension manifest
├── tests/                      # Test files
├── dist/                       # Built extension files
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── webpack.config.js           # Webpack build configuration
```

### Development Commands

```bash
# Install dependencies
bun install

# Build for Chrome
bun run dev:chrome

# Build for Firefox
bun run dev:firefox

# Build for Chrome (default)
bun run dev

# Run tests
bun run test

# Run tests with coverage
bun run test:coverage
```

### Technology Stack

- **TypeScript**: Main programming language
- **React**: Popup interface framework
- **Styled Components**: CSS-in-JS styling
- **Webpack**: Build tooling
- **Chrome Extension API**: Browser integration

## ⚙️ Technical Details

### Time Randomization

When "Random time" is enabled:

- **Start Time**: Generates times between 08:30 and 09:00
  - Format: `08:${30 + Math.floor(Math.random() * 31)}`
- **End Time**: Generates times between 17:30 and 18:30
  - Uses smart logic to handle hour transitions
  - Ensures proper zero-padding for minutes

### Content Script Logic

The extension:

1. Listens for messages from the popup
2. Finds all day entries with class `align-middle border-left-0`
3. Skips weekend entries (containing 'T7' or 'CN')
4. Locates time input fields by ID: `#editable_start`, `#editable_end`, `#editable_rest`
5. Fills empty fields with configured or random values
6. Optionally clicks submit buttons with class `btn jbc-btn-secondary`

### Permissions

The extension requires:

- `<all_urls>`: To work on Jobcan websites
- `activeTab`: To interact with the current tab

## 🎨 Customization

You can modify the time ranges by editing `src/contentscript.ts`:

```typescript
// Start time range (currently 08:30 - 09:00)
;`08:${30 + Math.floor(Math.random() * 31)}`

// End time range (currently 17:30 - 18:30)
// See the IIFE in the code for the full logic
```

## 📝 Notes

- The extension only fills **empty** time fields, preserving existing entries
- Weekend entries are automatically skipped
- Visual feedback (aqua highlighting) helps identify auto-filled fields
- The extension works universally on all URLs but is designed for Jobcan

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Build and test the extension
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Disclaimer**: This extension is designed to assist with time tracking workflows. Please ensure compliance with your organization's policies regarding automated time entry tools.
