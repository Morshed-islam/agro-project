import { ContactForm } from "@/components/contact-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">আমাদের সাথে যোগাযোগ করুন</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                আপনার যেকোনো প্রশ্ন বা পরামর্শের জন্য আমরা সবসময় প্রস্তুত। নিচের ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">যোগাযোগের তথ্য</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">ইমেইল</p>
                        <a
                          href="mailto:mashaallah.agrobd@gmail.com"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          mashaallah.agrobd@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">ফোন</p>
                        <p className="text-muted-foreground">+৮৮০ ১৬৮০-১২৪৮৩৬</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">ঠিকানা</p>
                        <p className="text-muted-foreground">কিচক ,শিবগঞ্জ ,বগুড়া</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 p-6">
                  <h3 className="font-semibold text-foreground mb-2">কার্যসময়</h3>
                  <p className="text-sm text-muted-foreground">
                    শনিবার - বৃহস্পতিবার
                    <br />
                    সকাল ৯:০০ - সন্ধ্যা ৬:০০
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="rounded-lg border border-border bg-card p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">বার্তা পাঠান</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
