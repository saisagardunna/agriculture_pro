"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SalesChartProps {
  data: any[]
}

export function SalesChart({ data }: SalesChartProps) {
  // Sample data if none provided
  const sampleData = [
    { date: "Jan", sales: 4000, orders: 240 },
    { date: "Feb", sales: 3000, orders: 139 },
    { date: "Mar", sales: 2000, orders: 980 },
    { date: "Apr", sales: 2780, orders: 390 },
    { date: "May", sales: 1890, orders: 480 },
    { date: "Jun", sales: 2390, orders: 380 },
    { date: "Jul", sales: 3490, orders: 430 },
  ]

  const chartData = data.length > 0 ? data : sampleData

  return (
    <ChartContainer
      config={{
        sales: {
          label: "Sales (₹)",
          color: "hsl(var(--chart-1))",
        },
        orders: {
          label: "Orders",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} />
          <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
