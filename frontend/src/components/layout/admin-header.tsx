"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, ChevronDown, Menu, LogOut, User, Settings, Shield, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Breadcrumb {
  label: string
  href: string
}

interface AdminHeaderProps {
  title: string
  breadcrumbs?: Breadcrumb[]
  onMenuToggle: () => void
}

export default function AdminHeader({ title, breadcrumbs, onMenuToggle }: AdminHeaderProps) {
  const [notificationCount] = useState(3)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-border/40 bg-cinema-dark/80 backdrop-blur-xl supports-[backdrop-filter]:bg-cinema-dark/60">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-foreground truncate">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          ) : (
            <h1 className="text-lg font-semibold text-foreground hidden sm:block truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 lg:w-64 pl-9 h-9 bg-cinema-dark border-border/60 focus-visible:ring-gold"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge variant="gold" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                {notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-muted text-xs">AD</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm text-foreground">Admin User</span>
                <ChevronDown className="hidden lg:inline h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Admin User</span>
                  <span className="text-xs font-normal text-muted-foreground">admin@cinepremium.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
