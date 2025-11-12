/**
 * Database Migration Script
 * Runs the initial schema migration to create all tables
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Please ensure .env.local has:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🚀 Starting database migration...\n');
console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read migration SQL
const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
const sql = readFileSync(migrationPath, 'utf8');

console.log(`📄 Loaded migration file (${sql.length} characters)\n`);
console.log('⚠️  Note: Supabase client cannot execute raw SQL directly.');
console.log('   The migration must be run manually in the Supabase Dashboard.\n');
console.log('📋 Instructions:\n');
console.log('1. Go to: https://app.supabase.com');
console.log('2. Select your project');
console.log('3. Click "SQL Editor" in the left sidebar');
console.log('4. Click "New Query"');
console.log('5. Copy and paste this entire SQL:\n');
console.log('─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
console.log('\n6. Click "Run" (or press Ctrl+Enter)\n');
console.log('✨ After running, your database will be ready!\n');
