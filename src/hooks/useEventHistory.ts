import { useQuery } from "@tanstack/react-query";
import { getHistory, getHistoryPaginated, HistoryEvent, PaginatedHistory } from "@/services/historyService";

export const useEventHistory = (region: string, searchQuery: string = "") => {
  return useQuery<HistoryEvent[], Error>({
    queryKey: ["eventHistory", region, searchQuery],
    queryFn: () => getHistory(region, searchQuery),
    staleTime: 0, // Always fetch fresh data
  });
};

export const useEventHistoryPaginated = (
  region: string,
  options: {
    page: number;
    pageSize?: number;
    searchQuery?: string;
    eventType?: 'event' | 'update' | 'all';
  }
) => {
  return useQuery<PaginatedHistory, Error>({
    // Use region as first key element for proper cache separation
    queryKey: [
      "eventHistoryPaginated",
      region,
      options.page,
      options.pageSize || 12,
      options.searchQuery || '',
      options.eventType || 'all',
    ],
    queryFn: () => getHistoryPaginated(region, options),
    staleTime: 0, // Always fetch fresh data when region changes
    refetchOnMount: true,
  });
};
