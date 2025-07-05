# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Foundation & Quality**
  - `.nvmrc` file for Node.js version consistency (v18.12.1)
  - `CONTRIBUTING.md` guide for contributors
  - ESLint configuration for code quality
  - Prettier configuration for code formatting
  - Jest testing infrastructure with unit tests
  - Watch mode for development (`npm run dev` or `npm run watch`)

- **Component Tokens**
  - Input field tokens (`tokens/components/input-dtcg.json`)
  - Modal/Dialog tokens (`tokens/components/modal-dtcg.json`)
  - Badge tokens (`tokens/components/badge-dtcg.json`)
  - Alert/Notification tokens (`tokens/components/alert-dtcg.json`)

- **Developer Experience**
  - Linting scripts: `npm run lint` and `npm run lint:fix`
  - Formatting scripts: `npm run format` and `npm run format:check`
  - Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
  - Development watch mode that rebuilds on token changes

### Enhanced
- **Dynamic Prefix System**
  - Build system now reads prefix from `_prefix.json`
  - All outputs use dynamic prefix (currently "clearco")
  - TypeScript exports use dynamic naming
  - JSON output uses prefix in filename

- **Build System**
  - Added watch mode support with file change detection
  - Improved error handling and logging
  - Support for `--watch` flag for development

### Technical Details
- ESLint rules enforce ES6+ best practices
- Prettier ensures consistent code formatting
- Jest tests cover build system, validation, and transforms
- Watch mode uses native Node.js fs.watch for efficiency

## [1.0.0] - Previous Release

### Added
- Initial design token system with Style Dictionary v4
- DTCG format support
- Multiple output formats (CSS, SCSS, JS, TS, JSON)
- Light and dark theme support
- Token validation script
- Custom transforms for prefix support