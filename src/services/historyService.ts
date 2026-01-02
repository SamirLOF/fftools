import { supabase } from "@/integrations/supabase/client";
import { ApiEvent } from "./eventApi";

export interface HistoryEvent {
  id: string;
  region: string;
  title: string;
  banner: string;
  start_date: string;
  end_date: string;
  details: string | null;
  link: string | null;
  event_type: string;
  removed_at: string;
}

export interface PaginatedHistory {
  data: HistoryEvent[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Save removed events to history
export const saveToHistory = async (
  events: ApiEvent[],
  region: string,
  eventType: 'event' | 'update'
): Promise<void> => {
  if (events.length === 0) return;

  const historyEntries = events.map((event) => ({
    region,
    title: event.Title,
    banner: event.Banner,
    start_date: event.Start,
    end_date: event.End,
    details: event.Details || null,
    link: event.link || null,
    event_type: eventType,
  }));

  // Use upsert to avoid duplicates
  await supabase
    .from("event_history")
    .upsert(historyEntries, { 
      onConflict: 'region,title,banner,start_date,end_date',
      ignoreDuplicates: true 
    });
};

// Get paginated history for a specific region
export const getHistoryPaginated = async (
  region: string,
  options: {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    eventType?: 'event' | 'update' | 'all';
  } = {}
): Promise<PaginatedHistory> => {
  const { page = 1, pageSize = 12, searchQuery, eventType = 'all' } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build count query
  let countQuery = supabase
    .from("event_history")
    .select("*", { count: "exact", head: true })
    .eq("region", region);

  if (eventType !== 'all') {
    countQuery = countQuery.eq("event_type", eventType);
  }

  if (searchQuery && searchQuery.trim()) {
    countQuery = countQuery.ilike("title", `%${searchQuery}%`);
  }

  const { count } = await countQuery;

  // Build data query
  let dataQuery = supabase
    .from("event_history")
    .select("*")
    .eq("region", region)
    .order("removed_at", { ascending: false })
    .range(from, to);

  if (eventType !== 'all') {
    dataQuery = dataQuery.eq("event_type", eventType);
  }

  if (searchQuery && searchQuery.trim()) {
    dataQuery = dataQuery.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await dataQuery;

  if (error) {
    console.error("Error fetching history:", error);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: data || [],
    total,
    page,
    pageSize,
    totalPages,
  };
};

// Simple get history (for backward compatibility)
export const getHistory = async (
  region: string,
  searchQuery?: string
): Promise<HistoryEvent[]> => {
  const result = await getHistoryPaginated(region, { searchQuery, pageSize: 100 });
  return result.data;
};

// Compare current events with previous and detect removed ones
export const detectRemovedEvents = (
  currentEvents: ApiEvent[],
  previousEvents: ApiEvent[]
): ApiEvent[] => {
  const currentSet = new Set(
    currentEvents.map((e) => `${e.Title}-${e.Banner}-${e.Start}-${e.End}`)
  );

  return previousEvents.filter(
    (event) => !currentSet.has(`${event.Title}-${event.Banner}-${event.Start}-${event.End}`)
  );
};
