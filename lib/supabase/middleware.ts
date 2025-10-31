import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/investor")) {
    // Allow public access to signup and login pages
    if (
      !request.nextUrl.pathname.startsWith("/investor/signup") &&
      !request.nextUrl.pathname.startsWith("/investor/login")
    ) {
      // Protect other investor routes
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    // Check if user is an investor (has investor_profile)
    const { data: investorProfile } = await supabase.from("investor_profiles").select("id").eq("id", user.id).single()

    // If user is an investor, redirect them to investor profile
    if (investorProfile) {
      const url = request.nextUrl.clone()
      url.pathname = "/investor/profile"
      return NextResponse.redirect(url)
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname === "/admin/login" && user) {
    const { data: investorProfile } = await supabase.from("investor_profiles").select("id").eq("id", user.id).single()

    // If user is an investor, redirect to investor profile instead
    if (investorProfile) {
      const url = request.nextUrl.clone()
      url.pathname = "/investor/profile"
      return NextResponse.redirect(url)
    }

    const url = request.nextUrl.clone()
    url.pathname = "/admin/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
