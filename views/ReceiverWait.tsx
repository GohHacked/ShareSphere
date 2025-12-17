import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, Wifi, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Radar } from '../components/Radar';
import { PageTransition } from '../components/PageTransition';
import { peerService } from '../services/PeerService';
import { playSystemSound } from '../utils';

interface ReceiverWaitProps {
  onBack: () => void;
  onConnected: () => void;
}

export const ReceiverWait: React.FC<ReceiverWaitProps> = ({ onBack, onConnected }) => {
  const [myId, setMyId] = useState<string>('...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: any;

    const initPeer = async () => {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Pass false to indicate we are the receiver (generates short ID)
        const id = await peerService.init(false);
        
        if (mounted) {
          setMyId(id);
          setLoading(false);

          peerService.onConnection = () => {
            if (mounted) {
                playSystemSound('connect');
                onConnected();
            }
          };
        }
      } catch (err) {
        console.error("Failed to init peer in view", err);
        if (mounted) {
          setError("Сбой подключения");
          // Auto-retry after a delay
          retryTimeout = setTimeout(() => {
              if (mounted) initPeer();
          }, 3000);
        }
      }
    };

    initPeer();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      // We don't destroy here automatically to allow navigation if connected, 
      // but parent handles back navigation.
    };
  }, [onConnected]);

  const handleBack = () => {
    peerService.destroy();
    onBack();
  };

  const handleRetry = () => {
      setError(null);
      setLoading(true);
      peerService.init(false).then((id) => {
          setMyId(id);
          setLoading(false);
          peerService.onConnection = () => {
              playSystemSound('connect');
              onConnected();
          };
      }).catch(err => {
          console.error("Manual retry failed", err);
          setError("Сбой подключения");
      });
  };

  // Helper to format long UUIDs into something readable
  const formatId = (id: string) => {
    if (id.length > 10) {
      return id.substring(0, 6).toUpperCase(); 
    }
    return id;
  };

  return (
    <PageTransition className="bg-slate-900 relative">
      <header className="p-4 flex items-center">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-xl font-bold text-white">Ожидание получения</h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        
        <div className="mb-8 scale-75 opacity-50 grayscale mix-blend-screen">
           <Radar />
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10 w-full"
        >
            <h3 className="text-slate-400 mb-3 font-medium text-sm uppercase tracking-wide">Ваш ID для подключения</h3>
            {loading ? (
               <div className="flex flex-col items-center gap-2">
                   <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                   {error && <span className="text-xs text-blue-400 animate-pulse">Переподключение...</span>}
               </div>
            ) : (
              <div className="flex flex-col items-center">
                <motion.div 
                  className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 tracking-widest font-mono select-all break-all"
                >
                    {formatId(myId)}
                </motion.div>
                <p className="text-xs text-slate-600 mt-2 font-mono">{myId}</p>
              </div>
            )}
            
            {error && !loading && (
                 <div className="mt-4">
                     <p className="text-red-400 text-sm mb-2">{error}</p>
                     <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white text-sm mx-auto hover:bg-slate-700">
                         <RefreshCw className="w-4 h-4" /> Повторить
                     </button>
                 </div>
            )}
        </motion.div>

        {!error && (
            <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 rounded-3xl p-6 w-full max-w-sm backdrop-blur-md border border-slate-700/50"
            >
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-700/50">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Wifi className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <p className="text-base font-semibold text-white">Точка доступа готова</p>
                        <p className="text-xs text-slate-400">Ожидание подключения...</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <p className="text-base font-semibold text-white">P2P Шифрование</p>
                        <p className="text-xs text-slate-400">WebRTC Data Channel</p>
                    </div>
                </div>
            </motion.div>
        )}

      </main>
    </PageTransition>
  );
};