import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User, { IUser } from "@/models/User"

import jwt from "jsonwebtoken"

export async function GET(request: Request) {
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

    // Fetch all users
    const users = await User.find({}).select("-password").lean()
    console.log("Fetched users:", users.length)

    // Format users for frontend
    const formattedUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    return NextResponse.json({ success: true, data: formattedUsers }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching users:", error.message, error.stack)
    return NextResponse.json({ success: false, message: `Internal server error: ${error.message}` }, { status: 500 })
  }
}
