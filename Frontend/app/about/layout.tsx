import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - VO Fatoki",
  description: "Learn more about Fatoki Victor Oluwabusayo, Product (UI/UX) Designer & Business Strategist.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Fatoki Victor Oluwabusayo offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fatoki Victor Oluwabusayo offers Product Design (UI/UX), User Research, interactive prototyping, wireframing, and Business/Product Strategy to help businesses build strategy-backed, conversion-optimized digital products.",
        },
      },
      {
        "@type": "Question",
        "name": "What is Victor Oluwabusayo's approach to product design?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "His design philosophy combines aesthetics with business strategy. He focuses on predicting user behaviors before they do and designing workflows so that the final product doesn't just look good, it sells better.",
        },
      },
      {
        "@type": "Question",
        "name": "How does Fatoki Victor collaborate with engineering and product teams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "He collaborates closely with product managers and developers using robust design systems, detailed interactive prototypes, and clear documentation to ensure seamless handoffs and pixel-perfect implementations.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
