/**
 * WebSocket hook for real-time updates
 *
 * Manages WebSocket connection state with automatic reconnection
 * and connection status tracking.
 */

import { useState, useEffect, useCallback, useRef } from "react";

export type WebSocketStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

export interface WebSocketMessage {
  type: string;
  timestamp?: string;
  data?: unknown;
}

export interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
}

export interface UseWebSocketReturn {
  status: WebSocketStatus;
  lastMessage: WebSocketMessage | null;
  reconnectAttempts: number;
  send: (message: WebSocketMessage) => void;
  disconnect: () => void;
  connect: () => void;
}

/**
 * Hook for managing WebSocket connections with automatic reconnection
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onStatusChange,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>("disconnected");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isUnmountedRef = useRef(false);
  const shouldReconnectRef = useRef(true);

  // Update status and notify callback
  const updateStatus = useCallback(
    (newStatus: WebSocketStatus) => {
      if (isUnmountedRef.current) return;
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  // Clear reconnect timeout
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    updateStatus("connecting");

    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) return;
        updateStatus("connected");
        setReconnectAttempts(0);
        clearReconnectTimeout();
      };

      socket.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(message);
          onMessage?.(message);
        } catch {
          console.warn("Failed to parse WebSocket message:", event.data);
        }
      };

      socket.onclose = () => {
        if (isUnmountedRef.current) return;
        socketRef.current = null;

        if (shouldReconnectRef.current) {
          if (reconnectAttempts < maxReconnectAttempts) {
            updateStatus("reconnecting");
            setReconnectAttempts((prev) => prev + 1);
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          } else {
            updateStatus("disconnected");
          }
        } else {
          updateStatus("disconnected");
        }
      };

      socket.onerror = () => {
        if (isUnmountedRef.current) return;
        // Error handling - onclose will be called after onerror
        console.warn("WebSocket error occurred");
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      updateStatus("disconnected");
    }
  }, [
    url,
    reconnectInterval,
    maxReconnectAttempts,
    reconnectAttempts,
    onMessage,
    updateStatus,
    clearReconnectTimeout,
  ]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    updateStatus("disconnected");
  }, [clearReconnectTimeout, updateStatus]);

  // Send a message
  const send = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send message: WebSocket is not connected");
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    isUnmountedRef.current = false;
    shouldReconnectRef.current = true;
    connect();

    return () => {
      isUnmountedRef.current = true;
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    status,
    lastMessage,
    reconnectAttempts,
    send,
    disconnect,
    connect,
  };
}
