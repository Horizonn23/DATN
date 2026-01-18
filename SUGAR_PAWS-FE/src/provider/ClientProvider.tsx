"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ReactQueryProvider } from "@/provider/ReactQueryProvider";
import ReduxProvider from "./ReduxProvider";
import { SocketProvider } from "./SocketProvider";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ReactQueryProvider>
      <ReduxProvider>
        <SocketProvider>{children}</SocketProvider>
      </ReduxProvider>
      {mounted && (
        <Toaster
          position="top-right"
          toastOptions={{ className: "rounded-md shadow-lg mt-16" }}
        />
      )}
    </ReactQueryProvider>
  );
}
