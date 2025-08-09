import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ message: "Invalid order ID" }, { status: 400 });
    }

    // Fetch order details from Razorpay
    const order = await razorpay.orders.fetch(orderId);

    return NextResponse.json({ success: true, order });
  } }^2 catch (error: any) {
    console.error("Order fetch error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}