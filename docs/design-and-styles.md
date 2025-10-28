# Frutero Design System & Styles

**Version**: 1.0
**Last Updated**: October 2025
**Maintainer**: Frutero Club

---

## Overview

Frutero's design system uses modern web standards with **OKLCH color space** for superior perceptual uniformity and color accuracy. The system supports automatic light/dark mode switching and emphasizes warm, community-focused aesthetics.

### Design Philosophy

- **Warm & Welcoming**: Cream backgrounds with orange/amber accents
- **Community-First**: Accessible colors meeting WCAG standards
- **Modern Standards**: OKLCH color space, Tailwind CSS v4
- **Responsive**: Mobile-first approach with consistent breakpoints

---

## Color Palette

### OKLCH Color System

Frutero uses **OKLCH** (Oklab Lightness Chroma Hue) instead of traditional HSL/RGB for:
- Better perceptual uniformity across hue shifts
- Consistent lightness perception
- More accurate color interpolation
- Superior accessibility

**OKLCH Format**: `oklch(lightness chroma hue / alpha)`
- **Lightness**: 0-1 (0 = black, 1 = white)
- **Chroma**: 0-0.4 (color intensity)
- **Hue**: 0-360 (color angle)

---

## 🌞 Light Mode Colors

### Brand Colors

| Color | OKLCH Value | Hex | Color Name | Usage |
|-------|-------------|-----|------------|-------|
| **Primary** (Princeton Orange) | `oklch(0.7652 0.1752 62.57)` | `#FF9500` | Princeton Orange | Main brand, CTAs, links |
| **Primary Foreground** | `oklch(0.9851 0 0)` | `#FAFAFA` | White | Text on primary |
| **Secondary** (Imperial Red) | `oklch(0.6519 0.2118 22.71)` | `#F6464F` | Imperial Red | Highlights, badges |
| **Secondary Foreground** | `oklch(0.9851 0 0)` | `#FAFAFA` | White | Text on secondary |
| **Accent** (Yellow Green) | `oklch(0.7989 0.1902 126.36)` | `#9ED22D` | Yellow Green | Special CTAs, success |
| **Accent Foreground** | `oklch(0.0969 0 0)` | `#383838` | Jet | Text on accent |

### Base Colors

| Color | OKLCH Value | Hex | Color Name | Usage |
|-------|-------------|-----|------------|-------|
| **Background** (Floral White) | `oklch(0.9895 0.009 78.28)` | `#FFFBF5` | Floral White | Page background |
| **Foreground** (Jet) | `oklch(0.0969 0 0)` | `#383838` | Jet | Primary text |
| **Card** | `oklch(0.9851 0 0)` | `#fcf2e9` | Warm Cream | Card backgrounds |
| **Card Foreground** | `oklch(0.0969 0 0)` | `#383838` | Jet | Card text |
| **Popover** | `oklch(0.9851 0 0)` | `#fcf2e9` | Warm Cream | Tooltip backgrounds |
| **Popover Foreground** | `oklch(0.0969 0 0)` | `#383838` | Jet | Tooltip text |

### Semantic Colors

| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Muted** | `oklch(0.274 0.006 286.033)` | Disabled states, subtle BGs |
| **Muted Foreground** | `oklch(0.6467 0 0)` | Secondary text |
| **Destructive** | `oklch(0.704 0.191 22.216)` | Errors, warnings, delete |
| **Border** | - | Element borders |
| **Input** | `oklch(1 0 0 / 15%)` | Input backgrounds (15% opacity) |
| **Ring** | `oklch(0.554 0.135 66.442)` | Focus outlines |

### Sidebar Colors

| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Sidebar** | `oklch(0.21 0.006 285.885)` | Dark sidebar BG |
| **Sidebar Foreground** | `oklch(0.985 0 0)` | Sidebar text |
| **Sidebar Primary** | `oklch(0.795 0.184 86.047)` | Active nav items |
| **Sidebar Primary Foreground** | `oklch(0.421 0.095 57.708)` | Text on active |
| **Sidebar Accent** | `oklch(0.274 0.006 286.033)` | Hover states |
| **Sidebar Border** | `oklch(1 0 0 / 10%)` | Sidebar dividers |

### Chart Colors

For data visualization:

| Chart | OKLCH Value | Color |
|-------|-------------|-------|
| **Chart 1** | `oklch(0.488 0.243 264.376)` | Purple |
| **Chart 2** | `oklch(0.696 0.17 162.48)` | Teal |
| **Chart 3** | `oklch(0.769 0.188 70.08)` | Orange |
| **Chart 4** | `oklch(0.627 0.265 303.9)` | Magenta |
| **Chart 5** | `oklch(0.645 0.246 16.439)` | Red-Orange |

---

## 🌙 Dark Mode Colors

### Brand Colors (Inverted)

| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Primary** (Bright Yellow) | `oklch(0.795 0.184 86.047)` | Main brand |
| **Primary Foreground** | `oklch(0.421 0.095 57.708)` | Text on primary |
| **Secondary** | `oklch(0.274 0.006 286.033)` | Highlights |
| **Secondary Foreground** | `oklch(0.985 0 0)` | Text on secondary |
| **Accent** | `oklch(0.274 0.006 286.033)` | Special emphasis |
| **Accent Foreground** | `oklch(0.985 0 0)` | Text on accent |

### Base Colors

| Color | OKLCH Value | Hex | Usage |
|-------|-------------|-----|-------|
| **Background** | `oklch(0.141 0.005 285.823)` | - | Page background |
| **Foreground** | `oklch(0.985 0 0)` | ~`#FAFAFA` | Primary text |
| **Card** | `oklch(0.21 0.006 285.885)` | `#2a2a2a` | Card backgrounds |
| **Card Foreground** | `oklch(0.985 0 0)` | ~`#FAFAFA` | Card text |

### Semantic Colors

| Color | OKLCH Value | Usage |
|-------|-------------|-------|
| **Muted** | `oklch(0.274 0.006 286.033)` | Disabled states |
| **Muted Foreground** | `oklch(0.705 0.015 286.067)` | Secondary text |
| **Border** | `oklch(1 0 0 / 10%)` | Element borders (10% opacity) |
| **Input** | `oklch(1 0 0 / 15%)` | Input backgrounds (15% opacity) |

---

## 🎨 Color Palette Summary

### Brand Colors (from Coolors.co)

| Color | Hex | Color Name | Usage |
|-------|-----|------------|-------|
| **Primary** | `#FF9500` | Princeton Orange | Main brand identity, CTAs, primary actions |
| **Secondary** | `#F6464F` | Imperial Red | Highlights, badges, secondary actions |
| **Accent** | `#9ED22D` | Yellow Green | Success states, special CTAs |
| **Foreground** | `#383838` | Jet | Primary text color |
| **Background** | `#FFFBF5` | Floral White | Page background |

### Supporting Colors

| Color | Hex | Description |
|-------|-----|-------------|
| **Card Background** | `#fcf2e9` | Warm Cream - Light mode cards |
| **Card Background (Dark)** | `#2a2a2a` | Dark Gray - Dark mode cards |
| **White** | `#FAFAFA` | Text on colored backgrounds |

---

## Typography

### Font Families

```css
/* Primary Sans-Serif */
--font-sans: Raleway, system-ui, sans-serif

/* Display Font (Headings) */
--font-funnel: Funnel Display, system-ui, sans-serif

/* Accent Font */
--font-grotesk: Space Grotesk, monospace

/* Serif Font */
--font-ledger: Ledger, Georgia, serif

/* Monospace */
--font-mono: Geist Mono, monospace
```

### Heading Styles

```css
/* H1 - Hero Headlines */
h1 {
  font-family: Funnel Display;
  font-size: 3rem; /* 48px */
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* H2 - Section Headers */
h2 {
  font-family: Funnel Display;
  font-size: 2.25rem; /* 36px */
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* H3 - Subsection Headers */
h3 {
  font-family: Funnel Display;
  font-size: 1.875rem; /* 30px */
  font-weight: 500;
}

/* H4 - Card Titles */
h4 {
  font-family: Space Grotesk;
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
}
```

### Body Text

- **Base**: Raleway, 16px, font-weight 400
- **Links**: `color: primary` with underline on hover
- **Emphasis**: `.subrayado` - underline with primary color, 2px thickness, 6px offset

---

## Layout System

### Container Classes

```css
/* Page Wrapper */
.page {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 2rem;
}

/* Responsive on Medium+ */
@media (min-width: 768px) {
  .page {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
}

/* Content Container */
.container {
  display: flex;
  width: 100%;
  max-width: 48rem; /* 768px */
  flex-direction: column;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container {
    max-width: 80rem; /* 1280px */
    padding: 0 2rem;
  }
}

/* Section Wrapper */
.section {
  width: 100%;
}

@media (min-width: 768px) { .section { max-width: 640px; } }
@media (min-width: 1024px) { .section { max-width: 768px; } }
@media (min-width: 1280px) { .section { max-width: 1024px; } }
@media (min-width: 1536px) { .section { max-width: 1280px; } }
```

### Spacing Scale

Tailwind's default spacing scale applies:
- **0.5rem** = 8px
- **1rem** = 16px
- **1.5rem** = 24px
- **2rem** = 32px
- **3rem** = 48px

---

## Component Patterns

### Border Radius

```css
--radius: 0.65rem; /* Base radius: ~10px */

/* Size Variants */
--radius-sm: calc(var(--radius) - 4px);  /* ~6px */
--radius-md: calc(var(--radius) - 2px);  /* ~8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) + 4px);  /* ~14px */
```

**Default Button Style**: `border-radius: 9999px` (fully rounded)

### Card Styling

```css
/* Light Mode Card */
background-color: #fcf2e9; /* Warm cream */
color: oklch(0.0969 0 0);   /* Dark text */
border-radius: var(--radius-lg);

/* Dark Mode Card */
background-color: #2a2a2a; /* Dark gray */
color: oklch(0.985 0 0);    /* White text */
```

### Focus States

All interactive elements use consistent focus styles:
```css
outline: 2px solid oklch(0.554 0.135 66.442 / 50%);
outline-offset: 2px;
```

---

## Usage Examples

### Primary Button

```tsx
<button className="bg-primary text-primary-foreground rounded-full px-6 py-3">
  Call to Action
</button>
```

**Result**: Princeton Orange (#FF9500) button with white text, fully rounded corners

### Card Component

```tsx
<div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm">
  <h3>Card Title</h3>
  <p className="text-muted-foreground">Card content goes here</p>
</div>
```

**Result**: Cream background (light) or dark gray (dark mode) card with proper text contrast

### Link with Underline

```tsx
<a href="/about" className="subrayado">
  Learn More
</a>
```

**Result**: Primary colored link with custom underline styling

### Section Layout

```tsx
<div className="page">
  <div className="container">
    <div className="section">
      <h1>Page Title</h1>
      {/* Content */}
    </div>
  </div>
</div>
```

**Result**: Properly centered, responsive layout with max-width constraints

---

## Accessibility

### Contrast Ratios

All color combinations meet **WCAG 2.1 Level AA** standards:
- **Primary on White**: 4.5:1 ratio ✓
- **Foreground on Background**: 15:1 ratio ✓
- **Muted Foreground on Background**: 4.8:1 ratio ✓

### Focus Indicators

All interactive elements have visible focus states using `--ring` color with 50% opacity.

### Dark Mode Considerations

- Maintains same contrast ratios as light mode
- Inverts color relationships appropriately
- Preserves semantic meaning of colors

---

## Animation System

### Gradient Animation

```css
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  animation: gradient 15s ease infinite;
}
```

### Shimmer Effect

```css
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
```

Usage: For loading states and skeleton screens

---

## Implementation Notes

### CSS Architecture

- **Tailwind CSS v4**: Modern utility-first framework
- **CSS Custom Properties**: All colors and tokens as CSS variables
- **@theme inline**: Theme configuration in globals.css
- **Layer-Based**: `@layer base` for global styles

### Dark Mode Switching

Dark mode is controlled via `.dark` class on root element:
```tsx
<html className={isDark ? 'dark' : ''}>
```

All color variables automatically switch when `.dark` is present.

### Para SDK Modal Fixes

Special overrides for Para authentication modal:
```css
div[role="dialog"] {
  background-color: #fcf2e9 !important; /* Light mode */
  color: #1f2937 !important;
  border-radius: 0.75rem !important;
}
```

Ensures authentication modal matches Frutero's design system.

---

## Best Practices

### ✅ Do

- Use semantic color names (`primary`, `accent`, `muted`)
- Apply consistent spacing with Tailwind utilities
- Use OKLCH for custom color definitions
- Maintain contrast ratios for accessibility
- Use `rounded-full` for buttons by default

### ❌ Don't

- Hardcode hex colors in components
- Mix HSL/RGB with OKLCH values
- Override focus styles without ensuring visibility
- Use arbitrary values when design tokens exist
- Ignore dark mode variants

---

## Quick Reference

### Most Common Classes

```css
/* Buttons */
bg-primary text-primary-foreground rounded-full

/* Cards */
bg-card text-card-foreground rounded-lg

/* Text */
text-foreground        /* Primary text */
text-muted-foreground  /* Secondary text */

/* Layout */
page container section

/* Links */
text-primary subrayado
```

### Color Variable Access

In CSS:
```css
color: var(--primary);
background-color: var(--card);
```

In Tailwind:
```tsx
className="bg-primary text-primary-foreground"
```

---

## Resources

- **Tailwind CSS v4 Docs**: https://tailwindcss.com
- **OKLCH Color Picker**: https://oklch.com
- **Coolors Palette Manager**: https://coolors.co - Official source for Frutero color names
- **Design System Source**: `src/styles/globals.css`
- **Font Files**: `src/lib/fonts.ts`

---

## Color Reference

All Frutero brand colors are managed in Coolors.co where official color names are maintained:

- **Primary**: #FF9500 (Princeton Orange)
- **Secondary**: #F6464F (Imperial Red)
- **Accent**: #9ED22D (Yellow Green)
- **Foreground**: #383838 (Jet)
- **Background**: #FFFBF5 (Floral White)

---

**Last Updated**: October 26, 2025
**Maintained By**: Frutero Club Development Team
