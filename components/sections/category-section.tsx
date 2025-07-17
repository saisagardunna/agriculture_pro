import { Card, CardContent } from "@/components/ui/card"
import { Sprout, Zap, Wrench, Shield } from "lucide-react"
import Link from "next/link"

export function CategorySection() {
  const categories = [
    {
      name: "Seeds",
      icon: Sprout,
      description: "Premium quality seeds for all crops",
      color: "bg-green-100 text-green-600",
      href: "/dashboard?category=seeds",
    },
    {
      name: "Fertilizers",
      icon: Zap,
      description: "Organic and chemical fertilizers",
      color: "bg-blue-100 text-blue-600",
      href: "/dashboard?category=fertilizers",
    },
    {
      name: "Tools",
      icon: Wrench,
      description: "Modern farming tools and equipment",
      color: "bg-orange-100 text-orange-600",
      href: "/dashboard?category=tools",
    },
    {
      name: "Pesticides",
      icon: Shield,
      description: "Safe and effective pest control",
      color: "bg-purple-100 text-purple-600",
      href: "/dashboard?category=pesticides",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find everything you need for modern agriculture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
