'use client';

import { Mic, Wand2, Download, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Clone giọng nói AI',
    description: 'Upload hoặc ghi âm giọng nói. AI sẽ nhân bản giọng của bạn với độ chính xác cao, hỗ trợ tiếng Việt.',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Wand2,
    title: 'AI viết Script tự động',
    description: 'Nhập chủ đề và AI sẽ viết script video hoàn chỉnh cho TikTok, YouTube Shorts, Instagram Reels.',
    gradient: 'from-brand-500 to-purple-400',
  },
  {
    icon: Download,
    title: 'Export video HD',
    description: 'Xuất video chất lượng cao, sẵn sàng đăng lên mọi nền tảng. Không watermark cao cấp.',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: Zap,
    title: 'Tạo video trong 2 phút',
    description: 'Từ script đến video hoàn chỉnh chỉ trong vài phút. Nhanh hơn 10x so với quay truyền thống.',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    icon: Shield,
    title: 'Bảo mật dữ liệu',
    description: 'Dữ liệu khuôn mặt và giọng nói được bảo mật tuyệt đối. Chỉ bạn có quyền truy cập.',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Globe,
    title: 'Đa ngôn ngữ',
    description: 'Hỗ trợ tiếng Việt là chính, cùng với 20+ ngôn ngữ khác. Mở rộng content ra quốc tế.',
    gradient: 'from-rose-500 to-red-400',
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-brand-400 text-sm font-medium mb-3 tracking-wider uppercase">Tính năng</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Mọi thứ bạn cần để{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              scale content
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Từ clone giọng nói đến tạo video tự động — tất cả trong một nền tảng duy nhất.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-border bg-card p-6 hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
