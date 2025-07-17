import { NextResponse } from "next/server"

export async function GET() {
  // Sample stats data - replace with actual database queries
  const stats = {
    totalSales: 125000,
    totalOrders: 1250,
    totalProducts: 150,
    totalUsers: 2500,
  }

  return NextResponse.json(stats)
}
