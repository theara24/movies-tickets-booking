"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HeadphonesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+855 23 999 999", detail: "Mon-Fri 8AM-8PM" },
  { icon: Mail, label: "Email", value: "hello@cinepremium.com", detail: "We reply within 24h" },
  { icon: MapPin, label: "Address", value: "#168, Street 163", detail: "Phnom Penh, Cambodia" },
  { icon: Clock, label: "Operating Hours", value: "8:00 AM - 10:00 PM", detail: "Every day including holidays" },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  const onSubmit = async (_data: ContactForm) => {
    setSubmitted(true)
    reset()
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-sm text-muted-foreground">We&apos;re here to help</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-cinema-surface/50 border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5 text-gold" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-8"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <Send className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-lg font-medium">Message Sent!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" {...register("name")} className="bg-cinema-dark/50" />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="bg-cinema-dark/50" />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" {...register("subject")} className="bg-cinema-dark/50" />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Describe your issue or question..."
                      {...register("message")}
                      className="flex w-full rounded-md border border-input bg-cinema-dark/50 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y min-h-[100px]"
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="bg-gold text-cinema-dark hover:bg-gold-light">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-cinema-surface/50 border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HeadphonesIcon className="h-5 w-5 text-gold" />
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon
                return (
                  <div key={info.label} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 shrink-0">
                      <Icon className="h-4 w-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{info.label}</p>
                      <p className="text-sm text-muted-foreground">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.detail}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="bg-cinema-surface/50 border-border/40">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-sm">Emergency Support</h3>
              <p className="text-xs text-muted-foreground">
                For urgent issues during a show or at the cinema, please contact the cinema directly.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gold" />
                <span>+855 23 888 168</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
