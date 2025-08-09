import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentLinkId = searchParams.get('razorpay_payment_link_id');
    const paymentId = searchParams.get('razorpay_payment_id');
    const paymentLinkStatus = searchParams.get('razorpay_payment_link_status');

    if (!paymentLinkId || !paymentId || !paymentLinkStatus) {
      return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ razorpayPaymentLinkId: paymentLinkId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Update order if not already updated by webhook
    if (paymentLinkStatus === 'paid' && order.paymentStatus !== 'completed') {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      order.paymentId = paymentId;
      await order.save();
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/payment/success', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'));
  } catch (err: any) {
    console.error('Payment success callback error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}