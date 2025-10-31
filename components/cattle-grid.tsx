import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getYouTubeThumbnail } from "@/lib/youtube"

export async function CattleGrid() {
  const supabase = await createClient()
  const { data: cattleData, error } = await supabase
    .from("cattle")
    .select("*")
    .eq("status", "available")
    .order("cattle_number", { ascending: true })

  if (error) {
    console.log("[v0] Error fetching cattle:", error)
    return <div className="text-center py-12">গরুর তথ্য লোড করতে সমস্যা হয়েছে</div>
  }

  if (!cattleData || cattleData.length === 0) {
    return <div className="text-center py-12">কোন গরু পাওয়া যায়নি</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{cattleData.length}টি গরু পাওয়া গেছে</p>
        <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option>সাজান: নতুন প্রথমে</option>
          <option>সাজান: দাম কম থেকে বেশি</option>
          <option>সাজান: দাম বেশি থেকে কম</option>
          <option>সাজান: ওজন অনুযায়ী</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cattleData.map((cattle) => {
          const videoThumbnail = cattle.video_url ? getYouTubeThumbnail(cattle.video_url, "hq") : null

          return (
            <Card key={cattle.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-[4/3]">
                <Image
                  src={
                    videoThumbnail ||
                    cattle.images?.[0] ||
                    `/.jpg?height=400&width=600&query=${cattle.breed || "/placeholder.svg"} cattle`
                  }
                  alt={cattle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {cattle.video_url && (
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                )}
                <Badge className="absolute bottom-3 right-3 bg-primary">{cattle.breed}</Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-3 line-clamp-1">{cattle.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-between">
                    <span>ওজন:</span>
                    <span className="font-medium text-foreground">{cattle.weight} কেজি</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>বয়স:</span>
                    <span className="font-medium text-foreground">{cattle.age} বছর</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
                    <span>মূল্য:</span>
                    <span className="text-lg font-bold text-primary">৳{cattle.price.toLocaleString("bn-BD")}</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/cattle/${cattle.cattle_number}`}>বিস্তারিত দেখুন</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
