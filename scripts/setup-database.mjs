#!/usr/bin/env node

/**
 * Database Setup Script
 * Checks database status and provides migration instructions
 */

import { createClient } from '@supabase/supabase-js';

// Get credentials from command line args or environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials!\n');
  console.error('Please ensure your .env.local file contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n');
  process.exit(1);
}

console.log('\n🔍 Checking database status...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

// Try to query the goals table
const { data, error } = await supabase.from('goals').select('count').limit(1);

if (error) {
  if (error.message.includes('relation "public.goals" does not exist') ||
      error.message.includes('Could not find the table')) {
    console.log('❌ Database tables not found!\n');
    console.log('📋 To set up your database, follow these steps:\n');
    console.log('1. Open your browser and go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "+ New query"');
    console.log('5. Copy the entire contents of: ./supabase/migrations/001_initial_schema.sql');
    console.log('6. Paste into the SQL editor');
    console.log('7. Click "Run" (or press Ctrl/Cmd + Enter)\n');
    console.log('✅ After running the migration, you can create goals in your app!\n');
    console.log('💡 The SQL file is located at: supabase/migrations/001_initial_schema.sql\n');
  } else {
    console.error('❌ Database error:', error.message, '\n');
  }
  process.exit(1);
} else {
  console.log('✅ Database is set up correctly!');
  console.log('   Tables exist and are accessible.\n');
  console.log('🎉 You can now create goals in your app!\n');
}
