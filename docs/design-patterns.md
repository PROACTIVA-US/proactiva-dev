# PROACTIVA Platform Design Patterns

## Overview
This document defines the UI/UX design patterns and standards for the PROACTIVA Platform. All components should adhere to these patterns for consistency and maintainability.

## Core Design Principles

### 1. Glass Morphism Theme
- Primary aesthetic using translucent backgrounds with blur effects
- Subtle borders and shadows for depth
- Background gradients for visual interest

### 2. Theme System
**User-Specific Theming**:
- Theme preferences are tied to individual user sessions
- Only authenticated users can switch themes
- Public pages always display in light mode
- Theme preference persists across sessions via localStorage

**Implementation**:
```tsx
// Theme context provides user-specific theme management
const { theme, setTheme, isAuthenticated } = useTheme()

// Theme is stored with user email as key
localStorage.setItem(`theme-${userEmail}`, theme)
```

**Protected Routes with Theme Support**:
- `/dashboard` - User dashboard
- `/admin` - Admin panel
- `/contracting` - Contracting officer view
- `/demo` - Demo interface
- `/research` - Research section

### 3. Color Palette
```typescript
// Primary Brand Colors
const COLORS = {
  proactivaBlue: "#0520A6",    // Primary blue
  vaRed: "#B91C1C",            // VA accent red
  gradientBlue: "rgba(5, 32, 166, 0.25)",
  gradientBlueSecondary: "rgba(5, 32, 166, 0.2)",
}

// Semantic Colors
const SEMANTIC = {
  success: "#10B981",  // Green
  warning: "#F59E0B",  // Amber
  error: "#EF4444",    // Red
  info: "#3B82F6",     // Blue
}
```

### 3. Typography
- Font Family: System fonts with fallbacks
- Headings: Bold, clear hierarchy
- Body: Regular weight, readable size (14-16px)
- Small text: 12-14px for captions and labels

## Component Patterns

### Glass Cards
**Pattern**: Translucent cards with backdrop blur
```tsx
className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-lg"
```
**Issues to Check**:
- ❌ Missing backdrop-blur on interactive elements
- ❌ Inconsistent opacity values
- ❌ Missing border definitions

### Buttons
**Primary Button Pattern**:
```tsx
className="bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md px-4 py-2"
```
**Secondary Button Pattern**:
```tsx
className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
```

### Form Controls

#### Input Fields
**Pattern**:
```tsx
className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
```
**Required Properties**:
- Explicit background color (bg-background or bg-white)
- Border definition
- Padding for comfortable interaction
- Focus states with ring

#### Select/Dropdown Components
**Pattern**:
```tsx
// Trigger
className="bg-background border border-input rounded-md"

// Content (Dropdown Menu) - UPDATED
className="bg-white dark:bg-gray-900 border rounded-md shadow-md"

// Select Items with interaction states
className="
  hover:bg-gray-100 dark:hover:bg-gray-800
  focus:bg-blue-50 dark:focus:bg-blue-900/20
  data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-900/20
"
```

**Interaction States**:
- **Hover**: Light gray background change
- **Keyboard Navigation**: Blue highlight for focused item
- **Selected**: Checkmark indicator
- **Disabled**: Reduced opacity

**Accessibility Features**:
- Full keyboard navigation (Arrow keys, Enter, Escape)
- Visual focus indicators
- ARIA attributes for screen readers
- Smooth transitions for state changes

#### Password Input Fields
**Pattern**:
```tsx
// Container for password field with toggle
<div className="relative">
  <Input 
    type={showPassword ? "text" : "password"}
    className="pr-10" // Extra padding for the toggle button
  />
  <button
    type="button"
    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
```

**Guidelines**:
- Always provide visibility toggle for password fields
- Use Eye/EyeOff icons from lucide-react
- Position toggle button inside the input field
- Ensure button type="button" to prevent form submission
- Add hover state for better UX
- Maintain consistent icon sizing (18px recommended)

#### Textarea
**Pattern**:
```tsx
className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
```

### User Experience Patterns

#### Welcome Messages
**Pattern**:
```tsx
// Personalized greeting after login
<h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
<p className="text-muted-foreground">{user.organization}</p>
```

**Guidelines**:
- Use first name only for friendly tone
- Display immediately after successful login
- Include organization/role context when relevant
- Fade in animation for smooth appearance
- Consider time-based greetings (Good morning/afternoon/evening)

### Navigation Components

#### Navbar
**Pattern**:
```tsx
className="sticky top-0 z-50 bg-white backdrop-blur border-b border-gray-200"
```

#### Dropdown Menus
**Pattern**:
```tsx
className="bg-white border border-gray-200 shadow-lg rounded-md"
```

### Alert/Notification Patterns

#### Success Messages
```tsx
className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
```

#### Error Messages
```tsx
className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
```

#### Info Messages
```tsx
className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
```

## Background Patterns

### Page Backgrounds
**Glass Morphism Background**:
```tsx
<div className="pointer-events-none fixed inset-0 z-0">
  <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
  <div className="absolute right-0 top-0 h-[500px] w-[500px] blur-[100px]" 
       style={{background: "rgba(5, 32, 166, 0.25)"}} />
</div>
```

### Section Backgrounds
- White sections: `bg-white`
- Gray sections: `bg-gray-50`
- Glass sections: `bg-gray-900/30 backdrop-blur-sm`

## Common UI Issues to Check

### 1. Missing Backgrounds
**Problem**: Components without explicit background colors
**Solution**: Always define bg-* class for interactive elements
**Components to Check**:
- Select dropdowns
- Modal overlays
- Tooltip content
- Dropdown menus

### 2. Dark Mode Compatibility
**Problem**: Components not adapting to dark mode
**Solution**: Use dark: modifier for authenticated views
```tsx
// For components in authenticated areas
className="bg-white dark:bg-gray-900"

// For public pages (no dark mode)
className="bg-white"
```

**Theme Toggle Implementation**:
```tsx
<ThemeToggle /> // Only visible to authenticated users
```

### 3. Focus States
**Problem**: Missing or inconsistent focus indicators
**Solution**: Use focus-visible: modifier with ring
```tsx
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 4. Hover States
**Problem**: No visual feedback on hover
**Solution**: Add hover: modifiers
```tsx
className="hover:bg-gray-50 transition-colors"
```

## Accessibility Requirements

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear visual distinction

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators must be visible
- Tab order must be logical

### ARIA Labels
- Form fields must have associated labels
- Buttons must have descriptive text or aria-label
- Decorative images should have aria-hidden="true"

## Testing Checklist for UI/UX Agent

When auditing components, check for:

1. **Background Definition**
   - [ ] All interactive elements have explicit backgrounds
   - [ ] Dropdowns and modals have proper backgrounds
   - [ ] Dark mode backgrounds are defined

2. **Consistency**
   - [ ] Button styles match defined patterns
   - [ ] Form controls use consistent styling
   - [ ] Color usage follows palette

3. **Interaction States**
   - [ ] Hover states are defined
   - [ ] Focus states are visible
   - [ ] Disabled states are clear

4. **Accessibility**
   - [ ] Color contrast meets standards
   - [ ] Keyboard navigation works
   - [ ] ARIA attributes are present

5. **Responsive Design**
   - [ ] Components adapt to screen sizes
   - [ ] Touch targets are adequate (min 44x44px)
   - [ ] Text remains readable

## CSS Variables to Define

Ensure these CSS variables are set in globals.css:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
}
```

## Implementation Notes

### For Developers
1. Always check this document when creating new components
2. Use the defined patterns and classes
3. Test in both light and dark modes
4. Verify accessibility requirements

### For UI/UX Agent
1. Load this document at startup
2. Use patterns as reference for audits
3. Flag deviations from defined patterns
4. Suggest fixes based on documented solutions

## Version History
- v1.0.0 (2024-08-14): Initial design patterns documentation
- v1.1.0 (2024-08-14): Added user-specific theme system and dropdown interaction patterns
- Future: Add animation patterns, loading states, error boundaries