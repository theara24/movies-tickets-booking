"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { adminNav } from "@/lib/admin-nav"

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href],
    )
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const isExpanded = (href: string) => {
    return expandedMenus.includes(href) || isActive(href)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-full border-r border-border/40 bg-sidebar flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-border/40">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <span className="text-xl font-bold tracking-tight text-gradient-gold shrink-0">
            CP
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Admin Panel
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-4">
          {adminNav.map((section, i) => (
            <div key={i}>
              {section.title && !collapsed && (
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href)
                  const hasChildren = item.children && item.children.length > 0
                  const expanded = isExpanded(item.href)

                  return (
                    <li key={item.href}>
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleMenu(item.href)}
                            className={cn(
                              "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                              active
                                ? "bg-gold/10 text-gold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                              collapsed && "justify-center px-2",
                            )}
                            title={collapsed ? item.label : undefined}
                          >
                            <item.icon className={cn("h-5 w-5 shrink-0", active && "text-gold")} />
                            {!collapsed && (
                              <>
                                <span className="truncate flex-1 text-left">{item.label}</span>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-transform",
                                    expanded && "rotate-180",
                                  )}
                                />
                              </>
                            )}
                          </button>
                          {!collapsed && expanded && item.children && (
                            <ul className="mt-0.5 ml-8 space-y-0.5">
                              {item.children.map((child) => {
                                const childActive = isActive(child.href)
                                return (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                        childActive
                                          ? "bg-gold/10 text-gold"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                      )}
                                    >
                                      <span className="truncate">{child.label}</span>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            active
                              ? "bg-gold/10 text-gold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            collapsed && "justify-center px-2",
                          )}
                          title={collapsed ? item.label : undefined}
                        >
                          <item.icon className={cn("h-5 w-5 shrink-0", active && "text-gold")} />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border/40 p-3">
        {collapsed ? (
          <Avatar className="h-9 w-9 mx-auto border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-muted text-xs">AD</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted text-xs">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@cinepremium.com</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
