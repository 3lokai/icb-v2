# ImageKit Setup Guide - Indian Coffee Beans

## Overview
Zero-dependency ImageKit integration for the Indian Coffee Beans project. No npm packages, just pure TypeScript utilities for optimized image delivery.

## Environment Setup

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/indiancoffeebeans
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_dcZ5BGHmN/GP6KTh6WBSvvK9
IMAGEKIT_PRIVATE_KEY=private_Rtz8****************** # Server-only, never expose
```

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/indiancoffeebeans/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // For fallback images
      }
    ]
  }
}

module.exports = nextConfig
```

## ImageKit Dashboard Settings

### Optimization Tab ✅
- **Use best format for Image Delivery**: ON
- **Optimize image quality before delivery**: ON
- **Default Quality**: 80
- **Use correct rotation from image metadata**: ON
- **Use 4:2:0 chroma subsampling**: ON
- **Preserve image metadata**: Discard all metadata
- **PNG compression mode**: Maximum

### Security Tab ✅
- **Restrict unsigned image URLs**: Restrict all requests
- **Restrict unnamed image transformations**: OFF

### Device Based Tab ✅
- **Restrict image size based on user's device**: OFF

## Code Implementation

### Core ImageKit Utility
Location: `src/lib/imagekit/index.ts`

Key functions:
- `getImageKitUrl()` - Core URL builder with transformations
- `coffeeImagePresets` - Component-specific presets
- `generateBlurPlaceholder()` - UX enhancement
- `getPlaceholderImage()` - Fallback images

### Component-Specific Presets

#### CoffeeCard Component
- **Size**: 400x192px (h-48 in Tailwind)
- **Crop**: Force
- **Quality**: 80
- **Usage**: Grid listings, search results

#### RoasterCard Component  
- **Size**: 400x160px (h-40 in Tailwind)
- **Crop**: Maintain ratio (don't distort logos)
- **Quality**: 85
- **Usage**: Roaster directory listings

#### RegionCard Component
- **Size**: 400x300px (aspect-[4/3])
- **Crop**: Force
- **Quality**: 82
- **Usage**: Region exploration pages

#### Hero Backgrounds
- **Size**: 1920x800px
- **Crop**: Force, center focus
- **Quality**: 85
- **Progressive**: Enabled
- **Usage**: Homepage hero, directory headers

#### Blog Cards
- **Size**: 400x225px (16:9 aspect)
- **Crop**: Force
- **Quality**: 78
- **Usage**: Blog post listings

#### Mobile Optimizations
Scaled-down versions of all presets for mobile devices.

## Usage Examples

### In Components
```typescript
import { coffeeImagePresets } from '@/lib/imagekit'

// CoffeeCard component
<Image 
  src={coffeeImagePresets.coffeeCard(coffee.image_url || '')} 
  alt={coffee.name}
  fill
  className="object-cover"
/>

// With blur placeholder
<Image 
  src={coffeeImagePresets.coffeeCard(coffee.image_url || '')}
  placeholder="blur"
  blurDataURL={generateBlurPlaceholder(coffee.image_url || '')}
  alt={coffee.name}
  fill
/>
```

### Direct URL Generation
```typescript
// Custom transformations
const customUrl = getImageKitUrl('my-coffee.jpg', {
  width: 600,
  height: 400,
  crop: 'force',
  quality: 90,
  format: 'webp'
})
```

## Security Model

### Public Images (Coffee/Roaster/Region content)
- ✅ Use unsigned URLs via presets
- ✅ Publicly accessible for SEO
- ✅ No expiration needed
- ✅ Transformation restrictions via dashboard

### User Avatars (Future)
- 🔄 Will use Supabase Storage instead
- 🔄 Auth-protected via RLS policies
- 🔄 Simpler security model

## Key Benefits

### Performance
- 🚀 **Zero npm dependencies** - No bundle bloat
- 🚀 **Auto format optimization** - WebP/AVIF served automatically
- 🚀 **Progressive loading** - Better UX for large images
- 🚀 **Global CDN** - Fast delivery worldwide

### Developer Experience
- 🛠️ **TypeScript support** - Full type safety
- 🛠️ **Component-specific presets** - Consistent sizing
- 🛠️ **Blur placeholders** - Enhanced loading states
- 🛠️ **Fallback handling** - Graceful degradation

### Security
- 🔒 **Restricted transformations** - Prevents URL tampering
- 🔒 **API key separation** - Client vs server keys
- 🔒 **Origin restrictions** - Domain-locked access

## Troubleshooting

### Common Issues

**Images not loading:**
- Check `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` is set
- Verify image exists in ImageKit media library
- Check browser network tab for 401/403 errors

**Poor image quality:**
- Increase quality parameter in presets
- Check original image resolution
- Verify format optimization settings

**Slow loading:**
- Enable progressive JPEG in dashboard
- Use appropriate preset sizes
- Implement blur placeholders

### Debug Helpers
```typescript
// Check if ImageKit is configured
console.log('ImageKit configured:', isImageKitConfigured())

// Test URL generation
console.log('Generated URL:', coffeeImagePresets.coffeeCard('test.jpg'))
```

## Future Enhancements

### Potential Additions
- [ ] Named transformations in dashboard (cleaner URLs)
- [ ] Additional presets for new components
- [ ] Responsive image srcSet generation
- [ ] Performance monitoring integration

### Not Planned
- ❌ SDK installation (keeping zero-dependency)
- ❌ Signed URLs for public content (unnecessary complexity)
- ❌ User avatar handling (using Supabase Storage instead)

## File Locations

```
src/lib/imagekit/
├── index.ts              # Main ImageKit utilities
└── (future loader.js)    # Custom Next.js loader if needed

Environment:
├── .env.local           # Development environment variables
└── .env.production      # Production environment variables

Configuration:
└── next.config.js       # Next.js image domain configuration
```

---

**Status**: ✅ Production Ready  
**Last Updated**: May 2025  
**Dependencies**: Zero  
**Bundle Impact**: Minimal (~2KB gzipped)