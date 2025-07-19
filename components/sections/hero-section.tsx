"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Zap, Shield, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="absolute inset-0 noise-texture"></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Interactive Cursor Effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/90">AI-Powered Agriculture Platform</span>
              </div>

              <h1 className="text-responsive-xl font-bold text-white leading-tight">
                Modern Agriculture
                <span className="block text-gradient animate-gradient">Made Simple</span>
              </h1>

              <p className="text-responsive-md text-white/80 leading-relaxed max-w-2xl">
                Discover premium quality agricultural products, AI-powered farming solutions, and expert guidance for
                modern agriculture. Transform your farming experience with cutting-edge technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group btn-primary gradient-primary text-white border-0 shadow-2xl magnetic"
                >
                  Shop Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-effect text-white border-white/30 hover:bg-white/10 magnetic bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try AI Assistant
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center stagger-item">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-green">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg">Organic Products</h3>
                <p className="text-sm text-white/70">100% natural and certified</p>
              </div>
              <div className="text-center stagger-item">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-blue">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg">AI Powered</h3>
                <p className="text-sm text-white/70">Smart farming solutions</p>
              </div>
              <div className="text-center stagger-item">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-purple">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg">Quality Assured</h3>
                <p className="text-sm text-white/70">Tested and verified</p>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative z-10">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=600&width=600"
                  alt="Modern Agriculture"
                  className="w-full h-auto rounded-3xl shadow-2xl animate-float"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse morph-shape"></div>
            <div
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse morph-shape"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Floating Cards */}
            <div
              className="absolute top-10 -left-6 glass-effect p-4 rounded-xl shadow-2xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">10,000+</p>
                  <p className="text-white/70 text-sm">Happy Farmers</p>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-10 -right-6 glass-effect p-4 rounded-xl shadow-2xl animate-float"
              style={{ animationDelay: "3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">99%</p>
                  <p className="text-white/70 text-sm">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
