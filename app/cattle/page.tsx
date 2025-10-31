import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CattleGrid } from "@/components/cattle-grid"
import { CattleFilters } from "@/components/cattle-filters"

export default function CattlePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">কুরবানির গরুর তালিকা</h1>
            <p className="mt-3 text-lg text-muted-foreground text-pretty">
              আমাদের ফার্মের সেরা মানের স্বাস্থ্যবান গরু দেখুন এবং অর্ডার করুন
            </p>
          </div>
        </section>

        {/* Filters and Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside>
                <CattleFilters />
              </aside>
              <div>
                <CattleGrid />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
