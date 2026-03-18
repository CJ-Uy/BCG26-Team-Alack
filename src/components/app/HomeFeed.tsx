"use client";

import { useState } from "react";
import {
  Search,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Image as ImageIcon,
  MapPin,
  Bell,
  X,
  CalendarDays,
  Tag,
  Megaphone,
  Users,
  Plus,
  Send,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useApp, type Notification } from "@/lib/AppContext";
import { motion, AnimatePresence } from "framer-motion";

type FeedFilter = "all" | "updates" | "forums" | "events" | "photos";

const filters: { id: FeedFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "updates", label: "Updates" },
  { id: "forums", label: "Forums" },
  { id: "events", label: "Events" },
  { id: "photos", label: "Photos" },
];

const posts = [
  {
    id: 1,
    type: "update" as const,
    author: "Toyota Valenzuela Official",
    avatar: "TV",
    time: "2h ago",
    title: "Service Center Extended Hours This Weekend",
    body: "Great news! Our service center will be open from 7AM to 7PM this Saturday and Sunday. Walk-ins welcome for oil change and basic maintenance.",
    likes: 47,
    comments: 12,
    liked: false,
    badge: "Official",
  },
  {
    id: 2,
    type: "event" as const,
    author: "Carlo M.",
    avatar: "CM",
    time: "4h ago",
    title: "Weekend Car Meet @ SM Valenzuela",
    body: "Calling all Toyota enthusiasts! Join us this Saturday for our monthly car meet. Bring your rides, share stories, and enjoy some coffee.",
    likes: 89,
    comments: 34,
    liked: true,
    badge: "Event",
    date: "Mar 22, 2026",
    location: "SM Valenzuela Parking Lot B",
  },
  {
    id: 3,
    type: "forum" as const,
    author: "Maria S.",
    avatar: "MS",
    time: "6h ago",
    title: "Best dashcam for Vios 2024?",
    body: "Just got my new Vios and looking for dashcam recommendations. Budget around ₱3,000-5,000. What are you guys using?",
    likes: 23,
    comments: 41,
    liked: false,
    badge: "Forum",
  },
  {
    id: 4,
    type: "photo" as const,
    author: "James R.",
    avatar: "JR",
    time: "8h ago",
    title: "Finally got my Fortuner detailed!",
    body: "After 3 months of waiting, she's finally looking brand new. Thanks to the detailing crew at Toyota Valenzuela!",
    likes: 156,
    comments: 28,
    liked: false,
    badge: "Photo",
    hasImage: true,
  },
  {
    id: 5,
    type: "update" as const,
    author: "Toyota Valenzuela Official",
    avatar: "TV",
    time: "1d ago",
    title: "New GR Corolla Now Available for Test Drive",
    body: "The wait is over! Book your GR Corolla test drive experience today. Limited slots available this month.",
    likes: 203,
    comments: 67,
    liked: true,
    badge: "Official",
  },
  {
    id: 6,
    type: "forum" as const,
    author: "Patrick L.",
    avatar: "PL",
    time: "1d ago",
    title: "PMS Schedule - How strict should I follow it?",
    body: "I'm about 500km past my recommended PMS date. Is it okay to delay a bit or should I go immediately? Running a 2023 Raize.",
    likes: 15,
    comments: 22,
    liked: false,
    badge: "Forum",
  },
];

function getNotifIcon(type: Notification["type"]) {
  switch (type) {
    case "booking":
      return CalendarDays;
    case "event":
      return Users;
    case "promo":
      return Tag;
    case "reminder":
      return Bell;
    case "community":
      return Megaphone;
  }
}

export function HomeFeed() {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");
  const [search, setSearch] = useState("");
  const [feedPosts, setFeedPosts] = useState(posts);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTitle, setComposeTitle] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeType, setComposeType] = useState<"forum" | "photo">("forum");
  const { notifications, markNotificationRead, unreadCount } = useApp();

  const toggleLike = (id: number) => {
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const handlePost = () => {
    if (!composeTitle.trim() || !composeBody.trim()) return;
    const newPost =
      composeType === "forum"
        ? {
            id: Date.now(),
            type: "forum" as const,
            author: "You",
            avatar: "YO",
            time: "Just now",
            title: composeTitle.trim(),
            body: composeBody.trim(),
            likes: 0,
            comments: 0,
            liked: false,
            badge: "Forum",
          }
        : {
            id: Date.now(),
            type: "photo" as const,
            author: "You",
            avatar: "YO",
            time: "Just now",
            title: composeTitle.trim(),
            body: composeBody.trim(),
            likes: 0,
            comments: 0,
            liked: false,
            badge: "Photo",
            hasImage: true,
          };
    setFeedPosts((prev) => [newPost, ...prev]);
    setComposeTitle("");
    setComposeBody("");
    setComposeType("forum");
    setShowCompose(false);
  };

  const filteredPosts = feedPosts.filter((post) => {
    if (activeFilter !== "all") {
      const typeMap: Record<FeedFilter, string> = {
        all: "",
        updates: "update",
        forums: "forum",
        events: "event",
        photos: "photo",
      };
      if (post.type !== typeMap[activeFilter]) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="bg-card shrink-0 px-4 pt-4 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-lg font-bold">Community</h1>
            <p className="text-muted-foreground text-xs">Toyota Valenzuela</p>
          </div>
          <motion.button
            onClick={() => setShowNotifs(!showNotifs)}
            whileTap={{ scale: 0.85 }}
            className="bg-secondary hover:bg-secondary/80 relative flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <motion.div
              animate={
                unreadCount > 0
                  ? { rotate: [0, 15, -15, 10, -10, 0] }
                  : { rotate: 0 }
              }
              transition={{
                duration: 0.6,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            >
              <Bell className="text-foreground h-4 w-4" />
            </motion.div>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search updates, forums, events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "relative shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200",
                activeFilter === f.id
                  ? "text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {activeFilter === f.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="bg-primary absolute inset-0 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                  }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="bg-card shrink-0 overflow-hidden border-b"
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <h3 className="text-sm font-bold">Notifications</h3>
              <button onClick={() => setShowNotifs(false)}>
                <X className="text-muted-foreground h-4 w-4" />
              </button>
            </div>
            <div className="no-scrollbar max-h-64 overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = getNotifIcon(notif.type);
                return (
                  <button
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      "hover:bg-secondary/50 flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                      !notif.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        notif.read
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-xs leading-snug",
                            !notif.read ? "font-semibold" : "font-medium",
                          )}
                        >
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-snug">
                        {notif.body}
                      </p>
                      <p className="text-muted-foreground/60 mt-1 text-[10px]">
                        {notif.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-3 pt-3">
          {filteredPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.06,
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-card rounded-xl border p-4 transition-colors"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={cn(
                        "text-xs font-semibold",
                        post.avatar === "TV"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm leading-tight font-semibold">
                      {post.author}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {post.time}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={post.badge === "Official" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {post.badge}
                </Badge>
              </div>

              <h3 className="mb-1 text-sm font-semibold">{post.title}</h3>
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                {post.body}
              </p>

              {post.type === "event" && (
                <div className="bg-toyota-amber/8 mb-3 flex flex-col gap-1 rounded-lg p-2.5">
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="text-toyota-amber h-3.5 w-3.5" />
                    {post.date}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <MapPin className="text-toyota-amber h-3.5 w-3.5" />
                    {post.location}
                  </div>
                </div>
              )}

              {post.hasImage && (
                <div className="from-toyota-blue/5 to-toyota-blue/15 mb-3 flex h-40 items-center justify-center rounded-lg bg-linear-to-br">
                  <ImageIcon className="text-toyota-blue/40 h-8 w-8" />
                </div>
              )}

              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => toggleLike(post.id)}
                  whileTap={{ scale: 1.3 }}
                  className="text-muted-foreground flex items-center gap-1 text-xs transition-colors"
                >
                  <motion.div
                    animate={
                      post.liked
                        ? { scale: [1, 1.4, 1], rotate: [0, -15, 0] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        post.liked && "fill-primary text-primary",
                      )}
                    />
                  </motion.div>
                  {post.likes}
                </motion.button>
                <button className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="text-muted-foreground ml-auto text-xs">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-muted-foreground py-12 text-center text-sm"
            >
              No posts found.
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Post Button */}
      <motion.button
        onClick={() => setShowCompose(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
          delay: 0.3,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-primary shadow-primary/25 absolute right-4 bottom-4 z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
      >
        <Plus className="text-primary-foreground h-5 w-5" />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background/80 absolute inset-0 z-30 flex flex-col backdrop-blur-sm"
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="bg-card m-4 mt-auto mb-4 rounded-2xl border p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-foreground text-sm font-bold">
                  Create Post
                </h3>
                <button onClick={() => setShowCompose(false)}>
                  <X className="text-muted-foreground h-4 w-4" />
                </button>
              </div>

              {/* Post Type Selector */}
              <div className="mb-3 flex gap-2">
                {(["forum", "photo"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setComposeType(t)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      composeType === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {t === "forum" ? "Forum" : "Photo"}
                  </button>
                ))}
              </div>

              <Input
                placeholder="Title"
                value={composeTitle}
                onChange={(e) => setComposeTitle(e.target.value)}
                className="mb-2 h-9 text-sm"
              />
              <textarea
                placeholder="What's on your mind?"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                rows={3}
                className="placeholder:text-muted-foreground focus:ring-ring mb-3 w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              />

              <button
                onClick={handlePost}
                disabled={!composeTitle.trim() || !composeBody.trim()}
                className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                Post
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
