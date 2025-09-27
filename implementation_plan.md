# Implementation Plan

The overall goal is to improve the production site at https://limitlessinfotech.com by fixing resource loading errors, implementing pending admin features like audit logs and exports, enhancing performance and security, and completing code quality tasks to ensure reliability, better UX, and maintainability.

This implementation addresses live site issues (404 errors for missing assets, unresolved external resources) and pending TODOs from ADMIN_IMPROVEMENTS_TODO.md and CODE_QUALITY_IMPROVEMENTS_TODO.md. The site is a mature Next.js application with Supabase backend, professional UI components, and admin panel. Improvements fit by building on existing structures: adding DB integration for audit logs, optimizing assets/configs, enhancing admin routes/components, and adding tests/security without disrupting current functionality. This is needed for production stability, SEO/performance gains, and feature completeness to support business operations like lead management and content versioning.

[Types]  
Type system changes will extend existing interfaces for audit logs, exports, and security metrics, ensuring strict TypeScript compliance.

- Extend AuditLogEntry interface in src/lib/auditLogger.ts: Add fields like `sessionId?: string;`, `location?: { lat: number; lng: number; };`, with validation using Zod schema: `z.object({ action: z.string().min(1), entity: z.string(), ... })`.
- New interface AuditLogQuery in src/types/index.ts: `{ filters: { action?: string; entity?: string; dateFrom?: Date; dateTo?: Date; }; pagination: { page: number; limit: number; }; sort: { field: string; direction: 'asc' | 'desc'; }; }`.
- New enum ExportFormat in src/types/index.ts: `'csv' | 'pdf' | 'json'`.
- Extend LeadData and TestimonialData interfaces: Add `selected: boolean` for bulk actions.
- New interface SecurityMetric in src/lib/enhancedAnalytics.ts: `{ threatLevel: 'low' | 'medium' | 'high'; loginAttempts: number; suspiciousIPs: string[]; timestamp: Date; }`.
- Relationships: Audit logs reference profiles.id and auth.users.id; exports link to leads/testimonials/projects via foreign keys.

[Files]
File modifications will create new admin routes/files for features, update configs for optimizations, add DB migration for audit_logs, and refactor components for reusability.

- New files to be created:
  - app/admin/audit/page.tsx: Dashboard for viewing/filtering audit logs, with search, pagination, and export options.
  - app/admin/audit/layout.tsx: Layout for audit section with Breadcrumb and Sidebar integration.
  - app/admin/settings/page.tsx: Admin settings page for theme/notifications/preferences, using user_preferences table.
  - app/admin/security/page.tsx: Security dashboard showing login attempts, threats, rate limiting stats.
  - src/components/admin/AuditLogTable.tsx: Reusable table for audit logs with filtering/sorting using @tanstack/react-table.
  - src/components/admin/BulkActions.tsx: Generic bulk actions component for selects/delete/export in lists (testimonials, leads, projects).
  - src/components/admin/ExportModal.tsx: Modal for CSV/PDF exports using jspaparse and jsPDF.
  - supabase/migrations/202412_add_audit_logs.sql: Migration to create audit_logs table matching AuditLogEntry.
  - src/lib/exportUtils.ts: Utilities for generating CSV/PDF from data arrays.
  - tests/admin/AuditLogs.test.tsx: Unit tests for audit logging and dashboard.
  - public/favicon.ico: Add missing favicon to fix 404s.
  - public/images/logo.png: Add site logo placeholder.
  - public/images/team-placeholder.jpg: Generic team image to prevent 404s in team sections.

- Existing files to be modified:
  - next.config.mjs: Add image remotePatterns for more domains (e.g., 'cdn.unsplash.com'), enable SWC minify, add trailingSlash: false for SEO, update CSP to allow more connect-src for Supabase.
  - src/lib/auditLogger.ts: Implement DB insertion using Supabase client in processQueue(), remove TODO comment, add batch insert with error retry.
  - app/admin/testimonials/page.tsx: Add bulk actions checkbox column to list, integrate BulkActions component, add export button triggering /api/testimonials/export.
  - app/admin/leads/page.tsx: Similar bulk actions and export for leads.
  - app/admin/projects/page.tsx: Add bulk publish/unpublish and export.
  - src/components/admin/AdvancedDashboard.tsx: Add audit logs summary card, security metrics section, integrate real health data from /api/health.
  - src/components/admin/AdminSidebar.tsx: Add links to /admin/audit, /admin/settings, /admin/security.
  - middleware.ts: Add rate limiting using express-rate-limit for /api/* routes (e.g., 100 req/15min per IP).
  - app/layout.tsx: Add global error logging to ErrorBoundary, preload key fonts/images.
  - package.json: Add dev deps: '@playwright/test' for E2E, 'papaparse' for CSV (already has jspdf, zod).
  - tailwind.config.js: Add accessibility colors (e.g., high-contrast variants).
  - supabase/migrations/20250922163825_consolidated_schema.sql: Add indexes on audit_logs (action, timestamp, user_id) post-migration.

- Files to be deleted or moved: None.

- Configuration file updates: tsconfig.json (already strict, add paths for new components); jest.config.cjs (add testEnvironmentOptions for E2E); .env.local (add SUPABASE_AUDIT_ENABLED=true).

[Functions]
Function modifications will add DB integration to logging, export handlers in APIs, and utility functions for bulk operations.

- New functions:
  - createAuditLogEntry(entry: AuditLogEntry): Promise<void> in src/lib/auditLogger.ts – Inserts to Supabase audit_logs, handles batching.
  - getAuditLogs(query: AuditLogQuery): Promise<AuditLogEntry[]> in src/lib/auditLogger.ts – Fetches with filters/pagination using Supabase RPC.
  - exportToCSV(data: any[], format: ExportFormat, filename: string): Promise<Blob> in src/lib/exportUtils.ts – Uses papaparse to generate CSV.
  - exportToPDF(data: any[], title: string): Promise<Blob> in src/lib/exportUtils.ts – Uses jsPDF for table-based PDF.
  - handleBulkAction(type: 'delete' | 'approve' | 'publish', ids: string[], entity: string): Promise<void> in src/lib/adminUtils.ts (new file) – Batch updates via Supabase.
  - getSecurityMetrics(): Promise<SecurityMetric[]> in src/lib/enhancedAnalytics.ts – Queries error_logs/api_logs for threats.

- Modified functions:
  - processQueue() in src/lib/auditLogger.ts (current file: src/lib/auditLogger.ts): Replace console.log with Supabase insert, add error handling/retry, integrate getClientIP() with Next.js headers.
  - fetchDashboardData() in src/components/admin/AdvancedDashboard.tsx (current file: src/components/admin/AdvancedDashboard.tsx): Add fetch('/api/audit/recent') for activity, fetch('/api/security/metrics') for health, replace mockHealthMetrics.
  - logAdminAction() in src/lib/auditLogger.ts: Add automatic userId from session.

- Removed functions: None.

[Classes]
No major class modifications, as the codebase uses functional components and hooks; focus on hooks/utils.

- New classes: None (use functional patterns consistent with codebase).
- Modified classes: AuditLogger class in src/lib/auditLogger.ts – Add private supabase client init, update constructor for production mode.
- Removed classes: None.

[Dependencies]
Dependency modifications will add libraries for exports, testing, and accessibility without major version changes.

- New packages: 'papaparse@^5.4.1' for CSV exports, '@axe-core/react@^4.9.1' for accessibility testing, '@playwright/test@^1.47.0' for E2E tests.
- Version changes: Update 'next' to '^15.5.3' (already latest), 'supabase/supabase-js' to '^2.57.4' (current).
- Integration requirements: Install via npm, add to package.json, configure Playwright in jest.config.cjs for E2E, import axe in test setup (jest.setup.js).

[Testing]
Testing approach will add unit tests for new utils, integration for admin workflows, and E2E for key journeys, targeting 80% coverage.

- Test file requirements: New __tests__/lib/auditLogger.test.ts for log functions (mock Supabase), __tests__/components/admin/BulkActions.test.tsx using RTL, e2e/admin.spec.ts for dashboard navigation/exports using Playwright.
- Existing test modifications: Update jest.config.cjs to include E2E setup, add coverage for modified fetchDashboardData() in AdvancedDashboard.test.tsx.
- Validation strategies: Run 'npm test -- --coverage', manual Lighthouse audits post-build, axe accessibility scans in E2E.

[Implementation Order]
The implementation sequence prioritizes fixes (errors/assets) first, then DB/backend (audit logs), frontend features (admin), and finally testing/optimizations to ensure incremental deploys without breakage.

1. Fix production errors: Update next.config.mjs for images/CSP, add missing public/ assets (favicon, placeholders), verify with browser_action launch.
2. Implement audit logs: Create migration for audit_logs table, update src/lib/auditLogger.ts for DB integration, seed initial data via scripts/seed-admin-user.ts.
3. Add admin features: Create new routes/components (audit/settings/security), integrate bulk actions/exports in testimonials/leads/projects pages.
4. Enhance performance/security: Update middleware.ts for rate limiting, add caching to app/api/* routes, optimize bundle in next.config.mjs.
5. Refactor code quality: Cleanup unused imports in open tabs (AdvancedDashboard.tsx, etc.), add error boundaries, run ESLint.
6. Add analytics/monitoring: Extend src/lib/enhancedAnalytics.ts, update dashboard for SEO/vitals.
7. Testing and verification: Add tests, run build/start, browser_action to confirm no errors, update TODO MDs.
8. Documentation: Create admin guide MD, finalize with attempt_completion.
