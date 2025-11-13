#!/usr/bin/env node

/**
 * Run migration 002 - Enhance tasks content
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://hrfixgyookljdbrunmxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyZml4Z3lvb2tsamRicnVubXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODAxNDEsImV4cCI6MjA3ODQ1NjE0MX0.BkjRCDG14DB1N35rNhFXjluWiGEGFb4fF9SWirjMapA';

console.log('🚀 Running migration 003_enhance_tasks_content.sql...\n');

// Read migration SQL
const migrationPath = join(__dirname, '../supabase/migrations/003_enhance_tasks_content.sql');
const sqlContent = readFileSync(migrationPath, 'utf8');

console.log(`📄 Migration SQL:\n${sqlContent}\n`);

console.log('❌ Cannot execute SQL directly with anon key.\n');
console.log('📋 Please run the migration manually in Supabase Dashboard:\n');
console.log('1. Go to: https://app.supabase.com/project/hrfixgyookljdbrunmxz/sql/new');
console.log('2. Copy and paste the SQL above');
console.log('3. Click "Run" (or press Ctrl/Cmd + Enter)\n');
console.log('Or copy from: supabase/migrations/003_enhance_tasks_content.sql\n');

process.exit(1);
