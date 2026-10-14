import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), '')

const supabaseAdmin = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
)

const supabaseAnon = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
)

async function main() {
  const email = 'waseem_samra@hotmail.com'
  const password = 'Samra@2008@@'

  console.log(`Checking user: ${email}`)

  // 1. Check if user exists
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const user = usersData.users.find(u => u.email === email)
  if (!user) {
    console.error(`User not found: ${email}`)
    return
  }

  console.log(`User found:`, {
    id: user.id,
    email: user.email,
    emailConfirmed: !!user.email_confirmed_at,
    createdAt: user.created_at
  })

  // 2. Try to log in with the anon key
  console.log(`Attempting to sign in with password: ${password}`)
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Login failed:', error.message)
    console.log('Resetting password to the known value...')

    // Reset the password via admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: password }
    )

    if (updateError) {
      console.error('Error updating password:', updateError)
      return
    }

    console.log('Password updated successfully.')

    // Try again
    console.log(`Attempting to sign in again with password: ${password}`)
    const { data: data2, error: error2 } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    })

    if (error2) {
      console.error('Login failed after password reset:', error2.message)
      return
    }

    console.log('Login successful after password reset!')
    console.log('User:', data2.user.email)
    return
  }

  console.log('Login successful!')
  console.log('User:', data.user.email)
}

main().catch(console.error)
