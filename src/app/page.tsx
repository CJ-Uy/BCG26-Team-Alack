"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "@/lib/AppContext";
import { BottomNav, type Tab } from "@/components/app/BottomNav";
import { HomeFeed } from "@/components/app/HomeFeed";
import { MyCar } from "@/components/app/MyCar";
import { ChatPage } from "@/components/app/ChatPage";
import { ProfilePage } from "@/components/app/ProfilePage";
import { MenuModal } from "@/components/app/MenuModal";

const tabOrder: Tab[] = ["home", "mycar", "menu", "chat", "profile"];

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOnNavigate } = useApp();
  const prevTabRef = useRef<Tab>("home");

  // Determine slide direction based on tab position
  const direction =
    tabOrder.indexOf(activeTab) >= tabOrder.indexOf(prevTabRef.current)
      ? 1
      : -1;

  useEffect(() => {
    setOnNavigate((tab: string) => {
      setActiveTab(tab as Tab);
      setMenuOpen(false);
    });
  }, [setOnNavigate]);

  const handleTabChange = (tab: Tab) => {
    prevTabRef.current = activeTab;
    setMenuOpen(false);
    setActiveTab(tab);
  };

  return (
    <>
      {/* Tab Content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute inset-0"
          >
            {activeTab === "home" && <HomeFeed />}
            {activeTab === "mycar" && <MyCar />}
            {activeTab === "chat" && <ChatPage />}
            {activeTab === "profile" && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        active={activeTab}
        menuOpen={menuOpen}
        onTabChange={handleTabChange}
        onMenuPress={() => setMenuOpen(!menuOpen)}
      />

      {/* Menu Modal - covers EVERYTHING including nav */}
      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
