"use server"

import { createClient } from "@/lib/supabase/server"

export async function signupInvestor(data: {
  investor_name: string
  email: string
  phone: string
  address: string
  password: string
}) {
  try {
    const supabase = await createClient()

    const email = data.email.trim().toLowerCase()

    console.log("[v0] Attempting signup with email:", email)

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: data.password,
      options: {
        data: {
          role: "investor",
          investor_name: data.investor_name,
          phone: data.phone,
        },
      },
    })

    if (authError) {
      console.error("[v0] Signup error:", authError.message)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error("User creation failed")
    }

    console.log("[v0] User created successfully:", authData.user.id)

    // Wait for trigger to create profile
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update profile with address
    const { error: profileError } = await supabase
      .from("investor_profiles")
      .update({
        address: data.address || null,
      })
      .eq("id", authData.user.id)

    if (profileError) {
      console.error("[v0] Profile update error:", profileError.message)
    }

    return { success: true, userId: authData.user.id }
  } catch (error) {
    console.error("[v0] Error signing up investor:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "সাইনআপ ব্যর্থ হয়েছে",
    }
  }
}
