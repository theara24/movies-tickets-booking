"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/layout/admin-sidebar"
import AdminHeader from "@/components/layout/admin-header"
import { useAuthStore } from "@/store/auth-store"
import { Loader2 } from "lucide-react"
import { getBreadcrumbs, findActiveItem } from "@/lib/admin-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isAuthenticated, isLoading, loadProfile } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isLoading, router])

  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname])
  const activeItem = useMemo(() => findActiveItem(pathname), [pathname])
  const pageTitle = activeItem?.label ?? "Dashboard"

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cinema-dark">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cinema-dark">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-60"}`}
      >
        <AdminHeader
          title={pageTitle}
          breadcrumbs={breadcrumbs}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
