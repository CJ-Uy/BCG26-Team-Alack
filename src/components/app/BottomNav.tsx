"use client";

import { Home, Car, MessageCircle, User } from "lucide-react";
import { motion } from "framer-motion";
import { ToyotaLogo } from "./ToyotaLogo";
import { cn } from "@/lib/utils";

export type Tab = "home" | "mycar" | "menu" | "chat" | "profile";

interface BottomNavProps {
  active: Tab;
  menuOpen: boolean;
  onTabChange: (tab: Tab) => void;
  onMenuPress: () => void;
}

const tabs = [
  { id: "home" as Tab, icon: Home, label: "Home" },
  { id: "mycar" as Tab, icon: Car, label: "My Car" },
  { id: "menu" as Tab, icon: null, label: "Menu" },
  { id: "chat" as Tab, icon: MessageCircle, label: "Chat" },
  { id: "profile" as Tab, icon: User, label: "Profile" },
];

export function BottomNav({
  active,
  menuOpen,
  onTabChange,
  onMenuPress,
}: BottomNavProps) {
  return (
    <div className="relative z-50 flex-shrink-0">
      <nav className="bg-card relative flex items-end justify-around border-t px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          if (tab.id === "menu") {
            return (
              <button
                key="menu"
                onClick={onMenuPress}
                className="group relative -mt-7 flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    rotate: menuOpen ? 180 : 0,
                    scale: menuOpen ? 0.9 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                  }}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors duration-300",
                    menuOpen
                      ? "bg-foreground shadow-foreground/20"
                      : "bg-primary shadow-primary/30",
                  )}
                >
                  <motion.div
                    animate={{
                      rotate: menuOpen ? -180 : 0,
                      opacity: menuOpen ? 0 : 1,
                      scale: menuOpen ? 0.5 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 18,
                    }}
                    className="absolute"
                  >
                    <ToyotaLogo className="text-primary-foreground h-8 w-8" />
                  </motion.div>
                  <motion.div
                    animate={{
                      rotate: menuOpen ? 0 : 180,
                      opacity: menuOpen ? 1 : 0,
                      scale: menuOpen ? 1 : 0.5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 18,
                    }}
                    className="text-background absolute text-2xl font-bold"
                  >
                    ✕
                  </motion.div>
                </motion.div>
                <span
                  className={cn(
                    "mt-0.5 text-[10px] font-medium transition-colors",
                    menuOpen ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {menuOpen ? "Close" : "Menu"}
                </span>
              </button>
            );
          }

          const Icon = tab.icon!;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="bg-primary absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
