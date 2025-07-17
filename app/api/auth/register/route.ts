import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, phone } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "customer",
    })

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    })

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
