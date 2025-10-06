import { useEffect, useRef, useState } from 'react';

type MessageHandler = (data: any) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private messageHandlers: MessageHandler[] = [];

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.socket) {
      this.disconnect();
    }
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(data));
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  // Alias for addMessageHandler for backward compatibility
  onMessage(handler: MessageHandler) {
    this.addMessageHandler(handler);
  }
}

// React hook for using WebSocketService in components
export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    const wsService = new WebSocketService(url);
    wsServiceRef.current = wsService;

    const handleMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
    };

    wsService.addMessageHandler(handleMessage);
    wsService.connect();

    return () => {
      wsService.removeMessageHandler(handleMessage);
      wsService.disconnect();
    };
  }, [url]);

  const sendMessage = (data: any) => {
    wsServiceRef.current?.send(data);
  };

  return { messages, sendMessage };
}
