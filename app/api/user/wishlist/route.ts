import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const userData = await User.findById(user.userId).populate("wishlist", "name price image category")

    return NextResponse.json(userData?.wishlist || [])
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    await connectDB()
    const userData = await User.findById(user.userId)

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if product is already in wishlist
    if (userData.wishlist?.includes(productId)) {
      return NextResponse.json({ message: "Product already in wishlist" }, { status: 400 })
    }

    // Add product to wishlist
    userData.wishlist = userData.wishlist || []
    userData.wishlist.push(productId)
    await userData.save()

    return NextResponse.json({ message: "Product added to wishlist" })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    await connectDB()
    const userData = await User.findById(user.userId)

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Remove product from wishlist
    userData.wishlist = userData.wishlist?.filter((id) => id.toString() !== productId) || []
    await userData.save()

    return NextResponse.json({ message: "Product removed from wishlist" })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
