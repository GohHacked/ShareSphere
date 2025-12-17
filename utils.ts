import { FileType, FileItem } from './types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (file: File): FileType => {
  if (file.type.startsWith('image/')) return FileType.IMAGE;
  if (file.type.startsWith('video/')) return FileType.VIDEO;
  if (file.type.startsWith('audio/')) return FileType.AUDIO;
  return FileType.OTHER; // Simplification for demo
};

export const generateId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const processFiles = (files: FileList | null): FileItem[] => {
  if (!files) return [];
  return Array.from(files).map((file) => ({
    id: Math.random().toString(36).substring(7),
    file,
    name: file.name,
    size: file.size,
    type: getFileType(file),
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }));
};

// Sound Synthesizer
export const playSystemSound = (type: 'connect' | 'complete' | 'send') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (type === 'connect') {
      // Pleasant "Ding-Dong" ascending
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } 
    else if (type === 'complete') {
      // Triumphant Major Chord
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = freq;
        const startTime = now + (i * 0.1);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
        
        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });
    }
    else if (type === 'send') {
      // Quick "Swoosh" / Pop
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    }

  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

// Speech Synthesis
let speechUtterance: SpeechSynthesisUtterance | null = null;

export const stopSpeech = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};

export const speakText = (text: string) => {
  if (!window.speechSynthesis) return;
  
  // Cancel existing
  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 0.9; // Slightly lower pitch for male-like tone

  // Try to find a good Russian voice
  // Browsers load voices asynchronously.
  const voices = window.speechSynthesis.getVoices();
  
  // Priority: Maxim -> Pavel -> Any 'Male' in name -> Any Russian
  const preferredVoice = voices.find(v => v.lang.includes('ru') && v.name.toLowerCase().includes('maxim')) ||
                         voices.find(v => v.lang.includes('ru') && v.name.toLowerCase().includes('pavel')) ||
                         voices.find(v => v.lang.includes('ru') && v.name.toLowerCase().includes('male')) ||
                         voices.find(v => v.lang.includes('ru'));

  if (preferredVoice) {
      utterance.voice = preferredVoice;
  }

  speechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};