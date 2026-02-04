# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome Extension (Manifest v3) that automates time entry for the Jobcan time tracking system.

## Build Commands

```bash
bun install                 # Install dependencies
bun run dev                 # Build extension to dist/ (single webpack build, no watch mode)
bun run test                # Run tests
bun run test:coverage       # Run tests with coverage
```

No linter is configured.

After building, load the `dist/` folder as an unpacked extension in Chrome at `chrome://extensions/` with Developer mode enabled.

