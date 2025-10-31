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

type Cattle = {
  id: string
  cattle_number: number
  name: string
  breed: string
  weight: number
  age: number
  price: number
  status: string
}

export function CattleTable({ cattle }: { cattle: Cattle[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    const supabase = createBrowserClient()
    const { error } = await supabase.from("cattle").delete().eq("id", deleteId)

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
              <TableHead className="whitespace-nowrap">নাম</TableHead>
              <TableHead className="whitespace-nowrap">জাত</TableHead>
              <TableHead className="whitespace-nowrap">ওজন</TableHead>
              <TableHead className="whitespace-nowrap">বয়স</TableHead>
              <TableHead className="whitespace-nowrap">মূল্য</TableHead>
              <TableHead className="whitespace-nowrap">স্ট্যাটাস</TableHead>
              <TableHead className="text-right whitespace-nowrap">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cattle.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  কোনো গরু পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              cattle.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium whitespace-nowrap">{item.cattle_number}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.breed}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.weight} কেজি</TableCell>
                  <TableCell className="whitespace-nowrap">{item.age} বছর</TableCell>
                  <TableCell className="whitespace-nowrap">৳{item.price.toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "available" ? "উপলব্ধ" : "বিক্রিত"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/cattle/${item.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <Edit className="h-3 w-3" />
                          <span className="hidden sm:inline">এডিট</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                        onClick={() => setDeleteId(item.id)}
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
            <AlertDialogDescription>এই গরুটি ডিলিট করা হলে তা আর ফিরিয়ে আনা যাবে না। এই অ্যাকশনটি স্থায়ী।</AlertDialogDescription>
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
