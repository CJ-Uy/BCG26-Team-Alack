"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Booking {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "pending" | "confirmed";
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "booking" | "event" | "promo" | "reminder" | "community";
}

type TabId = "home" | "mycar" | "chat" | "profile";

interface AppContextValue {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id">) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  navigateTo: (tab: TabId) => void;
  onNavigate: ((tab: TabId) => void) | null;
  setOnNavigate: (fn: (tab: TabId) => void) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    title: "Weekend Car Meet This Saturday!",
    body: "Join us at SM Valenzuela Parking Lot B, March 22. Bring your ride and meet fellow Toyota owners!",
    time: "2h ago",
    read: false,
    type: "event",
  },
  {
    id: "n2",
    title: "Service Center Extended Hours",
    body: "Our service center will be open 7AM-7PM this weekend. Walk-ins welcome!",
    time: "5h ago",
    read: false,
    type: "reminder",
  },
  {
    id: "n3",
    title: "🎉 20% Off Genuine Accessories",
    body: "Flash sale on Toyota Genuine Accessories this week only. Visit our parts counter!",
    time: "1d ago",
    read: false,
    type: "promo",
  },
  {
    id: "n4",
    title: "PMS Reminder",
    body: "Your next Periodic Maintenance Service (25,000km) is coming up on Apr 15. Book now to reserve your slot!",
    time: "2d ago",
    read: true,
    type: "reminder",
  },
  {
    id: "n5",
    title: "New GR Corolla Test Drives Available",
    body: "Limited slots for GR Corolla test drive experience. Book through the app or visit the showroom.",
    time: "3d ago",
    read: true,
    type: "community",
  },
];

const defaultBookings: Booking[] = [
  {
    id: "b1",
    title: "Periodic Maintenance Service (25,000km)",
    date: "Apr 15, 2026",
    time: "9:00 AM",
    status: "confirmed",
    notes: "Full service package — transmission fluid, spark plugs",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(defaultBookings);
  const [notifications, setNotifications] =
    useState<Notification[]>(defaultNotifications);
  const [onNavigate, setOnNavigateState] = useState<
    ((tab: TabId) => void) | null
  >(null);

  const addBooking = useCallback((booking: Omit<Booking, "id">) => {
    const id = `b-${Date.now()}`;
    setBookings((prev) => [{ ...booking, id }, ...prev]);
    // Also add a notification
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: "Booking Confirmed! ✓",
        body: `${booking.title} on ${booking.date} at ${booking.time}. See you there!`,
        time: "Just now",
        read: false,
        type: "booking" as const,
      },
      ...prev,
    ]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigateTo = useCallback(
    (tab: TabId) => {
      onNavigate?.(tab);
    },
    [onNavigate],
  );

  const setOnNavigate = useCallback((fn: (tab: TabId) => void) => {
    setOnNavigateState(() => fn);
  }, []);

  return (
    <AppContext.Provider
      value={{
        bookings,
        addBooking,
        notifications,
        markNotificationRead,
        unreadCount,
        navigateTo,
        onNavigate,
        setOnNavigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
