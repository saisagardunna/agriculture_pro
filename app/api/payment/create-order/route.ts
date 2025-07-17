import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/models/Order"
import { verifyToken } from "@/lib/auth"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { items, totalAmount } = await request.json()

    // Create order in database
    const order = await Order.create({
      userId: user.userId,
      items,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
    })

    // PhonePe payment integration
    const merchantId = process.env.PHONEPE_MERCHANT_ID
    const saltKey = process.env.PHONEPE_SALT_KEY
    const saltIndex = process.env.PHONEPE_SALT_INDEX

    const paymentPayload = {
      merchantId,
      merchantTransactionId: order._id.toString(),
      merchantUserId: user.userId,
      amount: Math.round(totalAmount * 100), // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      redirectMode: "POST",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      mobileNumber: "9999999999", // You should get this from user profile
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64")
    const string = base64Payload + "/pg/v1/pay" + saltKey
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    const checksum = sha256 + "###" + saltIndex

    const response = await fetch("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        paymentUrl: data.data.instrumentResponse.redirectInfo.url,
        orderId: order._id,
      })
    } else {
      return NextResponse.json({ message: "Failed to create payment" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
