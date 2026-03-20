"use client";

import "./Navbar.css";
import Link from "next/link";
import { Repeat, Menu, X, ArrowUpRight } from "lucide-react";
import { Dancing_Script } from "next/font/google";
import vo_logo from "@public/assets/fatoki-logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import exportIcon from "@public/assets/export-icon.png";

const scriptFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Navbar = () => {
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPathname(pathname);
    setIsMenuOpen(false); // Close menu on route change
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "HOME", href: "/", icon: true },
    { name: "About Me", href: "/about" },
    { name: "Resume", href: "/resume" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className={`${scriptFont.className} logo`}>
            <Image src={vo_logo} alt="Logo" priority />
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${currentPathname === link.href && "nav-link-disabled"}`}
              >
                {link.name}
                {link.icon && <Repeat className="nav-link-icon" />}
                {link.icon && " WORKS"}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-0">
            {/* CTA (Desktop/Tablet) */}
            <Link href="/work-with-me" className="cta group">
              <span className="cta-text">Work with me</span>
              <Image src={exportIcon} alt="Export Icon" />
            </Link>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={toggleMenu}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[999] flex flex-col lg:hidden"
          style={{ backgroundColor: "#f1f1f1" }}
        >
          {/* Overlay Header */}
          <div
            className="flex items-center justify-between w-full border-b border-gray-100 py-4 h-[65px]"
            style={{
              paddingLeft: "var(--spacing-responsive-px)",
              paddingRight: "var(--spacing-responsive-px)",
            }}
          >
            <Link
              href="/"
              className={`${scriptFont.className} logo`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Image src={vo_logo} alt="Logo" priority />
            </Link>
            <button
              className="p-2 text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <div
            className="mobile-nav-links mt-10"
            style={{
              paddingLeft: "var(--spacing-responsive-px)",
              paddingRight: "var(--spacing-responsive-px)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`mobile-nav-link ${currentPathname === link.href && "text-gray-400"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.name}</span>
                <ArrowUpRight size={24} />
              </Link>
            ))}
          </div>

          <div
            style={{
              paddingLeft: "var(--spacing-responsive-px)",
              paddingRight: "var(--spacing-responsive-px)",
            }}
          >
            <Link
              href="/work-with-me"
              className="mobile-cta mt-8"
              onClick={() => setIsMenuOpen(false)}
            >
              Work with me
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
