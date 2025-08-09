import jwt from 'jsonwebtoken';

export interface UserPayload {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function verifyToken(
  request: { headers: { get: (key: string) => string | null } }
): Promise<UserPayload | null> {
  try {
    // Get the cookie header string
    const cookieHeader = request.headers.get('cookie') || '';

    // Parse cookies into an object
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map(cookie => cookie.trim().split('='))
        .filter(([key, value]) => key && value)
        .map(([key, value]) => [key, decodeURIComponent(value)])
    );

    const token = cookies['token'];

    console.log('Token found:', !!token);

    if (!token) {
      console.warn('No token found in cookies');
      return null;
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    console.log('Decoded token:', decoded);

    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
