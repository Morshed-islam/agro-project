"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Project = {
  id: string
  project_number: number
  title: string
  goal_amount: number
  raised_amount: number
  investor_count: number
  status: string
  deadline: string
  views?: number
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    const supabase = createBrowserClient()
    const { error } = await supabase.from("projects").delete().eq("id", deleteId)

    if (error) {
      console.error("Delete error:", error)
      alert("ডিলিট করতে সমস্যা হয়েছে")
    } else {
      router.refresh()
    }

    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">নম্বর</TableHead>
              <TableHead className="whitespace-nowrap">শিরোনাম</TableHead>
              <TableHead className="whitespace-nowrap">লক্ষ্য</TableHead>
              <TableHead className="whitespace-nowrap">সংগৃহীত</TableHead>
              <TableHead className="whitespace-nowrap">বিনিয়োগকারী</TableHead>
              <TableHead className="whitespace-nowrap">ভিউ</TableHead>
              <TableHead className="whitespace-nowrap">স্ট্যাটাস</TableHead>
              <TableHead className="whitespace-nowrap">ডেডলাইন</TableHead>
              <TableHead className="text-right whitespace-nowrap">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  কোনো প্রজেক্ট পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium whitespace-nowrap">{project.project_number}</TableCell>
                  <TableCell className="whitespace-nowrap">{project.title}</TableCell>
                  <TableCell className="whitespace-nowrap">৳{project.goal_amount.toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">৳{project.raised_amount.toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">{project.investor_count}</TableCell>
                  <TableCell className="whitespace-nowrap">{project.views || 0}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status === "active" ? "চলমান" : project.status === "completed" ? "সম্পন্ন" : "বন্ধ"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(project.deadline).toLocaleDateString("bn-BD")}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline">এডিট</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                        onClick={() => setDeleteId(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="hidden sm:inline">ডিলিট</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই প্রজেক্টটি ডিলিট করা হলে তা আর ফিরিয়ে আনা যাবে না। এই অ্যাকশনটি স্থায়ী।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "ডিলিট হচ্ছে..." : "ডিলিট করুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
