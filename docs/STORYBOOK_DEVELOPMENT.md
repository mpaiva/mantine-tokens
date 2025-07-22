# Storybook Development Workflow

This guide explains how to use the enhanced development workflow that automatically watches and reloads token changes in Storybook.

## Quick Start

To run Storybook with automatic token watching and hot reload:

```bash
npm run dev:storybook
```

This command will:
1. Start the token build process in watch mode
2. Launch Storybook development server
3. Automatically reload when tokens are rebuilt

## Available Scripts

### Standard Development
```bash
npm run dev:storybook
```
Watches and rebuilds standard Mantine tokens while running Storybook.

### Custom Tokens Development
```bash
npm run dev:storybook:custom
```
Watches and rebuilds custom tokens while running Storybook.

### All Tokens Development
```bash
npm run dev:storybook:all
```
Watches and rebuilds all tokens (Mantine + custom) while running Storybook.

## Features

### 🔄 Hot Module Replacement (HMR)
- CSS changes are automatically injected without page reload
- Token updates trigger instant refresh in Storybook
- No manual browser refresh needed

### 📊 Token Status Indicator
A visual indicator appears in the bottom-right corner showing:
- **⚙️ Building**: Tokens are being rebuilt
- **✅ Success**: Tokens updated successfully
- **❌ Error**: Build error occurred
- Timestamp of last update

### 🎨 Concurrent Processing
- Token builds and Storybook run in parallel
- Color-coded terminal output:
  - Blue: Token build process
  - Magenta: Storybook server

## How It Works

1. **File Watching**: The token build process watches for changes in:
   - `tokens/**/*.json` - Token definition files
   - `tokens/_prefix.json` - Prefix configuration
   - `tokens/_custom-prefix.json` - Custom prefix configuration

2. **Automatic Rebuild**: When changes are detected:
   - Style Dictionary rebuilds the affected tokens
   - Output files are generated in the `build/` directory

3. **Vite Plugin Integration**: A custom Vite plugin monitors the build output:
   - Detects changes to CSS and JSON files
   - Triggers HMR updates in Storybook
   - Updates the status indicator

4. **Instant Updates**: Changes appear in Storybook immediately:
   - CSS variables are reloaded
   - Components using the tokens update automatically
   - No manual page refresh required

## Troubleshooting

### Changes Not Appearing
1. Check the terminal for build errors
2. Ensure the correct script is running (`dev:storybook` vs `dev:storybook:custom`)
3. Verify files are saved in the correct location

### Status Indicator Not Showing
1. Clear browser cache and refresh
2. Check browser console for errors
3. Ensure JavaScript is enabled

### Build Errors
1. Check terminal output for specific error messages
2. Validate token JSON syntax
3. Ensure all token references exist

## Tips

- Use `Ctrl+C` to stop both processes
- The status indicator auto-fades after successful updates
- Check terminal output for detailed build information
- Token changes typically reflect within 1-2 seconds

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│  Token Files    │     │   Storybook      │
│  tokens/**/*    │     │   localhost:6006 │
└────────┬────────┘     └──────────────────┘
         │                       ▲
         │ watch                 │ HMR
         ▼                       │
┌─────────────────┐     ┌──────────────────┐
│ Style Dictionary│────▶│   Build Output   │
│ (watch mode)    │     │   build/**/*     │
└─────────────────┘     └──────────────────┘
                                 │
                                 │ watch
                                 ▼
                        ┌──────────────────┐
                        │   Vite Plugin    │
                        │ (token-reload)   │
                        └──────────────────┘
```

This setup provides a seamless development experience where token changes are instantly reflected in your Storybook components.