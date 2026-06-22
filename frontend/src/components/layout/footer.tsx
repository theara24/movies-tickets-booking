"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, Globe, MessageCircle, Camera, Play, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail("")
  }

  return (
    <footer className="bg-cinema-darker border-t border-border/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-gradient-gold">
                CinePremium
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience cinema like never before. Premium movies, premium comfort, 
              premium moments. Book your tickets and enjoy the show.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Camera className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Play className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/movies" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/showtimes" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Showtimes
                </Link>
              </li>
              <li>
                <Link href="/food" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Food & Beverage
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+855 23 999 999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@cinepremium.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe for exclusive deals, new releases, and cinema updates.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-cinema-dark border-border/60 focus-visible:ring-gold"
              />
              <Button type="submit" size="icon" className="shrink-0 bg-gold text-cinema-dark hover:bg-gold-light">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CinePremium. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-gold transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
