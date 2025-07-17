"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, RotateCcw, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AcreMeasurementPage() {
  const [image, setImage] = useState<string | null>(null)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [measurement, setMeasurement] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setPoints([])
        setMeasurement(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setPoints((prev) => [...prev, { x, y }])
  }, [])

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw points
      points.forEach((point, index) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "red"
        ctx.fill()
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.fillText((index + 1).toString(), point.x - 3, point.y + 3)
      })

      // Draw lines between points
      if (points.length > 1) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        if (points.length > 2) {
          ctx.lineTo(points[0].x, points[0].y) // Close the polygon
        }
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
    img.src = image
  }, [image, points])

  const calculateArea = async () => {
    if (points.length < 3) {
      toast({
        title: "Error",
        description: "Please mark at least 3 points to calculate area",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/ai/calculate-area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points, imageData: image }),
      })

      const data = await response.json()

      if (response.ok) {
        setMeasurement(data.acres)
        toast({
          title: "Success",
          description: `Area calculated: ${data.acres} acres`,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to calculate area",
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
      setIsProcessing(false)
    }
  }

  const resetMeasurement = () => {
    setPoints([])
    setMeasurement(null)
  }

  React.useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Acre Measurement</h1>
            <p className="text-gray-600">Upload an image and mark the boundaries to calculate area</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload and Canvas */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Image Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!image ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Upload an aerial image of your land</p>
                      <Button onClick={() => fileInputRef.current?.click()}>Choose Image</Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          onClick={handleCanvasClick}
                          className="max-w-full h-auto border rounded-lg cursor-crosshair"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Change Image
                        </Button>
                        <Button onClick={resetMeasurement} variant="outline">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset Points
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Controls and Results */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>1. Upload an aerial image of your land</p>
                  <p>2. Click on the image to mark boundary points</p>
                  <p>3. Mark at least 3 points to form a polygon</p>
                  <p>4. Click "Calculate Area" to get the measurement</p>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Measurement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Points marked: {points.length}</p>
                    </div>
                    {measurement && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-lg font-semibold text-green-800">{measurement.toFixed(2)} acres</p>
                        <p className="text-sm text-green-600">({(measurement * 4047).toFixed(0)} sq meters)</p>
                      </div>
                    )}
                    <Button onClick={calculateArea} disabled={points.length < 3 || isProcessing} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      {isProcessing ? "Calculating..." : "Calculate Area"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>• Use high-resolution aerial images for better accuracy</p>
                  <p>• Mark points in clockwise or counter-clockwise order</p>
                  <p>• Ensure the image shows clear land boundaries</p>
                  <p>• Results are estimates based on image analysis</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
