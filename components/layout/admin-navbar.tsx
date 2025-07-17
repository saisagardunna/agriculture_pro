"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, Bell, Settings, LogOut, Menu, X, Crown, BarChart3 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [admin, setAdmin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem("adminUser")
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl sticky top-0 z-50 border-b border-white/10">
      <div className="absolute inset-0 noise-texture opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-xl glow-green">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AgriMart</span>
              <Badge className="ml-2 bg-white/20 text-white border-white/30 text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/admin" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-white/80 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/admin/orders" className="text-white/80 hover:text-white transition-colors">
              Orders
            </Link>
            <Link href="/admin/users" className="text-white/80 hover:text-white transition-colors">
              Users
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {admin && (
              <>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-3 text-white hover:bg-white/10">
                      <Avatar className="w-8 h-8 ring-2 ring-white/20">
                        <AvatarImage src={admin.profileImage || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback className="text-sm bg-gradient-primary text-white">
                          {admin.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{admin.name}</span>
                        <span className="text-xs text-white/70">{admin.email}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect border-0 shadow-2xl">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Administrator
                      </Badge>
                    </div>
                    <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/")}>
                      <Leaf className="h-4 w-4 mr-2" />
                      View Site
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/admin" className="text-white/80 hover:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-white/80 hover:text-white">
                Products
              </Link>
              <Link href="/admin/orders" className="text-white/80 hover:text-white">
                Orders
              </Link>
              <Link href="/admin/users" className="text-white/80 hover:text-white">
                Users
              </Link>
              {admin && (
                <>
                  <Link href="/admin/profile" className="text-white/80 hover:text-white">
                    Profile Settings
                  </Link>
                  <Link href="/" className="text-white/80 hover:text-white">
                    View Site
                  </Link>
                  <button onClick={handleLogout} className="text-left text-white/80 hover:text-white">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
