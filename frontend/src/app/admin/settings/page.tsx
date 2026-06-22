"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Save, Settings, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [cinemaName, setCinemaName] = useState("CinePremium")
  const [tagline, setTagline] = useState("Premium Movie Ticket Booking")
  const [standardPrice, setStandardPrice] = useState("5")
  const [vipPrice, setVipPrice] = useState("8")
  const [couplePrice, setCouplePrice] = useState("12")
  const [seatLockDuration, setSeatLockDuration] = useState("300")
  const [pointsPerKHR, setPointsPerKHR] = useState("0.01")
  const [silverThreshold, setSilverThreshold] = useState("1000")
  const [goldThreshold, setGoldThreshold] = useState("5000")
  const [platinumThreshold, setPlatinumThreshold] = useState("15000")
  const [abaEnabled, setAbaEnabled] = useState(true)
  const [creditCardEnabled, setCreditCardEnabled] = useState(true)
  const [debitCardEnabled, setDebitCardEnabled] = useState(true)
  const [khqrEnabled, setKhqrEnabled] = useState(true)

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast({ title: "Settings saved", description: "System settings have been updated", variant: "success" })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" })
    },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Configure your cinema system</p>
        </div>
        <Button
          className="bg-gold text-cinema-dark hover:bg-gold-dark"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {mutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Cinema Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center shrink-0">
                <Settings className="h-8 w-8 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Cinema Logo</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" /> Upload Logo
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cinemaName">Cinema Name</Label>
                <Input id="cinemaName" className="bg-cinema-dark border-border/60" value={cinemaName} onChange={(e) => setCinemaName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" className="bg-cinema-dark border-border/60" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Default Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Standard ($)</Label>
                <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>VIP ($)</Label>
                <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Couple ($)</Label>
                <Input type="number" step="0.5" className="bg-cinema-dark border-border/60" value={couplePrice} onChange={(e) => setCouplePrice(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Seat Lock Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-xs">
              <Label>Seat Lock Duration (seconds)</Label>
              <Input type="number" className="bg-cinema-dark border-border/60" value={seatLockDuration} onChange={(e) => setSeatLockDuration(e.target.value)} />
              <p className="text-xs text-muted-foreground">How long selected seats remain locked before being released</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Loyalty Points Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-xs">
              <Label>Points per KHR spent</Label>
              <Input type="number" step="0.001" className="bg-cinema-dark border-border/60" value={pointsPerKHR} onChange={(e) => setPointsPerKHR(e.target.value)} />
            </div>
            <Separator />
            <p className="text-sm font-medium text-foreground">Tier Thresholds (points)</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Silver</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={silverThreshold} onChange={(e) => setSilverThreshold(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Gold</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={goldThreshold} onChange={(e) => setGoldThreshold(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Platinum</Label>
                <Input type="number" className="bg-cinema-dark border-border/60" value={platinumThreshold} onChange={(e) => setPlatinumThreshold(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cinema-card border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Payment Gateway</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">ABA KHQR</p>
                  <p className="text-xs text-muted-foreground">Accept payments via ABA KHQR scan</p>
                </div>
                <Switch checked={khqrEnabled} onCheckedChange={setKhqrEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Credit Card</p>
                  <p className="text-xs text-muted-foreground">Accept Visa and Mastercard</p>
                </div>
                <Switch checked={creditCardEnabled} onCheckedChange={setCreditCardEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Debit Card</p>
                  <p className="text-xs text-muted-foreground">Accept local debit cards</p>
                </div>
                <Switch checked={debitCardEnabled} onCheckedChange={setDebitCardEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">ABA Account</p>
                  <p className="text-xs text-muted-foreground">Direct ABA account transfer</p>
                </div>
                <Switch checked={abaEnabled} onCheckedChange={setAbaEnabled} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
