import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

interface Investment {
  id: string
  investor_name: string
  amount: number
  investment_type: string
  created_at: string
  project?: {
    title: string
  }
}

interface InvestorListProps {
  investments: Investment[]
  showProject?: boolean
  title?: string
  emptyMessage?: string
}

function formatBengaliNumber(num: number): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return num
    .toString()
    .split("")
    .map((digit) => {
      if (digit >= "0" && digit <= "9") {
        return bengaliDigits[Number.parseInt(digit)]
      }
      return digit
    })
    .join("")
}

function getInvestmentTypeLabel(type: string): string {
  const typeMap: Record<string, string> = {
    "6-months": "৬ মাস",
    "12-months": "১২ মাস",
    "one-time": "একবারে বিনিয়োগ",
    monthly: "মাসিক",
    quarterly: "ত্রৈমাসিক",
    equity: "ইক্যুইটি",
    loan: "ঋণ",
    donation: "দান",
  }
  return typeMap[type] || type
}

function getInitials(name: string): string {
  const words = name.trim().split(" ")
  if (words.length >= 2) {
    return words[0][0] + words[1][0]
  }
  return name.substring(0, 2)
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return "আজ"
  } else if (diffInDays === 1) {
    return "গতকাল"
  } else if (diffInDays < 7) {
    return `${formatBengaliNumber(diffInDays)} দিন আগে`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${formatBengaliNumber(weeks)} সপ্তাহ আগে`
  } else {
    const months = Math.floor(diffInDays / 30)
    return `${formatBengaliNumber(months)} মাস আগে`
  }
}

export default function InvestorList({ investments, showProject = false, title, emptyMessage }: InvestorListProps) {
  if (investments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{emptyMessage || "এখনো কোনো বিনিয়োগকারী নেই"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {investments.map((investment) => (
          <Card key={investment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 bg-primary/10">
                  <AvatarFallback className="text-primary font-semibold">
                    {getInitials(investment.investor_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{investment.investor_name}</p>
                  <p className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
                    {getInvestmentTypeLabel(investment.investment_type)}
                  </p>
                  {showProject && investment.project && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{investment.project.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(investment.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
