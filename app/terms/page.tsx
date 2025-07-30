import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, ShoppingCart, AlertTriangle, Scale, Phone } from "lucide-react"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By accessing and using AgriMart's website and services, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Product Information and Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Product Descriptions</h4>
                <p className="text-gray-700">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product
                  descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Acceptance</h4>
                <p className="text-gray-700">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any
                  order for any reason at any time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p className="text-gray-700">
                  All prices are subject to change without notice. We reserve the right to modify prices at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">As a user of our service, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not interfere with the proper functioning of the website</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                AgriMart shall not be liable for any direct, indirect, incidental, special, or consequential damages
                resulting from:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Use or inability to use our services</li>
                <li>Unauthorized access to your data</li>
                <li>Errors or omissions in content</li>
                <li>Any other matter relating to our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                All content on this website, including text, graphics, logos, images, and software, is the property of
                AgriMart and is protected by copyright and other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you
                irrevocably submit to the exclusive jurisdiction of the courts in Hyderabad, India.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: legal@agrimart.com</p>
                <p>Phone: +91 9999999999</p>
                <p>Address: Hyderabad, India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
