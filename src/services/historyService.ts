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

// Get history for a specific region
export const getHistory = async (
  region: string,
  searchQuery?: string
): Promise<HistoryEvent[]> => {
  let query = supabase
    .from("event_history")
    .select("*")
    .eq("region", region)
    .order("removed_at", { ascending: false });

  if (searchQuery && searchQuery.trim()) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data || [];
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
