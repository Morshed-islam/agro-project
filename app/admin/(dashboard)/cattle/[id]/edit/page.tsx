import { createClient } from "@/lib/supabase/server"
import { CattleForm } from "@/components/admin/cattle-form"
import { notFound } from "next/navigation"

export default async function EditCattlePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: cattle } = await supabase.from("cattle").select("*").eq("id", params.id).single()

  if (!cattle) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">গরু এডিট করুন</h1>
        <p className="mt-2 text-gray-600">গরুর তথ্য আপডেট করুন</p>
      </div>

      <CattleForm cattle={cattle} />
    </div>
  )
}
