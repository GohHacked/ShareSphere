import React from 'react';
import { FileItem, FileType } from '../types';
import { formatFileSize } from '../utils';
import { Image, Music, Video, FileText, X } from 'lucide-react';

interface FileCardProps {
  item: FileItem;
  onRemove?: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ item, onRemove }) => {
  const getIcon = () => {
    switch (item.type) {
      case FileType.IMAGE: return <Image className="w-6 h-6 text-purple-400" />;
      case FileType.VIDEO: return <Video className="w-6 h-6 text-red-400" />;
      case FileType.AUDIO: return <Music className="w-6 h-6 text-green-400" />;
      default: return <FileText className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl mb-2 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
        {item.previewUrl ? (
          <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          getIcon()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
        <p className="text-xs text-slate-500">{formatFileSize(item.size)}</p>
      </div>
      {onRemove && (
        <button 
          onClick={() => onRemove(item.id)}
          className="p-2 hover:bg-red-500/10 rounded-full text-slate-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};