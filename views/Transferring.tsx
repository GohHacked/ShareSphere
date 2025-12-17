import React, { useEffect, useState, useRef } from 'react';
import { FileItem, TransferProgress, DataPacket } from '../types';
import { CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { formatFileSize, playSystemSound } from '../utils';
import { PageTransition } from '../components/PageTransition';
import { peerService } from '../services/PeerService';

interface TransferringProps {
  files: FileItem[];
  isSender: boolean;
  onDone: () => void;
}

export const Transferring: React.FC<TransferringProps> = ({ files, isSender, onDone }) => {
  const [progress, setProgress] = useState(0);
  const [transferSpeed, setTransferSpeed] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [completed, setCompleted] = useState(false);
  
  // State for Receiver
  const [receivedFiles, setReceivedFiles] = useState<FileItem[]>([]);
  const receivedBuffer = useRef<ArrayBuffer[]>([]);
  const receivedSize = useRef(0);
  const currentMeta = useRef<{name: string, size: number, mime: string} | null>(null);

  // Constants
  const CHUNK_SIZE = 16 * 1024; // 16KB per chunk (safe for WebRTC)

  useEffect(() => {
    if (isSender) {
        startSending();
    } else {
        startReceiving();
    }

    return () => {
        // Cleanup if needed
    };
  }, []);

  const handleCompletion = () => {
      setCompleted(true);
      playSystemSound('complete');
  }

  const startSending = async () => {
    let totalBytesSent = 0;
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    const startTime = Date.now();

    for (const fileItem of files) {
        setCurrentFileName(fileItem.name);
        
        // 1. Send Header
        peerService.send({
            type: 'HEADER',
            name: fileItem.name,
            size: fileItem.size,
            mime: fileItem.file.type,
            id: fileItem.id
        });

        // 2. Read and Send Chunks
        const buffer = await fileItem.file.arrayBuffer();
        let offset = 0;

        while (offset < buffer.byteLength) {
            const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
            peerService.send({
                type: 'CHUNK',
                data: chunk
            });
            
            offset += chunk.byteLength;
            totalBytesSent += chunk.byteLength;
            
            // Calculate Progress
            const p = Math.min(100, (totalBytesSent / totalBytes) * 100);
            setProgress(p);

            // Calculate Speed (Simple moving average could be better, but this is simple)
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed > 0) {
                setTransferSpeed(totalBytesSent / elapsed);
            }

            // Small delay to prevent blocking UI event loop too much
            if (offset % (CHUNK_SIZE * 10) === 0) {
                await new Promise(r => setTimeout(r, 0));
            }
        }
    }

    // Done
    handleCompletion();
    peerService.send({ type: 'DONE' });
  };

  const startReceiving = () => {
    peerService.onData = (data: DataPacket) => {
        if (data.type === 'HEADER') {
            // New File
            currentMeta.current = { name: data.name, size: data.size, mime: data.mime };
            receivedBuffer.current = [];
            receivedSize.current = 0;
            setCurrentFileName(data.name);
        } 
        else if (data.type === 'CHUNK' && currentMeta.current) {
            // Receive Chunk
            receivedBuffer.current.push(data.data);
            receivedSize.current += data.data.byteLength;
            
            // Local File Progress (Simulated visual only as we don't know total batch size on receiver easily without a batch header)
            // But we can show we are active.
            
            // Check if file complete
            if (receivedSize.current >= currentMeta.current.size) {
                saveReceivedFile();
            }
        }
        else if (data.type === 'DONE') {
            handleCompletion();
            setProgress(100);
        }
    };
  };

  const saveReceivedFile = () => {
     if (!currentMeta.current) return;

     const blob = new Blob(receivedBuffer.current, { type: currentMeta.current.mime });
     const url = URL.createObjectURL(blob);
     
     // Trigger Download
     const a = document.createElement('a');
     a.href = url;
     a.download = currentMeta.current.name;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);

     // Add to visual list
     setReceivedFiles(prev => [...prev, {
         id: Math.random().toString(),
         name: currentMeta.current!.name,
         size: currentMeta.current!.size,
         type: 'other' as any, // simplified
         file: new File([], currentMeta.current!.name) // Dummy for UI
     }]);

     receivedBuffer.current = [];
     currentMeta.current = null;
  };

  return (
    <PageTransition className="bg-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Circle Progress */}
        <div className="relative w-72 h-72 mb-12">
           <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
             <circle
               cx="144"
               cy="144"
               r="130"
               stroke="currentColor"
               strokeWidth="12"
               fill="transparent"
               className="text-slate-800"
             />
             <motion.circle
               initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
               animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - (isSender ? progress : (completed ? 100 : 50)) / 100) }}
               transition={{ duration: 0.2, ease: "linear" }}
               cx="144"
               cy="144"
               r="130"
               stroke="currentColor"
               strokeWidth="12"
               strokeLinecap="round"
               fill="transparent"
               strokeDasharray={2 * Math.PI * 130}
               className={`${completed ? 'text-green-500' : 'text-blue-500'}`}
             />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             {completed ? (
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", stiffness: 200, damping: 15 }}
               >
                 <CheckCircle className="w-24 h-24 text-green-500 mb-2" />
               </motion.div>
             ) : (
               <div className="flex flex-col items-center">
                   {isSender ? (
                       <span className="text-5xl font-bold text-white font-mono tabular-nums">{Math.floor(progress)}%</span>
                   ) : (
                       <span className="text-2xl font-bold text-white font-mono animate-pulse">Скачивание...</span>
                   )}
                   {isSender && (
                       <span className="text-xs text-blue-400 mt-1 uppercase tracking-wider font-semibold">
                           {formatFileSize(transferSpeed)}/s
                       </span>
                   )}
               </div>
             )}
             <p className="text-slate-400 text-sm mt-4 font-medium px-4 py-1 bg-slate-800 rounded-full">
                 {completed ? (isSender ? 'Отправлено' : 'Получено') : (isSender ? 'Отправка...' : 'Прием данных...')}
             </p>
           </div>
        </div>

        {/* Current File Info */}
        {!completed && (
            <div className="text-center">
                <p className="text-white text-lg font-medium truncate max-w-xs mx-auto mb-1">
                    {currentFileName || 'Ожидание...'}
                </p>
            </div>
        )}

        {completed && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <p className="text-white text-2xl font-bold mb-2">Успешно!</p>
                <p className="text-slate-400">Файлы переданы</p>
            </motion.div>
        )}

      </div>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="p-6 bg-slate-800/80 backdrop-blur-xl rounded-t-[2.5rem] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20"
      >
          <h4 className="text-white font-semibold mb-4 ml-1">
              {isSender ? "Отправляемые файлы" : "Полученные файлы"}
          </h4>
          <div className="max-h-40 overflow-y-auto no-scrollbar space-y-3">
              {(isSender ? files : receivedFiles).map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                      <div className="text-slate-400">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <span className={`text-sm flex-1 truncate font-medium text-slate-300`}>
                          {file.name}
                      </span>
                  </div>
              ))}
          </div>
          
          {completed && (
              <div className="mt-6">
                  <Button fullWidth onClick={onDone} variant="primary">Готово</Button>
              </div>
          )}
      </motion.div>
    </PageTransition>
  );
};