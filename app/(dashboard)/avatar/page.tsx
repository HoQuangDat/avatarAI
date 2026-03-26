'use client';

import { useState, useEffect } from 'react';
import AvatarCard from '@/components/avatar/AvatarCard';
import AvatarUploader from '@/components/avatar/AvatarUploader';
import VoiceRecorder from '@/components/avatar/VoiceRecorder';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, RefreshCw } from 'lucide-react';

export default function AvatarManagerPage() {
  const [avatars, setAvatars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAvatars = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/avatar/list');
      const data = await res.json();
      if (Array.isArray(data)) setAvatars(data);
    } catch { }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateAvatar = async () => {
    if (!name || !imageFile) return alert('Bắt buộc nhập tên và chọn ảnh');
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', imageFile);
    if (audioBlob) {
      formData.append('audio', audioBlob, 'voice_sample.webm');
    }

    try {
      const res = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.avatar) {
        setIsModalOpen(false);
        // Reset form
        setName('');
        setImageFile(null);
        setImagePreview(null);
        setAudioBlob(null);
        fetchAvatars(); // Refresh
      } else {
        alert(data.error || 'Lỗi tạo avatar');
      }
    } catch {
      alert('Đã xảy ra lỗi hệ thống');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
            Quản lý Avatar
          </h1>
          <p className="text-slate-400 mt-1">Upload khuôn mặt và nhân bản giọng nói AI</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchAvatars} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-1" />
            Tạo Avatar Mới
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : avatars.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Chưa có Avatar nào</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Hãy upload một bức ảnh chân dung rõ nét và thu âm giọng nói của bạn để tạo AI Avatar ngay.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Tạo Avatar đầu tiên</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {avatars.map((avatar) => (
            <AvatarCard
              key={avatar._id}
              id={avatar._id}
              name={avatar.name}
              imageUrl={avatar.imageUrl}
              voiceStatus={avatar.voiceCloneStatus}
              videosCreated={avatar.videosCreated}
              onDelete={async (id) => {
                if (!confirm('Bạn có chắc chắn muốn xóa Avatar này? Hành động này không thể hoàn tác.')) return;
                try {
                  const res = await fetch('/api/avatar/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                  });
                  if (res.ok) {
                    fetchAvatars();
                  } else {
                    const data = await res.json();
                    alert(data.error || 'Lỗi khi xóa avatar');
                  }
                } catch {
                  alert('Đã xảy ra lỗi hệ thống');
                }
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl">Tạo Avatar Mới</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="image">1. Hình ảnh</TabsTrigger>
              <TabsTrigger value="voice">2. Giọng nói (Tùy chọn)</TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Tên Avatar</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Avatar Công Sở"
                  className="mb-4"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Khuôn mặt đại diện</label>
                <AvatarUploader
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  onClear={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                />
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="default"
                  onClick={handleCreateAvatar}
                  disabled={isSubmitting || !name || !imageFile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang tải lên...</>
                  ) : "Hoàn tất ngay"}
                </Button>
                <Button variant="outline" onClick={() => document.querySelector('[value="voice"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                  Tiếp theo (Tùy chọn) →
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-6">
              <VoiceRecorder onRecordingComplete={setAudioBlob} />
              
              <div className="flex justify-between pt-6 mt-6 border-t border-border">
                <p className="text-sm text-slate-400 max-w-sm">
                  {audioBlob ? "Đã có dữ liệu giọng nói." : "Bạn có thể tạo luôn avatar và ghi âm sau, nhưng sẽ chưa thể viết script TTS ngay."}
                </p>
                <Button size="lg" onClick={handleCreateAvatar} disabled={isSubmitting || !name || !imageFile}>
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang tải lên...</>
                  ) : "Lưu Avatar"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
