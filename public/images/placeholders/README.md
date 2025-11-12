# Image Placeholders

This folder contains placeholder images that will be replaced with actual assets later.

## Required Images

### Landing Page
- `hero-dashboard.png` - Dashboard preview in hero section (1200x800px)
- `feature-ai-matching.png` - AI matching feature illustration (600x400px)
- `feature-real-time.png` - Real-time alerts illustration (600x400px)
- `feature-analytics.png` - Analytics feature illustration (600x400px)

### Testimonials
- `testimonial-1.jpg` - User avatar (100x100px)
- `testimonial-2.jpg` - User avatar (100x100px)
- `testimonial-3.jpg` - User avatar (100x100px)

### Company Logos
- `logo-company-1.png` - Client/partner logo (200x80px)
- `logo-company-2.png` - Client/partner logo (200x80px)
- `logo-company-3.png` - Client/partner logo (200x80px)

### Illustrations
- `illustration-onboarding.svg` - Onboarding flow illustration
- `illustration-success.svg` - Success state illustration
- `illustration-empty-state.svg` - Empty state illustration

## Temporary Placeholders

For now, using:
- Placeholder.com for images
- Unsplash for photos
- Heroicons for icons

## Format Guidelines

- **Photos:** JPG (optimized, < 200KB)
- **Illustrations:** SVG (preferred) or PNG with transparency
- **Logos:** SVG (preferred) or PNG with transparency
- **Icons:** SVG only

## Optimization

Before replacing, optimize all images:
```bash
# Install tools
npm install -g sharp-cli svgo

# Optimize JPG/PNG
sharp -i input.jpg -o output.jpg --quality 85

# Optimize SVG
svgo input.svg -o output.svg
```
