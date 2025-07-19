import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "") || request.headers.get("x-admin-token")

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Ensure it's an admin token
    if (decoded.role !== "admin") {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

export function hasPermission(adminPermissions: string[], requiredPermission: string): boolean {
  return adminPermissions.includes(requiredPermission) || adminPermissions.includes("super_admin")
}
