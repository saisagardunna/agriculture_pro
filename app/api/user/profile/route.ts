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
    const userData = await User.findById(user.userId).select("-password")

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const updateData = await request.json()

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, select: "-password" },
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
