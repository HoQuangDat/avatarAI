'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface ScriptEditorProps {
  script: string;
  onScriptChange: (script: string) => void;
}

export default function ScriptEditor({ script, onScriptChange }: ScriptEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [duration, setDuration] = useState('60');
  const [tone, setTone] = useState('friendly');

  const wordCount = useMemo(() => script.trim().split(/\s+/).filter(Boolean).length, [script]);
  const estimatedDuration = useMemo(() => Math.round(wordCount / 3), [wordCount]);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche: niche || 'general',
          platform,
          duration: parseInt(duration),
          tone,
          language: 'vi',
        }),
      });

      const data = await res.json();
      if (data.script) {
        onScriptChange(data.script);
      } else {
        alert(data.error || 'Không thể tạo script');
      }
    } catch {
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Generate Form */}
      <div className="p-6 rounded-xl border border-border bg-card/50">
        <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          AI Viết Script Tự Động
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Chủ đề *</label>
            <Input
              placeholder="VD: 5 tips tiết kiệm tiền hiệu quả"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Niche</label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tai-chinh">Tài chính cá nhân</SelectItem>
                <SelectItem value="am-thuc">Ẩm thực</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="giao-duc">Giáo dục</SelectItem>
                <SelectItem value="kinh-doanh">Kinh doanh</SelectItem>
                <SelectItem value="cong-nghe">Công nghệ</SelectItem>
                <SelectItem value="suc-khoe">Sức khỏe</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Nền tảng</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube-shorts">YouTube Shorts</SelectItem>
                <SelectItem value="facebook-reels">Facebook Reels</SelectItem>
                <SelectItem value="instagram">Instagram Reels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">Thời lượng</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 giây</SelectItem>
                <SelectItem value="30">30 giây</SelectItem>
                <SelectItem value="60">60 giây</SelectItem>
                <SelectItem value="90">90 giây</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-slate-400 mb-1.5 block">Giọng điệu</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Thân thiện</SelectItem>
              <SelectItem value="professional">Chuyên nghiệp</SelectItem>
              <SelectItem value="funny">Hài hước</SelectItem>
              <SelectItem value="serious">Nghiêm túc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!topic || isGenerating}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo script...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Tạo script với AI ✨
            </>
          )}
        </Button>
      </div>

      {/* Script textarea */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white">Script</label>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>{wordCount} từ</span>
            <span>~{estimatedDuration}s</span>
          </div>
        </div>
        <Textarea
          placeholder="Nhập script hoặc sử dụng AI Generate ở trên..."
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
}
