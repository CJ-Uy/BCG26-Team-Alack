"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Globe,
  Star,
  FileText,
  Phone,
  ArrowLeft,
  Check,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Trash2,
  CreditCard,
  ChevronDown,
  MessageSquare,
  Mail,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SettingsView =
  | null
  | "notifications"
  | "language"
  | "privacy"
  | "membership"
  | "terms"
  | "help"
  | "contact"
  | "signout"
  | "edit-profile";

interface SettingItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  badge?: string;
  action?: () => void;
}

/* ─── Sub-panel header ─── */
function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-card flex items-center gap-3 border-b px-4 py-3">
      <button
        onClick={onBack}
        className="bg-secondary flex h-8 w-8 items-center justify-center rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <h2 className="text-base font-bold">{title}</h2>
    </div>
  );
}

/* ─── Toggle Row ─── */
function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="hover:bg-secondary/50 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
    >
      <div>
        <p className="text-sm">{label}</p>
        {description && (
          <p className="text-muted-foreground text-[11px]">{description}</p>
        )}
      </div>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-secondary"}`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
    </button>
  );
}

/* ─── Notifications Panel ─── */
function NotificationsPanel({ onBack }: { onBack: () => void }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [eventAlerts, setEventAlerts] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(false);
  const [emailDigest, setEmailDigest] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Notifications" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            General
          </p>
        </div>
        <div className="bg-card overflow-hidden border-y">
          <ToggleRow
            label="Push Notifications"
            description="Receive alerts on your device"
            enabled={pushEnabled}
            onToggle={() => setPushEnabled(!pushEnabled)}
          />
          <Separator />
          <ToggleRow
            label="Email Digest"
            description="Weekly summary of activity"
            enabled={emailDigest}
            onToggle={() => setEmailDigest(!emailDigest)}
          />
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Alert Types
          </p>
        </div>
        <div className="bg-card overflow-hidden border-y">
          <ToggleRow
            label="Booking Confirmations"
            enabled={bookingAlerts}
            onToggle={() => setBookingAlerts(!bookingAlerts)}
          />
          <Separator />
          <ToggleRow
            label="Promos & Deals"
            enabled={promoAlerts}
            onToggle={() => setPromoAlerts(!promoAlerts)}
          />
          <Separator />
          <ToggleRow
            label="Events & Meets"
            enabled={eventAlerts}
            onToggle={() => setEventAlerts(!eventAlerts)}
          />
          <Separator />
          <ToggleRow
            label="Community Posts"
            description="When someone replies to your posts"
            enabled={communityAlerts}
            onToggle={() => setCommunityAlerts(!communityAlerts)}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Language Panel ─── */
function LanguagePanel({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState("en");
  const languages = [
    { id: "en", name: "English", native: "English" },
    { id: "fil", name: "Filipino", native: "Filipino" },
    { id: "ceb", name: "Cebuano", native: "Cebuano" },
    { id: "ilo", name: "Ilocano", native: "Ilokano" },
    { id: "ja", name: "Japanese", native: "日本語" },
    { id: "zh", name: "Chinese", native: "中文" },
  ];

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Language" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="bg-card overflow-hidden rounded-xl border">
          {languages.map((lang, i) => (
            <div key={lang.id}>
              {i > 0 && <Separator />}
              <button
                onClick={() => setSelected(lang.id)}
                className="hover:bg-secondary/50 flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{lang.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    {lang.native}
                  </p>
                </div>
                {selected === lang.id && (
                  <Check className="text-primary h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Privacy & Security Panel ─── */
function PrivacyPanel({ onBack }: { onBack: () => void }) {
  const [showProfile, setShowProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Privacy & Security" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Privacy
          </p>
        </div>
        <div className="bg-card overflow-hidden border-y">
          <ToggleRow
            label="Public Profile"
            description="Other members can see your profile"
            enabled={showProfile}
            onToggle={() => setShowProfile(!showProfile)}
          />
          <Separator />
          <ToggleRow
            label="Show Activity"
            description="Display your posts and events in community"
            enabled={showActivity}
            onToggle={() => setShowActivity(!showActivity)}
          />
        </div>

        <div className="px-4 pt-4 pb-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Security
          </p>
        </div>
        <div className="bg-card overflow-hidden border-y">
          <ToggleRow
            label="Two-Factor Authentication"
            description="Extra security for your account"
            enabled={twoFactor}
            onToggle={() => setTwoFactor(!twoFactor)}
          />
          <Separator />
          <ToggleRow
            label="Biometric Login"
            description="Use fingerprint or face to sign in"
            enabled={biometric}
            onToggle={() => setBiometric(!biometric)}
          />
          <Separator />
          <button className="hover:bg-secondary/50 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors">
            <Lock className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Change Password</span>
            <ChevronRight className="text-muted-foreground ml-auto h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <button className="border-destructive/20 bg-destructive/5 text-destructive flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Membership Panel ─── */
function MembershipPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="My Membership" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {/* Tier card */}
        <div className="from-toyota-red via-toyota-red/90 to-toyota-red/70 overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white">
          <div className="mb-3 flex items-center gap-2">
            <Star className="text-toyota-amber h-5 w-5" />
            <span className="text-lg font-bold">Gold Member</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <p className="text-[9px] tracking-wider text-white/60 uppercase">
                Member Since
              </p>
              <p className="text-sm font-bold">March 2023</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <p className="text-[9px] tracking-wider text-white/60 uppercase">
                Points
              </p>
              <p className="text-sm font-bold">12,450</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <p className="text-[9px] tracking-wider text-white/60 uppercase">
                Member ID
              </p>
              <p className="text-[11px] font-bold">TVLZ-2024-08156</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <p className="text-[9px] tracking-wider text-white/60 uppercase">
                Next Tier
              </p>
              <p className="text-sm font-bold">Platinum</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] text-white/70">
              <span>Gold</span>
              <span>Platinum (13,000 pts)</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/20">
              <div
                className="bg-toyota-amber h-1.5 rounded-full"
                style={{ width: "96%" }}
              />
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-4 mb-2 text-[10px] font-semibold tracking-wider uppercase">
          Benefits
        </p>
        <div className="bg-card overflow-hidden rounded-xl border">
          {[
            "Priority service booking",
            "10% off genuine parts",
            "Free car wash monthly",
            "Exclusive event invitations",
            "Birthday bonus points (2x)",
            "Toyota Cafe 5% discount",
          ].map((benefit, i) => (
            <div key={benefit}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 px-4 py-2.5">
                <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                <span className="text-sm">{benefit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Terms of Service Panel ─── */
function TermsPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Terms of Service" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="bg-card space-y-4 rounded-xl border p-4">
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing the Toyota Valenzuela Community app, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
            },
            {
              title: "2. User Account",
              body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
            },
            {
              title: "3. Community Guidelines",
              body: "Users must treat others with respect. Harassment, spam, and inappropriate content will result in account suspension. All posts must be relevant to the Toyota community.",
            },
            {
              title: "4. Service Bookings",
              body: "All service appointments are subject to availability. Cancellations must be made at least 24 hours before the scheduled time. No-shows may affect your booking priority.",
            },
            {
              title: "5. Rewards Program",
              body: "Points earned through the rewards program have no cash value and cannot be transferred. Toyota Valenzuela reserves the right to modify the rewards program at any time.",
            },
            {
              title: "6. Privacy",
              body: "Your personal data is collected and processed in accordance with our Privacy Policy. We do not share your information with third parties without your consent.",
            },
            {
              title: "7. Limitation of Liability",
              body: "Toyota Valenzuela shall not be liable for any indirect, incidental, or consequential damages arising from the use of this application.",
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="mb-1 text-sm font-bold">{section.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
          <p className="text-muted-foreground border-t pt-2 text-[10px]">
            Last updated: January 15, 2026
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Help Center Panel ─── */
function HelpPanel({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const faqs = [
    {
      id: "h1",
      q: "How do I book a service appointment?",
      a: "Tap the Menu button, then select 'Book a Service'. You can also ask ToyoBot to help you schedule an appointment through the Chat tab.",
    },
    {
      id: "h2",
      q: "How do I earn reward points?",
      a: "Points are earned through service visits (100pts per visit), cafe purchases (1pt per P10), event attendance (50pts), and community engagement (10pts per post).",
    },
    {
      id: "h3",
      q: "How do I redeem my points?",
      a: "Go to Menu > Rewards to see available redemption options. Select an item and tap 'Redeem'. You'll receive a voucher code in your notifications.",
    },
    {
      id: "h4",
      q: "Can I change my membership tier?",
      a: "Membership tiers are automatically upgraded based on your accumulated points. Gold: 5,000pts, Platinum: 13,000pts, Diamond: 25,000pts.",
    },
    {
      id: "h5",
      q: "How do I cancel a booking?",
      a: "Go to My Car > Service History, find the booking, and tap Cancel. Please cancel at least 24 hours before your appointment time.",
    },
    {
      id: "h6",
      q: "Is ToyoBot a real mechanic?",
      a: "ToyoBot is an AI assistant trained on Toyota service knowledge. For complex issues, ToyoBot will recommend visiting the service center for a proper diagnosis.",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Help Center" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <p className="text-muted-foreground mb-3 text-[10px] font-semibold tracking-wider uppercase">
          Frequently Asked Questions
        </p>
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-card overflow-hidden rounded-xl border"
            >
              <button
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <p className="pr-2 text-sm font-medium">{faq.q}</p>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${expanded === faq.id ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {expanded === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t px-4 py-3">
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="bg-card mt-4 rounded-xl border p-4 text-center">
          <p className="text-sm font-medium">Still need help?</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Contact our support team for assistance
          </p>
          <div className="mt-3 flex gap-2">
            <button className="bg-primary text-primary-foreground flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </button>
            <button className="bg-secondary flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium">
              <Mail className="h-3.5 w-3.5" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Contact Dealer Panel ─── */
function ContactPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Contact Dealer" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="bg-card mb-4 rounded-2xl border p-4">
          <h3 className="text-base font-bold">Toyota Valenzuela</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Authorized Toyota Dealer
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              icon: Phone,
              label: "Sales Hotline",
              value: "(02) 8123-4567",
              color: "bg-toyota-red/10 text-toyota-red",
            },
            {
              icon: Phone,
              label: "Service Center",
              value: "(02) 8123-4568",
              color: "bg-toyota-blue/10 text-toyota-blue",
            },
            {
              icon: Phone,
              label: "Parts Department",
              value: "(02) 8123-4569",
              color: "bg-toyota-amber/10 text-toyota-amber",
            },
            {
              icon: Mail,
              label: "Email",
              value: "info@toyotavalenzuela.ph",
              color: "bg-toyota-blue/10 text-toyota-blue",
            },
            {
              icon: Smartphone,
              label: "Viber / WhatsApp",
              value: "+63 917 123 4567",
              color: "bg-green-500/10 text-green-600",
            },
          ].map((item) => (
            <button
              key={item.label}
              className="bg-card hover:bg-secondary/50 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">
                  {item.label}
                </p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-card mt-4 rounded-xl border p-4">
          <p className="mb-1 text-xs font-semibold">Business Hours</p>
          <div className="space-y-1">
            {[
              { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
              { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
              { day: "Sunday", hours: "9:00 AM - 3:00 PM" },
            ].map((h) => (
              <div key={h.day} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{h.day}</span>
                <span className="font-medium">{h.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sign Out Confirmation ─── */
function SignOutPanel({ onBack }: { onBack: () => void }) {
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Sign Out" onBack={onBack} />
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <LogOut className="text-destructive h-7 w-7" />
        </div>
        <h3 className="mb-1 text-lg font-bold">Sign out?</h3>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          You&apos;ll need to sign in again to access your account and
          membership benefits.
        </p>
        {signingOut ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
            <p className="text-sm font-medium text-green-600">
              Signed out successfully
            </p>
          </motion.div>
        ) : (
          <div className="flex w-full gap-3">
            <button
              onClick={onBack}
              className="bg-card hover:bg-secondary flex-1 rounded-xl border py-3 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setSigningOut(true)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 rounded-xl py-3 text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Edit Profile Panel ─── */
function EditProfilePanel({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("Juan Dela Cruz");
  const [email, setEmail] = useState("juan.delacruz@email.com");
  const [phone, setPhone] = useState("+63 917 123 4567");
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Edit Profile" onBack={onBack} />
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        <div className="mb-6 flex flex-col items-center">
          <Avatar className="mb-3 h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              JD
            </AvatarFallback>
          </Avatar>
          <button className="text-primary text-xs font-medium">
            Change Photo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setSaved(false);
                setName(e.target.value);
              }}
              className="bg-card focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setSaved(false);
                setEmail(e.target.value);
              }}
              className="bg-card focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[11px] font-medium">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setSaved(false);
                setPhone(e.target.value);
              }}
              className="bg-card focus:ring-primary/20 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
            />
          </div>
        </div>

        <button
          onClick={() => setSaved(true)}
          className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
            saved
              ? "bg-green-500/10 text-green-600"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Profile Page ─── */
export function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>(null);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const settingSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Preferences",
      items: [
        {
          icon: darkMode ? Sun : Moon,
          label: darkMode ? "Light Mode" : "Dark Mode",
          action: toggleDark,
        },
        {
          icon: Bell,
          label: "Notifications",
          value: "On",
          action: () => setSettingsView("notifications"),
        },
        {
          icon: Globe,
          label: "Language",
          value: "English",
          action: () => setSettingsView("language"),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Shield,
          label: "Privacy & Security",
          action: () => setSettingsView("privacy"),
        },
        {
          icon: Star,
          label: "My Membership",
          badge: "Gold",
          action: () => setSettingsView("membership"),
        },
        {
          icon: FileText,
          label: "Terms of Service",
          action: () => setSettingsView("terms"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          action: () => setSettingsView("help"),
        },
        {
          icon: Phone,
          label: "Contact Dealer",
          value: "(02) 8123-4567",
          action: () => setSettingsView("contact"),
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <AnimatePresence mode="wait">
        {settingsView ? (
          <motion.div
            key={settingsView}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex min-h-0 flex-1 flex-col"
          >
            {settingsView === "notifications" && (
              <NotificationsPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "language" && (
              <LanguagePanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "privacy" && (
              <PrivacyPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "membership" && (
              <MembershipPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "terms" && (
              <TermsPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "help" && (
              <HelpPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "contact" && (
              <ContactPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "signout" && (
              <SignOutPanel onBack={() => setSettingsView(null)} />
            )}
            {settingsView === "edit-profile" && (
              <EditProfilePanel onBack={() => setSettingsView(null)} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="bg-card shrink-0 px-4 pt-4 pb-4">
              <h1 className="text-lg font-bold">Profile</h1>
              <p className="text-muted-foreground text-xs">
                Account & settings
              </p>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
              {/* Profile Card */}
              <button
                onClick={() => setSettingsView("edit-profile")}
                className="bg-card hover:bg-secondary/50 flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors"
              >
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold">Juan Dela Cruz</h2>
                  <p className="text-muted-foreground text-xs">
                    juan.delacruz@email.com
                  </p>
                  <div className="mt-1.5 flex gap-2">
                    <Badge className="text-[10px]">Gold Member</Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      Since 2023
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
              </button>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Posts", value: "24", color: "text-toyota-red" },
                  { label: "Events", value: "8", color: "text-toyota-amber" },
                  {
                    label: "Points",
                    value: "1,250",
                    color: "text-toyota-blue",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-card flex flex-col items-center rounded-xl border py-3"
                  >
                    <span className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Settings */}
              {settingSections.map((section) => (
                <div key={section.title} className="mt-5">
                  <h3 className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <div className="bg-card overflow-hidden rounded-xl border">
                    {section.items.map((item, i) => (
                      <div key={item.label}>
                        {i > 0 && <Separator />}
                        <button
                          onClick={item.action}
                          className="hover:bg-secondary/50 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
                        >
                          <item.icon className="text-muted-foreground h-4 w-4" />
                          <span className="flex-1 text-sm">{item.label}</span>
                          {item.value && (
                            <span className="text-muted-foreground text-xs">
                              {item.value}
                            </span>
                          )}
                          {item.badge && (
                            <Badge className="text-[10px]">{item.badge}</Badge>
                          )}
                          <ChevronRight className="text-muted-foreground h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Sign Out */}
              <button
                onClick={() => setSettingsView("signout")}
                className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
