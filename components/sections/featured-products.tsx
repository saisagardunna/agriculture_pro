"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye, Zap, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data.slice(0, 6))
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Featured Products</span>
          </div>
          <h2 className="text-responsive-lg font-bold text-gray-900 mb-6">Premium Agriculture Products</h2>
          <p className="text-responsive-md text-gray-600 max-w-3xl mx-auto">
            Discover our most popular agricultural products trusted by farmers worldwide. Each product is carefully
            selected for quality and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any, index) => (
            <Card
              key={product._id}
              className={`product-card group overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm stagger-item ${
                hoveredProduct === product._id ? "scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=400"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800 shadow-lg">{product.category}</Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full shadow-lg">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="w-10 h-10 p-0 rounded-full shadow-lg">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">per unit</span>
                  </div>
                  <Badge variant={product.stock > 10 ? "default" : "destructive"} className="text-xs">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </Badge>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  className="w-full gradient-primary text-white border-0 shadow-lg magnetic"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            variant="outline"
            className="magnetic glass-effect border-green-200 hover:bg-green-50 bg-transparent"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
