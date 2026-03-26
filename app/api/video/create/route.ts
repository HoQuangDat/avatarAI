import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds limit for Hobby Tier on Vercel
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import Avatar from '@/models/Avatar';
import User from '@/models/User';
import { textToSpeech } from '@/lib/fpt-tts';
import { createTalk } from '@/lib/did';
import { uploadAudio } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    // Check credits
    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Đã hết credits. Vui lòng nâng cấp gói.' }, { status: 403 });
    }

    const { script, avatarId, title } = await req.json();

    if (!script || !avatarId) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const avatar = await Avatar.findOne({ _id: avatarId, userId });
    if (!avatar || !avatar.elevenLabsVoiceId) {
      return NextResponse.json({ error: 'Avatar không tồn tại hoặc chưa clone giọng nói' }, { status: 400 });
    }

    // 1. Create Draft Video Document
    const video = await Video.create({
      userId,
      avatarId,
      script,
      title: title || 'Video mới',
      status: 'generating_audio',
    });

    try {
      // 2. Text to Speech (ElevenLabs)
      const audioBuffer = await textToSpeech(script);

      // 3. Upload Audio to Cloudinary
      const audioUploadResult = await uploadAudio(audioBuffer, `videos/${video._id}`);
      
      video.audioUrl = audioUploadResult.url;
      video.status = 'generating_video';
      await video.save();

      // 4. Create Talk (D-ID)
      // Force Cloudinary S3 to deliver .jpg because D-ID strictly rejects .webp
      const validJpgImageUrl = avatar.imageUrl.replace(/\.(webp|png|heic|jpeg)$/i, '.jpg');

      const talkResult = await createTalk({
        sourceUrl: validJpgImageUrl,
        audioUrl: video.audioUrl,
      });

      video.didTalkId = talkResult.id;
      await video.save();

      return NextResponse.json({
        message: 'Bắt đầu tạo video',
        videoId: video._id,
      });
    } catch (processError: any) {
      video.status = 'failed';
      video.errorMessage = processError.message || 'Lỗi trong quá trình render video';
      await video.save();
      throw processError;
    }
  } catch (error: any) {
    console.error('Video creation error:', error);
    return NextResponse.json({ error: error.message || 'Không thể tạo video. Vui lòng thử lại.' }, { status: 500 });
  }
}
