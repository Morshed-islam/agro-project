import { InvestmentForm } from "@/components/admin/investment-form"

export default function NewInvestmentPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">নতুন বিনিয়োগ যোগ করুন</h1>
        <p className="mt-2 text-gray-600">নতুন বিনিয়োগকারীর তথ্য যোগ করুন</p>
      </div>

      <InvestmentForm />
    </div>
  )
}
