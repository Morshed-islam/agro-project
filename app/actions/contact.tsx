"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  try {
    console.log("[v0] Server action: Submitting contact form to database")

    // Create Supabase client
    const supabase = await createClient()

    // Insert into contacts table
    const { data: contactData, error: dbError } = await supabase
      .from("contacts")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        status: "new",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      throw dbError
    }

    console.log("[v0] Contact saved to database:", data.message)

    // Send email notification
    try {
      await sendEmailNotification(data)
    } catch (emailError) {
      console.error("[v0] Email sending failed (non-critical):", emailError)
      // Don't fail the whole operation if email fails
    }

    return { success: true, data: contactData }
  } catch (error) {
    console.error("[v0] Contact form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit contact form",
    }
  }
}

async function sendEmailNotification(data: ContactFormData) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Masha Allah Agro <onboarding@resend.dev>", // Resend's test domain
      to: "mashaallah.agrobd@gmail.com", // Your Gmail address
      replyTo: data.email, // User's email for easy reply
      subject: `নতুন যোগাযোগ বার্তা: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            নতুন যোগাযোগ বার্তা
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>নাম:</strong> ${data.name}</p>
            <p><strong>ইমেইল:</strong> ${data.email}</p>
            <p><strong>ফোন:</strong> ${data.phone || "প্রদান করা হয়নি"}</p>
            <p><strong>বিষয়:</strong> ${data.subject}</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>বার্তা:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            এই ইমেইলটি আপনার ওয়েবসাইটের যোগাযোগ ফর্ম থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Resend API error:", error)
      throw error
    }

    console.log("[v0] Email sent successfully via Resend:", emailData)
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    throw error
  }
}
