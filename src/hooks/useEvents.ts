import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchEvents, ApiResponse } from "@/services/eventApi";

export const useEvents = (region: string) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["events", region],
    queryFn: () => fetchEvents(region),

    // Show cached/previous data instantly while the new region loads
    placeholderData: keepPreviousData,

    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(700 * 2 ** attemptIndex, 2500),
  });
};
