import { Peer, DataConnection } from 'peerjs';
import { DataPacket, FileHeader } from '../types';
import { generateId } from '../utils';

// Singleton service to manage peer connection
class PeerService {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private myId: string = '';
  
  // Callbacks
  public onConnection: ((conn: DataConnection) => void) | null = null;
  public onData: ((data: any) => void) | null = null;
  public onOpen: ((id: string) => void) | null = null;

  constructor() {}

  init(isSender: boolean): Promise<string> {
    // Always cleanup previous instance
    this.cleanup();

    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 5; 
      let retryTimeout: any = null;

      const attemptInit = () => {
        const id = isSender ? undefined : generateId();
        
        // Use explicit STUN server for better stability
        const config = {
          debug: 0, // Disable internal logs to prevent "Lost connection" spam
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        };

        const peerInstance = id ? new Peer(id, config) : new Peer(config);
        this.peer = peerInstance;

        // Clear any existing timeout from previous attempts
        if (retryTimeout) clearTimeout(retryTimeout);

        peerInstance.on('open', (id) => {
          if (this.peer !== peerInstance) return; // Ignore if stale
          this.myId = id;
          if (this.onOpen) this.onOpen(id);
          resolve(id);
        });

        peerInstance.on('connection', (conn) => {
          if (this.peer !== peerInstance) return; // Ignore if stale
          
          if (this.conn) {
            this.conn.close();
          }
          
          this.conn = conn;
          this.setupConnectionEvents(conn);
          if (this.onConnection) this.onConnection(conn);
        });

        peerInstance.on('error', (err: any) => {
          if (this.peer !== peerInstance) return; // Ignore if stale

          // Normalize error message
          const errorMessage = (err && (err.message || err.type || String(err))) || '';
          
          const isNetworkError = err.type === 'network' || 
                                 err.type === 'server-error' || 
                                 err.type === 'socket-error' || 
                                 err.type === 'socket-closed' ||
                                 err.type === 'peer-unavailable' ||
                                 errorMessage.includes('Lost connection') || 
                                 errorMessage.includes('Could not connect');
          
          const isUnavailableId = err.type === 'unavailable-id';

          // Retry logic
          if ((isNetworkError || (isUnavailableId && !isSender)) && retryCount < maxRetries) {
            const delay = 1000 + (retryCount * 500);
            // console.warn(`Retrying peer init (${retryCount + 1}/${maxRetries})...`);
            
            retryCount++;
            
            try {
                peerInstance.destroy();
            } catch (e) {}

            retryTimeout = setTimeout(() => {
                if (this.peer === peerInstance) {
                    attemptInit(); 
                }
            }, delay);
            return;
          }

          // If initialization hasn't finished (no ID yet), reject the promise
          if (!this.myId) {
            // Silence the console error for known network issues to satisfy user request
            // console.error("Peer init failed:", err);
            reject(new Error(errorMessage || "Initialization failed"));
          } else {
             // If we already have an ID, try reconnecting silently
             if (isNetworkError && !peerInstance.destroyed) {
                 peerInstance.reconnect();
             }
          }
        });

        peerInstance.on('disconnected', () => {
          if (this.peer !== peerInstance) return;
          if (this.myId && !peerInstance.destroyed) {
              peerInstance.reconnect();
          }
        });
      };

      attemptInit();
    });
  }

  connect(peerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.peer || this.peer.destroyed) {
        reject(new Error('Peer not initialized'));
        return;
      }

      if (this.conn) {
        this.conn.close();
      }

      const conn = this.peer.connect(peerId, {
        reliable: true
      });
      
      conn.on('open', () => {
        this.conn = conn;
        this.setupConnectionEvents(conn);
        resolve();
      });

      conn.on('error', (err) => {
        console.warn("Connection attempt error:", err);
        reject(err);
      });
    });
  }

  private setupConnectionEvents(conn: DataConnection) {
    conn.on('data', (data) => {
      if (this.conn !== conn) return;
      if (this.onData) this.onData(data);
    });
    
    conn.on('close', () => {
      if (this.conn !== conn) return;
      console.log("Data connection closed");
      this.conn = null;
    });

    conn.on('error', (err) => {
      console.warn("Data connection error:", err);
    });
  }

  send(data: any) {
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
  }

  private cleanup() {
    if (this.conn) {
        this.conn.close();
    }
    if (this.peer) {
        this.peer.removeAllListeners();
        this.peer.destroy();
    }
    this.peer = null;
    this.conn = null;
    this.myId = '';
  }

  destroy() {
    this.cleanup();
  }

  getId() {
    return this.myId;
  }
}

export const peerService = new PeerService();