"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

interface InvestmentFormData {
  name: string
  email: string
  phone: string
  projectNumber: string
  amount: number
  investmentType: string
  investmentDeadline: string
  message?: string
  investorId?: string // Added investorId to link investment to investor account
}

export async function submitInvestment(data: InvestmentFormData) {
  try {
    console.log("[v0] Server action: Submitting investment to database")

    // Create Supabase client
    const supabase = await createClient()

    // Get project details
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("project_number", Number.parseInt(data.projectNumber))
      .single()

    if (projectError) {
      console.error("[v0] Project lookup error:", projectError)
      throw new Error("প্রজেক্ট খুঁজে পাওয়া যায়নি")
    }

    console.log("[v0] Found project:", projectData)

    const { data: investmentData, error: dbError } = await supabase
      .from("investments")
      .insert({
        project_id: projectData.id,
        investor_id: data.investorId || null, // Link to investor account if logged in
        investor_name: data.name,
        email: data.email,
        phone: data.phone,
        amount: data.amount,
        investment_type: data.investmentType,
        investment_deadline: data.investmentDeadline || null,
        message: data.message || null,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Investment submission error:", dbError)
      throw dbError
    }

    console.log("[v0] Investment saved to database:", investmentData)

    // Send email notification
    try {
      await sendInvestmentEmailNotification({
        ...data,
        projectTitle: projectData.title,
      })
    } catch (emailError) {
      console.error("[v0] Email sending failed (non-critical):", emailError)
      // Don't fail the whole operation if email fails
    }

    return {
      success: true,
      data: {
        ...investmentData,
        projectTitle: projectData.title,
      },
    }
  } catch (error) {
    console.error("[v0] Investment submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "বিনিয়োগ জমা দিতে সমস্যা হয়েছে",
    }
  }
}

async function sendInvestmentEmailNotification(data: InvestmentFormData & { projectTitle: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Masha Allah Agro <onboarding@resend.dev>",
      to: "mashaallah.agrobd@gmail.com",
      replyTo: data.email,
      subject: `নতুন বিনিয়োগ আবেদন - ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            নতুন বিনিয়োগ আবেদন
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="margin: 0 0 10px 0; color: #16a34a;">বিনিয়োগকারীর তথ্য</h3>
            <p style="margin: 5px 0;"><strong>নাম:</strong> ${data.name}</p>
            <p style="margin: 5px 0;"><strong>ইমেইল:</strong> ${data.email}</p>
            <p style="margin: 5px 0;"><strong>ফোন:</strong> ${data.phone}</p>
          </div>

          <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 10px 0; color: #3b82f6;">বিনিয়োগের বিবরণ</h3>
            <p style="margin: 5px 0;"><strong>প্রজেক্ট:</strong> ${data.projectTitle}</p>
            <p style="margin: 5px 0;"><strong>বিনিয়োগের পরিমাণ:</strong> ৳${data.amount.toLocaleString("bn-BD")}</p>
            <p style="margin: 5px 0;"><strong>বিনিয়োগের ধরন:</strong> ${data.investmentType === "6-months" ? "৬ মাস" : data.investmentType}</p>
            <p style="margin: 5px 0;"><strong>প্রত্যাশিত তারিখ:</strong> ${new Date(
              data.investmentDeadline,
            ).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>

          ${
            data.message
              ? `
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>অতিরিক্ত মন্তব্য:</strong></p>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          `
              : ""
          }

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>⚠️ দ্রষ্টব্য:</strong> এই বিনিয়োগটি বর্তমানে <strong>পেন্ডিং</strong> অবস্থায় রয়েছে। 
              অনুগ্রহ করে admin panel থেকে অনুমোদন করুন।
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            এই ইমেইলটি আপনার ওয়েবসাইটের বিনিয়োগ ফর্ম থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Resend API error:", error)
      throw error
    }

    console.log("[v0] Investment email sent successfully:", emailData)
  } catch (error) {
    console.error("[v0] Failed to send investment email:", error)
    throw error
  }
}
