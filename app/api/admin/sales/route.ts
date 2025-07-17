import { NextResponse } from "next/server"

export async function GET() {
  // Sample sales data - replace with actual database queries
  const salesData = [
    { date: "Jan", sales: 45000, orders: 240 },
    { date: "Feb", sales: 52000, orders: 139 },
    { date: "Mar", sales: 48000, orders: 980 },
    { date: "Apr", sales: 61000, orders: 390 },
    { date: "May", sales: 55000, orders: 480 },
    { date: "Jun", sales: 67000, orders: 380 },
    { date: "Jul", sales: 72000, orders: 430 },
  ]

  return NextResponse.json(salesData)
}
