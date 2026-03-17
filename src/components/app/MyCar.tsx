"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Car,
  Gauge,
  Calendar,
  Wrench,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CircleCheck,
  Droplets,
  Fuel,
  Plus,
  TrendingUp,
  MapPin,
  X,
  CalendarDays,
  Trash2,
  Sparkles,
  Eye,
  Star,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/AppContext";

const CarModel3D = dynamic(
  () => import("./CarModel3D").then((m) => ({ default: m.CarModel3D })),
  { ssr: false },
);

// ─── Types ──────────────────────────────────────────────────────────

interface CarInfo {
  model: string;
  year: number;
  color: string;
  plate: string;
  vin: string;
  nextPMS: string;
}

interface FuelEntry {
  id: number;
  date: string;
  station: string;
  amountPaid: number;
  pricePerLiter: number;
  liters: number;
  odometer: number;
}

interface ServiceRecord {
  id: number;
  type: "PMS" | "Repair";
  title: string;
  date: string;
  status: "completed";
  cost: string;
  items: string[];
}

interface CarProfile {
  id: string;
  info: CarInfo;
  fuelEntries: FuelEntry[];
  serviceHistory: ServiceRecord[];
}

// ─── Showroom catalog (cars users might be interested in) ───────────

interface ShowroomCar {
  id: string;
  model: string;
  year: number;
  tagline: string;
  startingPrice: string;
  category: string;
  defaultColor: string;
  badge?: string;
  specs: { label: string; value: string }[];
}

const showroomCatalog: ShowroomCar[] = [
  {
    id: "show-1",
    model: "Toyota GR Corolla",
    year: 2026,
    tagline: "Born on the track, built for the road",
    startingPrice: "₱3,200,000",
    category: "Sports",
    defaultColor: "#cc0000",
    badge: "Hot",
    specs: [
      { label: "Engine", value: "1.6L Turbo I3" },
      { label: "Power", value: "300 hp" },
      { label: "0-100", value: "5.2s" },
      { label: "Drive", value: "AWD" },
    ],
  },
  {
    id: "show-2",
    model: "Toyota Camry 2.5 V HEV",
    year: 2026,
    tagline: "Refined hybrid luxury",
    startingPrice: "₱2,457,000",
    category: "Sedan",
    defaultColor: "#1a3a5c",
    specs: [
      { label: "Engine", value: "2.5L Hybrid" },
      { label: "Power", value: "218 hp" },
      { label: "Fuel", value: "23.3 km/L" },
      { label: "Drive", value: "FWD" },
    ],
  },
  {
    id: "show-3",
    model: "Toyota RAV4 2.5 HEV",
    year: 2026,
    tagline: "Adventure meets efficiency",
    startingPrice: "₱2,104,000",
    category: "SUV",
    defaultColor: "#6b8e6b",
    badge: "Eco",
    specs: [
      { label: "Engine", value: "2.5L Hybrid" },
      { label: "Power", value: "222 hp" },
      { label: "Fuel", value: "21.1 km/L" },
      { label: "Drive", value: "AWD" },
    ],
  },
  {
    id: "show-4",
    model: "Toyota Supra 3.0",
    year: 2026,
    tagline: "Above everything",
    startingPrice: "₱4,990,000",
    category: "Sports",
    defaultColor: "#c44200",
    badge: "Legend",
    specs: [
      { label: "Engine", value: "3.0L Turbo I6" },
      { label: "Power", value: "382 hp" },
      { label: "0-100", value: "3.9s" },
      { label: "Drive", value: "RWD" },
    ],
  },
  {
    id: "show-5",
    model: "Toyota Land Cruiser 300",
    year: 2026,
    tagline: "Conquer every terrain in luxury",
    startingPrice: "₱5,477,000",
    category: "SUV",
    defaultColor: "#e8e4df",
    specs: [
      { label: "Engine", value: "3.5L Twin-Turbo V6" },
      { label: "Power", value: "409 hp" },
      { label: "Torque", value: "650 Nm" },
      { label: "Drive", value: "4WD" },
    ],
  },
  {
    id: "show-6",
    model: "Toyota Hilux GR-S",
    year: 2026,
    tagline: "Tough gets tougher",
    startingPrice: "₱1,850,000",
    category: "Truck",
    defaultColor: "#1a1a1a",
    badge: "GR",
    specs: [
      { label: "Engine", value: "2.8L Diesel" },
      { label: "Power", value: "204 hp" },
      { label: "Torque", value: "500 Nm" },
      { label: "Drive", value: "4WD" },
    ],
  },
];

// ─── Sample owned car data ──────────────────────────────────────────

const defaultCars: CarProfile[] = [
  {
    id: "car-1",
    info: {
      model: "Toyota Vios 1.5 G CVT",
      year: 2024,
      color: "Alumina Jade Metallic",
      plate: "ABC 1234",
      vin: "JTDBW9F3•••••7890",
      nextPMS: "Apr 15, 2026",
    },
    fuelEntries: [
      {
        id: 1,
        date: "Mar 15, 2026",
        station: "Shell - MacArthur Highway",
        amountPaid: 2800,
        pricePerLiter: 65.5,
        liters: 42.75,
        odometer: 12450,
      },
      {
        id: 2,
        date: "Mar 2, 2026",
        station: "Petron - Paso de Blas",
        amountPaid: 2500,
        pricePerLiter: 64.8,
        liters: 38.58,
        odometer: 11920,
      },
      {
        id: 3,
        date: "Feb 17, 2026",
        station: "Caltex - Valenzuela City",
        amountPaid: 3000,
        pricePerLiter: 65.2,
        liters: 46.01,
        odometer: 11380,
      },
      {
        id: 4,
        date: "Feb 3, 2026",
        station: "Shell - MacArthur Highway",
        amountPaid: 2600,
        pricePerLiter: 64.0,
        liters: 40.63,
        odometer: 10800,
      },
    ],
    serviceHistory: [
      {
        id: 1,
        type: "PMS",
        title: "Periodic Maintenance Service (20,000km)",
        date: "Feb 28, 2026",
        status: "completed",
        cost: "₱8,500",
        items: [
          "Oil & filter change",
          "Brake inspection",
          "Tire rotation",
          "Multi-point inspection",
        ],
      },
      {
        id: 2,
        type: "Repair",
        title: "A/C System Recharge",
        date: "Jan 15, 2026",
        status: "completed",
        cost: "₱3,200",
        items: [
          "Refrigerant recharge",
          "Compressor check",
          "Cabin filter replaced",
        ],
      },
      {
        id: 3,
        type: "PMS",
        title: "Periodic Maintenance Service (15,000km)",
        date: "Nov 10, 2025",
        status: "completed",
        cost: "₱6,800",
        items: [
          "Oil & filter change",
          "Air filter replacement",
          "Fluid top-up",
        ],
      },
    ],
  },
  {
    id: "car-2",
    info: {
      model: "Toyota Fortuner 2.4 G DSL AT",
      year: 2023,
      color: "Attitude Black Mica",
      plate: "XYZ 5678",
      vin: "MHFGB8GS•••••4321",
      nextPMS: "May 20, 2026",
    },
    fuelEntries: [
      {
        id: 1,
        date: "Mar 12, 2026",
        station: "Petron - Paso de Blas",
        amountPaid: 4500,
        pricePerLiter: 58.2,
        liters: 77.32,
        odometer: 34200,
      },
      {
        id: 2,
        date: "Feb 25, 2026",
        station: "Shell - MacArthur Highway",
        amountPaid: 4000,
        pricePerLiter: 57.8,
        liters: 69.2,
        odometer: 33500,
      },
    ],
    serviceHistory: [
      {
        id: 1,
        type: "PMS",
        title: "Periodic Maintenance Service (30,000km)",
        date: "Jan 20, 2026",
        status: "completed",
        cost: "₱12,500",
        items: [
          "Oil & filter change",
          "Diesel fuel filter replacement",
          "Brake pad replacement",
          "Multi-point inspection",
        ],
      },
    ],
  },
];

const gasStations = [
  { name: "Shell - MacArthur Highway", price: 65.75 },
  { name: "Petron - Paso de Blas", price: 65.2 },
  { name: "Caltex - Valenzuela City", price: 65.5 },
  { name: "Phoenix - Karuhatan", price: 63.8 },
  { name: "Seaoil - Gen. T. de Leon", price: 62.9 },
];

const carColors = [
  "from-toyota-red to-toyota-red/80",
  "from-slate-700 to-slate-900",
  "from-toyota-blue to-blue-800",
  "from-emerald-700 to-emerald-900",
  "from-purple-700 to-purple-900",
];

// Map owned car colors to hex values for 3D viewer
const colorNameToHex: Record<string, string> = {
  "Alumina Jade Metallic": "#6b8e6b",
  "Attitude Black Mica": "#1a1a1a",
  "Super White": "#f5f5f5",
  "Silver Metallic": "#c0c0c0",
  "Platinum White Pearl": "#e8e4df",
};

type MyCarTab = "overview" | "fuel" | "history";

// ─── 3D Viewer state ────────────────────────────────────────────────

type ViewerTarget =
  | { kind: "owned"; carId: string }
  | { kind: "showroom"; car: ShowroomCar }
  | null;

// ─── Component ──────────────────────────────────────────────────────

export function MyCar() {
  const [cars, setCars] = useState<CarProfile[]>(defaultCars);
  const [selectedCarId, setSelectedCarId] = useState<string>(defaultCars[0].id);
  const [activeTab, setActiveTab] = useState<MyCarTab>("overview");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddFuel, setShowAddFuel] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [odometer, setOdometer] = useState("");
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCarModel, setNewCarModel] = useState("");
  const [newCarYear, setNewCarYear] = useState("");
  const [newCarColor, setNewCarColor] = useState("");
  const [newCarPlate, setNewCarPlate] = useState("");
  const [showShowroom, setShowShowroom] = useState(false);
  const [viewerTarget, setViewerTarget] = useState<ViewerTarget>(null);
  const { bookings, navigateTo } = useApp();

  const selectedCar = cars.find((c) => c.id === selectedCarId) ?? cars[0];
  const selectedCarIndex = cars.findIndex((c) => c.id === selectedCarId);
  const colorClass = carColors[selectedCarIndex % carColors.length];

  // ─── Fuel computations ──────────────────────────────────────────
  const fuelEntries = selectedCar.fuelEntries;
  const totalLiters = fuelEntries.reduce((s, e) => s + e.liters, 0);
  const totalSpent = fuelEntries.reduce((s, e) => s + e.amountPaid, 0);
  const sortedByOdo = [...fuelEntries].sort((a, b) => a.odometer - b.odometer);
  const kmDriven =
    sortedByOdo.length >= 2
      ? sortedByOdo[sortedByOdo.length - 1].odometer - sortedByOdo[0].odometer
      : 0;
  const avgEfficiency =
    kmDriven > 0 && totalLiters > 0 ? kmDriven / totalLiters : 0;
  const costPerKm = kmDriven > 0 ? totalSpent / kmDriven : 0;
  const lastOdometer = fuelEntries.length > 0 ? fuelEntries[0].odometer : 0;

  const selectedStationData = gasStations.find(
    (s) => s.name === selectedStation,
  );
  const computedLiters =
    selectedStationData && amountPaid
      ? parseFloat(amountPaid) / selectedStationData.price
      : 0;

  // ─── Handlers ───────────────────────────────────────────────────

  const updateCarFuelEntries = (carId: string, entries: FuelEntry[]) => {
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, fuelEntries: entries } : c)),
    );
  };

  const addFuelEntry = () => {
    if (!selectedStation || !amountPaid || !odometer) return;
    const station = gasStations.find((s) => s.name === selectedStation);
    if (!station) return;
    const paid = parseFloat(amountPaid);
    const odo = parseFloat(odometer);
    const liters = paid / station.price;
    const newEntry: FuelEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      station: station.name,
      amountPaid: paid,
      pricePerLiter: station.price,
      liters,
      odometer: odo,
    };
    updateCarFuelEntries(selectedCar.id, [
      newEntry,
      ...selectedCar.fuelEntries,
    ]);
    setShowAddFuel(false);
    setSelectedStation("");
    setAmountPaid("");
    setOdometer("");
  };

  const addNewCar = () => {
    if (!newCarModel || !newCarYear || !newCarPlate) return;
    const newCar: CarProfile = {
      id: `car-${Date.now()}`,
      info: {
        model: newCarModel,
        year: parseInt(newCarYear),
        color: newCarColor || "Not specified",
        plate: newCarPlate.toUpperCase(),
        vin: "—",
        nextPMS: "Not scheduled",
      },
      fuelEntries: [],
      serviceHistory: [],
    };
    setCars((prev) => [...prev, newCar]);
    setSelectedCarId(newCar.id);
    setShowAddCar(false);
    setNewCarModel("");
    setNewCarYear("");
    setNewCarColor("");
    setNewCarPlate("");
  };

  const removeCar = (carId: string) => {
    if (cars.length <= 1) return;
    setCars((prev) => prev.filter((c) => c.id !== carId));
    if (selectedCarId === carId) {
      setSelectedCarId(cars.find((c) => c.id !== carId)!.id);
    }
  };

  const selectPreviousCar = () => {
    const idx = cars.findIndex((c) => c.id === selectedCarId);
    if (idx > 0) setSelectedCarId(cars[idx - 1].id);
  };

  const selectNextCar = () => {
    const idx = cars.findIndex((c) => c.id === selectedCarId);
    if (idx < cars.length - 1) setSelectedCarId(cars[idx + 1].id);
  };

  const openOwnedCarViewer = (carId: string) => {
    setViewerTarget({ kind: "owned", carId });
  };

  const openShowroomViewer = (car: ShowroomCar) => {
    setViewerTarget({ kind: "showroom", car });
  };

  const tabs: { id: MyCarTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "fuel", label: "Fuel Log" },
    { id: "history", label: "Service" },
  ];

  // ─── Full-screen 3D viewer ─────────────────────────────────────
  if (viewerTarget) {
    const viewerName =
      viewerTarget.kind === "owned"
        ? (cars.find((c) => c.id === viewerTarget.carId)?.info.model ??
          "Your Car")
        : viewerTarget.car.model;
    const viewerColor =
      viewerTarget.kind === "owned"
        ? (colorNameToHex[
            cars.find((c) => c.id === viewerTarget.carId)?.info.color ?? ""
          ] ?? "#cc0000")
        : viewerTarget.car.defaultColor;

    return (
      <CarModel3D
        initialColor={viewerColor}
        carName={viewerName}
        onClose={() => setViewerTarget(null)}
      />
    );
  }

  // ─── Full-screen showroom browser ──────────────────────────────
  if (showShowroom) {
    return (
      <div className="flex h-full flex-col">
        <div className="bg-card shrink-0 px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShowroom(false)}
              className="bg-secondary text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold">Explore Models</h1>
              <p className="text-muted-foreground text-xs">
                Discover your next Toyota
              </p>
            </div>
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {/* Category filters */}
          <div className="mt-3 flex gap-2">
            {["All", "Sedan", "SUV", "Sports", "Truck"].map((cat) => (
              <button
                key={cat}
                className="bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Car grid */}
          <div className="mt-4 space-y-3">
            {showroomCatalog.map((car) => (
              <button
                key={car.id}
                onClick={() => openShowroomViewer(car)}
                className="w-full text-left"
              >
                <div className="group bg-card hover:border-primary/30 overflow-hidden rounded-2xl border transition-all hover:shadow-md">
                  {/* Color preview banner */}
                  <div
                    className="relative flex h-32 items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${car.defaultColor} 0%, ${car.defaultColor}cc 50%, ${car.defaultColor}88 100%)`,
                    }}
                  >
                    <Car className="h-16 w-16 text-white/20" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Eye className="h-3 w-3" />
                      View in 3D
                    </div>
                    {car.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-[10px] font-bold text-black">
                          {car.badge}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          {car.year} • {car.category}
                        </p>
                        <h3 className="mt-0.5 text-sm font-bold">
                          {car.model}
                        </h3>
                        <p className="text-muted-foreground mt-0.5 text-[11px]">
                          {car.tagline}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-[10px]">
                          Starting at
                        </p>
                        <p className="text-primary text-sm font-bold">
                          {car.startingPrice}
                        </p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {car.specs.map((s) => (
                        <div
                          key={s.label}
                          className="bg-secondary/50 rounded-lg p-2 text-center"
                        >
                          <p className="text-muted-foreground text-[9px]">
                            {s.label}
                          </p>
                          <p className="text-[11px] font-semibold">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main My Cars view ────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="bg-card shrink-0 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">My Cars</h1>
            <p className="text-muted-foreground text-xs">
              {cars.length} vehicle{cars.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          <button
            onClick={() => setShowAddCar(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Car
          </button>
        </div>

        {/* Car Switcher */}
        <div className="mt-3 flex items-center gap-1.5">
          <button
            onClick={selectPreviousCar}
            disabled={selectedCarIndex === 0}
            className="text-muted-foreground hover:text-foreground shrink-0 rounded-lg p-1 transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {cars.map((car) => (
              <button
                key={car.id}
                onClick={() => setSelectedCarId(car.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left transition-all",
                  car.id === selectedCarId
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80",
                )}
              >
                <Car className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">
                    {car.info.model.split(" ").slice(1, 3).join(" ")}
                  </p>
                  <p
                    className={cn(
                      "text-[10px]",
                      car.id === selectedCarId
                        ? "opacity-70"
                        : "text-muted-foreground/60",
                    )}
                  >
                    {car.info.plate}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={selectNextCar}
            disabled={selectedCarIndex === cars.length - 1}
            className="text-muted-foreground hover:text-foreground shrink-0 rounded-lg p-1 transition-colors disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="bg-secondary mt-3 flex gap-1 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all",
                activeTab === t.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        {/* Add Car Form */}
        {showAddCar && (
          <div className="border-primary/20 bg-card mt-3 rounded-xl border-2 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Add a Vehicle</h3>
              <button onClick={() => setShowAddCar(false)}>
                <X className="text-muted-foreground h-4 w-4" />
              </button>
            </div>

            <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
              Car Model *
            </label>
            <Input
              placeholder="e.g. Toyota Corolla Altis 1.6 V CVT"
              value={newCarModel}
              onChange={(e) => setNewCarModel(e.target.value)}
              className="mb-2 h-9 text-sm"
            />

            <div className="mb-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
                  Year *
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={newCarYear}
                  onChange={(e) => setNewCarYear(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
                  Plate Number *
                </label>
                <Input
                  placeholder="e.g. DEF 5678"
                  value={newCarPlate}
                  onChange={(e) => setNewCarPlate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
              Color
            </label>
            <Input
              placeholder="e.g. Super White"
              value={newCarColor}
              onChange={(e) => setNewCarColor(e.target.value)}
              className="mb-3 h-9 text-sm"
            />

            <button
              onClick={addNewCar}
              disabled={!newCarModel || !newCarYear || !newCarPlate}
              className="bg-primary text-primary-foreground w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
            >
              Add Vehicle
            </button>
          </div>
        )}

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === "overview" && (
          <>
            {/* Car Card — tappable to open 3D viewer */}
            <button
              onClick={() => openOwnedCarViewer(selectedCar.id)}
              className="mt-3 w-full text-left"
            >
              <div
                className={cn(
                  "text-primary-foreground relative overflow-hidden rounded-2xl bg-linear-to-br p-5 transition-all hover:shadow-lg",
                  colorClass,
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium opacity-80">
                        {selectedCar.info.year} • {selectedCar.info.color}
                      </p>
                      <h2 className="mt-1 text-xl font-bold">
                        {selectedCar.info.model}
                      </h2>
                      <p className="mt-0.5 font-mono text-sm opacity-70">
                        {selectedCar.info.plate}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Car className="h-10 w-10 opacity-30" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs opacity-60">
                      VIN: {selectedCar.info.vin}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                      <Eye className="h-3 w-3" /> View in 3D
                    </span>
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
                <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-white/5" />
              </div>
            </button>

            {/* Remove car button */}
            {cars.length > 1 && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => removeCar(selectedCar.id)}
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove vehicle
                </button>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <Gauge className="text-toyota-red mb-1.5 h-4 w-4" />
                <span className="text-muted-foreground text-[10px]">
                  Odometer
                </span>
                <span className="text-xs font-semibold">
                  {lastOdometer.toLocaleString()} km
                </span>
              </div>
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <TrendingUp className="text-toyota-amber mb-1.5 h-4 w-4" />
                <span className="text-muted-foreground text-[10px]">
                  Avg km/L
                </span>
                <span className="text-xs font-semibold">
                  {avgEfficiency > 0 ? avgEfficiency.toFixed(1) : "—"}
                </span>
              </div>
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <Calendar className="text-toyota-blue mb-1.5 h-4 w-4" />
                <span className="text-muted-foreground text-[10px]">
                  Next PMS
                </span>
                <span className="text-xs font-semibold">
                  {selectedCar.info.nextPMS.length > 6
                    ? selectedCar.info.nextPMS.slice(0, 6)
                    : selectedCar.info.nextPMS}
                </span>
              </div>
            </div>

            {/* Upcoming Bookings */}
            {bookings.length > 0 && (
              <div className="border-primary/20 bg-primary/5 mt-4 rounded-xl border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays className="text-primary h-4 w-4" />
                  <h3 className="text-sm font-semibold">
                    Upcoming Appointments
                  </h3>
                </div>
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-card flex items-center justify-between rounded-lg p-3"
                    >
                      <div>
                        <p className="text-xs font-semibold">{b.title}</p>
                        <p className="text-muted-foreground text-[11px]">
                          {b.date} • {b.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          b.status === "confirmed" ? "default" : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fuel Summary */}
            <div className="bg-card mt-4 rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Fuel Summary</h3>
                <Badge variant="secondary" className="text-[10px]">
                  {fuelEntries.length} fill-ups
                </Badge>
              </div>
              {fuelEntries.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No fuel entries yet. Go to Fuel Log to add your first fill-up.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-[10px]">
                      Total Spent
                    </p>
                    <p className="text-sm font-bold">
                      ₱
                      {totalSpent.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-[10px]">
                      Total Liters
                    </p>
                    <p className="text-sm font-bold">
                      {totalLiters.toFixed(1)} L
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-[10px]">
                      Cost per km
                    </p>
                    <p className="text-sm font-bold">
                      {costPerKm > 0 ? `₱${costPerKm.toFixed(2)}` : "—"}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-muted-foreground text-[10px]">
                      Distance Tracked
                    </p>
                    <p className="text-sm font-bold">
                      {kmDriven > 0 ? `${kmDriven.toLocaleString()} km` : "—"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================== FUEL LOG TAB ==================== */}
        {activeTab === "fuel" && (
          <>
            <button
              onClick={() => setShowAddFuel(true)}
              className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3.5 text-sm font-semibold transition-colors"
            >
              <Plus className="h-4 w-4" />
              Log a Fill-up
            </button>

            {showAddFuel && (
              <div className="bg-card mt-3 rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">New Fill-up</h3>
                  <button onClick={() => setShowAddFuel(false)}>
                    <X className="text-muted-foreground h-4 w-4" />
                  </button>
                </div>

                <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
                  Gas Station
                </label>
                <div className="mb-3 space-y-1.5">
                  {gasStations.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedStation(s.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                        selectedStation === s.name
                          ? "border-primary bg-primary/5"
                          : "hover:bg-secondary/50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-3.5 w-3.5" />
                        {s.name}
                      </div>
                      <span className="text-primary font-semibold">
                        ₱{s.price.toFixed(2)}/L
                      </span>
                    </button>
                  ))}
                </div>

                <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
                  Amount Paid (₱)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2500"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="mb-2 h-9 text-sm"
                />

                {selectedStationData && amountPaid && (
                  <div className="bg-primary/5 mb-3 rounded-lg px-3 py-2 text-xs">
                    <span className="text-muted-foreground">
                      Estimated fuel:{" "}
                    </span>
                    <span className="text-primary font-bold">
                      {computedLiters.toFixed(2)} liters
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      @ ₱{selectedStationData.price.toFixed(2)}/L
                    </span>
                  </div>
                )}

                <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
                  Current Odometer (km)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 12800"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="mb-3 h-9 text-sm"
                />

                <button
                  onClick={addFuelEntry}
                  disabled={!selectedStation || !amountPaid || !odometer}
                  className="bg-primary text-primary-foreground w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-40"
                >
                  Save Fill-up
                </button>
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <span className="text-muted-foreground text-[10px]">
                  Avg km/L
                </span>
                <span className="text-toyota-red text-sm font-bold">
                  {avgEfficiency > 0 ? avgEfficiency.toFixed(1) : "—"}
                </span>
              </div>
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <span className="text-muted-foreground text-[10px]">
                  Cost/km
                </span>
                <span className="text-toyota-amber text-sm font-bold">
                  {costPerKm > 0 ? `₱${costPerKm.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="bg-card flex flex-col items-center rounded-xl border p-3">
                <span className="text-muted-foreground text-[10px]">
                  Avg ₱/L
                </span>
                <span className="text-toyota-blue text-sm font-bold">
                  {fuelEntries.length > 0
                    ? `₱${(fuelEntries.reduce((s, e) => s + e.pricePerLiter, 0) / fuelEntries.length).toFixed(2)}`
                    : "—"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold">Fill-up History</h3>
              {fuelEntries.length === 0 ? (
                <div className="bg-card rounded-xl border p-6 text-center">
                  <Fuel className="text-muted-foreground/40 mx-auto mb-2 h-8 w-8" />
                  <p className="text-muted-foreground text-xs">
                    No fill-ups recorded for this vehicle yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fuelEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-card rounded-xl border p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                          <Fuel className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {entry.station}
                          </p>
                          <p className="text-muted-foreground text-[11px]">
                            {entry.date} • {entry.odometer.toLocaleString()} km
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ₱{entry.amountPaid.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground text-[11px]">
                            {entry.liters.toFixed(1)}L
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================== SERVICE HISTORY TAB ==================== */}
        {activeTab === "history" && (
          <div className="mt-3">
            {bookings.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Upcoming Appointments
                  </h3>
                  <button
                    onClick={() => navigateTo("chat")}
                    className="text-primary text-xs font-medium"
                  >
                    + Book New
                  </button>
                </div>
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="border-primary/20 bg-primary/5 rounded-xl border p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{b.title}</p>
                          <p className="text-muted-foreground text-[11px]">
                            {b.date} at {b.time}
                          </p>
                          {b.notes && (
                            <p className="text-muted-foreground mt-1 text-[11px]">
                              {b.notes}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            b.status === "confirmed" ? "default" : "secondary"
                          }
                          className="shrink-0 text-[10px]"
                        >
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Dealer Service Records</h3>
              <Badge variant="secondary" className="text-[10px]">
                {selectedCar.serviceHistory.length} records
              </Badge>
            </div>

            {selectedCar.serviceHistory.length === 0 ? (
              <div className="bg-card rounded-xl border p-6 text-center">
                <Wrench className="text-muted-foreground/40 mx-auto mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-xs">
                  No service records for this vehicle yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedCar.serviceHistory.map((record) => {
                  const isExpanded = expandedId === record.id;

                  return (
                    <button
                      key={record.id}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : record.id)
                      }
                      className="w-full text-left"
                    >
                      <div className="bg-card rounded-xl border p-3.5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                            {record.type === "PMS" ? (
                              <RotateCcw className="h-4 w-4" />
                            ) : record.type === "Repair" ? (
                              <Wrench className="h-4 w-4" />
                            ) : (
                              <Droplets className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {record.title}
                            </p>
                            <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                              <span>{record.date}</span>
                              <span>•</span>
                              <span className="font-medium">{record.cost}</span>
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              "text-muted-foreground h-4 w-4 shrink-0 transition-transform",
                              isExpanded && "rotate-90",
                            )}
                          />
                        </div>

                        {isExpanded && (
                          <div className="mt-3 border-t pt-3">
                            <p className="text-muted-foreground mb-2 text-[11px] font-medium">
                              Service Items
                            </p>
                            <div className="space-y-1.5">
                              {record.items.map((item) => (
                                <div
                                  key={item}
                                  className="text-muted-foreground flex items-center gap-2 text-xs"
                                >
                                  <CircleCheck className="text-primary h-3 w-3 shrink-0" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── Discover New Models ─────────────────────────── */}
        <button
          onClick={() => setShowShowroom(true)}
          className="mt-4 w-full text-left"
        >
          <div className="group border-primary/20 from-primary/5 via-primary/10 to-primary/5 hover:border-primary/40 relative overflow-hidden rounded-2xl border bg-linear-to-r p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold">Explore New Models</h3>
                <p className="text-muted-foreground text-[11px]">
                  View the latest Toyota lineup in interactive 3D
                </p>
              </div>
              <ArrowRight className="text-primary h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Mini showcase strip */}
            <div className="mt-3 flex gap-2 overflow-hidden">
              {showroomCatalog.slice(0, 4).map((car) => (
                <div
                  key={car.id}
                  className="bg-card flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: car.defaultColor }}
                  />
                  <span className="text-[10px] font-medium">
                    {car.model.split(" ").slice(1).join(" ")}
                  </span>
                  {car.badge && (
                    <Badge variant="secondary" className="h-4 px-1 text-[8px]">
                      {car.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </button>

        {/* Featured showroom car card */}
        <button
          onClick={() => openShowroomViewer(showroomCatalog[0])}
          className="mt-3 w-full text-left"
        >
          <div className="group bg-card hover:border-primary/30 overflow-hidden rounded-2xl border transition-all hover:shadow-md">
            <div
              className="relative flex h-28 items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${showroomCatalog[0].defaultColor} 0%, ${showroomCatalog[0].defaultColor}88 100%)`,
              }}
            >
              <Car className="h-14 w-14 text-white/20" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-[10px] font-bold text-black">
                  Featured
                </Badge>
              </div>
              <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                <Eye className="h-3 w-3" />
                View in 3D
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-muted-foreground text-[11px]">
                {showroomCatalog[0].year} • {showroomCatalog[0].category}
              </p>
              <h3 className="text-sm font-bold">{showroomCatalog[0].model}</h3>
              <p className="text-muted-foreground text-[11px]">
                {showroomCatalog[0].tagline}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-primary text-xs font-bold">
                  {showroomCatalog[0].startingPrice}
                </p>
                <span className="text-primary flex items-center gap-1 text-[11px] font-medium">
                  Customize & explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
