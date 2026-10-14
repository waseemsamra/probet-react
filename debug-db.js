import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), '')

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
)

async function debug() {
  const users = [
    { email: 'john.h@email.com', username: 'john_highroller', full_name: 'John Highroller', role: 'user', is_vip: true, vip_tier: 'VIP' },
    { email: 'sarah.t@email.com', username: 'sarah_trader', full_name: 'Sarah Trader', role: 'user', is_vip: false },
    { email: 'rapid@email.com', username: 'rapid_bettor_99', full_name: 'Rapid Bettor', role: 'user', is_vip: false, status: 'restricted' },
    { email: 'mike.c@email.com', username: 'mike_casual', full_name: 'Mike Casual', role: 'user', is_vip: false },
    { email: 'whale@proton.me', username: 'crypto_whale', full_name: 'Crypto Whale', role: 'user', is_vip: true, vip_tier: 'VIP GOLD' }
  ]
  
  for (const u of users) {
    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'TempPass123!',
      email_confirm: true,
      user_metadata: { full_name: u.full_name, username: u.username }
    })
    
    if (authError) {
      console.log(`❌ ${u.email}:`, authError.message)
      continue
    }
    
    console.log(`✅ Created auth user: ${u.email} (${authUser.user.id})`)
    
    // Update profile with extra fields
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        username: u.username,
        is_vip: u.is_vip,
        vip_tier: u.vip_tier,
        status: u.status || 'active',
        role: u.role
      })
      .eq('id', authUser.user.id)
    
    if (profileError) {
      console.log(`⚠️ Profile update failed:`, profileError.message)
    } else {
      console.log(`✅ Updated profile for ${u.username}`)
    }
  }
  
  // Verify
  const { data: profiles } = await supabase.from('profiles').select('*')
  console.log('\n=== All Profiles ===')
  console.log(profiles)
}

debug()