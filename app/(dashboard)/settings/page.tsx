import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import Pricing from '@/components/landing/Pricing';
import { UserCircle, Mail, Crown, Infinity } from 'lucide-react';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  await dbConnect();
  const dbUser = await User.findById((session.user as any).id);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
          Cài đặt tài khoản
        </h1>
        <p className="text-slate-400 mt-1">Quản lý thông tin và gói đăng ký của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-brand-400" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Các thông tin cơ bản liên kết với tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-1 block">Họ và tên</label>
                  <p className="text-white font-medium bg-surface px-4 py-2 rounded-lg border border-border">
                    {dbUser?.name || 'Chưa cập nhật'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-1 block">Email</label>
                  <p className="text-white font-medium bg-surface px-4 py-2 rounded-lg border border-border flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {dbUser?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bảo mật</CardTitle>
              <CardDescription>Cập nhật mật khẩu và bảo vệ tài khoản</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                {dbUser?.provider === 'google' 
                  ? 'Tài khoản của bạn được liên kết với Google. Bạn không cần đặt mật khẩu.'
                  : 'Sử dụng Email và Mật khẩu để đăng nhập.'}
              </p>
            </CardContent>
            {dbUser?.provider !== 'google' && (
              <CardFooter>
                <Button variant="outline">Đổi mật khẩu (Sắp ra mắt)</Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Subscription Info */}
        <div className="space-y-6">
          <Card className="border-brand-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-brand-400" />
                Gói hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-white uppercase mb-1">
                  {dbUser?.plan || 'FREE'}
                </h3>
                <p className="text-sm text-slate-400">
                  {dbUser?.plan === 'free' ? 'Gói trải nghiệm miễn phí' : 'Gói Premium vô hạn tính năng'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Credits còn lại</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    {dbUser?.plan === 'free' ? dbUser?.credits : <><Infinity className="w-4 h-4"/> Vô cực</>}
                  </span>
                </div>
                {dbUser?.plan === 'free' && (
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-500 to-purple-500" 
                      style={{ width: `${Math.min((dbUser?.credits / 3) * 100, 100)}%` }} 
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {dbUser?.plan === 'free' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full cursor-pointer">Nâng cấp gói ngay 🚀</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl p-0 bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Bảng Giá Nâng Cấp</DialogTitle>
                    <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-border/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <Pricing />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
