import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EventCategory =
  | "Yoga" | "HIIT" | "Outdoor" | "Bootcamp"
  | "Nutrition" | "Swimming" | "CrossFit" | "Cycling"
  | "Running" | "General";

export type EventType   = "Free" | "Paid";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface GymEvent {
  id: string;
  title: string;
  category: EventCategory;
  type: EventType;
  price?: number;          // NGN amount — only when type === "Paid"
  date: string;            // ISO date "2025-06-14"
  startTime: string;       // "07:00"
  endTime: string;         // "08:30"
  location: string;
  capacity: number;
  spotsLeft: number;
  description: string;
  status: EventStatus;
  createdAt: string;
}

interface EventsState {
  events: GymEvent[];
  addEvent:    (data: Omit<GymEvent, "id" | "createdAt" | "spotsLeft">) => void;
  updateEvent: (id: string, data: Partial<GymEvent>) => void;
  deleteEvent: (id: string) => void;
  cancelEvent: (id: string) => void;
}

const SEED: GymEvent[] = [
  {
    id: "ev1", title: "Beach Yoga Session", category: "Yoga", type: "Free",
    date: "2025-06-14", startTime: "07:00", endTime: "08:30",
    location: "Tarkwa Bay Beach, Lagos", capacity: 30, spotsLeft: 12,
    description: "A refreshing beachside yoga session for all fitness levels. Mats provided. Wear comfortable clothing and bring sunscreen.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev2", title: "5K Morning Run", category: "Running", type: "Free",
    date: "2025-06-15", startTime: "06:00", endTime: "07:30",
    location: "Lekki Conservation Centre", capacity: 50, spotsLeft: 30,
    description: "Community 5K run through the scenic Lekki Conservation Centre trails. Open to all pace groups.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev3", title: "CrossFit Open Challenge", category: "CrossFit", type: "Paid", price: 5000,
    date: "2025-06-21", startTime: "08:00", endTime: "10:00",
    location: "Victoria Island, Lagos", capacity: 20, spotsLeft: 8,
    description: "Competitive CrossFit challenge with scaled and Rx divisions. Prizes for top finishers. Register early — spots are limited.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev4", title: "Nutrition Masterclass", category: "Nutrition", type: "Free",
    date: "2025-06-23", startTime: "17:00", endTime: "18:30",
    location: "Online (Zoom)", capacity: 100, spotsLeft: 50,
    description: "Expert-led session on sports nutrition, meal timing, and supplementation for active individuals.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev5", title: "Pool Aerobics Session", category: "Swimming", type: "Paid", price: 2500,
    date: "2025-06-28", startTime: "09:00", endTime: "10:30",
    location: "Eko Hotel, Lagos", capacity: 25, spotsLeft: 15,
    description: "Low-impact water aerobics class suitable for all fitness levels. Towels and locker access included.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev6", title: "Weekend Bootcamp", category: "Bootcamp", type: "Free",
    date: "2025-06-29", startTime: "06:30", endTime: "08:00",
    location: "National Stadium, Lagos", capacity: 40, spotsLeft: 20,
    description: "High-energy group bootcamp covering strength, cardio, and agility drills. All levels welcome.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev7", title: "Power Cycling Class", category: "Cycling", type: "Paid", price: 3000,
    date: "2025-07-01", startTime: "18:00", endTime: "19:00",
    location: "Eugym Ikeja", capacity: 20, spotsLeft: 5,
    description: "Indoor cycling class with interval-based training led by a certified instructor. Bikes adjusted to your height.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev8", title: "Morning HIIT Blast", category: "HIIT", type: "Free",
    date: "2025-07-04", startTime: "06:00", endTime: "06:45",
    location: "Eugym Victoria Island", capacity: 30, spotsLeft: 18,
    description: "Fast-paced 45-minute HIIT session to kickstart your day. Modifications available for all fitness levels.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev9", title: "Couples Yoga & Wellness", category: "Yoga", type: "Paid", price: 8000,
    date: "2025-07-05", startTime: "10:00", endTime: "12:00",
    location: "The Wheatbaker, Ikoyi", capacity: 16, spotsLeft: 10,
    description: "A mindful partner yoga session designed for couples. Includes guided meditation and a wellness goodie bag.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
  {
    id: "ev10", title: "Community Outdoor Bootcamp", category: "Bootcamp", type: "Free",
    date: "2025-07-06", startTime: "07:00", endTime: "08:30",
    location: "Bar Beach, Victoria Island", capacity: 60, spotsLeft: 40,
    description: "Eugym's flagship outdoor bootcamp. Join hundreds of fitness enthusiasts for a high-energy group workout by the beach.",
    status: "upcoming", createdAt: new Date().toISOString(),
  },
];

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: SEED,

      addEvent: (data) =>
        set((s) => ({
          events: [
            ...s.events,
            {
              ...data,
              id: `ev_${Date.now()}`,
              spotsLeft: data.capacity,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateEvent: (id, data) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      cancelEvent: (id) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === id ? { ...e, status: "cancelled" } : e
          ),
        })),
    }),
    { name: "eugym-events" }
  )
);
