import { useQuery } from "@tanstack/react-query";
import { fetchEvents, ApiResponse } from "@/services/eventApi";

export const useEvents = (region: string) => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["events", region],
    queryFn: () => fetchEvents(region),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
