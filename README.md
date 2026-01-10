# David Novotny Portfolio

A minimal, professional portfolio website template built with vanilla HTML, CSS, and JavaScript.

## Features

- Clean, semantic HTML5 structure
- Modern CSS with custom properties (CSS variables)
- Responsive design (mobile-first approach)
- Dark mode support (automatic via system preferences)
- Accessibility-focused (WCAG compliant)
- No heavy frameworks - just vanilla JS
- Live development server with hot reload

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server with live reload
npm run dev
```

This will open your browser to `http://localhost:3000` with the site running.

### Building for Production

```bash
# Build the project
npm run build

# Preview the built site
npm run preview
```

## Project Structure

```
david-novotny-portfolio/
├── src/
│   ├── css/
│   │   ├── reset.css      # Modern CSS reset
│   │   ├── variables.css  # Design tokens (colors, spacing, etc.)
│   │   └── main.css       # Main stylesheet
│   ├── js/
│   │   └── main.js        # Core JavaScript functionality
│   ├── assets/
│   │   ├── images/        # Images and icons
│   │   └── fonts/         # Custom fonts (if any)
│   └── index.html         # Main HTML file
├── public/                # Static files (copied to dist as-is)
├── package.json
├── .gitignore
└── README.md
```

## Customization

### Colors

Edit the CSS custom properties in `src/css/variables.css`:

```css
:root {
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  /* ... other colors */
}
```

### Typography

The site uses system fonts by default for optimal performance. To add custom fonts:

1. Add font files to `src/assets/fonts/`
2. Define `@font-face` rules in `src/css/variables.css`
3. Update the `--font-sans` variable

### Content

Edit `src/index.html` to update:

- Personal information and bio
- Project showcases
- Contact details
- Social media links

## Browser Support

This template supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT License - feel free to use this template for your own portfolio!
# david-novotny-portfolio
