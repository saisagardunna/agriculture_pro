import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Authenticated' }, { status: 200 });
  } catch (err: any) {
    console.error('Auth check error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}