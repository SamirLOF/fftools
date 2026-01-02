export interface Event {
  id: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active";
  type: "event" | "announcement";
}

export const events: Event[] = [
  {
    id: "1",
    title: "LoginAndWinHRK_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_LoginAndWinHRK_5RcaKuya_en.jpg",
    startDate: "Jan 2, 2026 • 8:00 PM",
    endDate: "Jan 3, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "2",
    title: "New Evo Exchange Store_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_NewEvoExchangeStore_5RcaKuya_en.jpg",
    startDate: "Jan 2, 2026 • 8:00 PM",
    endDate: "Jan 3, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "3",
    title: "LoginAndWinHRK_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_LoginAndWinHRK_5RcaKuya_en.jpg",
    startDate: "Jan 3, 2026 • 8:00 PM",
    endDate: "Jan 4, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "4",
    title: "PufferRideFreeze_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_PufferRideFreeze_5RcaKuya_en.jpg",
    startDate: "Jan 3, 2026 • 8:00 PM",
    endDate: "Jan 4, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "5",
    title: "New Evo Exchange Store_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_NewEvoExchangeStore_5RcaKuya_en.jpg",
    startDate: "Jan 4, 2026 • 8:00 PM",
    endDate: "Jan 5, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "6",
    title: "BooyahFever_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_BooyahFever_5RcaKuya_en.jpg",
    startDate: "Jan 4, 2026 • 8:00 PM",
    endDate: "Jan 5, 2026 • 7:59 PM",
    status: "upcoming",
    type: "event",
  },
  {
    id: "7",
    title: "M60EvoVault_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_NewEvoExchangeStore_5RcaKuya_en.jpg",
    startDate: "Jan 1, 2026 • 8:00 PM",
    endDate: "Jan 2, 2026 • 7:59 PM",
    status: "active",
    type: "event",
  },
  {
    id: "8",
    title: "BooyahFever_5RcaKuya",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_BooyahFever_5RcaKuya_en.jpg",
    startDate: "Jan 1, 2026 • 8:00 PM",
    endDate: "Jan 2, 2026 • 7:59 PM",
    status: "active",
    type: "event",
  },
];

export const announcements: Event[] = [
  {
    id: "a1",
    title: "Follow Us On Instagram",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_BooyahFever_5RcaKuya_en.jpg",
    startDate: "Dec 28, 2025 • 8:00 PM",
    endDate: "Jan 15, 2026 • 7:59 PM",
    status: "active",
    type: "announcement",
  },
  {
    id: "a2",
    title: "Like & Follow Our Page",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_LoginAndWinHRK_5RcaKuya_en.jpg",
    startDate: "Dec 28, 2025 • 8:00 PM",
    endDate: "Jan 15, 2026 • 7:59 PM",
    status: "active",
    type: "announcement",
  },
  {
    id: "a3",
    title: "Subscribe & Stay Tuned",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_PufferRideFreeze_5RcaKuya_en.jpg",
    startDate: "Dec 28, 2025 • 8:00 PM",
    endDate: "Jan 15, 2026 • 7:59 PM",
    status: "active",
    type: "announcement",
  },
  {
    id: "a4",
    title: "Follow Us On TikTok",
    image: "https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_NewEvoExchangeStore_5RcaKuya_en.jpg",
    startDate: "Dec 28, 2025 • 8:00 PM",
    endDate: "Jan 15, 2026 • 7:59 PM",
    status: "active",
    type: "announcement",
  },
];
