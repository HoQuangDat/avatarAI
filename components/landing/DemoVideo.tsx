'use client';

import { Play } from 'lucide-react';

export default function DemoVideo() {
  return (
    <section className="py-24 px-6 relative" id="demo">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand-400 text-sm font-medium mb-3 tracking-wider uppercase">Demo</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Xem AI Avatar{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              hoạt động
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Chỉ cần 1 ảnh + giọng nói → AI tạo video nói thay bạn theo bất kỳ script nào.
          </p>
        </div>

        <div className="relative group cursor-pointer">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

          <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-surface flex items-center justify-center relative">
              {/* Animated dots background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                <div className="absolute top-20 right-20 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-300" />
                <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping delay-700" />
              </div>

              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-brand-500/30">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <p className="text-white font-medium mb-2">Xem video demo</p>
                <p className="text-slate-500 text-sm">3 phút · Quy trình từ A→Z</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
