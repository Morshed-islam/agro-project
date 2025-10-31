"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveInvestment(investmentId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("investments").update({ status: "approved" }).eq("id", investmentId)

    if (error) throw error

    revalidatePath("/admin/investments")
    return { success: true }
  } catch (error) {
    console.error("Error approving investment:", error)
    return { success: false, error: "Failed to approve investment" }
  }
}

export async function rejectInvestment(investmentId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("investments").update({ status: "rejected" }).eq("id", investmentId)

    if (error) throw error

    revalidatePath("/admin/investments")
    return { success: true }
  } catch (error) {
    console.error("Error rejecting investment:", error)
    return { success: false, error: "Failed to reject investment" }
  }
}
