import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPayload {
  items: CheckoutItem[];
  totalAmount: number; // total amount in rupees as INTEGER (e.g., 54)
  customer: {
    name: string;
    email: string;
    contact: string;
  };
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const payload: CheckoutPayload = await request.json();

    // Validate items
    if (!payload.items?.length) {
      return NextResponse.json({ message: "Invalid or empty cart items" }, { status: 400 });
    }

    // Validate customer
    if (!payload.customer?.name || !payload.customer?.email || !payload.customer?.contact) {
      return NextResponse.json({ message: "Invalid customer details" }, { status: 400 });
    }

    // Validate totalAmount as integer and positive
    if (
      typeof payload.totalAmount !== "number" ||
      !Number.isInteger(payload.totalAmount) ||
      payload.totalAmount <= 0
    ) {
      return NextResponse.json({ message: "Total amount must be a positive integer" }, { status: 400 });
    }

    // Convert rupees to paise (multiply by 100)
    const amountPaise = payload.totalAmount * 1;

    const paymentLink = await razorpay.paymentLink.create({
      amount: amountPaise,
      currency: "INR",
      accept_partial: false,
      description: "Order Payment",
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        contact: payload.customer.contact,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `${new URL(request.url).origin}/payment-success`,
      callback_method: "get",
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentLink.short_url,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
