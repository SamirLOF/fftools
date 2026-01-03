import { supabase } from "@/integrations/supabase/client";

export interface ApiEvent {
  Title: string;
  Start: string;
  End: string;
  Banner: string;
  Details?: string;
  link?: string;
}

export interface ApiResponse {
  status: string;
  "API Owner": string;
  region: string;
  events: ApiEvent[];
  updates: ApiEvent[];
}

export const regions = [
  { code: "SG", name: "Singapore" },
  { code: "BD", name: "Bangladesh" },
  { code: "IND", name: "India" },
  { code: "CIS", name: "CIS" },
  { code: "EU", name: "Europe" },
  { code: "NA", name: "North America" },
  { code: "PK", name: "Pakistan" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "ME", name: "Middle East" },
  { code: "BR", name: "Brazil" },
  { code: "SAC", name: "South America" },
  { code: "VN", name: "Vietnam" },
];

const API_KEY = "SHAHG";
const BASE_URL = "https://x-ff.vercel.app/event";

// Fallback CORS proxy (only used if Cloud function fails)
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export const fetchEvents = async (region: string): Promise<ApiResponse> => {
  const regionUpper = region.toUpperCase();

  const fetchJsonWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeoutMs = 5000,
  ): Promise<ApiResponse> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return (await res.json()) as ApiResponse;
    } finally {
      clearTimeout(id);
    }
  };

  const directUrl = `${BASE_URL}?region=${regionUpper}&key=${API_KEY}`;

  // Start the fastest options in parallel (prevents waiting 5s for a CORS fail)
  const directPromise = fetchJsonWithTimeout(directUrl, {}, 2500);

  const cloudPromise = (async () => {
    const { data, error } = await supabase.functions.invoke<ApiResponse>(
      "events-proxy",
      { body: { region: regionUpper } },
    );

    if (error) throw error;
    if (!data) throw new Error("No data returned");
    return data;
  })();

  const firstSuccess = <T,>(promises: Promise<T>[]) =>
    new Promise<T>((resolve, reject) => {
      let rejected = 0;
      const errors: unknown[] = [];

      promises.forEach((p) => {
        p.then(resolve).catch((err) => {
          errors.push(err);
          rejected += 1;
          if (rejected === promises.length) {
            reject(errors[0] ?? new Error("All requests failed"));
          }
        });
      });
    });

  try {
    // First successful response wins (faster than waiting for a timeout then trying the next fallback)
    return await firstSuccess([directPromise, cloudPromise]);
  } catch {
    // Both failed → last resort proxy
  }

  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(directUrl)}`;
  return await fetchJsonWithTimeout(proxyUrl, {}, 8000);
};

export const getEventStatus = (startDate: string, endDate: string): "upcoming" | "active" | "ended" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "ended";
};

// Sort events: Upcoming first, then by start date (newest first)
export const sortEvents = (events: ApiEvent[]): ApiEvent[] => {
  return [...events].sort((a, b) => {
    const statusA = getEventStatus(a.Start, a.End);
    const statusB = getEventStatus(b.Start, b.End);
    
    // Priority: upcoming > active > ended
    const statusOrder = { upcoming: 0, active: 1, ended: 2 };
    
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    
    // Within same status, sort by start date (newest first)
    const dateA = new Date(a.Start).getTime();
    const dateB = new Date(b.Start).getTime();
    return dateB - dateA;
  });
};
