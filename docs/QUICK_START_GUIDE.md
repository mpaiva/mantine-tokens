# Quick Start Guide for Non-Technical Users

This guide will help you get started with viewing and understanding design tokens in under 5 minutes.

## 🎯 What You'll Learn
- How to view the current design tokens
- How to generate updated documentation
- How to find specific values (colors, sizes, etc.)
- How to request changes

## 📋 Prerequisites
You'll need:
- Access to the project files (through GitHub, shared folder, etc.)
- A text editor (like Notepad, TextEdit, or VS Code)
- Basic ability to navigate folders on your computer

## 🚀 Step 1: View Current Tokens

### Option A: View the Documentation (Easiest)
1. Navigate to the project folder
2. Open `build` folder
3. Open `docs` folder
4. Open `tokens.md` with any text editor
5. You'll see a table with all design tokens organized by category

### Option B: View Raw Values
1. For a structured list: Open `build/json/mantine.tokens.json`
2. For CSS format: Open `build/css/variables.css`

## 🔍 Step 2: Find Specific Values

### Finding Colors
Look for sections labeled:
- **Primary colors**: Main brand colors
- **Gray colors**: All the grays used
- **Semantic colors**: Success (green), Error (red), Warning (yellow), Info (blue)

Example:
```
Primary Blue: #2196F3
Success Green: #4CAF50
Error Red: #F44336
```

### Finding Spacing
Look for spacing values:
- **xs**: 10px (extra small)
- **sm**: 12px (small)
- **md**: 16px (medium)
- **lg**: 20px (large)
- **xl**: 32px (extra large)

### Finding Typography
Look for:
- **Font families**: The fonts used
- **Font sizes**: xs through xl, plus heading sizes
- **Font weights**: normal, medium, semibold, bold

## 📝 Step 3: Common Tasks

### "I need to know what color we use for primary buttons"
1. Open `tokens.md`
2. Search (Ctrl+F or Cmd+F) for "primary"
3. Look for color values associated with primary elements

### "I need to see all our brand colors"
1. Open `tokens.md`
2. Navigate to the "Color" section
3. Review all color tokens and their hex values

### "I want to see how our spacing system works"
1. Open `tokens.md`
2. Find the "Spacing" section
3. See the progression from xs to 3xl

### "I need to check our font sizes"
1. Open `tokens.md`
2. Find the "Typography" section
3. Look for "fontSize" entries

## 🔄 Step 4: Generate Fresh Documentation

If the documentation seems outdated:

### Ask a Developer to:
1. Run `npm run build`
2. Share the updated `build/docs/tokens.md` file with you

### What This Does:
- Reads all current token values
- Generates fresh documentation
- Creates updated files in all formats

## 💬 Step 5: Request Changes

### How to Request a Token Change

Create a clear request with:

1. **What to change**
   - Bad: "Make it bluer"
   - Good: "Change primary color from #2196F3 to #1976D2"

2. **Where it's used**
   - Bad: "Everywhere"
   - Good: "Primary buttons, header links, and active navigation items"

3. **Why it needs changing**
   - Bad: "I don't like it"
   - Good: "Current blue fails accessibility contrast requirements"

4. **Priority**
   - Urgent: Accessibility issues, broken functionality
   - Normal: Brand updates, aesthetic improvements
   - Low: Nice-to-have enhancements

### Change Request Template
```
Token Change Request
-------------------
Token: color.primary.500
Current Value: #2196F3
Requested Value: #1976D2
Reason: Need darker blue for WCAG AA compliance
Affects: All primary buttons and links
Priority: High (accessibility requirement)
Requested By: [Your Name]
Date: [Today's Date]
```

## 📊 Understanding Token Formats

### Color Formats You Might See

1. **Hex Code**: `#2196F3`
   - Most common format
   - 6 characters after the #

2. **RGB**: `rgb(33, 150, 243)`
   - Red, Green, Blue values
   - Each number is 0-255

3. **Token Reference**: `{color.blue.500}`
   - Points to another token
   - Ensures consistency

### Size Formats You Might See

1. **Pixels**: `16px`
   - Absolute size
   - Common for borders, spacing

2. **Rem**: `1rem`, `0.75rem`
   - Relative to base font size
   - Scales with user preferences

## 🛠️ Troubleshooting

### "I can't find the build folder"
- Make sure you're in the project root directory
- The build folder is created after running `npm run build`
- Ask a developer to generate it if missing

### "The values look outdated"
- Documentation needs to be regenerated
- Ask a developer to run `npm run build`

### "I don't understand a value"
- Check the glossary in NON_TECHNICAL_GUIDE.md
- Ask your design or development team
- Look for comments/descriptions next to the value

### "I need a visual preview"
- Check the example files in the `examples/` folder
- Request screenshots from the development environment
- Use browser developer tools to inspect live elements

## 🎓 Quick Tips

1. **Use Search**: Ctrl+F (Windows) or Cmd+F (Mac) to find specific tokens
2. **Check Related Tokens**: If you find `color.primary.500`, look for 400, 600, etc.
3. **Understand Naming**: Numbers often indicate intensity (500 is base, 900 is darkest)
4. **Keep Notes**: Document which tokens are used where in your product

## 📚 Next Steps

Now that you can view and understand tokens:
1. Read the [Non-Technical Guide](./NON_TECHNICAL_GUIDE.md) for deeper understanding
2. Explore the [Token Viewer Guide](./TOKEN_VIEWER_GUIDE.md) for visual tools
3. Review [Design Decisions](./DESIGN_DECISIONS.md) to understand the "why"

## 🙋 Getting Help

- **Can't find something?** Check the search function in your text editor
- **Need clarification?** Ask your design team for visual examples
- **Want changes?** Follow the change request template above
- **Technical issues?** Ask your development team for assistance

---

*Remember: You don't need to understand the technical details to work with design tokens effectively. Focus on what the values represent and how they affect your product's appearance.*