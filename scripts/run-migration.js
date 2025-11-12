#!/usr/bin/env node

/**
 * Run database migration
 * This script executes the SQL migration file to create all database tables
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Starting database migration...\n');

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
    process.exit(1);
  }

  console.log('✅ Found Supabase credentials');
  console.log(`   URL: ${supabaseUrl}\n`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  console.log(`📄 Reading migration file: ${migrationPath}\n`);

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: Migration file not found');
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✅ Migration file loaded (${sql.length} characters)\n`);

  // Split SQL into individual statements (simple split by semicolon)
  // Note: This is a simple approach and may not work for complex SQL
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
  console.log('⏳ Executing migration (this may take a moment)...\n');

  // Execute all statements
  try {
    // Use rpc to execute raw SQL if available, otherwise we need to use REST API
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If rpc doesn't work, try using the REST API directly
      console.log('⚠️  RPC method not available, trying direct SQL execution...\n');

      // Try to execute via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Created tables:');
    console.log('   - goals');
    console.log('   - milestones');
    console.log('   - tasks');
    console.log('   - resources');
    console.log('   - progress\n');
    console.log('🎉 Database is ready! You can now create goals in your app.\n');

  } catch (error) {
    console.error('❌ Error executing migration:', error.message);
    console.error('\n💡 Note: You may need to run this migration manually in the Supabase SQL Editor:');
    console.error('   1. Go to https://app.supabase.com');
    console.error('   2. Select your project');
    console.error('   3. Click "SQL Editor" in the sidebar');
    console.error('   4. Copy the contents of: supabase/migrations/001_initial_schema.sql');
    console.error('   5. Paste and click "Run"\n');
    process.exit(1);
  }
}

runMigration();
