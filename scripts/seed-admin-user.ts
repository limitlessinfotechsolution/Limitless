#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/types/supabase'

// Database connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_DATABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedAdminUser() {
  console.log('👤 Starting admin user seeding...')

  try {
    // Create admin user
    console.log('📧 Creating admin user...')
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@limitlessinfotech.com',
      password: 'Try@Admin123',
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })

    if (userError) {
      console.error('❌ Error creating admin user:', userError)
      // If user already exists, try to update
      console.log('🔄 User might already exist, checking...')
    } else {
      console.log('✅ Admin user created successfully:', userData.user.id)
    }

    // Get the user ID
    let userId = userData?.user?.id

    if (!userId) {
      // Try to get existing user
      const { data: existingUser, error: existingError } = await supabase.auth.admin.listUsers()
      if (existingError) {
        console.error('❌ Error listing users:', existingError)
        process.exit(1)
      }

      const adminUser = existingUser.users.find(u => u.email === 'admin@limitlessinfotech.com')
      if (adminUser) {
        userId = adminUser.id
        console.log('✅ Found existing admin user:', userId)
      } else {
        console.error('❌ Admin user not found and could not be created')
        process.exit(1)
      }
    }

    // Create or update profile with admin role
    console.log('👑 Setting up admin profile...')
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: 'admin@limitlessinfotech.com',
        role: 'super_admin',
        full_name: 'Admin User',
        avatar_url: '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()

    if (profileError) {
      console.error('❌ Error creating/updating profile:', profileError)
    } else {
      console.log('✅ Admin profile set up successfully')
    }

    // Seed initial audit logs
    console.log('📝 Seeding initial audit logs...')
    const sampleAuditLogs = [
      {
        action: 'system_init',
        entity: 'system',
        entityId: null,
        userId: userId,
        details: { message: 'Admin user created and system initialized' },
        ipAddress: '127.0.0.1',
        userAgent: 'Seeding Script',
        timestamp: new Date().toISOString()
      },
      {
        action: 'user_login',
        entity: 'user',
        entityId: userId,
        userId: userId,
        details: { session: 'initial_seed' },
        ipAddress: '127.0.0.1',
        userAgent: 'Seeding Script',
        timestamp: new Date().toISOString()
      },
      {
        action: 'profile_update',
        entity: 'profile',
        entityId: userId,
        userId: userId,
        details: { role: 'super_admin' },
        ipAddress: '127.0.0.1',
        userAgent: 'Seeding Script',
        timestamp: new Date().toISOString()
      }
    ];

    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert(sampleAuditLogs);

    if (auditError) {
      console.error('❌ Error seeding audit logs:', auditError)
    } else {
      console.log('✅ Initial audit logs seeded successfully')
    }

    console.log('🎉 Admin user seeding completed successfully!')
    console.log('\n📝 Demo Credentials:')
    console.log('Email: admin@limitlessinfotech.com')
    console.log('Password: Try@Admin123')
    console.log('\n💡 Now you can login at /admin/login')

  } catch (error) {
    console.error('❌ Error during admin user seeding:', error)
    process.exit(1)
  }
}

// Run the seeding script
seedAdminUser()
  .then(() => {
    console.log('✅ Admin seeding script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Admin seeding script failed:', error)
    process.exit(1)
  })
