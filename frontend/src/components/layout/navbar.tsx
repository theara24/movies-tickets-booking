"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Ticket,
  User,
  Bell,
  Home,
  MapPin,
  Tags,
  UtensilsCrossed,
  ChevronDown,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cinemas", label: "Cinemas", icon: MapPin },
  { href: "/promotions", label: "Offers", icon: Tags },
  { href: "/food", label: "F&B", icon: UtensilsCrossed },
]

const movies = [
  { title: "Colony", date: "16 Jun 2026", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&q=80" },
  { title: "Combined Funerals", date: "25 Jun 2026", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&q=80" },
  { title: "Crossing A Dawn", date: "10 Jun 2026", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&q=80" },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const [lang, setLang] = useState<"EN" | "KH">("EN")
  const [activePanel, setActivePanel] = useState<"search" | "location" | "notification" | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const closeAll = () => setActivePanel(null)

  const togglePanel = (panel: "search" | "location" | "notification") => {
    setActivePanel((prev) => (prev === panel ? null : panel))
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node
    const isOutside =
      !searchRef.current?.contains(target) &&
      !locationRef.current?.contains(target) &&
      !notificationRef.current?.contains(target)
    if (isOutside) closeAll()
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {activePanel && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeAll}
        />
      )}

      <header className="relative z-50 w-full border-b border-[#2a2522] bg-gradient-to-b from-[#1a1513]/95 to-[#120f0e]/98">
        {/* TOP ROW */}
        <div className="relative flex items-center justify-between h-[75px] px-[8%] border-b border-white/10">
          {/* Search */}
          <div ref={searchRef} className="relative w-[260px] z-[1010]">
            <input
              type="text"
              placeholder="Search Movies..."
              onFocus={() => setActivePanel("search")}
              className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-[#8a8a8a] outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8a8a] pointer-events-none" />

            <div
              className={cn(
                "absolute top-[70px] left-0 w-[400px] max-h-[450px] overflow-y-auto bg-black border border-[#2a2522] rounded-lg shadow-2xl p-5",
                activePanel === "search" ? "block" : "hidden",
              )}
            >
              <h2 className="text-xl font-semibold mb-4 text-white">Search</h2>
              {movies.map((movie) => (
                <div
                  key={movie.title}
                  className="flex gap-4 py-3 border-b border-white/5 last:border-none"
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-[55px] h-[75px] rounded object-cover bg-[#222]"
                  />
                  <div>
                    <h4 className="text-[15px] font-semibold text-white">{movie.title}</h4>
                    <p className="text-xs text-[#8a8a8a]">{movie.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <svg className="h-[38px] w-[38px]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#logoFilter)">
                <path d="M19.6854 35.433H31.4967C33.6711 35.433 35.4337 37.1957 35.4337 39.37H19.6854C8.81316 39.37 0 30.557 0 19.685C0 8.81297 8.81316 0 19.6854 0C30.5577 0 39.3708 8.81297 39.3708 19.685C39.3771 23.9453 37.995 28.0916 35.4337 31.496C32.8326 31.496 31.4863 29.1716 32.8165 26.9363C33.3853 25.9805 33.889 24.7156 34.2355 22.4689C34.7973 18.8262 35.0788 14.7183 33.1774 11.5609C31.2759 8.40351 28.3273 6.01304 24.8448 4.80577C21.3623 3.59851 17.5667 3.65093 14.119 4.95392C10.6712 6.25691 7.78966 8.72791 5.97617 11.9366C4.16268 15.1453 3.53212 18.8885 4.19429 22.5142C4.85647 26.14 6.76943 29.4186 9.60005 31.7792C12.4307 34.1398 15.9996 35.4328 19.6854 35.433ZM19.6854 15.748C18.6412 15.748 17.6398 15.3332 16.9015 14.5949C16.1631 13.8565 15.7483 12.8552 15.7483 11.811C15.7483 10.7668 16.1631 9.76545 16.9015 9.02712C17.6398 8.28879 18.6412 7.874 19.6854 7.874C20.7296 7.874 21.731 8.28879 22.4693 9.02712C23.2077 9.76545 23.6225 10.7668 23.6225 11.811C23.6225 12.8552 23.2077 13.8565 22.4693 14.5949C21.731 15.3332 20.7296 15.748 19.6854 15.748ZM11.8112 23.622C10.7671 23.622 9.76565 23.2072 9.02731 22.4689C8.28896 21.7305 7.87416 20.7292 7.87416 19.685C7.87416 18.6408 8.28896 17.6395 9.02731 16.9011C9.76565 16.1628 10.7671 15.748 11.8112 15.748C12.8554 15.748 13.8568 16.1628 14.5952 16.9011C15.3335 17.6395 15.7483 18.6408 15.7483 19.685C15.7483 20.7292 15.3335 21.7305 14.5952 22.4689C13.8568 23.2072 12.8554 23.622 11.8112 23.622ZM27.5596 23.622C26.5154 23.622 25.514 23.2072 24.7756 22.4689C24.0373 21.7305 23.6225 20.7292 23.6225 19.685C23.6225 18.6408 24.0373 17.6395 24.7756 16.9011C25.514 16.1628 26.5154 15.748 27.5596 15.748C28.6037 15.748 29.6052 16.1628 30.3435 16.9011C31.0819 17.6395 31.4967 18.6408 31.4967 19.685C31.4967 20.7292 31.0819 21.7305 30.3435 22.4689C29.6052 23.2072 28.6037 23.622 27.5596 23.622ZM19.6854 31.496C18.6412 31.496 17.6398 31.0812 16.9015 30.3429C16.1631 29.6045 15.7483 28.6032 15.7483 27.559C15.7483 26.5148 16.1631 25.5135 16.9015 24.7751C17.6398 24.0368 18.6412 23.622 19.6854 23.622C20.7296 23.622 21.731 24.0368 22.4693 24.7751C23.2077 25.5135 23.6225 26.5148 23.6225 27.559C23.6225 28.6032 23.2077 29.6045 22.4693 30.3429C21.731 31.0812 20.7296 31.496 19.6854 31.496Z" fill="#E50914"/>
              </g>
              <defs>
                <filter id="logoFilter" x="0" y="0" width="39.3708" height="42.0788" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="2.70965"/>
                  <feGaussianBlur stdDeviation="1.35482"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                </filter>
              </defs>
            </svg>
            <span className="font-serif text-[26px] leading-none tracking-wide text-white">
              CinePass
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/tickets"
              className="flex items-center gap-2 bg-[#2b2725] border border-[#3d3734] text-[#e5e5e5] px-4 py-2 rounded-full text-xs font-semibold"
            >
              <Ticket className="h-3.5 w-3.5" />
              Ticket
            </Link>

            {isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-[#2b2725] border border-[#3d3734] text-[#e5e5e5] px-4 py-2 rounded-full text-xs font-semibold"
              >
                <User className="h-3.5 w-3.5" />
                {user.name.split(" ")[0]}
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="flex items-center gap-2 bg-[#2b2725] border border-[#3d3734] text-[#e5e5e5] px-4 py-2 rounded-full text-xs font-semibold"
              >
                <User className="h-3.5 w-3.5" />
                Join Now
              </Link>
            )}

            {/* Notification Bell */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => togglePanel("notification")}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full bg-[#2b2725] border border-[#3d3734] text-[#e5e5e5] cursor-pointer",
                  activePanel === "notification" && "border-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.5)]",
                )}
              >
                <Bell className="h-4 w-4" />
              </button>

              <div
                className={cn(
                  "absolute top-[70px] right-0 w-[380px] min-h-[400px] bg-black border border-[#2a2522] rounded-lg shadow-2xl p-5 flex flex-col",
                  activePanel === "notification" ? "block" : "hidden",
                )}
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Notifications</h2>
                <div className="flex gap-2 mb-10">
                  <button className="bg-[#2b2725] border border-[#3d3734] text-white px-4 py-2 rounded-full text-xs font-semibold">
                    Announcement
                  </button>
                  <button className="bg-white/10 border border-transparent text-[#b3b3b3] px-4 py-2 rounded-full text-xs font-semibold">
                    Orders
                  </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center pb-8">
                  <div className="relative w-20 h-20 mb-5">
                    <Bell className="h-12 w-12 text-[#E50914]" />
                    <Send className="absolute top-1 -right-1 h-5 w-5 text-white -rotate-[10deg]" />
                  </div>
                  <p className="text-sm text-[#cccccc] leading-relaxed max-w-[220px]">
                    You don&apos;t have account yet, please create one
                  </p>
                </div>
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLang((prev) => (prev === "EN" ? "KH" : "EN"))}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#cbd5e1] cursor-pointer select-none px-2 py-1 rounded"
            >
              <img
                src={lang === "EN" ? "https://flagcdn.com/w20/gb.png" : "https://flagcdn.com/w20/kh.png"}
                alt={lang === "EN" ? "English Flag" : "Khmer Flag"}
                className="w-[18px] h-[18px] rounded-full object-cover"
              />
              <span>{lang}</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="relative flex items-center justify-between h-[45px] px-[8%]">
          <ul className="flex list-none gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-semibold text-[#b3b3b3]"
                  >
                    <link.icon className={cn("h-4 w-4", isActive && "text-[#E50914]")} />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Location Picker */}
          <div ref={locationRef} className="relative">
            <button
              onClick={() => togglePanel("location")}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#b3b3b3] cursor-pointer py-1"
            >
              <MapPin className="h-4 w-4 text-[#E50914]" />
              <span>All Cinemas</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  activePanel === "location" && "rotate-180",
                )}
              />
            </button>

            <div
              className={cn(
                "absolute top-[42px] right-0 w-[480px] bg-black border border-[#2a2522] rounded-lg shadow-2xl p-4",
                activePanel === "location" ? "block" : "hidden",
              )}
            >
              <div className="flex items-center gap-2.5 text-[#E50914] text-sm font-semibold p-2.5 bg-white/5 rounded cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>All Cinemas</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
