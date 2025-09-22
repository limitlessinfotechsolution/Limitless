# Complete Supabase Migration Steps

## Prerequisites
1. Supabase CLI installed (already done)
2. Supabase project created in the Supabase Dashboard
3. Your Supabase Project Reference ID (found in your Supabase project dashboard)

## Migration Steps

### Step 1: Link Your Project
Replace `YOUR_PROJECT_REF` with your actual Supabase project reference:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 2: Apply the Migration
Push the database schema to your Supabase project:
```bash
supabase db push
```

### Step 3: Generate TypeScript Types
Generate TypeScript types for your frontend:
```bash
npx supabase gen types typescript --project-id "YOUR_PROJECT_REF" > src/types/supabase.ts
```

### Alternative Method: Direct SQL Execution
If you prefer to execute the SQL directly:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `supabase_consolidated_schema_for_migration.sql`
4. Paste and run in the SQL editor

## Post-Migration Checklist

- [ ] Verify all tables were created
- [ ] Check that RLS policies are enabled
- [ ] Test database connections from your application
- [ ] Update your environment variables with Supabase credentials
- [ ] Test authentication flows
- [ ] Verify AI chatbot functionality if applicable

## Troubleshooting

If you encounter any issues:
1. Check that all Supabase extensions are enabled (uuid-ossp, pgvector)
2. Ensure your database user has the necessary permissions
3. Verify that the schema matches your application expectations

## Next Steps

1. Set up authentication providers in your Supabase dashboard
2. Configure storage buckets if needed
3. Set up any required Supabase functions
4. Test your complete application flow