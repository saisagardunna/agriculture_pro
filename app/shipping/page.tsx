import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Clock, MapPin, Package, CreditCard, Phone } from "lucide-react"

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-xl text-gray-600">Fast and reliable delivery across India</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Shipping Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We currently ship to all major cities and towns across India. Our delivery network covers:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>All metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</li>
                <li>Tier 2 and Tier 3 cities</li>
                <li>Rural areas (subject to courier serviceability)</li>
                <li>Remote locations (additional charges may apply)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Delivery Timeframes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Standard Delivery</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>Metro cities: 2-4 business days</li>
                    <li>Other cities: 4-7 business days</li>
                    <li>Rural areas: 7-10 business days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Express Delivery</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>Metro cities: 1-2 business days</li>
                    <li>Other cities: 2-3 business days</li>
                    <li>Available for selected products</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Shipping Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Free Shipping</h4>
                  <p className="text-gray-700">
                    Enjoy free shipping on orders above ₹999 for standard delivery across India.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Standard Shipping Rates</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>Orders up to ₹500: ₹99</li>
                    <li>Orders ₹500-₹999: ₹49</li>
                    <li>Orders above ₹999: Free</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Express Shipping</h4>
                  <p className="text-gray-700">Express delivery charges: ₹199 (regardless of order value)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Order Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Processing Time</h4>
                  <p className="text-gray-700">
                    Orders are typically processed within 1-2 business days. During peak seasons, processing may take up
                    to 3 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Tracking</h4>
                  <p className="text-gray-700">
                    Once your order is shipped, you'll receive a tracking number via email and SMS to monitor your
                    package's progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Handling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Fragile Items</h4>
                  <p className="text-gray-700">
                    Delicate agricultural tools and equipment are packed with extra care using protective materials.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bulk Orders</h4>
                  <p className="text-gray-700">
                    Large quantity orders may require special shipping arrangements. Please contact us for custom
                    shipping solutions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hazardous Materials</h4>
                  <p className="text-gray-700">
                    Certain fertilizers and pesticides may have shipping restrictions. We comply with all safety
                    regulations for hazardous material transport.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Shipping Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">For any shipping-related queries or issues, please contact us:</p>
              <div className="space-y-2 text-gray-700">
                <p>Email: shipping@agrimart.com</p>
                <p>Phone: +91 9999999999</p>
                <p>Support Hours: Monday to Saturday, 9 AM to 6 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
