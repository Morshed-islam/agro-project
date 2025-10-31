import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { Users, Clock, TrendingUp, Eye } from "lucide-react"
import { stripHtmlServer } from "@/lib/utils"

interface Project {
  id: string
  project_number: number
  title: string
  description: string
  goal_amount: number
  raised_amount: number
  investor_count: number
  deadline: string
  image_url: string | null
  status: "active" | "completed" | "cancelled"
  views?: number
}

export function ProjectCard({ project }: { project: Project }) {
  const progressPercentage =
    (Number.parseFloat(project.raised_amount as any) / Number.parseFloat(project.goal_amount as any)) * 100

  const today = new Date()
  const deadlineDate = new Date(project.deadline)
  const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  const plainDescription = stripHtmlServer(project.description)

  return (
    <Link href={`/projects/${project.project_number}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative aspect-video">
          <Image
            src={project.image_url || `/.jpg?height=300&width=500&query=${project.title}`}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {project.status === "completed" && <Badge className="absolute top-3 right-3 bg-primary">সম্পন্ন</Badge>}
        </div>

        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 leading-snug">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{plainDescription}</p>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">
                ৳{(Number.parseFloat(project.raised_amount as any) / 100000).toFixed(1)}L সংগৃহীত
              </span>
              <span className="text-muted-foreground">
                ৳{(Number.parseFloat(project.goal_amount as any) / 100000).toFixed(1)}L লক্ষ্য
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{project.investor_count} জন</span>
            </div>
            {project.status === "active" && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{daysLeft} দিন বাকি</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{project.views || 0}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-sm text-primary font-medium group-hover:underline">বিস্তারিত দেখুন →</div>
        </CardContent>
      </Card>
    </Link>
  )
}
