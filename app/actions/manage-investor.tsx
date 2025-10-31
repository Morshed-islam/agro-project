"use server"
import { createClient as createServiceClient } from "@supabase/supabase-js"

export async function createInvestor(data: {
  investor_name: string
  email: string
  phone: string
  address: string
  password: string
}) {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        role: "investor",
        investor_name: data.investor_name,
        phone: data.phone,
      },
    })

    if (authError) {
      console.error("[v0] Auth error:", authError.message)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error("User creation failed")
    }

    // The trigger creates the profile automatically, so we just update it with address
    await new Promise((resolve) => setTimeout(resolve, 500)) // Wait 500ms for trigger

    const { error: profileError } = await supabaseAdmin
      .from("investor_profiles")
      .update({
        address: data.address || null,
      })
      .eq("id", authData.user.id)

    if (profileError) {
      console.error("[v0] Profile update error:", profileError.message)
      // If profile update fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error(profileError.message)
    }

    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("[v0] Error creating investor:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create investor",
    }
  }
}

export async function updateInvestor(data: {
  id: string
  investor_name: string
  phone: string
  address: string
  password?: string
}) {
  try {
    // Create admin client with service role key
    const supabaseAdmin = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Update investor profile
    const { error: profileError } = await supabaseAdmin
      .from("investor_profiles")
      .update({
        investor_name: data.investor_name,
        phone: data.phone || null,
        address: data.address || null,
      })
      .eq("id", data.id)

    if (profileError) {
      console.error("[v0] Profile update error:", profileError.message)
      throw new Error(profileError.message)
    }

    // Update password if provided
    if (data.password) {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(data.id, {
        password: data.password,
      })

      if (passwordError) {
        console.error("[v0] Password update error:", passwordError.message)
        throw new Error(passwordError.message)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating investor:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update investor",
    }
  }
}
