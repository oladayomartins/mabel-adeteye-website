import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import AskMabel from "@/components/AskMabel";
import JsonLd from "@/components/JsonLd";
import ScrollToTop from "@/components/ScrollToTop";
import { baseGraph, brandListNode, graph } from "@/lib/schema";
import { SITE_URL, assets, person } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${person.name} — ${person.role}`,
    template: `%s | ${person.shortName}`,
  },
  description: person.summary,
  applicationName: person.name,
  authors: [{ name: person.name, url: SITE_URL }],
  creator: person.name,
  publisher: person.name,
  keywords: [
    "Mabel Adeteye Aladenusi",
    "Mabel Adeteye",
    "Mabel Aladenusi",
    "brand communications expert",
    "strategic communication",
    "brand management",
    "public relations",
    "crisis communications",
    "reputation management",
    "Forbes Communications Council",
    "CIPR",
    "NIPR",
    "PRCA",
    "Wema Bank",
    "keynote speaker",
    "communications mentorship",
    "Nigeria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: person.name,
    locale: "en_GB",
    title: `${person.name} — ${person.role}`,
    description: person.summary,
    images: [
      {
        url: assets.ogImage,
        width: 1200,
        height: 630,
        alt: `${person.name} — ${person.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: person.xHandle,
    creator: person.xHandle,
    title: `${person.name} — ${person.role}`,
    description: person.summary,
    images: [assets.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
  category: "Communications",
  other: {
    // Helps entity resolution for tools that read plain meta tags.
    "profile:first_name": "Mabel",
    "profile:last_name": "Aladenusi",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b1220",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={archivo.variable}>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {/* The loader paints first, so its GIF should be on the wire first too. */}
        <link rel="preload" as="image" href={assets.loader} fetchPriority="high" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={graph([...baseGraph, brandListNode])} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-[color:var(--color-burgundy)] focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <Loader />
        <AskMabel />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
