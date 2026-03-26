import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const videos = await Video.find({ userId }).populate('avatarId', 'imageUrl name').sort({ createdAt: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('List videos error:', error);
    return NextResponse.json({ error: 'Lỗi lấy danh sách video' }, { status: 500 });
  }
}
