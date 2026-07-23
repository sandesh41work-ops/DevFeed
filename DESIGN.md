---
name: DevFeed Mobile
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#584235'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8c7263'
  outline-variant: '#e0c0af'
  surface-tint: '#994700'
  primary: '#994700'
  on-primary: '#ffffff'
  primary-container: '#ff7a00'
  on-primary-container: '#5c2800'
  inverse-primary: '#ffb68b'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#a1a0a0'
  on-tertiary-container: '#373737'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb68b'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#753400'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 12px
---

## Brand & Style

The design system is built on a "Premium Minimalist" philosophy, specifically tailored for the technical and discerning developer community. It avoids unnecessary flourishes, focusing instead on structural clarity and high-contrast intentionality. 

The aesthetic sits at the intersection of **Corporate Modern** and **Minimalism**, utilizing a refined #F4F4F4 off-white canvas that reduces eye strain compared to pure white. The brand personality is signaled through two anchors: the high-tech keyboard/circuitry icon (representing precision and logic) and the orange cat mascot (representing curiosity and companionship in the developer journey). The interface remains monochromatic and systematic, allowing the "DevFeed Orange" to function as a high-signal indicator for progress, interaction, and intelligence.

## Colors

This color palette prioritizes functional hierarchy. The **Primary (DevFeed Orange)** is reserved for brand moments and critical action states. **Secondary (Charcoal)** provides the backbone for primary text and high-contrast buttons, ensuring a "pro" feel.

- **Background:** #F4F4F4 is the global foundation.
- **Surface:** Pure White (#FFFFFF) is used for cards and elevated containers to create subtle contrast against the background.
- **Action Charcoal:** #1A1A1A used for primary buttons and main navigation labels.
- **Muted Slate:** #666666 for secondary information and metadata.

## Typography

The design system uses **Geist** for its systematic, developer-centric aesthetic. It provides the clarity of a neo-grotesque with the precision required for technical content. 

- **Headlines:** Use tight letter-spacing and semi-bold weights to command attention without being bulky.
- **Body:** Standardized at 16px for readability, with a generous 1.5x line height.
- **Labels:** Small caps or increased letter-spacing is applied to metadata labels to distinguish them from body copy.
- **Code Snippets:** While the primary font is Geist, inline code or code blocks should utilize **JetBrains Mono** for character distinction.

## Layout & Spacing

This design system employs a **4px baseline grid** to ensure mathematical precision in vertical rhythm. 

- **Mobile Philosophy:** A fluid 4-column grid with 20px side margins. 
- **Density:** Spacing is kept relatively open to maintain the "Premium" feel, using 16px (md) as the default padding for most containers.
- **Reflow:** On larger mobile screens (Max width devices), the 4-column grid scales but maintains the 20px margin to keep the focus central.

## Elevation & Depth

To maintain the minimalist aesthetic, this system avoids heavy drop shadows. Instead, it uses **Tonal Layering** and **Subtle Outlines**.

1.  **Level 0 (Base):** #F4F4F4 background.
2.  **Level 1 (Surface):** #FFFFFF containers with a 1px solid #E5E5E5 border. This is the standard for cards and feed items.
3.  **Interactive Depth:** When an element is pressed, it does not lift; instead, it receives a subtle inner-stroke or a 2px offset shadow to simulate a "pressed-in" tactile feel.
4.  **Overlays:** Modals and bottom sheets use a 15% opacity black backdrop blur to maintain context without visual clutter.

## Shapes

The shape language is "Soft" but disciplined. 
- **Standard Radius:** 4px (0.25rem) for inputs and small components.
- **Container Radius:** 8px (0.5rem) for cards and modals.
- **Action Radius:** 4px for buttons to maintain a "technical tool" appearance rather than a "consumer social" appearance (which would use pills).
- **Mascot Treatment:** The orange cat mascot should always be placed in circular or soft-edged frames to contrast with the more rigid UI elements.

## Components

### Buttons
- **Primary:** Charcoal (#1A1A1A) background with White text. Sharp 4px corners.
- **Secondary:** Transparent background with 1px Charcoal border.
- **Ghost:** Transparent background with Orange text for low-priority actions.

### Input Fields
- **Default:** White surface, 1px #E5E5E5 border, 4px radius.
- **Focus:** 1px Orange (#FF7A00) border with a 2px soft orange outer glow (10% opacity).

### Chips & Tags
- Used for programming languages (e.g., "Python", "React").
- Small Geist font, 2px radius, #F4F4F4 background with #666666 text.

### Cards (The Feed)
- #FFFFFF background, 8px radius, 1px #E5E5E5 border.
- No shadow. Content should have 16px internal padding.

### Navigation
- Bottom tab bar uses a #FFFFFF surface with a 1px top border.
- Active states are indicated by the icon switching to DevFeed Orange.