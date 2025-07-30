import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User, { IUser } from "@/models/User"

import jwt from "jsonwebtoken"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 })
    }

    // Verify admin token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { role: string }
      if (decoded.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 })
      }
    } catch (error: any) {
      console.error("JWT verification error:", error.message)
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    const { role } = await request.json()
    if (!["customer", "admin"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, { role }, { new: true }).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "User role updated successfully",
        data: {
          _id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          address: updatedUser.address,
          isEmailVerified: updatedUser.isEmailVerified,
          isPhoneVerified: updatedUser.isPhoneVerified,
          lastLogin: updatedUser.lastLogin,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error updating user role:", error.message, error.stack)
    return NextResponse.json({ success: false, message: `Internal server error: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 })
    }

    // Verify admin token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { role: string }
      if (decoded.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 })
      }
    } catch (error: any) {
      console.error("JWT verification error:", error.message)
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    const deletedUser = await User.findByIdAndDelete(params.id)

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error deleting user:", error.message, error.stack)
    return NextResponse.json({ success: false, message: `Internal server error: ${error.message}` }, { status: 500 })
  }
}
