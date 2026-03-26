import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import { deleteResource } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });

    const userId = (session.user as { id: string }).id;
    const body = await req.json();
    const { action, ids } = body; // action: 'delete_selected' | 'delete_failed' | 'delete_all'

    await dbConnect();
    
    let query: any = { userId };
    if (action === 'delete_selected' && Array.isArray(ids)) {
        query._id = { $in: ids };
    } else if (action === 'delete_failed') {
        query.status = 'failed';
    } else if (action === 'delete_all') {
        // delete all for this user
    } else {
        return NextResponse.json({ error: 'Tham số không hợp lệ' }, { status: 400 });
    }

    const videosToDelete = await Video.find(query);
    
    // Attempt to delete from Cloudinary
    for (const video of videosToDelete) {
        if (video.videoUrl) {
            try {
                // Cloudinary publicId usually matches: avatarai/videos/<id>
                await deleteResource(`avatarai/videos/${video._id}`, 'video');
            } catch (err) {
                console.error('Failed to delete video from cloudinary:', err);
            }
        }
    }

    const result = await Video.deleteMany(query);

    return NextResponse.json({ 
        message: 'Hoàn tất xóa', 
        deletedCount: result.deletedCount 
    });
  } catch (error: any) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Lỗi khi xóa video.' }, { status: 500 });
  }
}
