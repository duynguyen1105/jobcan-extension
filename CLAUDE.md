# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser Extension (Manifest v3) that automates time entry for the Jobcan time tracking system. Supports Chrome and Firefox.

## Build Commands

```bash
bun install                 # Install dependencies
bun run dev                 # Build Chrome extension to dist/chrome/
bun run dev:chrome          # Build Chrome extension to dist/chrome/
bun run dev:firefox         # Build Firefox extension to dist/firefox/
bun run test                # Run tests
bun run test:coverage       # Run tests with coverage
```

No linter is configured.

- **Chrome:** Load `dist/chrome/` as an unpacked extension at `chrome://extensions/` with Developer mode enabled.
- **Firefox:** Load `dist/firefox/` as a temporary add-on at `about:debugging#/runtime/this-firefox`.

