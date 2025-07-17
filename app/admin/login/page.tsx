"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
        })
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminUser", JSON.stringify(data.user))
        router.push("/admin")
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid admin credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-300">Secure access to AgriMart administration</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Admin Sign In</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@agrimart.com"
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Admin"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-300 hover:text-white text-sm">
                ← Back to main site
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Need admin access? Contact system administrator</p>
        </div>
      </div>
    </div>
  )
}
