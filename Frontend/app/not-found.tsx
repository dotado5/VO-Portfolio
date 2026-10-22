import Link from "next/link";
import "./not-found.css";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <ScrollReveal className="not-found-content">
        <h1 className="not-found-title">
          Looks like we<br className="hidden sm:inline" /> lost that page...
        </h1>
        <p className="not-found-subtitle">
          Visit the{" "}
          <Link href="/" className="not-found-link">
            homepage
          </Link>{" "}
          or{" "}
          <Link href="/#contact" className="not-found-link">
            contact us
          </Link>{" "}
          about the problem
        </p>
      </ScrollReveal>
    </div>
  );
}
