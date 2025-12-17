import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Share2, Zap, Radio, MoreVertical, Info, X, Volume2, Sparkles, Wifi, Smartphone, Lock, HelpCircle, Gift, Mail, FileWarning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { speakText, stopSpeech } from '../utils';

interface HomeProps {
  onSend: () => void;
  onReceive: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSend, onReceive }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceHelp = () => {
     setActiveFaq(null); // Close other accorions
     const text = "Привет! Я Максим, ваш помощник в Шер Сфер. Как пользоваться приложением? Всё просто. Шаг первый. Убедитесь, что оба устройства подключены к одной Вай Фай сети. Шаг второй. На одном устройстве нажмите Отправить, на другом Получить. Шаг третий. Введите код с экрана. И всё! Ваши файлы улетят со скоростью света.";
     speakText(text);
  };

  const handleFaqClick = (id: string, text: string) => {
      if (activeFaq === id) {
          setActiveFaq(null);
          stopSpeech();
      } else {
          setActiveFaq(id);
          speakText(text);
      }
  };

  const closeInfo = () => {
      stopSpeech();
      setShowInfo(false);
      setActiveFaq(null);
  };

  return (
    <PageTransition className="relative overflow-hidden">
      {/* Dynamic Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

      <header className="p-6 pt-12 relative z-10 flex items-center justify-between">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10">
            <Share2 className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
              ShareSphere
            </h1>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-mono text-green-400">ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Kebab Menu */}
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-2 rounded-full hover:bg-white/10 text-slate-300 transition-colors"
            >
                <MoreVertical className="w-6 h-6" />
            </button>
            
            <AnimatePresence>
                {showMenu && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-0 top-12 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                    >
                        <button 
                            onClick={() => { setShowInfo(true); setShowMenu(false); }}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 text-slate-200 hover:bg-white/5 transition-colors"
                        >
                            <Info className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium">О приложении</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-6 p-6 relative z-10">
        
        {/* Send Button */}
        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          className="group relative h-52 w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-blue-400/30"
        >
          {/* Button Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800" />
          
          {/* Beautiful Abstract Object: The "Flow" */}
          <div className="absolute right-[-20px] bottom-[-40px] opacity-40 group-hover:opacity-60 transition-opacity duration-500">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
              <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="url(#paint0_linear)"/>
              <path d="M160 100C160 133.137 133.137 160 100 160C66.8629 160 40 133.137 40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100Z" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
              <path d="M180 50L130 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.2"/>
              <path d="M190 80L120 40" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.2"/>
              <defs>
                <linearGradient id="paint0_linear" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0.2"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-between p-8">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <Send className="w-7 h-7 text-white -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            
            <div className="text-left z-10">
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight drop-shadow-md flex items-center gap-2">
                Отправить <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </h2>
              <p className="text-blue-100 text-sm font-medium opacity-90">Фото, видео, музыка</p>
            </div>
          </div>
        </motion.button>

        {/* Receive Button */}
        <motion.button 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReceive}
          className="group relative h-52 w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(147,51,234,0.3)] border border-purple-400/30"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-purple-600 to-purple-900" />
          
          {/* Beautiful Abstract Object: The "Portal" */}
          <div className="absolute left-[-30px] top-[-30px] opacity-40 group-hover:opacity-60 transition-opacity duration-500">
             <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow" style={{ animationDuration: '10s' }}>
                <circle cx="110" cy="110" r="100" stroke="white" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="10 10"/>
                <circle cx="110" cy="110" r="80" stroke="white" strokeWidth="20" strokeOpacity="0.1"/>
                <circle cx="110" cy="110" r="60" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                <path d="M110 0V220" stroke="url(#paint_linear_v)" strokeWidth="40" strokeOpacity="0.1"/>
                <defs>
                   <linearGradient id="paint_linear_v" x1="110" y1="0" x2="110" y2="220" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0"/>
                      <stop offset="0.5" stopColor="white" stopOpacity="0.5"/>
                      <stop offset="1" stopColor="white" stopOpacity="0"/>
                   </linearGradient>
                </defs>
             </svg>
          </div>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-end justify-between p-8">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <Download className="w-7 h-7 text-white group-hover:animate-bounce" />
            </div>
            
            <div className="text-right z-10">
              <h2 className="text-3xl font-bold text-white mb-1 tracking-tight drop-shadow-md flex items-center justify-end gap-2">
                Получить <Radio className="w-5 h-5 text-fuchsia-300" />
              </h2>
              <p className="text-purple-100 text-sm font-medium opacity-90">Ожидание подключения</p>
            </div>
          </div>
        </motion.button>
      </main>

      <footer className="p-6 text-center relative z-10">
        <p className="text-slate-500 text-xs mb-1">Требуется одна Wi-Fi сеть</p>
        <div className="inline-block px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-md">
            <p className="text-[10px] text-slate-400 font-mono tracking-widest">v1.0.0 beta</p>
        </div>
      </footer>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
             <motion.div 
               initial={{ y: 50, scale: 0.9 }}
               animate={{ y: 0, scale: 1 }}
               exit={{ y: 50, scale: 0.9 }}
               className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
             >
                {/* Modal Header */}
                <div className="p-6 pb-2 flex justify-between items-start bg-slate-900/50 backdrop-blur-md z-10">
                   <div>
                       <div className="flex items-center gap-2 mb-2">
                           <Sparkles className="w-5 h-5 text-yellow-400" />
                           <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Справка</span>
                       </div>
                       <h2 className="text-2xl font-bold text-white">О приложении</h2>
                   </div>
                   <button onClick={closeInfo} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors">
                       <X className="w-5 h-5 text-slate-300" />
                   </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 pt-2 overflow-y-auto no-scrollbar flex-1 space-y-4">
                    
                    {/* Interactive FAQ Buttons */}
                    <div className="space-y-3 mb-6">
                        {/* What is this app? */}
                        <div className="rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-700/50">
                            <button 
                                onClick={() => handleFaqClick('what-is', 'Шер Сфер — это мощный инструмент для мгновенной передачи файлов между устройствами. Мы используем прямую связь, чтобы ваши фото и видео летали на максимальной скорости, минуя облака и интернет.')}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === 'what-is' ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                                        <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-white font-medium text-left">Что это за приложение?</span>
                                </div>
                                {activeFaq === 'what-is' && <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />}
                            </button>
                            <AnimatePresence>
                                {activeFaq === 'what-is' && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 text-sm text-slate-300 leading-relaxed">
                                            ShareSphere — это мощный инструмент для мгновенной передачи файлов. Мы используем прямую P2P связь, чтобы ваши данные передавались напрямую между устройствами на максимальной скорости.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* What does it do? */}
                        <div className="rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-700/50">
                            <button 
                                onClick={() => handleFaqClick('what-gives', 'Это приложение даёт вам свободу. Передавайте файлы любого размера без сжатия и потери качества. Не нужны провода, флешки или интернет. Просто подключитесь и отправляйте гигабайты данных за секунды.')}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === 'what-gives' ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400'}`}>
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <span className="text-white font-medium text-left">Что оно даёт?</span>
                                </div>
                                {activeFaq === 'what-gives' && <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />}
                            </button>
                            <AnimatePresence>
                                {activeFaq === 'what-gives' && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 text-sm text-slate-300 leading-relaxed">
                                            Свободу и скорость. Передавайте файлы любого размера без сжатия. Забудьте о медленном интернете или кабелях. Делитесь музыкой, 4K видео и архивами фотографий за считанные мгновения.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Technical Support */}
                        <div className="rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-700/50">
                            <button 
                                onClick={() => handleFaqClick('support', 'Техническая поддержка. Если у вас возникли проблемы, напишите нам на почту. Правила обращения: укажите тему письма, подробно опишите ошибку и прикрепите скриншоты.')}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === 'support' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-400'}`}>
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-white font-medium text-left">Техническая поддержка</span>
                                </div>
                                {activeFaq === 'support' && <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />}
                            </button>
                            <AnimatePresence>
                                {activeFaq === 'support' && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 text-sm text-slate-300 leading-relaxed">
                                            <p className="mb-3">Мы всегда готовы помочь! Пишите нам на почту:</p>
                                            
                                            <a 
                                                href="mailto:shsusjsj77@gmail.com" 
                                                className="flex items-center gap-2 w-full p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 mb-4 transition-colors text-blue-300 font-mono text-xs sm:text-sm"
                                            >
                                                <Mail className="w-4 h-4" />
                                                shsusjsj77@gmail.com
                                            </a>

                                            <div className="flex items-center gap-2 mb-2">
                                                <FileWarning className="w-4 h-4 text-orange-400" />
                                                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Правила обращения</h5>
                                            </div>
                                            <ul className="list-disc list-inside space-y-2 text-slate-400 text-xs pl-1">
                                                <li>Укажите тему письма (например, "Ошибка подключения")</li>
                                                <li>Опишите проблему максимально подробно</li>
                                                <li>По возможности прикрепите скриншоты</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">Инструкция</h3>

                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                             <Wifi className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Шаг 1. Подключение</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Подключите оба устройства к одной Wi-Fi сети.</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                             <Smartphone className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Шаг 2. Выбор роли</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Одно устройство — "Отправить", другое — "Получить".</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                             <Lock className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-1">Шаг 3. Код доступа</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">Введите цифры с экрана получателя.</p>
                        </div>
                    </div>

                    {/* Main Voice Assistant Button */}
                    <div className="pt-4 pb-2">
                        <button 
                            onClick={handleVoiceHelp}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-indigo-500/30 group hover:border-indigo-500/60 transition-all active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                                    <Volume2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-semibold">Озвучить инструкцию</p>
                                    <p className="text-xs text-indigo-300">Голос: Максим</p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <div className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                                <div className="w-1 h-5 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </button>
                    </div>

                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};