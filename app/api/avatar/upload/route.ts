import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Avatar from '@/models/Avatar';
import { uploadImage, uploadAudio } from '@/lib/cloudinary';
import { cloneVoice } from '@/lib/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    const audioFile = formData.get('audio') as File | null;
    const name = formData.get('name') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'Vui lòng upload ảnh avatar' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Vui lòng nhập tên avatar' }, { status: 400 });
    }

    // Validate file sizes
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ảnh không được vượt quá 5MB' }, { status: 400 });
    }

    if (audioFile && audioFile.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio không được vượt quá 20MB' }, { status: 400 });
    }

    await dbConnect();

    // Upload image to Cloudinary
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageResult = await uploadImage(imageBuffer);

    // Create avatar doc
    const avatarData: Record<string, unknown> = {
      userId: (session.user as { id: string }).id,
      name,
      imageUrl: imageResult.url,
      imagePublicId: imageResult.publicId,
      voiceCloneStatus: 'pending',
    };

    // Upload audio and clone voice if provided
    if (audioFile) {
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioResult = await uploadAudio(audioBuffer);
      avatarData.audioSampleUrl = audioResult.url;
      avatarData.audioSamplePublicId = audioResult.publicId;

      try {
        avatarData.voiceCloneStatus = 'processing';
        const voiceId = await cloneVoice(audioBuffer, name, audioFile.name);
        avatarData.elevenLabsVoiceId = voiceId;
        avatarData.voiceCloneStatus = 'ready';
      } catch (err) {
        console.error('Voice clone failed:', err);
        avatarData.voiceCloneStatus = 'failed';
      }
    } else {
      // Use default ElevenLabs voice (Rachel) if no audio clone provided
      avatarData.elevenLabsVoiceId = '21m00Tcm4TlvDq8ikWAM'; 
      avatarData.voiceCloneStatus = 'ready';
    }

    const avatar = await Avatar.create(avatarData);

    return NextResponse.json({
      message: 'Avatar đã được tạo thành công!',
      avatar,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Không thể tạo avatar. Vui lòng thử lại.' }, { status: 500 });
  }
}
