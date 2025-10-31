import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export async function RelatedCattle({ currentCattleNumber }: { currentCattleNumber: number }) {
  const supabase = await createClient()
  const { data: relatedCattleData, error } = await supabase
    .from("cattle")
    .select("*")
    .eq("status", "available")
    .neq("cattle_number", currentCattleNumber)
    .limit(3)

  if (error || !relatedCattleData || relatedCattleData.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">অন্যান্য গরু</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedCattleData.map((cattle) => (
          <Card key={cattle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3]">
              <Image
                src={cattle.images?.[0] || `/.jpg?height=300&width=400&query=${cattle.breed} cattle`}
                alt={cattle.name}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-primary">{cattle.breed}</Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold mb-2 line-clamp-1">{cattle.name}</h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>ওজন: {cattle.weight} কেজি</span>
                <span className="text-lg font-bold text-primary">৳{cattle.price.toLocaleString("bn-BD")}</span>
              </div>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href={`/cattle/${cattle.cattle_number}`}>বিস্তারিত দেখুন</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
