"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

interface ReplyData {
  contactId: string
  recipientEmail: string
  recipientName: string
  subject: string
  message: string
}

export async function sendReplyEmail(data: ReplyData) {
  try {
    console.log("[v0] Server action: Sending reply email")

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send reply email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "মাশাআল্লাহ্‌ এগ্রো ফার্ম <onboarding@resend.dev>",
      to: data.recipientEmail,
      subject: `Re: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
            <h2 style="margin: 0;">মাশাআল্লাহ্‌ এগ্রো ফার্ম</h2>
          </div>
          <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 5px 5px;">
            <p style="margin-top: 0;">প্রিয় ${data.recipientName},</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; white-space: pre-wrap;">
              ${data.message}
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              ধন্যবাদ,<br>
              মাশাআল্লাহ্‌ এগ্রো ফার্ম টিম
            </p>
          </div>
        </div>
      `,
    })

    if (emailError) {
      console.error("[v0] Resend API error:", emailError)
      throw emailError
    }

    console.log("[v0] Reply email sent successfully:", emailData)

    // Update contact status to 'replied'
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("contacts").update({ status: "replied" }).eq("id", data.contactId)

    if (dbError) {
      console.error("[v0] Database update error:", dbError)
      throw dbError
    }

    console.log("[v0] Contact status updated to replied")

    return { success: true }
  } catch (error) {
    console.error("[v0] Reply email error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send reply",
    }
  }
}
