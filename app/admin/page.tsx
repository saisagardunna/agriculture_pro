"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Settings,
  BarChart3,
  ShoppingCart,
  Eye,
  Bell,
  Calendar,
  Activity,
  Zap,
  Shield,
  Crown,
  LogOut,
} from "lucide-react"
import { SalesChart } from "@/components/charts/sales-chart"
import { ProductsTable } from "@/components/admin/products-table"
import { useRouter } from "next/navigation"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { AdminNavbar } from "@/components/layout/admin-navbar" // Import AdminNavbar
import { LoadingSpinner } from "@/components/ui/loading-spinner" // Import LoadingSpinner
import { UsersTable } from "@/components/admin/users-table"

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [salesData, setSalesData] = useState([])
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  })
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true) // New state for page loading
  const { toast } = useToast()
  const router = useRouter()
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data)
      } else {
        const errorData = await response.json()
        console.error("Error fetching users:", errorData.message || response.statusText)
        toast({
          title: "Error",
          description: errorData.message || "Failed to fetch users.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Network error fetching users:", error)
      toast({
        title: "Error",
        description: "Network error while fetching users.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const initializeAdminPage = async () => {
      setPageLoading(true)
      // Check admin authentication
      const adminToken = localStorage.getItem("adminToken")
      const adminUserData = localStorage.getItem("adminUser")

      if (!adminToken || !adminUserData) {
        router.push("/admin/login")
        return
      }

      setAdminUser(JSON.parse(adminUserData))

      // Fetch data concurrently
      await Promise.all([fetchProducts(), fetchSalesData(), fetchStats(), fetchUsers()])
      setPageLoading(false)
    }

    initializeAdminPage()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      console.log("Admin Token for Fetch Products:", token) // Log for debugging
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        const errorData = await response.json()
        console.error("Error fetching products:", errorData.message || response.statusText)
        toast({
          title: "Error",
          description: errorData.message || "Failed to fetch products.",
          variant: "destructive",
        })
        // If unauthorized, redirect to login
        if (response.status === 401) {
          router.push("/admin/login")
        }
      }
    } catch (error) {
      console.error("Network error fetching products:", error)
      toast({
        title: "Error",
        description: "Network error while fetching products.",
        variant: "destructive",
      })
    }
  }

  const fetchSalesData = async () => {
    try {
      const response = await fetch("/api/admin/sales")
      const data = await response.json()
      setSalesData(data)
    } catch (error) {
      console.error("Error fetching sales data:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category"),
      stock: Number.parseInt(formData.get("stock") as string),
      image: formData.get("image"),
    }

    try {
      const token = localStorage.getItem("adminToken")
      console.log("Admin Token for Add Product:", token)
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added successfully!",
        })
        setIsAddingProduct(false)
        fetchProducts() // Re-fetch products to update the table
        e.currentTarget.reset()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to add product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!adminUser) {
    // This case should ideally be handled by the router.push in useEffect,
    // but as a fallback, show a loading spinner or redirect.
    return (
      <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <AdminNavbar /> {/* Add AdminNavbar here */}
      {/* Admin Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-b border-white/10">
        <div className="absolute inset-0 noise-texture opacity-30"></div>
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="animate-scale-in">
                <Avatar className="w-16 h-16 ring-4 ring-white/20 animate-pulse-glow">
                  <AvatarImage src={adminUser.profileImage || "/placeholder.svg?height=64&width=64"} />
                  <AvatarFallback className="text-xl font-bold bg-gradient-primary text-white">
                    {adminUser.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="animate-slide-in-left">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {adminUser.name}!</h1>
                <p className="text-white/80 mb-3">{adminUser.email}</p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Crown className="w-4 h-4 mr-2" />
                    Administrator
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="glass-effect text-white border-white/30 hover:bg-white/10 bg-transparent"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="glass-effect text-white border-white/30 hover:bg-white/10 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 glass-effect border-0 shadow-xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Cards */}
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect border-0 shadow-2xl stagger-item interactive-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Total Sales</p>
                        <p className="text-3xl font-bold text-green-600">
                          <AnimatedCounter end={stats.totalSales} prefix="₹" />
                        </p>
                        <p className="text-xs text-green-600 mt-1">+20.1% from last month</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl glow-green">
                        <DollarSign className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-2xl stagger-item interactive-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-600">
                          <AnimatedCounter end={stats.totalOrders} />
                        </p>
                        <p className="text-xs text-blue-600 mt-1">+15% from last month</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl glow-blue">
                        <Package className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-2xl stagger-item interactive-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Total Products</p>
                        <p className="text-3xl font-bold text-purple-600">
                          <AnimatedCounter end={stats.totalProducts} />
                        </p>
                        <p className="text-xs text-purple-600 mt-1">+5 new this month</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-2xl glow-purple">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-2xl stagger-item interactive-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Total Users</p>
                        <p className="text-3xl font-bold text-orange-600">
                          <AnimatedCounter end={stats.totalUsers} />
                        </p>
                        <p className="text-xs text-orange-600 mt-1">+12% from last month</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* Sales Chart */}
            <ScrollReveal delay={200}>
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Activity className="w-6 h-6 text-green-600" />
                        Sales Analytics
                      </CardTitle>
                      <CardDescription>Real-time sales performance and trends</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Live</Badge>
                      <Button variant="outline" size="sm" className="magnetic bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SalesChart data={salesData} />
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Quick Actions */}
            <ScrollReveal delay={400}>
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setIsAddingProduct(true)}
                      className="h-20 gradient-primary text-white border-0 shadow-xl magnetic"
                    >
                      <Plus className="w-6 h-6 mr-2" />
                      Add New Product
                    </Button>
                    <Button className="h-20 gradient-secondary text-white border-0 shadow-xl magnetic">
                      <Users className="w-6 h-6 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="h-20 gradient-accent text-white border-0 shadow-xl magnetic">
                      <BarChart3 className="w-6 h-6 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <ScrollReveal>
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Package className="w-6 h-6 text-green-600" />
                        Products Management
                      </CardTitle>
                      <CardDescription>Add, edit, and manage your product inventory</CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsAddingProduct(true)}
                      className="gradient-primary text-white border-0 shadow-xl magnetic"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAddingProduct && (
                    <Card className="mb-6 glass-effect border-0 shadow-xl animate-scale-in">
                      <CardHeader>
                        <CardTitle className="text-xl">Add New Product</CardTitle>
                        <CardDescription>Fill in the details to add a new product to your inventory</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddProduct} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-medium">
                                Product Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Enter product name"
                                className="glass-effect border-0"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="category" className="text-sm font-medium">
                                Category
                              </Label>
                              <Select name="category" required>
                                <SelectTrigger className="glass-effect border-0">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="seeds">Seeds</SelectItem>
                                  <SelectItem value="fertilizers">Fertilizers</SelectItem>
                                  <SelectItem value="tools">Tools</SelectItem>
                                  <SelectItem value="pesticides">Pesticides</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="price" className="text-sm font-medium">
                                Price (₹)
                              </Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="glass-effect border-0"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stock" className="text-sm font-medium">
                                Stock Quantity
                              </Label>
                              <Input
                                id="stock"
                                name="stock"
                                type="number"
                                placeholder="0"
                                className="glass-effect border-0"
                                required
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="image" className="text-sm font-medium">
                                Image URL
                              </Label>
                              <Input
                                id="image"
                                name="image"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="glass-effect border-0"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder="Enter product description"
                              rows={4}
                              className="glass-effect border-0"
                              required
                            />
                          </div>
                          <div className="flex gap-4">
                            <Button type="submit" className="gradient-primary text-white border-0 shadow-xl magnetic">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Product
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddingProduct(false)}
                              className="glass-effect border-0 bg-transparent"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  <div className="animate-slide-up">
                    <ProductsTable products={products} onProductsChange={fetchProducts} />
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <ScrollReveal>
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                    Order Management
                  </CardTitle>
                  <CardDescription>Track and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management Coming Soon</h3>
                    <p className="text-gray-600">
                      Advanced order tracking and management features will be available here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <ScrollReveal>
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-600" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage customer accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersTable users={users} onUsersChange={fetchUsers} />
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <ScrollReveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      System Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Maintenance Mode</span>
                      <Button variant="outline" size="sm">
                        Disabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Auto Backup</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Email Notifications</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Change Admin Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      API Key Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Audit Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
