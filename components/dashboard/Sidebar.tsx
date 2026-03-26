'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCircle,
  Video,
  PlusCircle,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tạo Video', href: '/create', icon: PlusCircle },
  { name: 'Avatar của tôi', href: '/avatar', icon: UserCircle },
  { name: 'Video đã tạo', href: '/videos', icon: Video },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [credits, setCredits] = useState<number | null>(null);
  
  useEffect(() => {
    fetch('/api/user/credits')
      .then(res => res.json())
      .then(data => {
        if (typeof data.credits === 'number') {
          setCredits(data.credits);
        }
      });
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          Avatar<span className="text-brand-400">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-brand-400' : '')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Credits Card */}
      <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/20">
        <p className="text-xs text-slate-400 mb-1">Credits còn lại</p>
        <p className="text-2xl font-bold text-white">{credits !== null ? credits : '...'}</p>
        <Link
          href="/settings"
          className="mt-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          Nâng cấp gói →
        </Link>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
