# Supabase Database Setup

This folder contains database migrations and setup instructions for GoalFlow.

## Quick Setup Steps

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Project Name**: goalflow
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect to start

### 2. Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Configure Environment Variables

1. In your GoalFlow project root, create `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### 5. (Optional) Add Seed Data

1. First, sign up for an account in your app (we'll build this next)
2. In Supabase dashboard, go to **SQL Editor**
3. Run this query to get your user ID:
   ```sql
   SELECT id FROM auth.users WHERE email = 'your-email@example.com';
   ```
4. Copy your user ID (a UUID like `550e8400-e29b-41d4-a716-446655440000`)
5. Open `migrations/002_seed_data.sql`
6. Uncomment the code and replace `'YOUR_USER_ID'` with your actual UUID
7. Copy the whole thing and run it in SQL Editor

## Database Schema

### Tables

- **goals** - User goals (e.g., "Learn Python in 30 days")
- **milestones** - Breaking goals into phases
- **tasks** - Daily tasks with guides, videos, quizzes
- **resources** - Curated learning resources per task
- **progress** - User completion tracking with quiz results

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce user isolation

## Troubleshooting

### "relation does not exist" error
- Make sure you ran `001_initial_schema.sql` first

### "permission denied" error
- RLS policies are working! Make sure you're authenticated

### Can't see data
- Check you're logged in
- Verify the data belongs to your user ID

## Next Steps

After database setup:
1. Build authentication pages (login/signup) ✅ Coming next!
2. Replace mock data with Supabase queries
3. Test the app with real database

## Useful Supabase Docs

- [Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/sql-editor)
