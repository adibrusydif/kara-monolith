import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Creating tables...');

  // Create users table
  const { error: usersError } = await supabase.rpc('create_users_table');
  if (usersError) {
    console.error('Error creating users table:', usersError);
  } else {
    console.log('Users table created successfully');
  }

  // Create facilities table
  const { error: facilitiesError } = await supabase.rpc('create_facilities_table');
  if (facilitiesError) {
    console.error('Error creating facilities table:', facilitiesError);
  } else {
    console.log('Facilities table created successfully');
  }

  // Continue with other tables...
}

// First create stored procedures
async function createProcedures() {
  console.log('Creating stored procedures...');

  // Create users table procedure
  const { error: usersProcError } = await supabase.rpc('execute_sql', {
    sql: `
    CREATE OR REPLACE FUNCTION create_users_table()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS users (
        id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
        name TEXT,
        email TEXT,
        role TEXT CHECK (role IN ('student', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
    END;
    $$ LANGUAGE plpgsql;
    `
  });

  if (usersProcError) {
    console.error('Error creating users procedure:', usersProcError);
  } else {
    console.log('Users procedure created successfully');
  }

  // Continue with other procedures...
}

async function main() {
  try {
    await createProcedures();
    await createTables();
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 