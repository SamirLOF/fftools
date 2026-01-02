import { useQuery } from "@tanstack/react-query";
import { getHistory, HistoryEvent } from "@/services/historyService";

export const useEventHistory = (region: string, searchQuery: string = "") => {
  return useQuery<HistoryEvent[], Error>({
    queryKey: ["eventHistory", region, searchQuery],
    queryFn: () => getHistory(region, searchQuery),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
