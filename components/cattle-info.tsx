import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface CattleInfoProps {
  cattle: {
    name: string
    breed: string
    description: string
    weight: string
    age: string
    color: string
    height: string
    health: string
    vaccination: string
    features: string[]
  }
}

export function CattleInfo({ cattle }: CattleInfoProps) {
  return (
    <div className="space-y-6">
      {/* Title and Breed */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-balance">{cattle.name}</h1>
          <Badge className="bg-primary">{cattle.breed}</Badge>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">{cattle.description}</p>
      </div>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>বিস্তারিত তথ্য</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">জাত</span>
              <span className="font-medium">{cattle.breed}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">ওজন</span>
              <span className="font-medium">{cattle.weight}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">বয়স</span>
              <span className="font-medium">{cattle.age}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">উচ্চতা</span>
              <span className="font-medium">{cattle.height}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">রঙ</span>
              <span className="font-medium">{cattle.color}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">স্বাস্থ্য</span>
              <span className="font-medium">{cattle.health}</span>
            </div>
            <div className="flex items-center justify-between pb-3 sm:col-span-2">
              <span className="text-muted-foreground">টিকা</span>
              <span className="font-medium">{cattle.vaccination}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>বিশেষ সুবিধা</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {cattle.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
