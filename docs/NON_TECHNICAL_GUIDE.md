# Design Tokens: A Non-Technical Guide

Welcome! This guide explains our design token system in simple, everyday language. No technical knowledge required.

## What Are Design Tokens?

Think of design tokens as the "ingredients list" for your digital product's appearance. Just like a recipe has specific measurements for ingredients, design tokens define the exact values for colors, spacing, fonts, and other visual elements used throughout your website or application.

### A Simple Analogy

Imagine you're painting every room in a large hotel the same shade of blue:
- **Without tokens**: You mix paint by eye for each room, resulting in slightly different shades
- **With tokens**: You have the exact paint formula (like "Blue #2196F3"), ensuring every room is identical

Design tokens work the same way - they ensure consistency across your entire digital product.

## Why Design Tokens Matter

### 1. **Brand Consistency**
Your brand colors, fonts, and spacing remain exactly the same everywhere they appear - from buttons to headers to forms.

### 2. **Easy Updates**
Need to change your primary brand color? Update it in one place, and it changes everywhere automatically. It's like having a master light switch for your entire building.

### 3. **Team Alignment**
Designers, developers, and stakeholders all reference the same values. No more "Is this the right blue?" conversations.

### 4. **Accessibility**
Tokens help ensure your product meets accessibility standards by maintaining proper color contrasts and readable font sizes.

## Understanding Our Token Categories

### 🎨 **Colors**
Our color tokens define every color used in the product:
- **Primary colors**: Your main brand colors (like your logo color)
- **Gray scale**: Various shades of gray for text and borders
- **Semantic colors**: Colors with meaning (green for success, red for errors)
- **Theme colors**: Different colors for light and dark modes

### 📏 **Spacing**
Spacing tokens control the "breathing room" between elements:
- **xs (extra small)**: Tight spacing, like between lines of text
- **sm (small)**: A bit more room, like padding inside a button
- **md (medium)**: Standard spacing between sections
- **lg (large)**: Generous spacing for major sections
- **xl, 2xl, 3xl**: Extra spacing for special layouts

### 🔤 **Typography**
Typography tokens define text appearance:
- **Font families**: Which fonts to use (like Arial or Helvetica)
- **Font sizes**: From tiny captions to large headings
- **Font weights**: How bold or light text appears
- **Line heights**: Space between lines of text

### 🔲 **Shadows**
Shadow tokens create depth and elevation:
- **xs**: Subtle shadow for slight elevation
- **sm/md**: Standard shadows for cards and dropdowns
- **lg/xl**: Dramatic shadows for modals and popups

### 🔄 **Border Radius**
Radius tokens control how rounded corners are:
- **none**: Sharp corners (0 roundness)
- **sm**: Slightly rounded
- **md**: Moderately rounded
- **lg**: Very rounded
- **full**: Completely round (like a circle)

## How to Read Token Values

Here are some common token values you might see:

### Color Examples
- `#2196F3` - A hex code (a specific shade of blue)
- `rgb(33, 150, 243)` - The same blue in RGB format
- `{color.blue.500}` - A reference to another token

### Size Examples
- `16px` - 16 pixels (standard text size)
- `1rem` - Relative size based on base font size
- `0.75rem` - 75% of the base size

### What Do These Prefixes Mean?
- **mantine-**: This is our custom prefix for all tokens
- **color-**: Related to colors
- **spacing-**: Related to space between elements
- **typography-**: Related to text appearance

## Viewing the Current Tokens

To see all current design tokens:

1. **View the generated documentation**: 
   - Navigate to `build/docs/tokens.md`
   - This file lists all tokens with their values

2. **View in different formats**:
   - **CSS**: `build/css/variables.css` - for web developers
   - **JSON**: `build/json/mantine.tokens.json` - structured data format
   - **Documentation**: `build/docs/tokens.md` - human-readable format

## How Changes Work

### The Token Lifecycle
1. **Request**: "We need to make our primary blue a bit darker"
2. **Update**: A developer changes the blue color token value
3. **Build**: The system regenerates all files with the new color
4. **Deploy**: The updated color appears everywhere in the product

### Making Change Requests

When requesting changes, provide:
1. **What** needs to change (e.g., "primary button color")
2. **Why** it needs to change (e.g., "improve contrast for accessibility")
3. **Specific values** if known (e.g., "change to #1976D2")
4. **Where** you've seen issues (e.g., "checkout page buttons")

## Common Questions

### "Can I just tell you 'make it bluer'?"
It's better to be specific. Use references like:
- "Like our logo blue"
- "Like Facebook's blue"
- "20% darker than current"
- Provide a specific color code if possible

### "What if I don't know the technical values?"
That's fine! Describe what you want to achieve:
- "More breathing room between sections"
- "Larger text for better readability"
- "Softer shadows for a gentler appearance"

### "How do I know if a change will look good?"
Changes can be:
1. Tested in a development environment first
2. Shown in mockups or prototypes
3. Rolled out gradually

### "What about our brand guidelines?"
Design tokens should reflect your brand guidelines. If there's a mismatch, flag it! Tokens make it easy to ensure brand compliance.

## Best Practices for Non-Technical Stakeholders

### ✅ DO:
- Reference existing elements: "Like the header color"
- Explain the goal: "Improve readability"
- Consider all use cases: "How will this look in dark mode?"
- Think about consistency: "Should all buttons change or just primary ones?"

### ❌ DON'T:
- Make changes without considering impact
- Use vague descriptions: "Make it pop"
- Forget about accessibility
- Change tokens for just one page or component

## Getting Help

If you need help understanding or requesting changes to design tokens:

1. **Check the documentation** in the `build/docs` folder
2. **Ask your design team** for visual examples
3. **Ask your development team** for technical clarification
4. **Create a visual reference** showing what you want to achieve

Remember: Design tokens are here to help maintain a consistent, beautiful, and accessible product. When in doubt, ask questions!

## Glossary

- **Token**: A named value for a design decision
- **Hex code**: A 6-character code for colors (like #FF5733)
- **Pixel (px)**: A unit of measurement for screens
- **Rem**: A relative unit that scales with user preferences
- **Build**: The process of generating files from tokens
- **Theme**: A set of tokens for different appearances (light/dark)

---

*This guide is for anyone who needs to understand our design system without diving into code. For technical documentation, see the main README.md file.*