import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "GMaster — On-Chain AI Dungeon Master",
  description:
    "Play D&D-style adventures with an AI Dungeon Master where every dice roll, every story choice, every loot drop is permanently on-chain — impossible to cheat, impossible to save-scum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${crimson.variable} bg-[#0A0808] text-[#E8DDC0] min-h-screen paper-texture`}
      >
        <TooltipProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1A1410",
                color: "#E8DDC0",
                border: "1px solid #3A2E20",
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
