import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CattleTable } from "@/components/admin/cattle-table"

export default async function AdminCattlePage() {
  const supabase = await createClient()
  const { data: cattle } = await supabase.from("cattle").select("*").order("cattle_number", { ascending: true })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">গরু ম্যানেজমেন্ট</h1>
          <p className="mt-2 text-gray-600">সব গরুর তালিকা দেখুন এবং ম্যানেজ করুন</p>
        </div>
        <Link href="/admin/cattle/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            নতুন গরু যোগ করুন
          </Button>
        </Link>
      </div>

      <CattleTable cattle={cattle || []} />
    </div>
  )
}
