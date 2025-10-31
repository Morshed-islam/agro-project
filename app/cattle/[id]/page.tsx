import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CattleGallery } from "@/components/cattle-gallery"
import { CattleInfo } from "@/components/cattle-info"
import { CattleOrderForm } from "@/components/cattle-order-form"
import { RelatedCattle } from "@/components/related-cattle"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function CattleDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: cattle, error } = await supabase
    .from("cattle")
    .select("*")
    .eq("cattle_number", Number.parseInt(params.id))
    .single()

  if (error || !cattle) {
    console.log("[v0] Cattle not found:", error)
    notFound()
  }

  const cattleData = {
    id: cattle.id,
    cattleNumber: cattle.cattle_number,
    name: cattle.name,
    breed: cattle.breed,
    weight: `${cattle.weight} কেজি`,
    age: `${cattle.age} বছর`,
    price: cattle.price.toLocaleString("bn-BD"),
    color: "ধূসর-সাদা",
    height: "৫ ফুট",
    health: "চমৎকার",
    vaccination: "সম্পূর্ণ",
    description: cattle.description || "এটি একটি উচ্চমানের গরু যা কুরবানির জন্য আদর্শ।",
    features: [
      "সম্পূর্ণ স্বাস্থ্যবান এবং সুগঠিত",
      "সকল প্রয়োজনীয় টিকা দেওয়া",
      "নিয়মিত ভেটেরিনারি চেকআপ",
      "জৈব খাদ্যে লালিত",
      "ফ্রি হোম ডেলিভারি",
    ],
    images: cattle.images || [],
    videos: cattle.videos || [],
    location: cattle.location,
    status: cattle.status,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Main Content */}
              <div className="space-y-8">
                <CattleGallery images={cattleData.images} videos={cattleData.videos} name={cattleData.name} />
                <CattleInfo cattle={cattleData} />
              </div>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-20 lg:self-start">
                <CattleOrderForm cattle={cattleData} />
              </aside>
            </div>
          </div>
        </section>

        {/* Related Cattle */}
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <RelatedCattle currentCattleNumber={cattleData.cattleNumber} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
