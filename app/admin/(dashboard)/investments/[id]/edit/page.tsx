import { createClient } from "@/lib/supabase/server"
import { InvestmentForm } from "@/components/admin/investment-form"
import { notFound } from "next/navigation"

export default async function EditInvestmentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: investment } = await supabase.from("investments").select("*").eq("id", params.id).single()

  if (!investment) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">বিনিয়োগ এডিট করুন</h1>
        <p className="mt-2 text-gray-600">বিনিয়োগকারীর তথ্য আপডেট করুন</p>
      </div>

      <InvestmentForm investment={investment} />
    </div>
  )
}
