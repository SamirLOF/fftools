import { useQuery } from "@tanstack/react-query";
import { fetchEvents, ApiResponse } from "@/services/eventApi";

export const useEvents = (region: string) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["events", region],
    queryFn: () => fetchEvents(region),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
  });
};
