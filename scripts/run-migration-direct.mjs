#!/usr/bin/env node

/**
 * Direct Migration Script
 * Attempts to run the migration by executing SQL statements
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://hrfixgyookljdbrunmxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZml4Z3lvb2tsamRicnVubXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODAxNDEsImV4cCI6MjA3ODQ1NjE0MX0.BkjRCDG14DB1N35rNhFXjluWiGEGFb4fF9SWirjMapA';

console.log('🚀 Starting database migration...\n');

// Read migration SQL
const migrationPath = join(__dirname, '../supabase/migrations/001_initial_schema.sql');
const sqlContent = readFileSync(migrationPath, 'utf8');

console.log(`📄 Loaded migration file (${sqlContent.length} characters)\n`);

// Try to execute via Supabase REST API
console.log('⏳ Attempting to run migration via Supabase REST API...\n');

try {
  // Use the Supabase REST API's rpc endpoint if available
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ query: sqlContent })
  });

  if (response.ok) {
    console.log('✅ Migration executed successfully!\n');
    process.exit(0);
  } else {
    const errorText = await response.text();
    console.log(`⚠️  REST API method returned ${response.status}: ${errorText}\n`);
  }
} catch (error) {
  console.log(`⚠️  REST API method failed: ${error.message}\n`);
}

// If direct execution fails, provide instructions
console.log('❌ Cannot execute SQL directly with anon key.\n');
console.log('📋 Please run the migration manually in Supabase Dashboard:\n');
console.log('1. Go to: https://app.supabase.com/project/hrfixgyookljdbrunmxz/sql/new');
console.log('2. Copy the SQL from: supabase/migrations/001_initial_schema.sql');
console.log('3. Paste into the SQL editor');
console.log('4. Click "Run" (or press Ctrl/Cmd + Enter)\n');
console.log('🔗 Direct link to SQL Editor:');
console.log('   https://app.supabase.com/project/hrfixgyookljdbrunmxz/sql/new\n');

process.exit(1);
