"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, ShoppingCart, User, Menu, X, LogOut, Settings } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { items } = useCart()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const adminData = localStorage.getItem("adminUser")

    if (userData) {
      setUser(JSON.parse(userData))
    } else if (adminData) {
      const admin = JSON.parse(adminData)
      setUser({ ...admin, role: "admin" })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">AgriMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
              Products
            </Link>
            <Link href="/ai-assistant" className="text-gray-700 hover:text-green-600 transition-colors">
              AI Assistant
            </Link>
            <Link href="/acre-measurement" className="text-gray-700 hover:text-green-600 transition-colors">
              Measure Acres
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {items.length}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-5 w-5 mr-2" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem onClick={() => router.push("/admin")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600">
                Products
              </Link>
              <Link href="/ai-assistant" className="text-gray-700 hover:text-green-600">
                AI Assistant
              </Link>
              <Link href="/acre-measurement" className="text-gray-700 hover:text-green-600">
                Measure Acres
              </Link>
              {user ? (
                <>
                  <Link href="/cart" className="flex items-center text-gray-700 hover:text-green-600">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({items.length})
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-green-600">
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="text-gray-700 hover:text-green-600">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-gray-700 hover:text-green-600">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
