# Supabase Database Migration Guide

## Overview
This guide explains how to use the consolidated Supabase schema file for direct database migration.

## Consolidated Schema File
The file `supabase_consolidated_schema_for_migration.sql` contains the complete database schema including:
- All table definitions
- Custom enum types
- Indexes and constraints
- Row Level Security (RLS) policies
- Functions and triggers
- Extensions

## Migration Process

### 1. Prerequisites
- Supabase project
- Supabase CLI installed
- Database connection credentials

### 2. Direct Migration Steps
1. Open your Supabase project dashboard
2. Navigate to the SQL editor
3. Copy the contents of `supabase_consolidated_schema_for_migration.sql`
4. Paste and execute in the SQL editor
5. Verify all tables and policies are created successfully

### 3. Alternative CLI Method
```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Post-Migration Steps
1. Generate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id "your-project-ref" > src/types/supabase.ts
   ```
2. Update your environment variables
3. Test the database connection in your application

## Notes
- The `supabase/migrations` directory has been intentionally left empty
- All individual migration files have been consolidated into the single schema file
- This approach simplifies the migration process for new environments