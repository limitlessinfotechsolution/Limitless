# UI Components Documentation

This document provides an overview of the UI components available in the LimitlessInfotech project.

## Theme System

### ThemeProvider
A context provider for managing application themes (light, dark, system).

```tsx
import { ThemeProvider } from '../components/common/ThemeProvider';

<ThemeProvider>
  <App />
</ThemeProvider>
```

### useThemeContext
A hook to access and modify the current theme.

```tsx
import { useThemeContext } from '../components/common/ThemeProvider';

const { theme, setTheme } = useThemeContext();
```

### ThemeToggle
A component for toggling between light, dark, and system themes.

```tsx
import ThemeToggle from '../components/common/ThemeToggle';

<ThemeToggle />
```

## Card Components

### Basic Card
A simple card component with basic styling.

```tsx
import Card from '../components/ui/Card';

<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

### Enhanced Card
An enhanced card with multiple variants and hover effects.

```tsx
import CardEnhanced from '../components/ui/Card-enhanced';

<CardEnhanced 
  variant="elevated" 
  hover="lift" 
  className="p-6"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</CardEnhanced>
```

### Advanced Card
An advanced card with animations and more customization options.

```tsx
import AdvancedCard from '../components/ui/AdvancedCard';

<AdvancedCard 
  variant="glass" 
  hoverEffect="scale" 
  animationDelay={0.2}
  isInView={true}
>
  <h3>Card Title</h3>
  <p>Card content</p>
</AdvancedCard>
```

## Animation Components

### ParallaxSection
A component that creates a parallax scrolling effect.

```tsx
import ParallaxSection from '../components/home/ParallaxSection';

<ParallaxSection speed={0.5} direction="up">
  <div>Content with parallax effect</div>
</ParallaxSection>
```

### ParallaxCard
An enhanced parallax component with more control options.

```tsx
import ParallaxCard from '../components/ui/ParallaxCard';

<ParallaxCard speed={0.3} direction="down" triggerPoint={0.3}>
  <div>Content with parallax effect</div>
</ParallaxCard>
```

## Other UI Components

### Loading States
Various loading components for different use cases.

```tsx
import { LoadingSpinner, LoadingButton, Skeleton } from '../components/ui/LoadingStates';

<LoadingSpinner size="md" />
<LoadingButton loading={true}>Loading...</LoadingButton>
<Skeleton width="100%" height="2rem" />
```

### Toast
Notification components for user feedback.

```tsx
import { useToast } from '../hooks/useToast';

const { success, error, warning, info } = useToast();

success('Operation completed', 'Your changes have been saved');
```

## Available Variants

### Card Variants
- `default`: Basic card with shadow
- `elevated`: Card with enhanced shadow
- `outlined`: Card with border only
- `gradient`: Card with gradient background
- `glass`: Frosted glass effect
- `neumorphism`: Neumorphic design

### Hover Effects
- `lift`: Moves element up on hover
- `glow`: Adds glow effect on hover
- `scale`: Scales element on hover
- `none`: No hover effect

## Usage Examples

### Creating a Feature Card
```tsx
import AdvancedCard from '../components/ui/AdvancedCard';
import { motion } from 'framer-motion';

<AdvancedCard 
  variant="elevated" 
  hoverEffect="lift"
  className="text-center"
>
  <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    <Icon className="w-8 h-8 text-accent" />
  </div>
  <h3 className="text-xl font-bold mb-2">Feature Title</h3>
  <p className="text-gray-600 dark:text-gray-400">
    Feature description goes here
  </p>
</AdvancedCard>
```

### Creating a Parallax Hero Section
```tsx
import ParallaxCard from '../components/ui/ParallaxCard';

<ParallaxCard speed={0.2} direction="up">
  <div className="bg-gradient-to-r from-accent to-accent-dark text-white py-20 rounded-2xl">
    <h1 className="text-4xl font-bold text-center">Hero Title</h1>
  </div>
</ParallaxCard>
```