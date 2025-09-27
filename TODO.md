# ESLint Fixes TODO

- [x] Update eslint.config.js to handle .cjs files (exclude from no-require-imports)
- [x] Fix scripts/generate-knowledge-base.ts: remove unused imports, convert to ES modules, prefix unused params
- [x] Fix supabase/functions/knowledge-upload/index.ts: rename error param to _error
- [x] Fix app/admin/testimonials/[id]/edit/page.tsx: add missing dependency in useEffect
- [x] Fix app/layout.tsx: move non-component export to separate file
- [x] Fix src/components/PerformanceMonitor.tsx: move non-component exports
- [x] Fix src/components/testimonials/IndustryServiceFilters.tsx: add missing dependency
- [x] Fix src/components/ui/BreadcrumbNavigation.tsx: move non-component export
- [x] Fix src/components/ui/DataGrid.tsx: add missing dependency
- [x] Run lint to verify all fixes
