"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [investorProfile, setInvestorProfile] = useState<{ investor_name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient()

    const checkSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from("investor_profiles")
            .select("investor_name, email")
            .eq("id", user.id)
            .single()

          if (profile) {
            setInvestorProfile(profile)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setInvestorProfile(null)
      } else if (event === "SIGNED_IN") {
        checkSession()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createBrowserClient()
      await supabase.auth.signOut()
      setInvestorProfile(null)
      setMobileMenuOpen(false)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="মাশাআল্লাহ্‌ এগ্রো ফার্ম লোগো" width={40} height={40} className="h-10 w-10" />
          <span className="text-xl font-bold text-foreground">মাশাআল্লাহ্‌ এগ্রো</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            হোম
          </Link>
          <Link href="/cattle" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            গরুর তালিকা
          </Link>
          <Link href="/projects" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            প্রজেক্ট
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            ব্লগ
          </Link>
          <Link href="/invest" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            বিনিয়োগ করুন
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {!isLoading && (
            <>
              {investorProfile ? (
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="bg-transparent">
                    <Link href="/investor/profile">
                      <User className="mr-2 h-4 w-4" />
                      {investorProfile.investor_name}
                    </Link>
                  </Button>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button asChild variant="outline" size="sm" className="hidden md:inline-flex bg-transparent">
                  <Link href="/investor/login">লগইন / সাইন আপ</Link>
                </Button>
              )}
            </>
          )}

          <Button asChild className="hidden md:inline-flex" size="sm">
            <Link href="/contact">যোগাযোগ করুন</Link>
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] px-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-right text-xl">মেনু</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 text-right rounded-lg hover:bg-accent"
                >
                  হোম
                </Link>
                <Link
                  href="/cattle"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 text-right rounded-lg hover:bg-accent"
                >
                  গরুর তালিকা
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 text-right rounded-lg hover:bg-accent"
                >
                  প্রজেক্ট
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 text-right rounded-lg hover:bg-accent"
                >
                  ব্লগ
                </Link>
                <Link
                  href="/invest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors py-3 px-4 text-right rounded-lg hover:bg-accent"
                >
                  বিনিয়োগ করুন
                </Link>

                {!isLoading && (
                  <>
                    {investorProfile ? (
                      <>
                        <div className="border-t pt-4 mt-2">
                          <div className="px-4 py-2 text-right">
                            <p className="text-sm font-medium">{investorProfile.investor_name}</p>
                            <p className="text-xs text-muted-foreground">{investorProfile.email}</p>
                          </div>
                        </div>
                        <Link href="/investor/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full bg-transparent">
                            প্রোফাইল
                          </Button>
                        </Link>
                        <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 bg-transparent">
                          লগআউট
                        </Button>
                      </>
                    ) : (
                      <Link href="/investor/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          লগইন / সাইন আপ
                        </Button>
                      </Link>
                    )}
                  </>
                )}

                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">যোগাযোগ করুন</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
