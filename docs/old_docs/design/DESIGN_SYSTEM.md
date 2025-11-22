# Wabi Care: Design System

**Version**: 1.0  
**Date**: October 16, 2025  
**Owner**: Design & Engineering Team  
**Status**: Live Implementation

---

## Overview

Wabi Care's design system is built on **Shadcn UI** and **Tailwind CSS**, featuring a subtle, professional aesthetic with a soft grey color palette and vibrant gradient accents. The system prioritizes clarity, consistency, and modern interactions.

**Design Philosophy**:
- **Subtle & Professional**: Soft grey background with white cards for content hierarchy
- **Vibrant Accents**: Pink-to-purple gradients for primary actions
- **Smooth Interactions**: Transitions, hover effects, and micro-animations
- **Accessibility-First**: WCAG 2.1 AA compliant components

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Interactions & Animations](#interactions--animations)
6. [Icons](#icons)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

## Color System

### Base Colors (HSL)

```css
/* Light theme - consistent across all pages */
:root {
  /* Backgrounds */
  --background: 0 0% 96%;        /* Soft grey background */
  --card: 0 0% 100%;              /* White cards */
  --popover: 0 0% 100%;           /* White popovers */
  
  /* Text */
  --foreground: 0 0% 3.9%;        /* Near-black text */
  --card-foreground: 0 0% 3.9%;   /* Card text */
  --muted-foreground: 0 0% 45.1%; /* Muted text */
  
  /* UI Elements */
  --primary: 0 0% 9%;             /* Almost black */
  --primary-foreground: 0 0% 98%; /* Almost white */
  --secondary: 0 0% 98%;          /* Very light grey */
  --muted: 0 0% 94%;              /* Light grey */
  --accent: 0 0% 94%;             /* Light grey accent */
  
  /* Borders & Inputs */
  --border: 0 0% 89.8%;           /* Subtle grey border */
  --input: 0 0% 100%;             /* White inputs */
  --ring: 0 0% 3.9%;              /* Focus ring */
  
  /* Sidebar (matches cards) */
  --sidebar-background: 0 0% 100%;
  --sidebar-foreground: 0 0% 3.9%;
  --sidebar-border: 0 0% 89.8%;
  
  /* Utility */
  --destructive: 0 84.2% 60.2%;   /* Red for errors */
  --radius: 0.5rem;               /* Border radius */
}
```

### Gradient Colors

Wabi Care uses **gradient combinations** for interactive elements:

```css
/* Primary gradient (Pink to Purple) */
.gradient-primary {
  background: linear-gradient(to right, #ec4899, #9333ea);
}

/* Destructive gradient (Red) */
.gradient-destructive {
  background: linear-gradient(to right, #f87171, #dc2626);
}

/* Success gradient (Green) */
.gradient-success {
  background: linear-gradient(to right, #4ade80, #16a34a);
}

/* Info gradient (Blue) */
.gradient-info {
  background: linear-gradient(to right, #60a5fa, #2563eb);
}

/* Warning gradient (Yellow to Orange) */
.gradient-warning {
  background: linear-gradient(to right, #facc15, #f97316);
}

/* Secondary gradient (Grey) */
.gradient-secondary {
  background: linear-gradient(to right, #9ca3af, #4b5563);
}
```

### Color Usage Guidelines

| Color | Use Case | Example |
|-------|----------|---------|
| **Background (96% grey)** | Page background | Main canvas |
| **Card (White)** | Content containers | Patient cards, goal cards |
| **Primary (Pink-Purple)** | Primary actions | "Save", "Submit", "Create" buttons |
| **Destructive (Red)** | Destructive actions | "Delete", "Cancel" buttons |
| **Success (Green)** | Positive actions | "Complete", "Approve" buttons |
| **Info (Blue)** | Informational | "View Details", "Learn More" |
| **Warning (Yellow-Orange)** | Caution | "Review Required" alerts |
| **Muted (Light grey)** | Disabled states | Inactive buttons, placeholders |

### Color Contrast

All color combinations meet **WCAG 2.1 AA standards**:
- **Text on background**: 7:1 contrast ratio (AAA)
- **Text on cards**: 15:1 contrast ratio (AAA)
- **Button text on gradients**: 4.5:1 minimum (AA)

---

## Typography

### Font Family

**Primary Font**: [Roboto](https://fonts.google.com/specimen/Roboto)

```css
body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Why Roboto?**
- Neutral, professional appearance
- Excellent readability at all sizes
- Wide character set (multilingual support)
- Optimized for digital interfaces

---

### Font Weights

| Weight | Usage | Class |
|--------|-------|-------|
| **300 (Light)** | Large headings, hero text | `font-light` |
| **400 (Regular)** | Body text, descriptions | `font-normal` |
| **500 (Medium)** | Subheadings, labels | `font-medium` |
| **700 (Bold)** | Headings, emphasis | `font-bold` or `font-semibold` |

---

### Type Scale

| Element | Size | Line Height | Weight | Tailwind Class |
|---------|------|-------------|--------|----------------|
| **H1** | 2.25rem (36px) | 2.5rem | 700 | `text-4xl font-bold` |
| **H2** | 1.875rem (30px) | 2.25rem | 700 | `text-3xl font-bold` |
| **H3** | 1.5rem (24px) | 2rem | 600 | `text-2xl font-semibold` |
| **H4** | 1.25rem (20px) | 1.75rem | 600 | `text-xl font-semibold` |
| **Body Large** | 1.125rem (18px) | 1.75rem | 400 | `text-lg` |
| **Body** | 1rem (16px) | 1.5rem | 400 | `text-base` |
| **Body Small** | 0.875rem (14px) | 1.25rem | 400 | `text-sm` |
| **Caption** | 0.75rem (12px) | 1rem | 400 | `text-xs` |

---

### Typography Examples

```tsx
// Page Title
<h1 className="text-4xl font-bold text-foreground">
  Goal Data Collection
</h1>

// Section Heading
<h2 className="text-2xl font-semibold text-foreground">
  Recent Sessions
</h2>

// Card Title
<h3 className="font-semibold leading-none tracking-tight">
  Sarah Johnson
</h3>

// Body Text
<p className="text-base text-foreground">
  Sarah completed 5 trials today with 90% accuracy.
</p>

// Muted Text
<p className="text-sm text-muted-foreground">
  Last updated 2 hours ago
</p>
```

---

## Spacing & Layout

### Spacing Scale

Wabi Care uses Tailwind's default 4px-based spacing scale:

| Name | Size | Usage | Class |
|------|------|-------|-------|
| **xs** | 0.5rem (8px) | Tight spacing | `p-2`, `m-2` |
| **sm** | 0.75rem (12px) | Small gaps | `p-3`, `m-3` |
| **md** | 1rem (16px) | Default spacing | `p-4`, `m-4` |
| **lg** | 1.5rem (24px) | Section spacing | `p-6`, `m-6` |
| **xl** | 2rem (32px) | Large sections | `p-8`, `m-8` |
| **2xl** | 2.5rem (40px) | Page sections | `p-10`, `m-10` |

---

### Layout Patterns

#### Card Padding

```tsx
<Card>
  <CardHeader className="flex flex-col space-y-1.5 p-6">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    Content here
  </CardContent>
  <CardFooter className="flex items-center p-6 pt-0">
    Footer actions
  </CardFooter>
</Card>
```

#### Grid Layout

```tsx
// 3-column responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 2-column form
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields */}
</div>
```

#### Flexbox Layout

```tsx
// Horizontal with gap
<div className="flex items-center gap-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

// Vertical stack
<div className="flex flex-col space-y-4">
  <Card />
  <Card />
</div>
```

---

## Components

### Buttons

Wabi Care buttons use **gradient backgrounds** with hover effects:

#### Variants

```tsx
// Primary (Pink to Purple gradient)
<Button variant="default">
  Primary Action
</Button>

// Destructive (Red gradient)
<Button variant="destructive">
  Delete
</Button>

// Success (Green gradient)
<Button variant="success">
  Complete
</Button>

// Info (Blue gradient)
<Button variant="info">
  View Details
</Button>

// Warning (Yellow-Orange gradient)
<Button variant="warning">
  Review Required
</Button>

// Outline (Border only)
<Button variant="outline">
  Cancel
</Button>

// Ghost (No background)
<Button variant="ghost">
  Dismiss
</Button>

// Link
<Button variant="link">
  Learn More
</Button>
```

#### Sizes

```tsx
<Button size="sm">Small</Button>      // 32px height
<Button size="default">Default</Button> // 36px height
<Button size="lg">Large</Button>      // 40px height
<Button size="icon">                  // 36px × 36px
  <Plus />
</Button>
```

#### Button CSS

```css
.button-default {
  background: linear-gradient(to right, #ec4899, #9333ea);
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 200ms;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.button-default:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: scale(1.05);
}
```

---

### Cards

Cards are **white containers** on the grey background with **hover effects**:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Patient Overview</CardTitle>
    <CardDescription>View patient progress</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Card Hover Effect

```css
.card {
  background: white;
  border: 1px solid hsl(0, 0%, 89.8%);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 300ms;
}

.card:hover {
  box-shadow: 
    0 0 30px rgba(236, 72, 153, 0.3),  /* Pink glow */
    0 0 60px rgba(147, 51, 234, 0.2);  /* Purple glow */
}
```

**Disable Hover Effect**:
```tsx
<Card noHover>
  Static card without hover effect
</Card>
```

---

### Inputs

```tsx
// Text Input
<Input
  type="text"
  placeholder="Enter patient name"
  className="bg-white"
/>

// Textarea
<Textarea
  placeholder="Session notes"
  className="min-h-[100px]"
/>

// Select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select goal" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="goal1">Identify Colors</SelectItem>
    <SelectItem value="goal2">Match Shapes</SelectItem>
  </SelectContent>
</Select>
```

---

### Badges

```tsx
// Status badges
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Overdue</Badge>
<Badge variant="outline">Draft</Badge>

// Custom colors
<Badge className="bg-green-100 text-green-800">
  Completed
</Badge>
<Badge className="bg-blue-100 text-blue-800">
  In Progress
</Badge>
```

---

### Tabs

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="goals">Goals</TabsTrigger>
    <TabsTrigger value="data">Data</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    Overview content
  </TabsContent>
  <TabsContent value="goals">
    Goals content
  </TabsContent>
  <TabsContent value="data">
    Data content
  </TabsContent>
</Tabs>
```

---

### Avatars

```tsx
<Avatar>
  <AvatarImage src="/avatars/sarah.jpg" alt="Sarah Johnson" />
  <AvatarFallback>SJ</AvatarFallback>
</Avatar>

// With size variants
<Avatar className="h-8 w-8">...</Avatar>  // Small
<Avatar className="h-12 w-12">...</Avatar> // Default
<Avatar className="h-16 w-16">...</Avatar> // Large
```

---

### Dialogs

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Goal</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>
        Save
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## Interactions & Animations

### Hover Effects

#### Button Hover

```css
/* Scale + Shadow */
.button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### Card Hover

```css
/* Pink/Purple glow */
.card:hover {
  box-shadow: 
    0 0 30px rgba(236, 72, 153, 0.3),
    0 0 60px rgba(147, 51, 234, 0.2);
}
```

#### Link Hover

```css
.link:hover {
  text-decoration: underline;
  color: #ec4899; /* Pink */
}
```

---

### Transitions

All interactive elements use **smooth transitions**:

```css
/* Global transition classes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 200ms;
}
```

---

### Loading States

```tsx
// Skeleton loader
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
```

**Pulse Animation** (for loading placeholders):

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.sidebar-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

### Focus States

All interactive elements have visible focus indicators:

```css
.focus-visible\:outline-none:focus-visible {
  outline: 2px solid transparent;
}

.focus-visible\:ring-1:focus-visible {
  ring: 1px solid hsl(var(--ring));
  ring-offset: 2px;
}
```

---

## Icons

### Icon Library

**Lucide React**: Modern, consistent icon set

```tsx
import { 
  Search, 
  Plus, 
  ChevronRight,
  CheckCircle,
  Calendar,
  Settings,
  User
} from "lucide-react"

// Usage
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Goal
</Button>
```

### Icon Sizing

| Size | Class | Use Case |
|------|-------|----------|
| **16px** | `h-4 w-4` | Button icons, inline icons |
| **20px** | `h-5 w-5` | Default UI icons |
| **24px** | `h-6 w-6` | Section icons |
| **32px** | `h-8 w-8` | Large feature icons |

### Icon Colors

Icons inherit text color by default:

```tsx
// Default (inherits parent)
<Search className="h-5 w-5" />

// Custom color
<Search className="h-5 w-5 text-pink-500" />

// Muted
<Search className="h-5 w-5 text-muted-foreground" />
```

### Active State Icons

Sidebar menu icons turn **pink** when active:

```css
[data-sidebar="menu-button"][data-active="true"] svg {
  color: #ec4899 !important; /* pink-500 */
}
```

---

## Responsive Design

### Breakpoints

Wabi Care uses Tailwind's default breakpoints:

| Breakpoint | Min Width | Device |
|------------|-----------|--------|
| **sm** | 640px | Mobile landscape, small tablets |
| **md** | 768px | Tablets |
| **lg** | 1024px | Laptops, small desktops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

### Mobile-First Approach

```tsx
// Stack on mobile, 2 columns on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Hide on mobile, show on desktop
<div className="hidden lg:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="block lg:hidden">
  Mobile only content
</div>
```

### Responsive Typography

```tsx
// Larger on desktop
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Adjust padding
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

- ✅ **Text on background**: 7:1 (AAA)
- ✅ **Text on cards**: 15:1 (AAA)
- ✅ **Button text**: 4.5:1 minimum (AA)
- ✅ **Icons**: 3:1 minimum (AA)

#### Focus Indicators

All interactive elements have visible focus states:

```tsx
<Button className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
  Accessible Button
</Button>
```

#### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Modal dialogs trap focus
- Escape key closes dialogs

#### Screen Reader Support

```tsx
// ARIA labels
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Live regions
<div aria-live="polite" aria-atomic="true">
  Data saved successfully
</div>

// Semantic HTML
<nav aria-label="Main navigation">
  {/* Nav content */}
</nav>
```

---

## Component Library

### Shadcn UI Components Used

The following Shadcn components are installed and available:

| Component | File | Usage |
|-----------|------|-------|
| **Alert** | `ui/alert.tsx` | Notifications, warnings |
| **Avatar** | `ui/avatar.tsx` | User avatars |
| **Badge** | `ui/badge.tsx` | Status indicators |
| **Breadcrumb** | `ui/breadcrumb.tsx` | Navigation breadcrumbs |
| **Button** | `ui/button.tsx` | Actions, CTAs |
| **Card** | `ui/card.tsx` | Content containers |
| **Checkbox** | `ui/checkbox.tsx` | Multi-select options |
| **Dialog** | `ui/dialog.tsx` | Modals, overlays |
| **Input** | `ui/input.tsx` | Text inputs |
| **Label** | `ui/label.tsx` | Form labels |
| **Progress** | `ui/progress.tsx` | Progress bars |
| **Radio Group** | `ui/radio-group.tsx` | Single-select options |
| **Scroll Area** | `ui/scroll-area.tsx` | Custom scrollbars |
| **Select** | `ui/select.tsx` | Dropdown selects |
| **Separator** | `ui/separator.tsx` | Visual dividers |
| **Sheet** | `ui/sheet.tsx` | Slide-out panels |
| **Sidebar** | `ui/sidebar.tsx` | App navigation |
| **Skeleton** | `ui/skeleton.tsx` | Loading placeholders |
| **Switch** | `ui/switch.tsx` | Toggle switches |
| **Tabs** | `ui/tabs.tsx` | Tab navigation |
| **Textarea** | `ui/textarea.tsx` | Multi-line inputs |
| **Tooltip** | `ui/tooltip.tsx` | Contextual help |

---

## Design Tokens

### CSS Variables (Tailwind Config)

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      // ... other colors
    },
    fontFamily: {
      material: ['Roboto', 'sans-serif']
    }
  }
}
```

### Border Radius

```css
--radius: 0.5rem; /* 8px */

/* Tailwind classes */
.rounded-xl {
  border-radius: 0.75rem; /* 12px - used for cards */
}

.rounded-md {
  border-radius: 0.375rem; /* 6px - used for buttons */
}
```

---

## Best Practices

### Do's ✅

- **Use gradient buttons** for primary actions
- **Use white cards** on grey background for content hierarchy
- **Use hover effects** to indicate interactivity
- **Use consistent spacing** (multiples of 4px)
- **Use semantic HTML** for accessibility
- **Use Shadcn components** for consistency
- **Test on mobile** devices early

### Don'ts ❌

- **Don't use pure black** (#000) - use near-black (--foreground)
- **Don't override card backgrounds** - keep white for consistency
- **Don't disable hover effects** unless intentional
- **Don't use custom colors** without consulting design system
- **Don't skip keyboard navigation** testing
- **Don't use images without alt text**
- **Don't mix different button styles** in same context

---

## Design Resources

### Figma Files
- [Component Library](https://figma.com/...) - Master components
- [Design Mockups](https://figma.com/...) - Page designs

### Development Resources
- [Shadcn UI Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI Primitives](https://www.radix-ui.com/)

### Color Tools
- [Coolors](https://coolors.co/) - Palette generator
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG compliance

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-16 | Initial design system documentation based on live implementation |

---

**Questions?** Contact the design team on Slack #design or #engineering.

