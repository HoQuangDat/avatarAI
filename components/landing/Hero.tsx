'use client';

import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-surface">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[200px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>AI Avatar cho Creator Việt Nam</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-fade-in-up">
          Nhân bản{' '}
          <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            giọng nói & khuôn mặt
          </span>{' '}
          của bạn bằng AI
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          Tạo video content không giới hạn mà không cần quay thêm 1 giây nào. Upload ảnh, ghi âm giọng → AI làm video nói thay bạn.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-200">
          <Link href="/register">
            <Button size="xl" className="group">
              Dùng thử miễn phí
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" size="xl" className="group">
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Xem demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-8 text-sm text-slate-500 animate-fade-in-up delay-300">
          <div className="flex items-center gap-2">
            <span className="text-brand-400 font-semibold">3 video miễn phí</span>
            <span>khi đăng ký</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span>Không cần thẻ tín dụng</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span>Setup trong 2 phút</span>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 relative animate-fade-in-up delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-2 shadow-2xl shadow-brand-500/10">
            <div className="rounded-lg bg-surface aspect-video flex items-center justify-center border border-border/50">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <p className="text-slate-400 text-sm">Xem video demo AI Avatar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
