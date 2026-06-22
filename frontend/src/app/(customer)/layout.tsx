"use client"

import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import MobileNav from "@/components/layout/mobile-nav"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d1a]">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  )
}
