import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { StoreProvider } from "@/components/StoreProvider";
import { MetaPixel } from "@/components/MetaPixel";
import { LOGO } from "@/lib/constants";
import "./globals.css";

const display = Fraunces({
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cairo = Cairo({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maripossa.vercel.app"),
  title: "Maripossa · Pizzeria & Fast-Food · Zarzis",
  description:
    "Maripossa — Pizzeria & Fast-Food à Zarzis. Pâte fraîche, fromage fondant, ingrédients généreux. Commandez en quelques clics sur WhatsApp.",
  icons: { icon: LOGO, apple: LOGO },
  openGraph: {
    title: "Maripossa · Pizzeria & Fast-Food · Zarzis",
    description: "Des tranches qui donnent des ailes. Commandez sur WhatsApp.",
    images: [LOGO],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${cairo.variable} font-sans text-ink antialiased`}
      >
        <MetaPixel />
        <StoreProvider>{children}</StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
