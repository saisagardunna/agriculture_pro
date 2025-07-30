import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb" // Make sure this path is correct
import { Product } from "@/models/Product" // Make sure this path is correct and the Product model is defined

export async function GET() {
  try {
    await connectDB() // Connect to your MongoDB database

    // Fetch products where status is "active", sorted by creation date (newest first)
    const products = await Product.find({ status: "active" }).sort({ createdAt: -1 })

    // Return the fetched products as a JSON response with a 200 OK status
    return NextResponse.json(products)
  } catch (error) {
    // Log any errors to the server console for debugging
    console.error("Error fetching products:", error)

    // Return a generic internal server error message to the client
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}