"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import { DeleteInvestorButton } from "./delete-investor-button"

interface Investor {
  id: string
  investor_name: string
  email: string
  phone: string | null
  address: string | null
  created_at: string
}

export function InvestorsTable({ investors }: { investors: Investor[] }) {
  if (investors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">কোনো বিনিয়োগকারী নেই</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">নাম</TableHead>
            <TableHead className="whitespace-nowrap">ইমেইল</TableHead>
            <TableHead className="whitespace-nowrap">ফোন</TableHead>
            <TableHead className="whitespace-nowrap">ঠিকানা</TableHead>
            <TableHead className="whitespace-nowrap">তারিখ</TableHead>
            <TableHead className="text-right whitespace-nowrap">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investors.map((investor) => (
            <TableRow key={investor.id}>
              <TableCell className="font-medium whitespace-nowrap">{investor.investor_name}</TableCell>
              <TableCell className="whitespace-nowrap">{investor.email}</TableCell>
              <TableCell className="whitespace-nowrap">{investor.phone || "—"}</TableCell>
              <TableCell className="whitespace-nowrap">{investor.address || "—"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(investor.created_at).toLocaleDateString("bn-BD")}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/investors/${investor.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">এডিট</span>
                    </Link>
                  </Button>
                  <DeleteInvestorButton investorId={investor.id} investorName={investor.investor_name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
