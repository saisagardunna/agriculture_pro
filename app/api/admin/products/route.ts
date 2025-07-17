import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { verifyAdminToken, hasPermission } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin || !hasPermission(admin.permissions, "manage_products")) {
      return NextResponse.json({ message: "Unauthorized admin access" }, { status: 401 })
    }

    await connectDB()
    const products = await Product.find().sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin || !hasPermission(admin.permissions, "manage_products")) {
      return NextResponse.json({ message: "Unauthorized admin access" }, { status: 401 })
    }

    await connectDB()
    const productData = await request.json()

    const product = await Product.create({
      ...productData,
      createdBy: admin.adminId,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
