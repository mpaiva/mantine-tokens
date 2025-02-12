# Mantine Tokens

A Style Dictionary-powered project that manages CSS variables for the Mantine UI. This tool helps standardize and maintain design tokens, ensuring a consistent design language across your project.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

Install dependencies using npm:

```sh
npm install
```

## Usage

Build the design tokens using:

```sh
npm run build
```

This command uses Style Dictionary configuration to generate:

- `tokens.json` - Token definitions in JSON format
- `tokens.css` - CSS variables for application use

## Project Structure

### Core Directories

- `tokens/` - Source token files in JSON format
- `build/` - Generated output files
  - `dtcg/` - Token output for platforms (JSON)
  - `css/` - CSS variables for application use
- `config/` - Style Dictionary configuration files
- `build.js` - Custom build script for transforms

### Token Files

The `tokens/` directory contains:

- `theme-dark.json` - Dark theme tokens
- `_secondary-colors.json` - Secondary color definitions
- `_line-heights.json` - Typography line height values

## Customization

### Modifying Tokens

1. Update token values in files under the `tokens/` directory
2. Follow the JSON structure:

```json
{
  "color": {
    "primary": {
      "value": "#007AFF"
    }
  }
}
```

### Configuration

- Configure transformation settings in `style-dictionary.config.js`
- Customize token name transformation in `build.js`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
