"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth";

interface UseWebSocketOptions {
  onBudgetAlert?: (alerts: Array<{ type: string; title: string; message: string }>) => void;
}

export function useWebSocket({ onBudgetAlert }: UseWebSocketOptions = {}) {
  const { token } = useAuthStore();
  const socketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    // WebSocket disabled - commented out
    // if (!token) return;
    // if (socketRef.current?.readyState === WebSocket.OPEN) return;

    // const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/api/socket";
    // const ws = new WebSocket(`${wsUrl}?token=${token}`);

    // ws.onopen = () => {
    //   console.log("WebSocket connected");
    // };

    // ws.onmessage = (event) => {
    //   try {
    //     const data = JSON.parse(event.data);
    //     if (data.event === "budget-alert" && onBudgetAlert) {
    //       onBudgetAlert(data.data);
    //     }
    //   } catch (error) {
    //     console.error("WebSocket message error:", error);
    //   }
    // };

    // ws.onclose = () => {
    //   console.log("WebSocket disconnected");
    //   // Reconnect after 3 seconds
    //   setTimeout(connect, 3000);
    // };

    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    // };

    // socketRef.current = ws;
  }, [token, onBudgetAlert]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    socket: socketRef.current,
    send: (event: string, data: unknown) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ event, data }));
      }
    },
  };
}
