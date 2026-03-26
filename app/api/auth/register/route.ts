import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email này đã được đăng ký' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name || email.split('@')[0],
      email,
      passwordHash,
      provider: 'credentials',
      plan: 'free',
      credits: 3,
    });

    return NextResponse.json({
      message: 'Đăng ký thành công!',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' }, { status: 500 });
  }
}
