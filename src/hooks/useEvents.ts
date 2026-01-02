import { useQuery } from "@tanstack/react-query";
import { fetchEvents, ApiResponse } from "@/services/eventApi";

export const useEvents = (region: string) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["events", region],
    queryFn: () => fetchEvents(region),
    staleTime: 10 * 60 * 1000, // 10 minutes - show cached data longer
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch if we have cached data
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
  });
};
