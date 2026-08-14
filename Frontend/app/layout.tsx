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
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Fatoki Victor Oluwabusayo",
    "jobTitle": "Product Designer & Business Strategist",
    "url": siteUrl,
    "sameAs": [
      "https://www.linkedin.com/in/fatokivictoroluwabusayo/",
      "https://x.com/therealbusayor",
      "http://vofatoki.work/",
    ],
  };

  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <Navbar />
        <main className="pt-20 grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
