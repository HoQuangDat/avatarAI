'use client';

import { useState, useEffect } from 'react';
import ScriptEditor from '@/components/create/ScriptEditor';
import VideoPreview from '@/components/create/VideoPreview';
import AvatarCard from '@/components/avatar/AvatarCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateVideoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [script, setScript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/avatar/list')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvatars(data.filter((a) => a.voiceCloneStatus === 'ready'));
        }
      });
  }, []);

  const handleCreateVideo = async () => {
    if (!selectedAvatarId || !script.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/video/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId: selectedAvatarId,
          script,
          title: script.split(' ').slice(0, 5).join(' ') + '...',
        }),
      });

      const data = await res.json();
      if (data.videoId) {
        setVideoId(data.videoId);
        setStep(3);
      } else {
        alert(data.error || 'Lỗi khi tạo video');
      }
    } catch (err) {
      alert('Không thể kết nối. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tạo Video Mới</h1>
        <p className="text-slate-400">Chỉ 3 bước đơn giản để có video chuyên nghiệp.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-4 mb-12">
        <div className={`flex flex-col flex-1 pb-4 border-b-2 ${step >= 1 ? 'border-brand-500' : 'border-border'}`}>
          <span className={`text-sm font-medium ${step >= 1 ? 'text-brand-400' : 'text-slate-500'}`}>Bước 1</span>
          <span className="text-white font-semibold mt-1">Chọn Avatar</span>
        </div>
        <div className={`flex flex-col flex-1 pb-4 border-b-2 ${step >= 2 ? 'border-brand-500' : 'border-border'}`}>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-brand-400' : 'text-slate-500'}`}>Bước 2</span>
          <span className="text-white font-semibold mt-1">Viết Script</span>
        </div>
        <div className={`flex flex-col flex-1 pb-4 border-b-2 ${step >= 3 ? 'border-brand-500' : 'border-border'}`}>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-brand-400' : 'text-slate-500'}`}>Bước 3</span>
          <span className="text-white font-semibold mt-1">Tạo & Render</span>
        </div>
      </div>

      {/* Step Components */}
      {step === 1 && (
        <div className="animate-in slide-in-from-right-4 fade-in">
          <h2 className="text-xl font-semibold mb-6">Chọn Avatar đã sẵn sàng</h2>
          {avatars.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="text-slate-400 mb-4">Bạn chưa có Avatar nào hoặc chưa clone xong giọng.</p>
              <Button onClick={() => router.push('/avatar')}>Đi tạo Avatar ngay</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {avatars.map((avatar) => (
                <AvatarCard
                  key={avatar._id}
                  id={avatar._id}
                  name={avatar.name}
                  imageUrl={avatar.imageUrl}
                  voiceStatus={avatar.voiceCloneStatus}
                  videosCreated={avatar.videosCreated}
                  selected={selectedAvatarId === avatar._id}
                  onSelect={setSelectedAvatarId}
                />
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button size="lg" disabled={!selectedAvatarId} onClick={() => setStep(2)}>
              Tiếp tục 
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in slide-in-from-right-4 fade-in">
          <ScriptEditor script={script} onScriptChange={setScript} />
          
          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <Button variant="outline" onClick={() => setStep(1)}>Quay lại</Button>
            <Button size="lg" disabled={!script.trim() || isSubmitting} onClick={handleCreateVideo}>
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang chuẩn bị...</>
              ) : (
                'Tạo video ngay 🚀'
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in slide-in-from-right-4 fade-in">
          <VideoPreview videoId={videoId} />
          <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => router.push('/videos')}>
              Về danh sách Video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
