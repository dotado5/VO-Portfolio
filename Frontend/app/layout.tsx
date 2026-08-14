import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Preloader from "@/components/Preloader/Preloader";
import "@styles/globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fatoki Victor Oluwabusayo || Product Designer & Business Strategist",
  description: "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Strategist that specialize in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
  openGraph: {
    title: "Fatoki Victor Oluwabusayo || Product Designer & Business Strategist",
    description: "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Strategist that specialize in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
    url: "./",
    siteName: "Fatoki Victor Oluwabusayo Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Fatoki Victor Oluwabusayo Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fatoki Victor Oluwabusayo || Product Designer & Business Strategist",
    description: "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Strategist that specialize in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Preloader />
        <Navbar />
        <main className="pt-20 grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
