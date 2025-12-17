import React, { useRef, useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Video, Music, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button';
import { FileCard } from '../components/FileCard';
import { FileItem, FileType } from '../types';
import { processFiles, formatFileSize } from '../utils';
import { PageTransition } from '../components/PageTransition';

interface SelectFilesProps {
  onBack: () => void;
  onNext: (files: FileItem[]) => void;
}

export const SelectFiles: React.FC<SelectFilesProps> = ({ onBack, onNext }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState<FileType | 'all'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = processFiles(e.target.files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const triggerInput = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  const categories = [
    { id: 'all', label: 'Все', icon: null },
    { id: FileType.IMAGE, label: 'Фото', icon: <ImageIcon className="w-4 h-4" />, accept: "image/*" },
    { id: FileType.VIDEO, label: 'Видео', icon: <Video className="w-4 h-4" />, accept: "video/*" },
    { id: FileType.AUDIO, label: 'Музыка', icon: <Music className="w-4 h-4" />, accept: "audio/*" },
  ];

  const filteredFiles = activeTab === 'all' 
    ? selectedFiles 
    : selectedFiles.filter(f => f.type === activeTab);

  return (
    <PageTransition className="bg-slate-900">
      {/* Header */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-white">Выбор файлов</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFiles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-64 text-slate-500"
          >
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-700">
              <Plus className="w-8 h-8 text-slate-600" />
            </div>
            <p>Нет выбранных файлов</p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence mode='popLayout'>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <FileCard item={file} onRemove={removeFile} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
      />
      
      {/* Action Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="p-4 bg-slate-900 border-t border-slate-800 safe-area-bottom z-30"
      >
        <div className="flex items-center justify-between mb-4">
           <span className="text-slate-400 text-sm">
             Выбрано: <span className="text-white font-bold">{selectedFiles.length}</span>
           </span>
           <span className="text-slate-400 text-sm">
             Размер: <span className="text-white font-bold">{formatFileSize(totalSize)}</span>
           </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-3">
            <Button 
                variant="secondary" 
                className="!px-4"
                onClick={() => {
                    const currentCategory = categories.find(c => c.id === activeTab);
                    triggerInput(currentCategory?.accept || "*/*");
                }}
            >
                <Plus className="w-6 h-6" />
            </Button>
            <Button 
                disabled={selectedFiles.length === 0} 
                onClick={() => onNext(selectedFiles)}
                className="shadow-xl shadow-blue-600/20"
            >
                Далее ({selectedFiles.length})
            </Button>
        </div>
      </motion.div>
    </PageTransition>
  );
};