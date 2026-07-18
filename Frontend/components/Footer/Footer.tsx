"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const { CONTACT_RECIPIENT } = process.env;
  const email = CONTACT_RECIPIENT || "fatokivictor2@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <a href={`mailto:${email}`} className="email-text">
          {email}
        </a>
        <button
          onClick={handleCopy}
          className="copy-button"
          title="Copy email to clipboard"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <div className="footer-right">
        <p className="copyright-text">
          ©{new Date().getFullYear()} Fatoki Victor Oluwabusayo — All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
