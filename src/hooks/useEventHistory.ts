import { useQuery } from "@tanstack/react-query";
import { getHistory, getHistoryPaginated, HistoryEvent, PaginatedHistory } from "@/services/historyService";

export const useEventHistory = (region: string, searchQuery: string = "") => {
  return useQuery<HistoryEvent[], Error>({
    queryKey: ["eventHistory", region, searchQuery],
    queryFn: () => getHistory(region, searchQuery),
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    queryKey: ["eventHistoryPaginated", region, options],
    queryFn: () => getHistoryPaginated(region, options),
    staleTime: 2 * 60 * 1000,
  });
};
