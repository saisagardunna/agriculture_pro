import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { points, imageData } = await request.json()

    // Simple polygon area calculation using shoelace formula
    function calculatePolygonArea(vertices: { x: number; y: number }[]) {
      let area = 0
      const n = vertices.length

      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        area += vertices[i].x * vertices[j].y
        area -= vertices[j].x * vertices[i].y
      }

      return Math.abs(area) / 2
    }

    const pixelArea = calculatePolygonArea(points)

    // Convert pixel area to acres (this is a simplified conversion)
    // In a real application, you would need to know the scale of the image
    // For demo purposes, we'll use an estimated conversion factor
    const pixelsPerAcre = 10000 // This would need to be calibrated based on image scale
    const acres = pixelArea / pixelsPerAcre

    return NextResponse.json({ acres: Math.max(acres, 0.1) })
  } catch (error) {
    console.error("Area calculation error:", error)
    return NextResponse.json({ message: "Failed to calculate area" }, { status: 500 })
  }
}
