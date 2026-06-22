"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: "Booking",
    question: "How do I book a movie ticket?",
    answer:
      "Browse our movie selection, choose your preferred cinema, date, and showtime. Select your seats, add any food & beverage items, then proceed to payment. Once confirmed, you'll receive a QR code for entry.",
  },
  {
    category: "Booking",
    question: "Can I cancel or modify my booking?",
    answer:
      "You can cancel your booking from the My Tickets page. Cancellations made at least 2 hours before the showtime are eligible for a full refund. Modifications are not currently supported; please cancel and rebook.",
  },
  {
    category: "Booking",
    question: "How many tickets can I book at once?",
    answer:
      "You can book up to 10 tickets per transaction. For group bookings larger than 10, please contact our support team for assistance.",
  },
  {
    category: "Booking",
    question: "Can I choose specific seats?",
    answer:
      "Yes! Our seat selection interface lets you pick your preferred seats. You can see which seats are available (green), VIP (gold), couple (purple), or already booked (red).",
  },
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept KHQR (scan with any Cambodian banking app), credit cards (Visa, Mastercard, UnionPay), debit cards, and CinePremium account balance.",
  },
  {
    category: "Payment",
    question: "Is my payment information secure?",
    answer:
      "Yes, all payments are processed through secure, encrypted connections. We do not store your credit card details on our servers. KHQR payments are processed through Cambodia's central bank system.",
  },
  {
    category: "Payment",
    question: "How do I use a promotion code?",
    answer:
      "Enter your promotion code in the 'Promotion Code' field on the booking summary page and click 'Apply'. The discount will be reflected in your total before payment.",
  },
  {
    category: "Payment",
    question: "Do you offer refunds?",
    answer:
      "Refunds are available for cancellations made at least 2 hours before the showtime. Processing time may vary depending on your payment method.",
  },
  {
    category: "Tickets",
    question: "How do I get my tickets?",
    answer:
      "Your tickets are digital. After successful payment, you can view them in the 'My Tickets' section. A QR code will be generated for each booking - present this at the cinema entrance for scanning.",
  },
  {
    category: "Tickets",
    question: "Do I need to print my ticket?",
    answer:
      "No printing is required. Simply show the QR code from your phone at the cinema entrance. You can also download the ticket for offline access.",
  },
  {
    category: "Tickets",
    question: "Can I transfer my ticket to someone else?",
    answer:
      "Yes, you can transfer your ticket by sharing the QR code or booking ID with another person. Please note that the ticket can only be scanned once.",
  },
  {
    category: "Cinema",
    question: "What time should I arrive at the cinema?",
    answer:
      "We recommend arriving at least 15-20 minutes before the showtime to allow time for ticket scanning, food collection, and finding your seat.",
  },
  {
    category: "Cinema",
    question: "What food & beverage options are available?",
    answer:
      "We offer a wide selection including popcorn, drinks, snacks, candy, hot food, and combo packages. You can pre-order online or purchase at the concession stand.",
  },
  {
    category: "Cinema",
    question: "Are outside food and drinks allowed?",
    answer:
      "Outside food and drinks are not permitted in the cinema. We offer a variety of food and beverage options for purchase at our concession stands.",
  },
  {
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Click on 'Sign Up' in the navigation bar and fill in your details. You'll need to provide your name, email, phone number, and create a password. Registration is free!",
  },
  {
    category: "Account",
    question: "How do loyalty points work?",
    answer:
      "You earn 1 point for every 1,000 KHR spent on ticket purchases. Points accumulate and determine your loyalty tier (Bronze, Silver, Gold, Platinum). Higher tiers unlock exclusive benefits and discounts.",
  },
  {
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Click on 'Forgot Password?' on the login page and enter your email address. We'll send you a link to reset your password.",
  },
  {
    category: "Account",
    question: "Can I update my personal information?",
    answer:
      "Yes, you can update your name, email, and phone number in the Settings section of your profile. You can also change your password there.",
  },
]

const categories = ["Booking", "Payment", "Tickets", "Cinema", "Account"]

export default function FAQPage() {
  const [search, setSearch] = useState("")
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState("Booking")

  const filtered = faqs.filter(
    (faq) =>
      (activeCategory === "All" || faq.category === activeCategory) &&
      (faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())),
  )

  const toggleItem = (question: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(question)) {
        next.delete(question)
      } else {
        next.add(question)
      }
      return next
    })
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-muted-foreground">Find answers to common questions</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-cinema-dark/50"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory("All")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === "All" ? "bg-gold text-cinema-dark" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-gold text-cinema-dark"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <HelpCircle className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm text-muted-foreground">Try a different search term or category</p>
        </div>
      ) : (
        <div className="max-w-3xl space-y-2">
          {filtered.map((faq, idx) => {
            const isOpen = openItems.has(faq.question)
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card
                  className={`bg-cinema-surface/50 border-border/40 cursor-pointer transition-colors hover:border-gold/30 ${
                    isOpen ? "border-gold/30" : ""
                  }`}
                  onClick={() => toggleItem(faq.question)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium leading-tight">{faq.question}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 mt-0.5"
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground pt-3 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
