import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet, BanknoteIcon } from "lucide-react"

export default function PaymentMethods({
  selectedPayment,
  setSelectedPayment,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="space-y-4"
        >        
          {/* Cash on Delivery */}
          <div className="flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted">
            <RadioGroupItem value="cod" id="cod" />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BanknoteIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cod" className="font-medium">
                  Cash on Delivery
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay when you receive
                </p>
              </div>
            </div>
          </div>

          {/* Online Payment */}
          <div className="flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted">
            <RadioGroupItem value="online" id="online" />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="online" className="font-medium">
                  Online Payment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay securely with your card
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Payment */}
          <div className="flex items-center space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted">
            <RadioGroupItem value="wallet" id="wallet" />
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wallet" className="font-medium">
                  Wallet Payment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay using your wallet
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
