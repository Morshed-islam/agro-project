"use server"

import { createClient } from "@/lib/supabase/server"

export async function incrementProjectViews(projectId: string) {
  try {
    const supabase = await createClient()

    // Call the database function to increment views atomically
    const { error } = await supabase.rpc("increment_project_views", {
      project_uuid: projectId,
    })

    if (error) {
      console.error("[v0] Error incrementing project views:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error incrementing project views:", error)
    return { success: false, error: "Failed to increment views" }
  }
}
