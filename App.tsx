import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Home } from './views/Home';
import { SelectFiles } from './views/SelectFiles';
import { SenderConnect } from './views/SenderConnect';
import { ReceiverWait } from './views/ReceiverWait';
import { Transferring } from './views/Transferring';
import { AppView, FileItem } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isSender, setIsSender] = useState(false);

  // Navigation Handlers
  const goHome = () => {
    setFiles([]);
    setIsSender(false);
    setView('home');
  };

  const startSending = () => {
    setIsSender(true);
    setView('select-files');
  };

  const startReceiving = () => {
    setIsSender(false);
    setFiles([]); // Receiver starts empty
    setView('receiver-wait');
  };

  const handleFilesSelected = (selectedFiles: FileItem[]) => {
    setFiles(selectedFiles);
    setView('sender-connect');
  };

  const handleConnectionEstablished = () => {
    setView('transferring');
  };

  // Render View Switcher
  const renderView = () => {
    switch (view) {
      case 'home':
        return <Home key="home" onSend={startSending} onReceive={startReceiving} />;
      
      case 'select-files':
        return <SelectFiles key="select-files" onBack={goHome} onNext={handleFilesSelected} />;
      
      case 'sender-connect':
        return <SenderConnect key="sender-connect" onBack={() => setView('select-files')} onConnect={handleConnectionEstablished} />;
      
      case 'receiver-wait':
        return <ReceiverWait key="receiver-wait" onBack={goHome} onConnected={handleConnectionEstablished} />;
      
      case 'transferring':
        return (
          <Transferring 
            key="transferring"
            files={files} 
            isSender={isSender} 
            onDone={goHome} 
          />
        );
      
      default:
        return <Home key="home-default" onSend={startSending} onReceive={startReceiving} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center font-sans">
      {/* Mobile Container Limitation */}
      <div className="w-full max-w-md bg-slate-900 h-screen shadow-2xl overflow-hidden relative border-x border-slate-800">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;