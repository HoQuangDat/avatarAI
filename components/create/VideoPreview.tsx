'use client';

import { useVideoStatus } from '@/hooks/useVideoStatus';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, CheckCircle2, XCircle, Loader2, Volume2, Film } from 'lucide-react';
import { useEffect } from 'react';

interface VideoPreviewProps {
  videoId: string | null;
  onComplete?: () => void;
}

export default function VideoPreview({ videoId, onComplete }: VideoPreviewProps) {
  const { status, isPolling, startPolling } = useVideoStatus(videoId);

  useEffect(() => {
    if (videoId && !isPolling && status?.status !== 'ready' && status?.status !== 'failed') {
      startPolling();
    }
  }, [videoId, isPolling, startPolling, status?.status]);

  useEffect(() => {
    if (status?.status === 'ready' && onComplete) {
      onComplete();
    }
  }, [status?.status, onComplete]);

  if (!videoId) return null;

  const currentStep = (() => {
    switch (status?.status) {
      case 'generating_audio':
        return 1;
      case 'generating_video':
        return 2;
      case 'ready':
        return 3;
      case 'failed':
        return -1;
      default:
        return 0;
    }
  })();

  const progressValue = status?.status === 'ready' ? 100 : currentStep * 33;

  const steps = [
    {
      label: 'Tổng hợp giọng nói',
      description: 'Đang clone giọng nói của bạn...',
      icon: Volume2,
    },
    {
      label: 'Render video',
      description: 'AI đang tạo video của bạn...',
      icon: Film,
    },
    {
      label: 'Hoàn tất',
      description: 'Video sẵn sàng!',
      icon: CheckCircle2,
    },
  ];

  // Failed state
  if (status?.status === 'failed') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Không thể tạo video</h3>
        <p className="text-sm text-red-400 mb-4">{status.errorMessage || 'Đã xảy ra lỗi không xác định'}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </div>
    );
  }

  // Ready state
  if (status?.status === 'ready' && status.videoUrl) {
    return (
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-medium text-white">Video sẵn sàng! 🎉</h3>
        </div>

        <div className="rounded-xl overflow-hidden bg-surface border border-border mb-4">
          <video
            src={status.videoUrl}
            controls
            className="w-full max-h-[480px]"
            autoPlay
          />
        </div>

        <div className="flex gap-3">
          <a href={status.videoUrl} download target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Tải video
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Processing state
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="mb-8">
        <Progress value={progressValue} className="h-2 mb-2" />
        <p className="text-xs text-slate-400 text-right">{progressValue}%</p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 ${
                isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/20'
                    : isActive
                    ? 'bg-brand-500/20'
                    : 'bg-card border border-border'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>

              <div>
                <p className={`font-medium text-sm ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : ''}`}>
                  {step.label}
                </p>
                <p className={`text-xs ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isActive ? step.description : isDone ? 'Hoàn tất ✓' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
