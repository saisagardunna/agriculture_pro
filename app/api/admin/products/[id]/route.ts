import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Product } from "@/models/Product"
import { verifyAdminToken, hasPermission } from "@/lib/admin-auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin || !hasPermission(admin.permissions, "manage_products")) {
      return NextResponse.json({ message: "Unauthorized admin access" }, { status: 401 })
    }

    await connectDB()

    const product = await Product.findByIdAndDelete(params.id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin || !hasPermission(admin.permissions, "manage_products")) {
      return NextResponse.json({ message: "Unauthorized admin access" }, { status: 401 })
    }

    await connectDB()
    const updateData = await request.json()

    const product = await Product.findByIdAndUpdate(
      params.id,
      { ...updateData, updatedBy: admin.adminId },
      { new: true },
    )

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
