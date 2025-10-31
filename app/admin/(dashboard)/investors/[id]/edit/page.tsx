import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { InvestorForm } from "@/components/admin/investor-form"

export default async function EditInvestorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: investor, error } = await supabase.from("investor_profiles").select("*").eq("id", params.id).single()

  if (error || !investor) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">বিনিয়োগকারী এডিট করুন</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">বিনিয়োগকারীর তথ্য আপডেট করুন</p>
      </div>

      <InvestorForm investor={investor} />
    </div>
  )
}
