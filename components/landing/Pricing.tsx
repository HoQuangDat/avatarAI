'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'mãi mãi',
    description: 'Dùng thử và trải nghiệm',
    features: [
      '3 video miễn phí',
      '1 avatar',
      'Script AI (Gemini)',
      'Chất lượng 720p',
      'Hỗ trợ cộng đồng',
    ],
    cta: 'Bắt đầu miễn phí',
    popular: false,
    gradient: '',
  },
  {
    name: 'Creator',
    price: '199K',
    period: '/tháng',
    description: 'Cho creator cá nhân',
    features: [
      '50 video/tháng',
      '5 avatar',
      'Script AI không giới hạn',
      'Chất lượng 1080p',
      'Clone giọng nâng cao',
      'Không watermark',
      'Hỗ trợ ưu tiên',
    ],
    cta: 'Chọn Creator',
    popular: true,
    gradient: 'from-brand-500 to-purple-500',
  },
  {
    name: 'Agency',
    price: '599K',
    period: '/tháng',
    description: 'Cho team & agency',
    features: [
      'Video không giới hạn',
      '20 avatar',
      'Script AI không giới hạn',
      'Chất lượng 1080p',
      'Clone giọng premium',
      'Không watermark',
      'API access',
      'Hỗ trợ 24/7',
      'Multi-user management',
    ],
    cta: 'Chọn Agency',
    popular: false,
    gradient: '',
  },
];

export default function Pricing() {
  return (
    <section className="py-24 px-6 relative" id="pricing">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-brand-400 text-sm font-medium mb-3 tracking-wider uppercase">Bảng giá</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Gói phù hợp cho{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              mọi creator
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng scale.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col transition-all duration-300',
                plan.popular
                  ? 'border-brand-500/50 bg-gradient-to-b from-brand-500/10 to-card shadow-2xl shadow-brand-500/10 scale-105'
                  : 'border-border bg-card hover:border-brand-500/30'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-medium">
                  Phổ biến nhất ⭐
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register" className="w-full">
                <Button
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
