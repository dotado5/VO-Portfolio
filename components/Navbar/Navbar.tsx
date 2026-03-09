"use client";

import "./Navbar.css";
import Link from "next/link";
import { Repeat } from "lucide-react";
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

  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className={`${scriptFont.className} logo`}>
        <Image src={vo_logo} alt="Logo" />
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        <Link
          href="/"
          className={`nav-link ${currentPathname === "/" && "nav-link-disabled"}`}
        >
          HOME <Repeat className="nav-link-icon" /> WORKS
        </Link>
        <Link
          href="/about"
          className={`nav-link ${currentPathname === "/about" && "nav-link-disabled"}`}
        >
          About Me
        </Link>
        <Link
          href="/resume"
          className={`nav-link ${currentPathname === "/resume" && "nav-link-disabled"}`}
        >
          Resume
        </Link>
        <Link
          href="/blogs"
          className={`nav-link ${currentPathname === "/blogs" && "nav-link-disabled"}`}
        >
          Blogs
        </Link>
      </div>

      {/* CTA */}
      <Link href="/work-with-me" className="cta group">
        <span className="cta-text">Work with me</span>

        <Image src={exportIcon} alt="Export Icon" />
      </Link>
    </nav>
  );
};

export default Navbar;
