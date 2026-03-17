"use client";

import { useState, useEffect } from "react";
import { AppProvider, useApp } from "@/lib/AppContext";
import { BottomNav, type Tab } from "@/components/app/BottomNav";
import { HomeFeed } from "@/components/app/HomeFeed";
import { MyCar } from "@/components/app/MyCar";
import { ChatPage } from "@/components/app/ChatPage";
import { ProfilePage } from "@/components/app/ProfilePage";
import { MenuModal } from "@/components/app/MenuModal";

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOnNavigate } = useApp();

  useEffect(() => {
    setOnNavigate((tab: string) => {
      setActiveTab(tab as Tab);
      setMenuOpen(false);
    });
  }, [setOnNavigate]);

  return (
    <>
      {/* Tab Content */}
      <div className="relative flex-1 overflow-hidden">
        {activeTab === "home" && <HomeFeed />}
        {activeTab === "mycar" && <MyCar />}
        {activeTab === "chat" && <ChatPage />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        active={activeTab}
        menuOpen={menuOpen}
        onTabChange={(tab) => {
          setMenuOpen(false);
          setActiveTab(tab);
        }}
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
