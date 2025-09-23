# Implementation Plan

## Overview
Reorganize the project file structure to improve maintainability, reduce root directory clutter, and establish a cleaner, more professional codebase organization.

The current root directory contains an excessive number of files including multiple SQL schema files, documentation files, build artifacts, and temporary files, making navigation and maintenance difficult. This reorganization will create logical subdirectories for different file types, consolidate related files, remove duplicate and obsolete files, and ensure consistent naming conventions. The restructured layout will follow Next.js best practices and improve developer experience by making the codebase easier to navigate and maintain.

## Types
No type system changes required for this file structure reorganization.

## Files
Reorganize existing files into logical directories, remove duplicates, and clean up obsolete files.

### New directories to be created:
- `docs/` - Centralized location for all project documentation files
- `db/schemas/` - Database schema files and migration scripts
- `build/coverage/` - Test coverage reports and build artifacts

### Files to be moved:
- Move all `.md` files from root directory to `docs/` (ALIGNMENT_IMPROVEMENTS.md, BUILD_STATUS.md, DEVELOPMENT.md, FIXED_PARTICLES_IMPROVEMENTS.md, PRODUCTION_BUILD_SUMMARY.md, PROJECT_REPORT.md, PROJECT_SUMMARY_CONSOLIDATED.md, PROJECT_SUMMARY.md, README.md, SUPABASE_MIGRATION_GUIDE.md, SUPABASE_MIGRATION_STEPS.md, TODO.md, UPDATED_TODO.md, VIRTUAL_TOUR_IMPROVEMENTS.md)
- Move all loose `.sql` files from root directory to `db/schemas/` (complete_supabase_setup_enhanced.sql, complete_supabase_setup_production.sql, supabase_complete_schema.sql, supabase_consolidated_schema_for_migration.sql, supabase_final_schema.sql, supabase_production_setup_complete.sql, supabase_production_setup.sql, supabase_schema_complete_final.sql, supabase_schema_complete.sql, supabase_schema_consolidated_backup.sql, supabase_schema_consolidated.sql, supabase_schema_final.sql, supabase_schema_remaining.sql)
- Move `coverage/` directory to `build/coverage/`

### Files to be deleted:
- `ersFAISALDownloadsLimitlessInfotech` - Temporary/unnecessary file
- `supabase.tar.gz` - Archive file no longer needed
- `app/admin/layout-fixed.tsx` - Obsolete admin layout file
- `app/admin/dashboard/page-fixed.tsx` - Obsolete dashboard page
- `src/components/admin/Dashboard-fixed.tsx` - Obsolete dashboard component
- `src/components/admin/AdminSidebar-fixed.tsx` - Obsolete sidebar component
- `app/api/chat/route-custom.ts` - Duplicate API route
- `app/api/chat/route-new.ts` - Duplicate API route
- Duplicate SQL files in `db/schemas/` (keep `supabase_schema_complete_final.sql` and `supabase_production_setup_complete.sql`, remove others)

### Files to be modified:
- Update import statements in `app/admin/layout.tsx` to reference correct component paths if AdminSidebar is renamed
- Update any hardcoded file paths in configuration files that reference moved files
- Update `README.md` (moved to `docs/README.md`) to reflect new file locations

## Functions
No function modifications required for this file reorganization.

## Classes
No class modifications required for this file reorganization.

## Dependencies
No dependency modifications required for this file reorganization.

## Testing
No testing changes required for this file reorganization, but verify that the build process still works after file moves.

## Implementation Order
1. Create new directory structure (`docs/`, `db/schemas/`, `build/`)
2. Move documentation files from root to `docs/`
3. Move SQL schema files from root to `db/schemas/`
4. Move coverage directory to `build/coverage/`
5. Remove identified duplicate and obsolete files
6. Update any import statements or configuration references affected by file moves
7. Run build and test suite to ensure no broken references
8. Update project documentation to reflect new structure
