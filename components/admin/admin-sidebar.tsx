"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Beef,
  FolderKanban,
  ShoppingCart,
  TrendingUp,
  MessageSquare,
  Leaf,
  FileText,
  Users,
} from "lucide-react"

const navigation = [
  { name: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "গরু ম্যানেজমেন্ট", href: "/admin/cattle", icon: Beef },
  { name: "প্রজেক্ট ম্যানেজমেন্ট", href: "/admin/projects", icon: FolderKanban },
  { name: "অর্ডার", href: "/admin/orders", icon: ShoppingCart },
  { name: "বিনিয়োগ", href: "/admin/investments", icon: TrendingUp },
  { name: "বিনিয়োগকারী", href: "/admin/investors", icon: Users },
  { name: "মেসেজ", href: "/admin/contacts", icon: MessageSquare },
  { name: "ব্লগ", href: "/admin/blog", icon: FileText },
]

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">মাশাআল্লাহ এগ্রো</h1>
          <p className="text-xs text-gray-500">অ্যাডমিন প্যানেল</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500">© 2025 মাশাআল্লাহ এগ্রো ফার্ম</p>
      </div>
    </div>
  )
}
