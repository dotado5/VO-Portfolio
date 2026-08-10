import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Preloader from "@/components/Preloader/Preloader";
import "@styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"),
  title: "Fatoki Victor Oluwabusayo || Product Designer & Business Strategist",
  description: "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Strategist that specialize in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
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
