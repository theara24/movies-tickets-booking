"use client"

import Link from "next/link"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#18171c] text-white px-[8%] py-[70px] pb-[30px] w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-10 mb-[50px]">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-3">
            <svg className="h-[38px] w-[38px]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#footerLogoFilter)">
                <path d="M19.6854 35.433H31.4967C33.6711 35.433 35.4337 37.1957 35.4337 39.37H19.6854C8.81316 39.37 0 30.557 0 19.685C0 8.81297 8.81316 0 19.6854 0C30.5577 0 39.3708 8.81297 39.3708 19.685C39.3771 23.9453 37.995 28.0916 35.4337 31.496C32.8326 31.496 31.4863 29.1716 32.8165 26.9363C33.3853 25.9805 33.889 24.7156 34.2355 22.4689C34.7973 18.8262 35.0788 14.7183 33.1774 11.5609C31.2759 8.40351 28.3273 6.01304 24.8448 4.80577C21.3623 3.59851 17.5667 3.65093 14.119 4.95392C10.6712 6.25691 7.78966 8.72791 5.97617 11.9366C4.16268 15.1453 3.53212 18.8885 4.19429 22.5142C4.85647 26.14 6.76943 29.4186 9.60005 31.7792C12.4307 34.1398 15.9996 35.4328 19.6854 35.433ZM19.6854 15.748C18.6412 15.748 17.6398 15.3332 16.9015 14.5949C16.1631 13.8565 15.7483 12.8552 15.7483 11.811C15.7483 10.7668 16.1631 9.76545 16.9015 9.02712C17.6398 8.28879 18.6412 7.874 19.6854 7.874C20.7296 7.874 21.731 8.28879 22.4693 9.02712C23.2077 9.76545 23.6225 10.7668 23.6225 11.811C23.6225 12.8552 23.2077 13.8565 22.4693 14.5949C21.731 15.3332 20.7296 15.748 19.6854 15.748ZM11.8112 23.622C10.7671 23.622 9.76565 23.2072 9.02731 22.4689C8.28896 21.7305 7.87416 20.7292 7.87416 19.685C7.87416 18.6408 8.28896 17.6395 9.02731 16.9011C9.76565 16.1628 10.7671 15.748 11.8112 15.748C12.8554 15.748 13.8568 16.1628 14.5952 16.9011C15.3335 17.6395 15.7483 18.6408 15.7483 19.685C15.7483 20.7292 15.3335 21.7305 14.5952 22.4689C13.8568 23.2072 12.8554 23.622 11.8112 23.622ZM27.5596 23.622C26.5154 23.622 25.514 23.2072 24.7756 22.4689C24.0373 21.7305 23.6225 20.7292 23.6225 19.685C23.6225 18.6408 24.0373 17.6395 24.7756 16.9011C25.514 16.1628 26.5154 15.748 27.5596 15.748C28.6037 15.748 29.6052 16.1628 30.3435 16.9011C31.0819 17.6395 31.4967 18.6408 31.4967 19.685C31.4967 20.7292 31.0819 21.7305 30.3435 22.4689C29.6052 23.2072 28.6037 23.622 27.5596 23.622ZM19.6854 31.496C18.6412 31.496 17.6398 31.0812 16.9015 30.3429C16.1631 29.6045 15.7483 28.6032 15.7483 27.559C15.7483 26.5148 16.1631 25.5135 16.9015 24.7751C17.6398 24.0368 18.6412 23.622 19.6854 23.622C20.7296 23.622 21.731 24.0368 22.4693 24.7751C23.2077 25.5135 23.6225 26.5148 23.6225 27.559C23.6225 28.6032 23.2077 29.6045 22.4693 30.3429C21.731 31.0812 20.7296 31.496 19.6854 31.496Z" fill="#E50914"/>
              </g>
              <defs>
                <filter id="footerLogoFilter" x="0" y="0" width="39.3708" height="42.0788" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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
            <span className="font-serif text-[28px] leading-none tracking-wide">
              CinePass
            </span>
          </Link>
          <p className="text-[#a4a3a8] text-sm leading-relaxed max-w-[260px]">
            Redefining the cinematic experience through luxury, technology, and pure storytelling magic.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-bold mb-6">Company</h3>
          <ul className="flex flex-col gap-5">
            <li>
              <Link href="/about" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/support/contact" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/cinemas" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                Cinema
              </Link>
            </li>
          </ul>
        </div>

        {/* More */}
        <div>
          <h3 className="text-lg font-bold mb-6">More</h3>
          <ul className="flex flex-col gap-5">
            <li>
              <Link href="/promotions" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                Promotions
              </Link>
            </li>
            <li>
              <Link href="/tickets" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                My Ticket
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                Term &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[#e1e0e5] text-[15px] font-medium hover:text-[#E50914] transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Payment */}
        <div>
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-6">Follow Our Social Media</h3>
            <div className="flex items-center gap-[18px]">
              <Link href="#" className="text-white hover:text-[#E50914] hover:-translate-y-[2px] transition-all" aria-label="Facebook">
                <FacebookIcon className="h-[22px] w-[22px]" />
              </Link>
              <Link href="#" className="text-white hover:text-[#E50914] hover:-translate-y-[2px] transition-all" aria-label="Instagram">
                <InstagramIcon className="h-[22px] w-[22px]" />
              </Link>
              <Link href="#" className="text-white hover:text-[#E50914] hover:-translate-y-[2px] transition-all" aria-label="YouTube">
                <YouTubeIcon className="h-[22px] w-[22px]" />
              </Link>
              <Link href="#" className="text-white hover:text-[#E50914] hover:-translate-y-[2px] transition-all" aria-label="TikTok">
                <TikTokIcon className="h-[22px] w-[22px]" />
              </Link>
              <Link href="#" className="text-white hover:text-[#E50914] hover:-translate-y-[2px] transition-all" aria-label="Telegram">
                <TelegramIcon className="h-[22px] w-[22px]" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-5">Payment</h3>
            <div className="flex items-center font-black text-2xl tracking-[1px] select-none">
              <span className="text-[#00bcd4] mr-1">ABA</span>
              <span className="text-[#e53935] mr-2.5 font-normal">&apos;</span>
              <span className="text-[#00bcd4] italic">PAYWAY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/12 pt-6 text-center">
        <p className="text-[#a4a3a8] text-xs flex items-center justify-center gap-1.5">
          All right reserved &copy; 2026
        </p>
      </div>
    </footer>
  )
}
