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

export const fetchEvents = async (region: string): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}?region=${region}&key=${API_KEY}`);
  
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
