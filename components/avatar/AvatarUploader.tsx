'use client';

import { useCallback, useState } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';

interface AvatarUploaderProps {
  onImageSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
}

export default function AvatarUploader({ onImageSelect, preview, onClear }: AvatarUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
          alert('Chỉ chấp nhận ảnh định dạng JPG hoặc PNG');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Ảnh không được vượt quá 5MB');
          return;
        }
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Ảnh không được vượt quá 5MB');
          return;
        }
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  if (preview) {
    return (
      <div className="relative group">
        <div className="rounded-xl border border-border overflow-hidden aspect-square max-w-[300px] mx-auto">
          <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <p className="text-center text-sm text-slate-400 mt-3">
          ✅ Ảnh đã chọn. Click X để chọn lại.
        </p>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer
        ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-border hover:border-brand-500/50 hover:bg-card'}`}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-brand-500/10 flex items-center justify-center">
          {isDragging ? (
            <Upload className="w-8 h-8 text-brand-400 animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-brand-400" />
          )}
        </div>
        <div>
          <p className="text-white font-medium mb-1">
            {isDragging ? 'Thả ảnh tại đây' : 'Kéo thả ảnh hoặc click để chọn'}
          </p>
          <p className="text-sm text-slate-500">PNG, JPG — Tối đa 5MB</p>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          💡 Gợi ý: Dùng ảnh chụp thẳng mặt, ánh sáng tốt, background đơn giản cho kết quả tốt nhất.
        </p>
      </div>
    </div>
  );
}
