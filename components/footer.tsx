import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="মাশাআল্লাহ্‌ এগ্রো ফার্ম লোগো" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold">মাশাআল্লাহ্‌ এগ্রো ফার্ম</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              কুরবানির জন্য সেরা মানের গরু এবং ক্রাউডফান্ডিং প্রজেক্টে বিনিয়োগের সুযোগ
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">দ্রুত লিংক</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cattle" className="text-muted-foreground hover:text-primary transition-colors">
                  গরুর তালিকা
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                  প্রজেক্ট
                </Link>
              </li>
              <li>
                <Link href="/invest" className="text-muted-foreground hover:text-primary transition-colors">
                  বিনিয়োগ করুন
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+880 1680-124836</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>mashaallah.agrobd@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">সোশ্যাল মিডিয়া</h3>
            <div className="flex gap-3">
              <Link
                href="https://www.facebook.com/profile.php?id=61575488572702"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
             
              <Link
                href="https://www.youtube.com/@mashaAllahAgrobd"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} মাশাআল্লাহ্‌ এগ্রো । সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  )
}
