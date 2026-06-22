"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { XCircle, RefreshCw, HeadphonesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function PaymentFailedPage() {
  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment Failed</h1>
          <p className="text-muted-foreground">
            Something went wrong with your payment. Please try again or contact support.
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p>Common reasons for failure:</p>
          <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
            <li>Insufficient balance in your account</li>
            <li>Network timeout or connection issue</li>
            <li>Card declined by your bank</li>
            <li>Invalid or expired payment method</li>
          </ul>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1 bg-gold text-cinema-dark hover:bg-gold-light font-semibold" asChild>
            <Link href="/payment">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link href="/support/contact">
              <HeadphonesIcon className="h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>

        <Button variant="link" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </motion.div>
    </div>
  )
}
