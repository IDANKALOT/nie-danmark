import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "NIE Danmark – Få dit spanske NIE-nummer nemt og hurtigt",
    template: "%s | NIE Danmark",
  },
  description:
    "Vi hjælper danskere med at ansøge om spansk NIE-nummer. Professionel assistance i samarbejde med spanske notarer og advokater. Sikker online proces for 210 EUR.",
  keywords: [
    "NIE nummer", "spansk NIE", "NIE Danmark", "ansøg NIE", "NIE Spanien",
    "spansk identifikationsnummer", "køb bolig Spanien", "flytning Spanien",
  ],
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: "NIE Danmark",
    title: "NIE Danmark – Få dit spanske NIE-nummer nemt og hurtigt",
    description: "Vi hjælper danskere med at ansøge om spansk NIE-nummer. Professionel assistance i samarbejde med spanske notarer og advokater.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "NIE Danmark",
              description: "Professionel hjælp til at få spansk NIE-nummer",
              areaServed: "DK",
              serviceType: "NIE Number Application Assistance",
              priceRange: "210 EUR",
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
