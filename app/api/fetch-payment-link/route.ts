import { type NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentLinkId = searchParams.get('paymentLinkId');

    if (!paymentLinkId) {
      return NextResponse.json({ message: 'Payment link ID required' }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ message: 'Razorpay keys not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);

    if (typeof paymentLink.amount !== 'number') {
      return NextResponse.json({ message: 'Invalid payment link amount' }, { status: 500 });
    }

    return NextResponse.json({
      amount: paymentLink.amount / 100,
      status: paymentLink.status,
      short_url: paymentLink.short_url,
    });
  } catch (error: any) {
    console.error('Fetch Payment Link Error:', error);
    if (error.statusCode === 401) {
      return NextResponse.json({ message: 'Unauthorized: Invalid API keys' }, { status: 401 });
    }
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
  }
}
