"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Coffee,
  CalendarDays,
  Wrench,
  AlertTriangle,
  MapPin,
  Trophy,
  Newspaper,
  Gift,
  X,
  User,
  Star,
  ChevronRight,
  ArrowLeft,
  Phone,
  Clock,
  Navigation,
  ShieldCheck,
  Minus,
  Plus,
  Check,
  Tag,
  Award,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";

interface MenuModalProps {
  open: boolean;
  onClose: () => void;
}

type ThemeColor = "red" | "amber" | "blue";
type DetailView =
  | null
  | "cafe"
  | "emergency"
  | "dealer"
  | "promos"
  | "events"
  | "rewards"
  | "news";

const itemStyles: Record<ThemeColor, { bg: string; text: string }> = {
  red: { bg: "bg-toyota-red/12", text: "text-toyota-red" },
  amber: { bg: "bg-toyota-amber/12", text: "text-toyota-amber" },
  blue: { bg: "bg-toyota-blue/12", text: "text-toyota-blue" },
};

const serviceItems = [
  {
    icon: Wrench,
    label: "Book a Service",
    sub: "Schedule PMS or repairs",
    color: "red" as ThemeColor,
    id: "service",
  },
  {
    icon: Coffee,
    label: "Toyota Cafe",
    sub: "Order ahead, earn points",
    color: "amber" as ThemeColor,
    id: "cafe",
  },
  {
    icon: AlertTriangle,
    label: "Emergency Assist",
    sub: "Roadside help & towing",
    color: "red" as ThemeColor,
    id: "emergency",
  },
  {
    icon: MapPin,
    label: "Dealer Locator",
    sub: "Find nearby branches",
    color: "blue" as ThemeColor,
    id: "dealer",
  },
];

const exploreItems = [
  {
    icon: Gift,
    label: "Promos",
    sub: "Exclusive deals",
    color: "amber" as ThemeColor,
    id: "promos",
  },
  {
    icon: CalendarDays,
    label: "Events",
    sub: "Meets & shows",
    color: "blue" as ThemeColor,
    id: "events",
  },
  {
    icon: Trophy,
    label: "Rewards",
    sub: "12,450 pts",
    color: "amber" as ThemeColor,
    id: "rewards",
  },
  {
    icon: Newspaper,
    label: "News",
    sub: "Latest updates",
    color: "blue" as ThemeColor,
    id: "news",
  },
];

/* ─── Fake barcode SVG ─── */
function Barcode({ value }: { value: string }) {
  const bars: number[] = [];
  let seed = 0;
  for (const ch of value) seed = (seed * 31 + ch.charCodeAt(0)) & 0xffff;
  for (let i = 0; i < 60; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    bars.push(seed % 3 === 0 ? 3 : seed % 3 === 1 ? 2 : 1);
  }
  let x = 0;
  return (
    <svg
      viewBox={`0 0 ${bars.reduce((s, b) => s + b + 1, 0)} 50`}
      className="h-16 w-full"
      preserveAspectRatio="none"
    >
      {bars.map((w, i) => {
        const barX = x;
        x += w + 1;
        return (
          <rect
            key={i}
            x={barX}
            y={0}
            width={w}
            height={50}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}

/* ─── Detail Panel Header ─── */
function DetailHeader({
  title,
  subtitle,
  onBack,
  color = "text-foreground",
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <button
        onClick={onBack}
        className="bg-secondary hover:bg-secondary/80 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div>
        <h2 className={`text-base font-bold ${color}`}>{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-[11px]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Toyota Cafe ─── */
function CafeView({ onBack }: { onBack: () => void }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const menuItems = [
    { id: "c1", name: "Brewed Coffee", price: 120, category: "Drinks" },
    { id: "c2", name: "Iced Latte", price: 160, category: "Drinks" },
    { id: "c3", name: "Matcha Latte", price: 180, category: "Drinks" },
    { id: "c4", name: "Butter Croissant", price: 95, category: "Pastries" },
    { id: "c5", name: "Chicken Sandwich", price: 195, category: "Meals" },
    { id: "c6", name: "Toyota Red Velvet", price: 175, category: "Pastries" },
  ];
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="flex h-full flex-col">
      <DetailHeader
        title="Toyota Cafe"
        subtitle="Order ahead, earn points"
        onBack={onBack}
      />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="bg-toyota-amber/10 mb-3 flex items-center gap-2 rounded-xl px-3 py-2">
          <Coffee className="text-toyota-amber h-4 w-4" />
          <p className="text-toyota-amber text-xs font-medium">
            Earn 1 point per P10 spent
          </p>
        </div>
        {["Drinks", "Pastries", "Meals"].map((cat) => (
          <div key={cat} className="mb-4">
            <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
              {cat}
            </p>
            <div className="space-y-2">
              {menuItems
                .filter((m) => m.category === cat)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-card flex items-center justify-between rounded-xl border px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">
                        P{item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(cart[item.id] || 0) > 0 && (
                        <>
                          <button
                            onClick={() =>
                              setCart((c) => ({
                                ...c,
                                [item.id]: Math.max(0, (c[item.id] || 0) - 1),
                              }))
                            }
                            className="bg-secondary flex h-7 w-7 items-center justify-center rounded-full"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">
                            {cart[item.id]}
                          </span>
                        </>
                      )}
                      <button
                        onClick={() =>
                          setCart((c) => ({
                            ...c,
                            [item.id]: (c[item.id] || 0) + 1,
                          }))
                        }
                        className="bg-toyota-amber flex h-7 w-7 items-center justify-center rounded-full text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="bg-card border-t p-4">
          <button className="bg-toyota-amber flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white">
            <Coffee className="h-4 w-4" />
            Place Order &middot; P{total}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Emergency Assist ─── */
function EmergencyView({ onBack }: { onBack: () => void }) {
  const [called, setCalled] = useState<string | null>(null);
  const options = [
    {
      id: "tow",
      icon: Navigation,
      title: "Request Towing",
      desc: "Flatbed tow to nearest dealer",
      phone: "(02) 8888-1234",
    },
    {
      id: "battery",
      icon: Zap,
      title: "Battery Jump Start",
      desc: "On-the-spot battery assistance",
      phone: "(02) 8888-1235",
    },
    {
      id: "tire",
      icon: ShieldCheck,
      title: "Flat Tire Help",
      desc: "Tire change & spare assistance",
      phone: "(02) 8888-1236",
    },
    {
      id: "hotline",
      icon: Phone,
      title: "Emergency Hotline",
      desc: "24/7 Toyota roadside support",
      phone: "1-800-8-TOYOTA",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DetailHeader
        title="Emergency Assist"
        subtitle="24/7 roadside help"
        onBack={onBack}
      />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="bg-toyota-red/10 mb-4 rounded-xl p-3">
          <p className="text-toyota-red text-xs font-medium">
            Available 24/7 for Toyota Valenzuela members. Response time: ~30
            minutes within Metro Manila.
          </p>
        </div>
        <div className="space-y-2.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setCalled(opt.id)}
              className="bg-card hover:bg-secondary/50 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
            >
              <div className="bg-toyota-red/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <opt.icon className="text-toyota-red h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{opt.title}</p>
                <p className="text-muted-foreground text-[11px]">{opt.desc}</p>
                <p className="text-toyota-red mt-0.5 text-[11px] font-medium">
                  {opt.phone}
                </p>
              </div>
              {called === opt.id ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="bg-toyota-red flex h-8 w-8 items-center justify-center rounded-full">
                  <Phone className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        {called && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-green-500/10 p-3 text-center"
          >
            <Check className="mx-auto mb-1 h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">Request Sent</p>
            <p className="text-xs text-green-600">
              A Toyota representative will contact you shortly.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Dealer Locator ─── */
function DealerView({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const dealers = [
    {
      id: "d1",
      name: "Toyota Valenzuela",
      address: "MacArthur Highway, Karuhatan, Valenzuela City",
      distance: "1.2 km",
      hours: "8AM - 6PM",
      phone: "(02) 8123-4567",
    },
    {
      id: "d2",
      name: "Toyota Marilao",
      address: "MacArthur Highway, Marilao, Bulacan",
      distance: "5.8 km",
      hours: "8AM - 5PM",
      phone: "(044) 815-2345",
    },
    {
      id: "d3",
      name: "Toyota Balintawak",
      address: "EDSA cor. Balintawak, Quezon City",
      distance: "7.3 km",
      hours: "9AM - 7PM",
      phone: "(02) 8234-5678",
    },
    {
      id: "d4",
      name: "Toyota North EDSA",
      address: "North EDSA, Quezon City",
      distance: "9.1 km",
      hours: "9AM - 8PM",
      phone: "(02) 8345-6789",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DetailHeader
        title="Dealer Locator"
        subtitle="Find nearby branches"
        onBack={onBack}
      />
      <div className="no-scrollbar flex-1 overflow-y-auto">
        {/* Mock map area */}
        <div className="bg-toyota-blue/5 relative mx-4 mt-4 h-36 overflow-hidden rounded-xl border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="text-toyota-blue/40 mx-auto h-8 w-8" />
              <p className="text-muted-foreground mt-1 text-xs">Map View</p>
              <p className="text-muted-foreground text-[10px]">
                Showing {dealers.length} dealers nearby
              </p>
            </div>
          </div>
          {/* Decorative dots for map feel */}
          <div className="bg-toyota-red absolute top-[30%] left-[20%] h-3 w-3 rounded-full shadow-lg" />
          <div className="bg-toyota-blue absolute top-[45%] left-[55%] h-2.5 w-2.5 rounded-full shadow-lg" />
          <div className="bg-toyota-blue absolute top-[25%] left-[70%] h-2.5 w-2.5 rounded-full shadow-lg" />
          <div className="bg-toyota-blue absolute top-[65%] left-[40%] h-2.5 w-2.5 rounded-full shadow-lg" />
        </div>

        <div className="space-y-2 p-4">
          {dealers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d.id === selected ? null : d.id)}
              className={`bg-card w-full rounded-xl border px-3.5 py-3 text-left transition-all ${selected === d.id ? "ring-toyota-blue ring-2" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {d.address}
                  </p>
                </div>
                <span className="bg-toyota-blue/10 text-toyota-blue ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                  {d.distance}
                </span>
              </div>
              {selected === d.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 flex items-center gap-3 border-t pt-2"
                >
                  <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    {d.hours}
                  </div>
                  <div className="text-toyota-blue flex items-center gap-1 text-[11px] font-medium">
                    <Phone className="h-3 w-3" />
                    {d.phone}
                  </div>
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Promos ─── */
function PromosView({ onBack }: { onBack: () => void }) {
  const promos = [
    {
      id: "p1",
      title: "20% Off Genuine Accessories",
      desc: "Flash sale on Toyota Genuine Accessories. Valid this week only!",
      expires: "Mar 23, 2026",
      tag: "FLASH SALE",
      color: "text-toyota-red",
      bg: "bg-toyota-red/10",
    },
    {
      id: "p2",
      title: "Free PMS Check-Up",
      desc: "Complimentary 21-point inspection for Gold members. Book now!",
      expires: "Apr 30, 2026",
      tag: "MEMBERS ONLY",
      color: "text-toyota-amber",
      bg: "bg-toyota-amber/10",
    },
    {
      id: "p3",
      title: "Cafe Buy 1 Take 1",
      desc: "Buy any drink, get a second one free every Wednesday.",
      expires: "Ongoing",
      tag: "CAFE",
      color: "text-toyota-blue",
      bg: "bg-toyota-blue/10",
    },
    {
      id: "p4",
      title: "Trade-in Bonus P50,000",
      desc: "Extra P50K trade-in value when you upgrade to a new 2026 model.",
      expires: "May 31, 2026",
      tag: "TRADE-IN",
      color: "text-toyota-red",
      bg: "bg-toyota-red/10",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DetailHeader
        title="Promos"
        subtitle="Exclusive deals for you"
        onBack={onBack}
      />
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {promos.map((p) => (
          <div key={p.id} className="bg-card overflow-hidden rounded-xl border">
            <div className={`${p.bg} flex items-center gap-2 px-4 py-2`}>
              <Tag className={`h-3 w-3 ${p.color}`} />
              <span
                className={`text-[10px] font-bold tracking-wider uppercase ${p.color}`}
              >
                {p.tag}
              </span>
            </div>
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold">{p.title}</h3>
              <p className="text-muted-foreground mt-1 text-xs">{p.desc}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground text-[10px]">
                  Expires: {p.expires}
                </span>
                <button
                  className={`rounded-full ${p.bg} px-3 py-1 text-[11px] font-semibold ${p.color}`}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Events ─── */
function EventsView({ onBack }: { onBack: () => void }) {
  const [rsvp, setRsvp] = useState<Set<string>>(new Set());
  const events = [
    {
      id: "e1",
      title: "Weekend Car Meet",
      date: "Mar 22, 2026",
      time: "3:00 PM - 7:00 PM",
      location: "SM Valenzuela Parking Lot B",
      attendees: 48,
    },
    {
      id: "e2",
      title: "GR Corolla Track Day",
      date: "Apr 5, 2026",
      time: "8:00 AM - 5:00 PM",
      location: "Clark International Speedway",
      attendees: 24,
    },
    {
      id: "e3",
      title: "Toyota Garage Night",
      date: "Apr 12, 2026",
      time: "6:00 PM - 10:00 PM",
      location: "Toyota Valenzuela Showroom",
      attendees: 120,
    },
    {
      id: "e4",
      title: "Family Road Trip Caravan",
      date: "May 3, 2026",
      time: "5:00 AM departure",
      location: "Assembly: Toyota Valenzuela",
      attendees: 35,
    },
  ];

  const toggleRsvp = (id: string) => {
    setRsvp((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col">
      <DetailHeader title="Events" subtitle="Meets & shows" onBack={onBack} />
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="bg-card overflow-hidden rounded-xl border p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold">{e.title}</h3>
                <div className="mt-1.5 space-y-0.5">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <CalendarDays className="h-3 w-3" /> {e.date} &middot;{" "}
                    {e.time}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <User className="h-3 w-3" />{" "}
                    {e.attendees + (rsvp.has(e.id) ? 1 : 0)} going
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleRsvp(e.id)}
              className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                rsvp.has(e.id)
                  ? "bg-green-500/10 text-green-600"
                  : "bg-toyota-blue/10 text-toyota-blue"
              }`}
            >
              {rsvp.has(e.id) ? "Going!" : "RSVP"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Rewards ─── */
function RewardsView({ onBack }: { onBack: () => void }) {
  const redeemables = [
    { id: "r1", name: "Free Car Wash", points: 500, icon: Star },
    {
      id: "r2",
      name: "Oil Change Discount (P300 off)",
      points: 1500,
      icon: Tag,
    },
    { id: "r3", name: "Toyota Cafe P200 Voucher", points: 2000, icon: Coffee },
    { id: "r4", name: "Free PMS Labor", points: 5000, icon: Wrench },
    {
      id: "r5",
      name: "Genuine Accessory Voucher P1,000",
      points: 8000,
      icon: Gift,
    },
    { id: "r6", name: "Weekend Rental Upgrade", points: 12000, icon: Award },
  ];
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  return (
    <div className="flex h-full flex-col">
      <DetailHeader
        title="Rewards"
        subtitle="Redeem your points"
        onBack={onBack}
      />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {/* Points summary */}
        <div className="from-toyota-amber to-toyota-amber/70 mb-4 rounded-2xl bg-linear-to-br p-4 text-white">
          <p className="text-xs font-medium text-white/70">Available Points</p>
          <p className="text-3xl font-bold">12,450</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/20">
            <div className="h-1.5 w-3/4 rounded-full bg-white" />
          </div>
          <p className="mt-1 text-[10px] text-white/70">
            550 more points to Platinum tier
          </p>
        </div>

        <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
          Redeem
        </p>
        <div className="space-y-2">
          {redeemables.map((r) => (
            <div
              key={r.id}
              className="bg-card flex items-center gap-3 rounded-xl border px-3 py-2.5"
            >
              <div className="bg-toyota-amber/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <r.icon className="text-toyota-amber h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium">{r.name}</p>
                <p className="text-muted-foreground text-[11px]">
                  {r.points.toLocaleString()} pts
                </p>
              </div>
              <button
                onClick={() =>
                  setRedeemed((s) => {
                    const next = new Set(s);
                    next.add(r.id);
                    return next;
                  })
                }
                disabled={redeemed.has(r.id) || r.points > 12450}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                  redeemed.has(r.id)
                    ? "bg-green-500/10 text-green-600"
                    : r.points > 12450
                      ? "bg-secondary text-muted-foreground"
                      : "bg-toyota-amber/10 text-toyota-amber"
                }`}
              >
                {redeemed.has(r.id) ? "Redeemed" : "Redeem"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── News ─── */
function NewsView({ onBack }: { onBack: () => void }) {
  const articles = [
    {
      id: "n1",
      title: "All-New 2027 Camry Revealed",
      summary:
        "Toyota unveils the next-generation Camry with hybrid powertrain as standard across all variants.",
      date: "Mar 15, 2026",
      tag: "NEW MODEL",
    },
    {
      id: "n2",
      title: "Toyota Valenzuela Wins Dealer Excellence Award",
      summary:
        "Our dealership has been recognized as the top-performing Toyota dealer in North Luzon for 2025.",
      date: "Mar 10, 2026",
      tag: "DEALERSHIP",
    },
    {
      id: "n3",
      title: "GR Supra Manual Transmission Now Available",
      summary:
        "The highly requested 6-speed manual GR Supra is now in Philippine showrooms. Limited units!",
      date: "Mar 5, 2026",
      tag: "GR SPORT",
    },
    {
      id: "n4",
      title: "Toyota Safety Sense Standard on All 2026 Models",
      summary:
        "Enhanced safety suite including pre-collision system and lane departure alert now comes standard.",
      date: "Feb 28, 2026",
      tag: "SAFETY",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DetailHeader title="News" subtitle="Latest updates" onBack={onBack} />
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
        {articles.map((a) => (
          <div key={a.id} className="bg-card rounded-xl border p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="bg-toyota-blue/10 text-toyota-blue rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                {a.tag}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {a.date}
              </span>
            </div>
            <h3 className="text-sm leading-snug font-bold">{a.title}</h3>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {a.summary}
            </p>
            <button className="text-toyota-blue mt-2 text-[11px] font-semibold">
              Read more &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Membership Card Pop-up ─── */
function MembershipCardModal({ onClose }: { onClose: () => void }) {
  const memberNumber = "TVLZ-2024-08156";
  const memberName = "Juan Dela Cruz";
  const memberSince = "March 2024";
  const tier = "Gold";
  const points = "12,450";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.85, rotateX: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-6 w-full max-w-sm"
        style={{ perspective: "1000px" }}
      >
        <div className="from-toyota-red via-toyota-red/90 to-toyota-red/70 shadow-toyota-red/30 relative overflow-hidden rounded-3xl bg-linear-to-br p-px shadow-2xl">
          <motion.div
            className="absolute -inset-20 opacity-20"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.2), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="from-toyota-red via-toyota-red/90 to-toyota-red/70 relative rounded-3xl bg-linear-to-br px-6 pt-6 pb-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-white/70 uppercase">
                  Toyota Valenzuela
                </p>
                <h3 className="text-lg font-bold text-white">
                  Membership Card
                </h3>
              </div>
            </div>

            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70">Member Name</p>
                  <p className="text-sm font-bold text-white">{memberName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[9px] tracking-wider text-white/70 uppercase">
                    Tier
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="text-toyota-amber h-3 w-3" />
                    <p className="text-xs font-bold text-white">{tier}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[9px] tracking-wider text-white/70 uppercase">
                    Points
                  </p>
                  <p className="text-xs font-bold text-white">{points}</p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-[9px] tracking-wider text-white/70 uppercase">
                    Since
                  </p>
                  <p className="text-[10px] leading-tight font-bold text-white">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-white/20" />
              <p className="text-[9px] tracking-widest text-white/60 uppercase">
                Scan at Toyota Cafe
              </p>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div className="rounded-2xl bg-white p-4">
              <div className="text-black">
                <Barcode value={memberNumber} />
              </div>
              <p className="mt-2 text-center font-mono text-xs font-semibold tracking-[0.3em] text-gray-700">
                {memberNumber}
              </p>
            </div>

            <motion.p
              className="mt-3 text-center text-[10px] text-white/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Present this card at the counter for scanning
            </motion.p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/50">
          Tap outside to close
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Menu Modal ─── */
export function MenuModal({ open, onClose }: MenuModalProps) {
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [navDirection, setNavDirection] = useState(1);
  const { navigateTo } = useApp();

  const handleItemClick = (id: string) => {
    if (id === "service") {
      onClose();
      setDetailView(null);
      navigateTo("chat");
    } else if (
      id === "cafe" ||
      id === "emergency" ||
      id === "dealer" ||
      id === "promos" ||
      id === "events" ||
      id === "rewards" ||
      id === "news"
    ) {
      setNavDirection(1);
      setDetailView(id as DetailView);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setDetailView(null);
    onClose();
  };

  const handleDetailBack = () => {
    setNavDirection(-1);
    setDetailView(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={handleClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="bg-card absolute inset-x-4 bottom-28 z-50 overflow-hidden rounded-3xl shadow-2xl"
            style={{ maxHeight: "calc(100% - 10rem)" }}
          >
            <AnimatePresence mode="wait" custom={navDirection}>
              {detailView ? (
                <motion.div
                  key={detailView}
                  custom={navDirection}
                  initial={{ x: navDirection * 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: navDirection * -80, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex h-full max-h-125 flex-col"
                >
                  {detailView === "cafe" && (
                    <CafeView onBack={handleDetailBack} />
                  )}
                  {detailView === "emergency" && (
                    <EmergencyView onBack={handleDetailBack} />
                  )}
                  {detailView === "dealer" && (
                    <DealerView onBack={handleDetailBack} />
                  )}
                  {detailView === "promos" && (
                    <PromosView onBack={handleDetailBack} />
                  )}
                  {detailView === "events" && (
                    <EventsView onBack={handleDetailBack} />
                  )}
                  {detailView === "rewards" && (
                    <RewardsView onBack={handleDetailBack} />
                  )}
                  {detailView === "news" && (
                    <NewsView onBack={handleDetailBack} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="main"
                  custom={navDirection}
                  initial={{ x: navDirection * 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: navDirection * -80, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {/* Color bar */}
                  <div className="flex h-1 w-full">
                    <div className="bg-toyota-red flex-1" />
                    <div className="bg-toyota-amber flex-1" />
                    <div className="bg-toyota-blue flex-1" />
                  </div>

                  <div className="px-5 pt-4">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">Quick Menu</h2>
                        <p className="text-muted-foreground text-xs">
                          Toyota Valenzuela Services
                        </p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9, rotate: 90 }}
                        onClick={handleClose}
                        className="bg-secondary hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Membership Banner */}
                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06, duration: 0.3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMembershipOpen(true)}
                      className="bg-toyota-red hover:shadow-toyota-red/20 mb-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white transition-shadow hover:shadow-lg"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">Membership Card</p>
                        <p className="text-[11px] text-white/70">
                          Gold Member &middot; Tap to view & scan
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-white/50" />
                    </motion.button>

                    {/* Services — list rows */}
                    <div className="mb-3">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase"
                      >
                        Services
                      </motion.p>
                      <div className="bg-background overflow-hidden rounded-xl border">
                        {serviceItems.map((item, i) => (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.12 + i * 0.04,
                              duration: 0.25,
                            }}
                            onClick={() => handleItemClick(item.id)}
                            className="hover:bg-secondary/50 active:bg-secondary flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors"
                            style={{
                              borderTop:
                                i > 0 ? "1px solid var(--border)" : undefined,
                            }}
                          >
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${itemStyles[item.color].bg}`}
                            >
                              <item.icon
                                className={`h-4 w-4 ${itemStyles[item.color].text}`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] leading-tight font-semibold">
                                {item.label}
                              </p>
                              <p className="text-muted-foreground text-[11px] leading-tight">
                                {item.sub}
                              </p>
                            </div>
                            <ChevronRight className="text-muted-foreground/40 h-3.5 w-3.5 shrink-0" />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Explore — 2×2 grid */}
                    <div className="mb-3">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.22 }}
                        className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase"
                      >
                        Explore
                      </motion.p>
                      <div className="grid grid-cols-2 gap-2">
                        {exploreItems.map((item, i) => (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.24 + i * 0.05,
                              duration: 0.28,
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleItemClick(item.id)}
                            className={`hover:bg-secondary/40 active:bg-secondary flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors ${itemStyles[item.color].bg}`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${itemStyles[item.color].bg}`}
                            >
                              <item.icon
                                className={`h-4 w-4 ${itemStyles[item.color].text}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] leading-tight font-semibold">
                                {item.label}
                              </p>
                              <p className="text-muted-foreground text-[10px] leading-tight">
                                {item.sub}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom padding */}
                  <div className="h-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {membershipOpen && (
              <MembershipCardModal onClose={() => setMembershipOpen(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
