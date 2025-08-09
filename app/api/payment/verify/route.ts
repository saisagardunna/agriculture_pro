import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature) {
      return NextResponse.json({ message: 'Signature mismatch' }, { status: 400 });
    }

    // Update order status
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    order.paymentStatus = 'completed';
    order.status = 'confirmed';
    order.paymentId = razorpay_payment_id;
    await order.save();

    return NextResponse.json({ message: 'Payment verified', orderId: order._id }, { status: 200 });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}