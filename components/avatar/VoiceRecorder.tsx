'use client';

import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, RotateCcw, Pause } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    duration,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob, onRecordingComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      {/* Suggestion script */}
      <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
        <p className="text-xs text-brand-400 font-medium mb-2">📝 Gợi ý script để đọc (30 giây - 5 phút):</p>
        <p className="text-sm text-slate-300 italic leading-relaxed">
          &quot;Xin chào, tôi là [tên của bạn]. Hôm nay tôi sẽ chia sẻ với các bạn về kinh nghiệm của tôi trong lĩnh vực này.
          Tôi tin rằng mỗi người đều có khả năng đạt được mục tiêu của mình nếu kiên trì và nỗ lực.
          Hãy cùng bắt đầu hành trình thú vị này nhé. Đừng quên theo dõi kênh để cập nhật những nội dung mới nhất.&quot;
        </p>
      </div>

      {/* Recording UI */}
      <div className="flex flex-col items-center gap-6">
        {/* Waveform animation */}
        {isRecording && (
          <div className="flex items-center gap-1 h-12">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-brand-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main button */}
        <div className="flex items-center gap-4">
          {!audioBlob ? (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-gradient-to-br from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 shadow-lg shadow-brand-500/30'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={togglePlayback}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="icon" onClick={resetRecording}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Duration / Status */}
        <div className="text-center">
          {isRecording ? (
            <div>
              <p className="text-2xl font-mono text-white font-bold">{formatTime(duration)}</p>
              <p className="text-sm text-red-400 mt-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Đang ghi âm...
              </p>
            </div>
          ) : audioBlob ? (
            <div>
              <p className="text-lg text-white font-medium">Ghi âm hoàn tất</p>
              <p className="text-sm text-slate-400">{formatTime(duration)} — Click play để nghe lại</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Nhấn nút micro để bắt đầu ghi âm (tối thiểu 30 giây)
            </p>
          )}
        </div>
      </div>

      {/* Audio player (hidden) */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
