"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Package,
  CreditCard,
  Settings,
  Bell,
  Shield,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const adminData = localStorage.getItem("adminUser")

    if (userData) {
      setUser(JSON.parse(userData))
    } else if (adminData) {
      setUser(JSON.parse(adminData))
    } else {
      router.push("/login")
    }

    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch user orders and wishlist
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken")
      if (token) {
        // Fetch orders
        const ordersResponse = await fetch("/api/user/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrders(ordersData)
        }

        // Fetch wishlist
        const wishlistResponse = await fetch("/api/user/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json()
          setWishlist(wishlistData)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const profileData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipCode: formData.get("zipCode"),
        country: formData.get("country"),
      },
      bio: formData.get("bio"),
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken")
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setIsEditing(false)
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-mesh">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 noise-texture"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-scale-in">
              <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-white/20 animate-pulse-glow">
                <AvatarImage src={user.profileImage || "/placeholder.svg?height=128&width=128"} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-primary text-white">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="animate-slide-up">
              <h1 className="text-responsive-xl font-bold text-white mb-4">{user.name}</h1>
              <p className="text-xl text-white/80 mb-6">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <User className="w-4 h-4 mr-2" />
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since 2024
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 glass-effect">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                  <Card className="glass-effect border-0 shadow-2xl animate-slide-in-left">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">Personal Information</CardTitle>
                          <CardDescription>Manage your personal details and preferences</CardDescription>
                        </div>
                        <Button
                          variant={isEditing ? "destructive" : "outline"}
                          onClick={() => setIsEditing(!isEditing)}
                          className="magnetic"
                        >
                          {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                          {isEditing ? "Cancel" : "Edit"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input id="name" name="name" defaultValue={user.name} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" name="email" type="email" defaultValue={user.email} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input id="phone" name="phone" defaultValue={user.phone} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" name="city" defaultValue={user.address?.city} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input id="street" name="street" defaultValue={user.address?.street} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Input id="state" name="state" defaultValue={user.address?.state} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zipCode">ZIP Code</Label>
                              <Input id="zipCode" name="zipCode" defaultValue={user.address?.zipCode} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country">Country</Label>
                              <Input id="country" name="country" defaultValue={user.address?.country} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={user.bio} rows={3} />
                          </div>

                          <Button type="submit" disabled={isLoading} className="btn-primary gradient-primary">
                            {isLoading ? (
                              <div className="loading-dots mr-2">
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Changes
                          </Button>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-semibold">{user.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">{user.phone || "Not provided"}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-semibold">
                                  {user.address?.city ? `${user.address.city}, ${user.address.state}` : "Not provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                          {user.bio && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 mb-2">Bio</p>
                              <p className="text-gray-700">{user.bio}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <Card className="glass-effect border-0 shadow-xl animate-scale-in">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Total Orders</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{orders.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Wishlist Items</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{wishlist.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Star className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Reviews</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">12</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Two-Factor Auth</span>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verified</span>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Phone Verified</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Order History</CardTitle>
                  <CardDescription>Track your orders and purchase history</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                      <Button className="gradient-primary">Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any, index) => (
                        <div key={index} className="stagger-item p-6 border rounded-lg hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">Order #12345</h4>
                              <p className="text-sm text-gray-600">Placed on March 15, 2024</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">₹2,450</span>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card className="glass-effect border-0 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">My Wishlist</CardTitle>
                  <CardDescription>Items you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
                      <Button className="gradient-primary">Browse Products</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((item: any, index) => (
                        <div key={index} className="stagger-item product-card p-4 border rounded-lg">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                          <h4 className="font-semibold mb-2">Product Name</h4>
                          <p className="text-lg font-bold text-green-600 mb-4">₹999</p>
                          <Button className="w-full">Add to Cart</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-effect border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <Button variant="outline" size="sm">
                        Disabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push Notifications</span>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Enable Two-Factor Auth
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-effect border-0 shadow-xl stagger-item">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold">₹12,450</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-xl stagger-item">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Items Purchased</p>
                        <p className="text-2xl font-bold">47</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-effect border-0 shadow-xl stagger-item">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Order Value</p>
                        <p className="text-2xl font-bold">₹2,650</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
