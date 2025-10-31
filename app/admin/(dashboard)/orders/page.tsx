import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select("*, cattle(name, cattle_number)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">অর্ডার ম্যানেজমেন্ট</h1>
        <p className="mt-2 text-gray-600">সব অর্ডারের তালিকা দেখুন</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>সব অর্ডার ({orders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>গরু</TableHead>
                  <TableHead>কাস্টমার নাম</TableHead>
                  <TableHead>ইমেইল</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead>ঠিকানা</TableHead>
                  <TableHead>ডেলিভারি তারিখ</TableHead>
                  <TableHead>পেমেন্ট</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>তারিখ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!orders || orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500">
                      কোনো অর্ডার পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.cattle?.name || "N/A"} (#{order.cattle?.cattle_number})
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{order.email}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.address}</TableCell>
                      <TableCell>{new Date(order.delivery_date).toLocaleDateString("bn-BD")}</TableCell>
                      <TableCell>{order.payment_method === "cash" ? "ক্যাশ" : "বিকাশ/নগদ"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "secondary"
                              : order.status === "confirmed"
                                ? "default"
                                : "outline"
                          }
                        >
                          {order.status === "pending" ? "পেন্ডিং" : order.status === "confirmed" ? "কনফার্মড" : "ডেলিভারড"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString("bn-BD")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
