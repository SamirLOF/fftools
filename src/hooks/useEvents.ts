import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchEvents, ApiResponse, ApiEvent } from "@/services/eventApi";
import { saveToHistory, detectRemovedEvents } from "@/services/historyService";

export const useEvents = (region: string) => {
  const queryClient = useQueryClient();
  const previousEventsRef = useRef<ApiEvent[]>([]);
  const previousUpdatesRef = useRef<ApiEvent[]>([]);

  const query = useQuery<ApiResponse, Error>({
    queryKey: ["events", region],
    queryFn: () => fetchEvents(region),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
  });

  // IMPORTANT: previous data must be per-region. When the user switches regions,
  // reset the previous snapshots so we don't compare SG vs TH and incorrectly
  // save the other region's banners into this region's history.
  useEffect(() => {
    previousEventsRef.current = [];
    previousUpdatesRef.current = [];
  }, [region]);

  // Track removed events and save to history
  useEffect(() => {
    if (query.data) {
      const currentEvents = query.data.events || [];
      const currentUpdates = query.data.updates || [];

      // Check for removed events
      if (previousEventsRef.current.length > 0) {
        const removedEvents = detectRemovedEvents(currentEvents, previousEventsRef.current);
        if (removedEvents.length > 0) {
          saveToHistory(removedEvents, region, "event");
        }
      }

      // Check for removed updates
      if (previousUpdatesRef.current.length > 0) {
        const removedUpdates = detectRemovedEvents(currentUpdates, previousUpdatesRef.current);
        if (removedUpdates.length > 0) {
          saveToHistory(removedUpdates, region, "update");
        }
      }

      // Store current events for next comparison
      previousEventsRef.current = currentEvents;
      previousUpdatesRef.current = currentUpdates;

      // Invalidate history queries to refresh
      queryClient.invalidateQueries({ queryKey: ["eventHistory", region] });
      queryClient.invalidateQueries({ queryKey: ["eventHistoryPaginated", region] });
    }
  }, [query.data, region, queryClient]);

  return query;
};

