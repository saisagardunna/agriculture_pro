import { Card, CardContent } from "@/components/ui/card"
import { Users, Package, Award, Globe } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Farmers",
      color: "text-green-600",
    },
    {
      icon: Package,
      value: "5,000+",
      label: "Products Sold",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "99%",
      label: "Customer Satisfaction",
      color: "text-purple-600",
    },
    {
      icon: Globe,
      value: "50+",
      label: "Cities Served",
      color: "text-orange-600",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Trusted by farmers across the country</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
