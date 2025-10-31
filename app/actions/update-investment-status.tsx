"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateInvestmentStatus(investmentId: string, newStatus: string) {
  const supabase = await createClient()

  // Validate status
  const validStatuses = ["pending", "approved", "unpaid", "paid"]
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Invalid status" }
  }

  // Update investment status
  const { error } = await supabase.from("investments").update({ status: newStatus }).eq("id", investmentId)

  if (error) {
    console.error("[v0] Error updating investment status:", error)
    return { success: false, error: error.message }
  }

  // If status is changed to 'approved' or 'paid', update project's raised amount
  if (newStatus === "approved" || newStatus === "paid") {
    const { data: investment } = await supabase
      .from("investments")
      .select("amount, project_id")
      .eq("id", investmentId)
      .single()

    if (investment) {
      // Get current project raised amount
      const { data: project } = await supabase
        .from("projects")
        .select("amount_raised")
        .eq("id", investment.project_id)
        .single()

      if (project) {
        // Update project raised amount
        await supabase
          .from("projects")
          .update({
            amount_raised: Number(project.amount_raised || 0) + Number(investment.amount),
          })
          .eq("id", investment.project_id)
      }
    }
  }

  revalidatePath("/admin/investments")
  revalidatePath("/investor/profile")

  return { success: true }
}
