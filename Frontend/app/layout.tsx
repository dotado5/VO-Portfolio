import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Preloader from "@/components/Preloader/Preloader";
import "@styles/globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://vofatoki.work");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fatoki Victor Oluwabusayo || Product Designer & Business Analyst",
  description:
    "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Analyst who specializes in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Fatoki Victor Oluwabusayo || Product Designer & Business Analyst",
    description:
      "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Analyst who specializes in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
    url: siteUrl,
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
    title:
      "Fatoki Victor Oluwabusayo || Product Designer & Business Analyst",
    description:
      "Fatoki Victor Oluwabusayo is a Product (UI/UX) Designer and Business Analyst based in Lagos, Nigeria with 4+ years of experience specializing in predicting what your users want before they do and designing it beautifully.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Fatoki Victor Oluwabusayo",
        alternateName: ["VO Fatoki", "Fatoki Victor Oluwabusayo Portfolio"],
        description:
          "Portfolio of Fatoki Victor Oluwabusayo, Product (UI/UX) Designer and Business Analyst based in Lagos, Nigeria.",
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: "Fatoki Victor Oluwabusayo || Product Designer & Business Analyst",
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Fatoki Victor Oluwabusayo",
        alternateName: ["VO Fatoki", "Victor Oluwabusayo Fatoki"],
        jobTitle: "Product Designer & Business Analyst",
        url: siteUrl,
        image: `${siteUrl}/opengraph-image.png`,
        email: "mailto:fatokivictor2@gmail.com",
        description:
          "Product (UI/UX) Designer and Business Analyst based in Lagos, Nigeria with 4+ years of experience specializing in predicting what your users want before they do and designing it beautifully. So your product doesn't just look good, it sells better.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressRegion: "Lagos State",
          addressCountry: "NG",
        },
        homeLocation: {
          "@type": "Place",
          name: "Lagos, Nigeria",
        },
        areaServed: [
          {
            "@type": "Country",
            name: "Nigeria",
          },
          {
            "@type": "Place",
            name: "Worldwide / Remote",
          },
        ],
        worksFor: [
          {
            "@type": "Organization",
            name: "LAPO Microfinance Bank",
          },
        ],
        sameAs: [
          "https://www.linkedin.com/in/fatokivictoroluwabusayo/",
          "https://x.com/therealbusayor",
        ],
        knowsAbout: [
          "Product Design",
          "UI/UX Design",
          "Business Analysis",
          "Design Systems",
          "User Research",
          "Interaction Design",
          "Product Strategy",
          "Wireframing",
          "Interactive Prototyping",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Product Design and Business Analysis Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Product Design (UI/UX)",
                description:
                  "End-to-end user experience and user interface design for web and mobile products, design systems, and interactive prototypes.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Business Analysis & Product Strategy",
                description:
                  "Translating complex business processes into clear, user-centered flows, workflow mapping, and conversion optimization.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "User Research & Usability Testing",
                description:
                  "User testing, qualitative and quantitative research, and design thinking workshops to validate and iterate on product concepts.",
              },
            },
          ],
        },
      },
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
        <header className="w-full">
          <Navbar />
        </header>
        <main className="pt-20 grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
