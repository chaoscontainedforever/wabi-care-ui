# Material Dashboard 3 PRO Design System Rules

## Design Philosophy
Material Dashboard 3 PRO follows Google's Material Design principles, emphasizing clean layouts, bold typography, and intuitive user interactions. This design system provides a modern, professional look perfect for admin dashboards and educational platforms.

## Core Principles

### 1. **Material Elevation**
- Use Material Design elevation system (0dp to 24dp)
- Implement proper shadow hierarchy
- Cards and surfaces should have appropriate elevation
- Follow Material Design shadow guidelines

### 2. **Material Shapes**
- Consistent border radius following Material Design
- Primary elements: `4px` border radius (Material standard)
- Secondary elements: `8px` border radius
- Small elements: `2px` border radius
- Use Material Design shape system

### 3. **Material Color Palette**
- Primary colors: Material Design color system
- Secondary colors: Complementary Material colors
- Surface colors: Material surface variants
- Maintain Material Design contrast ratios
- Use Material Design color tokens

### 4. **Typography**
- Roboto font family (Material Design standard)
- Material Design typography scale
- Proper font weight hierarchy (300, 400, 500, 700)
- Consistent spacing and line heights
- Material Design text styles

### 5. **Spacing & Layout**
- Material Design spacing system (8dp grid)
- Consistent padding and margins
- Material Design layout principles
- Proper component spacing

## Color System

### Primary Colors (Material Design Palette)
```css
--material-primary: #1976d2
--material-primary-light: #42a5f5
--material-primary-dark: #1565c0
--material-secondary: #dc004e
--material-secondary-light: #ff5983
--material-secondary-dark: #9a0036
--material-success: #2e7d32
--material-success-light: #4caf50
--material-success-dark: #1b5e20
--material-warning: #ed6c02
--material-warning-light: #ff9800
--material-warning-dark: #e65100
--material-info: #0288d1
--material-info-light: #03a9f4
--material-info-dark: #01579b
--material-error: #d32f2f
--material-error-light: #f44336
--material-error-dark: #b71c1c
```

### Surface Colors (Material Design)
```css
--material-surface: #ffffff
--material-surface-variant: #f5f5f5
--material-background: #fafafa
--material-on-surface: #212121
--material-on-surface-variant: #757575
--material-outline: #e0e0e0
--material-outline-variant: #f5f5f5
```

### Text Colors
```css
--material-text-primary: #212121
--material-text-secondary: #757575
--material-text-disabled: #bdbdbd
--material-text-hint: #9e9e9e
```

## Shadow System

### Material Design Elevation Levels
```css
--material-elevation-0: none
--material-elevation-1: 0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)
--material-elevation-2: 0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)
--material-elevation-4: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)
--material-elevation-8: 0px 5px 5px -3px rgba(0, 0, 0, 0.12), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)
--material-elevation-12: 0px 7px 8px -4px rgba(0, 0, 0, 0.12), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)
--material-elevation-16: 0px 8px 10px -5px rgba(0, 0, 0, 0.12), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)
--material-elevation-24: 0px 11px 15px -7px rgba(0, 0, 0, 0.12), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)
```

### Material Design Component Shadows
```css
--material-card-shadow: var(--material-elevation-1)
--material-button-shadow: var(--material-elevation-2)
--material-fab-shadow: var(--material-elevation-6)
--material-dialog-shadow: var(--material-elevation-24)
--material-app-bar-shadow: var(--material-elevation-4)
```

## Component Guidelines

### Cards
- Use `--soft-shadow-card` for elevation
- Border radius: `12px`
- Subtle background gradients
- Soft borders with low opacity

### Buttons
- Use `--soft-shadow-button` for depth
- Rounded corners: `8px`
- Gradient backgrounds for primary buttons
- Soft hover effects

### Inputs
- Use `--soft-shadow-input` for inset effect
- Rounded corners: `8px`
- Soft focus states
- Gentle border colors

### Navigation
- Subtle background colors
- Soft hover effects
- Rounded active states
- Gentle transitions

## Animation Guidelines

### Transitions
- Duration: `200ms` for micro-interactions
- Duration: `300ms` for page transitions
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Avoid jarring movements

### Hover Effects
- Subtle scale transforms: `scale(1.02)`
- Gentle shadow increases
- Smooth color transitions
- No abrupt changes

## Accessibility

### Contrast Ratios
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Ensure color is not the only indicator

### Focus States
- Visible focus indicators
- Soft, rounded focus rings
- Consistent focus behavior

## Implementation Notes

1. **Always use CSS custom properties** for colors and shadows
2. **Maintain consistency** across all components
3. **Test in both light and dark modes**
4. **Ensure responsive behavior** on all screen sizes
5. **Validate accessibility** with screen readers

## Dark Mode Considerations

### Dark Mode Colors
```css
--soft-dark-bg-primary: #0f172a
--soft-dark-bg-secondary: #1e293b
--soft-dark-bg-tertiary: #334155
--soft-dark-text-primary: #f8fafc
--soft-dark-text-secondary: #cbd5e1
```

### Dark Mode Shadows
- Use lighter shadow colors for dark backgrounds
- Maintain depth perception
- Ensure proper contrast

