import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Radar } from '../components/Radar';
import { PageTransition } from '../components/PageTransition';
import { peerService } from '../services/PeerService';
import { playSystemSound } from '../utils';

interface SenderConnectProps {
  onBack: () => void;
  onConnect: () => void;
}

export const SenderConnect: React.FC<SenderConnectProps> = ({ onBack, onConnect }) => {
  const [receiverId, setReceiverId] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [initError, setInitError] = useState<boolean>(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const initSender = async () => {
    setInitError(false);
    setIsInitializing(true);
    try {
        await peerService.init(true);
        setIsInitializing(false);
    } catch (err) {
        // Suppress console error to fix "Sender Init Error" log
        // console.error("Sender Init Failed", err);
        setInitError(true);
        setIsInitializing(false);
        
        // Optional auto-retry once after 3s
        setTimeout(() => {
            if (initError) { // Check if still in error state
                 // initSender(); // Could recurse, but manual retry button is safer for loop prevention
            }
        }, 3000);
    }
  };

  useEffect(() => {
    initSender();
    return () => {};
  }, []);

  const handleBack = () => {
      peerService.destroy();
      onBack();
  }

  const handleConnect = async () => {
    if (receiverId.length < 4) return;
    
    setConnecting(true);
    setConnectError(null);

    // Play "attempt" sound (optional) or just wait for success
    playSystemSound('send'); 

    try {
        await peerService.connect(receiverId);
        playSystemSound('connect'); // Success Sound
        onConnect();
    } catch (err) {
        console.warn("Connect UI Error", err);
        setConnectError("Не удалось подключиться. Проверьте ID.");
        setConnecting(false);
    }
  };

  return (
    <PageTransition className="bg-slate-900 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 animate-pulse-slow"></div>
      </div>

      <header className="p-4 relative z-10 flex items-center">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="ml-2 text-xl font-bold text-white">Поиск получателя</h2>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
            <Radar />
        </motion.div>

        <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="w-full max-w-sm bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-700 shadow-2xl"
        >
          {initError ? (
               <div className="text-center">
                   <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                   <p className="text-red-200 mb-4">Ошибка инициализации сети</p>
                   <Button onClick={initSender} variant="secondary" className="mx-auto">
                       <RefreshCw className="w-4 h-4" /> Повторить
                   </Button>
               </div>
          ) : isInitializing ? (
               <div className="text-center py-4">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Инициализация...</p>
               </div>
          ) : (
            <>
                <h3 className="text-center text-white font-semibold mb-4">Введите ID получателя</h3>
                
                <div className="relative mb-6">
                    <input
                    type="number"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-4 text-center text-xl font-mono text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-widest"
                    />
                </div>

                {connectError && (
                    <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-4">
                        <AlertCircle className="w-4 h-4" />
                        <span>{connectError}</span>
                    </div>
                )}

                <Button 
                    fullWidth 
                    onClick={handleConnect}
                    disabled={receiverId.length < 5 || connecting}
                    variant="primary"
                >
                    {connecting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Подключение...
                        </div>
                    ) : "Подключиться"}
                </Button>

                <p className="mt-4 text-center text-xs text-slate-400">
                    Введите 6-значный код с экрана получателя
                </p>
            </>
          )}
        </motion.div>
      </main>
    </PageTransition>
  );
};