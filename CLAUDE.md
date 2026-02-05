# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome Extension (Manifest v3) that automates time entry for the Jobcan time tracking system.

## Build Commands

```bash
yarn install                # Install dependencies
yarn dev                    # Build extension to dist/ (single webpack build, no watch mode)
```

No test framework is configured. No linter is configured.

After building, load the `dist/` folder as an unpacked extension in Chrome at `chrome://extensions/` with Developer mode enabled.

