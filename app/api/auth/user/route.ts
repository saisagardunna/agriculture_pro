import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, UserPayload } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user: UserPayload | null = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({
      name: user.name || "Test User",
      email: user.email || "test@example.com",
      phone: user.phone || "+919999999999",
    });
  } catch (err: any) {
    console.error('User fetch error:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}