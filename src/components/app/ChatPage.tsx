"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  Users,
  ArrowLeft,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChatView = "list" | "bot" | "group";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot" | string;
  time: string;
}

const groups = [
  {
    id: "vios-club",
    name: "Vios Owners Club",
    avatar: "VO",
    lastMessage: "James: Anyone joining the meet this Saturday?",
    time: "2m",
    unread: 3,
    members: 128,
  },
  {
    id: "fortuner-ph",
    name: "Fortuner PH",
    avatar: "FP",
    lastMessage: "Maria: Just installed new AT tires, highly recommend!",
    time: "15m",
    unread: 0,
    members: 256,
  },
  {
    id: "gr-enthusiasts",
    name: "GR Enthusiasts",
    avatar: "GR",
    lastMessage: "Carlo: GR Corolla test drive was insane 🔥",
    time: "1h",
    unread: 7,
    members: 89,
  },
  {
    id: "service-tips",
    name: "Service & Maintenance Tips",
    avatar: "ST",
    lastMessage: "Patrick: Best places for PMS in Valenzuela?",
    time: "3h",
    unread: 0,
    members: 412,
  },
  {
    id: "buy-sell",
    name: "Buy & Sell Parts",
    avatar: "BS",
    lastMessage: "Ana: WTS: OEM Vios headlights, barely used",
    time: "5h",
    unread: 1,
    members: 194,
  },
];

const botGreeting: Message[] = [
  {
    id: 1,
    text: "Hello! 👋 I'm ToyoBot, your Toyota Valenzuela assistant. I'm a friendly mechanic here to help you with:\n\n• Car diagnosis & repair advice\n• Maintenance tips & schedules\n• Service appointment booking\n• Parts & cost estimates\n• General Toyota questions\n\nKamusta? How can I help you today, pare?",
    sender: "bot",
    time: "Now",
  },
];

const groupMessages: Record<string, Message[]> = {
  "vios-club": [
    {
      id: 1,
      text: "Good morning everyone! 🌅",
      sender: "Maria S.",
      time: "8:30 AM",
    },
    {
      id: 2,
      text: "Morning! Anyone have tips for long drives with the Vios?",
      sender: "Patrick L.",
      time: "8:45 AM",
    },
    {
      id: 3,
      text: "I did Manila to Baguio last weekend, cruise control is a lifesaver",
      sender: "Carlo M.",
      time: "9:00 AM",
    },
    {
      id: 4,
      text: "Nice! How was fuel consumption?",
      sender: "user",
      time: "9:10 AM",
    },
    {
      id: 5,
      text: "Around 18km/L on highway, not bad at all!",
      sender: "Carlo M.",
      time: "9:12 AM",
    },
    {
      id: 6,
      text: "Anyone joining the meet this Saturday?",
      sender: "James R.",
      time: "10:15 AM",
    },
  ],
};

export function ChatPage() {
  const [view, setView] = useState<ChatView>("list");
  const [activeGroup, setActiveGroup] = useState<string>("");
  const [botMessages, setBotMessages] = useState<Message[]>(botGreeting);
  const [grpMessages, setGrpMessages] = useState(groupMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [botMessages, grpMessages, view]);

  const sendBotMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    const userMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: "user",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setBotMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Build message history for context (last 10 messages)
      const history = [...botMessages, userMsg].slice(-10).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json()) as { message: string };

      const reply: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: "bot",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setBotMessages((prev) => [...prev, reply]);
    } catch {
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Ay, sorry po! I'm having connection issues right now. Please try again in a moment. 🔧",
        sender: "bot",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setBotMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendGroupMessage = () => {
    if (!input.trim() || !activeGroup) return;
    const existing = grpMessages[activeGroup] || [];
    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setGrpMessages((prev) => ({
      ...prev,
      [activeGroup]: [...existing, newMsg],
    }));
    setInput("");
  };

  const activeGroupData = groups.find((g) => g.id === activeGroup);

  // Bot chat view
  if (view === "bot") {
    return (
      <div className="flex h-full flex-col">
        <div className="bg-card flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <button onClick={() => setView("list")}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="bg-toyota-blue flex h-9 w-9 items-center justify-center rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">ToyoBot</p>
            <p className="text-muted-foreground text-[11px]">
              {isLoading ? "Typing..." : "AI Mechanic • Always online"}
            </p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex-1 overflow-y-auto p-4"
        >
          <div className="space-y-3">
            {botMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md",
                  )}
                >
                  {msg.text}
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      msg.sender === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground",
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-muted-foreground flex items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">ToyoBot is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendBotMessage()}
              placeholder="Ask about your car, book service..."
              className="h-10 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendBotMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group chat view
  if (view === "group" && activeGroupData) {
    const msgs = grpMessages[activeGroup] || [];
    return (
      <div className="flex h-full flex-col">
        <div className="bg-card flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <button
            onClick={() => {
              setView("list");
              setActiveGroup("");
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-toyota-amber/15 text-toyota-amber text-xs font-semibold">
              {activeGroupData.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {activeGroupData.name}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {activeGroupData.members} members
            </p>
          </div>
          <MoreVertical className="text-muted-foreground h-5 w-5" />
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar flex-1 overflow-y-auto p-4"
        >
          <div className="space-y-3">
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md",
                  )}
                >
                  {msg.sender !== "user" && (
                    <p className="text-primary mb-0.5 text-[11px] font-semibold">
                      {msg.sender}
                    </p>
                  )}
                  {msg.text}
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      msg.sender === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground",
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendGroupMessage()}
              placeholder="Type a message..."
              className="h-10 text-sm"
            />
            <button
              onClick={sendGroupMessage}
              className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat list view
  return (
    <div className="flex h-full flex-col">
      <div className="bg-card shrink-0 px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold">Chat</h1>
        <p className="text-muted-foreground text-xs">Messages & groups</p>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {/* ToyoBot */}
        <button
          onClick={() => setView("bot")}
          className="hover:bg-secondary/50 flex w-full items-center gap-3 border-b px-4 py-3.5 text-left transition-colors"
        >
          <div className="bg-toyota-blue flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">ToyoBot</p>
              <span className="text-muted-foreground text-[11px]">Now</span>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              AI Mechanic — car advice, diagnosis & booking
            </p>
          </div>
          <Badge className="shrink-0 text-[10px]">AI</Badge>
        </button>

        {/* Groups Header */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Users className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-xs font-semibold">
            GROUP CHATS
          </span>
        </div>

        {/* Group list */}
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => {
              setActiveGroup(group.id);
              setView("group");
            }}
            className="hover:bg-secondary/50 flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-toyota-amber/15 text-toyota-amber text-sm font-semibold">
                {group.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold">{group.name}</p>
                <span className="text-muted-foreground shrink-0 text-[11px]">
                  {group.time}
                </span>
              </div>
              <p className="text-muted-foreground truncate text-xs">
                {group.lastMessage}
              </p>
            </div>
            {group.unread > 0 && (
              <div className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                {group.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
