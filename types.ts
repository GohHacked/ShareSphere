export type AppView = 'home' | 'select-files' | 'sender-connect' | 'receiver-wait' | 'transferring' | 'completed';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other'
}

export interface FileItem {
  id: string;
  file: File;
  type: FileType;
  previewUrl?: string;
  size: number;
  name: string;
}

export interface TransferProgress {
  totalBytes: number;
  transferredBytes: number;
  speed: number; // bytes per second
  currentFileName: string;
  percentage: number;
}

// Protocol Types
export type DataType = 'HEADER' | 'CHUNK' | 'DONE';

export interface FileHeader {
  type: 'HEADER';
  name: string;
  size: number;
  mime: string;
  id: string;
}

export interface FileChunk {
  type: 'CHUNK';
  data: ArrayBuffer;
}

export interface TransferComplete {
  type: 'DONE';
}

export type DataPacket = FileHeader | FileChunk | TransferComplete;