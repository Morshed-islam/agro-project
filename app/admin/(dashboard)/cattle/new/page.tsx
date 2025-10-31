import { CattleForm } from "@/components/admin/cattle-form"

export default function NewCattlePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">নতুন গরু যোগ করুন</h1>
        <p className="mt-2 text-gray-600">নতুন গরুর সম্পূর্ণ তথ্য দিন</p>
      </div>

      <CattleForm />
    </div>
  )
}
