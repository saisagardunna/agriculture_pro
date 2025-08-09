import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import Razorpay from 'razorpay';

interface RequestBody {
  items: any[]; // tighten this if you have a schema
  totalAmount: number;
}

export async function POST(request: NextRequest) {
  // Only accept JSON
  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ message: 'Expected application/json' }, { status: 415 });
  }

  try {
    console.log('Request headers:', Object.fromEntries(request.headers));

    // Authenticate
    const user = await verifyToken(request);
    if (!user) {
      console.log('Token verification failed');
      return NextResponse.json({ message: 'Unauthorized: Invalid or missing token' }, { status: 401 });
    }
    console.log('Authenticated user:', user);

    // Connect to DB
    try {
      await connectDB();
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    // Parse and validate body
    const body: RequestBody = await request.json();
    const { items, totalAmount } = body;
    console.log('Request body:', { items, totalAmount });

    if (!Array.isArray(items) || items.length === 0 || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
    }

    // Razorpay config check
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_APP_URL } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay keys');
      return NextResponse.json({ message: 'Server configuration error: Missing Razorpay keys' }, { status: 500 });
    }
    if (!NEXT_PUBLIC_APP_URL) {
      console.warn('NEXT_PUBLIC_APP_URL not set; callback_url may be invalid');
    }

    // Create order in your DB
    const order = await Order.create({
      userId: user.userId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
    });
    console.log('Created order:', order);

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    // Create payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      accept_partial: false,
      description: `AgriMart Order #${order._id}`,
      customer: {
        name: user.name || 'Customer',
        email: user.email || 'customer@example.com',
        contact: user.phone || '9999999999',
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      notes: { userId: user.userId, orderId: order._id.toString() },
      callback_url: `${NEXT_PUBLIC_APP_URL ?? ''}/api/payment/success`,
      callback_method: 'get',
    });
    console.log('Payment link created:', paymentLink);

    // Persist payment info
    order.paymentUrl = paymentLink.short_url;
    order.razorpayPaymentLinkId = paymentLink.id;
    await order.save();

    return NextResponse.json(
      {
        paymentUrl: paymentLink.short_url,
        orderId: order._id,
        razorpayPaymentLinkId: paymentLink.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Checkout error:', error);

    // Specific Razorpay unauthorized case
    if (error?.statusCode === 401 || /unauthorized/i.test(error?.message || '')) {
      return NextResponse.json({ message: 'Razorpay unauthorized: Invalid API keys' }, { status: 401 });
    }

    return NextResponse.json(
      { message: `Internal server error: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
