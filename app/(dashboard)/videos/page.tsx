'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Download, Trash2, Calendar, Clock, Loader2, Video as VideoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/video/list');
      const data = await res.json();
      if (Array.isArray(data)) setVideos(data);
    } catch { }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const deleteVideos = async (action: string, ids?: string[]) => {
    if (!confirm('Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.')) return;
    try {
      const res = await fetch('/api/video/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchVideos();
      } else {
        const data = await res.json();
        alert(data.error || 'Lỗi khi xóa video');
      }
    } catch {
      alert('Đã xảy ra lỗi hệ thống');
    }
  };

  const deleteSelectedVideos = () => deleteVideos('delete_selected', selectedIds);
  const deleteFailedVideos = () => deleteVideos('delete_failed');
  const deleteAllVideos = () => deleteVideos('delete_all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success">Hoàn thành</Badge>;
      case 'failed':
        return <Badge variant="destructive">Lỗi</Badge>;
      default:
        return <Badge variant="warning">Đang render</Badge>;
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
          Thư viện Video
        </h1>
        <p className="text-slate-400 mt-1">Quản lý và tải xuống các video đã tạo</p>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl bg-card/30">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <VideoIcon className="w-8 h-8 text-brand-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Chưa có video nào</h3>
          <p className="text-slate-400 mb-6">Bạn chưa tạo video nào. Hãy bắt đầu ngay!</p>
          <Button onClick={() => window.location.href='/create'}>Tạo video đầu tiên</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-surface p-4 rounded-xl border border-border">
            <Button
              variant="default"
              size="sm"
              onClick={deleteFailedVideos}
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Xóa tất cả video Lỗi
           </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const isAllSelected = selectedIds.length === videos.length;
                if (isAllSelected) setSelectedIds([]);
                else setSelectedIds(videos.map(v => v._id));
              }}
            >
              {selectedIds.length === videos.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
            {selectedIds.length > 0 && (
              <Button variant="destructive" size="sm" onClick={deleteSelectedVideos}>
                Xóa {selectedIds.length} video đã chọn
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={deleteAllVideos} className="ml-auto text-slate-400 hover:text-red-400">
               Xóa Toàn Bộ Kho
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                onClick={() => toggleSelection(video._id)}
                className={`relative group rounded-xl border bg-card overflow-hidden transition-all shadow-lg shadow-black/20 cursor-pointer
                  ${selectedIds.includes(video._id) ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-border hover:border-brand-500/30'}`}
              >
                <div className="absolute top-3 left-3 z-20">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-600 bg-surface/50 accent-brand-500 cursor-pointer"
                      checked={selectedIds.includes(video._id)}
                      readOnly
                    />
                </div>
                <div className="aspect-video relative bg-surface border-b border-border flex items-center justify-center overflow-hidden">
                  <img
                    src={video.avatarId?.imageUrl || '/placeholder-avatar.jpg'}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  
                  {video.status === 'ready' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); }}
                      className="absolute z-10 w-12 h-12 rounded-full bg-brand-500/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-xl"
                    >
                      <Play className="w-5 h-5 ml-1" />
                    </button>
                  )}

                  <div className="absolute top-3 right-3 z-10">
                    {getStatusBadge(video.status)}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-white mb-3 line-clamp-1" title={video.title}>
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                    {video.status === 'ready' && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        ~{video.duration ? Math.round(video.duration) : 0}s
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-border shadow-2xl">
          <DialogTitle className="sr-only">Xem Video</DialogTitle>
          {selectedVideo && (
            <div className="flex flex-col md:flex-row h-[70vh] md:h-auto">
              <div className="flex-1 bg-black flex items-center justify-center relative group">
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
              <div className="w-full md:w-80 bg-card border-l border-border flex flex-col h-full max-h-[70vh]">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-white text-lg line-clamp-2 leading-tight">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedVideo.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-1 p-5 overflow-y-auto">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-3 block">Script</label>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedVideo.script}
                  </p>
                </div>
                <div className="p-5 border-t border-border bg-surface/50">
                  <a href={selectedVideo.videoUrl} download target="_blank" rel="noreferrer">
                    <Button className="w-full shadow-lg shadow-brand-500/20">
                      <Download className="w-4 h-4 mr-2" />
                      Tải Video HD
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
