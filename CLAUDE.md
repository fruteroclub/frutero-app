# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Frutero App** (internal name: "poktapok") - a Next.js 15 web application for **Frutero Club**, an elite hacker community that transforms builders into "Hackers de Alto Impacto" (High-Impact Hackers) through AI-powered talent incubation programs.

### Mission & Vision
**Transform 100+ builders annually** into hackers de alto impacto who monetize online, solve regional problems, and elevate Latin American quality of life through technology and relentless execution.

### What "Hackear" Means
- **System Transformation**: Reconfiguring existing systems to serve your vision
- **Limitation Rejection**: Creating your own rules instead of accepting constraints  
- **Obstacle Conversion**: Transforming barriers into opportunities
- **Impact Multiplication**: Using networks and technology to amplify potential

### Core Values
- **Descentralización**: Power flows freely, every hacker is autonomous
- **Transparencia**: Open source as a life philosophy
- **Balance**: Sustainable hacking requires mind/body/spirit equilibrium
- **Conocimiento Colectivo**: Shared information multiplies power
- **Crecimiento**: Personal and community evolution together

## Development Commands

### Core Commands

```bash
# Development server
# Bun (preferred runtime)
bun dev

# Production build
bun build
bun start

# Linting
bun lint
```

### Package Management

- **Primary**: Bun (configured with hash verification)

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **React**: 19.0.0 (latest)
- **Styling**: Tailwind CSS v4 with OKLCH color system
- **UI Components**: Shadcn/ui with Radix UI primitives
- **TypeScript**: Strict configuration with `@/*` path mapping - **CRITICAL: NEVER use `any` type**
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **Data Fetching**: TanStack Query (React Query) - **ALWAYS use for API calls**
- **ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas for input validation

### Component Architecture

**Organization Pattern**:

```
src/components/
├── ui/           # Shadcn base components (Button, Dialog, etc.)
├── layout/       # Layout primitives (Navbar, Footer, PageWrapper)
├── landing/      # Landing page sections (HeroSection, StatsSection, etc.)
├── programa/     # Program-specific components (prefixed with "verano-")
├── stats/        # Reusable statistical display components
└── buttons/      # Specialized button variants
```

**Key Patterns**:

- **Domain-based organization**: Components grouped by feature/page
- **Wrapper pattern**: `PageWrapper` for consistent layout with navbar/footer
- **Composition over inheritance**: Pages composed of discrete section components
- **Selective client components**: Only interactive components use `'use client'`

### Styling System

**Modern CSS Architecture**:

- **Tailwind CSS v4** with `@import "tailwindcss"`
- **Design tokens** in `globals.css` using CSS custom properties
- **OKLCH color system** for better color accuracy
- **Typography system** with custom fonts (Funnel Display, Ledger, Space Grotesk)

**Component Styling**:

- **Class Variance Authority (CVA)** for button variants
- **Tailwind Merge** utility for className conflict resolution
- **Consistent utility classes**: `.page`, `.container`, `.section`
- **Mobile-first responsive design**

### Content & Internationalization

**Language**: Primary content is in Spanish

- Component names and code are in English
- User-facing content, comments, and documentation in Spanish
- Consider Spanish conventions when working with content

### Configuration Files

**Key Configurations**:

- `tsconfig.json`: Strict TypeScript with `@/*` path mapping
- `tailwind.config.ts`: Tailwind v4 with design system tokens
- `next.config.js`: Webpack fallbacks, image optimization for IPFS/external sources
- Font configuration in `src/lib/fonts.ts`

### Development Workflow

**Code Quality**:

- ESLint + Prettier for consistent formatting
- TypeScript strict mode enabled
- Component naming: PascalCase files, kebab-case directories
- Props interfaces defined for all components

**Performance Considerations**:

- Server Components by default
- Client components only when interactivity needed
- Image optimization configured for external sources
- Selective component loading patterns

### Web3 Integration (Planned)

The project is configured for **Dynamic Wallet** integration supporting the **$PULPA Token Ecosystem**:

- Environment variable: `NEXT_PUBLIC_DYNAMIC_API_KEY`
- EVM-compatible chain support (Base L2 focus)
- Wallet connection UI ready for implementation
- **$PULPA Token Features**:
  - **Governance**: Community decision-making on resources and direction
  - **Reputation**: Tangible value connected to community contributions  
  - **Rewards**: Recognition for execution, sharing, and elevation of others
  - **Value Capture**: Amplifies value generated by community

### Common Development Tasks

**Adding New Components**:

1. Create in appropriate domain folder (`landing/`, `programa/`, etc.)
2. Use TypeScript interfaces for props
3. Follow existing naming conventions
4. Import from `@/components/` using path mapping

**Styling New Components**:

1. Use existing design tokens from `globals.css`
2. Follow mobile-first responsive patterns
3. Leverage Shadcn/ui base components
4. Use CVA for component variants when needed

**Working with Assets**:

- Images in `public/images/` organized by type
- Icons use Lucide React library
- Fonts loaded via `src/lib/fonts.ts`

## Programs & Initiatives

### "De Cero a Hacker" Methodology
**4-Phase Transformation Journey**:

1. **Learn - Foundations** (2 weeks): AI fundamentals + hacker mindset transformation
2. **Build - Ship a Product** (6 weeks): MVP development, user validation, launch  
3. **Grow - Connect & Scale** (8 weeks): Three tracks - Impact Startup, Elite Career, Strategic Freelancer
4. **Impact - Regional Elevation** (Ongoing): Mentoring next generation, solving regional challenges

### Key Programs
- **Verano En Cadena (Chain Summer)**: 3-week AI x Crypto x Culture bootcamp
- **Builder-to-Hacker Programs**: Structured pathways to impact player status
- **Weekend Build Challenges**: Time-boxed collaborative shipping exercises

## Development Philosophy & Standards

### The Frutero Standard
When building, prioritize:
- **Execution over speculation**
- **Shipping over perfection** 
- **Community over protagonism**
- **Impact over recognition**
- **User over technology**
- **Validation over intuition**
- **Metrics over opinions**

### Decision Framework for Features
Consider these factors when building:
1. **Impact potential**: Will this create measurable value?
2. **Execution feasibility**: Can this be shipped and validated quickly?
3. **Community benefit**: Does this elevate others in the ecosystem?
4. **Monetization pathway**: Is there a clear route to revenue?
5. **Regional relevance**: Does this address Latin American needs?

### Anti-Patterns to Avoid
- Pure speculation without execution plans
- Individual glory over community success
- Perfectionism that prevents shipping
- Technology for technology's sake without user focus
- Solutions seeking problems instead of problem-focused building

## Data Fetching Rules

### TanStack Query (React Query) - MANDATORY

**CRITICAL RULE**: **NEVER use `useEffect` for fetching data from APIs**. Always use TanStack Query unless explicitly stated otherwise.

**Why TanStack Query?**
- Automatic caching and background refetching
- Loading and error states handled automatically
- Request deduplication
- Optimistic updates support
- Better performance and user experience

**Examples:**

❌ **WRONG - Do NOT use useEffect:**
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/projects')
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

✅ **CORRECT - Use TanStack Query:**
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
});
```

**Mutations (POST, PATCH, DELETE):**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createProject = useMutation({
  mutationFn: async (data) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});
```

**Only exceptions:**
- Server Components (can fetch directly in async components)
- Non-API side effects (DOM manipulation, event listeners, etc.)

## API Development Standards

### Architecture Layers

**3-Layer Architecture**:
```
Frontend (Client) → Services → API Routes → Controllers → Database
```

1. **Frontend**: React components use TanStack Query
2. **Services** (`src/services/`): Frontend service layer for API calls
3. **API Routes** (`src/app/api/`): Next.js API routes (thin, delegate to controllers)
4. **Controllers** (`src/server/controllers/`): Business logic + database operations
5. **Database**: Drizzle ORM with PostgreSQL

### Directory Structure

```
src/
├── app/api/                  # API routes (Next.js)
│   ├── jam/
│   │   ├── projects/route.ts
│   │   ├── dashboard/route.ts
│   │   └── profile/route.ts
│   └── users/
│       └── [id]/route.ts
├── services/                 # Frontend service layer
│   ├── users-services.ts
│   └── projects-services.ts  # Add your services here
├── server/
│   ├── controllers/          # Backend controllers
│   │   ├── user-controller.ts
│   │   └── project-controller.ts  # Add your controllers here
│   ├── schema/               # Zod validation schemas
│   │   └── user-services-schema.ts
│   └── utils/                # Server utilities
│       └── index.ts          # AppError class
├── types/api-v1/             # Shared types
│   └── index.ts              # ServiceResponse<T>, User, etc.
└── lib/
    └── jam/                  # JAM-specific utilities
        ├── projects.ts       # Utility functions
        └── onboarding.ts
```

### TypeScript Rules - CRITICAL

**NEVER use `any` type**. Always use proper types.

❌ **WRONG**:
```typescript
function getData(): any { }  // NEVER!
const data: any = await fetch(); // NEVER!
return response as any; // NEVER!
```

✅ **CORRECT**:
```typescript
import { ServiceResponse, Project } from '@/types/api-v1';

function getData(): ServiceResponse<Project> { }
const data: Project = await fetch();
return response as ServiceResponse<Project>;
```

### API Response Format

**Use `ServiceResponse<T>` from `@/types/api-v1`**:

```typescript
export interface ServiceResponse<T> {
  data?: T | null
  success?: boolean
  error?: Error | null
  errorMsg?: string
}
```

### Frontend Services Pattern

**Location**: `src/services/{feature}-services.ts`

```typescript
import { ServiceResponse, Project } from '@/types/api-v1';
import { handleResponse } from '@/lib/utils';

export async function getProjectBySlug(
  slug: string
): Promise<ServiceResponse<Project>> {
  try {
    const response = await fetch(`/api/jam/projects/${slug}`);
    return handleResponse<Project>(response);
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Network error fetching project';
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: null,
    };
  }
}
```

### Backend Controllers Pattern

**Location**: `src/server/controllers/{feature}-controller.ts`

```typescript
import { db } from '@/db';
import { projects } from '@/db/schema';
import { AppError } from '@/server/utils';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

type Project = InferSelectModel<typeof projects>;

export class ProjectController {
  static async findBySlug(slug: string): Promise<Project> {
    try {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      return project;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error finding project:', error);
      throw new AppError('Failed to fetch project', 500);
    }
  }
}
```

### API Routes Pattern

**Keep routes thin - delegate to controllers**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ProjectController } from '@/server/controllers/project-controller';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const project = await ProjectController.findBySlug(slug);
    return NextResponse.json(project);
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
```

### Validation with Zod

**Location**: `src/server/schema/{feature}-schema.ts`

```typescript
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  category: z.string().optional(),
  stage: z.enum(['IDEA', 'PROTOTYPE', 'BUILD', 'PROJECT']).default('IDEA'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

### Error Handling

**Use `AppError` from `@/server/utils`**:

```typescript
import { AppError } from '@/server/utils';

// Throw with status code
throw new AppError('Project not found', 404);
throw new AppError('Unauthorized', 401);
throw new AppError('Validation failed', 400, { field: 'name' });
```

### Next.js 15 Async Params

**All dynamic routes use Promise params**:

```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // ... use id
}
```

## Content & Communication Guidelines

### Language Considerations
- **Primary content**: Spanish (user-facing content, comments, documentation)
- **Code**: English (component names, technical implementation)
- Use "hackear" naturally when referring to system transformation
- Emphasize execution, shipping, and tangible outcomes
- Connect technical solutions to monetization opportunities

### Key Phrases & Concepts
- **"Hackers de Alto Impacto"**: High-Impact Hackers
- **"De Cero a Hacker"**: From Zero to Hacker transformation
- **"Shipping over perfection"**: Action-oriented mindset
- **"Regional elevation"**: Impact on Latin American quality of life
- **"Relentless execution"**: Persistent, unstoppable progress

## Business Context

### Revenue Model
- **FruteroKit Subscriptions**: $29.99/month AI-powered development platform
- **Corporate Partnerships**: Talent pipeline and training
- **Success-Based Fees**: Percentage of graduate outcomes
- **Content Licensing**: Transformation methodologies

### Success Metrics
- **25 Impact Players annually** across diverse paths
- **80% Completion Rate** through relentless execution culture
- **90% Impact Placement** within 3 months post-graduation
- **Regional Elevation** with measurable local tech ecosystem improvement

### Technology Stack We Champion
- **AI/ML Systems**: ChatGPT, Claude, specialized models
- **Web3/Blockchain**: Base L2, Farcaster, smart contracts  
- **Development**: Modern full-stack, mobile-first approach
- **Community Tools**: Discord, Telegram, build-in-public platforms

## Git Commit Guidelines

### Commit Message Rules
- **Max 50 characters** 
- **Descriptive yet concise**
- **No co-authoring/signing/attributions**
- **Lowercase preferred** 
- **No periods at end**
- **Simple imperative form** (add, implement, fix, create)
- **Type already in branch name** (feat/) - don't repeat
- **Focus on changes, not type**

### Examples
```
add r2 storage to real-time transcript webhook
implement cloudflare r2 storage for mentorship logs
fix build errors
create para integration docs
```
