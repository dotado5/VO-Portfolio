import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import "@styles/globals.css";

export const metadata: Metadata = {
  title: "V.O Fatoki | Portfolio",
  description: "Portfolio of V.O Fatoki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-20 grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
