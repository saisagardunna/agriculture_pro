import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Admin } from "@/models/Admin"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY || "AGRIMART_ADMIN_2024"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, adminKey } = await request.json()

    // Verify admin registration key
    if (adminKey !== ADMIN_REGISTRATION_KEY) {
      return NextResponse.json({ message: "Invalid admin registration key" }, { status: 403 })
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      permissions: ["manage_products", "manage_orders", "manage_users", "view_analytics", "manage_categories"],
      isActive: true,
      createdAt: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: "admin",
        permissions: admin.permissions,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      message: "Admin account created successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
        permissions: admin.permissions,
      },
    })
  } catch (error) {
    console.error("Admin registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
