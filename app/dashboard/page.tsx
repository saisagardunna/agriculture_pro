"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ProductGrid } from "@/components/products/product-grid"
import { CategoryFilter } from "@/components/filters/category-filter"
import { SearchBar } from "@/components/ui/search-bar"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Camera } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { items } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, searchQuery])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product: any) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Modern Agriculture Products</h1>
            <p className="text-xl mb-8 opacity-90">Discover premium quality agricultural products for modern farming</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/ai-assistant">
                <Button size="lg" variant="secondary" className="gap-2">
                  <User className="h-5 w-5" />
                  AI Assistant
                </Button>
              </Link>
              <Link href="/acre-measurement">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Camera className="h-5 w-5" />
                  Measure Acres
                </Button>
              </Link>
              <Link href="/cart">
                <Button size="lg" variant="secondary" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({items.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar placeholder="Search products..." value={searchQuery} onChange={setSearchQuery} />
          </div>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  )
}
