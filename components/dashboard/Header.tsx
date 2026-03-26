'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Tìm kiếm video, avatar..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-card border border-border text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-card transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{session?.user?.name || 'User'}</p>
            <p className="text-xs text-slate-400">{session?.user?.email || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
