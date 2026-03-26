'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Sparkles, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký thất bại');
      }

      setIsSuccess(true);
      // Đăng nhập tự động sau khi đăng ký
      setTimeout(() => {
        signIn('credentials', { email, password, callbackUrl: '/dashboard' });
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">Avatar<span className="text-brand-400">AI</span></span>
      </Link>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Đăng ký thành công!</h2>
            <p className="text-sm text-slate-400 mb-6">Đang chuyển hướng vào Dashboard...</p>
            <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-white text-center mb-2">Tạo tài khoản</h1>
        <p className="text-slate-400 text-sm text-center mb-8">Nhận ngay 3 credits miễn phí 🎁</p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                placeholder="Mật khẩu (ít nhất 6 ký tự)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full shadow-lg shadow-brand-500/25 mt-2" disabled={isLoading}>
            {isLoading ? 'Đang lý tài khoản...' : 'Đăng ký ngay'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
