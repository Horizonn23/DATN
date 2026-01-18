"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, createContext, useContext, ReactNode } from "react";

interface PageCacheContextType {
  navigate: (path: string) => void;
}

const PageCacheContext = createContext<PageCacheContextType | null>(null);

export function usePageCache() {
  const context = useContext(PageCacheContext);
  if (!context) {
    throw new Error("usePageCache must be used within PageCacheProvider");
  }
  return context;
}

export function PageCacheProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  const navigate = (path: string) => {
    if (pathname === path || isNavigatingRef.current) return;

    isNavigatingRef.current = true;

    // Use startTransition for smoother navigation
    if (typeof window !== "undefined" && "startTransition" in React) {
      (React as any).startTransition(() => {
        router.push(path);
      });
    } else {
      router.push(path);
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  };

  return (
    <PageCacheContext.Provider value={{ navigate }}>
      {children}
    </PageCacheContext.Provider>
  );
}

// React import for startTransition
import * as React from "react";
