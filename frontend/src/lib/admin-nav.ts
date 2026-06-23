"use client"

import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarClock,
  TicketCheck,
  Users,
  CreditCard,
  Percent,
  Pizza,
  Briefcase,
  BarChart3,
  Shield,
  Settings,
  MapPin,
  Ticket,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
  children?: NavItem[]
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export const adminNav: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      {
        label: "Movie Management",
        href: "/admin/movies",
        icon: Film,
        children: [
          { label: "All Movies", href: "/admin/movies", icon: Film },
          { label: "Add Movie", href: "/admin/movies/create", icon: Film },
        ],
      },
      {
        label: "Cinema Management",
        href: "/admin/cinemas",
        icon: Building2,
        children: [
          { label: "All Cinemas", href: "/admin/cinemas", icon: Building2 },
          { label: "Halls & Seats", href: "/admin/cinemas", icon: MapPin },
        ],
      },
      { label: "Showtime Management", href: "/admin/showtimes", icon: CalendarClock },
      { label: "Booking Management", href: "/admin/bookings", icon: TicketCheck },
      { label: "Customer Management", href: "/admin/customers", icon: Users },
      { label: "Payment Management", href: "/admin/payments", icon: CreditCard },
      { label: "Promotion Management", href: "/admin/promotions", icon: Percent },
      { label: "Food & Beverage", href: "/admin/food", icon: Pizza },
      { label: "Staff Management", href: "/admin/staff", icon: Briefcase },
      { label: "Ticket Management", href: "/admin/tickets", icon: Ticket },
    ],
  },
  {
    title: "Analytics",
    items: [{ label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 }],
  },
  {
    title: "Administration",
    items: [
      { label: "User Management", href: "/admin/users", icon: Shield },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

export function findActiveItem(pathname: string): NavItem | undefined {
  for (const section of adminNav) {
    for (const item of section.items) {
      if (item.href === pathname || (pathname.startsWith(item.href) && item.href !== "/admin")) {
        return item
      }
      if (item.children) {
        const child = item.children.find((c) => c.href === pathname || pathname.startsWith(c.href))
        if (child) return child
      }
    }
  }
  return undefined
}

export function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [{ label: "Admin", href: "/admin" }]
  const active = findActiveItem(pathname)
  if (active) {
    crumbs.push({ label: active.label, href: active.href })
  }
  return crumbs
}
