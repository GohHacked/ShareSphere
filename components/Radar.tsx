import React from 'react';

export const Radar: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Core */}
      <div className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.5)] z-10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>
      
      {/* Rings */}
      <div className="absolute w-full h-full border border-blue-500/30 rounded-full animate-ping-slow" style={{ animationDuration: '3s' }}></div>
      <div className="absolute w-[70%] h-[70%] border border-blue-400/30 rounded-full animate-ping-slow" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
      <div className="absolute w-[40%] h-[40%] border border-blue-300/30 rounded-full animate-ping-slow" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
      
      {/* Scanning Line */}
      <div className="absolute w-full h-full rounded-full overflow-hidden opacity-20 animate-spin" style={{ animationDuration: '4s' }}>
        <div className="w-1/2 h-1/2 bg-gradient-to-br from-transparent to-blue-400 absolute top-0 left-0 origin-bottom-right rotate-45"></div>
      </div>
    </div>
  );
};