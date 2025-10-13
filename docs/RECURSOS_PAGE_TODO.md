# Recursos Page - Implementation Plan

## Overview
Create a comprehensive `/recursos` page that contains all the detailed information about the Verano En Cadena program that was removed from the main programa page.

## Content to Migrate

### 1. Detailed Curriculum (from verano-curriculum.tsx)
- Full 21-day breakdown
- Daily schedule and topics
- Technologies taught each week
- Project milestones
- Time commitments

### 2. Tools Gallery (from verano-features-framework.tsx)
- **AI Tools**: Cursor IDE, Claude Pro, Claude Code
- **Development**: Vercel, Supabase, Google Stitch
- **Blockchain**: Base Network, MiniKit, OnchainKit, Coinbase Dev Platform, Neynar, Farcaster
- Show which tools have free tiers available
- Total value proposition

### 3. Impact Player System (from verano-features-framework.tsx)
- 3-phase methodology visualization
- Certification requirements
- Skills validation process
- Career outcomes

### 4. Competitive Comparison (from verano-features-framework.tsx)
- Verano vs Bootcamps vs Online Courses vs Self-learning
- Feature comparison matrix
- Time to results
- Cost comparison

### 5. Additional Resources to Create
- Downloadable program brochure (PDF)
- FAQ section
- Application guide
- Success stories/case studies
- Reading list and prerequisites

## Page Structure Suggestion

```
/recursos
├── Hero Section (simple)
├── Navigation/Tabs
│   ├── Curriculum
│   ├── Herramientas (Tools)
│   ├── Metodología
│   ├── Comparación
│   └── Descargas
├── Content Sections (based on active tab)
└── CTA to apply

```

## Design Principles
- Information-focused, not sales-focused
- Easy navigation between sections
- Mobile-friendly tabs or accordion
- Search/filter functionality for resources
- Consistent with existing site design

## Implementation Priority
1. Create basic page structure
2. Migrate existing components
3. Add navigation system
4. Create new download resources
5. Add FAQ section
6. Optimize for SEO