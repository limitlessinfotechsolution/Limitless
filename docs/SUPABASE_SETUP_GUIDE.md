# Supabase Database Setup Guide

## New Database Information
**Database URL**: https://vmrerwqzhhfbreocmyuh.supabase.co

---

## Step 1: Update Environment Variables

Update your `.env.local` file with the new Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vmrerwqzhhfbreocmyuh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Resend API (for emails)
RESEND_API_KEY=your_resend_api_key_here

# Optional: WebSocket URL (if using real-time features)
NEXT_PUBLIC_SOCKET_URL=wss://vmrerwqzhhfbreocmyuh.supabase.co/realtime/v1
```

### Where to find your Supabase keys:
1. Go to your Supabase project: https://vmrerwqzhhfbreocmyuh.supabase.co
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API" under Project Settings
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. For JWT Secret:
   - Go to "Settings" → "API"
   - Scroll down to "JWT Settings"
   - Copy the **JWT Secret** → `SUPABASE_JWT_SECRET`

---

## Step 2: Initialize Database Schema

You have a comprehensive database schema ready. Run it in your Supabase SQL Editor:

### Option A: Using Supabase Dashboard (Recommended)
1. Go to https://vmrerwqzhhfbreocmyuh.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `complete_reset_database.sql`
5. Paste into the SQL editor
6. Click "Run" or press `Ctrl+Enter`

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref vmrerwqzhhfbreocmyuh

# Run the migration
supabase db push
```

---

## Step 3: Verify Database Setup

After running the schema, verify the tables were created:

```sql
-- Run this query in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- ✅ profiles
- ✅ services
- ✅ team_members
- ✅ projects
- ✅ testimonials
- ✅ pages
- ✅ faqs
- ✅ leads
- ✅ quotations
- ✅ knowledge_base
- ✅ chat_sessions
- ✅ chat_messages
- ✅ chat_feedback
- ✅ analytics_events
- ✅ email_logs
- ✅ api_logs
- ✅ error_logs
- ✅ performance_logs
- ✅ file_uploads
- ✅ notifications
- ✅ user_preferences
- ✅ ab_tests
- ✅ ab_test_results
- ✅ subscribers
- ✅ email_campaigns

---

## Step 4: Set Up Row Level Security (RLS)

The database schema includes RLS policies. Verify they're enabled:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## Step 5: Create Initial Admin User

After setting up authentication, create your first admin user:

```sql
-- First, sign up through your app's UI
-- Then, run this to make yourself an admin:

UPDATE public.profiles 
SET role = 'super_admin'::user_role 
WHERE email = 'your-email@example.com';
```

---

## Step 6: Test the Connection

Run this command to test if your app can connect to Supabase:

```bash
npm run dev
```

Then check the browser console for any connection errors.

---

## Step 7: Seed Initial Data (Optional)

You may want to add some initial data:

### Add Sample Service
```sql
INSERT INTO public.services (title, slug, description, short_description, benefits, features, technologies, icon, link)
VALUES (
  'Web Development',
  'web-development',
  'Custom web applications built with modern technologies',
  'Build your dream web application',
  'Fast, secure, and scalable web solutions',
  '["Responsive Design", "SEO Optimized", "Fast Performance"]'::jsonb,
  '["React", "Next.js", "TypeScript"]'::jsonb,
  'Code',
  '/services/web-development'
);
```

### Add Sample Team Member
```sql
INSERT INTO public.team_members (name, slug, role, bio, image, skills)
VALUES (
  'John Doe',
  'john-doe',
  'Full Stack Developer',
  'Experienced developer with 5+ years in web development',
  '/images/team/john-doe.jpg',
  '["React", "Node.js", "TypeScript", "PostgreSQL"]'::jsonb
);
```

---

## Step 8: Configure Storage Buckets (For File Uploads)

1. Go to "Storage" in Supabase Dashboard
2. Create these buckets:
   - `public-assets` (public)
   - `project-images` (public)
   - `team-photos` (public)
   - `testimonial-images` (public)
   - `documents` (private)

### Create Bucket via SQL:
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('public-assets', 'public-assets', true),
  ('project-images', 'project-images', true),
  ('team-photos', 'team-photos', true),
  ('testimonial-images', 'testimonial-images', true),
  ('documents', 'documents', false);
```

---

## Step 9: Enable Realtime (Optional)

If you want real-time features:

```sql
-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
```

---

## Step 10: Build and Deploy

Once everything is set up:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build:prod

# Start production server
npm start
```

---

## Troubleshooting

### Connection Issues
- Verify your `.env.local` file has the correct values
- Check that the Supabase project is not paused
- Ensure your IP is not blocked in Supabase settings

### Authentication Issues
- Check JWT Secret is correct
- Verify email confirmation is set up
- Check RLS policies are not blocking access

### Build Errors
- Run `npm run lint:fix` to fix linting issues
- Clear `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

## Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run lint               # Check for errors
npm run lint:fix           # Auto-fix errors

# Production
npm run build:prod         # Build without linting
npm run build              # Build with linting
npm start                  # Start production server

# Database
supabase db reset          # Reset database
supabase db push           # Push migrations
supabase db pull           # Pull schema
```

---

## Next Steps

1. ✅ Update `.env.local` with Supabase credentials
2. ✅ Run `complete_reset_database.sql` in Supabase SQL Editor
3. ✅ Create storage buckets
4. ✅ Create your admin user
5. ✅ Test the connection with `npm run dev`
6. ✅ Build for production with `npm run build:prod`

---

## Support

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Check browser console for errors
3. Review the `docs/FINAL_SUMMARY.md` for known issues
4. Check the `docs/QUICK_ACTION_CHECKLIST.md` for troubleshooting steps

---

**Database Setup Date**: 2025-11-25
**Database URL**: https://vmrerwqzhhfbreocmyuh.supabase.co
**Status**: Ready for initialization
