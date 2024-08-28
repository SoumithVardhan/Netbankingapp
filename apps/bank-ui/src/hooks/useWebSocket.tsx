import { useEffect, useRef, useState } from "react";

// Define the structure of the WebSocket messages
interface WebSocketMessage {
  userId?: number;
  token?: string;
  status?: string;
}

// Define the type of messages received via WebSocket
interface WebSocketMessageReceived extends WebSocketMessage {
  // You can add additional fields if needed
}

export function useWebSocket(userId: number | null) {
  const [messages, setMessages] = useState<WebSocketMessageReceived | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (userId) {
      ws.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_WORKER_URL);

      ws.current.onopen = () => {
        // Send userId after connection is opened
        if (ws.current) {
          ws.current.send(JSON.stringify({ userId }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessageReceived = JSON.parse(event.data);
          setMessages(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  // Use WebSocketMessage type for sendMessage parameter
  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
}
