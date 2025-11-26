# Animation Guide

This project now includes smooth animations using **Framer Motion** and **Tailwind CSS**.

## What's Been Added

### 1. Framer Motion Library
- Installed `framer-motion` for React animations
- Added to components: Hero, Banner, Cars, CarCard, Login

### 2. Tailwind Custom Animations
Added custom animations in `tailwind.config.js`:
- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up from bottom
- `animate-slide-down` - Slide down from top
- `animate-slide-left` - Slide from right
- `animate-slide-right` - Slide from left
- `animate-scale-in` - Scale in effect
- `animate-bounce-slow` - Slow bounce
- `animate-pulse-slow` - Slow pulse

### 3. Animated Components

#### Hero Component
- Title fades in from top
- Search form scales in
- Car image slides up
- Button has hover/tap effects

#### Banner Component
- Entire banner fades in when scrolled into view
- Text slides from left
- Image slides from right
- Button has interactive hover effects

#### Cars Page
- Title and search box animate on load
- Car cards stagger in (one after another)
- Each card has a delay based on its index

#### CarCard Component
- Hover effect: lifts up with shadow
- Tap effect: slight scale down
- Smooth transitions on all interactions

#### Login Modal
- Background fades in
- Form scales in with spring animation
- Button has hover/tap effects

## How to Use Animations

### Using Framer Motion

```jsx
import { motion } from 'framer-motion'

// Basic animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Hover animation
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// Scroll-triggered animation
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Content
</motion.div>
```

### Using Tailwind Animations

```jsx
// Add to className
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-up">Slides up</div>
<div className="animate-scale-in">Scales in</div>
```

## Animation Utilities

Check `src/utils/animations.js` for reusable animation variants:
- `fadeIn`
- `slideUp`, `slideDown`, `slideLeft`, `slideRight`
- `scaleIn`
- `staggerContainer`
- `cardHover`
- `buttonHover`

## Tips

1. **Performance**: Use `whileInView` with `viewport={{ once: true }}` for scroll animations
2. **Stagger**: Add delays to create sequential animations
3. **Spring**: Use `transition={{ type: "spring" }}` for natural motion
4. **Hover States**: Always add `whileHover` and `whileTap` to interactive elements

## Examples in Your Project

- **Hero Section**: Smooth entrance animations
- **Car Listings**: Staggered card animations
- **Modals**: Scale and fade transitions
- **Buttons**: Interactive hover effects
- **Images**: Smooth loading animations

Enjoy your animated car rental app! 🚗✨
