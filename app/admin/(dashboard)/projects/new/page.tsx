import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">নতুন প্রজেক্ট যোগ করুন</h1>
        <p className="mt-2 text-gray-600">নতুন প্রজেক্টের সম্পূর্ণ তথ্য দিন</p>
      </div>

      <ProjectForm />
    </div>
  )
}
