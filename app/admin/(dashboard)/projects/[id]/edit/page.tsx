import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (!project) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">প্রজেক্ট এডিট করুন</h1>
        <p className="mt-2 text-gray-600">প্রজেক্টের তথ্য আপডেট করুন</p>
      </div>

      <ProjectForm project={project} />
    </div>
  )
}
