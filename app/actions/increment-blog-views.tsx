"use server"

import { createClient } from "@/lib/supabase/server"

export async function incrementBlogViews(postId: string) {
  try {
    const supabase = await createClient()

    // Increment the views count
    const { error } = await supabase.rpc("increment_blog_views", {
      post_id: postId,
    })

    if (error) {
      console.error("[v0] Error incrementing blog views:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error incrementing blog views:", error)
    return { success: false, error: "Failed to increment views" }
  }
}
