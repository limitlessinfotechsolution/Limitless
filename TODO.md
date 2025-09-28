# Fix Linter Errors

## Files to Edit
- [x] app/portfolio/[id]/metadata.ts: Handle Json types safely (description, industry, service_type)
- [x] src/components/PerformanceMonitor.tsx: Fix condition always true, replace 'any' types
- [x] app/about/team/page.tsx: Remove unused React import
- [x] app/portfolio/[id]/page.tsx: Remove unused React import, fix fast refresh by moving generateMetadata export
- [x] app/privacy/page.tsx: Fix fast refresh by removing metadata export
- [x] app/terms/page.tsx: Fix fast refresh by removing metadata export
- [x] tsconfig.json: Changed moduleResolution to bundler to fix deprecation warning

- [x] src/components/ui/Button.tsx: Fix fast refresh by moving buttonVariants
- [x] src/components/ui/Pagination.tsx: Update buttonVariants import

## Plan
1. Fix metadata.ts: Cast Json to string with null checks
2. Fix PerformanceMonitor: Remove window.fetch check, type entries properly
3. Remove React imports where unused
4. For fast refresh: Move metadata exports to separate files or inline
