// d:\HUST\Do_an_tot_nghiep\SUGAR_PAWS-FE\src\const\config.ts
export const reactQueryDefaultConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching when window regains focus
      refetchOnMount: false, // Disable refetch when component mounts - use cached data
      refetchOnReconnect: true, // Enable refetch when reconnecting
      retry: 1, // Number of retry attempts for failed queries
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (formerly cacheTime)
      // Showing loading indicators only after a delay to prevent flashes
      suspense: false,
      useErrorBoundary: false,
    },
    mutations: {
      retry: 1,
      useErrorBoundary: false,
    },
  },
};
