import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Avatar from '@/models/Avatar';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const avatars = await Avatar.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(avatars);
  } catch (error) {
    console.error('List avatars error:', error);
    return NextResponse.json({ error: 'Lỗi lấy danh sách avatar' }, { status: 500 });
  }
}
