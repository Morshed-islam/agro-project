import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createInvestorAccounts() {
  console.log('🚀 Starting investor account creation...\n')

  try {
    // Fetch all investments that don't have an investor_id
    const { data: investments, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .is('investor_id', null)

    if (fetchError) {
      console.error('❌ Error fetching investments:', fetchError)
      return
    }

    if (!investments || investments.length === 0) {
      console.log('✅ No investments found without investor accounts')
      return
    }

    console.log(`📊 Found ${investments.length} investments without accounts\n`)

    let successCount = 0
    let errorCount = 0

    for (const investment of investments) {
      console.log(`Processing: ${investment.investor_name} (${investment.email})`)

      try {
        // Check if user already exists with this email
        const { data: existingProfile } = await supabase
          .from('investor_profiles')
          .select('id')
          .eq('email', investment.email)
          .single()

        let investorId

        if (existingProfile) {
          console.log(`  ℹ️  Account already exists, linking investment...`)
          investorId = existingProfile.id
        } else {
          // Create auth user with default password
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: investment.email,
            password: '12345678',
            email_confirm: true,
            user_metadata: {
              name: investment.investor_name
            }
          })

          if (authError) {
            console.error(`  ❌ Error creating auth user: ${authError.message}`)
            errorCount++
            continue
          }

          investorId = authData.user.id
          console.log(`  ✅ Created auth user: ${investorId}`)

          // Create investor profile
          const { error: profileError } = await supabase
            .from('investor_profiles')
            .insert({
              id: investorId,
              investor_name: investment.investor_name,
              email: investment.email,
              phone: investment.phone || '',
              address: ''
            })

          if (profileError) {
            console.error(`  ❌ Error creating profile: ${profileError.message}`)
            errorCount++
            continue
          }

          console.log(`  ✅ Created investor profile`)
        }

        // Link investment to investor
        const { error: updateError } = await supabase
          .from('investments')
          .update({ investor_id: investorId })
          .eq('id', investment.id)

        if (updateError) {
          console.error(`  ❌ Error linking investment: ${updateError.message}`)
          errorCount++
          continue
        }

        console.log(`  ✅ Linked investment to account\n`)
        successCount++

      } catch (error) {
        console.error(`  ❌ Unexpected error: ${error.message}\n`)
        errorCount++
      }
    }

    console.log('\n📈 Migration Summary:')
    console.log(`✅ Successfully processed: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log(`📧 Default password for all accounts: 12345678`)
    console.log('\n⚠️  Important: Users should change their password after first login!')

  } catch (error) {
    console.error('❌ Fatal error:', error)
  }
}

// Run the migration
createInvestorAccounts()
