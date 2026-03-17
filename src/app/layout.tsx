import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#EB0A1E",
};

export const metadata: Metadata = {
  title: "Toyota Valenzuela Community",
  description:
    "Connect with fellow Toyota owners in Valenzuela City. Events, car care, community chat, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Toyota VCH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={`${nunito.variable} antialiased`}>
        {/* Desktop: center the app in a phone-like frame */}
        <div className="bg-muted/50 flex min-h-dvh items-center justify-center">
          <div className="bg-background relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden shadow-2xl md:h-[900px] md:rounded-3xl md:border">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
