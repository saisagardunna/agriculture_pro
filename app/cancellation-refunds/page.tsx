import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Clock, CreditCard, AlertCircle, CheckCircle, Phone } from "lucide-react"

export default function CancellationRefunds() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <RotateCcw className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation & Refunds</h1>
          <p className="text-xl text-gray-600">Easy returns and hassle-free refunds</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-green-600" />
                Order Cancellation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Before Shipment</h4>
                  <p className="text-gray-700">
                    You can cancel your order free of charge before it's shipped. Simply contact our customer service or
                    use your account dashboard to cancel.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">After Shipment</h4>
                  <p className="text-gray-700">
                    Once shipped, orders cannot be cancelled. However, you can return the items as per our return
                    policy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cancellation Timeline</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Orders can be cancelled within 2 hours of placement</li>
                    <li>Custom or personalized orders cannot be cancelled</li>
                    <li>Bulk orders may have different cancellation terms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Return Window</h4>
                  <p className="text-gray-700">
                    Items can be returned within 7 days of delivery for a full refund, provided they meet our return
                    conditions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Returnable Items</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Unused agricultural tools and equipment</li>
                    <li>Unopened fertilizer and pesticide packages</li>
                    <li>Seeds in original packaging (unopened)</li>
                    <li>Defective or damaged items</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Non-Returnable Items</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Opened seed packets</li>
                    <li>Used or damaged tools</li>
                    <li>Perishable items</li>
                    <li>Custom-made products</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Refund Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Refund Methods</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Original payment method (preferred)</li>
                    <li>Bank transfer (for cash on delivery orders)</li>
                    <li>Store credit (optional)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Processing Time</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Credit/Debit Cards: 5-7 business days</li>
                    <li>Net Banking: 3-5 business days</li>
                    <li>UPI/Wallets: 1-3 business days</li>
                    <li>Bank Transfer: 7-10 business days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refund Amount</h4>
                  <p className="text-gray-700">
                    Full refund including shipping charges (if the return is due to our error). For other returns,
                    shipping charges are non-refundable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Return Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Step 1: Initiate Return</h4>
                  <p className="text-gray-700">
                    Contact our customer service or use your account dashboard to initiate a return request.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 2: Return Authorization</h4>
                  <p className="text-gray-700">
                    We'll provide you with a Return Authorization Number and return shipping label.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 3: Package & Ship</h4>
                  <p className="text-gray-700">
                    Pack the items securely in original packaging and ship using our provided label.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Step 4: Processing</h4>
                  <p className="text-gray-700">
                    Once we receive and inspect the items, we'll process your refund within 2-3 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We offer exchanges for defective or damaged items within 7 days of delivery. Exchanges are subject to
                product availability.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Same product exchange only</li>
                <li>No size or variant changes</li>
                <li>Free exchange for defective items</li>
                <li>Customer pays shipping for preference-based exchanges</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">For cancellations, returns, or refund queries, please contact us:</p>
              <div className="space-y-2 text-gray-700">
                <p>Email: returns@agrimart.com</p>
                <p>Phone: +91 9999999999</p>
                <p>Support Hours: Monday to Saturday, 9 AM to 6 PM</p>
                <p>WhatsApp: +91 9999999999</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
