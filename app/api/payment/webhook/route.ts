import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ message: 'Signature missing' }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(body).digest('hex');
  if (signature !== expectedSignature) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.event === 'payment_link.paid') {
    try {
      await connectDB();

      const paymentLink = payload.payload.payment_link.entity;
      const paymentLinkId = paymentLink.id;
      const paymentId = paymentLink.payment_id;
      const amountPaid = paymentLink.amount_paid;
      const status = paymentLink.status;

      const order = await Order.findOne({ razorpayPaymentLinkId: paymentLinkId });
      if (!order) {
        console.warn(`Order not found for payment link ID: ${paymentLinkId}`);
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }

      order.paymentId = paymentId;
      order.paymentStatus = status === 'paid' ? 'completed' : 'failed';
      order.status = status === 'paid' ? 'confirmed' : order.status;
      order.totalAmount = amountPaid / 100;
      await order.save();

      return NextResponse.json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Event ignored' });
}
