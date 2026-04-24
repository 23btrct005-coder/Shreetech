const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAdmin() {
  const email = 'admin@shreetech.com';
  const password = 'AdminPassword123!';
  const fullName = 'System Administrator';

  console.log(`Checking if admin user ${email} exists...`);

  try {
    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in Auth. Updating profile to admin...');
        // Find user ID
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        const existingUser = users.users.find(u => u.email === email);
        if (existingUser) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', existingUser.id);
          
          if (updateError) throw updateError;
          console.log('Profile updated to admin successfully.');
        }
      } else {
        throw authError;
      }
    } else {
      console.log('Admin user created in Auth successfully.');
      // 2. Profile should be created by trigger or manual insert
      // Manual insert to be sure
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: 'admin'
        });
      
      if (profileError) throw profileError;
      console.log('Profile created/updated to admin successfully.');
    }

    console.log('\n--- Admin Credentials ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------------');

  } catch (err) {
    console.error('Error setting up admin:', err.message);
  }
}

setupAdmin();
