import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User, Calendar } from "lucide-react"
import { ReplyDialog } from "@/components/admin/reply-dialog"

export default async function AdminContactsPage() {
  const supabase = await createClient()
  const { data: contacts } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

  const newCount = contacts?.filter((c) => c.status === "new").length || 0
  const repliedCount = contacts?.filter((c) => c.status === "replied").length || 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">যোগাযোগ মেসেজ</h1>
        <p className="mt-2 text-gray-600">কাস্টমারদের পাঠানো সব মেসেজ দেখুন এবং উত্তর দিন</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">মোট মেসেজ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{contacts?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">নতুন মেসেজ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{newCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">উত্তর দেওয়া হয়েছে</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{repliedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {!contacts || contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">কোনো মেসেজ পাওয়া যায়নি</CardContent>
          </Card>
        ) : (
          contacts.map((contact: any) => (
            <Card key={contact.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4" />
                        <span className="font-semibold">{contact.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h3 className="mb-1 font-semibold text-gray-900">{contact.subject}</h3>
                      <p className="text-gray-700">{contact.message}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(contact.created_at).toLocaleString("bn-BD")}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-2">
                    <Badge
                      variant={contact.status === "replied" ? "default" : "secondary"}
                      className={
                        contact.status === "replied"
                          ? "bg-green-600 hover:bg-green-700"
                          : contact.status === "new"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : ""
                      }
                    >
                      {contact.status === "new" ? "নতুন" : contact.status === "replied" ? "উত্তর দেওয়া হয়েছে" : "পড়া হয়েছে"}
                    </Badge>
                    {contact.status !== "replied" && (
                      <ReplyDialog
                        contact={{
                          id: contact.id,
                          name: contact.name,
                          email: contact.email,
                          subject: contact.subject,
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
