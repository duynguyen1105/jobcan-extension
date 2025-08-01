# Jobcan Extension

A Chrome extension that automates time entry for Jobcan time tracking system. This extension helps streamline your daily time logging by automatically filling in start times, end times, and break durations with either preset values or randomized realistic times.

## 🚀 Features

- **Automatic Time Entry**: Fills in empty time fields on Jobcan automatically
- **Fixed Time Mode**: Set specific start/end times and break duration
- **Random Time Mode**: Generates realistic random times within configured ranges
  - Start time: 08:30 - 09:00 (30-minute range)
  - End time: 17:30 - 18:30 (60-minute range)
- **Auto-Submit**: Optionally auto-click the submit button after filling times
- **Visual Feedback**: Highlights filled fields with aqua background color
- **Weekend Skip**: Automatically skips Saturday (T7) and Sunday (CN) entries
- **Multi-language Support**: English and Vietnamese interface

## 📦 Installation

### From Source

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd jobcan-extension
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Build the extension:

   ```bash
   yarn dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### From Pre-built Package

If you have a `dist.zip` file:

1. Extract the zip file
2. Load the extracted folder as an unpacked extension in Chrome

## 🎯 Usage

1. **Open the Extension**: Click the extension icon in your Chrome toolbar

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

- Node.js (v14 or higher)
- Yarn package manager
- Chrome browser for testing

### Project Structure

```
jobcan-extension/
├── src/
│   ├── contentscript.ts      # Main logic for filling time entries
│   └── popup-page/
│       ├── popup.html        # Extension popup HTML
│       └── popup.tsx         # React popup component
├── public/
│   └── manifest.json         # Extension manifest
├── dist/                     # Built extension files
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── webpack.config.js        # Webpack build configuration
```

### Development Commands

```bash
# Install dependencies
yarn install

# Build for development
yarn dev

# The built extension will be in the dist/ folder
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
