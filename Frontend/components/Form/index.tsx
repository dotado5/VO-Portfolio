"use client";

import { motion } from "motion/react";
import "./index.css";
import exportIcon from "@public/assets/export-icon.png";
import Image from "next/image";
import { useState } from "react";
import { contactService } from "@/services/contact.service";

type Status = "idle" | "sending" | "success" | "error";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setFeedback("");

    try {
      await contactService.sendMessage({ name, email, message });
      setStatus("success");
      setFeedback("Thanks! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      setStatus("error");
      setFeedback(
        error?.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            aria-label="Your Name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="sr-only">
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            aria-label="Your Email Address"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="message" className="sr-only">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Message"
          aria-label="Your Message"
          className="form-textarea"
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>
      <motion.button
        type="submit"
        className="submit-button"
        disabled={status === "sending"}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
        <Image src={exportIcon} alt="" aria-hidden="true" />
      </motion.button>
      {feedback && (
        <p
          className={`form-feedback ${
            status === "error" ? "is-error" : "is-success"
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
};

export default Form;
