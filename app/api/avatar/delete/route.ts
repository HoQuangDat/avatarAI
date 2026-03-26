import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Avatar from '@/models/Avatar';
import Video from '@/models/Video';
import { deleteResource } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: 'Cần cung cấp Avatar ID' }, { status: 400 });

    await dbConnect();
    
    const avatar = await Avatar.findOne({ _id: id, userId });
    if (!avatar) return NextResponse.json({ error: 'Không tìm thấy Avatar' }, { status: 404 });

    // Attempt to delete image/audio from Cloudinary
    if (avatar.imagePublicId) {
        try { await deleteResource(avatar.imagePublicId, 'image'); } catch (e) { }
    }
    if (avatar.audioSamplePublicId) {
        try { await deleteResource(avatar.audioSamplePublicId, 'video'); } catch (e) { }
    }

    // Xóa avatar
    await avatar.deleteOne();

    // Xóa toàn bộ video liên quan đến avatar (tùy chọn, ở đây ta có thể xóa mềm hoặc xóa luôn)
    // await Video.deleteMany({ avatarId: id, userId });

    return NextResponse.json({ message: 'Đã xóa Avatar thành công' });
  } catch (error: any) {
    console.error('Delete avatar error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa avatar.' }, { status: 500 });
  }
}
