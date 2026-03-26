import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds limit for Hobby Tier on Vercel
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import User from '@/models/User';
import Avatar from '@/models/Avatar';
import { getTalkStatus } from '@/lib/did';
import { uploadFromUrl } from '@/lib/cloudinary';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await dbConnect();

    const video = await Video.findOne({ _id: id, userId });
    if (!video) {
      return NextResponse.json({ error: 'Video không tồn tại' }, { status: 404 });
    }

    if (video.status === 'ready' || video.status === 'failed') {
      return NextResponse.json({
        status: video.status,
        videoUrl: video.videoUrl,
        errorMessage: video.errorMessage,
      });
    }

    if (!video.didTalkId) {
      return NextResponse.json({
        status: video.status,
      });
    }

    // Poll D-ID status
    const didStatus = await getTalkStatus(video.didTalkId);

    if (didStatus.status === 'error') {
      video.status = 'failed';
      video.errorMessage = didStatus.errorMessage || 'Lỗi từ D-ID API';
      await video.save();
      return NextResponse.json({ status: video.status, errorMessage: video.errorMessage });
    }

    if (didStatus.status === 'done' && didStatus.resultUrl) {
      try {
        // Download and upload to Cloudinary so we don't rely on D-ID temporary links
        const cloudinaryResult = await uploadFromUrl(didStatus.resultUrl, `videos/${video._id}`);
        
        video.status = 'ready';
        video.videoUrl = cloudinaryResult.url;
        video.duration = didStatus.duration || 0;
        await video.save();

        // Increment avatar video count
        await Avatar.findByIdAndUpdate(video.avatarId, { $inc: { videosCreated: 1 } });

        // Deduct 1 credit
        await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

        return NextResponse.json({
          status: 'ready',
          videoUrl: video.videoUrl,
        });
      } catch (uploadError) {
        console.error('Failed to save to Cloudinary:', uploadError);
        video.status = 'failed';
        video.errorMessage = 'Lỗi lưu trữ video kết quả.';
        await video.save();
        return NextResponse.json({ status: 'failed', errorMessage: video.errorMessage });
      }
    }

    return NextResponse.json({
      status: 'generating_video',
    });
  } catch (error: any) {
    console.error('Video status error:', error);
    return NextResponse.json({ error: 'Không thể kiểm tra trạng thái video.' }, { status: 500 });
  }
}
