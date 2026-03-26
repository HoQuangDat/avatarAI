import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateScript } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }

    const body = await req.json();
    const { topic, niche, platform, duration, tone, language } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Vui lòng nhập chủ đề' }, { status: 400 });
    }

    const result = await generateScript({
      topic,
      niche: niche || 'general',
      platform: platform || 'tiktok',
      duration: duration || 60,
      tone: tone || 'friendly',
      language: language || 'vi',
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Không thể tạo script';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
