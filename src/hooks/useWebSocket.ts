import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  onDataUpdate?: (data: unknown) => void;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback?: (...args: unknown[]) => void) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
    onDataUpdate,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setIsConnecting(true);
    setError(null);

    socketRef.current = io(url, {
      autoConnect: true,
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      setIsConnecting(false);
    });

    socketRef.current.on('connect_error', (err) => {
      setError(err.message);
      setIsConnecting(false);
    });

    socketRef.current.on('reconnect_error', (err) => {
      setError(`Reconnection failed: ${err.message}`);
    });

    // Listen for data updates
    if (onDataUpdate) {
      socketRef.current.on('data-update', onDataUpdate);
    }
  }, [url, reconnection, reconnectionAttempts, reconnectionDelay, onDataUpdate]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const emit = useCallback((event: string, data?: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};
