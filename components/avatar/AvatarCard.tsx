import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarCardProps {
  id: string;
  name: string;
  imageUrl: string;
  voiceStatus: 'pending' | 'processing' | 'ready' | 'failed';
  videosCreated: number;
  isDefault?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
}

const statusConfig = {
  pending: { label: 'Chờ xử lý', variant: 'warning' as const },
  processing: { label: 'Đang clone', variant: 'default' as const },
  ready: { label: 'Sẵn sàng', variant: 'success' as const },
  failed: { label: 'Lỗi', variant: 'destructive' as const },
};

export default function AvatarCard({
  id,
  name,
  imageUrl,
  voiceStatus,
  videosCreated,
  onSelect,
  onDelete,
  selected,
}: AvatarCardProps) {
  const config = statusConfig[voiceStatus];

  return (
    <div
      onClick={() => onSelect?.(id)}
      className={cn(
        'group relative rounded-xl border bg-card overflow-hidden transition-all duration-300 cursor-pointer',
        selected
          ? 'border-brand-500 shadow-lg shadow-brand-500/20 ring-2 ring-brand-500/30'
          : 'border-border hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5'
      )}
    >
      {/* Avatar Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={imageUrl || '/placeholder-avatar.jpg'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg bg-card/80 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-card transition-all">
            <Edit className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1.5 rounded-lg bg-card/80 backdrop-blur-sm text-slate-300 hover:text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Selected check */}
        {selected && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-white text-sm mb-2 truncate">{name}</h3>
        <div className="flex items-center justify-between">
          <Badge variant={config.variant}>{config.label}</Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Video className="w-3 h-3" />
            {videosCreated}
          </span>
        </div>
      </div>
    </div>
  );
}
