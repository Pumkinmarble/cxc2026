/**
 * Test Supabase Connection
 * Run with: npx tsx test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔗 Testing Supabase connection...');
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if users table exists
    console.log('\n📋 Test 1: Checking users table...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error querying users table:', error.message);
      return false;
    }

    console.log('✅ Users table exists!');
    console.log(`   Found ${data?.length || 0} rows (empty table is ok)`);

    // Test 2: Try to insert a test user
    console.log('\n📋 Test 2: Testing insert...');
    const testUser = {
      auth0_id: 'test_' + Date.now(),
      email: 'test@example.com',
      name: 'Test User',
    };

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    if (insertError) {
      console.error('❌ Error inserting test user:', insertError.message);
      return false;
    }

    console.log('✅ Successfully inserted test user!');
    console.log('   User ID:', insertData?.[0]?.id);

    // Test 3: Clean up test user
    console.log('\n📋 Test 3: Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('auth0_id', testUser.auth0_id);

    if (deleteError) {
      console.error('⚠️  Warning: Could not delete test user:', deleteError.message);
    } else {
      console.log('✅ Test user deleted successfully');
    }

    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run tests
testConnection().then((success) => {
  if (success) {
    console.log('\n🎉 All tests passed! Supabase is ready to use.');
  } else {
    console.log('\n❌ Tests failed. Check the errors above.');
    process.exit(1);
  }
});
