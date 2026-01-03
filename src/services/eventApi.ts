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

  // Helper for timeout
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // 1) Try direct API first (fastest if CORS works)
  try {
    const directUrl = `${BASE_URL}?region=${regionUpper}&key=${API_KEY}`;
    const response = await fetchWithTimeout(directUrl, {}, 5000);
    if (response.ok) {
      const data: ApiResponse = await response.json();
      return data;
    }
  } catch {
    // Direct failed, try Cloud function
  }

  // 2) Try Lovable Cloud function
  try {
    const { data, error } = await supabase.functions.invoke<ApiResponse>(
      "events-proxy",
      {
        body: { region: regionUpper },
      }
    );

    if (error) throw error;
    if (!data) throw new Error("No data returned");

    return data;
  } catch {
    // Cloud function failed, try fallback proxy
  }

  // 3) Fallback: public proxy
  const apiUrl = `${BASE_URL}?region=${regionUpper}&key=${API_KEY}`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;

  const response = await fetchWithTimeout(proxyUrl, {}, 8000);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();
  return data;
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
