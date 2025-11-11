# Performance Improvement Plan - v1

**Date**: 2025-11-10
**Status**: Analysis Complete - Ready for Implementation

---

## Executive Summary

The Frutero App currently experiences **slow compilation times (~15s)** and **poor runtime loading performance**. After analysis, we've identified **critical TanStack Query misconfigurations** and **missing Next.js optimizations** as the primary bottlenecks.

**Expected Impact**: 40-80% faster page loads, 50% faster compilation with proper caching.

---

## Current Performance Issues

### Compilation Speed
- **Current**: ~15 seconds per build
- **Root Causes**: No build cache optimization, large bundle size (103 kB shared JS), multiple font processing

### Runtime Loading
- **Issues**: Sequential data fetching, cache not preserved, no prefetching, most pages missing caching

---

## Critical Issues

### 1. QueryClient Recreation Bug =4 CRITICAL

**Location**: `/src/providers/auth/privy-provider.tsx:15`

**Problem**:
```typescript
function PrivyProviderComponent({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient() // L CREATED ON EVERY RENDER
  // ...
}
```

**Impact**: ALL CACHE LOST on every provider re-render

**Solution**:
```typescript
function PrivyProviderComponent({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))
  // ...
}
```

### 2. Missing Global Query Defaults =4 CRITICAL

**Current**: Only 6 of 37 pages have caching configured
**Impact**: 31 pages refetch on every mount
**Solution**: Set global defaults in QueryClient (see above)

### 3. No Prefetching Strategy =á HIGH

**Current**: Pages wait for data before rendering
**Solution**: Prefetch dashboard stats and user settings on auth

### 4. No Route Segment Config =á MEDIUM

**Current**: Static pages treated as dynamic
**Solution**: Add `export const dynamic = 'force-static'` and `revalidate` to static pages

### 5. Font Loading Not Optimized =â LOW-MEDIUM

**Current**: 4 fonts loaded on every page, all marked critical
**Solution**: Use `display: 'optional'` for non-critical fonts

---

## Implementation Plan

### Phase 1: TanStack Query (HIGH IMPACT - DO FIRST)
**Time**: 2-3 hours | **Impact**: 60-80% faster navigation

1. Fix QueryClient singleton (30 min)
2. Add prefetching for critical routes (1 hr)
3. Add optimistic updates (1 hr)
4. Configure retry strategy (30 min)

### Phase 2: Next.js Config (MEDIUM IMPACT)
**Time**: 2-3 hours | **Impact**: 30-40% faster page loads

1. Add route segment config (1 hr)
2. Optimize font loading (30 min)
3. Configure build cache (30 min)
4. Add parallel route loading (1 hr)

### Phase 3: Bundle Optimization (MEDIUM IMPACT)
**Time**: 3-4 hours | **Impact**: 20-30% smaller bundle

1. Dynamic import heavy components (2 hrs)
2. Optimize dependency imports (1 hr)
3. Add bundle analyzer (30 min)
4. Implement tree shaking (30 min)

---

## Expected Results

| Metric | Before | After Phase 1 | After Phase 2 | After Phase 3 |
|--------|--------|---------------|---------------|---------------|
| Compilation | 15s | 15s | 8-10s | 7-9s |
| Initial Load | 3-5s | 2-3s | 1.5-2s | 1-1.5s |
| Navigation | 1-3s | 0.3-0.5s | 0.2-0.3s | 0.1-0.2s |
| Bundle Size | 103 kB | 103 kB | 95-100 kB | 80-90 kB |

---

## TanStack Query Best Practices

**Q: "Does TanStack Query provide good ways to handle this?"**
**A: YES - When configured properly.**

### Key Features

1. **Automatic Caching** (MOST IMPORTANT)
```typescript
const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: getProjects,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
})
```

2. **Prefetching**
```typescript
queryClient.prefetchQuery({
  queryKey: ['project', slug],
  queryFn: () => getProject(slug),
})
```

3. **Optimistic Updates**
```typescript
const mutation = useMutation({
  mutationFn: updateProject,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['project', slug] })
    const previous = queryClient.getQueryData(['project', slug])
    queryClient.setQueryData(['project', slug], newData)
    return { previous }
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['project', slug], context.previous)
  },
})
```

4. **Parallel Queries** (Already Implemented)
```typescript
// All fetch simultaneously
const { data: project } = useQuery({ queryKey: ['project'], queryFn: getProject })
const { data: members } = useQuery({ queryKey: ['members'], queryFn: getMembers })
const { data: quests } = useQuery({ queryKey: ['quests'], queryFn: getQuests })
```

---

## Implementation Checklist

### Phase 1: TanStack Query
- [ ] Fix QueryClient singleton in privy-provider
- [ ] Add global query defaults
- [ ] Implement prefetching for dashboard/auth
- [ ] Add optimistic updates for mutations
- [ ] Configure retry strategy
- [ ] Test cache persistence

### Phase 2: Next.js Config
- [ ] Add route segment config to static pages
- [ ] Optimize font loading
- [ ] Configure build cache
- [ ] Implement parallel route loading
- [ ] Add loading.tsx for streaming

### Phase 3: Bundle Optimization
- [ ] Dynamic import admin components
- [ ] Dynamic import onboarding wizard
- [ ] Optimize dependency imports
- [ ] Add bundle analyzer
- [ ] Implement tree shaking

---

## Success Metrics

- [ ] Compilation time reduced by 50%
- [ ] Initial page load reduced by 60%
- [ ] Navigation speed reduced by 80%
- [ ] Bundle size reduced by 20%
- [ ] 90%+ cache hit rate for repeated visits
- [ ] All pages have caching configured

---

## Risk Mitigation

1. **QueryClient Refactor**: Test all pages thoroughly
2. **Static Generation**: Use ISR with appropriate revalidation
3. **Dynamic Imports**: Provide loading fallbacks with proper dimensions
4. **Over-Aggressive Caching**: Use appropriate staleTime per route type

---

## Conclusion

The most critical issue is the **QueryClient recreation bug**, which defeats TanStack Query's caching entirely. Once fixed with proper configuration and Next.js optimizations, we can expect **dramatic improvements** (60-80% faster).

**TanStack Query is an excellent choice** when properly configured.
