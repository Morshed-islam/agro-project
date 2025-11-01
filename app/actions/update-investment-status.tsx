"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

export async function updateInvestmentStatus(investmentId: string, newStatus: string) {
  const supabase = await createClient()

  const validStatuses = ["pending", "approved", "unpaid", "paid", "rejected"]
  if (!validStatuses.includes(newStatus)) {
    console.error("[v0] Invalid status attempted:", newStatus)
    return { success: false, error: "Invalid status" }
  }

  console.log("[v0] Updating investment", investmentId, "to status:", newStatus)

  const { data: investmentBeforeUpdate } = await supabase
    .from("investments")
    .select(
      `
      id,
      investor_name,
      email,
      amount,
      investment_type,
      project_id,
      projects (
        title,
        project_number
      )
    `,
    )
    .eq("id", investmentId)
    .single()

  // Update investment status
  const { error } = await supabase.from("investments").update({ status: newStatus }).eq("id", investmentId)

  if (error) {
    console.error("[v0] Error updating investment status:", error)
    return { success: false, error: error.message }
  }

  console.log("[v0] Successfully updated investment status")

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

  if (investmentBeforeUpdate) {
    try {
      await sendStatusChangeEmail(investmentBeforeUpdate, newStatus)
    } catch (emailError: any) {
      console.error("[v0] Email sending failed (non-critical):", emailError)
      // Don't fail the whole operation if email fails
    }
  }

  revalidatePath("/admin/investments")
  revalidatePath("/investor/profile")

  return { success: true }
}

async function sendStatusChangeEmail(investment: any, newStatus: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Get status display text and color
  const statusInfo = getStatusInfo(newStatus)

  console.log(`[v0] Sending status change email to: ${investment.email}`)

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "মাশাআল্লাহ্‌ এগ্রো ফার্ম <noreply@mashaallahagro.com>",
      to: investment.email,
      subject: `বিনিয়োগের স্ট্যাটাস আপডেট - ${statusInfo.label}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            মাশাআল্লাহ্‌ এগ্রো ফার্ম
          </h2>
          
          <p style="font-size: 16px; color: #374151;">প্রিয় ${investment.investor_name},</p>
          
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
            আপনার বিনিয়োগের স্ট্যাটাস আপডেট করা হয়েছে।
          </p>

          <div style="background-color: ${statusInfo.bgColor}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.borderColor};">
            <h3 style="margin: 0 0 15px 0; color: ${statusInfo.textColor}; font-size: 18px;">
              নতুন স্ট্যাটাস: ${statusInfo.label}
            </h3>
            <p style="margin: 0; color: ${statusInfo.textColor}; font-size: 14px; line-height: 1.6;">
              ${statusInfo.message}
            </p>
          </div>

          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">বিনিয়োগের বিবরণ</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>প্রজেক্ট:</strong> ${investment.projects?.title || "N/A"}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>প্রজেক্ট নম্বর:</strong> ${investment.projects?.project_number || "N/A"}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>বিনিয়োগের পরিমাণ:</strong> ৳${Number(investment.amount).toLocaleString("bn-BD")}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>বিনিয়োগের ধরন:</strong> ${investment.investment_type === "6-months" ? "৬ মাস" : investment.investment_type}</p>
          </div>

          ${
            newStatus === "approved"
              ? `
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              <strong>পরবর্তী পদক্ষেপ:</strong> আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব পেমেন্ট সংক্রান্ত তথ্যের জন্য।
            </p>
          </div>
          `
              : ""
          }

          ${
            newStatus === "unpaid"
              ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>অনুরোধ:</strong> অনুগ্রহ করে যত শীঘ্র সম্ভব পেমেন্ট সম্পন্ন করুন। পেমেন্ট সংক্রান্ত যেকোনো সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>
          `
              : ""
          }

          ${
            newStatus === "paid"
              ? `
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>ধন্যবাদ!</strong> আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে। আপনার বিনিয়োগ এখন সক্রিয়।
            </p>
          </div>
          `
              : ""
          }

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:<br>
            ইমেইল: mashaallah.agrobd@gmail.com<br>
            ফোন: +880 1680-124836
          </p>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            এই ইমেইলটি স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। অনুগ্রহ করে এই ইমেইলের উত্তর দিবেন না।
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("[v0] Resend API error:", error)
      throw error
    }

    console.log("[v0] Status change email sent successfully to:", investment.email)
  } catch (error) {
    console.error("[v0] Failed to send status change email:", error)
    throw error
  }
}

function getStatusInfo(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "অনুমোদিত",
        message: "অভিনন্দন! আপনার বিনিয়োগ আবেদন অনুমোদিত হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব পরবর্তী পদক্ষেপ সম্পর্কে জানাতে।",
        bgColor: "#ecfdf5",
        borderColor: "#10b981",
        textColor: "#065f46",
      }
    case "rejected":
      return {
        label: "প্রত্যাখ্যান",
        message: "দুঃখিত, আপনার বিনিয়োগ আবেদন প্রত্যাখ্যান করা হয়েছে। আরও তথ্যের জন্য অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।",
        bgColor: "#fef2f2",
        borderColor: "#ef4444",
        textColor: "#991b1b",
      }
    case "paid":
      return {
        label: "পেইড",
        message:
          "আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে। ধন্যবাদ আপনার বিনিয়োগের জন্য! আপনার বিনিয়োগ এখন সক্রিয় এবং আপনি আপনার প্রোফাইল থেকে সব তথ্য দেখতে পারবেন।",
        bgColor: "#dbeafe",
        borderColor: "#3b82f6",
        textColor: "#1e40af",
      }
    case "unpaid":
      return {
        label: "আনপেইড",
        message: "আপনার বিনিয়োগ অনুমোদিত হয়েছে কিন্তু পেমেন্ট এখনও সম্পন্ন হয়নি। অনুগ্রহ করে যত শীঘ্র সম্ভব পেমেন্ট সম্পন্ন করুন।",
        bgColor: "#fef3c7",
        borderColor: "#f59e0b",
        textColor: "#92400e",
      }
    case "pending":
      return {
        label: "পেন্ডিং",
        message: "আপনার বিনিয়োগ আবেদন পর্যালোচনাধীন রয়েছে। আমরা শীঘ্রই আপনার আবেদন পর্যালোচনা করে আপনাকে জানাব।",
        bgColor: "#f3f4f6",
        borderColor: "#6b7280",
        textColor: "#374151",
      }
    default:
      return {
        label: status,
        message: "আপনার বিনিয়োগের স্ট্যাটাস আপডেট করা হয়েছে।",
        bgColor: "#f3f4f6",
        borderColor: "#6b7280",
        textColor: "#374151",
      }
  }
}
