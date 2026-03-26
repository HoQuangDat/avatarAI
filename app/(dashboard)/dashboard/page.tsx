import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Video from '@/models/Video';
import Avatar from '@/models/Avatar';
import StatsCard from '@/components/dashboard/StatsCard';
import { Video as VideoIcon, UserCircle, Coins, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  let videoCount = 0;
  let avatarCount = 0;

  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    await dbConnect();
    videoCount = await Video.countDocuments({ userId });
    avatarCount = await Avatar.countDocuments({ userId, voiceCloneStatus: 'ready' });
  }

  return (
    <div className="space-y-8 animate-in mt-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Tổng quan
        </h1>
        <p className="text-slate-400 mt-2">Chào mừng trở lại, {session?.user?.name || 'Creator'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Video đã tạo"
          value={videoCount}
          icon={VideoIcon}
          trend="up"
          change="+1 tháng này"
        />
        <StatsCard
          title="Credits còn lại"
          value={(session?.user as any)?.credits || 0}
          icon={Coins}
        />
        <StatsCard
          title="Avatar sẵn sàng"
          value={avatarCount}
          icon={UserCircle}
        />
        <StatsCard
          title="Tổng views"
          value="0"
          icon={Eye}
          trend="neutral"
          change="Sắp ra mắt"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/create" className="group rounded-2xl border border-border bg-gradient-to-br from-brand-500/10 to-transparent p-6 hover:border-brand-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <VideoIcon className="w-6 h-6 text-brand-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tạo video mới 🚀</h3>
          <p className="text-slate-400 text-sm">Dùng AI Avatar của bạn để tạo video với script mới.</p>
        </Link>
        <Link href="/avatar" className="group rounded-2xl border border-border bg-gradient-to-br from-purple-500/10 to-transparent p-6 hover:border-purple-500/50 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserCircle className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Quản lý Avatar 👤</h3>
          <p className="text-slate-400 text-sm">Upload ảnh mới, thu âm giọng nói để nhân bản.</p>
        </Link>
      </div>
    </div>
  );
}
