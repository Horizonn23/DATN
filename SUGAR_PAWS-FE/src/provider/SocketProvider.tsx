"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Notification } from "@/types/notification";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    console.log("📦 User from localStorage:", userStr);
    if (!userStr) {
      console.warn("⚠️ No user in localStorage - socket not connecting");
      return;
    }

    const user = JSON.parse(userStr);
    if (!user?.id) {
      console.warn("⚠️ User has no ID - socket not connecting");
      return;
    }

    console.log("🔌 Connecting socket for user ID:", user.id);

    // Connect to socket server
    const socketInstance = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setIsConnected(true);

      // Register user with socket
      console.log("📤 Registering user with socket...", { userId: user.id });
      socketInstance.emit("register", { userId: user.id });
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    // Listen for notifications
    socketInstance.on("notification", (notification: Notification) => {
      console.log("🔔 New notification:", notification);

      // Show toast notification
      toast.success(`${notification.title}\n${notification.message}`, {
        duration: 5000,
      });

      // Invalidate queries to refresh notification list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
