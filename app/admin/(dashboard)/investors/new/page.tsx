import { InvestorForm } from "@/components/admin/investor-form"

export default function NewInvestorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">নতুন বিনিয়োগকারী যোগ করুন</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">নতুন বিনিয়োগকারী অ্যাকাউন্ট তৈরি করুন</p>
      </div>

      <InvestorForm />
    </div>
  )
}
